import { action } from '@formily/reactive';
import { useParams } from 'umi';
import shopapi from '@/services/shopapi';
import QuickForm from '@/components/QuickForm';

const module = 'system';
const resource = 'sysDepartment';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
    },
    'parent.id': {
      type: 'string',
      title: '上级部门',
      'x-component': 'Select',
      'x-reactions': ['{{fetchResource}}'],
    },
  },
};

export default () => {
  const { id } = useParams();

  return <QuickForm id={id} module={module} resource={resource} schema={schema} />;
};
