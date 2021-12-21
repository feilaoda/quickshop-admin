import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import styles from './Welcome.less';

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

import { Select, FormItem, FormButtonGroup, Submit } from '@formily/antd';
import { createForm } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/react';
import { action } from '@formily/reactive';

const SchemaField = createSchemaField({
  components: {
    Select,
    FormItem,
  },
});

const loadData = async (field) => {
  const linkage = field.query('linkage').get('value');
  if (!linkage) return [];
  return new Promise((resolve) => {
    if (linkage === 1) {
      resolve([
        {
          label: 'AAA',
          value: 'aaa',
        },
        {
          label: 'BBB',
          value: 'ccc',
        },
      ]);
    } else if (linkage === 2) {
      resolve([
        {
          label: 'CCC',
          value: 'ccc',
        },
        {
          label: 'DDD',
          value: 'ddd',
        },
      ]);
    }
  });
};

const useAsyncDataSource = (service) => (field) => {
  // field.loading = true
  service(field).then(
    action.bound((data) => {
      console.log('ds data', data);
      field.dataSource = data;
      // field.loading = false
    }),
  );
};

const form = createForm();

const schema = {
  type: 'object',
  properties: {
    linkage: {
      type: 'string',
      title: '联动选择框',
      enum: [
        { label: '发请求1', value: 1 },
        { label: '发请求2', value: 2 },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        style: {
          width: 120,
        },
      },
    },
    select: {
      type: 'string',
      title: '异步选择框',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        style: {
          width: 120,
        },
      },
      'x-reactions': ['{{useAsyncDataSource(loadData)}}'],
    },
  },
};

const Welcome: React.FC = () => {
  const intl = useIntl();
  return (
    <PageContainer>
      <Card>
        <FormProvider form={form}>
          <SchemaField schema={schema} scope={{ useAsyncDataSource, loadData }} />
          <FormButtonGroup>
            <Submit onSubmit={console.log}>提交</Submit>
          </FormButtonGroup>
        </FormProvider>

        <Alert
          message={intl.formatMessage({
            id: 'pages.welcome.alertMessage',
            defaultMessage: 'Faster and stronger heavy-duty components have been released.',
          })}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          <FormattedMessage id="pages.welcome.advancedComponent" defaultMessage="Advanced Form" />{' '}
          <a
            href="https://procomponents.ant.design/components/table"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="Welcome" />
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-table</CodePreview>
        <Typography.Text
          strong
          style={{
            marginBottom: 12,
          }}
        >
          <FormattedMessage id="pages.welcome.advancedLayout" defaultMessage="Advanced layout" />{' '}
          <a
            href="https://procomponents.ant.design/components/layout"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="Welcome" />
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-layout</CodePreview>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
