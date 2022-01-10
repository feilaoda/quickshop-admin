import { request } from 'umi';

export async function getResource(
  module: string,
  resource: string,
  id: string,
  options?: { [key: string]: any },
) {
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
  body?: { [key: string]: any },
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
    args: params,
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
  return request<API.ResultEntity>('/api/v1/' + module + '/' + resource + '/createOrSave', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

const transformData = (data = []) => {
  return data.reduce((buf, value: any) => {
    return buf.concat({
      label: value.name,
      value: value.id,
    });
  }, []);
};

export function fetchEnumResources(module: string, resource: string) {
  return getResources(module, resource, { pageSize: 500 })
    .then((res) => {
      if (res.code == 0) {
        return res.data;
      } else {
        return [];
      }
    })
    .then((data) => {
      return transformData(data);
    });
}
