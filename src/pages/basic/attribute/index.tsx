// import React from 'react';
import { Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { convertData } from '@/utils/convert';

import QuickTable from '@/components/QuickTable';
import type { QuickColumns } from '@/components/QuickTable';
import shopapi from '@/services/shopapi';

import { StatusEnum } from '@/pages/enum';

const module = 'basic';
const resource = 'attribute';

export type TableListItem = {
  id: string;
  name: string;
};

const handleDeleteData = (id: any) => {
  console.log('delete data', id);
};

function filterData(data: any[]) {
  convertData(data, 'attributeType.name');
  console.log('attr type', data);
  return data;
}
function fetchAttributeTypes() {
  return shopapi.ResourceApi.fetchEnumResources('basic', 'attributeType', '', {});
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
    title: '属性类型',
    dataIndex: 'attributeTypeId',
    width: 200,
    hideInTable: true,
    request: () => {
      return fetchAttributeTypes();
    },
  },
  {
    title: '属性类型',
    dataIndex: 'attributeType.name',
    width: 200,
    search: false,
  },
  {
    title: '组件类型',
    dataIndex: 'componentType',
    valueEnum: {
      1: { text: '单行文本', status: 1 },
      2: { text: '多行文本', status: 2 },
      3: { text: '下拉框', status: 3 },
      4: { text: '数字输入框', status: 4 },
      5: { text: '日期时间', status: 5 },
    },
    width: 200,
  },
  {
    title: '只读',
    dataIndex: 'isReadonly',
    width: 200,
    search: false,
    valueEnum: {
      1: { text: '是', status: 1 },
      0: { text: '否', status: 0 },
    },
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
