/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import { Row, Input, message, Form, Select, Table, Button } from 'antd';
import { FetchQueryScheduleGroupTaskList, FetchscheduleGroupTaskMaintenance } from '../../../../../../../services/motProduction';
import BasicModal from '../../../../../../Common/BasicModal';
import ModalContent from './ModalContent';
/**
 * 分组定义---mot事件
 */
const { Search } = Input;
class MotEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 表格数据
      keyword: '', // 关键字
      uuid: '', //
      selectedRows: [], // 勾选的数据
      selectAll: false, // 是否全选
      visible: false,
      selectedRowKeys: [], // 表格选中记录
    };
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedItem.grpId) {
      this.fetchEventList(nextProps.selectedItem);
    }
  }

  fetchEventList = (selectedItem = {}) => {
    const { keyword = '' } = this.state;
    // const { selectItem = {} } = this.props;
    const { grpId = '' } = selectedItem;
    const payload = {
      grpId: Number(grpId),
      keyword,
      schdSt: '',
    };
    FetchQueryScheduleGroupTaskList(payload).then((res) => {
      const { code = 0, records = [], note = '' } = res;
      if (code > 0) {
        this.setState({
          data: records,
          uuid: note,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  fetchColumns = () => {
    const columns = [
      {
        title: '事件名称',
        dataIndex: 'evntNm',
        key: 'evntNm',
      },
      {
        title: '所属阶段',
        dataIndex: 'sbrdStg',
        key: 'sbrdStg',

      },
      {
        title: '重要程度',
        dataIndex: 'impt',
        key: 'impt',

      },
      {
        title: '分发范围',
        dataIndex: 'dstrRng',
        key: 'dstrRng',

      },

    ];

    return columns;
  }
  // 表格搜索
  handleSearch = (value) => {
    this.setState({
      keyword: value,
    }, () => {
      this.fetchEventList(this.props.selectedItem);
    });
  }

  // 新增点击
  addClick = () => {
    this.setState({
      visible: true,

    });
  }
  // 删除点击
  deleteClick = () => {
    const { selectedRows = [], selectAll, data = [] } = this.state;
    if (selectedRows.length === 0) {
      message.warning('未选中任何记录');
    } else {
      const { selectedItem } = this.props;
      const { grpId } = selectedItem;
      const { uuid = '' } = this.state;
      const chcidArr = [];


      // 点击了全选  筛选出未选中的ID
      if (selectAll) {
        data.map((dataItem) => {
          let total = 0;
          selectedRows.map((selectItem) => {
            if (dataItem.evntId !== selectItem.evntId) {
              total += 1;
            }
            if (total === selectedRows.length) {
              chcidArr.push(dataItem.evntId);
            }
          });
        });
      } else {
        // 未点击全选
        selectedRows.map((item) => {
          chcidArr.push(item.evntId);
        });
      }

      const objIdSql = {
        CHC_ID: chcidArr.join(','), // 选中ID  如果是全选，传未选中的ID
        WTHR_ALL: selectAll ? 1 : 0, // 是否全选，0|否;1|是
        QRY_SQL_ID: uuid, // 查询条件对应UUID
      };
      const payload = {

        evntIdSql: JSON.stringify(objIdSql), // 对象IDSQL
        oprTp: 2, // 对象类型 1 新增  2 删除
        grpId, // 员工ID
      };

      this.fetchDeleteOrSave(payload);
    }
  }

  // 删除 和保存的接口
  fetchDeleteOrSave = (payload = {}) => {
    const { fetchCompanyName, tgtTp } = this.props;
    FetchscheduleGroupTaskMaintenance(payload).then((res) => {
      const { code = 0 } = res;
      if (code > 0) {
        message.success('操作成功');
        this.setState({
          keyword: '', // 关键字
          selectedRows: [], // 勾选的数据
          selectAll: false, // 是否全选
          visible: false,
          selectedRowKeys: [], // 表格选中记录
        }, () => {
          fetchCompanyName && fetchCompanyName(tgtTp, '');
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 取消点击
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  // 弹窗保存点击
  onSaveClick = () => {
    // 获取子组件的表格数据 和勾选数据
    const { selectedRows = [], selectAll, data = [], uuid } = this.child.state;
    if (selectedRows.length === 0) {
      message.warning('未选中任何记录');
    } else {
      const { selectedItem } = this.props;
      const { grpId } = selectedItem;
      const chcidArr = [];


      // 点击了全选  筛选出未选中的ID
      if (selectAll) {
        data.map((dataItem) => {
          let total = 0;
          selectedRows.map((selectItem) => {
            if (dataItem.evntId !== selectItem.evntId) {
              total += 1;
            }
            if (total === selectedRows.length) {
              chcidArr.push(dataItem.evntId);
            }
          });
        });
      } else {
        // 未点击全选
        selectedRows.map((item) => {
          chcidArr.push(item.evntId);
        });
      }

      const objIdSql = {
        CHC_ID: chcidArr.join(','), // 选中ID  如果是全选，传未选中的ID
        WTHR_ALL: selectAll ? 1 : 0, // 是否全选，0|否;1|是
        QRY_SQL_ID: uuid, // 查询条件对应UUID
      };
      const payload = {

        evntIdSql: JSON.stringify(objIdSql), // 对象IDSQL
        oprTp: 1, // 对象类型 1 新增  2 删除
        grpId, // 员工ID
      };

      this.fetchDeleteOrSave(payload);
    }
  }

  // 模态框底部
  renderFooter = () => {
    return (
      <div className="operation">
        <Button className="m-btn-radius m-btn-headColor" htmlType="submit" type="primary" onClick={this.onSaveClick}>保存</Button>
        <Button className="m-btn-radius m-btn-gray" onClick={this.handleCancel}>取消</Button>
      </div>
    );
  }

  // 全选
  selectAll = (selected) => {
    const { data = [] } = this.state;
    const selectedRowKeys = [];
    let selectedRows = [];
    if (selected) {
      selectedRows = data;
      data.forEach((item) => {
        selectedRowKeys.push(item.evntId);
      });
    }
    this.setState({
      selectAll: selected,
      selectedRows,
      selectedRowKeys,
    });
  }

  // 表格勾选

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };


  render() {
    const { selectedItem = {}, tgtTp } = this.props;
    const { data = [], selectedRowKeys = [], visible, uuid = '' } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelectAll: this.selectAll,
    };
    const modalProps = {
      width: '80rem',
      height: '60rem',
      title: '新增',
      // style: { top: '2rem', overflowY: 'auto' },
      visible,
      onCancel: () => { this.setState({ visible: false }); },
      footer: this.renderFooter(),
    };


    return (
      <Fragment>
        <Row style={{ padding: ' 2rem' }}>
          <div style={{ color: '#333333', fontSize: '16px', fontWeight: 'bold', padding: '0 0 2rem 0 ' }}>MOT事件</div>
          <Row style={{ border: '1px solid #dcdcdc' }}>
            <span style={{ display: 'flex', padding: '1rem' }}>
              <Search onSearch={(value) => { this.handleSearch(value); }} style={{ width: '40%', marginRight: '1rem' }} className="mot-prod-search-input" />
              {/* <div style={{ cursor: 'pointer', padding: '0 1rem', display: 'inline-block' }} onClick={this.addClick}> <i className='iconfont icon-tianjia' style={{ color: '#3dbcf5', fontSize: '14px' }}></i>  新增</div>
                            <div style={{ cursor: 'pointer', display: 'inline-block' }} onClick={this.deleteClick}> <i className='iconfont icon-shanchu1' style={{ color: '#ff7675', fontSize: '14px' }}></i> 删除 </div> */}
              <Button className="factor-bottom m-btn-table-headColor" onClick={this.addClick} >新增</Button>
              <Button className="factor-bottom m-btn-table-headColor" onClick={this.deleteClick} >删除</Button>
            </span>
            <Table
              rowKey={record => record.evntId}
              rowSelection={rowSelection}
              dataSource={data}
              columns={this.fetchColumns()}
              className="mot-page"
            />
          </Row>
        </Row>
        <BasicModal {...modalProps}>
          <ModalContent tgtTp={tgtTp} selectedItem={selectedItem} uuid={uuid} onRef={form => this.child = form} />
        </BasicModal>
      </Fragment >
    );
  }
}
// export default GroupDefinedIndexRightMainContent;
export default Form.create()(MotEvent);

