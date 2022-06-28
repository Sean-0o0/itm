import React from 'react';
import { Modal, message } from 'antd';
import BasicModal from '../../../../../../../../Common/BasicModal';
import AddFormulaModal from './AddFormulaModal';
// import { DoSalaryFormulaDef } from '../../../../../../../../../services/salaryAssessment';
import { FetchoperateSalaryFormulaDef } from '../../../../../../../../../services/EsaServices/salaryManagement';


class OperateColumns extends React.Component {
  state = {
    addFormulaModalVisible: false,
    payFmlaId: '', // 要修改的薪酬公式ID
  }

  // 修改公式Modal
  showAddFormulaModal = (item) => { // eslint-disable-line
    // this.setState({ addFormulaModalVisible: true });
    const { st } = this.props;
    if (st === '1') {
      message.error('上架后禁止操作！')
    } else {
      this.setState({ addFormulaModalVisible: true, payFmlaId: item.id });
    }
  }

  handleAddFormulaModalCancel = () => {
    this.setState({ addFormulaModalVisible: false });
  }

  handleDelete = (id) => {
    const { st } = this.props;
    if (st === '1') {
      message.error('上架后禁止操作！')
      return false;
    }
    // fetchLeftList={this.props.fetchLeftList}
    const { fetchLeftList,refreshTable,version } = this.props;
    const payload = {
      area: 0, // 适用地区
      beginMon: 0, // 开始月份
      calFmla: '', // 常量值/计算公式
      calMode: 0, // 计算方式 1|套用模版;2|常量;3|表达式计算;4|手工录入
      classId: 0, // 人员类别
      depClass: 0, // 部门类别
      empNo: 0, // 结算人员
      endMon: 0, // 结束月份
      fmlaDesc: '', // 公示说明
      levelId: 0, // 人员级别
      operType: 3, // 操作类型  1|新增;2|修改;3|删除
      orgNo: 0, // 营业部
      paramValues: '', // 参数取值json 多值用数组格式：[{"FLD1":"xxx","FLD2","xxx"},{...}]
      payCodeId: 0, // 薪酬项目
      payFmlaId: id, // 薪酬公式ID  修改删除需要传入
      payTmplId: 0, // 套用模板
      version,
    };
    const confirmModal = Modal.confirm({
    // Modal.confirm({
      okText: '确定',
      title: '薪酬公式定义-删除',
      content: <p>该参数影响范围的人需重新试算当月薪酬才能生效，是否确定删除？</p>,
      onOk() {
        return FetchoperateSalaryFormulaDef(payload).then((ret = {}) => {
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
      onCancel() {},
    });
  }

  render() {
    // const { record: { id: xcgsid = '' }, rightData, ryDatas = [], refreshList } = this.props;
    // const { addFormulaModalVisible } = this.state;
    const { Seccolumns, record: { detail: dataSource = [] }, rightData = {}, gxyybDatas = [], record, version,st } = this.props;

    const { addFormulaModalVisible, payFmlaId = '' } = this.state;
    const addFormulaModalProps = {
      isAllWindow: 1,
      width: '80rem',
      title: '薪酬公式定义-修改',
      style: { top: '2rem', overflowY: 'auto' },
      visible: addFormulaModalVisible,
      onCancel: this.handleAddFormulaModalCancel,
      footer: null,
    };
    return (
      <React.Fragment>
        <a className="dib" onClick={this.showAddFormulaModal}>修改</a>&nbsp;
        <a className="dib" onClick={() => { this.handleDelete(record.id); }}>删除</a>
        {/* 修改Modal */}
        <BasicModal {...addFormulaModalProps}>
          <AddFormulaModal version={version} st={st} rightData={rightData} ryDatas={this.props.ryDatas} initialOrgid={this.props.initialOrgid} fetchLeftList={this.props.fetchLeftList} gxyybDatas={gxyybDatas} handleAddFormulaModalCancel={this.handleAddFormulaModalCancel} operate="edit" payFmlaId={record.id} refreshTable={this.props.refreshTable}/>

          {/* <AddFormulaModal rightData={rightData} handleAddFormulaModalCancel={this.handleAddFormulaModalCancel} operate="edit" xcgsid={xcgsid} ryDatas={ryDatas} refreshList={refreshList} /> */}
        </BasicModal>
      </React.Fragment>
    );
  }
}

export default OperateColumns;
