import { useMemo, useState, useEffect } from 'react';
import { action } from '@formily/reactive';
import { useParams } from 'umi';
import shopapi from '@/services/shopapi';
import QuickForm from '@/components/QuickForm';
import { createForm, onFieldValueChange } from '@formily/core';

const module = 'basic';
const resource = 'attribute';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
    },
    code: {
      type: 'string',
      title: '编码',
    },
    attributeTypeId: {
      type: 'string',
      title: '属性类型',
      'x-component': 'Select',
      'x-reactions': ['{{fetchAttributeTypes}}'],
    },
    componentType: {
      type: 'string',
      title: '组件类型',
    },
    isReadonly: {
      type: 'string',
      title: '是否只读',
      enum: [
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        },
      ],
      'x-component': 'Radio.Group',
    },
  },
};

export default () => {
  const { id } = useParams();

  const init = () => {
    return {
      isReadonly: 0,
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
    fetchAttributeTypes: (field) => {
      shopapi.ResourceApi.fetchFieldResources(field, 'basic', 'attributeType');
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
