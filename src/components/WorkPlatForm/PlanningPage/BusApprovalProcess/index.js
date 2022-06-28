/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { Row, Card, Col, Radio } from 'antd';
//import RightTable from './RightTable';
import { connect } from 'dva';
import BusLeftContent from '../BusAccessPlan/BusAccessPlanDetail/LeftContent';
import { FetchQueryBusResponWfList, FetchQueryAssessPlanWfAction, FetchQueryAssessPlanWfOption } from "../../../../services/planning/planning";
import { getDictKey } from '../../../../utils/dictUtils';
import LeftTable from './LeftTable';


class BusApprovalProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftData: [],
      curClickRowId: '',//当前选中行的ID
      foldType: 0,      //折叠类型  0的时候左侧完全展开  1的时候半展开(暂时屏蔽该半展开功能)  2的时候只保留一行展示
      planId: 0,
      planType: 0,
      typeValue: '1',   //下拉选项的值
      buttons: [],      //按钮权限
      drawerData: [],   //抽屉数据
      stepId: 0,        //当前选中行的步骤ID
    }
  }

  //改变折叠状态
  changeFoldType = (foldType) => {
    this.setState({
      foldType
    })
  }

  //点击了左侧的列表行
  changeCurClickRowId = (record) => {
    //点击的时候去获取按钮权限
    this.fetchQueryAssessPlanWfAction(record?.wfId, record?.stepId)

    //点击的时候去获取 抽屉数据
    this.fetchQueryAssessPlanWfOption(record.wfId)
    this.setState({
      curClickRowId: record.wfId,
      planType: record.planType,
      planId: record.planId,
      stepId: record.stepId
    })
  }

  //获取抽屉数据
  fetchQueryAssessPlanWfOption = (wfId) => {
    FetchQueryAssessPlanWfOption({ wfId: +wfId }).then(
      res => {
        const { code, records } = res
        if (code > 0) {
          this.setState({
            drawerData: records
          })
        }
      }
    )
  }

  //获取数据
  componentDidMount() {
    this.FetchQueryBusResponWfList()
  }

  //获取按钮数据
  fetchQueryAssessPlanWfAction = (wfId, stepId) => {
    FetchQueryAssessPlanWfAction({ wfId, stepId }).then(
      res => {
        const { code, records } = res
        if (code > 0) {
          if (records.length === 0 || +records[0].actionId > 3) {
            this.setState({
              buttons: []
            })
          } else {
            this.setState({
              buttons: records
            })
          }
        }
      }
    )
  }

  //获取左侧列表初始数据
  FetchQueryBusResponWfList = () => {
    const { typeValue } = this.state
    FetchQueryBusResponWfList(
      {
        "wfType": +typeValue
      }
    ).then(
      res => {
        const { records, code } = res
        if (code > 0) {
          this.setState({
            leftData: records,
          })
        }

      }
    ).catch()
  }

  //改变下拉框状态
  changeType = (typeValue) => {
    this.setState({
      typeValue,
      foldType: 0,
      curClickRowId: ''
    }, () => {
      this.FetchQueryBusResponWfList()
    })
  }

  //刷新按钮和抽屉数据
  reload = (wfId, stepId) => {
    this.fetchQueryAssessPlanWfAction(wfId, stepId)
    this.fetchQueryAssessPlanWfOption(wfId)
  }

  render() {
    const { leftData, curClickRowId, foldType, planId, stepId,
      planType, buttons, drawerData } = this.state
    const { [getDictKey('FALX')]: typeArray = [] } = this.props.dictionary;
    return (
      <  >
        <Card
          className='esa-evaluate-lender-card'
          title={"责任状审批流程"}
          headStyle={{ fontWeight: "600" }}
          style={{ width: "100%" }}
        >
          <Row style={{ marginBottom: '1rem' }}>
            <Col >
              <div  >
                {/* <span style={{ fontWeight: '600' }}>  查询流程类型：</span> */}
                {/* <Select style={{ width: '10rem' }} value={typeValue} onSelect={this.changeType} >
                  {
                    typeArray.map((item, index) => {
                      return <Select.Option key={item.ibm} value={item.ibm} >{item.note}</Select.Option>;
                    })
                  }

                </Select> */}
                <Radio.Group defaultValue={'1'} onChange={e => this.changeType(e.target.value)} >
                  {typeArray.map((item, index) => {
                    return <Radio.Button value={item.ibm} >{item.note}</Radio.Button>
                  })}
                </Radio.Group>
              </div>
            </Col>
          </Row>
          <Row className="bg-white" style={{ height: '56rem' }}>
            <Col span={foldType === 2 ? 4 : (foldType === 1) ? 8 : 24}
              style={{ boxShadow: '6px 0 6px -3px rgba(0,0,0,.15)' }}>
              <LeftTable
                //height={height}
                leftData={leftData}
                curClickRowId={curClickRowId}
                changeCurClickRowId={this.changeCurClickRowId}
                foldType={foldType}
                changeFoldType={this.changeFoldType}
              />
            </Col>
            {foldType !== 0 ? <Col span={foldType === 1 ? 16 : 20} style={{ paddingLeft: 3, borderTop: '1px solid #E7E9F0' }}>
              <BusLeftContent
                planId={planId}
                planType={planType}
                wfId={curClickRowId}
                //approval  //组件用于判断按钮
                key={Date.now()}
                stepId={stepId}
                drawerData={drawerData}
                buttons={buttons}
                icon    //用于判断是否出现右侧展开抽屉
                rollback={false} //用于判断是否显示返回按钮
                reload={this.reload}
              />
            </Col> : ''}
          </Row>
        </Card>
      </>
    );
  }
}

export default connect(({ global = {} }) => ({
  dictionary: global.dictionary,
}))(BusApprovalProcess);
