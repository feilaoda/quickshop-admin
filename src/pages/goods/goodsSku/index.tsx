// import React from 'react';
import { Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { convertData } from '@/utils/convert';
import { Button, Card, Image, Switch } from 'antd';
import QuickTable from '@/components/QuickTable';
import type { QuickColumns } from '@/components/QuickTable';
import shopapi from '@/services/shopapi';
import { useParams, useHistory } from 'umi';
import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';

const module = 'goods';
const resource = 'goodsSku';
const SaleStatusEnum = {
  1: { text: '上架', status: 1 },
  0: { text: '下架', status: 0 },
};

const StatusEnum = {
  1: { text: '启用', status: 1 },
  0: { text: '禁用', status: 0 },
};

export type TableListItem = {
  id: string;
  goodsId: string;
  name: string;
  icon: string;
  sort: number;
  parent: string;
  remark: string;
};

const handleDeleteData = (id: any) => {
  console.log('delete data', id);
};

function filterData(data: any[]) {
  convertData(data, 'category.name');
  convertData(data, 'brand.name');
  convertData(data, 'unit.name');
  return data;
}

function switchStatus(id: string, status) {
  console.log('switch status', id, status);
  const stat = status ? 1 : 0;
}

const columns: QuickColumns<TableListItem>[] = [
  {
    title: '名称',
    dataIndex: 'name',
    searchType: 'like',
    width: 200,
  },
  {
    title: '编码',
    dataIndex: 'code',
  },

  {
    title: '市场价格',
    dataIndex: 'marketPrice',
  },
  {
    title: '销售价格',
    dataIndex: 'price',
  },
  {
    title: '库存',
    dataIndex: 'stock',
    search: false,
  },
  {
    title: '上架',
    dataIndex: 'isSale',
    valueEnum: SaleStatusEnum,
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: StatusEnum,
  },
  {
    title: '操作',
    width: 180,
    key: 'option',
    valueType: 'option',
    render: (_, row) => [
      <Link
        key={'edit' + row.id}
        to={'/' + module + '/' + resource + '/createOrEdit/' + row.goodsId + '/' + row.id}
      >
        编辑
      </Link>,
      <a key={row.id} onClick={() => handleDeleteData(row.id)}>
        删除
      </a>,
    ],
  },
];

export default () => {
  const { goodsId } = useParams();
  const history = useHistory();
  const [goods, setGoods] = useState({});

  const toolBarRender = () => {
    return [
      <Button
        key="button"
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => {
          history.push('/goods/goodsSku/createOrEdit/' + goodsId);
        }}
      >
        新建
      </Button>,
      <Button
        key="button"
        type="default"
        onClick={() => {
          history.push('/goods/goods');
        }}
      >
        返回
      </Button>,
    ];
  };

  useEffect(() => {
    shopapi.ResourceApi.fetchResource('goods', 'goods', goodsId).then((res) => {
      if (res) {
        setGoods(res);
      }
    });
  }, [goodsId]);

  const beforeSearchSubmit = (params) => {
    params.goodsId = goodsId;
    console.log('before search submit', params);
  };
  return (
    <PageContainer title={false}>
      <Card>{goods.name}</Card>
      <QuickTable
        module={module}
        beforeSearchSubmit={beforeSearchSubmit}
        resource={resource}
        title="SKU列表"
        columns={columns}
        afterQuery={filterData}
        createUrl={'/goods/goodsSku/createOrEdit/' + goodsId}
        toolBarRender={toolBarRender}
      />
    </PageContainer>
  );
};
