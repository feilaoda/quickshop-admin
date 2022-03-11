import { deleteEnumData } from '@/utils/convert';
import { request } from 'umi';
import { action } from '@formily/reactive';

export async function getResource(
  module: string,
  resource: string,
  id: string,
  options?: { [key: string]: any },
) {
  console.log('POST /api/v1/' + module + '/' + resource + '/get/' + id);
  return request<API.ResultEntity>('/api/v1/' + module + '/' + resource + '/get/' + id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function getResources(
  module: string,
  resource: string,
  params?: {
    current?: string;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  console.log('POST /api/v1/' + module + '/' + resource + '/query');
  const page = {
    current: params?.current,
    pageSize: params?.pageSize,
  };
  delete params?.current;
  delete params?.pageSize;
  const data = {
    filter: params,
    page: page,
  };
  return request<API.ResultEntity>('/api/v1/' + module + '/' + resource + '/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // params: page,
    data: data,
    ...(options || {}),
  });
}

export async function createOrSave(
  module: string,
  resource: string,
  body?: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<API.ResultEntity>('/api/v1/' + module + '/' + resource + '/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

const transformData = (data = [], key?: string) => {
  const name = key ? key : 'name';
  return data.reduce((buf, value: any) => {
    return buf.concat({
      label: value[name],
      value: value.id,
    });
  }, []);
};

export async function fetchResource(module: string, resource: string, id: string) {
  return getResource(module, resource, id)
    .then((res) => {
      console.log('get role', res);
      if (res != undefined) {
        if (res.code === 0) {
          return res.data;
        } else {
          return false;
        }
      }
      return false;
    })
    .catch(() => false);
}

export async function fetchResources(
  module: string,
  resource: string,
  params?: Record<string, any>,
) {
  const newParams = params || {};
  return getResources(module, resource, { ...newParams, pageSize: 10000 })
    .then((res) => {
      if (res.code == 0) {
        return res.data;
      } else {
        return [];
      }
    })
    .catch(() => false);
}

export function fetchSelectResources(module: string, resource: string) {
  return fetchEnumResources(module, resource, '', {});
}

export function fetchEnumResources(
  module: string,
  resource: string,
  id?: string,
  params?: Record<string, any>,
) {
  const newParams = params || {};
  return getResources(module, resource, { pageSize: 10000, ...newParams })
    .then((res) => {
      if (res.code == 0) {
        return res.data;
      } else {
        return [];
      }
    })
    .then((data) => {
      const res = transformData(data);
      if (id !== undefined) {
        return deleteEnumData(res, id);
      } else {
        return res;
      }
    })
    .catch(() => {
      return [];
    });
}

export function fetchFieldResources(
  field: any,
  module: string,
  resource: string,
  id?: string,
  params?: Record<string, any>,
) {
  return fetchEnumResources(module, resource, id, params).then(
    action.bound((data) => {
      field.dataSource = data;
      field.loading = false;
    }),
  );
}
