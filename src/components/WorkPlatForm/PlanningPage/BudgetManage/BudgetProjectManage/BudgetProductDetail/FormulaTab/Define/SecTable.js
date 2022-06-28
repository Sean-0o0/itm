import React from 'react';
import { Table, Modal, message } from 'antd';
import BasicModal from '../../../../../../../Common/BasicModal';
import AddFormulaModal from './AddFormulaModal';
import { FetchOperateBudgetFormulaDef } from '../../../../../../../../services/planning/budgetManagement';


class SecTable extends React.Component {
  state = {
    addFormulaModalVisible: false,
    payFmlaId: '', // 要修改的预算公式ID
    // editItem: {}, // 要修改的预算公式项
  }

  // 修改公式Modal
  showAddFormulaModal = (item) => { // eslint-disable-line
    const { st } = this.props;
    if (st === '1') {
      message.error('上架后禁止操作！')
    } else {
      this.setState({ addFormulaModalVisible: true, payFmlaId: item.id });
    }
  }

  // 修改取消
  handleAddFormulaModalCancel = () => {
    this.setState({ addFormulaModalVisible: false });
  }


  // 删除
  handleDelete = (id) => {
    const { st } = this.props;
    if (st === '1') {
      message.error('上架后禁止操作！')
      return false;
    }
    // fetchLeftList={this.props.fetchLeftList}
    const { fetchLeftList, refreshTable, version } = this.props;
    const payload = {
      beginMon: 0, // 开始月份
      calFmla: '', // 常量值/计算公式
      calMode: 0, // 计算方式 1|套用模版;2|常量;3|表达式计算;4|手工录入
      depClass: 0, // 部门类别
      empNo: 0, // 结算人员
      endMon: 0, // 结束月份
      fmlaDesc: '', // 公示说明
      operType: 3, // 操作类型  1|新增;2|修改;3|删除
      orgNo: 0, // 营业部
      paramValues: '', // 参数取值json 多值用数组格式：[{"FLD1":"xxx","FLD2","xxx"},{...}]
      payCodeId: 0, // 预算项目
      payFmlaId: id, // 预算公式ID  修改删除需要传入
      payTmplId: 0, // 套用模板
      version, // 套用模板
    };
    const confirmModal = Modal.confirm({
      // Modal.confirm({
      cancelText: '取消',
      okText: '确定',
      title: '预算公式定义-删除',
      content: <p>该参数影响范围的人需重新试算当月预算才能生效，是否确定删除？</p>,
      onOk() {
        return FetchOperateBudgetFormulaDef(payload).then((ret = {}) => {
          const { code = 0, note = '' } = ret;
          if (code > 0) {
            message.success(note);
            // 删除时 重新查询左列内容 刷新页面
            if (fetchLeftList) {
              fetchLeftList('', false);
            }
            if (refreshTable) {
              refreshTable();
            }
          }
        }).catch((error) => {
          confirmModal.destroy();
          message.error(!error.success ? error.message : error.note);
        });
      },
      onCancel() { },
    });
  }


  render() {
    const { version, Seccolumns, record: { detail: dataSource = [] }, rightData = {}, gxyybDatas = [], refreshTable } = this.props;
    const { addFormulaModalVisible, payFmlaId = '' } = this.state;
    const columns = [...Seccolumns, {
      title: '操作',
      dataIndex: 'operate',
      render: (_, record) => {
        return (
          <React.Fragment>
            <a className="dib " onClick={() => { this.showAddFormulaModal(record); }}>修改</a>&nbsp;
            <a className="dib " onClick={() => { this.handleDelete(record.id); }}>删除</a>
          </React.Fragment>
        );
      },
    }];
    const addFormulaModalProps = {
      isAllWindow: 1,
      width: '80rem',
      title: '预算公式定义-修改',
      style: { top: '2rem', overflowY: 'auto' },
      visible: addFormulaModalVisible,
      onCancel: this.handleAddFormulaModalCancel,
      footer: null,
    };
    return (
      dataSource.length > 0 && (
        <React.Fragment>
          <Table
            // className="m-table-customer m-table-bortop"
            // className="m-table-customer m-table-bortop"

            className=" m-table-bortop esa-xcxmgl-table "

            columns={columns}
            dataSource={dataSource}
            style={{ marginTop: '-11px' }}
            pagination={dataSource.length > 5 ? {
              size: 'small',
              simple: true,
              pageSize: 5,
              position: 'bottom',
            } : false}
          />
          {/* 新增Modal */}
          <BasicModal {...addFormulaModalProps}>
            <AddFormulaModal version={version} rightData={rightData} initialOrgid={this.props.initialOrgid} fetchLeftList={this.props.fetchLeftList} gxyybDatas={gxyybDatas} handleAddFormulaModalCancel={this.handleAddFormulaModalCancel} refreshTable={refreshTable} operate="edit" payFmlaId={payFmlaId} />
          </BasicModal>
        </React.Fragment>
      )
    );
  }
}

export default SecTable;
