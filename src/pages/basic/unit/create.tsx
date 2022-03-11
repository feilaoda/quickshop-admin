import { useMemo, useState, useEffect } from 'react';
import { action } from '@formily/reactive';
import { useParams } from 'umi';
import shopapi from '@/services/shopapi';
import QuickForm from '@/components/QuickForm';
import { createForm, onFieldValueChange } from '@formily/core';

const module = 'basic';
const resource = 'unit';

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
    unitType: {
      type: 'string',
      title: '单位类型',
      'x-component': 'Select',
      enum: [
        {
          label: '数量',
          value: 1,
        },
        {
          label: '重量',
          value: 2,
        },
        {
          label: '体积',
          value: 3,
        },
        {
          label: '长度',
          value: 4,
        },
        {
          label: '时间',
          value: 5,
        },
      ],
    },
    isBaseUnit: {
      type: 'string',
      title: '是否基本单位',
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
    baseUnitId: {
      type: 'string',
      title: '基本单位',
      'x-component': 'Select',
      'x-reactions': ['{{fetchUnits}}'],
    },
    baseUnitRate: {
      type: 'string',
      title: '基本单位换算率',
    },
    roundType: {
      type: 'string',
      title: '舍入类型',
      'x-component': 'Select',
      enum: [
        {
          label: '无',
          value: 0,
        },
        {
          label: '四舍五入',
          value: 1,
        },
        {
          label: '进一法',
          value: 2,
        },
        {
          label: '舍尾法',
          value: 3,
        },
        {
          label: '取整法',
          value: 4,
        },
      ],
    },
    precisions: {
      type: 'string',
      title: '精度',
      'x-component': 'Select',
      enum: [
        {
          label: '0',
          value: 0,
        },
        {
          label: '1',
          value: 1,
        },
        {
          label: '2',
          value: 2,
        },
        {
          label: '3',
          value: 3,
        },
        {
          label: '4',
          value: 4,
        },
        {
          label: '5',
          value: 5,
        },
      ],
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
    fetchUnits: (field) => {
      return shopapi.ResourceApi.fetchFieldResources(field, 'basic', 'unit', id, { isBaseUnit: 1 });
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
