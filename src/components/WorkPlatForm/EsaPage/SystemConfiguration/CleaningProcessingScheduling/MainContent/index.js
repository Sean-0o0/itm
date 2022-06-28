import React, { Fragment } from 'react';
import { Row, Col, Button } from 'antd';
import FetchDataTable from '../../../../../Common/FetchDataTable';
/**
 * 清洗加工调度主要内容
 */

class MainContent extends React.Component {
  componentDidMount() {

  }

  componentWillReceiveProps() {

  }

  getColumns = () => {
    const columns = [{
      title: '目标中文名称',
      dataIndex: 'cname',
      render: text => text || '--',
    }, {
      title: '目标名称',
      dataIndex: 'name',
      render: text => text || '--',
    }, {
      title: '过程名称',
      dataIndex: 'procname',
      render: text => text || '--',
    }, {
      title: '处理状态',
      dataIndex: 'statue',
      render: text => text || '--',
    }, {
      title: '依赖对象是否执行',
      dataIndex: 'isdo',
      render: text => text || '--',
    }, {
      title: '依赖对象(源表)',
      dataIndex: 'sourcetable',
      render: text => text || '--',
    }, {
      title: '运行日志',
      dataIndex: 'log',
      render: text => text || '--',
    }, {
      title: '运行开始时间',
      dataIndex: 'starttime',
      render: text => text || '--',
    }, {
      title: '运行结束时间',
      dataIndex: 'overtime',
      render: text => text || '--',
    }, {
      title: '代价(秒)',
      dataIndex: 'cost',
      render: text => text || '--',
    }];
    return columns;
  }

  getDataSource = () => {
    const data = [{}];
    return data;
  }

  getTableProps = () => {
    const tableProps = {
      rowKey: 'key',
      columns: this.getColumns(),
      fetch: {
        service: '',
        params: '',
      },
      locale: { emptyText: '暂无数据' },
    };
    return tableProps;
  }


  render() {
    const tableProps = this.getTableProps();
    return (
      <Fragment>
        <Row>
          <Col>
            <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" style={{ margin: '0 0 2rem 4.7rem' }}>开始执行</Button>
          </Col>
        </Row>
        <Row style={{ margin: '0 1.5rem 0 4.7rem' }}>
          <Col>
            <FetchDataTable
              className="m-table-customer m-table-border ant-table-wrapper"
              {...tableProps}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default MainContent;
