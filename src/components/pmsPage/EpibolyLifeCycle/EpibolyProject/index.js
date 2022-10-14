import React from 'react';
import { Steps, Icon } from 'antd';

const { Step } = Steps;

//外包项目模板组件
export default function EpibolyProject() {


  const getDailyTask = () => {
    return (<div className='daily-task'>
      <img className='footer-icon' src={require('../../../../image/pms/EpibolyLifeCycle/icon_01@2x(1).png')} alt=''></img>
      <span className='footer-icon-txt'>试用期考核</span>
    </div>);
  };
  const getPoint = (status) => {
    return (
      <div>
        {
          status !== "" ? <div className='point' style={{ borderColor: 'rgba(51, 97, 255, 1)', backgroundColor: 'rgba(51, 97, 255, 1)' }} />
            :
            <div className='point' style={{ borderColor: 'rgba(192, 196, 204, 1)' }} />
        }
      </div>
    );
  };

  const getProcess = () => {
    return (
      <div className='process-box-wrapper'>
      <div className='triangle-up'></div>
      <div className='process-box'>
        <div className='process'>
          {getPoint('')}
          <span className='process-name'>立项申请流程发起</span>
          <Icon style={{ marginLeft: '1.3392rem' }} type="right" />
          <span className='process-exe'>已执行</span>
        </div>
        <div className='process'>
          {getPoint('')}
          <span className='process-name'>立项申请流程发起</span>
          <Icon style={{ marginLeft: '1.3392rem' }} type="right" />
          <span className='process-exe'>已执行</span>
        </div>
        <div className='process'>
          {getPoint('')}
          <span className='process-name'>立项申请流程发起</span>
          <Icon style={{ marginLeft: '1.3392rem' }} type="right" />
          <span className='process-exe'>已执行</span>
        </div>
      </div>
      </div>
    );
  };
  return (
    <div className='project-item'>
      <div className='item-header'>
        <img className='header-icon' src={require('../../../../image/pms/EpibolyLifeCycle/icon_01@2x.png')} alt=''></img>
        <span className='header-txt'>外包项目1</span>
      </div>
      <div className='item-content'>
        <Steps className='content-steps' current={1}>
          <Step title="Step1" />
          <Step title="Step2" />
          <Step title="Step3" />
          <Step title="Step4" />
          <Step title="Step5" />
        </Steps>
        <div className='content-processes'>
        {getProcess()}
        {getProcess()}
        {getProcess()}
        {getProcess()}
        {getProcess()}
        </div>
      </div>
      <div className='item-footer'>
        <div className='footer-txt'>日常任务</div>
        {getDailyTask()}
        {getDailyTask()}
        {getDailyTask()}
        {getDailyTask()}
        {getDailyTask()}
        {getDailyTask()}
      </div>
    </div>
  )
}
