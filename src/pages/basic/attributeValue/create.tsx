import { useMemo, useState, useEffect } from 'react';
import { action } from '@formily/reactive';
import { useParams } from 'umi';
import shopapi from '@/services/shopapi';
import QuickForm from '@/components/QuickForm';
import { createForm, onFieldValueChange } from '@formily/core';

const module = 'basic';
const resource = 'attributeValue';

const schema = {
  type: 'object',
  properties: {
    name: {
      title: '名称',
      required: true,
    },
    code: {
      title: '编码',
    },
    attributeId: {
      title: '属性',
      type: 'array',
      required: true,
      'x-component': 'Select',
      'x-reactions': ['{{fetchAttributes}}'],
    },
    attributeValueGroupId: {
      title: '属性组',
      type: 'array',
      'x-component': 'Select',
      'x-reactions': ['{{useAsyncDataSource(loadData)}}'],
      properties: {
        name: {
          title: 'Title',
          type: 'string',
          'x-component': 'SelectTable.Column',
          'x-component-props': {
            width: '40%',
          },
        },
        description: {
          title: 'Description',
          type: 'string',
          'x-component': 'SelectTable.Column',
          'x-component-props': {
            width: '60%',
          },
        },
      },
    },
  },
};

const loadData = async (field) => {
  const attributeId = field.query('attributeId').get('value');
  if (!attributeId) return [];
  return new Promise((resolve) => {
    shopapi.ResourceApi.fetchEnumResources('basic', 'attributeValueGroup', '', {
      attributeId: attributeId,
    }).then((res) => {
      resolve(res);
    });
  });
};

export default () => {
  const { id } = useParams();

  const init = () => {
    return {
      status: 1,
    };
  };

  const form = useMemo(
    () =>
      createForm({
        // validateFirst: true,
      }),
    [id],
  );

  const scope = {
    fetchAttributes: (field) => {
      return shopapi.ResourceApi.fetchFieldResources(field, 'basic', 'attribute');
    },
    fetchAttributeValueGroups: (field) => {
      const attributeId = field.query('attributeId').get('value');
      return shopapi.ResourceApi.fetchFieldResources(field, 'basic', 'attributeValueGroup', '', {
        attributeId: attributeId,
      });
    },

    useAsyncDataSource: (service) => (field) => {
      field.loading = true;
      service(field).then(
        action.bound((data) => {
          field.dataSource = data;
          field.loading = false;
        }),
      );
    },

    loadData: async (field) => {
      const attributeId = field.query('attributeId').get('value');
      if (!attributeId) return [];
      return new Promise((resolve) => {
        shopapi.ResourceApi.fetchEnumResources('basic', 'attributeValueGroup', '', {
          attributeId: attributeId,
        }).then((res) => {
          resolve(res);
        });
      });
    },
  };

  return (
    <QuickForm
      id={id}
      module={module}
      form={form}
      resource={resource}
      schema={schema}
      scope={scope}
      init={init}
    />
  );
};
