import { action } from '@formily/reactive';
import { useParams } from 'umi';
import shopapi from '@/services/shopapi';
import QuickForm from '@/components/QuickForm';

const module = 'system';
const resource = 'sysPermission';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
    },
    resource: {
      type: 'string',
      title: '资源',
      'x-component': 'Select',
      enum: [
        {
          label: '用户管理',
          value: 'system:sysUser',
        },
        {
          label: '角色管理',
          value: 'system:sysRole',
        },
        {
          label: '部门管理',
          value: 'system:sysDepartment',
        },
        {
          label: '权限管理',
          value: 'system:sysPermission',
        },
      ],
    },
    operations: {
      type: 'string',
      title: '权限',
      'x-component': 'Checkbox.Group',
      enum: [
        {
          label: '全部',
          value: 255,
        },
        {
          label: '可读',
          value: 1,
        },
        {
          label: '可写',
          value: 2,
        },
        {
          label: '可删除',
          value: 4,
        },
      ],
    },
  },
};

export default () => {
  const { id } = useParams();

  return <QuickForm id={id} module={module} resource={resource} schema={schema} />;
};
