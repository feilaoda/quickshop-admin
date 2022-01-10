import React, { useMemo, useState, useEffect } from 'react';
import { message, Space } from 'antd';
import { createForm, onFormInit } from '@formily/core';
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
  Upload,
  ArrayItems,
  Editable,
  FormButtonGroup,
  Checkbox,
} from '@formily/antd';
import { action } from '@formily/reactive';
import { Card, Button, Spin } from 'antd';
import { useHistory, useParams, Link } from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import shopapi from '@/services/shopapi';
import { collectIds } from '@/utils/convert';

const transformData = (data = {}) => {
  return Object.entries(data).reduce((buf, [_, value]) => {
    return buf.concat({
      label: value.name,
      value: value.id,
    });
  }, []);
};

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
    fetchDepartments: (field) => {
      field.loading = true;
      shopapi.DepartmentApi.getDepartments()
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

    fetchRoles: (field) => {
      field.loading = true;
      shopapi.RoleApi.getRoles()
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

const handleCreateUser = async (data) => {
  if (data.roleIds !== undefined) {
    const ids = data.roleIds.reduce((buf, val) => {
      console.log('create roles', val);
      return buf.concat({
        id: val,
      });
    }, []);
    data.roles = ids;
  }
  return shopapi.UserApi.createOrSaveUser(data)
    .then((res) => {
      console.log('create user', res);
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

const handleGetUser = async (id) => {
  return shopapi.UserApi.getUser(id)
    .then((res) => {
      console.log('create user', res);
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
    account: {
      type: 'string',
      title: '账号',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    name: {
      type: 'string',
      title: '姓名',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    password: {
      type: 'string',
      title: '密码',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    phone: {
      type: 'string',
      title: '电话',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    gender: {
      type: 'number',
      title: '性别',
      enum: [
        {
          label: '男',
          value: 1,
        },
        {
          label: '女',
          value: 2,
        },
        {
          label: '未知',
          value: 0,
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
    },
    status: {
      type: 'number',
      title: '状态',
      enum: [
        {
          label: '正常',
          value: 1,
        },
        {
          label: '禁用',
          value: 0,
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
    },
    departmentId: {
      type: 'string',
      title: '部门',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-reactions': ['{{fetchDepartments}}'],
    },
    roleIds: {
      type: 'array',
      title: '角色',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox.Group',
      'x-reactions': ['{{fetchRoles}}'],
    },
  },
};

export default (props) => {
  const { userId, current } = useParams();

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
      }),
    [userId],
  );

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    console.log('effect user id', userId, props);
    if (!userId) {
      form.setInitialValues(
        {
          account: '',
          name: '',
          password: '',
          gender: 0,
          phone: '',
          status: 1,
          departmentId: '',
          roleIds: [],
        },
        'overwrite',
      );
      form.reset();
      setLoading(false);
    } else {
      handleGetUser(userId).then((res) => {
        if (res != false) {
          form.setInitialValues({
            account: res.account,
            name: res.account,
            password: '',
            gender: res.gender,
            phone: res.phone,
            status: res.status,
            departmentId: res.departmentId,
            roleIds: collectIds(res.roles || []),
            'department.id': res.departmentId,
          });
          form.reset();
        }
        setLoading(false);
      });
    }
  }, [userId]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        background: '#eee',
        padding: '40px 0',
      }}
    >
      <Card title="编辑用户" style={{ width: 620 }}>
        <Spin spinning={loading}>
          <Form
            form={form}
            labelCol={5}
            wrapperCol={16}
            onAutoSubmit={(params) => {
              console.log('submit', params);
              params.id = userId;
              handleCreateUser(params).then((res) => {
                if (res) {
                  form.reset();
                  history.push('/system/sysUser');
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
                    history.push('/system/sysUser');
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
