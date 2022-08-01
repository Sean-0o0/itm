import {Collapse, Row, Col, Menu, Dropdown, Tooltip} from 'antd';
import React from 'react';
import TodoItems from './TodoItems';
import FastFunction from './FastFunction';
import ProjectSchedule from './ProjectSchedule';
import ProcessSituation from './ProcessSituation';

const {Panel} = Collapse;

class WorkBench extends React.Component {
  state = {};

  componentDidMount() {
  }


  render() {
    const {} = this.state;
    return (
      <Row style={{height: 'calc(100% - 4.5rem)'}}>
        <Row style={{height: '40%'}}>
          <Col span={16} style={{background: 'white', margin: '2rem', height: '100%', padding: '16px 0'}}>
            <div style={{margin: '2rem', fontSize: '16px', fontWeight: 500, color: '#303133', height: '10%'}}>待办事项</div>
            <TodoItems/>
          </Col>
          <Col span={7} style={{background: 'white', margin: '2rem 0', height: '100%', padding: '16px 0'}}>
            <div style={{margin: '2rem', fontSize: '16px', fontWeight: 500, color: '#303133'}}>快捷功能</div>
            <FastFunction/>
          </Col>
        </Row>
        <Row style={{height: '60%'}}>
          <Col span={16} style={{background: 'white', margin: '2rem'}}>
            <div style={{margin: '2rem', fontSize: '16px', fontWeight: 500, color: '#303133', padding: '16px 0'}}>项目进度
            </div>
            <ProjectSchedule/>
          </Col>
          <Col span={7} style={{background: 'white', margin: '2rem 0'}}>
            {/*<div style={{margin: '2rem',fontSize:'16px',fontWeight: 500,color: '#303133'}}>流程情况</div>*/}
            <ProcessSituation/>
          </Col>
        </Row>
      </Row>
    );
  }
}

export default WorkBench;
