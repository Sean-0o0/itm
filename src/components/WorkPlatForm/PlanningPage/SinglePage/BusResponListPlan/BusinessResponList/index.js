import React from 'react';
import BusListHead from './BusListHead'
import BusListButtonGroup from './BusListButtonGroup'
import BusListTable from './BusListTable'
import { FetchQueryBusResponList } from '../../../../../../services/planning/planning';
import { Col, Row } from 'antd';

class BusinessResponList extends React.Component {
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
      //console.log('-------testchenj-----', params);
      if(JSON.stringify(params) !== "{}"){
        FetchQueryBusResponList({
          'yr': params.year?params.year:new Date().getFullYear(),
          'status': params.schemeTypeStatusId===-2?99:params.schemeTypeStatusId,
          // 'planType':params.schemeTypeId===-2?'':params.schemeTypeId,
          'orgId':params.objId ===-2?'':params.objId,
        }).then((res) => {
          this.setState({
            tableData: res.records
          })
        })
      }else{
        //console.log('-------主页面1-----', this.props.params);
        FetchQueryBusResponList({
          'yr': new Date().getFullYear(),
          'status': 99
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
                            <BusListHead reloadTable={this.reloadTable} reload={reload} changeTableData={this.changeTableData} changeHeadData={this.changeHeadData}params={params}/>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <BusListButtonGroup reloadTable={this.reloadTable} planIdStr={planIdStr} palnStatus={palnStatus}/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <BusListTable reloadTable={this.reloadTable} reload={reload} idxClass={1} data={tableData} handlePlanIdStr={this.handlePlanIdStr} headState={headState} />
                    </Col>
                </Row>
            </div>
        );
    }
}
export default BusinessResponList;
