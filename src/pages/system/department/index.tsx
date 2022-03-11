import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'umi';

import { PageContainer } from '@ant-design/pro-layout';
import { convertData } from '@/utils/convert';
import shopapi from '@/services/shopapi';

import QuickTable from '@/components/QuickTable';
import type { QuickColumns } from '@/components/QuickTable';

export type TableListItem = {
  id: string;
  name: string;
  parent: string;
};

const module = 'system';
const resource = 'sysDepartment';

const handleDeleteResource = (id: any) => {
  console.log('delete department', id);
};

function filterResources(data: any[]) {
  convertData(data, 'parent.name');
  return data;
}

const columns: QuickColumns<TableListItem>[] = [
  {
    title: '名称',
    dataIndex: 'name',
    searchType: 'like',
    width: 200,
  },
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
      <Link key={'edit' + row.id} to={'/' + module + '/' + resource + '/createOrEdit/' + row.id}>
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
        deepQuery={true}
        title="部门列表"
        columns={columns}
        afterQuery={filterResources}
      />
    </PageContainer>
  );
};
