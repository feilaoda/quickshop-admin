import { request } from 'umi';

/** createModel POST /v1/model/entity/create/${param0} */
export async function getUsers(
  params?: {
    // path
    /** projectId */
    _pageIndex?: string;
    _pageSize?: string;
  },
  body?: { [key: string]: any },
  options?: { [key: string]: any },
) {
  console.log('POST /api/v1/system/sysUser/query');
  const { ...queryParams } = params;
  return request<API.ResultEntity>(`/api/v1/system/sysUser/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: params,
    data: body,
    ...(options || {}),
  });
}

export async function getUser(id: string, options?: { [key: string]: any }) {
  return request<API.ResultEntity>(`/api/v1/system/sysUser/get/` + id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // data: body,
    ...(options || {}),
  });
}

export async function createOrSaveUser(
  body?: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<API.ResultEntity>(`/api/v1/system/sysUser/createOrSave`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
