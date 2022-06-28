/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import { Card, message, Row, Col } from 'antd';
import ScrollToNormalTable from '../../../../../../Common/ScrollToNormalTable';
import { FetchqueryCheckPayment, FetchoperateCheckSalaryList } from '../../../../../../../services/EsaServices/navigation';
import DrawerContent from '../DrawerContent';
import Buttons from './Buttons';

/**
 *  核对薪酬表格组件
 */

const status = { 0: '未核对', 1: '正确', 2: '错误' };
class CheckSalaryTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      dataSource: [],
      drawer: { // 薪酬表单抽屉组件参数
        chosenRowData: {},
        drawerVisible: false,
        onCloseDrawer: this.onCloseDrawer,
      },
      indexDetailModal: { // 指标详情弹出框参数
        modalVisible: false,
        selectedIndexRecord: {},
      },
      pagination: {
        current: 1, // 当前页数
        pageSize: 10, // 每页记录条数
        total: -1, // 总条数
      },
    };
  }
  componentDidMount() {
    const { queryParams } = this.props;
    if (queryParams.mon && queryParams.orgNo) {
      this.queryCheckPayment(queryParams);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { queryParams: after } = nextProps;
    const { queryParams: before } = this.props;
    if (JSON.stringify(after) !== JSON.stringify(before)) {
      this.queryCheckPayment(after);
    }
  }

  _setScrollElement = (scrollElement) => {
    if (scrollElement) {
      this.setState({
        scrollElement,
      });
    }
  }
  // 核对薪酬列表
  queryCheckPayment = (params) => {
    const { pagination } = this.state;
    const finalParams = { paging: 1, sort: '', total: -1, ...pagination, ...params };
    FetchqueryCheckPayment(finalParams).then((res) => {
      const { records = [], note = {}, total = pagination.total } = res;
      const { current, pageSize } = finalParams;
      this.setState({
        columns: this.fetchColumns(note),
        dataSource: this.fetchDataSource(records),
        pagination: { ...pagination, current, pageSize, total },
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  // 核对薪酬操作
  operateCheckSalaryList = (params) => {
    FetchoperateCheckSalaryList({ ...params }).then((res) => {
      const { code, note } = res;
      if (code > 0) {
        message.success(note);
        // 刷新表格
        const { queryParams } = this.props;
        this.queryCheckPayment(queryParams);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  // 薪酬表单抽屉
  showDrawer = (record) => {
    const { drawer } = this.state;
    this.setState({
      drawer: {
        ...drawer,
        drawerVisible: true,
        chosenRowData: record,
      },
    });
  };
  onCloseDrawer = () => {
    const { drawer } = this.state;
    this.setState({
      drawer: {
        ...drawer,
        drawerVisible: false,
        chosenRowData: {},
      },
    });
  }
  operSalary = (e, row, status) => {
    e.stopPropagation();
    if (row.状态 === status) {
      return false;
    }
    const { 营业部ID: orgNo, 月份: mon, 人员编号: empNo } = row;
    const params = {
      orgNo,
      mon,
      empNo,
      status,
    };
    this.operateCheckSalaryList(params);
  }
  fetchColumns = (columsData) => {
    const { type } = this.props;
    const columns = [];
    // 非纯表格显示操作列
    if (type === 0) {
      // 操作列图标class对象
      const operateIconClasses = {
        check: { normal: 'blue iconfont icon-check-circle', fill: 'blue iconfont icon-check-circle-fill' },
        warning: { normal: 'blue iconfont icon-warning-circle pl6', fill: 'red iconfont icon-warning-circle-fill pl6' },
      };
      const operColumn = {
        title: '操作',
        label: '操作',
        dataIndex: 'dataSts',
        key: 'dataSts',
        align: 'center',
        width: 100,
        render: (value, row) => {
          let classes = [];
          if (row.状态 === status[0]) {
            classes = [operateIconClasses.check.normal, operateIconClasses.warning.normal];
          } else if (row.状态 === status[1]) {
            classes = [operateIconClasses.check.fill, operateIconClasses.warning.normal];
          } else if (row.状态 === status[2]) {
            classes = [operateIconClasses.check.normal, operateIconClasses.warning.fill];
          }
          return (
            <div className="fs16">
              <i className={classes[0]} onClick={e => this.operSalary(e, row, 1)} />
              <i className={classes[1]} onClick={e => this.operSalary(e, row, 2)} />
            </div>
          );
        },
      };
      columns.push(operColumn)
    }
    const headData = columsData.split(',');
    headData.forEach((item) => {
      columns.push({
        id: item,
        title: item,
        label: item,
        dataIndex: item,
        key: item,
        dataKey: item,
        align: 'center',
        width: item === '人员编号' ? 220 : 180,
        ellipsis: true,
      });
    });
    return columns;
  }
  fetchDataSource = (bodyData) => {
    const dataSource = [];
    bodyData.forEach((item, index) => {
      const mapFiled = JSON.parse(item.mapFiled);
      const mapTmp = [];
      mapFiled.forEach((mapItem) => {
        if (mapItem.name === '状态') {
          // eslint-disable-next-line no-nested-ternary
          mapTmp[mapItem.name] = status[mapItem.value];
        } else {
          mapTmp[mapItem.name] = mapItem.value;
        }
      });
      mapTmp["key"] = index;
      // dataSource.push({ ...mapTmp, key: index});
      dataSource[index] = mapTmp;
    });
    return dataSource;
  }
  handlePFSChange = (current, pageSize) => {
    const { queryParams } = this.props;
    const { pagination } = this.state;
    this.setState({
      pagination: { ...pagination, current, pageSize }
    }, () => {
      if (queryParams.mon && queryParams.orgNo) {
        this.queryCheckPayment({ ...queryParams });
      }
    });

    // const { fetch, onChange } = this.props;
    // if (onChange) {
    //   onChange(pagination, filters, sorter);
    // }
    // this.fetchTableData({ pagination, filters, sorter, fetch });
  }
  render() {
    const { drawer, drawer: { chosenRowData = {} }, dataSource, columns, pagination } = this.state;
    const { queryParams, theme } = this.props;
    const tableParams = {
      empNo: chosenRowData.人员编号,
      mon: queryParams.mon,
      orgNo: queryParams.orgNo,
    };
    const tableProps = {
      style: { margin: '0 2rem', height: '100%' },
      className: 'm-table-customer',
      columns,
      loading: false,
      fixedHeaderEnabled: true,
      rowKey: 'rowKey',
      bordered: true,
      dataSource,
      isColumnDrag: 1,
      // fixedColumnCount: 1,
      pagination: {
        className: 'm-paging',
        showLessItems: true,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: this.handlePFSChange, // 分页、排序、筛选变化时的操作
        ...pagination,
      },
      scrollElement: this.state.scrollElement,
      tableScrollWidth: (columns.length * 180),
      onRow: (record) => {
        return {
          onClick: () => {
            this.showDrawer(record);
          },
        };
      },
      scroll: {
        x: (columns.length * 180), y: false
      },
    };
    return (
      <Fragment>
        <Card style={{ height: '900px', overflow: 'auto' }} className="m-card">
          <Row style={{ padding: '2px 2rem' }}>
            <Col span={24}>
              {/* 操作按钮 */}
              <Buttons queryParams={queryParams} count={pagination.total} />
            </Col>
          </Row>
          {/* <FakeTable {...tableProps} />  */}
          <div ref={this._setScrollElement}>
            {this.state.scrollElement && <ScrollToNormalTable {...tableProps} columns={columns} fixedColumnCount={4} />}
          </div>
          <DrawerContent
            {...drawer}
            tableParams={tableParams}
            theme={theme}
            chosenRowData={chosenRowData}
            payload={tableParams}
          />
        </Card>
      </Fragment >
    );
  }
}
export default CheckSalaryTable;
