/* eslint-disable array-callback-return */
import React, { Fragment } from 'react';
import { Row, Card, message, Button, Modal } from 'antd';
// 引入请求路径的示例
// import { FetchMotSameBatchList } from '../../../../../services/motProduction';
import BasicInfo from './BasicInfo';

import { FetchqueryMotEventInfo, FetchmotEventOrganizationVariableMaintenance, FetchqueryAvailableIndex } from '../../../../../../services/motProduction';

import PublishingRules from './PublishingRules';
import ContentTemplate from './ContentTemplate';
import RuleDefinition from './RuleDefinition';


// 右边内容模块
class RightContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      motDetail: {}, // mot事件详情
      edit: false, // 是否是编辑模式
      tempMotDetail: {// mot事件详情的临时数据，存储修改内容
        params: [], // 存储规则定义中修改的参数 事件变量维护
        wthrRvwMsg: 0, // 是否审核消息
        wthrRvwTask: 0, // 是否审核任务
        taskRqmt: 0, // 任务要求
        codeArrList: [], // 编码变量替换列表
      },
    };
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedMotId !== this.props.selectedMotId && nextProps.selectedMotId !== '') {
      this.setState({
        edit: false,
      });
      this.fetchMotDetail(nextProps.selectedMotId);
    }

    // if (nextProps.motDetail !== this.props.motDetail) {
    //   this.fetchCodeData(nextProps.motDetail)
    // }
  }

  // 初始化修改数据集
  initEditData = () => {
    const { motDetail = {} } = this.state;
    const { tempMotDetail = {} } = this.state;
    tempMotDetail.wthrRvwMsg = motDetail.wthrRvwMsg;
    tempMotDetail.wthrRvwTask = motDetail.wthrRvwTask;
    tempMotDetail.taskRqmt = motDetail.taskRqmt;

    // 对json数据进行初始化
    const data = [];
    const calcRule = motDetail.jsonCalcRule;
    if (calcRule) {
      const jsonRule = JSON.parse(calcRule);

      jsonRule.map((item) => {
        const xh = item.COND_NO;
        const fctrArr = item.FCTR;
        if (fctrArr !== '') {
          fctrArr.map((fctrItem, fctrIndex) => {
            const fctrValArr = fctrItem.FCTR_VAR;

            const obj = {
              xh: fctrIndex === 0 ? xh : '', // 条件展示顺序
              // xh: xh, //条件展示顺序

              mrcs: fctrValArr[0] ? fctrValArr[0].VAR_DESC : '',
              jsyz: fctrItem.FCTR_NM,
              // csdy: yybParamDefine,
              wthrAlowDef: fctrValArr[0] ? fctrValArr[0].WTHR_ALOW_DEF : '', // 因子是否允许修改
              alowDefRng: motDetail.alowDefRng, // 营业部  员工是否允许修改 位与项字典
              FCTR_ID: fctrItem.FCTR_ID, // 因子ID
              FCTR_NO: fctrItem.FCTR_NO, // 因子顺序
              VAR_CODE: fctrValArr[0] ? fctrValArr[0].VAR_CODE : '', // 变量编码
              csdy: fctrValArr[0] ? fctrValArr[0].VAR_VAL : '', // 变量值
              VAR_DESC: fctrValArr[0] ? fctrValArr[0].VAR_DESC : '', // 变量描述
              DATA_TP: fctrValArr[0] ? fctrValArr[0].DATA_TP : '', // 数据类型
              COND_NO: xh,
              VAR_VAL: fctrValArr[0] ? fctrValArr[0].VAR_VAL : '', // 变量值
            };
            data.push(obj);
          });
        }
      });


      const tempData = [];
      if (data.length > 0) {
        data.map((item) => {
          const obj = {
            COND_NO: item.COND_NO,
            FCTR_ID: item.FCTR_ID,
            FCTR_VAR: [
              {
                VAR_CODE: item.VAR_CODE,
                VAR_VAL: item.VAR_VAL,
              },
            ],
          };
          tempData.push(obj);
        });
      }
      tempMotDetail.params = tempData;
    } else {
      tempMotDetail.params = data;
    }


    this.setState({
      tempMotDetail,
    });
  }

  // 查询mot事件具体信息
  fetchMotDetail = (evntId) => {
    const { yybId = '' } = this.props;
    FetchqueryMotEventInfo({ evntId, orgId: yybId }).then((res) => {
      const { code = 0, records = [] } = res;
      if (code > 0) {
        this.setState({
          motDetail: records[0],
        }, () => {
          // 初始化   //是否审核消息//是否审核任务//任务要求 //json变量
          this.initEditData();
          this.fetchCodeData(records[0]);
          // const { tempMotDetail = {} } = this.state;
          // tempMotDetail["wthrRvwMsg"] = records[0].wthrRvwMsg;
          // tempMotDetail["wthrRvwTask"] = records[0].wthrRvwTask;

          // tempMotDetail["taskRqmt"] = records[0].taskRqmt;
          // // const calcRule = records[0].jsonCalcRule;
          // // const jsonRule = JSON.parse(calcRule);
          // // tempMotDetail["params"] = jsonRule;
          // this.setState({
          //   tempMotDetail
          // })
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 进入编辑模式
  onEditClick = () => {
    this.setState({
      edit: true,
    });
  }

  // 保存修改的数据
  onSavaEditData = (data, type) => {
    const { tempMotDetail = {} } = this.state;
    tempMotDetail[type] = data;
    this.setState({
      tempMotDetail,
    });
  }

  // 保存按钮点击
  onSaveClick = () => {
    const { tempMotDetail = {} } = this.state;
    const { selectedMotId = '', yybId = '', fetLeftListData } = this.props;
    const { params, wthrRvwMsg, wthrRvwTask, taskRqmt } = tempMotDetail;
    const payload = {

      evntId: Number(selectedMotId), // 事件ID
      evntVarMnt: JSON.stringify(params), // 事件变量维护JSON
      orgId: Number(yybId), // 组织机构ID
      taskRqmt: Number(taskRqmt), // 任务要求
      wthrRvwMsg: Number(wthrRvwMsg), // 是否审核消息
      wthrRvwTask: Number(wthrRvwTask), // 是否审核任务
    };

    const confirmModal = Modal.confirm({
      // Modal.confirm({
      cancelText: '取消',
      okText: '确定',
      title: '',
      content: <p>是否保存页面上的修改？</p>,
      onOk() {
        return FetchmotEventOrganizationVariableMaintenance(payload).then((ret = {}) => {
          const { code = 0 } = ret;
          if (code > 0) {
            message.success('保存成功');
            // 重新查询左侧列表
            fetLeftListData();
          }
        }).catch((error) => {
          confirmModal.destroy();
          message.error(!error.success ? error.message : error.note);
        });
      },
      onCancel() { },
    });

    // FetchmotEventOrganizationVariableMaintenance(payload).then(res => {
    //   const { code = 0, note = '' } = res;
    //   if (code > 0) {
    //     message.success("保存成功")
    //     // 重新查询左侧列表
    //     fetLeftListData()
    //   }
    // }).catch((error) => {
    //   message.error(!error.success ? error.message : error.note);
    // });
  }


  handleOk = () => {
    // 重新初始化数据
    this.initEditData();
    this.setState({
      visible: false,
      edit: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 取消按钮点击
  // eslint-disable-next-line padded-blocks
  onCancleClick = () => {

    this.setState({
      visible: true,
    });

    // // 重置临时数据
    // const tempMotDetail = {//mot事件详情的临时数据，存储修改内容
    //   params: [], //存储规则定义中修改的参数 事件变量维护
    //   wthrRvwMsg: 0,  //是否审核消息
    //   wthrRvwTask: 0, //是否审核任务
    //   taskRqmt: 0,  //任务要求
    // }
    // this.setState({
    //   edit: false,
    //   tempMotDetail
    // })
  }

  // 获取指标编码 进行替换
  fetchCodeData = (motDetail = {}) => {
    const { tgtTp = '' } = this.props;
    const payload = {
      evntCmptRule: motDetail.jsonCalcRule, // 计算规则
      tgtTp: Number(tgtTp), // 目标类型
    };
    FetchqueryAvailableIndex(payload).then((res) => {
      const { code = 0, variableRecord = [] } = res;
      if (code > 0) {
        this.setState({
          codeArrList: variableRecord,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }


  render() {
    const { motDetail = {}, edit, tempMotDetail = {}, codeArrList = [] } = this.state;
    const { dictionary = {}, tgtTp, leftPanelList = [], yybList = [] } = this.props;


    return (
      <Fragment>
        <Card
          bordered={false}
          title={<div style={{ fontSize: '18px' }}>{motDetail.evntNm}</div>}
          extra={edit ? (
            <div style={{ display: 'flex' }}>
              <Button style={{ margin: '0 3rem 0' }} className="factor-bottom m-btn-border-headColor" onClick={() => this.onSaveClick()} >提交</Button>
              <Button style={{ marginTop: '0', marginRight: '3rem' }} className="mot-cancel-btn" onClick={() => this.onCancleClick()} >取消</Button>
              {/* <div className='mot-yyb-baocun_btn' onClick={this.onSaveClick}>保存</div>
              <div className='mot-yyb-qk_btn' onClick={this.onCancleClick}>取消</div> */}
            </div>
          ) : (
              // <div className='mot-yyb-right-editBtn' onClick={this.onEditClick}>编辑</div>
            <Button className="factor-bottom m-btn-border-headColor" onClick={() => this.onEditClick()} >编辑</Button>
            )}
          style={{ overflow: 'auto', height: '100%' }}
        >
          <Row style={{ padding: '1rem 1rem 0 2rem' }}>
            {/* 基本信息 */}
            <BasicInfo motDetail={motDetail} yybList={yybList} dictionary={dictionary} tgtTp={tgtTp} leftPanelList={leftPanelList} />
          </Row>
          <Row style={{ padding: '1rem 1rem 0 2rem' }}>
            {/* 规则定义 */}
            <RuleDefinition motDetail={motDetail} tgtTp={tgtTp} dictionary={dictionary} edit={edit} onSavaEditData={this.onSavaEditData} tempMotDetail={tempMotDetail} />
          </Row>
          <Row style={{ padding: '1rem 1rem 0 2rem' }}>
            {/* 内容模板 */}
            <ContentTemplate motDetail={motDetail} codeArrList={codeArrList} />
          </Row>

          {
            (tgtTp === '1' || tgtTp === '2') && (
              <Row style={{ padding: '1rem 1rem 0 2rem' }}>
                {/* 发布规则 */}
                <PublishingRules motDetail={motDetail} dictionary={dictionary} edit={edit} onSavaEditData={this.onSavaEditData} codeArrList={codeArrList} />
              </Row>
            )
          }


        </Card>

        <Modal

          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          getContainer={false}
        >
          <p>是否取消页面上的修改？</p>

        </Modal>
      </Fragment>
    );
  }
}

export default RightContent;
