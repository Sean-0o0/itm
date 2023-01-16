import { Collapse, Row, Col, Menu, Dropdown, Tooltip, message } from 'antd';
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

const { Panel } = Collapse;

class WorkBench extends React.Component {
  constructor(props) {
    super(props)
    props.cacheLifecycles.didCache(this.componentDidCache)
    props.cacheLifecycles.didRecover(this.componentDidRecover)
  }
  state = {
    wdsl: 0,
    wzxsl: 0,
    TodoItemsData: [],
    AllTodoItemsData: [],
    TodoItemsTotal: 0,
    ProcessSituationData: [],
    ProcessSituationTotal: 0,
    ProjectScheduleData: [],
    ProjectScheduleStatusData: [],
    ProjectScheduleDetailData: [],
    ProjectScheduleTotal: 0,
    sliderData: [],
  };

  componentDidCache = () => {
  }

  componentDidRecover = () => {
    this.fetchQueryOwnerMessage(1, moment(new Date()).format('YYYYMMDD'), 'UNDO');
    this.fetchQueryOwnerWorkflow();
    this.fetchQueryOwnerProjectList();
  }
  componentDidMount() {
    this.fetchQueryOwnerMessage(1, moment(new Date()).format('YYYYMMDD'), 'UNDO');
    this.fetchQueryOwnerWorkflow();
    this.fetchQueryOwnerProjectList();
  }

