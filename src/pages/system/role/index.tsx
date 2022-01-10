import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'umi';

import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { convertData } from '@/utils/convert';
import shopapi from '@/services/shopapi';
import { getDepartments } from './api';

import { getUsers } from '@/services/ant-design-pro/api';

import QuickTable, { QuickColumns } from '@/components/QuickTable';

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

const module = 'system';
const resource = 'sysRole';

const handleDeleteResource = (id: any) => {
  console.log('delete user', id);
};

function filterResources(data: any[]) {
  convertData(data, 'permissions.name');
  console.log('data:', data);
  return data;
}

const columns: QuickColumns<TableListItem>[] = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 200,
    searchType: 'like',
  },
  {
    title: '权限',
    dataIndex: 'permissions.name',
    hideInSearch: true,
    width: 200,
    onCell: () => {
      return {
        style: {
          maxWidth: 200,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
        },
      };
    },
  },
  {
    title: '操作',
    width: 180,
    key: 'option',
    valueType: 'option',
    render: (_, row) => [
      <Link key={row.id} to={'/system/sysRole/createOrEdit/' + row.id}>
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
        title="角色列表"
        columns={columns}
        afterQuery={filterResources}
      />
    </PageContainer>
  );
};
