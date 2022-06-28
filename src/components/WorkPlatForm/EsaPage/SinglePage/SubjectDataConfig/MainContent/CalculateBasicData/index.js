import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, message } from 'antd';
import LeftPanel from './LeftPanel';
import RightContent from './RightContent';
import PageFooter from '../../PageFooter';
import { FetchQueryInfoSubjectData, FetchOperateSubjectDataDetail } from '../../../../../../../services/EsaServices/commissionManagement'

class CalculateBasicData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sbjDataDtlId: '', // 主题数据列ID 第二步操作成功返回
      basicDataCol: [], // 基础数据列
      editMode: false, // 是否编辑模式
      selectedSbjDataDtlItem: '', // 选择的数据列
    };
  }
  componentDidMount = () => {
    // 根据第一步的id值做列表查询操作
    const { sbjDataId } = this.props;
    this.fetchData(sbjDataId);
  }

  fetchData = (sbjDataId = '') => {
    FetchQueryInfoSubjectData({ sbjDataId }).then((response) => {
      const { records } = response;
      this.setState({
        basicDataCol: records,
        selectedSbjDataDtlItem: records[0],
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    // const data = [
    //   {
    //     bscTblName: '测试导入到基础数据表',
    //     colType: '1', // 列类型 1|数据表自带 2|用户定义
    //     sbjDataDtlId: '164', // 查询数据列详情入参
    //     sbjDataDtlName: '合计1', // 数据列名称
    //     sbjDataId: '0_001',
    //   },
    //   {
    //     colType: '2',
    //     corrIndi: 'A_JCSJZB',
    //     corrIndiName: '基础数据指标',
    //     // sbjColFmla: '${164}+${165}',
    //     sbjColFmla: '${}+${}',
    //     sbjColFmlaDisp: '合计1+合计2',
    //     // sbjColFmlaDisp: '${合计1}+${合计2}',
    //     sbjDataDtlId: '163',
    //     sbjDataDtlName: '22', // 数据列名称
    //     sbjDataId: '152',
    //   },
    // ];

    // if (data.length !== 0) {
    //   if (id !== '') {
    //     const index = data.findIndex(item => item.sbjDataDtlId === id);
    //     this.setState({
    //       selectedSbjDataDtlItem: index !== -1 ? data[index] : {},
    //     });
    //   } else {
    //     this.setState({
    //       selectedSbjDataDtlItem: data[0],
    //     });
    //   }
    // }
  }

  //添加列
  addColumn = () => {
    this.setState({
      selectedSbjDataDtlItem:[]
    })
    this.changeEditMode();
  }

  // 点击列表项
  itemOnclick = async (selectedSbjDataDtlItem) => {
    const { editMode } = this.state;
    if (editMode && !await this.showConfirm()) {
      return;
    }
    this.setState({
      selectedSbjDataDtlItem,
    });
  }

  // 删除列表项
  handleDelete = () => {

  }

  // 取消编辑
  cancelEdit = () => {
    // ...
    this.changeEditMode();
  }

  // 提交表单的后续步骤
  saveEdit = () => {
    this.changeEditMode();
  }

  // 改变编辑状态
  changeEditMode = () => {
    this.setState({
      editMode: !this.state.editMode,
    });
  }

  // 取消提示
  showConfirm = () => {
    const { theme = 'default-dark-theme' } = this.props;
    return new Promise((resolve) => {
      Modal.confirm({
        title: '提示',
        content: '是否取消当前页面修改？',
        onOk: () => {
          resolve(true);
          this.changeEditMode();
        },
        onCancel: () => {
          resolve(false);
        },
        autoFocusButton: null,
        className: theme,
        okButtonProps: { className: 'm-btn-radius m-btn-headColor', style: { marginLeft: 0 } },
        cancelButtonProps: { className: 'm-btn-radius m-btn-gray' },
      });
    });
  }

  // 点击上一步
  toPreStep = async () => {
    const { editMode } = this.state;
    if (editMode) {
      const confirm = this.showConfirm();
      if (confirm) {
        this.props.toPreStep();
      }
    } else {
      this.props.toPreStep();
    }
  }

  // 提交主题数据详情配置
  commitForm = () => {
    this.rightContent.onSave();
  }

  render() {
    const { selectBasicDataFormData = {}, calculateBasicDataFormData = {}, sbjDataId, indicators } = this.props;
    const { basicDataCol = [], editMode, selectedSbjDataDtlItem } = this.state;
    return (
      <Fragment>
        <Row className="esa-subjectDat-row ">
          <Col span={5} className="bd-right" style={{ overflowY: 'auto', minHeight: '22rem' }}>
            <LeftPanel
              fetchData={this.fetchData}
              addColumn={this.addColumn}
              basicDataCol={basicDataCol}
              selectBasicDataFormData={selectBasicDataFormData}
              calculateBasicDataFormData={calculateBasicDataFormData}
              itemOnclick={this.itemOnclick}
              handleDelete={this.handleDelete}
              selectedSbjDataDtlItem={selectedSbjDataDtlItem}
              sbjDataId={sbjDataId}
              changeEditMode={this.changeEditMode}
            />
          </Col>
          <Col span={19} className="bd-left" >
            <RightContent
              editMode={editMode}
              wrappedComponentRef={(c) => { this.rightContent = c; }}
              fetchData={this.fetchData}
              data={selectedSbjDataDtlItem}
              indicators={indicators}
              basicDataCol={basicDataCol}
              selectBasicDataFormData={selectBasicDataFormData}
              calculateBasicDataFormData={calculateBasicDataFormData}
              saveEdit={this.saveEdit}
              sbjDataId={sbjDataId}
              cancelEdit={this.cancelEdit}
              changeEditMode={this.changeEditMode}
            />
          </Col>
        </Row>
        <PageFooter current={1} total={1} toPreStep={this.toPreStep} onOk={this.commitForm} />
      </Fragment>
    );
  }
}
export default connect(({ global }) => ({
  theme: global.theme,
}))(CalculateBasicData);
