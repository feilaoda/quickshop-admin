import React, { useState } from 'react';
import { Button, Input, message, Tag } from 'antd';
import ProForm, {
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
  ProFormRadio,
  ProFormSelect,
  ProFormTreeSelect,
} from '@ant-design/pro-form';
import { useParams, useHistory } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import shopapi from '@/services/shopapi';
import { Submit } from '@formily/antd';
const module = 'goods';
const resource = 'goods';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type DataSourceType = {
  id: React.Key;
  title?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [];

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '名称',
    dataIndex: 'name',
    width: '30%',
  },
  {
    title: '编码',
    dataIndex: 'code',
    width: '30%',
  },
  {
    title: '状态',
    key: 'state',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
      },
    },
  },
  {
    title: '描述',
    dataIndex: 'decs',
    renderFormItem: (_, { record }) => {
      console.log('----===>', record);
      return <Input addonBefore={(record as any)?.addonBefore} />;
    },
  },
  {
    title: '操作',
    valueType: 'option',
  },
];

function attributeTree(attr: any, setAttributeNodes, attributeNodes) {
  console.log('attr', attr);
  return (
    <ProForm.Item label={attr.name} key={attr.id}>
      <ProFormTreeSelect
        name={'fields_' + attr.field}
        placeholder={attr.name}
        allowClear
        width="lg"
        // secondary
        debounceTime={1000}
        fieldProps={{
          showSearch: false,
          multiple: true,
          fieldNames: {
            label: 'title',
          },
          filterTreeNode: false,
          treeDefaultExpandAll: true,
          onSearch: () => {
            console.log('on search');
          },
        }}
        request={async (params) => {
          console.log('on select params', params);
          if (params.keyWords === '') {
            return attributeNodes[attr.id] || [];
          }
          const res = await shopapi.ResourceApi.fetchResources('basic', 'attributeValue', {
            attributeId: attr.id,
          });
          if (res) {
            console.log('attributeValue', res);
            const groups: any = {};
            res.forEach((v) => {
              if (v.attributeValueGroupId === null || v.attributeValueGroupId === undefined) {
                const group = groups['默认'] || [];
                group.push(v);
                groups['默认'] = group;
              }
            });
            res.forEach((v) => {
              if (v.attributeValueGroupId !== null && v.attributeValueGroup !== null) {
                const group = groups[v.attributeValueGroup.name] || [];
                group.push(v);
                groups[v.attributeValueGroup.name] = group;
              }
            });
            const nodes: any[] = [];
            Object.entries(groups).forEach(([key, values]) => {
              const node = { title: key, value: key, selectable: false };
              const children = [];
              values.map((v, n) => {
                const child = { title: v.name, value: v.id };
                children.push(child);
              });
              node.children = children;
              nodes.push(node);
            });
            console.log('nodes', nodes);
            attributeNodes[attr.id] = nodes;
            setAttributeNodes({
              ...attributeNodes,
            });
            return nodes;
          } else {
            return [];
          }
        }}
      />
    </ProForm.Item>
  );
}

function attributeText(attr: any) {
  return (
    <ProForm.Item>
      <ProFormText
        width="lg"
        name={'fields_' + attr.field}
        label={attr.name}
        placeholder={attr.name}
      />
    </ProForm.Item>
  );
}

