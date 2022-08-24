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
  }

  fetchQueryOwnerMessage = (e) => {
    FetchQueryOwnerMessage(
      {
        paging: 1,
        current: e ? e : 1,
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
      this.fetchQueryOwnerWorkflow();
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
  fetchQueryOwnerProjectList = () => {
    FetchQueryOwnerProjectList(
      {
        cxlx: 'USER',
        paging: 1,
        current: 1,
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

  onclickdb = () => {
    window.open("http://10.52.130.12/ZSZQOA/getURLSyncBPM.do?_BPM_FUNCCODE=C_FormSetFormData&_tf_file_id=1728341&_bpm_task_taskid=63336317");
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
      <Row style={{height: 'calc(100% - 4.5rem)'}}>
        <Row style={{height: '40%'}}>
          <Col span={16} style={{background: 'white', margin: '2rem', height: '70rem', padding: '16px 0'}}>
            <div style={{display: 'flex'}}>
              <div style={{
                width: '20%',
                margin: '2rem',
                fontSize: '16px',
                fontWeight: 500,
                color: '#303133',
                height: '10%'
              }} onClick={this.onclickdb}>待办事项
              </div>
              <div style={{width: '70%', height: '10%', margin: '2rem', textAlign: 'end'}}>
                <i style={{color: 'red', paddingRight: ".5rem", verticalAlign: 'middle'}}
                   className="iconfont icon-message"/><span
                style={{fontSize: '14px', fontWeight: 400, color: '#303133', verticalAlign: 'middle'}}>未读 <span
                style={{color: 'rgba(215, 14, 25, 1)'}}>{wdsl}</span></span>
                <i style={{color: 'red', padding: "0 .5rem 0 3rem", verticalAlign: 'middle'}}
                   className="iconfont icon-warning"/><span
                style={{fontSize: '14px', fontWeight: 400, color: '#303133', verticalAlign: 'middle'}}>未完成 <span
                style={{color: 'rgba(215, 14, 25, 1)'}}>{wzxsl}</span></span>
              </div>
            </div>
            <TodoItems data={TodoItemsData} total={TodoItemsTotal}
                       fetchQueryOwnerMessage={this.fetchQueryOwnerMessage}/>
          </Col>
          <Col span={7} style={{background: 'white', margin: '2rem 0', height: '70rem', padding: '16px 0'}}>
            <div style={{margin: '2rem', fontSize: '16px', fontWeight: 500, color: '#303133'}}>快捷功能</div>
            <FastFunction/>
          </Col>
        </Row>
        <Row style={{height: '60%'}}>
          <Col span={16} style={{background: 'white', margin: '2rem', height: '70rem'}}>
            <div style={{margin: '2rem', fontSize: '16px', fontWeight: 500, color: '#303133', padding: '16px 0'}}>项目进度
            </div>
            <ProjectSchedule data={ProjectScheduleData} total={ProjectScheduleTotal}
                             ProjectScheduleDetailData={ProjectScheduleDetailData} extend={this.extend}/>
          </Col>
          <Col span={7} style={{background: 'white', margin: '2rem 0', height: '70rem'}}>
            {/*<div style={{margin: '2rem',fontSize:'16px',fontWeight: 500,color: '#303133'}}>流程情况</div>*/}
            <ProcessSituation data={ProcessSituationData} fetchQueryOwnerWorkflow={this.fetchQueryOwnerWorkflow}
                              total={ProcessSituationTotal}/>
          </Col>
        </Row>
      </Row>
    );
  }
}

export default WorkBench;
