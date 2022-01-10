import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'umi';

import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { convertData } from '@/utils/convert';
import shopapi from '@/services/shopapi';

import QuickTable, { QuickColumns } from '@/components/QuickTable';
import { fetchEnumResources } from '@/services/shopapi/resource';

export type TableListItem = {
  id: string;
  account: string;
  name: string;
  department: string;
  roles: string;
  phone: string;
  createdAt: number;
  status: string;
};

const StatusEnum = {
  1: { text: '正常', status: 1 },
  0: { text: '禁用', status: 0 },
};

const module = 'system';
const resource = 'sysDepartment';

const handleGetResources = (params: any) => {
  return shopapi.ResourceApi.getResources(module, resource, params);
};

const handleDeleteResource = (id: any) => {
  console.log('delete department', id);
};

function filterResources(data: any[]) {
  convertData(data, 'parent.name');
  // convertData(data, 'roles.name');
  console.log('data:', data);
  return data;
}

const columns: QuickColumns<TableListItem>[] = [
  {
    title: '名称',
    dataIndex: 'name',
    searchType: 'like',
    width: 200,
  },

  // {
  //   title: '上级部门',
  //   dataIndex: 'parentId',
  //   width: 200,
  //   search: false,
  //   hideInTable: true,
  //   request: (params) => {
  //     console.log('department', params);
  //     return fetchEnumResources(module, resource);
  //   },
  // },
  {
    title: '上级部门',
    dataIndex: 'parent.name',
    search: false,
    width: 200,
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
        title="部门列表"
        columns={columns}
        afterQuery={filterResources}
      />
    </PageContainer>
  );
};
