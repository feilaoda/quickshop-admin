import { request } from 'umi';

/** createModel POST /v1/model/entity/create/${param0} */
export async function getDepartments(
  params?: {
    // path
    /** projectId */
    current?: string;
    pageSize?: string;
  },
  body?: { [key: string]: any },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.ResultEntity>(`/api/v1/system/sysDepartment/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: params,
    data: body,
    ...(options || {}),
  });
}
