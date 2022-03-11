import { action } from '@formily/reactive';
import { useParams } from 'umi';
import shopapi from '@/services/shopapi';
import QuickForm from '@/components/QuickForm';
import { collectIds, convertFieldToIdArray } from '@/utils/convert';

const module = 'system';
const resource = 'sysUser';

const schema = {
  type: 'object',
  properties: {
    account: {
      type: 'string',
      title: '账号',
      required: true,
    },
    name: {
      type: 'string',
      title: '姓名',
    },
    password: {
      type: 'string',
      title: '密码',
      'x-component': 'Input.Password',
    },
    phone: {
      type: 'string',
      title: '电话',
    },
    gender: {
      type: 'number',
      title: '性别',
      enum: [
        {
          label: '男',
          value: 1,
        },
        {
          label: '女',
          value: 2,
        },
        {
          label: '未知',
          value: 0,
        },
      ],
      'x-component': 'Select',
    },
    status: {
      type: 'number',
      title: '状态',
      enum: [
        {
          label: '正常',
          value: 1,
        },
        {
          label: '禁用',
          value: 0,
        },
      ],
      'x-component': 'Select',
    },
    departmentId: {
      type: 'string',
      title: '部门',
      'x-component': 'Select',
      'x-reactions': ['{{fetchDepartments}}'],
    },
    roleIds: {
      type: 'array',
      title: '角色',
      'x-component': 'Checkbox.Group',
      'x-reactions': ['{{fetchRoles}}'],
    },
  },
};

export default () => {
  const { id } = useParams();

  const scope = {
    fetchDepartments: (field) => {
      const res = shopapi.ResourceApi.fetchFieldResources(field, 'system', 'sysDepartment');
      console.log('depts', res);
      return res;
    },
    fetchRoles: (field) => {
      return shopapi.ResourceApi.fetchFieldResources(field, 'system', 'sysRole');
    },
  };

  const request = (form, id) => {
    shopapi.ResourceApi.fetchResource(module, resource, id).then((res) => {
      if (res) {
        console.log('users', res);
        form.setInitialValues({
          ...res,
          roleIds: collectIds(res.roles || []),
        });
      }
    });
  };

  const beforeSubmit = (data: Record<String, any>) => {
    console.log('before submit', data);
    convertFieldToIdArray(data, 'roleIds', 'roles');
  };

  return (
    <QuickForm
      id={id}
      module={module}
      resource={resource}
      request={request}
      beforeSubmit={beforeSubmit}
      schema={schema}
      scope={scope}
    />
  );
};
