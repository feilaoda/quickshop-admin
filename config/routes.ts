export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //     {
  //       path: '/admin/sub-page2',
  //       name: 'sub-page2',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //     {
  //       component: './404',
  //     },
  //   ],
  // },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  {
    name: '系统',
    path: '/system',
    routes: [
      {
        name: '用户',
        path: '/system/user',
        component: './system/user',
      },
      // {
      //   name: 'role',
      //   path: '/system/role',
      //   component: './Welcome',
      // },
      // {
      //   name: 'department',
      //   path: '/system/department',
      //   component: './Welcome',
      // },
      // {
      //   name: 'permission',
      //   path: '/system/permission',
      //   component: './Welcome',
      // },
      {
        name: '创建用户',
        path: '/system/user/createOrEdit',
        hideInMenu: true,
        component: './system/user/createUser',
      },
      {
        name: '创建用户',
        path: '/system/user/createOrEdit/:userId',
        hideInMenu: true,
        component: './system/user/createUser',
      },
      // {
      //   name: 'system3',
      //   path: '/system/user/create3',
      //   hideInMenu: true,
      //   component: './system/user/createUser',
      // },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
