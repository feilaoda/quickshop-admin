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
import { intConvertToArray, transformData } from '@/utils/convert';

import { Permissions } from './index';

const module = 'system';
const resource = 'sysPermission';

const SchemaField = createSchemaField({
  components: {
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
  },
  scope: {
    fetchPermissions: (field) => {
      field.loading = true;
      shopapi.ResourceApi.getResources('system', 'sysPermission', { pageSize: 1000 })
        .then((res) => {
          if (res.code == 0) {
            return res.data;
          } else {
            return [];
          }
        })
        .then(
          action.bound((data) => {
            const ds = transformData(data);
            field.dataSource = ds;
            field.loading = false;
          }),
        );
    },
  },
});

const handleCreateResource = async (data) => {
  if (data.operations !== undefined) {
    const ids = data.operations.reduce((buf, val) => {
      console.log('create roles', buf, val);
      return buf | val;
    }, data.operations[0]);
    data.operation = ids;
  }
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
    resource: {
      type: 'string',
      title: '资源',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        {
          label: '用户管理',
          value: 'system:sysUser',
        },
        {
          label: '角色管理',
          value: 'system:sysRole',
        },
        {
          label: '部门管理',
          value: 'system:sysDepartment',
        },
        {
          label: '权限管理',
          value: 'system:sysPermission',
        },
      ],
    },
    operations: {
      type: 'string',
      title: '权限',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox.Group',
      enum: [
        {
          label: '全部',
          value: 255,
        },
        {
          label: '可读',
          value: 1,
        },
        {
          label: '可写',
          value: 2,
        },
        {
          label: '可删除',
          value: 4,
        },
      ],
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

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    console.log('effect user id', id, props);
    if (!id) {
      form.setInitialValues(
        {
          name: '',
          permissionIds: [],
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
            resource: res.resource,
            operations: intConvertToArray(Permissions, res.operation || 0),
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
      <Card title="编辑权限" style={{ width: 620 }}>
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
