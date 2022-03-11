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
    name: 'Dashboard',
    // icon: 'smile',
    component: './Welcome',
  },

  {
    name: '商城中心',
    path: '/shop',
    routes: [
      {
        name: '店铺管理',
        path: '/shop/store',
        component: './shop/store',
      },
      {
        name: '会员管理',
        path: '/shop/member',
        component: './member/member',
      },
      {
        name: '商品管理',
        path: '/shop/goods/goods',
        component: './goods/goods',
      },
      {
        name: '商品类别',
        path: '/shop/goods/goodsCategory',
        component: './goods/goodsCategory',
      },
      {
        name: '编辑商品类别',
        hideInMenu: true,
        path: '/goods/goodsCategory/createOrEdit',
        component: './goods/goodsCategory/create',
      },
      {
        name: '订单管理',
        path: '/shop/order',
        component: './shop/order',
      },
      {
        name: '购物车',
        path: '/shop/cart',
        component: './shop/cart',
      },
      {
        name: '广告管理',
        path: '/shop/banner',
        component: './shop/banner',
      },
    ],
  },
  {
    name: '商品中心',
    path: '/goods',
    routes: [
      {
        name: '商品管理',
        // key: '商品',
        path: '/goods/goods',
        component: './goods/goods',
      },
      {
        name: '创建商品',
        path: '/goods/goods/createOrEdit',
        component: './goods/goods/create',
        hideInMenu: true,
      },
      {
        name: '编辑商品',
        path: '/goods/goods/createOrEdit/:id',
        component: './goods/goods/create',
        hideInMenu: true,
      },

      {
        name: 'SKU管理',
        path: '/goods/goodsSku/:goodsId',
        component: './goods/goodsSku',
        hideInMenu: true,
        parentKeys: ['/goods/goods'],
      },
      {
        name: 'SKU管理',
        path: '/goods/goodsSku/createOrEdit/:goodsId',
        component: './goods/goodsSku/create',
        hideInMenu: true,
        parentKeys: ['/goods/goods'],
      },
      {
        name: 'SKU管理',
        path: '/goods/goodsSku/createOrEdit/:goodsId/:id',
        component: './goods/goodsSku/create',
        hideInMenu: true,
        parentKeys: ['/goods/goods'],
      },

      {
        name: '商品大类',
        path: '/goods/goodsType',
        component: './goods/goodsType',
      },
      {
        name: '创建商品大类',
        hideInMenu: true,
        path: '/goods/goodsType/createOrEdit',
        component: './goods/goodsType/create',
      },
      {
        name: '编辑商品大类',
        hideInMenu: true,
        path: '/goods/goodsType/createOrEdit/:id',
        component: './goods/goodsType/create',
      },

      {
        name: '商品类别',
        path: '/goods/goodsCategory',
        component: './goods/goodsCategory',
      },
      {
        name: '创建商品类别',
        hideInMenu: true,
        path: '/goods/goodsCategory/createOrEdit',
        component: './goods/goodsCategory/create',
      },
      {
        name: '编辑商品类别',
        hideInMenu: true,
        path: '/goods/goodsCategory/createOrEdit/:id',
        component: './goods/goodsCategory/create',
      },
    ],
  },
  {
    name: '档案中心',
    path: '/basic',
    routes: [
      {
        name: '单位管理',
        path: '/basic/unit',
        component: './basic/unit',
      },
      {
        name: '单位管理edit',
        path: '/basic/unit/createOrEdit',
        component: './basic/unit/create',
        hideInMenu: true,
      },
      {
        name: '单位管理editwithid',
        path: '/basic/unit/createOrEdit/:id',
        component: './basic/unit/create',
        hideInMenu: true,
      },

      {
        name: '品牌管理',
        path: '/basic/brand',
        component: './basic/brand',
      },
      {
        name: '品牌管理',
        path: '/basic/brand/createOrEdit',
        component: './basic/brand/create',
        hideInMenu: true,
      },
      {
        name: '品牌管理',
        path: '/basic/brand/createOrEdit/:id',
        component: './basic/brand/create',
        hideInMenu: true,
      },

      {
        name: '属性管理',
        path: '/basic/attribute',
        component: './basic/attribute',
      },
      {
        name: '属性管理',
        path: '/basic/attribute/createOrEdit',
        component: './basic/attribute/create',
        hideInMenu: true,
      },
      {
        name: '属性管理',
        path: '/basic/attribute/createOrEdit/:id',
        component: './basic/attribute/create',
        hideInMenu: true,
      },
      // {
      //   name: '属性类型',
      //   path: '/basic/attributeType',
      //   component: './basic/attributeType',
      // },
      // {
      //   name: '属性类型',
      //   path: '/basic/attributeType/createOrEdit',
      //   component: './basic/attributeType/create',
      //   hideInMenu: true,
      // },
      // {
      //   name: '属性类型',
      //   path: '/basic/attributeType/createOrEdit/:id',
      //   component: './basic/attributeType/create',
      //   hideInMenu: true,
      // },

      {
        name: '属性组',
        path: '/basic/attributeValueGroup',
        component: './basic/attributeValueGroup',
      },
      {
        name: '属性组Edit',
        path: '/basic/attributeValueGroup/createOrEdit',
        component: './basic/attributeValueGroup/create',
        hideInMenu: true,
      },
      {
        name: '属性组Edit',
        path: '/basic/attributeValueGroup/createOrEdit/:id',
        component: './basic/attributeValueGroup/create',
        hideInMenu: true,
      },

      {
        name: '属性内容',
        path: '/basic/attributeValue',
        component: './basic/attributeValue',
      },
      {
        name: '属性内容',
        path: '/basic/attributeValue/createOrEdit',
        component: './basic/attributeValue/create',
        hideInMenu: true,
      },
      {
        name: '属性内容',
        path: '/basic/attributeValue/createOrEdit/:id',
        component: './basic/attributeValue/create',
        hideInMenu: true,
      },
    ],
  },
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
        component: './system/user/create',
      },
      {
        name: '创建用户',
        path: '/system/sysUser/createOrEdit/:id',
        hideInMenu: true,
        component: './system/user/create',
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
    component: './404',
  },
];
