/* eslint-disable jsx-a11y/iframe-has-title */
import React, { Fragment } from 'react';
// import FetchDataTable from '../../../../../../../Common/FetchDataTable';

/**
 *  考核导航-计算日志组件
 */
class CalculationLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  fetchColumns = () => {
    const columns = [
      {
        title: '薪酬月份',
        dataIndex: 'xcyf',
        key: 'xcyf',
      },
      {
        title: '营业部',
        dataIndex: 'yyb',
        key: 'yyb',
      },
      {
        title: '薪酬状态',
        dataIndex: 'xczt',
        key: 'xczt',
      },
      {
        title: '开始时间',
        dataIndex: 'kssj',
        key: 'kssj',
      },
      {
        title: '结束时间',
        dataIndex: 'jssj',
        key: 'jssj',
      },
      {
        title: '总任务数',
        dataIndex: 'zrws',
        key: 'zrws',
      },
      {
        title: '已计算任务数',
        dataIndex: 'yjsrws',
        key: 'yjsrws',
      },
      {
        title: '计算结果',
        dataIndex: 'jsjg',
        key: 'jsjg',
      },
      {
        title: '用时',
        dataIndex: 'ys',
        key: 'ys',
      },
      {
        title: '执行人',
        dataIndex: 'zxr',
        key: 'zxr',
      },
    ];
    return columns;
  }
  render() {
    // const tableProps = {
    //   style: { marginTop: '17px' },
    //   rowKey: 'jsrz',
    //   columns: this.fetchColumns(),
    //   locale: { emptyText: '暂无数据' },
    //   fetch: {
    //     service: null,
    //     params: {
    //     },
    //   },
    //   isPagination: false,
    // };
    const { orgNo, mon, depClass } = this.props;
    const livebosPrefix = localStorage.getItem('livebos');
    const url = `${livebosPrefix}/UIProcessor?Table=cx_XCKHJSRZ&I_ORG_NO=${orgNo}&I_DEP_CLASS=${depClass}&I_MON=${mon}&ParamAction=true`;
    return (
      <Fragment>
        {/* <div style={{ margin: '10px' }}>
          <FetchDataTable {...tableProps} />
        </div > */}
        <iframe width="100%" style={{ height: '35rem' }} frameBorder="0" src={url} />
      </Fragment >
    );
  }
}
export default CalculationLog;
