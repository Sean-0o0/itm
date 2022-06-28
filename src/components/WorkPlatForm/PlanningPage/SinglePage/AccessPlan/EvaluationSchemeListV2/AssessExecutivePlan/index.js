import React from 'react';
import ListHead from './ListHead'
import ListButtonGroup from './ListButtonGroup'
import ListTable from './ListTable'
import { FetchQueryAssessPlanList } from '../../../../../../../services/planning/planning';
import { Col, Row } from 'antd';

class BussinessAssessmentContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            column: [],//表格列名属性
            tableData: [],//表格数据
            planIdStr: '',//计划Id串
            palnStatus:'',//选中数据的status

            reload: false,

          headState:{},//表格头部查询条件
        }
    }
    componentDidMount() {
        this.FetchDataList();
    }

  FetchDataList = (payload) => {
      const {params} = this.props;
      if(JSON.stringify(params) !== "{}"){
        //console.log('-------testchenj-----', params);
        FetchQueryAssessPlanList({
          'yr': params.year?params.year:new Date().getFullYear(),
          'status': params.schemeTypeStatusId===-2?99:params.schemeTypeStatusId,
          'planType':"4",
          'orgId':params.objId ===-2?'':params.objId,
        }).then((res) => {
          this.setState({
            tableData: res.records
          })
        })
      }else{
        //console.log('-------主页面1-----', this.props.params);
        FetchQueryAssessPlanList({
          'yr': new Date().getFullYear(),
          'status': 99,
          'planType': "4"
        }).then((res) => {
          this.setState({
            tableData: res.records
          })
        })
      }
    }


    reloadTable = () => {
        this.setState({
            reload: true,
            planIdStr: '',
        })
    }

    changeTableData = (value) => {
        this.setState({
            tableData: value,
            reload: false,
        })
    }

    changeHeadData = (headState) =>{
      this.setState({
        headState:headState,
      })
    }

    handlePlanIdStr = (value,palnStatus) => {
        this.setState({
            planIdStr: value,
            palnStatus:palnStatus,
        })
    }
    render() {
        const { tableData, planIdStr,palnStatus, reload,headState } = this.state
        const {params} = this.props
        return (
            <div style={{ padding: '0 25px 0 25px ', backgroundColor: 'white' }}>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="dp-body dp-title">
                            <ListHead reloadTable={this.reloadTable} reload={reload} changeTableData={this.changeTableData} changeHeadData={this.changeHeadData}params={params}/>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <ListButtonGroup reloadTable={this.reloadTable} planIdStr={planIdStr} palnStatus={palnStatus}/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <ListTable reloadTable={this.reloadTable} reload={reload} idxClass={1} data={tableData} handlePlanIdStr={this.handlePlanIdStr} headState={headState} />
                    </Col>
                </Row>
            </div>
        );
    }
}
export default BussinessAssessmentContent;
