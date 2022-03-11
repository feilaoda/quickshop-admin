import { useMemo, useState } from 'react';
import { action } from '@formily/reactive';
import { useParams } from 'umi';
import shopapi from '@/services/shopapi';
import QuickForm from '@/components/QuickForm';
import { createForm, onFieldValueChange } from '@formily/core';

const module = 'goods';
const resource = 'goods';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
      required: true,
    },
    detail: {
      type: 'string',
      title: '详情',
    },
    pic: {
      type: 'string',
      title: '图片',
    },
    typeId: {
      type: 'string',
      title: '大类',
      required: true,
      'x-component': 'Select',
      'x-reactions': ['{{fetchTypes}}'],
    },
    categoryId: {
      type: 'string',
      title: '类别',
      required: true,
      'x-component': 'Select',
      'x-reactions': ['{{fetchCategorys}}'],
    },
    brandId: {
      type: 'string',
      title: '品牌',
      required: true,
      'x-component': 'Select',
      'x-reactions': ['{{fetchBrands}}'],
    },
    unitId: {
      type: 'string',
      title: '单位',
      required: true,
      'x-component': 'Select',
      'x-reactions': ['{{fetchUnits}}'],
    },
    price: {
      type: 'string',
      title: '价格',
      required: true,
      'x-component': 'InputNumber',
      'x-component-props': {
        min: 0,
      },
    },
    stock: {
      type: 'string',
      title: '库存',
      'x-component': 'InputNumber',
      'x-component-props': {
        min: 0,
      },
    },
    isSale: {
      type: 'number',
      title: '上架',
      enum: [
        {
          label: '上架',
          value: 1,
        },
        {
          label: '下架',
          value: 0,
        },
      ],
      'x-component': 'Radio.Group',
    },
    status: {
      type: 'number',
      title: '状态',
      enum: [
        {
          label: '启用',
          value: 1,
        },
        {
          label: '禁用',
          value: 0,
        },
      ],
      'x-component': 'Radio.Group',
    },
  },
};

const skus = {
  type: 'array',
  'x-decorator': 'FormItem',
  'x-component': 'ArrayTable',
  'x-component-props': {
    pagination: { pageSize: 10 },
    scroll: { x: '100%' },
  },
  items: {
    type: 'object',
    properties: {
      skuId: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': { width: 50, title: 'skuId', align: 'center' },
        properties: {
          sort: {
            type: 'void',
            'x-component': 'ArrayTable.Index',
          },
        },
      },
      name: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': { width: 200, title: '名称', align: 'center' },
        properties: {
          index: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
        },
      },
      marketingPrice: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': { width: 100, title: '市场价' },
        properties: {
          a1: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
        },
      },
      price: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': { width: 100, title: '销售价格' },
        properties: {
          a2: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
        },
      },
      stock: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': { width: 100, title: '库存' },
        properties: {
          a3: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
        },
      },
      color: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': { width: 100, title: '颜色' },
        properties: {
          a3: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
        },
      },
      spec: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': { width: 100, title: '规格' },
        properties: {
          a3: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
        },
      },
      operation: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: 'Operations',
          dataIndex: 'operations',
          width: 200,
          fixed: 'right',
        },
        properties: {
          item: {
            type: 'void',
            'x-component': 'FormItem',
            properties: {
              remove: {
                type: 'void',
                'x-component': 'ArrayTable.Remove',
              },
              moveDown: {
                type: 'void',
                'x-component': 'ArrayTable.MoveDown',
              },
              moveUp: {
                type: 'void',
                'x-component': 'ArrayTable.MoveUp',
              },
            },
          },
        },
      },
    },
  },
  properties: {
    add: {
      type: 'void',
      'x-component': 'ArrayTable.Addition',
      title: 'Add entry',
    },
  },
};

function initData() {
  return {
    isSale: 1,
    status: 1,
  };
}

export default () => {
  const { id } = useParams();

  const [typeId, setTypeId] = useState('');

  const [attributes, setAttributes] = useState([]);

  const request = (form, id) => {
    shopapi.ResourceApi.fetchResource(module, resource, id).then((res) => {
      if (res) {
        console.log('request goods', res);
        form.setInitialValues({
          ...res,
        });
        // setTypeId(res.data.typeId);
        if (res.typeId) {
          shopapi.ResourceApi.fetchResource('goods', 'goodsType', res.typeId).then((data) => {
            if (data && data.attributes) {
              setAttributes(data.attributes);
            }
          });
        }
      }
    });
  };

  // const request = (form, id) => {
  //   shopapi.ResourceApi.fetchResource(module, resource, id).then((res) => {
  //     if (res) {
  //       form.setInitialValues({
  //         ...res.data,
  //       });
  //     }
  //   });
  // };

  const effects = () => {
    onFieldValueChange('typeId', (field) => {
      console.log('typeId', field);
      setTypeId(field.value);
    });
  };

  const form = useMemo(() => {
    return createForm({
      validateFirst: true,
      effects: () => {
        onFieldValueChange('typeId', (field) => {
          console.log('typeId', field);
          setTypeId(field.value);
          if (field.value) {
            shopapi.ResourceApi.fetchResource('goods', 'goodsType', field.value).then((data) => {
              if (data && data.attributes) {
                setAttributes(data.attributes);
              }
            });
          }
        });
      },
    });
  }, [id]);

  // const form = useMemo(() => {
  //   return createForm({
  //     effects() {
  //       onFieldValueChange('typeId', (field) => {
  //         console.log('typeId', field);
  //         setTypeId(field.value);
  //       });
  //     },
  //   });
  // }, [id]);

  const scope = {
    fetchUnits: (field) => {
      return shopapi.ResourceApi.fetchFieldResources(field, 'basic', 'unit', '', { isBaseUnit: 1 });
    },
    fetchBrands: (field) => {
      return shopapi.ResourceApi.fetchFieldResources(field, 'basic', 'brand');
    },
    fetchCategorys: (field) => {
      return shopapi.ResourceApi.fetchFieldResources(field, 'goods', 'goodsCategory');
    },
    fetchTypes: (field) => {
      return shopapi.ResourceApi.fetchFieldResources(field, 'goods', 'goodsType');
    },
  };
  return (
    <div>
      <QuickForm
        id={id}
        form={form}
        request={request}
        module={module}
        resource={resource}
        schema={schema}
        scope={scope}
        init={initData}
      />

      {attributes.map(function (object, i) {
        return <div key={i}>{object.name}</div>;
      })}
    </div>
  );
};
