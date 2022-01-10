import React from 'react';
import { useHistory } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

declare type QuickTableProps = {
  title?: string;
  columns?: any;
  queryAction?: any;
  afterQuery?: any;
  createUrl?: string;
};

const QuickTable = (props: QuickTableProps) => {
  const history = useHistory();
  const { title, columns, queryAction, afterQuery, createUrl } = props;
  return (
    <ProTable
      columns={columns}
      request={async (params, sorter, filter) => {
        const res = await queryAction(params);
        console.log('get users', res);
        let dataSource = [];
        if (res != false) {
          const data = afterQuery(res.data);
          dataSource = data;
        }
        console.log(params, sorter, filter);
        return Promise.resolve({
          data: dataSource,
          success: true,
          total: res.page?.total,
        });
      }}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showQuickJumper: true,
      }}
      search={{
        layout: 'vertical',
        defaultCollapsed: false,
      }}
      dateFormatter="string"
      toolbar={{
        title: title,
      }}
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => {
            history.push(createUrl);
          }}
        >
          新建
        </Button>,
      ]}
    />
  );
};

export default QuickTable;
