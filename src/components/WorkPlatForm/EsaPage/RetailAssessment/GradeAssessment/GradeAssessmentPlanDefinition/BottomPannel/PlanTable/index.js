import React, { Fragment } from 'react';
import FetchDataTable from '../../../../../../../Common/FetchDataTable';

/**
 *  客户经理薪酬考核导航-计算考核-得分详细表格组件
 */

class PlanTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const detailColumns = [
      {
        title: '营业部',
        dataIndex: 'yyb',
        key: 'yyb',
      },
      {
        title: '考核类别',
        dataIndex: 'khlb',
        key: 'khlb',
      },
      {
        title: '定级类型',
        dataIndex: 'djlx',
        key: 'djlx',
      },
      {
        title: '考核公式',
        dataIndex: 'khgs',
        key: 'khgs',
      },
      {
        title: '公式描述',
        dataIndex: 'gsms',
        key: 'gsms',
      },
      {
        title: '创建人',
        dataIndex: 'cjr',
        key: 'cjr',
      },
      {
        title: '创建时间',
        dataIndex: 'cjsj',
        key: 'cjsj',
      },
      {
        title: '创建IP',
        dataIndex: 'cjip',
        key: 'cjip',
      },
    ];

    const dataSource = [
      {
        key: '0',
        yyb: '信息部',
        khlb: '证券经纪人',
        djlx: '升级',
        khgs: '{$S{DASDASDASDAD}}',
        gsms: '方法发斯蒂芬松材线虫',
        cjr: '冯小波',
        cjsj: '20200102 13:34:56',
        cjip: '6708',
      },
      {
        key: '1',
        yyb: '信息部',
        khlb: '证券经纪人',
        djlx: '升级',
        khgs: '{$S{DASDASDASDAD}}',
        gsms: '方法发斯蒂芬松材线虫',
        cjr: '冯小波',
        cjsj: '20200102 13:34:56',
        cjip: '6708',
      },
    ];

    const tableProps = {
      fetch: {
        service: null,
        params: {
        },
      },
      pagination: {
        pageSize: 5,
        paging: 1,
        total: 10,
      },
    };

    return (
      <Fragment>
        <FetchDataTable dataSource={dataSource} {...tableProps} columns={detailColumns} locale={{ emptyText: '暂无数据' }} />
      </Fragment >
    );
  }
}
export default PlanTable;
