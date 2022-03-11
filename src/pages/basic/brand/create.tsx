import { useMemo, useState, useEffect } from 'react';
import { action } from '@formily/reactive';
import { useParams } from 'umi';
import shopapi from '@/services/shopapi';
import QuickForm from '@/components/QuickForm';
import { createForm, onFieldValueChange } from '@formily/core';

const module = 'basic';
const resource = 'brand';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
    },
  },
};

export default () => {
  const { id } = useParams();

  return <QuickForm id={id} module={module} resource={resource} schema={schema} />;
};
