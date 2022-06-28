import React from 'react';
import { Tabs, message, Button, Modal,Tooltip, Drawer, Timeline, Input, Message, Row, Col, Icon, Radio, Form } from 'antd';
import BasicIndex from './BasicIndex';
import ModuleIndex from './ModuleIndex';
import config from '../../../../../../../utils/config';
import {
  FetchQueryAssessPlanBusDetail,
  FetchQueryAssessPlanFuncDetail, FetchQueryAssessPlanList,
  FetchQueryHisAssessPlanBusDetail,
  FetchQueryHisAssessPlanFuncDetail,
  OprateAuditAssessPlanWf,
} from '../../../../../../../services/planning/planning.js';
import VersionItem from './VersionItem';
import nodata from '../../../../../../../assets/no-data.png';
import BasicModal from '../../../../../../Common/BasicModal';
import { Link } from 'dva/router';
import { EncryptBase64 } from '../../../../../../Common/Encrypt';
import ShareInput from '../../../../SinglePage/AccessPlan/EvaluationSchemeList/EvaluationSchemeModel/FilterModel';
import AdviceFeedback from '../RightContent/AdviceFeedback';
import VersionRecord from '../RightContent/VersionRecord';
import RightContent from '../RightContent';
import { RightCircleTwoTone } from '@ant-design/icons';

const { api } = config;
const { planning: { createPlanWord } } = api;
const { TextArea } = Input;

class LeftContent extends React.Component {
  state = {
    headerInfo: '',
    assessInfo: {},
    planId: '',
    planType: '',
    drawerVisible: false,
    modalVisible: false,
    spr: '',//弹窗选择的审批人
    actionId: '',   //按钮的ID
    actionNote: '',  //审批意见
    visible: false,//弹出框是否可见
    button2visible: false,//抽屉
    selectedKey: '0',//选择pdf或word
    headState: {},//考核方案列表头部查询条件
  };

  componentDidMount() {
    const { planId = '', planType = '', opr, headState } = this.props;
    //console.log('-------详情页面2的headState-----', headState);
    this.setState({
      planType: planType,
      headState: headState,
    });
    //console.log('-------详情页面2的headState-----', this.state.headState);
    this.fetchQueryAssessPlanBusDetail(planId);
  }

