// import React from 'react';
import { Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { convertData } from '@/utils/convert';
import { getDepartments, getRoles } from './api';

import QuickTable from '@/components/QuickTable';
import type { QuickColumns } from '@/components/QuickTable';
import shopapi from '@/services/shopapi';

const module = 'system';
const resource = 'sysUser';

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

// const handleGetUsers = (params: any) => {
//   return shopapi.ResourceApi.getResources('system/sysUser', params);
//   // const hide = message.loading('正在添加');
//   // try {
//   //   return getUsers(params); // shopapi.UserApi.getUsers(params);
//   // } catch (error) {
//   //   return false;
//   // }
// };

// const handleGetUsers2 = async (params: any) => {
//   // const hide = message.loading('正在添加');
//   try {
//     return getUsers(params); // shopapi.UserApi.getUsers(params);
//   } catch (error) {
//     return false;
//   }
// };

const handleDeleteUser = (id: any) => {
  console.log('delete user', id);
};

function filterUsers(data: any[]) {
  convertData(data, 'department.name');
  convertData(data, 'roles.name');
  return data;
}

// const schema: any = [
//   {
//     name: 'account',
//     title: '账号',
//     width: 120,
//   },
//   {
//     name: 'name',
//     title: '姓名',
//     width: 200,
//     searchOp: 'LIKE',
//   },
//   {
//     name: 'departmentId',
//     title: '部门',
//     width: 150,
//     hideInTable: true,
//     api: 'getResources,departments',
//   },
//   {
//     name: 'department.name',
//     title: '部门',
//     width: 150,
//     search: false,
//   },
//   {
//     name: 'roles.name',
//     title: '角色',
//     width: 200,
//     search: false,
//   },
//   {
//     name: 'phone',
//     title: '电话',
//   },
//   {
//     name: 'createdAt',
//     title: '创建时间',
//   },
//   {
//     name: 'status',
//     title: '状态',
//     type: 'select',
//     source: StatusEnum,
//   },
//   {
//     title: '操作',
//     type: 'option',
//   },
// ];

const columns: QuickColumns<TableListItem>[] = [
  {
    title: '账号',
    dataIndex: 'account',
    width: 120,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    searchType: 'like',
    width: 200,
  },
  {
    title: '部门',
    dataIndex: 'department.id',
    width: 150,
    hideInTable: true,
    request: () => {
      return getDepartments();
    },
  },
  {
    title: '部门',
    dataIndex: 'department.name',
    width: 150,
    search: false,
  },
  {
    title: '角色',
    dataIndex: 'roles.id',
    hideInTable: true,
    request: () => {
      return getRoles();
    },
  },
  {
    title: '角色',
    dataIndex: 'roles.name',
    search: false,
    // searchType: 'like',
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

    // render: (text) => (
    //   <Tooltip placement="leftTop" title={text}>
    //     {text}
    //   </Tooltip>
    // ),
  },
  {
    title: '电话',
    dataIndex: 'phone',
    search: false,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    search: false,
  },
  {
    title: '状态',
    dataIndex: 'status',
    // onFilter: true,
    valueEnum: StatusEnum,
    search: false,
  },
  {
    title: '操作',
    width: 180,
    key: 'option',
    valueType: 'option',
    render: (_, row) => [
      <Link key={'edit' + row.id} to={'/system/sysUser/createOrEdit/' + row.id}>
        编辑
      </Link>,
      <a key={row.id} onClick={() => handleDeleteUser(row.id)}>
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
        title="用户列表"
        columns={columns}
        afterQuery={filterUsers}
      />
    </PageContainer>
  );
};
