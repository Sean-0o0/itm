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
  FetchQueryOwnerWorkflow,
  FetchQueryProjectInfoInCycle
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
      console.error(!error.success ? error.message : error.note);
      // console.log('问题处在这');
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
      console.error(!error.success ? error.message : error.note);
      // console.log('问题处在这',2);
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
      console.error(!error.success ? error.message : error.note);
      // console.log('问题处在这',3);
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
      console.error(!error.success ? error.message : error.note);
      // console.log('问题处在这',4);
    });
  }

  //查询当前用户项目列表
  fetchQueryOwnerProjectList = (e) => {
    FetchQueryOwnerProjectList(
      {
        cxlx: 'INDEX',
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
      console.error(!error.success ? error.message : error.note);
      // console.log('问题处在这',5);
    });
  }

  fetchQueryLiftcycleMilestone = (e, total) => {
    (e[0]) && FetchQueryProjectInfoInCycle({
      xmmc: (e[0])?.xmid,
    }).then(res => {
      let userid = res?.record?.userid;
      let indexArr = [];
      e.forEach((item, index) => {
        if (item.zt !== '2')
          indexArr.push(index);
      })
      indexArr.push(-1);
      for (let i = 0; i < e.length; i++) {
        console.log(e[i]);
        if ((e[i])?.zt !== '2') {
          FetchQueryLiftcycleMilestone({
            cxlx: 'SINGLE',
            xmmc: (e[i])?.xmid,
          }).then((ret = {}) => {
            const { record = [], code = 0 } = ret;
            if (code === 1 && record[0]) {
              //zxxh排序
              e[i].extend = i === indexArr[0];//第一个不为草稿的
              e[i].kssj = (record[0])?.kssj
              e[i].jssj = (record[0])?.jssj
              e[i].status = (record[0])?.zt
              e[i].userid = userid;
              this.setState({
                ProjectScheduleTotal: total,
                ProjectScheduleData: e,
              });
            }
          });
        } else {
          this.setState({
            ProjectScheduleTotal: total,
            ProjectScheduleData: e,
          });
        }
      }
    });
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
        console.error(!error.success ? error.message : error.note);
        // console.log('问题处在这',7);
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
      ProjectScheduleData,
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
                boxShadow: '#ececec 0 0.4464rem 1.488rem',
                borderRadius: '1.488rem',
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
                overflow: 'hidden',
                height: '100%',
              }}>
                <FastFunction fetchQueryOwnerProjectList={this.fetchQueryOwnerProjectList}
                  sliderData={sliderData}
                  data={ProcessSituationData}
                  fetchQueryOwnerWorkflow={this.fetchQueryOwnerWorkflow}
                  total={ProcessSituationTotal} />
              </div>
            </Col>
          </Row>
        </div>
        <div style={{ height: '60%', margin: '0 3.571rem 3.571rem 3.571rem' }}>
          <Row style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row', marginTop: '3.571rem' }}>
            <Col xs={24} sm={24} lg={24} xl={24} style={{ display: 'flex', flexDirection: 'row', }}>
              <div style={{
                boxSizing: 'border-box',
                boxShadow: '#ececec 0 0.4464rem 1.488rem',
                borderRadius: '1.488rem',
                width: '100%',
                background: 'white'
              }}>
                <div style={{ height: '100%' }}>
                  <ProjectSchedule data={ProjectScheduleData} total={ProjectScheduleTotal}
                    fetchQueryOwnerProjectList={this.fetchQueryOwnerProjectList}
                    ProjectScheduleDetailData={ProjectScheduleDetailData} extend={this.extend} />
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
