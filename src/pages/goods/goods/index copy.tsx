// import React from 'react';
import { Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { convertData } from '@/utils/convert';

import QuickTable from '@/components/QuickTable';
import type { QuickColumns } from '@/components/QuickTable';
import shopapi from '@/services/shopapi';

const module = 'goods';
const resource = 'goodsCategory';

export type TableListItem = {
  id: string;
  name: string;
  icon: string;
  sort: number;
  parent: string;
  remark: string;
};

const handleDeleteData = (id: any) => {
  console.log('delete data', id);
};

function filterData(data: any[]) {
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
  // {

  {
    title: '父级类别',
    dataIndex: 'parent.name',
    search: false,
    width: 150,
    // hideInTable: true,
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 150,
    search: false,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    search: false,
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
      <a key={row.id} onClick={() => handleDeleteData(row.id)}>
        删除
      </a>,
    ],
  },
];

export default () => {
  return (
    <PageContainer title={false}>
      <QuickTable
        module={module}
        resource={resource}
        deepQuery={true}
        title="类别列表"
        columns={columns}
        afterQuery={filterData}
      />
    </PageContainer>
  );
};
