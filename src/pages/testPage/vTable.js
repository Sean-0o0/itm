import React from 'react';
import arrayMove from 'array-move';
import { Row, Col } from 'antd';
// import Example from 'react-virtualized-table/dist/Example';
import VTable from '../../components/Common/VTable';

const ds = [
  { id: 1, name: '王泽昊01' },
  { id: 2, name: '王泽昊02' },
  { id: 3, name: '王泽昊03' },
  { id: 4, name: '王泽昊04' },
  { id: 5, name: '王泽昊05' },
  { id: 6, name: '王泽昊06' },
  { id: 7, name: '王泽昊07' },
  { id: 8, name: '王泽昊08' },
  { id: 9, name: '王泽昊09' },
  { id: 10, name: '王泽昊10' },
  { id: 11, name: '王泽昊11' },
  { id: 12, name: '王泽昊12' },
  { id: 13, name: '王泽昊13' },
  { id: 14, name: '王泽昊14' },
  { id: 15, name: '王泽昊15' },
  { id: 16, name: '王泽昊16' },
  { id: 17, name: '王泽昊17' },
  { id: 18, name: '王泽昊18' },
  { id: 19, name: '王泽昊19' },
  { id: 20, name: '王泽昊20' },
];

export default class VTableTestPage extends React.Component {
  state={
    tableDatas: {
      loading: true,
      rowKey: 'id',
      dataSource: [],
      pagination: {
        current: 1, // 当前页数
        pageSize: 20, // 每页记录条数
        total: 0, // 总条数
      },
      selectDatas: {
        selectAll: false,
        selectedRowKeys: [],
      },
    },
    columns: [
      { dataKey: 'id', label: '客户号' },
      { dataKey: 'name', label: '姓名' },
      { dataKey: 'eee', label: 'shdajgs你萨拉戈尼克斯兰萨拉曼德萨国民党', width: 600 },
      { dataKey: 'fffff', label: 'fffffffff' },
    ],
  }
  componentDidMount() {
    const { tableDatas } = this.state;
    this.getFakeDatas({ pagination: tableDatas.pagination }, (dataSource) => {
      tableDatas.loading = false;
      tableDatas.dataSource = dataSource;
      tableDatas.pagination.total = 100;
      this.setState({ tableDatas });
    });
  }
  // 选择状态改变时的操作
  onSelectChange = (currentSelectAll, currentSelectedRowKeys) => {
    const { tableDatas } = this.state;
    tableDatas.selectDatas.selectAll = currentSelectAll;
    tableDatas.selectDatas.selectedRowKeys = currentSelectedRowKeys;
    this.setState({ tableDatas });
  }
  onRowClick = (e, record) => { // eslint-disable-line
    e.stopPropagation();// 阻止事件冒泡
    // 行点击事件
    const { tableDatas } = this.state;
    const { rowKey } = tableDatas;
    tableDatas.chosenRowKey = record[rowKey];
    this.setState({ tableDatas });
  }
  onPagerPage = (current, pageSize) => {
    const { tableDatas } = this.state;
    tableDatas.pagination.current = current;// 修改页数
    tableDatas.pagination.pageSize = pageSize;// 修改页数
    tableDatas.loading = true;
    tableDatas.dataSource = [];

    this.setState({ tableDatas });
    this.getFakeDatas({ pagination: tableDatas.pagination }, (dataSource) => {
      tableDatas.loading = false;
      tableDatas.dataSource = dataSource;
      this.setState({ tableDatas });
    });
  }
  onLoadMore = () => {
    const { tableDatas } = this.state;
    const { pagination, dataSource } = tableDatas;
    tableDatas.loading = true;
    this.setState({ tableDatas });
    this.getFakeDatas({ pagination: { ...pagination, current: pagination.current + 1 } }, (newDataSource) => {
      tableDatas.loading = false;
      tableDatas.dataSource = [...dataSource, ...newDataSource];
      tableDatas.pagination.current = pagination.current + 1;
      tableDatas.pagination.total = 100;
      this.setState({ tableDatas });
    });
  }
  onDragEnd = (oldIndex, newIndex) => {
    // const { tableDatas } = this.state;
    // const { columns } = tableDatas;
    // tableDatas.columns = arrayMove(columns, oldIndex, newIndex);
    // console.info('000', new Date().getTime());
    // this.setState({ tableDatas });
    // console.info(111, new Date().getTime());

    const { columns } = this.state;
    const afterMove = arrayMove(columns, oldIndex, newIndex);
    this.setState({ columns: [...afterMove] });
  }
  getFakeDatas = async ({ pagination = this.state.pagination }, callback) => {
    const { current, pageSize } = pagination;
    // 造数据
    const dataSource = [];
    ds.forEach((item, index) => {
      if (index >= pageSize) return false;
      dataSource.push({
        ...item,
        id: index + (pageSize * (current - 1)),
        name: `${item.name.substring(0, 3)}${index + (pageSize * (current - 1))}`,
      });
    });
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟请求数据
    callback(dataSource);
  }
  render() {
    const { tableDatas: { loading, rowKey, pagination, dataSource, selectDatas: { selectAll, selectedRowKeys } }, columns } = this.state;
    const tableProps = {
      loading,
      fixedHeaderEnabled: true,
      rowKey,
      columns,
      dataSource,
      scrollElement: document.getElementById('scrollContent'),
      pagination: {
        ...pagination,
        onChange: this.onPagerPage,
      },
      rowSelection: {
        type: 'checkbox',
        crossPageSelect: true, // checkbox开启跨页全选
        showSelectedCount: true, // 显示选中条数
        // showSelectedText: count => `${count}lalalallaa`, // 自定义选中条数显示的文字
        selectAll, // 是否全选
        selectedRowKeys, // 选中(未全选)/取消选中(全选)的rowkey值
        onChange: this.onSelectChange, // 选择状态改变时的操作
      },
      fixedColumnCount: 1,
      onLoadMore: this.onLoadMore,
      onChange: this.onPFSChange, // 分页、排序、筛选变化时的操作
      onDragEnd: this.onDragEnd, // 拖动列
    };
    return (
      <div style={{ padding: 10, width: '100%' }}>
        <Row gutter={10}>
          <Col span={12}>
            <VTable {...tableProps} />
          </Col>
          <Col span={12}>
            {/* <Example /> */}
          </Col>
        </Row>
      </div>
    );
  }
}
