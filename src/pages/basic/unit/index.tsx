// import React from 'react';
import { Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { convertData } from '@/utils/convert';

import QuickTable from '@/components/QuickTable';
import type { QuickColumns } from '@/components/QuickTable';
import shopapi from '@/services/shopapi';

import { StatusEnum } from '@/pages/enum';

const module = 'basic';
const resource = 'unit';

export type TableListItem = {
  id: string;
  name: string;
};

const handleDeleteData = (id: any) => {
  console.log('delete data', id);
};

function filterData(data: any[]) {
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
    title: '编码',
    dataIndex: 'code',
    width: 200,
    search: false,
  },
  {
    title: '单位类型',
    dataIndex: 'unitType',
    valueEnum: {
      1: { text: '数量', status: 1 },
      2: { text: '重量', status: 2 },
      3: { text: '体积', status: 3 },
      4: { text: '长度', status: 4 },
      5: { text: '时间', status: 5 },
    },
    width: 200,
  },
  {
    title: '是否基本单位',
    dataIndex: 'isBaseUnit',
    valueEnum: {
      1: { text: '是', status: 1 },
      0: { text: '否', status: 0 },
    },
    width: 200,
  },
  {
    title: '单位换算率',
    dataIndex: 'baseUnitRate',
    width: 200,
    search: false,
  },
  {
    title: '舍入类型',
    dataIndex: 'roundType',
    width: 200,
    search: false,
    hideInTable: true,
  },
  {
    title: '精度',
    dataIndex: 'precisions',
    width: 150,
    search: false,
    hideInTable: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: StatusEnum,
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
