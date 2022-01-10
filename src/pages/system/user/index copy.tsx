import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'umi';
import { message, Button, Tooltip, Dropdown, Menu, Modal } from 'antd';
import {
  EllipsisOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { convertData } from '@/utils/convert';
import shopapi from '@/services/shopapi';
import { getDepartments } from './api';

import { getUsers } from '@/services/ant-design-pro/api';

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
const tableListDataSource: TableListItem[] = [];

const StatusEnum = {
  1: { text: '正常', status: 1 },
  0: { text: '禁用', status: 0 },
};

const handleGetUsers = async (params: any) => {
  // const hide = message.loading('正在添加');
  try {
    return getUsers(params); // shopapi.UserApi.getUsers(params);
  } catch (error) {
    return false;
  }
};

const handleDeleteUser = (id: any) => {
  console.log('delete user', id);
};

function filterUsers(data: any[]) {
  convertData(data, 'department.name');
  convertData(data, 'roles.name');
  console.log('data:', data);
  return data;
}

const columns: ProColumns<TableListItem>[] = [
  {
    title: '账号',
    dataIndex: 'account',
    width: 120,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '部门',
    dataIndex: 'departmentId',
    width: 150,
    hideInTable: true,
    request: (params, props) => {
      console.log('department', params);
      return getDepartments();
    },
  },
  {
    title: '部门',
    dataIndex: 'department.name',
    width: 150,
    hideInSearch: true,
  },
  {
    title: '角色',
    dataIndex: 'roles.name',
    hideInSearch: true,
    width: 200,
  },
  {
    title: '电话',
    dataIndex: 'phone',
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    search: false,
  },
  {
    title: '状态',
    dataIndex: 'status',
    onFilter: true,
    valueEnum: StatusEnum,
  },
  {
    title: '操作',
    width: 180,
    key: 'option',
    valueType: 'option',
    render: (_, row) => [
      <Link key={row.id} to={'/system/user/createOrEdit/' + row.id}>
        编辑
      </Link>,
      <a key={row.id} onClick={() => handleDeleteUser(row.id)}>
        删除
      </a>,
    ],
  },
];

export default () => {
  const history = useHistory();

  useEffect(() => {}, []);

  return (
    <PageContainer title={false}>
      <Link to="/system/user/demo?id=1">Demo</Link>
      <ProTable<TableListItem>
        columns={columns}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const res = await handleGetUsers(params);
          console.log('get users', res);
          let dataSource = [];
          if (res != false) {
            const data = filterUsers(res.data);
            dataSource = data;
          }
          // .then(res => {
          //   if(res != false) {
          //     tableListDataSource
          //   }
          // })
          console.log(params, sorter, filter);
          return Promise.resolve({
            data: dataSource,
            success: true,
            total: res.page?.total,
          });
        }}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        search={{
          layout: 'vertical',
          defaultCollapsed: false,
        }}
        dateFormatter="string"
        toolbar={{
          title: '用户列表',
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              history.push('/system/user/createOrEdit');
            }}
          >
            新建
          </Button>,
        ]}
      />
    </PageContainer>
  );
};