  handleItemClick = (payload, rollback) => {
    ////console.log('------次页面----');
    const { handleClickCallback } = this.props;
    if (handleClickCallback) {
      ////console.log('------payload----', payload);
      handleClickCallback(payload, rollback);
    }
    this.setState({
      //点击了历史,把抽屉关了,显示历史版本信息
      button2visible: false,
    });
  };

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps !== this.props) {
      const { planId = '', planType = '', planStatus = '', opr } = nextProps;
      ////console.log('----Props-opr-----', opr);
      this.setState({
        planType: planType,
      });
      //计划状态为2(意见征求的时候),默认打开右侧抽屉
      if (planStatus === '2') {
        this.setState({
          button2visible: true,
        });
      }
      if (opr) {
        this.fetchQueryHisAssessPlanBusDetail(planId);
      } else {
        this.fetchQueryAssessPlanBusDetail(planId);
      }
    }
  }

  //查询业务条线考核方案明细
  fetchQueryAssessPlanBusDetail = async (planId) => {
    await FetchQueryAssessPlanBusDetail({ planId }).then(res => {
      const { code = 0, note = '', result = {} } = res;
      if (code > 0) {
        const resultList = JSON.parse(result);
        this.setState({
          headerInfo: JSON.parse(note),
          assessInfo: resultList,
          planId,
        });
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    });
  };

  //查询业务条线考核方案明细---查询历史接口 查询历史记录时，不能将planId设置到state里
  fetchQueryHisAssessPlanBusDetail = async (planId) => {
    await FetchQueryHisAssessPlanBusDetail({ planId }).then(res => {
      const { code = 0, note = '', result = {} } = res;
      if (code > 0) {
        const resultList = JSON.parse(result);
        this.setState({
          headerInfo: JSON.parse(note),
          assessInfo: resultList,
        });
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    });
  };

  //查询职能部门考核方案明细
  fetchQueryAssessPlanFuncDetail = async (planId) => {
    await FetchQueryAssessPlanFuncDetail({ planId }).then(res => {
      const { code = 0, note = '', result = {} } = res;
      if (code > 0) {
        const resultList = JSON.parse(result);
        this.setState({
          headerInfo: JSON.parse(note),
          assessInfo: resultList,
          planId,
        });
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    });
  };

  //查询职能部门考核方案明细---查询历史接口,查询历史记录时，不能将planId设置到state里
  fetchQueryHisAssessPlanFuncDetail = async (planId) => {
    await FetchQueryHisAssessPlanFuncDetail({ planId }).then(res => {
      const { code = 0, note = '', result = {} } = res;
      if (code > 0) {
        const resultList = JSON.parse(result);
        this.setState({
          headerInfo: JSON.parse(note),
          assessInfo: resultList,
        });
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    });
  };

  getBodyHeight = () => {
    const dom = document.getElementsByClassName('advice-left-detail');
    // const height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    // return height - 109;
    return dom[0].offsetHeight - 45;
  };

  //按钮点击事件 由于查看按钮取消了 查看功能转由点击icon展开
  buttonClick = (actionId, actionName) => {
    if (actionId === '99') {
      //查看按钮 展示抽屉内容
      this.setState({
        drawerVisible: !this.state.drawerVisible,
      });
    } else {
      this.setState({
        modalVisible: true,
        actionId,//按钮的id
        actionNote: actionName === '审批意见' ? '同意' : actionName,//按钮名称  作为意见审批的默认值，按钮名称为审批意见时,默认为同意
      });
      //其他操作 提交0 同意1 退回2 不同意-1
    }
  };

  //按钮点击事件 由于查看按钮取消了 查看功能转由点击icon展开
  button2Click = () => {
    this.setState({
      button2visible: true,
    });
  };

  onClose = () => {
    this.setState({
      button2visible: false,
    });
  };

  //弹窗选择回调
  callBackForShareInput = (params) => {
    this.setState({
      spr: params,
    });
  };

  //提交审批
  handleOk = () => {
    const { actionId, actionNote, spr } = this.state;
    //console.log('-----this.state-----', this.state);
    const { stepId, wfId, reload } = this.props;
    if (actionNote === '') {
      Message.error('请输入审批意见');
      return;
    }
    const param = {
      actionId,
      actionNote,//弹窗的意见信息
      stepId,
      wfId,
      nextMember: spr,
    };
    OprateAuditAssessPlanWf(param).then(
      (res) => {
        const { code, note } = res;
        if (code > 0) {
          Message.success('提交成功');
          reload(wfId, stepId);
          this.setState({
            modalVisible: false,
            actionNote: '',
          });
        } else {
          Message.error(note);
        }
      },
    ).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
    ;

  };

  //取消审批
  handleCancel = e => {
    this.setState({
      modalVisible: false,
    });
  };
  handleClick = () => {
    this.setState({
      visible: true,
    });
  };
  //返回详情页面
  roolbackOldPage = () => {
    ////console.log('-----返回详情页面----');
    const params = { planId: this.state.planId, planType: this.state.planType, opr: false };
    ////console.log('-----返回详情页面params----', params);
    const { getUrlParams } = this.props;
    //第二次点击同一个历史记录的时候,props是不变的,不会执行父组件的componentWillReceiveProps方法,需要在这直接调用
    getUrlParams();
    window.location.href = `/#/esa/planning/AesaccessPlanDetail/${EncryptBase64(JSON.stringify(params))}`;
  };

  onOk = () => {
    const { selectedKey } = this.state;
    const planId = this.props.planId;
    const planType = this.props.planType;
    const fileType = this.state.selectedKey;
    const actionUrl = createPlanWord;
    if (selectedKey === '') {
      message.warning('请选择导出文件类型!');
    } else {
      // 创建一个表单
      const downloadForm = document.createElement('form');
      downloadForm.id = 'downloadForm';
      downloadForm.name = 'downloadForm';
      //downloadForm. = 'downloadForm';
      // 创建一个输入框
      const idInput = document.createElement('input');
      idInput.type = 'text';
      idInput.name = 'planId';
      idInput.value = planId;
      const typeInput = document.createElement('input');
      typeInput.type = 'text';
      typeInput.name = 'planType';
      typeInput.value = planType;
      //文件类型输入
      const fileInput = document.createElement('input');
      fileInput.type = 'text';
      fileInput.name = 'fileType';
      fileInput.value = fileType;
      // 将该输入框插入到 form 中
      downloadForm.appendChild(idInput);
      downloadForm.appendChild(typeInput);
      downloadForm.appendChild(fileInput);
      // form 的提交方式
      downloadForm.method = 'POST';
      // form 提交路径
      downloadForm.action = actionUrl;
      // 添加到 body 中
      //console.log('cececececee', downloadForm);
      document.getElementById('m_iframe').appendChild(downloadForm);
      // 对该 form 执行提交
      downloadForm.submit();
    }
    this.setState({
      visible: false,
    });
  };
  // 取消
  onCancel = () => {
    this.setState({
      visible: false,
    });
  };
  onChange = (e) => {
    ////console.log('radio checked', e.target.value);
    this.setState({
      selectedKey: e.target.value,
    });
  };

  mainTableScroll = () => {
    const cont = document.getElementsByClassName('ant-row bg-white');
    //滚动条高度
    let clientHeight = cont[0].clientHeight; //可视区域高度
    let scrollTop = cont[0].scrollTop;  //滚动条滚动高度
    let scrollHeight = cont[0].scrollHeight; //滚动内容高度
    //console.log("----clientHeight----",clientHeight);
    //console.log("----scrollTop----",scrollTop);
    //console.log("----scrollHeight----",scrollHeight);
    //console.log(document.body.scrollHeight);
  };

  render() {
    const {
      headerInfo = {},
      assessInfo = {},
      assessInfo: { result4 = [] },
      drawerVisible,
      modalVisible,
      actionNote,
      visible,
      selectedKey = '0',
      button2visible,
    } = this.state;
    const {
      planType = '',
      planId = '',
      dictionary = [],
      buttons = [],
      stepId,
      drawerData,
      icon = false,
      icon2 = false,
      opr,
      rollback,
      headState = {},
    } = this.props;
    //console.log('-------详情页面rollback----rollback-----', rollback);
    const sortIndex = result4.sort((x, y) => x.SNO - y.SNO);
    const modalProps = {
      // width: '70rem',
      // height: '70rem',
      title: '选择导出文件类型',
      visible,
      onCancel: this.onCancel,
      onOk: this.onOk,
      // footer: null,
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 16 },
      },
    };
    return (
      <Row className='bg-white'>
        <Col span={icon || icon2 ? 23 : 24}>
          <div className='advice-left-content'>
            <div className='advice-left-header clearfix'>
              {/* 高管的时候不显示适用业务条线 */}
              {/*{headerInfo.planType !== '1' &&*/}
              {/*<div className='fl header-ywx'>{headerInfo.planType === '2' ? '适用业务条线' : '适用职能部门'}:&nbsp;&nbsp;*/}
              {/*  <span>{headerInfo.orgName}</span></div>}*/}
              <div className='fl header-year'>年度:&nbsp;&nbsp;<span>{headerInfo.yr || '--'}</span></div>
              <div className='fl header-fzr'>负责人:&nbsp;&nbsp;{headerInfo.head || '--'}
              </div>
              <div style={{ float: 'right', marginRight: '20px' }}>
                {buttons.length > 0 && buttons.map((item, index) => {
                  return <Button className='fcbtn m-btn-border m-btn-border-headColor btn-1c'
                                 style={{ marginRight: '1rem' }}
                                 onClick={e => this.buttonClick(item.actionId, item.actionName)}>{item.actionName}
                  </Button>;
                })
                }
                {/* <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c"
                                    style={{ marginRight: '1rem' }} >查看
                                </Button> */}
                {opr === false ? (
                  <span>
                    {/*//返回主页面:从方案列表的列表名称进去的详情页面和从意见反馈进去的详情页面是同一个,*/}
                    {/*// 需要控制在方案列表显示返回按钮,在意见反馈的页面不显示返回按钮。(用rollback控制)*/}
                    <Button className='fcbtn m-btn-border m-btn-border-headColor btn-1c'
                            onClick={this.handleClick}>方案导出</Button>&nbsp;&nbsp;{rollback === true ?
                    <Button className='fcbtn m-btn-border m-btn-border-headColor btn-1c'
                    ><Link to={{
                      pathname: '/esa/planning/AssessPlanLeadList',
                      query: { headState: headState },
                    }}>返回</Link></Button> : ''}</span>) : (opr === true ? (<Button
                  className='fcbtn m-btn-border m-btn-border-headColor btn-1c'
                  onClick={this.roolbackOldPage}>返回</Button>) : (
                  <span>
                  <Button className='fcbtn m-btn-border m-btn-border-headColor btn-1c'
                          onClick={this.handleClick}>方案导出</Button>&nbsp;&nbsp;{rollback === true ?
                    <Button className='fcbtn m-btn-border m-btn-border-headColor btn-1c'
                    ><Link to={{
                      pathname: '/esa/planning/AssessPlanLeadList',
                      query: { headState: headState },
                    }}>返回</Link></Button> : ''}</span>))
                }
                <iframe title='下载' id='m_iframe' ref={(c) => {
                  this.ifile = c;
                }} style={{ display: 'none' }} />
              </div>
            </div>
            <div className='advice-left-detail'>
              <Tabs defaultActiveKey='1' className='tabStyle'>
                <Tabs.TabPane tab='基础指标' key='0'>
                  <BasicIndex assessInfo={assessInfo} planType={planType} />
                </Tabs.TabPane>
                {sortIndex.map(item => {
                  return (<Tabs.TabPane tab={item.MODULAR_NAME} key={item.SNO}>
                    <div className='modular-index' style={{ height: this.getBodyHeight() }}>
                      <ModuleIndex data={item} />
                    </div>
                  </Tabs.TabPane>);
                })}
              </Tabs>
            </div>
            <BasicModal {...modalProps} centered>
              <Form className='m-form' {...formItemLayout} >
                <Form.Item label='文件类型'>
                  <Radio.Group className='m-radio' onChange={this.onChange} value={selectedKey}>
                    <Radio value='0'>word</Radio>
                    <Radio value='1'>pdf</Radio>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </BasicModal>
            {<Drawer
              title='审批意见'
              placement='right'
              closable={false}
              width={500}
              onClose={() => {
                this.setState({
                  drawerVisible: false,
                });
              }}
              visible={drawerVisible}
            >
              <div className='af-detail' style={{ position: 'relative', minHeight: '50rem' }}>
                {drawerData?.length === 0 ?
                  <div style={{ position: 'absolute', top: 'calc(50% - 120px)', left: 'calc(50% - 120px)' }}>
                    <img src={nodata} alt='' width='240' />
                    <div style={{
                      textAlign: 'center',
                      color: '#b0b0b0',
                      fontSize: '1.5rem',
                      marginTop: '1.5rem',
                    }}> 暂无可展示内容!
                    </div>
                  </div> :
                  <Timeline>
                    {drawerData?.map(item => {
                      return <VersionItem data={item} />;
                    })}
                  </Timeline>
                }
              </div>
            </Drawer>}
            {
              <Drawer
                placement='right'
                closable={true}
                // mask ={false}
                width={500}
                zIndex={999}
                onClose={() => {
                  this.setState({
                    button2visible: false,
                  });
                }}
                visible={button2visible}
              >
                <div className='advice-right-content'>
                  <Tabs defaultActiveKey='1' className='tabStyle'>
                    <Tabs.TabPane tab='意见反馈' key='1'>
                      <AdviceFeedback planId={planId} dictionary={dictionary} planType={planType} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab='版本流水' key='2'>
                      <VersionRecord planId={planId} handleItemClick={this.handleItemClick} rollback={rollback} />
                    </Tabs.TabPane>
                  </Tabs>
                </div>
              </Drawer>
            }
            <BasicModal {...modalProps} centered
                        title='审批意见'
                        visible={modalVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText={'提交'}
            >
              {stepId === '3' ? (<Form.Item style={{ margin: '1rem', padding: '1rem' }}
                                            label={'分管领导及负责人：'} labelCol={{ span: 5 }}
                                            wrapperCol={{ span: 19 }}>
                <ShareInput callBackForShareInput={this.callBackForShareInput} onChangeGXLX={(value) => {
                  this.props.form.setFieldsValue({ gxlx: value });
                }} />
              </Form.Item>) : null}
              <Form.Item style={{ margin: '1rem', padding: '1rem' }}
                         label={'审批意见：'} labelCol={{ span: 5 }}
                         wrapperCol={{ span: 19 }}>
                <TextArea value={actionNote} style={{ width: '' }} rows={4}
                          onChange={e => this.setState({ actionNote: e.target.value })}
                />
              </Form.Item>
            </BasicModal>
          </div>
        </Col>
        {/*这块是考核方案审批的抽屉*/}
        {icon &&
        <Col span={1} style={{ display: 'flex', justifyContent: 'center'}}>
          <span className='fcbtn m-btn-border m-btn-border-headColor btn-1c' onClick={e => this.buttonClick('99')} style={{
            whiteSpace: 'nowrap',
            lineHeight: '2.6rem',
            top: '50%',
            position: 'fixed',
            fontSize:'12px',
            right:'1px',
            borderRadius: '0.333rem'
          }}>
            &nbsp;&nbsp;意见反馈&nbsp;&nbsp;
          </span>
        </Col>}
        {/*这块是考核方案列表的抽屉*/}
        {icon2 &&
        <Col span={1} style={{ display: 'flex', justifyContent: 'center'}}>
          <span className='fcbtn m-btn-border m-btn-border-headColor btn-1c' onClick={this.button2Click} style={{
            whiteSpace: 'nowrap',
            lineHeight: '2.6rem',
            top: '50%',
            position: 'fixed',
            fontSize:'12px',
            right:'1px',
            borderRadius: '0.333rem'
          }}>
            &nbsp;&nbsp;意见反馈&nbsp;&nbsp;
          </span>
        </Col>}
      </Row>
    );
  }

}

export default LeftContent;
