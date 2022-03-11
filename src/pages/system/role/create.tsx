import { action } from '@formily/reactive';
import { useParams } from 'umi';
import shopapi from '@/services/shopapi';
import QuickForm from '@/components/QuickForm';
import { collectIds, convertFieldToIdArray } from '@/utils/convert';

const module = 'system';
const resource = 'sysRole';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
    },
    permissionIds: {
      type: 'array',
      title: '权限',
      'x-component': 'Checkbox.Group',
      'x-reactions': ['{{fetchPermissions}}'],
    },
  },
};

export default () => {
  const { id } = useParams();

  const scope = {
    fetchPermissions: (field) => {
      return shopapi.ResourceApi.fetchEnumResources('system', 'sysPermission').then(
        action.bound((data) => {
          field.dataSource = data;
          field.loading = false;
        }),
      );
    },
  };

  const request = (form, id) => {
    shopapi.ResourceApi.getResource(module, resource, id).then((res) => {
      if (res != undefined) {
        if (res.code === 0) {
          console.log('perms ids', collectIds(res.data.permissions || []));
          form.setInitialValues({
            ...res.data,
            permissionIds: collectIds(res.data.permissions || []),
          });
          form.reset();
        }
      }
    });
  };

  const beforeSubmit = (data: Record<String, any>) => {
    convertFieldToIdArray(data, 'permissionIds', 'permissions');
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
