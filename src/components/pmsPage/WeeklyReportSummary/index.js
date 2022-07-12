import {Row, Col, Card,} from 'antd';
import React from 'react';
import { Link } from 'dva/router';
import OperationList from './OperationList';
import weekNum from '../../../image/pms/week-num.png';
import fund from '../../../image/pms/fund.png';
import project from '../../../image/pms/project.png';
import main from '../../../image/pms/main.png';
class WeeklyReportSummary extends React.Component {
  state = {
  };

  componentDidMount() {
  }

  handleClick(){
    window.location.href = `/#/pms/manage/WeeklyReportTable`
  }

  render() {
    const { } = this.state;
    return (
      <Row style={{height:'100%'}} className="WeeklyReportSummary">
        <Col span={24} style={{height:'8%'}}>
          <OperationList/>
        </Col>
        <Col span={24} style={{height:'92%'}}>
          <div className="tabs">
            <Row>
              <Col span={8} style={{padding:'2rem'}}>
                <Card className="card" hoverable style={{ width: '100%'}} bodyStyle={{padding:'1rem' }} onClick={this.handleClick}>
                  <div className="cardTitle">
                    <div className="left">
                      <img src={weekNum} alt="" style={{width:'2rem',height:'2rem'}}/>
                      &nbsp;数字化专班
                    </div>
                    <div className="right">
                      20
                    </div>
                  </div>
                  <div className="cardCont">
                    <div className="left">
                      更新时间&nbsp;&nbsp;&nbsp;
                      <span style={{color:'rgba(63, 170, 255, 1)'}}>2022.07.07</span>
                    </div>
                    <div className="right">
                      项目数量
                    </div>
                  </div>
                  <div className="cardCont">
                    未填写项目&nbsp;&nbsp;&nbsp;
                    <span style={{color:'rgba(63, 170, 255, 1)'}}>项目信息管理系统、战略规划平台</span>
                  </div>
                  <div className="cardCont">
                    风险项目&nbsp;&nbsp;&nbsp;
                    <span style={{color:'rgba(63, 170, 255, 1)'}}>项目信息管理系统</span>
                  </div>
                  <div className="cardTotal">
                  </div>
                </Card>
              </Col>
              <Col span={8} style={{padding:'2rem'}}>
                <Card className="card"  hoverable style={{ width: '100%'}} bodyStyle={{padding:'1rem' }} onClick={this.handleClick}>
                  <div className="cardTitle">
                    <div className="left">
                      <img src={fund} alt="" style={{width:'2rem',height:'2rem'}}/>
                      &nbsp;集团数字化
                    </div>
                    <div className="right">
                      20
                    </div>
                  </div>
                  <div className="cardCont">
                    <div className="left">
                      更新时间&nbsp;&nbsp;&nbsp;
                      <span style={{color:'rgba(63, 170, 255, 1)'}}>2022.07.07</span>
                    </div>
                    <div className="right">
                      项目数量
                    </div>
                  </div>
                  <div className="cardCont">
                    未填写项目&nbsp;&nbsp;&nbsp;
                    <span style={{color:'rgba(63, 170, 255, 1)'}}>项目信息管理系统、战略规划平台</span>
                  </div>
                  <div className="cardCont">
                    风险项目&nbsp;&nbsp;&nbsp;
                    <span style={{color:'rgba(63, 170, 255, 1)'}}>项目信息管理系统</span>
                  </div>
                  <div className="cardTotal">
                  </div>
                </Card>
              </Col>
              <Col span={8} style={{padding:'2rem'}}>
                <Card className="card"  hoverable style={{ width: '100%'}} bodyStyle={{padding:'1rem' }} onClick={this.handleClick}>
                  <div className="cardTitle">
                    <div className="left">
                      <img src={project} alt="" style={{width:'2rem',height:'2rem'}}/>
                      &nbsp;信创项目
                    </div>
                    <div className="right">
                      20
                    </div>
                  </div>
                  <div className="cardCont">
                    <div className="left">
                      更新时间&nbsp;&nbsp;&nbsp;
                      <span style={{color:'rgba(63, 170, 255, 1)'}}>2022.07.07</span>
                    </div>
                    <div className="right">
                      项目数量
                    </div>
                  </div>
                  <div className="cardCont">
                    未填写项目&nbsp;&nbsp;&nbsp;
                    <span style={{color:'rgba(63, 170, 255, 1)'}}>项目信息管理系统、战略规划平台</span>
                  </div>
                  <div className="cardCont">
                    风险项目&nbsp;&nbsp;&nbsp;
                    <span style={{color:'rgba(63, 170, 255, 1)'}}>项目信息管理系统</span>
                  </div>
                  <div className="cardTotal">
                  </div>
                </Card>
              </Col>
              <Col span={8} style={{padding:'2rem'}}>
                <Card className="card" hoverable style={{ width: '100%'}} bodyStyle={{padding:'1rem' }} onClick={this.handleClick}>
                  <div className="cardTitle">
                    <div className="left">
                      <img src={main} alt="" style={{width:'2rem',height:'2rem'}}/>
                      &nbsp;重点项目
                    </div>
                    <div className="right">
                      20
                    </div>
                  </div>
                  <div className="cardCont">
                    <div className="left">
                      更新时间&nbsp;&nbsp;&nbsp;
                      <span style={{color:'rgba(63, 170, 255, 1)'}}>2022.07.07</span>
                    </div>
                    <div className="right">
                      项目数量
                    </div>
                  </div>
                  <div className="cardCont">
                    未填写项目&nbsp;&nbsp;&nbsp;
                    <span style={{color:'rgba(63, 170, 255, 1)'}}>项目信息管理系统、战略规划平台</span>
                  </div>
                  <div className="cardCont">
                    风险项目&nbsp;&nbsp;&nbsp;
                    <span style={{color:'rgba(63, 170, 255, 1)'}}>项目信息管理系统</span>
                  </div>
                  <div className="cardTotal">
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    );
  }
}

export default WeeklyReportSummary;
