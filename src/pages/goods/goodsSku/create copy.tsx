import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'umi';
import shopapi from '@/services/shopapi';
import QuickForm from '@/components/QuickForm';
import { createForm, onFieldReact, onFieldInit, FormPathPattern, Field } from '@formily/core';
import { action, observable } from '@formily/reactive';

const module = 'goods';
const resource = 'goodsSku';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
      required: true,
    },
    code: {
      type: 'string',
      title: '编码',
    },
    goodsId: {
      type: 'string',
      title: '商品',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        showSearch: true,
        style: {
          width: 300,
        },
      },
      // 'x-reactions': ['{{fetchGoods}}'],
    },
    marketingPrice: {
      type: 'string',
      title: '市场价格',
      required: true,
      'x-component': 'InputNumber',
      'x-component-props': {
        min: 0,
      },
    },
    price: {
      type: 'string',
      title: '销售价格',
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

function fetchData(value, callback) {
  return shopapi.ResourceApi.fetchEnumResources('goods', 'goods', '', { pageSize: 10 }).then(
    (res) => {
      console.log('callback', res);
      const data = [];
      res.forEach((r) => {
        data.push({
          value: r.value,
          text: r.label,
        });
      });
      callback(data);
      return data;
    },
  );
}

const useAsyncDataSource = (
  pattern: FormPathPattern,
  service: (field: Field) => Promise<{ label: string; value: any }[]>,
) => {
  const keyword = observable.ref('');

  onFieldInit(pattern, (field) => {
    field.setComponentProps({
      onSearch: (value) => {
        keyword.value = value;
      },
    });
  });

  onFieldReact(pattern, (field) => {
    field.loading = true;
    shopapi.ResourceApi.fetchEnumResources('goods', 'goods', '', { pageSize: 10 })
      .then((res) => {
        const data: any[] = [];
        res.forEach((r) => {
          data.push({
            value: r.value,
            text: r.label,
          });
        });
        console.log('callback', data);
        return data;
      })
      .then(
        action.bound((data) => {
          field.dataSource = data;
          field.loading = false;
        }),
      );
    // service({ field, keyword: keyword.value })
    //   // .then((res) => {
    //   //   console.log('bind data', res);
    //   //   return res;
    //   // })
    //   .then(
    //     action.bound((data) => {
    //       field.dataSource = data;
    //       field.loading = false;
    //     }),
    //   );
  });
};

export default () => {
  const { id } = useParams();

  const form = useMemo(
    () =>
      createForm({
        // validateFirst: true,
        effects: () => {
          useAsyncDataSource('goodsId', async ({ keyword }) => {
            if (!keyword) {
              return [];
            }
            console.log('select search');
            return new Promise((resolve) => {
              fetchData(keyword, resolve);
            });
          });
        },
      }),
    [id],
  );

  const scope = {
    fetchGoods: (field) => {
      return shopapi.ResourceApi.fetchFieldResources(field, 'goods', 'goods', '', {
        pageSize: 10,
      });
    },
  };
  return (
    <QuickForm
      id={id}
      module={module}
      resource={resource}
      form={form}
      schema={schema}
      scope={{ useAsyncDataSource: useAsyncDataSource, fetchData: fetchData, ...scope }}
    />
  );
};
