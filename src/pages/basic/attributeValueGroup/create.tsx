import { useMemo, useState, useEffect } from 'react';
import { action } from '@formily/reactive';
import { useParams } from 'umi';
import shopapi from '@/services/shopapi';
import QuickForm from '@/components/QuickForm';
import { createForm, onFieldValueChange } from '@formily/core';

const module = 'basic';
const resource = 'attributeValueGroup';

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
    attributeId: {
      type: 'string',
      title: '属性',
      'x-component': 'Select',
      'x-reactions': ['{{fetchAttributes}}'],
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

  // onFieldValueChange('isBaseUnit', (field) => {
  //   if(field.value == 1) {
  //     form.setFieldState('baseUnitId', (state)=> {
  //       state.display = 'visible'
  //     }
  //     form.setFieldState('baseUnitRate', (state)=> {
  //       state.display = 'visible'
  //     }
  //   }else {
  //     form.setFieldState('baseUnitId', (state)=> {
  //       state.display = 'hidden'
  //     }
  //     form.setFieldState('baseUnitRate', (state)=> {
  //       state.display = 'hidden'
  //     }
  //   }
  //   // form.setFieldState('input', (state) => {
  //   //   //对于初始联动，如果字段找不到，setFieldState会将更新推入更新队列，直到字段出现再执行操作
  //   //   state.display = field.value
  //   // })
  // })

  const form = useMemo(
    () =>
      createForm({
        // validateFirst: true,
      }),
    [id],
  );

  const scope = {
    fetchAttributes: (field) => {
      return shopapi.ResourceApi.fetchFieldResources(field, 'basic', 'attribute', '', {});
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
