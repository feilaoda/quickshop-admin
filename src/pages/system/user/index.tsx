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

import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import {
  Form,
  FormItem,
  FormLayout,
  Input,
  Select,
  Cascader,
  DatePicker,
  Submit,
  FormGrid,
  Upload,
  ArrayItems,
  Editable,
  FormButtonGroup,
} from '@formily/antd';
import { action } from '@formily/reactive';

import createUser from './createUser';

const valueEnum = {
  0: '0',
  1: '1',
};

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
  1: { text: '正常', status: '1' },
  0: { text: '禁用', status: '0' },
};
const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某'];
const roles = ['管理员', '部门经理', '大区经理', '业务员', '运维'];
const departments = ['总部', '市场部门', '销售部门', '财务部', '运维部'];

// for (let i = 0; i < 50; i += 1) {
//   tableListDataSource.push({
//     key: i,
//     account: 'AppName'+i,
//     name: creators[Math.floor(Math.random() * creators.length)],
//     roles: roles[Math.floor(Math.random() * roles.length)],
//     department: departments[Math.floor(Math.random() * departments.length)],
//     status: valueEnum[Math.floor(Math.random() * 10) % 2],
//     createdAt: Date.now() - Math.floor(Math.random() * 2000),
//     phone: (Math.ceil(Math.random() * 100) + 1),
//   });
// }

const handleGetUsers = async (params: any) => {
  // const hide = message.loading('正在添加');
  try {
    return await shopapi.UserApi.getUsers(params);
  } catch (error) {
    return false;
  }
};

function filterUsers(data: any[]) {
  // data.forEach(e => {
  //   if(e.department !== undefined && e.department !== null && e.department.name !== undefined) {
  //     e['department.name'] = e.department.name
  //   }
  // })
  convertData(data, 'department.name');
  convertData(data, 'roles.name');
  console.log('data:', data);
  return data;
}

const handleGetUsers2 = async () => {
  try {
    const res = false; //await shopapi.userApi;
    if (res != false) {
      return res.data;
    } else {
      message.error('获取数据失败');
      return false;
    }
  } catch (error) {
    message.error('获取数据失败');
    return false;
  }
};

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
    dataIndex: 'department.name',
    width: 150,
  },
  {
    title: '角色',
    dataIndex: 'roles.name',
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
    // renderFormItem: (_, { value }) => [
    //   <a
    //     key="link"
    //     onClick={() => {
    //       history.push('/system/user/createOrEdit?id=' + value.id);
    //     }}
    //   >
    //     编辑
    //   </a>,
    //   <a key="link2">删除</a>,
    // ],
    render: (_, row) => [
      <Link key={row.id} to={'/system/user/createOrEdit/' + row.id}>
        编辑
      </Link>,
      <a key="link2">删除</a>,
    ],
  },
];

const form = createForm({
  validateFirst: true,
});

export default () => {
  const history = useHistory();

  useEffect(() => {}, []);

  return (
    <PageContainer title={false}>
      <ProTable<TableListItem>
        columns={columns}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const res = await handleGetUsers(params);
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
