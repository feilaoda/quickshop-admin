// import React from 'react';
import { Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { convertData } from '@/utils/convert';

import QuickTable from '@/components/QuickTable';
import type { QuickColumns } from '@/components/QuickTable';
import shopapi from '@/services/shopapi';

import { StatusEnum } from '@/pages/enum';

const module = 'basic';
const resource = 'attributeValue';

export type TableListItem = {
  id: string;
  name: string;
};

const handleDeleteData = (id: any) => {
  console.log('delete data', id);
};

function filterData(data: any[]) {
  convertData(data, 'attributeValueGroup.name');
  convertData(data, 'attribute.name');
  return data;
}

function fetchAttributes() {
  return shopapi.ResourceApi.fetchEnumResources('basic', 'attribute', '', {});
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
    title: '属性',
    dataIndex: 'attribute.name',
    width: 200,
    hideInSearch: true,
  },
  {
    title: '属性',
    dataIndex: 'attribute.id',
    width: 200,
    hideInTable: true,
    request: () => {
      return fetchAttributes();
    },
  },
  {
    title: '属性组',
    dataIndex: 'attributeValueGroup.name',
    width: 200,
    hideInSearch: true,
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