  fetchQueryOwnerMessage = (page, date, cxlx) => {
    const defaultDate = moment(new Date())
      .format('YYYYMMDD')
    FetchQueryOwnerMessage(
      {
        cxlx: cxlx ? cxlx : "ALL",
        date: Number(date ? date : defaultDate),
        paging: 1,
        current: page ? page : 1,
        pageSize: 6,
        total: -1,
        sort: ''
      }
    ).then(ret => {
      const { code = 0, record = [], totalrows = 0 } = ret;
      if (code === 1) {
        this.setState({
          TodoItemsData: record,
          TodoItemsTotal: totalrows,
          wdsl: record[0]?.wdsl,
          wzxsl: record[0]?.wzxsl,
        });
        this.fetchQueryAllOwnerMessage();
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  fetchQueryAllOwnerMessage = (page, date) => {
    const defaultDate = moment(new Date())
      .format('YYYYMMDD')
    FetchQueryOwnerMessage(
      {
        cxlx: "NUMBER",
        date: 20220101,
        paging: -1,
        current: 0,
        pageSize: 1000,
        total: 1,
        sort: ''
      }
    ).then(ret => {
      const { code = 0, record = [], totalrows = 0 } = ret;
      // console.log("recordrecord",record)
      if (code === 1) {
        // if(0<record.length%6 <= 5){
        //   for(let i=0;i<=record.length%6;i++){
        //     record.push(record[0])
        //   }
        // }
        this.setState({
          AllTodoItemsData: record,
        });
        this.queryOverBudgetData();
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  queryOverBudgetData = () => {
    FetchQueryOwnerMessage({
      cxlx: "OVERBUDGET",
      date: 20220101,
      paging: -1,
      current: 0,
      pageSize: 1000,
      total: 1,
      sort: 1
    }).then(res => {
      if (res.success) {
        this.setState({
          sliderData: [...res.record]
        });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  fetchQueryOwnerWorkflow = (page, pageSize) => {
    FetchQueryOwnerWorkflow({
      paging: 1,
      current: page ? page : 1,
      pageSize: 5,
      total: -1,
      sort: ''
    }).then(ret => {
      const { code = 0, record = [], totalrows = 0 } = ret;
      // console.log("basicData",record);
      if (code === 1) {
        this.setState({
          ProcessSituationTotal: totalrows,
          ProcessSituationData: record,
        });
      }
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
      const { record, code, totalrows = 0 } = ret;
      if (code === 1) {
        this.fetchQueryLiftcycleMilestone(record, totalrows)
        this.fetchQueryLifecycleStuff(record)
      }
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
        const { record = [], code = 0 } = ret;
        if (code === 1) {
          //zxxh排序
          e[i].extend = false;
          e[i].kssj = record[0].kssj
          e[i].jssj = record[0].jssj
          e[i].zt = record[0].zt
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
      const xmid = e[i].xmid;
      FetchQueryLifecycleStuff({
        cxlx: 'SINGLE',
        xmmc: e[i].xmid,
      }).then((ret = {}) => {
        const { code = 0, record = [] } = ret;
        if (code === 1) {
          // console.log("recordList",recordList)
          // record.map((item = {}, index) => {
          //   item.xmid = e[i].xmid;
          // })
          recordList.push({ xmid: xmid, List: record });
          // console.log("recordList", recordList);
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
    const { ProjectScheduleData } = this.state;
    ProjectScheduleData.map((item = {}, index) => {
      if (index === number) {
        item.extend = !item.extend;
      }
    })
    console.log(ProjectScheduleData);
    this.setState({
      ProjectScheduleData,
    })
  }

  render() {
    const {
      wdsl,
      wzxsl,
      TodoItemsData = [],
      AllTodoItemsData = [],
      TodoItemsTotal = 0,
      ProcessSituationData = [],
      ProcessSituationTotal = 0,
      ProjectScheduleData = [],
      ProjectScheduleTotal = 0,
      ProjectScheduleDetailData = [],
      sliderData,
    } = this.state;
    return (
      <div style={{ height: 'calc(100% - 4.5rem)' }}>
        <div style={{ height: '40%', margin: '0 3.571rem 3.571rem 3.571rem' }}>
          <Row style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row', marginTop: '3.571rem' }}>
            <Col xs={24} sm={24} lg={24} xl={24} style={{ display: 'flex', flexDirection: 'row', }}>
              <div style={{
                boxSizing: 'border-box',
                boxShadow: '#ececec 0 3px 10px',
                borderRadius: '10px',
                width: '75%',
                background: 'white'
              }}>
                <div style={{ height: '100%' }}>
                  <TodoItems wzxsl={wzxsl} allData={AllTodoItemsData} data={TodoItemsData} total={TodoItemsTotal}
                    fetchQueryOwnerMessage={this.fetchQueryOwnerMessage} />
                </div>
              </div>
              <div style={{
                marginLeft: '3.571rem',
                width: '25%',
                overflow: 'hidden'
              }}>
                <FastFunction fetchQueryOwnerProjectList={this.fetchQueryOwnerProjectList} sliderData={sliderData} />
              </div>
            </Col>
          </Row>
        </div>
        <div style={{ height: '60%', margin: '0 3.571rem 3.571rem 3.571rem' }}>
          <Row style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row', marginTop: '3.571rem' }}>
            <Col xs={24} sm={24} lg={24} xl={24} style={{ display: 'flex', flexDirection: 'row', }}>
              <div style={{
                boxSizing: 'border-box',
                boxShadow: '#ececec 0 3px 10px',
                borderRadius: '10px',
                width: '75%',
                background: 'white'
              }}>
                <div style={{ height: '100%' }}>
                  <ProjectSchedule data={ProjectScheduleData} total={ProjectScheduleTotal}
                    fetchQueryOwnerProjectList={this.fetchQueryOwnerProjectList}
                    ProjectScheduleDetailData={ProjectScheduleDetailData} extend={this.extend} />
                </div>
              </div>
              <div style={{
                marginLeft: '3.571rem',
                boxSizing: 'border-box',
                boxShadow: '#ececec 0 3px 10px',
                borderRadius: '10px',
                width: '25%',
                background: 'white'
              }}>
                <div style={{ height: '100%' }}>
                  {/*<div style={{display: 'flex'}}>*/}
                  {/*  <div style={{margin: '2rem',fontSize:'16px',fontWeight: 700,color: '#303133'}}>流程情况</div>*/}
                  {/*</div>*/}
                  <ProcessSituation data={ProcessSituationData} fetchQueryOwnerWorkflow={this.fetchQueryOwnerWorkflow}
                    total={ProcessSituationTotal} />
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
