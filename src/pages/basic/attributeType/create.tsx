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
  },
};

export default () => {
  const { id } = useParams();

  const init = () => {
    return {};
  };

  const form = useMemo(
    () =>
      createForm({
        // validateFirst: true,
      }),
    [id],
  );

  const scope = {};

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
