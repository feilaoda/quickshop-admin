import { useMemo, useState, useEffect } from 'react';
import { action } from '@formily/reactive';
import { useParams } from 'umi';
import shopapi from '@/services/shopapi';
import QuickForm from '@/components/QuickForm';
import { createForm, onFieldValueChange } from '@formily/core';

const module = 'member';
const resource = 'member';

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
      isBaseUnit: 1,
      status: 1,
      precisions: 0,
    };
  };

  const form = useMemo(
    () =>
      createForm({
        // validateFirst: true,
        effects() {
          onFieldValueChange('isBaseUnit', (field) => {
            if (field.value == 1) {
              form.setFieldState('baseUnitId', (state) => {
                state.disabled = true;
              });
              form.setFieldState('baseUnitRate', (state) => {
                state.disabled = true;
              });
            } else {
              form.setFieldState('baseUnitId', (state) => {
                state.disabled = false;
                state.value = undefined;
              });
              form.setFieldState('baseUnitRate', (state) => {
                state.disabled = false;
                state.value = 0;
              });
            }
          });
        },
      }),
    [id],
  );

  const scope = {
    fetchAttributeTypes: (field) => {
      return shopapi.ResourceApi.fetchFieldResources(field, 'basic', 'attributeType', id, {});
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
