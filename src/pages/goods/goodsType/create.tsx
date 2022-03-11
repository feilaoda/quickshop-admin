import { action } from '@formily/reactive';
import { useParams } from 'umi';
import shopapi from '@/services/shopapi';
import QuickForm from '@/components/QuickForm';
import { collectIds, convertFieldToIdArray } from '@/utils/convert';

const module = 'goods';
const resource = 'goodsType';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
    },
    attributeIds: {
      type: 'array',
      title: '属性',
      'x-component': 'Checkbox.Group',
      'x-reactions': ['{{fetchAttributes}}'],
    },
  },
};

const request = (form, id) => {
  shopapi.ResourceApi.getResource(module, resource, id).then((res) => {
    if (res != undefined) {
      if (res.code === 0) {
        form.setInitialValues({
          ...res.data,
          attributeIds: collectIds(res.data.attributes || []),
        });
        form.reset();
      }
    }
  });
};

const beforeSubmit = (data: Record<String, any>) => {
  convertFieldToIdArray(data, 'attributeIds', 'attributes');
};

export default () => {
  const { id } = useParams();

  const scope = {
    fetchAttributes: (field: any) => {
      return shopapi.ResourceApi.fetchFieldResources(field, 'basic', 'attribute', id, {});
    },
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
