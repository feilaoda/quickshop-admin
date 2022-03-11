import React, { useEffect, useState } from 'react';
import { Button, Input, message, Tag } from 'antd';
import ProForm, {
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormTreeSelect,
} from '@ant-design/pro-form';
import { useParams, useHistory } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import shopapi from '@/services/shopapi';
const module = 'goods';
const resource = 'goodsSku';

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

export default () => {
  const { id, goodsId } = useParams();
  const [attributes, setAttributes] = useState([]);
  const history = useHistory();

  useEffect(() => {
    shopapi.ResourceApi.fetchResource('goods', 'goods', goodsId).then((res) => {
      if (res) {
        const values = {};
        res.attributeValues?.forEach((v) => {
          values[v.id] = { id: v.id, name: v.name, title: v.attribute?.name };
        });
        const attrs = [];
        if (res.fields !== null) {
          Object.entries(res.fields).forEach(([key, value]) => {
            // if(value )
          });
        }
      }
    });
  }, [goodsId]);

  return (
    <ProForm<{
      name: string;
      company: string;
      fields: any;
    }>
      onFinish={async (values) => {
        // await waitTime(2000);

        // message.success('提交成功');
        values.goodsId = goodsId;
        values.id = id;
        console.log('onfinish', values);

        handleCreateResource(module, resource, values).then((res) => {
          history.push('/goods/goodsSku/' + goodsId);
        });
      }}
      onValuesChange={(changeValues) => {
        const { typeId } = changeValues;
      }}
      request={async () => {
        if (id === undefined) {
          const goods = await shopapi.ResourceApi.fetchResource('goods', 'goods', goodsId);
          const goodsName = goods?.name;
          return {
            isSale: 1,
            status: 1,
            goodsName: goodsName,
          };
        }
        const res = await shopapi.ResourceApi.fetchResource(module, resource, id);
        res.goodsName = res.goods?.name;
        console.log('goodsSku', res);
        return res;
      }}
      submitter={{
        // 配置按钮文本
        searchConfig: {
          resetText: '返回',
          submitText: '提交',
        },
        // 配置按钮的属性
        // resetButtonProps: {
        //   style: {
        //     // 隐藏重置按钮
        //     display: 'none',
        //   },
        // },
        // submitButtonProps: {},

        // 完全自定义整个区域
        render: (props, doms) => {
          console.log(props);
          return [
            <Button type="primary" block key="submit" onClick={() => props.form?.submit?.()}>
              提交
            </Button>,
            <Button
              key="reset"
              onClick={() => history.push('/' + module + '/' + resource + '/' + goodsId)}
            >
              返回
            </Button>,
          ];
        },
      }}
    >
      <ProForm.Group>
        <ProFormText width="lg" name="goodsName" label="商品" placeholder="商品" />
        <ProFormText
          width="lg"
          name="name"
          label="名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
          rules={[{ required: true }]}
        />
        <ProFormText width="lg" name="code" label="编码" placeholder="编码" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          width="lg"
          min={0}
          fieldProps={{ precision: 2 }}
          name="marketPrice"
          label="市场价格"
          placeholder="市场价格"
          rules={[{ required: true }]}
        />
        <ProFormDigit
          width="lg"
          min={0}
          fieldProps={{ precision: 2 }}
          name="price"
          label="销售价格"
          placeholder="销售价格"
          rules={[{ required: true }]}
        />
        <ProFormDigit
          width="lg"
          min={0}
          fieldProps={{ precision: 0, defaultValue: 0 }}
          name="stock"
          label="库存"
          placeholder="库存"
        />
      </ProForm.Group>

      <ProForm.Group>
        {attributes.map(function (object: any, i) {
          if (object.componentType === 3) {
            return attributeTree(object);
          }
        })}
      </ProForm.Group>

      <ProFormTextArea width="lg" name="detail" label="详情" />

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
