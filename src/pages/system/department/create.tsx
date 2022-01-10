import React, { useMemo, useState, useEffect } from 'react';
import { message, Space } from 'antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import {
  Form,
  FormItem,
  FormLayout,
  Input,
  Select,
  Cascader,
  DatePicker,
  Submit,
  FormGrid,
  ArrayItems,
  Editable,
  FormButtonGroup,
  Checkbox,
} from '@formily/antd';
import { action } from '@formily/reactive';
import { Card, Button, Spin } from 'antd';
import { useHistory, useParams, Link } from 'umi';
import shopapi from '@/services/shopapi';
import { collectIds, transformData, deleteData } from '@/utils/convert';

const module = 'system';
const resource = 'sysDepartment';

const Components = {
  FormItem,
  FormGrid,
  FormLayout,
  Input,
  DatePicker,
  Cascader,
  Select,
  ArrayItems,
  Editable,
  Checkbox,
};

const handleCreateResource = async (data) => {
  if (data.permissionIds !== undefined) {
    const ids = data.permissionIds.reduce((buf, val) => {
      console.log('create roles', val);
      return buf.concat({
        id: val,
      });
    }, []);
    data.permissions = ids;
  }
  return shopapi.ResourceApi.createOrSave(module, resource, data)
    .then((res) => {
      console.log('create role', res);
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

const handleGetResource = async (id: string) => {
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

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    parentId: {
      type: 'string',
      title: '上级部门',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-reactions': ['{{fetchResource}}'],
    },
  },
};

export default (props) => {
  const { id } = useParams();

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
      }),
    [id],
  );

  const SchemaField = useMemo(
    () =>
      createSchemaField({
        components: Components,
        scope: {
          fetchResource: (field: any) => {
            return shopapi.ResourceApi.fetchEnumResources(module, resource).then(
              action.bound((data) => {
                const ds = deleteData(data, id);
                field.dataSource = ds;
                field.loading = false;
              }),
            );
          },

          // fetchResource: (mod, res) => {
          //   return function (field: any) {
          //     shopapi.ResourceApi.fetchEnumResources(mod, res).then(
          //       action.bound((data) => {
          //         const ds = deleteData(data, id);
          //         console.log('delete data', ds);
          //         field.dataSource = ds;
          //         field.loading = false;
          //       }),
          //     );
          //   };
          // },
        },
      }),
    [id],
  );

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    console.log('effect user id', id, props);
    if (!id) {
      form.setInitialValues(
        {
          name: '',
          parentId: '',
        },
        'overwrite',
      );
      form.reset();
      setLoading(false);
    } else {
      handleGetResource(id).then((res) => {
        if (res != false) {
          form.setInitialValues({
            name: res.name,
            parentId: res.parentId,
          });
          form.reset();
        }
        setLoading(false);
      });
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
      <Card title="编辑部门" style={{ width: 620 }}>
        <Spin spinning={loading}>
          <Form
            form={form}
            labelCol={5}
            wrapperCol={16}
            onAutoSubmit={(params) => {
              console.log('submit', params);
              params.id = id;
              handleCreateResource(params).then((res) => {
                if (res) {
                  form.reset();
                  history.push('/' + module + '/' + resource);
                }
              });
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
