import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'umi';

import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { convertData, intConvertToString, operationToString } from '@/utils/convert';
import shopapi from '@/services/shopapi';

import QuickTable, { QuickColumns } from '@/components/QuickTable';

export type TableListItem = {
  id: string;
  name: string;
  resource: string;
  operation: number;
};

const module = 'system';
const resource = 'sysPermission';
export const Permissions = [
  { id: 1, name: '可读' },
  { id: 2, name: '可写' },
  { id: 4, name: '可删除' },
  { id: 255, name: '全部' },
];

const handleGetResources = (params: any) => {
  return shopapi.ResourceApi.getResources(module, resource, params);
};

const handleDeleteResource = (id: any) => {
  console.log('delete department', id);
};

function filterResources(data: any[]) {
  // convertData(data, 'department.name');
  // convertData(data, 'roles.name');

  console.log('data:', data);
  return data;
}

const data: any = [
  {
    name: 'name',
    title: '名称',
    searchType: 'like',
    width: 200,
  },
  {
    name: 'operation',
    title: '权限',
    width: 200,
  },
  {
    title: '操作',
    width: 180,
    valueType: 'option',
  },
];

const columns: QuickColumns<TableListItem>[] = [
  {
    title: '名称',
    dataIndex: 'name',
    searchType: 'like',
    width: 200,
  },
  {
    title: '资源',
    dataIndex: 'resource',
    search: false,
    width: 200,
  },
  {
    title: '权限',
    dataIndex: 'operation',
    search: false,
    width: 200,
    render: (_, row) => <div>{intConvertToString(Permissions, row.operation)}</div>,
  },
  {
    title: '操作',
    width: 180,
    key: 'option',
    valueType: 'option',
    render: (_, row) => [
      <Link key={row.id} to={'/' + module + '/' + resource + '/createOrEdit/' + row.id}>
        编辑
      </Link>,
      <a key={row.id} onClick={() => handleDeleteResource(row.id)}>
        删除
      </a>,
    ],
  },
];

export default () => {
  useEffect(() => {}, []);

  return (
    <PageContainer title={false}>
      <QuickTable
        module={module}
        resource={resource}
        title="权限列表"
        columns={columns}
        afterQuery={filterResources}
      />
    </PageContainer>
  );
};
