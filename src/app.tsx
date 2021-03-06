import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import type { RequestConfig } from 'umi';
import { message, notification } from 'antd';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    // childrenRender: (children) => {
    //   if (initialState.loading) return <PageLoading />;
    //   return children;
    // },
    ...initialState?.settings,
  };
};

const tokenMiddleware = async (ctx: Context, next: () => void) => {
  console.log('request1', ctx);
  const token = localStorage.getItem('token');
  if (token !== '') {
    ctx.req.options.headers.Authorization = 'Bearer ' + token || '';
  }
  await next();
  console.log('response1');
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
let expireTimeout: NodeJS.Timeout;

function loginExpire() {
  notification.error({
    message: '未登录或登录已过期，请重新登录。',
  });
  // @HACK
  /* eslint-disable no-underscore-dangle */
  if (window.g_app) {
    window.g_app._store.dispatch({
      type: 'login/loginExpire',
    });
    return;
  } else {
    history.push(loginPath);
  }
}

/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  const { response = {} } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url, body } = response;
  console.log('errorhandler', error, url, response, body, JSON.stringify(body.text));
  if (status === 504) {
    notification.error({
      // title: '错误',
      message: `网络错误`,
      description: `Gateway Timeout`,
      duration: 2,
    });
    return;
  }

  if (status === 401 && history.location.pathname !== loginPath) {
    // 防抖
    if (expireTimeout) {
      clearTimeout(expireTimeout);
    }
    expireTimeout = setTimeout(() => {
      loginExpire();
    }, 100);

    return;
  }

  // console.log('response', response);

  response.json().then((res) => {
    console.log('res', res);
    notification.error({
      // title: '错误',
      message: `请求错误`,
      description: `${res.message}`,
      duration: 2,
    });
  });
  // const bodyText = await response.json();
  // message.error(`请求错误，请联系系统管理员`);

  // environment should not be used
  // if (status === 403) {
  //   history.push('/exception/403');
  //   return;
  // }
  // if (status <= 504 && status >= 500) {
  //   history.push('/exception/500');
  //   return;
  // }
  // if (status >= 404 && status < 422) {
  //   history.push('/exception/404');
  // }
};

export const request: RequestConfig = {
  timeout: 2000,
  // errorConfig: {},
  errorHandler: errorHandler,
  middlewares: [tokenMiddleware],
  requestInterceptors: [],
  responseInterceptors: [],
};
