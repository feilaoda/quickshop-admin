import { Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { convertData } from '@/utils/convert';
import { Image, Tag } from 'antd';
import QuickTable from '@/components/QuickTable';
import type { QuickColumns } from '@/components/QuickTable';
import shopapi from '@/services/shopapi';

import SaleSwitch from './SaleSwitch';

const module = 'goods';
const resource = 'goods';
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
  // console.log('switch status', id, status);
  const stat = status ? 1 : 0;
}

function onSaleChange(e, row) {
  console.log('onsalechange', e);
  if (e === false) {
    row.isSale = 1;
  } else {
    row.isSale = 0;
  }
}

function switchSale(row) {
  const checked = row.isSale === 1 ? false : true;
  return <SaleSwitch defaultChecked={checked} row={row} onChange={(e) => onSaleChange(e, row)} />;
}

function switchSaleText(text, row) {
  const checked = row.isSale === 1 ? true : false;
  if (checked) {
    return <Tag color="#87d068">{text}</Tag>;
  } else {
    return <Tag color="#aaa">{text}</Tag>;
  }
}

function statusText(text, row) {
  const checked = row.status === 1 ? true : false;
  if (checked) {
    return <Tag color="#87d068">{text}</Tag>;
  } else {
    return <Tag color="#aaa">{text}</Tag>;
  }
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
    width: 150,
  },
  {
    title: '图片',
    dataIndex: 'pic',
    search: false,
    render: (text) => <Image width={80} max-height={80} src={text || ''} />,
  },
  {
    title: '类别',
    dataIndex: 'category.name',
  },
  {
    title: '品牌',
    dataIndex: 'brand.name',
  },
  {
    title: '单位',
    dataIndex: 'unit.name',
  },

  {
    title: '价格',
    dataIndex: 'price',
    search: false,
  },
  {
    title: '库存',
    dataIndex: 'stock',
    search: false,
  },
  {
    title: '对照码',
    dataIndex: 'contrastCode',
    hideInTable: true,
  },

  {
    title: '净重',
    dataIndex: 'weight',
    hideInTable: true,
    search: false,
  },
  {
    title: '毛重',
    dataIndex: 'totalWeight',
    hideInTable: true,
    search: false,
  },
  {
    title: '长(cm)',
    dataIndex: 'length',
    hideInTable: true,
    search: false,
  },
  {
    title: '宽(cm)',
    dataIndex: 'width',
    hideInTable: true,
    search: false,
  },
  {
    title: '高(cm)',
    dataIndex: 'height',
    hideInTable: true,
    search: false,
  },
  {
    title: '体积(L)',
    dataIndex: 'cubage',
    hideInTable: true,
    search: false,
  },
  {
    title: '类别',
    dataIndex: 'type',
    hideInTable: true,
    search: false,
  },
  {
    title: '上架',
    dataIndex: 'isSale',
    valueEnum: SaleStatusEnum,
    render: (text, row) => {
      return switchSaleText(text, row);
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: StatusEnum,
    render: (text, row) => {
      return statusText(text, row);
    },
    // render: (text, row) => (
    //   <div>
    //     <div>
    //       {text} {row.id}
    //     </div>
    //     <Switch
    //       defaultChecked={row.status === 1 ? true : false}
    //       onChange={(v) => {
    //         switchStatus(row.id, v);
    //         row.status = 0;
    //       }}
    //     />
    //   </div>
    // ),
  },
  {
    title: '操作',
    width: 250,
    key: 'option',
    valueType: 'option',
    render: (_, row) => [
      <Link key={'sku' + row.id} to={'/' + module + '/goodsSku/' + row.id}>
        SKU管理
      </Link>,
      <div key={'status' + row.id}>{switchSale(row)}</div>,
      <Link key={'edit' + row.id} to={'/' + module + '/' + resource + '/createOrEdit/' + row.id}>
        编辑
      </Link>,

      <a key={'del' + row.id} onClick={() => handleDeleteData(row.id)}>
        删除
      </a>,
    ],
  },
];

export default () => {
  return (
    <PageContainer title={false}>
      <QuickTable
        module={module}
        resource={resource}
        deepQuery={true}
        title="类别列表"
        columns={columns}
        afterQuery={filterData}
      />
    </PageContainer>
  );
};
