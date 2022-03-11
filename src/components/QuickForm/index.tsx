import { useMemo, useState, useEffect } from 'react';
import { message } from 'antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import {
  Form,
  FormItem,
  FormLayout,
  Input,
  Select as FormilySelect,
  Cascader,
  DatePicker,
  Submit,
  FormGrid,
  ArrayItems,
  Editable,
  FormButtonGroup,
  Checkbox,
  Switch,
  Radio,
  ArrayTable,
} from '@formily/antd';
import { action } from '@formily/reactive';
import { Card, Button, Spin, InputNumber } from 'antd';
import { useHistory, useParams, Link } from 'umi';
import shopapi from '@/services/shopapi';
import { deleteData } from '@/utils/convert';
import { ISchema } from '@formily/json-schema';
import { connect, mapReadPretty, mapProps } from '@formily/react';
import { SelectProps } from 'antd/lib/select';
import styles from './index.less';

const Select: React.FC<SelectProps<any>> = connect(
  FormilySelect,
  mapProps({}, (props, field) => {
    return {
      ...props,
      allowClear: true,
    };
  }),
);

export const components = {
  FormItem,
  FormGrid,
  FormLayout,
  Input,
  InputNumber,
  DatePicker,
  Cascader,
  Select,
  ArrayTable,
  ArrayItems,
  Editable,
  Checkbox,
  Switch,
  Radio,
};

declare type QuickFormProps = {
  module: string;
  resource: string;
  id?: string;
  title?: string;
  form?: any;
  schema?: ISchema;
  scope?: any;
  init?: any;
  request?: any;
  submit?: any;
  beforeSubmit?: any;
};

const handleCreateResource = async (module: string, resource: string, data: any) => {
  return shopapi.ResourceApi.createOrSave(module, resource, data)
    .then((res) => {
      console.log('create data', res);
      if (res != undefined) {
        if (res.code === 0) {
          message.success('保存成功');
          return true;
        } else {
          message.error('保存失败:' + res.message);
          return false;
        }
      }
      return false;
    })
    .catch(() => false);
};

const handleGetResource = async (module: string, resource: string, id: string) => {
  return shopapi.ResourceApi.getResource(module, resource, id)
    .then((res) => {
      console.log('get role', res);
      if (res != undefined) {
        if (res.code === 0) {
          return res.data;
        } else {
          return false;
        }
      }
      return false;
    })
    .catch(() => false);
};

export default (props: QuickFormProps) => {
  const { id, title, module, resource, form, schema, scope, init, request, submit, beforeSubmit } =
    props;
  const formScope = useMemo(() => {
    const tmpscope = scope || {};

    if (tmpscope['fetchResource'] === undefined) {
      tmpscope['fetchResource'] = (field: any) => {
        console.log('load fetch resource', module, resource, id);
        return shopapi.ResourceApi.fetchEnumResources(module, resource, id).then(
          action.bound((data) => {
            field.dataSource = data;
            field.loading = false;
          }),
        );
      };
    }
    return tmpscope;
  }, [id]);

  const SchemaField = useMemo(
    () =>
      createSchemaField({
        components: components,
        scope: formScope,
      }),
    [id],
  );

  let newForm = form;
  if (newForm === undefined) {
    newForm = useMemo(() => {
      return createForm({
        validateFirst: true,
      });
    }, [id]);
  }

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  console.log('quick form init');

  Object.entries(schema?.properties).forEach(([key, e]) => {
    if (e['x-decorator'] === undefined) {
      e['x-decorator'] = 'FormItem';
    }
    if (e['x-component'] === undefined) {
      e['x-component'] = 'Input';
    }
  });

  useEffect(() => {
    if (!id) {
      if (init) {
        newForm.setInitialValues(init());
      }
      newForm.reset();
      setLoading(false);
    } else {
      if (request) {
        request(newForm, id);
        setLoading(false);
      } else {
        handleGetResource(module, resource, id).then((res) => {
          if (res != false) {
            newForm.setInitialValues(res);
          }
          setLoading(false);
        });
      }
    }
  }, [id]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        background: '#eee',
        padding: '40px 0',
      }}
    >
      <Card title={title} className={styles.formCard}>
        <Spin spinning={loading}>
          <Form
            form={newForm}
            labelCol={5}
            wrapperCol={16}
            onAutoSubmit={(params) => {
              console.log('submit', params);
              params.id = id;
              if (beforeSubmit) {
                beforeSubmit(params);
              }
              if (submit) {
                submit(params);
              } else {
                handleCreateResource(module, resource, params).then((res) => {
                  if (res) {
                    newForm.reset();
                    history.push('/' + module + '/' + resource);
                  }
                });
              }
            }}
          >
            <SchemaField schema={schema} />
            <FormButtonGroup.Sticky align="center">
              <FormButtonGroup>
                <Submit block size="middle">
                  提交
                </Submit>

                <Button
                  block
                  size="middle"
                  onClick={() => {
                    history.push('/' + module + '/' + resource);
                  }}
                >
                  返回
                </Button>
              </FormButtonGroup>
            </FormButtonGroup.Sticky>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};
