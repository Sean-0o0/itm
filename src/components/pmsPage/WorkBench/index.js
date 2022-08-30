import {Collapse, Row, Col, Menu, Dropdown, Tooltip, message} from 'antd';
import React from 'react';
import TodoItems from './TodoItems';
import FastFunction from './FastFunction';
import ProjectSchedule from './ProjectSchedule';
import ProcessSituation from './ProcessSituation';
import {
  FetchQueryLifecycleStuff, FetchQueryLiftcycleMilestone,
  FetchQueryOwnerMessage,
  FetchQueryOwnerProjectList,
  FetchQueryOwnerWorkflow
} from "../../../services/pmsServices";
import moment from "moment";

const {Panel} = Collapse;

class WorkBench extends React.Component {
  state = {
    wdsl: 0,
    wzxsl: 0,
    TodoItemsData: [],
    TodoItemsTotal: 0,
    ProcessSituationData: [],
    ProcessSituationTotal: 0,
    ProjectScheduleData: [],
    ProjectScheduleStatusData: [],
    ProjectScheduleDetailData: [],
    ProjectScheduleTotal: 0,
  };

  componentDidMount() {
    this.fetchQueryOwnerMessage();
    this.fetchQueryOwnerWorkflow();
  }

  fetchQueryOwnerMessage = (page, date) => {
    const defaultDate = moment(new Date())
      .format('YYYYMMDD')
    FetchQueryOwnerMessage(
      {
        date: date ? date : defaultDate,
        paging: 1,
        current: page ? page : 1,
        pageSize: 6,
        total: -1,
        sort: ''
      }
    ).then(ret => {
      const {code = 0, record = [], totalrows = 0} = ret;
      // console.log("recordrecord",record)
      if (code === 1) {
        // if(0<record.length%6 <= 5){
        //   for(let i=0;i<=record.length%6;i++){
        //     record.push(record[0])
        //   }
        // }
        this.setState({
          TodoItemsData: record,
          TodoItemsTotal: totalrows,
          wdsl: record[0]?.wdsl,
          wzxsl: record[0]?.wzxsl,
        });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  fetchQueryOwnerWorkflow = (page, pageSize) => {
    FetchQueryOwnerWorkflow({
      paging: 1,
      current: page ? page : 1,
      pageSize: pageSize ? pageSize : 5,
      total: -1,
      sort: ''
    }).then(ret => {
      const {code = 0, record = [], totalrows = 0} = ret;
      // console.log("basicData",record);
      if (code === 1) {
        this.setState({
          ProcessSituationTotal: totalrows,
          ProcessSituationData: record,
        });
      }
      this.fetchQueryOwnerProjectList();
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  //查询当前用户项目列表
  fetchQueryOwnerProjectList = (e) => {
    FetchQueryOwnerProjectList(
      {
        cxlx: 'USER',
        paging: 1,
        current: e ? e : 1,
        pageSize: 5,
        total: -1,
        sort: ''
      }
    ).then((ret = {}) => {
      const {record, code, totalrows = 0} = ret;
      if (code === 1) {
        this.fetchQueryLiftcycleMilestone(record, totalrows)
      }
      this.fetchQueryLifecycleStuff(record)
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  fetchQueryLiftcycleMilestone = (e, total) => {
    for (let i = 0; i < e.length; i++) {
      FetchQueryLiftcycleMilestone({
        cxlx: 'SINGLE',
        xmmc: e[i].xmid,
      }).then((ret = {}) => {
        const {record = [], code = 0} = ret;
        // console.log("basicData",record);
        if (code === 1) {
          //zxxh排序
          e.map((item = {}, index) => {
            item.extend = false;
            if (index === 0) {
              item.extend = true;
            }
            item.kssj = record[0].kssj
            item.jssj = record[0].jssj
            item.zt = record[0].zt
            item.fxnr = record[0].fxnr
          })
          // console.log("ProjectScheduleData",e)
          this.setState({
            ProjectScheduleTotal: total,
            ProjectScheduleData: e,
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }

  fetchQueryLifecycleStuff = (e = []) => {
    const recordList = [];
    for (let i = 0; i < e.length; i++) {
      FetchQueryLifecycleStuff({
        cxlx: 'SINGLE',
        xmmc: e[i].xmid,
      }).then((ret = {}) => {
        const {code = 0, record = []} = ret;
        if (code === 1) {
          // console.log("recordList",recordList)
          record.map((item = {}, index) => {
            item.xmid = e[i].xmid;
          })
          recordList.push(record)
          this.setState({
            ProjectScheduleDetailData: recordList,
          })
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
        return null;
      });
    }
  }

  extend = (number) => {
    const {ProjectScheduleData} = this.state;
    ProjectScheduleData.map((item = {}, index) => {
      if (index === number) {
        item.extend = !item.extend;
      }
    })
    this.setState({
      ProjectScheduleData,
    })
  }

  render() {
    const {
      wdsl,
      wzxsl,
      TodoItemsData = [],
      TodoItemsTotal = 0,
      ProcessSituationData = [],
      ProcessSituationTotal = 0,
      ProjectScheduleData = [],
      ProjectScheduleTotal = 0,
      ProjectScheduleDetailData = []
    } = this.state;
    return (
      <div style={{height: 'calc(100% - 4.5rem)'}}>
        <div style={{height: '40%', marginBottom: '1rem'}}>
          <Row style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'row', marginTop: '2rem'}}>
            <Col xs={24} sm={24} lg={24} xl={24} style={{display: 'flex', flexDirection: 'row',}}>
              <div style={{
                boxSizing: 'border-box',
                boxShadow: '#ececec 0 3px 10px',
                borderRadius: '10px',
                width: '75%',
                background: 'white'
              }}>
                <div style={{height: '100%'}}>
                  <TodoItems wzxsl={wzxsl} data={TodoItemsData} total={TodoItemsTotal}
                             fetchQueryOwnerMessage={this.fetchQueryOwnerMessage}/>
                </div>
              </div>
              <div style={{
                marginLeft: '2rem',
                boxSizing: 'border-box',
                boxShadow: '#ececec 0 3px 10px',
                borderRadius: '10px',
                width: '25%',
                background: 'white'
              }}>
                <div style={{height: '100%'}}>
                  <FastFunction/>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div style={{height: '60%', marginBottom: '1rem'}}>
          <Row style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'row', marginTop: '2rem'}}>
            <Col xs={24} sm={24} lg={24} xl={24} style={{display: 'flex', flexDirection: 'row',}}>
              <div style={{
                boxSizing: 'border-box',
                boxShadow: '#ececec 0 3px 10px',
                borderRadius: '10px',
                width: '75%',
                background: 'white'
              }}>
                <div style={{height: '100%'}}>
                  <ProjectSchedule data={ProjectScheduleData} total={ProjectScheduleTotal}
                                   fetchQueryOwnerProjectList={this.fetchQueryOwnerProjectList}
                                   ProjectScheduleDetailData={ProjectScheduleDetailData} extend={this.extend}/>
                </div>
              </div>
              <div style={{
                marginLeft: '2rem',
                boxSizing: 'border-box',
                boxShadow: '#ececec 0 3px 10px',
                borderRadius: '10px',
                width: '25%',
                background: 'white'
              }}>
                <div style={{height: '100%'}}>
                  {/*<div style={{display: 'flex'}}>*/}
                  {/*  <div style={{margin: '2rem',fontSize:'16px',fontWeight: 700,color: '#303133'}}>流程情况</div>*/}
                  {/*</div>*/}
                  <ProcessSituation data={ProcessSituationData} fetchQueryOwnerWorkflow={this.fetchQueryOwnerWorkflow}
                                    total={ProcessSituationTotal}/>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default WorkBench;
