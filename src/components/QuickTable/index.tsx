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
  request?: any;
  beforeSearchSubmit?: any;
  afterQuery?: any;
  createUrl?: string;
  addDisable?: boolean;
  toolBarRender: any;
};

const QuickTable = (props: QuickTableProps) => {
  const history = useHistory();
  const {
    module,
    resource,
    title,
    schema,
    columns,
    request,
    beforeSearchSubmit,
    afterQuery,
    createUrl,
    addDisable,
    toolBarRender,
  } = props;
  // if (schema) {
  //   const newColumns = convertSchemaToColumns(schema);
  // }

  const searchMapping = useMemo(() => {
    const searchs = {};
    columns?.forEach((column) => {
      if (column.searchType && column.dataIndex) {
        searchs['' + column.dataIndex] = '_' + column.searchType.toLowerCase();
      }
    });
    return searchs;
  }, [resource]);

  return (
    <ProTable
      columns={columns}
      request={async (params, sorter, filter) => {
        console.log('get table params', params);
        if (beforeSearchSubmit) {
          beforeSearchSubmit(params);
        }
        Object.keys(params).forEach((key) => {
          if (searchMapping[key]) {
            const value = params[key];
            const op: string = searchMapping[key];
            const ops = {};
            ops[op] = value;
            delete params[key];
            // params[key + '$' + searchMapping[key]] = value;
            params[key] = ops;
          }
        });

        const action = request
          ? request
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
      // rowKey="id"
      pagination={{
        pageSize: 10,
        showQuickJumper: true,
      }}
      search={{
        layout: 'vertical',
        defaultCollapsed: true,
        labelWidth: 'auto',
        optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
      }}
      dateFormatter="string"
      toolbar={{
        title: title,
      }}
      toolBarRender={() => {
        if (toolBarRender !== undefined) {
          return toolBarRender();
        } else {
          return [
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
          ];
        }
      }}
    />
  );
};

export default QuickTable;
