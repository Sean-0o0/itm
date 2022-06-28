import React from 'react';
import { Table, message } from 'antd';
import { FetchqueryCheckPayment } from '../../../../../../../services/EsaServices/navigation';
import styles from './DrawerContent.less';

/**
 *  核对薪酬-薪酬表单表格
 */

class DrawerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      dataSource: [],
    };
  }
  componentWillMount() {
    this.setState({ columns: [], dataSource: [] });
  }
  componentDidMount() {
    const { tableParams = {} } = this.props;
    if (tableParams.empNo) {
      this.queryCheckPayment(tableParams);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { tableParams } = nextProps;
    if (JSON.stringify(tableParams) !== JSON.stringify(this.props.tableParams)) {
      if (tableParams.empNo) {
        this.queryCheckPayment(tableParams);
      }
    }
  }
  fetchColumns = (columsData) => {
    const columns = [];
    let column = [];
    const headData = columsData.split(',');
    let i = 0;
    headData.forEach((item) => {
      if (i === 6) {
        i = 1;
        columns.push(column);
        column = [];
      } else {
        i++;
      }
      column.push({
        title: item,
        dataIndex: item,
        className: `${styles.table}`,
        style: { "border-collapse": "collapse" },
        key: item,
        align: 'center',
        width: 200,
        ellipsis: true
      });
    });
    for (let i = 0; i < 6 - headData.length % 6 && column !== []; i++) {
      column.push({
        title: ' ',
        dataIndex: ' ',
        className: `${styles.table}`,
        style: { "border-collapse": "collapse" },
        key: i + 'null',
        align: 'center',
        width: 200,
        ellipsis: true
      });
    }
    if (column !== []) {
      columns.push(column);
    }
    return columns;
  }
  fetchDataSource = (bodyData) => {
    const dataSource = [];
    bodyData.forEach((item, index) => {
      const mapFiled = JSON.parse(item.mapFiled);
      const mapTmp = {};
      mapFiled.forEach((mapItem) => {
        if (mapItem.name === '状态') {
          // eslint-disable-next-line no-nested-ternary
          mapTmp[mapItem.name] = mapItem.value === 0 ? '未核对' : mapItem.value === 1 ? '正确' : mapItem.value === 2 ? '错误' : mapItem.value;
        } else {
          mapTmp[mapItem.name] = mapItem.value;
        }
      });
      dataSource.push({ ...mapTmp, key: index });
    });
    return dataSource;
  }
  // 核对薪酬列表
  queryCheckPayment = async (params) => {
    await FetchqueryCheckPayment({ ...params }).then((res) => {
      const { records = [], note = {} } = res;
      this.setState({
        columns: this.fetchColumns(note),
        dataSource: this.fetchDataSource(records),
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  render() {
    const { dataSource, columns } = this.state;
    return (

      columns.map(item => (
        <Table
          style={{ "border-collapse": "collapse" }}
          key={item.key}
          className={`fl m-table-customer ${styles.table}`}
          columns={item}
          bordered
          dataSource={dataSource}
          pagination={false}
        />
      ))
    );
  }
}

export default DrawerTable;
