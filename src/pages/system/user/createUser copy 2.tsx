import React, { useState, useEffect } from 'react'
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
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
} from '@formily/antd'
import { action } from '@formily/reactive'
import { Card, Button, Spin } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const form = createForm({
  readPretty: true,
  validateFirst: true,
})

const IDUpload = (props) => {
  const field = useField()
  return (
    <Upload
      {...props}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      headers={{
        authorization: 'authorization-text',
      }}
    >
      {field.editable && <Button icon={<UploadOutlined />}>上传复印件</Button>}
    </Upload>
  )
}

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormLayout,
    Input,
    DatePicker,
    Cascader,
    Select,
    IDUpload,
    ArrayItems,
    Editable,
  },
  scope: {
    fetchAddress: (field) => {
      const transform = (data = {}) => {
        return Object.entries(data).reduce((buf, [key, value]) => {
          if (typeof value === 'string')
            return buf.concat({
              label: value,
              value: key,
            })
          const { name, code, cities, districts } = value
          const _cities = transform(cities)
          const _districts = transform(districts)
          return buf.concat({
            label: name,
            value: code,
            children: _cities.length
              ? _cities
              : _districts.length
              ? _districts
              : undefined,
          })
        }, [])
      }

      field.loading = true
      fetch('//unpkg.com/china-location/dist/location.json')
        .then((res) => res.json())
        .then(
          action.bound((data) => {
            field.dataSource = transform(data)
            field.loading = false
          })
        )
    },
  },
})


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
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    password: {
      type: 'string',
      title: '密码',
      required: true,
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
      type: 'string',
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
          value: 3,
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
    },
    'department.name': {
      type: 'string',
      required: true,
      title: '部门',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
    },
    roles: {
      type: 'string',
      title: '角色',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
    },
    
  },
}

export default () => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      form.setInitialValues({
        account: 'Aston Martin',
        name: '',
        password: '',
        gender: 1,
        phone: '',
        'department.name': '',
        roles: []
      })
      setLoading(false)
    }, 2000)
  }, [])
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        background: '#eee',
        padding: '40px 0',
      }}
    >
      <Card title="创建用户" style={{ width: 620 }}>
        <Spin spinning={loading}>
          <Form
            form={form}
            labelCol={5}
            wrapperCol={16}
            onAutoSubmit={console.log}
          >
            <SchemaField schema={schema} />
            <FormButtonGroup.FormItem>
              <Submit block size="large">
                提交
              </Submit>
            </FormButtonGroup.FormItem>
          </Form>
        </Spin>
      </Card>
    </div>
  )
}