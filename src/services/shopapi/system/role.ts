import { request } from 'umi';

/** createModel POST /v1/model/entity/create/${param0} */
export async function getRoles(
  params?: {
    // path
    /** projectId */
    _pageIndex?: string;
    _pageSize?: string;
  },
  body?: { [key: string]: any },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.ResultEntity>(`/v1/system/sysRole/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { _pageSize: 1000, ...params },
    data: body,
    ...(options || {}),
  });
}