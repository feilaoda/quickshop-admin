import { action } from '@formily/reactive';
import { useParams } from 'umi';
import shopapi from '@/services/shopapi';
import QuickForm from '@/components/QuickForm';

const module = 'goods';
const resource = 'goodsCategory';

const schema = {
  type: 'object',
  properties: {
    'parent.id': {
      type: 'string',
      title: '父级类别',
      'x-component': 'Select',
      'x-reactions': ['{{fetchParentResource}}'],
    },
    name: {
      type: 'string',
      title: '名称',
    },
    icon: {
      type: 'string',
      title: '图标',
    },
    sort: {
      type: 'string',
      title: '排序',
      'x-component': 'InputNumber',
    },
  },
};

export default () => {
  const { id } = useParams();

  const scope = {
    fetchParentResource: (field: any) => {
      return shopapi.ResourceApi.fetchFieldResources(field, 'goods', 'goodsCategory', id, {
        'parent.id': { '@isnull': '' },
      });
    },
  };

  return <QuickForm id={id} module={module} resource={resource} schema={schema} scope={scope} />;
};
