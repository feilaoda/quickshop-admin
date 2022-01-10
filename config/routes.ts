export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //     {
  //       path: '/admin/sub-page2',
  //       name: 'sub-page2',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //     {
  //       component: './404',
  //     },
  //   ],
  // },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  {
    name: '系统管理',
    path: '/system',
    routes: [
      {
        name: '用户管理',
        path: '/system/sysUser',
        component: './system/user',
      },

      {
        name: '角色管理',
        path: '/system/sysRole',
        component: './system/role',
      },
      {
        name: '部门管理',
        path: '/system/sysDepartment',
        component: './system/department',
      },
      {
        name: '权限管理',
        path: '/system/sysPermission',
        component: './system/permission',
      },
      {
        name: '创建用户',
        path: '/system/sysUser/createOrEdit',
        hideInMenu: true,
        component: './system/user/createUser',
      },
      {
        name: '创建用户',
        path: '/system/sysUser/createOrEdit/:userId',
        hideInMenu: true,
        component: './system/user/createUser',
      },
      {
        name: '创建角色',
        path: '/system/sysRole/createOrEdit',
        hideInMenu: true,
        component: './system/role/create',
      },
      {
        name: '编辑角色',
        path: '/system/sysRole/createOrEdit/:id',
        hideInMenu: true,
        component: './system/role/create',
      },
      {
        name: '创建部门',
        path: '/system/sysDepartment/createOrEdit',
        hideInMenu: true,
        component: './system/department/create',
      },
      {
        name: '编辑部门',
        path: '/system/sysDepartment/createOrEdit/:id',
        hideInMenu: true,
        component: './system/department/create',
      },
      {
        name: '创建权限',
        path: '/system/sysPermission/createOrEdit',
        hideInMenu: true,
        component: './system/permission/create',
      },
      {
        name: '编辑权限',
        path: '/system/sysPermission/createOrEdit/:id',
        hideInMenu: true,
        component: './system/permission/create',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