const handleCreateResource = async (mod: string, source: string, data: any) => {
  return shopapi.ResourceApi.createOrSave(mod, source, data)
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

// function fetchAttributeValues(attributes: any[]) {
//   const ids = attributes.reduce((prev, attr) => prev.concat(attr.id), []);
//   return shopapi.ResourceApi.fetchResources('basic', 'attributeValue', {
//     attributeId: { '@IN': ids },
//   }).then((res) => {
//     if (res) {
//       const attrsMap = {};
//       res.forEach((attrValue) => {
//         const field = attrValue.attribute?.field || '';
//         const group = attrValue.attributeValue?.attributeValueGroup?.name || '默认';
//         if (field in attrsMap) {
//           const attrs = attrsMap[field];
//           attrs.push({ id: attrValue.id, name: attrValue.name, group: group });
//         } else {
//           attrsMap[field] = [{ id: attrValue.id, name: attrValue.name, group: group }];
//         }
//       });
//       // const attrMap = res.reduce((prev: any, attr: any) => (prev[attr.id] = attr), {});
//       console.log('attr values', attrsMap);
//       return attrsMap;
//     } else {
//       return {};
//     }
//   });
// }

export default () => {
  const { id } = useParams();
  const [goodsTypeId, setGoodsTypeId] = useState('');

  const [attributes, setAttributes] = useState([]);
  const [attributesMap, setAttributesMap] = useState({});
  const [attributeNodes, setAttributeNodes] = useState({});

  const history = useHistory();

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id),
  );

  const attr = { field: 1, name: 'test', id: '1501009496726900738' };
  return (
    <ProForm<{
      name: string;
      company: string;
      fields: any;
    }>
      onFinish={async (values) => {
        // await waitTime(2000);

        // message.success('提交成功');
        const fields = {};
        Object.entries(values).forEach(([key, v]) => {
          if (key.startsWith('fields_')) {
            const fid = key.substring(7);
            fields[fid] = v;
          }
        });
        values.fields = fields;
        console.log('onfinish', values);
        handleCreateResource(module, resource, values).then((res) => {
          if (res) {
            history.push('/goods/goods');
          }
        });
      }}
      onValuesChange={(changeValues) => {
        const { typeId } = changeValues;
        if (typeId !== undefined) {
          setGoodsTypeId(typeId);
          shopapi.ResourceApi.fetchResource('goods', 'goodsType', typeId).then((data) => {
            console.log(data);
            if (data && data.attributes) {
              setAttributes(data.attributes);
              // fetchAttributeValues(data.attributes).then((res) => {
              //   setAttributesMap(res);
              // });
            }
          });
        }
      }}
      request={async () => {
        if (id === undefined) {
          return {
            isSale: 1,
            status: 1,
          };
        }
        const goods = await shopapi.ResourceApi.fetchResource(module, resource, id);
        if (goods && goods.typeId !== null) {
          setGoodsTypeId(goods.typeId);
          shopapi.ResourceApi.fetchResource('goods', 'goodsType', goods.typeId).then((data) => {
            if (data && data.attributes !== null) {
              setAttributes(data.attributes);
              // fetchAttributeValues(data.attributes).then((res) => {
              //   setAttributesMap(res);
              // });
            }
          });
        }
        if (goods.fields) {
          Object.entries(goods.fields).forEach(([key, value]) => {
            goods['fields_' + key] = value;
          });
        }
        console.log('goods', goods);
        return goods;
      }}
      submitter={{
        // 配置按钮文本
        searchConfig: {
          resetText: '返回',
          submitText: '提交',
        },
        // 配置按钮的属性
        resetButtonProps: {
          style: {
            // 隐藏重置按钮
            display: 'none',
          },
        },
        submitButtonProps: {},

        // 完全自定义整个区域
        render: (props, doms) => {
          console.log(props);
          return [
            <Button type="primary" block key="submit" onClick={() => props.form?.submit?.()}>
              提交
            </Button>,
            <Button key="rest" onClick={() => history.push('/' + module + '/' + resource)}>
              返回
            </Button>,
          ];
        },
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="lg"
          name="name"
          label="名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
        />
        <ProFormText width="lg" name="code" label="编号" placeholder="编号" />

        <ProFormSelect
          name="typeId"
          label="商品大类"
          width="lg"
          placeholder="商品大类"
          rules={[{ required: true }]}
          request={async () => {
            const res = await shopapi.ResourceApi.fetchEnumResources('goods', 'goodsType');
            return res;
          }}
        />

        <ProFormSelect
          name="categoryId"
          label="类别"
          width="lg"
          placeholder="类别"
          rules={[{ required: true }]}
          request={async (params) => {
            console.log('select 类别', params);
            const res = await shopapi.ResourceApi.fetchEnumResources('goods', 'goodsCategory');
            return res;
          }}
        />
        <ProFormSelect
          name="brandId"
          label="品牌"
          width="lg"
          placeholder="品牌"
          rules={[{ required: true }]}
          request={async () => {
            const res = await shopapi.ResourceApi.fetchEnumResources('basic', 'brand');
            return res;
          }}
        />
        <ProFormSelect
          name="unitId"
          label="单位"
          placeholder="单位"
          width="lg"
          rules={[{ required: true }]}
          request={async () => {
            const res = await shopapi.ResourceApi.fetchEnumResources('basic', 'unit');
            return res;
          }}
        />

        <ProFormText width="lg" name="price" label="销售价格" placeholder="销售价格" />
        <ProFormText width="lg" name="stock" label="库存" placeholder="库存" />
      </ProForm.Group>

      <ProFormTreeSelect
        name={'fields_' + attr.field}
        placeholder={attr.name}
        allowClear
        width="lg"
        fieldProps={{
          showSearch: false,
          multiple: true,
          fieldNames: {
            label: 'title',
          },
          filterTreeNode: false,
          treeDefaultExpandAll: true,
          onSearch: () => {
            console.log('on search');
          },
        }}
        request={async (params) => {
          console.log('on select params', params);
          if (params.keyWords === '') {
            return attributeNodes[attr.id] || [];
          }
          const res = await shopapi.ResourceApi.fetchResources('basic', 'attributeValue', {
            attributeId: attr.id,
          });
          if (res) {
            console.log('attributeValue', res);
            const groups: any = {};
            res.forEach((v) => {
              if (v.attributeValueGroupId === null || v.attributeValueGroupId === undefined) {
                const group = groups['默认'] || [];
                group.push(v);
                groups['默认'] = group;
              }
            });
            res.forEach((v) => {
              if (v.attributeValueGroupId !== null && v.attributeValueGroup !== null) {
                const group = groups[v.attributeValueGroup.name] || [];
                group.push(v);
                groups[v.attributeValueGroup.name] = group;
              }
            });
            const nodes: any[] = [];
            Object.entries(groups).forEach(([key, values]) => {
              const node = { title: key, value: key, selectable: false };
              const children = [];
              values.map((v, n) => {
                const child = { title: v.name, value: v.id };
                children.push(child);
              });
              node.children = children;
              nodes.push(node);
            });
            console.log('nodes', nodes);
            attributeNodes[attr.id] = nodes;
            setAttributeNodes({
              ...attributeNodes,
            });
            return nodes;
          } else {
            return [];
          }
        }}
      />

      <ProForm.Group>
        {attributes.map(function (object: any, i) {
          if (object.componentType === 3) {
            return attributeTree(object, setAttributeNodes, attributeNodes);
          } else {
            return attributeText(object);
          }
        })}
      </ProForm.Group>
      {/* <ProForm.Item
        label="数组数据"
        name="dataSource"
        initialValue={defaultData}
        trigger="onValuesChange"
      >
        <EditableProTable<DataSourceType>
          rowKey="id"
          toolBarRender={false}
          columns={columns}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            position: 'top',
            record: () => ({
              id: Date.now(),
              addonBefore: 'ccccccc',
              decs: 'testdesc',
            }),
          }}
          editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableRowKeys,
            actionRender: (row, _, dom) => {
              return [dom.delete];
            },
          }}
        />
      </ProForm.Item> */}

      <ProFormUploadButton
        name="upload"
        label="图片"
        max={5}
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
        }}
        action="/upload.do"
        extra=""
      />

      <ProFormText width="xxl" name="description" label="描述" />
      <ProFormTextArea width="xxl" name="detail" label="详情" />

      <ProForm.Group>
        <ProFormRadio.Group
          name="isSale"
          label="上下架"
          width="md"
          options={[
            {
              label: '上架',
              value: 1,
            },
            {
              label: '下架',
              value: 0,
            },
          ]}
        />
        <ProFormRadio.Group
          name="status"
          label="启用状态"
          width="md"
          options={[
            {
              label: '启用',
              value: 1,
            },
            {
              label: '禁用',
              value: 0,
            },
          ]}
        />
      </ProForm.Group>
    </ProForm>
  );
};
