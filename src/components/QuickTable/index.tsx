import React, { useState, useMemo } from 'react';
import { useHistory } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import shopapi from '@/services/shopapi';

import type { ProColumns } from '@ant-design/pro-table';

const handleGetResources = (module: string, resource: string, params: any) => {
  return shopapi.ResourceApi.getResources(module, resource, params);
};

export declare type QuickColumns<T = any, ValueType = 'text'> = {
  searchType?: string;
} & ProColumns<T, ValueType>;

declare type QuickTableProps = {
  module: string;
  resource: string;
  title?: string;
  schema?: any;
  columns?: QuickColumns[];
  queryAction?: any;
  afterQuery?: any;
  createUrl?: string;
};

const QuickTable = (props: QuickTableProps) => {
  const history = useHistory();
  const { module, resource, title, schema, columns, queryAction, afterQuery, createUrl } = props;
  if (schema) {
    const newColumns = convertSchemaToColumns(schema);
  }

  const searchMapping = useMemo(() => {
    const searchs = {};
    columns?.forEach((column) => {
      if (column.searchType && column.dataIndex) {
        searchs['' + column.dataIndex] = column.searchType;
      }
    });
    return searchs;
  }, [resource]);

  return (
    <ProTable
      columns={columns}
      request={async (params, sorter, filter) => {
        console.log('get table params', params);
        Object.keys(params).forEach((key) => {
          if (searchMapping[key]) {
            params[key + '$' + searchMapping[key]] = params[key];
            delete params[key];
          }
        });

        const action = queryAction
          ? queryAction
          : (p: any) => {
              return handleGetResources(module, resource, p);
            };
        const res = await action(params);
        console.log('get users', res);
        let dataSource = [];
        if (res != false) {
          const data = afterQuery ? afterQuery(res.data) : res.data;
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
        labelWidth: 'auto',
        optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
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
            history.push(createUrl || '/' + module + '/' + resource + '/createOrEdit');
          }}
        >
          新建
        </Button>,
      ]}
    />
  );
};

export default QuickTable;
