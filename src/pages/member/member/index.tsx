// import React from 'react';
import { Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { convertData } from '@/utils/convert';
import { Image, Switch } from 'antd';
import QuickTable from '@/components/QuickTable';
import type { QuickColumns } from '@/components/QuickTable';
import shopapi from '@/services/shopapi';

import { StatusEnum } from '@/pages/enum';

const module = 'member';
const resource = 'member';

export type TableListItem = {
  id: string;
  name: string;
  status: number;
};

const handleDeleteData = (id: any) => {
  console.log('delete data', id);
};

function filterData(data: any[]) {
  convertData(data, 'attributeType.name');
  console.log('attr type', data);
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
    title: '手机号码',
    dataIndex: 'mobile',
    width: 200,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    width: 200,
    render: (text) => <Image width={80} max-height={80} src={text || ''} />,
    search: false,
  },
  {
    title: '微信昵称',
    dataIndex: 'wechatNickname',
    width: 200,
    search: false,
  },
  {
    title: 'OpenId',
    dataIndex: 'wechatOpenid',
    width: 200,
    search: false,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 200,
    valueEnum: {
      1: { text: '正常', status: 1 },
      0: { text: '禁用', status: 0 },
    },
    render: (text, row) => (
      <Switch defaultChecked={row.status === 1 ? true : false} disabled={true} />
    ),
  },
  {
    title: '登录时间',
    dataIndex: 'lastLoginTime',
    width: 200,
    search: false,
  },
  {
    title: '注册时间',
    dataIndex: 'createdAt',
    width: 200,
    search: false,
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
        title="会员列表"
        columns={columns}
        addable={false}
        afterQuery={filterData}
      />
    </PageContainer>
  );
};
