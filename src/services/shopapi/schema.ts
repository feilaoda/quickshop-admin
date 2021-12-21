import { request } from 'umi';

/** createModel POST /v1/model/entity/create/${param0} */
export async function getTableColumns(
  params: {
    // path
    /** projectId */
    model: string;
  },
  body: API.ModelEntityDTO,
  options?: { [key: string]: any },
) {
  const { model: param0, ...queryParams } = params;
  return request<API.ResultModelEntityDTO>(`/v1/model/entity/create/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

