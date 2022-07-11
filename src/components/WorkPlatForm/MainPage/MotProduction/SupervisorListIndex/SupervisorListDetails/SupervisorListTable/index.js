import React, { Fragment } from 'react';
import { Row, Button, Checkbox, message, Popover } from 'antd';
import SupervisorListModal from './SupervisorListModal';
import BasicDataTable from '../../../../../../Common/BasicDataTable';
import BasicModal from '../../../../../../Common/BasicModal';
import moment from 'moment';
// 日期份选择控件
import 'moment/locale/zh-cn';
// 组件国际化
moment.locale('zh-cn');

/**
 * 考评人员结构配置
 */

class SupervisorListTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectAll: false,
      selectedRowKeys: [],
      selectedRows: [],
      productData: {
        records: [],
        total: 0,
        coldtl: '',
        qrySqlId: '',
      },
      current: 1,
      visible: false,
      height: 0,
    };
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.productData !== this.props.productData) {
      this.setState({
        productData: nextProps.productData,
      });
    }
    if (nextProps.current !== this.props.current) {
      this.setState({
        current: nextProps.current,
      });
    }
  }

  updateDimensions = () => {
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    height -= 109;
    this.setState({ height });
  };
  // 选择状态改变时的操作
  handleSelectChange = (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
    this.setState({
      selectAll: currentSelectAll,
      selectedRowKeys: currentSelectedRowKeys,
    });
  };
  handlePageChange = (page) => { // 页码改变时的回调
    const productParams = {
      current: page,
    };
    this.setState({
      current: page,
    });
    const { setPageState } = this.props;
    if (setPageState) {
      setPageState(productParams);
    }
  };
  handlePageSizeChange = (current, pageSize) => { // 分页大小改变回调
    const productParams = {
      current: 1,
      pageSize,
    };
    this.setState({
      current: 1,
    });
    const { setPageState } = this.props;
    if (setPageState) {
      setPageState(productParams);
    }
  };
  onAdd = () => {
    const { selectedRowKeys, selectAll } = this.state;
    if (!selectAll && selectedRowKeys.length === 0) {
      message.error('请选择记录');
    } else {
      this.setState({
        visible: true,

      });
    }
  };
  // 模态框底部
  renderFooter = () => {
    return (
      <div className="operation">
        <Button className="m-btn-radius m-btn-headColor" htmlType="submit" type="primary"
                onClick={this.onSaveClick}>确定</Button>
        <Button className="m-btn-radius m-btn-gray" onClick={this.handleCancel}>取消</Button>
      </div>
    );
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  onSaveClick = () => {
    this.childModal.getItemsValue();
  };
  setVisible = (value) => {
    this.setState({
      visible: value,
    });
  };

  render() {
    const { loading } = this.props;
    const { productData: { records, total, coldtl, qrySqlId }, selectedRowKeys, current, selectAll, visible } = this.state;
    const modalProps = {
      width: '840px',
      height: '800px',
      title: '发起督导',
      visible,
      onCancel: () => {
        this.setState({ visible: false });
      },
      footer: this.renderFooter(),
    };
    let columns = [];
    if (coldtl !== undefined && coldtl !== '') {
      const dtl = coldtl.split(';');
      columns = dtl.map((item) => {
        const data = item.split('|');
        return {
          title: <div title={data[1]} className="supervisor-list-table-title">{data[1]}</div>,
          dataIndex: data[0],
          key: data[0],
          align: 'center',
          width: 150,
          render: (text) => {
            if (text !== '0') {
              const obj = JSON.parse(text);
              const content = [];
              if (obj.hasOwnProperty('员工姓名')) {
                content.push(<div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  lineHeight: '24px',
                  height: '24px',
                }}>{obj['员工姓名']}</div>);
                delete obj['员工姓名'];
              }
              for (const key in obj) {
                content.push(<div style={{
                  fontSize: '12px',
                  lineHeight: '22px',
                  height: '22px',
                  minWidth: '150px',
                }}>{key}
                  <div style={{ float: 'right', paddingLeft: '10px' }}>{obj[key]}</div>
                </div>);
              }
              return (
                <Popover placement="rightTop"
                         content={content}>
                  <Checkbox checked={true} className="supervisor-list-table-check"/>
                </Popover>
              );
            } else {
              return (<Checkbox checked={false} disabled className="supervisor-list-table-check"/>);
            }
          },
        };
      });
    }

    // 新增一个写死的列
    const orgnmcol = [
      {
        title: '督导月份',
        width: '150px',
        dataIndex: 'SPVS_MO',
        key: 'SPVS_MO',
        align: 'center',
        fixed: 'left',
        render: (text) => {
          let yf = text.toString();
          if (text && text !== undefined) {
            yf = yf.replace(/(\d{4})(\d{2})/, '$1-$2');
          }
          return yf;
        },
      },
      {
        title: '主体营业部',
        width: '150px',
        dataIndex: 'MAIN_ORG_NM',
        key: 'MAIN_ORG_NM',
        align: 'center',
        fixed: 'left',
      },
      {
        title: '营业部',
        width: '150px',
        dataIndex: 'ORG_NAME',
        key: 'ORG_NAME',
        align: 'center',
        fixed: 'left',
      },
      {
        title: '员工',
        width: '150px',
        dataIndex: 'STF_NM',
        key: 'STF_NM',
        align: 'center',
        fixed: 'left',
      },
      {
        title: '人员类别',
        width: '150px',
        dataIndex: 'STF_CL_NM',
        key: 'STF_CL_NM',
        align: 'center',
        fixed: 'left',
      },
    ];
    columns = [...orgnmcol, ...columns];
    let scrollX = 0;
    let width = 0;
    if (this.scrollElement) {
      width = (this.scrollElement.clientWidth > (columns.length * 150)) ? (columns.length * 150) + 65 : this.scrollElement.clientWidth;
      scrollX = (this.scrollElement.clientWidth < (columns.length * 150)) ? (columns.length * 150) + 17 : 0; // 是否需要表格横向滚动条
    }
    const tableProps = {
      rowKey: 'SPVS_ID',
      style: { marginTop: '14px', width: width },
      loading, // 是否显示加载中
      columns,
      dataSource: records,
      chosenRowKey: [],
      rowSelection: {
        type: 'checkbox',
        fixed: 'left',
        crossPageSelect: total !== 0, // checkbox开启跨页全选
        selectAll, // 是否全选
        selectedRowKeys, // 选中(未全选)/取消选中(全选)的rowkey值
        onChange: this.handleSelectChange, // 选择状态改变时的操作
      },
      pagination: {
        //   className: 'm-paging',
        showQuickJumper: true,
        showLessItems: true,
        showSizeChanger: true,
        total,
        current,
        pageSizeOptions: ['5', '10', '15', '20'],
        showTotal: () => `共${total}条`,
        onChange: this.handlePageChange,
        onShowSizeChange: this.handlePageSizeChange,
      },
      scroll: { x: scrollX === 0 ? '' : scrollX },
      ...this.props.table,
    };
    return (
      <Fragment>
        <Row style={{ margin: '0 1.8rem' }}>
          <Button className="factor-bottom m-btn-table-headColor" onClick={this.onAdd}>发起督导</Button>
          <div style={{ overflowX: 'auto' }} id='supervisorListTable' ref={(c) => {
            this.scrollElement = c;
          }}>

            <BasicDataTable
              className="factor-table"
              {...tableProps}
            />
          </div>
          <BasicModal {...modalProps}>
            <SupervisorListModal qrySqlId={qrySqlId} selectedRowKeys={selectedRowKeys} selectAll={selectAll}
                                 setVisible={this.setVisible} wrappedComponentRef={(c) => {
              this.childModal = c;
            }}/>
          </BasicModal>
        </Row>
      </Fragment>
    );
  }
}

export default SupervisorListTable;
