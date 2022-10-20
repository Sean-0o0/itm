import React, { useEffect, useState } from 'react';
import { Steps, Icon, Popover, Tooltip } from 'antd';
import Scrollbars from 'react-custom-scrollbars';
import { QueryEpibolyLifeCycleExeStatue } from '../../../../services/pmsServices';
import { element } from 'prop-types';

const { Step } = Steps;

//外包项目模板组件
export default function EpibolyProject() {

  const [xmData, setXmData] = useState([]);
  const [currentStep, setCurrentStep] = useState([]);
  const [stepData, setStepData] = useState([]);
  const [dTaskData, setDTaskData] = useState([]);
  const [isHover, setIsHover] = useState([]);

  useEffect(() => {
    QueryEpibolyLifeCycleExeStatue({}).then(res => {
      let rec = res.record;
      let arr = rec.map(item => {
        return {
          xmid: item.wbxmid,
          xmmc: item.wbxmmc
        }
      });
      let xmInfoData = arrObjDuplication(arr, 'xmid');
      setXmData(p => [...xmInfoData]);
      let arr2 = [];
      xmInfoData.forEach(item => {
        let arr = [];
        rec.forEach(x => {
          if (x.wbxmid === item.xmid) {
            arr.push(x);
          }
        });
        arr2.push(arr);
      })
      let dTaskInfoData = [];
      let stepInfoData = [];
      let curStepArr = [];

      arr2.forEach(item => {
        let dt = [], st = [];
        item.forEach(x => {
          if (x.swlx === '日常任务') {
            dt.push(x);
          } else {
            st.push(x);
          }
        })
        let arr3 = [];//步骤条下的业务数据
        let arr4 = [1, 2, 3, 4, 5];//5个步骤
        let arr5 = [];//每个项目的当前步骤号
        arr4.forEach(item => {
          let arr = [];
          st.forEach(x => {
            if (Number(x.zt) === 2) {
              arr5.push(Number(x.xh));
            }
            if (Number(x.xh) === item) {
              arr.push(x);
            }
          });
          arr3.push(arr);
        });
        if (arr5.length === 0) {
          arr5.push(1);
        }
        curStepArr.push(arrDuplication(arr5));
        dTaskInfoData.push(dt);
        stepInfoData.push(arr3);
      }
      )
      setCurrentStep(p => [...curStepArr]);
      setDTaskData(p => [...dTaskInfoData]);
      setStepData(p => [...stepInfoData]);
    });
  }, []);

  const arrObjDuplication = (arr, uniId) => {
    const map1 = new Map();
    return arr.filter((item) => !map1.has(item[uniId]) && map1.set(item[uniId], 1));
  };
  const arrDuplication = (arr) => {
    return arr.filter((item, index) => {
      return arr.indexOf(item) === index
    });
  };
  const getDailyTask = (txt, index) => {
    return (<div className='daily-task' key={index}>
      <img className='footer-icon' src={require(`../../../../image/pms/EpibolyLifeCycle/icon_01@2x(${index}).png`)} alt=''></img>
      <span className='footer-icon-txt'>{txt}</span>
    </div>);
  };

  const getProcess = (item, index, xmIndex) => {
    const getPoint = (status) => {
      switch (status) {
        case 1:
          return <div className='point' style={{ borderColor: 'rgba(192, 196, 204, 1)' }} />;
        case 2:
          return <div className='point' style={{ borderColor: 'rgba(51, 97, 255, 1)' }} />;
        case 3:
          return <div className='point' style={{ borderColor: 'rgba(51, 97, 255, 1)', backgroundColor: 'rgba(51, 97, 255, 1)' }} />;
        default:
          return <div className='point' style={{ borderColor: 'rgba(192, 196, 204, 1)' }} />;
      }
    };

    const getExe = (status) => {
      switch (status) {
        case 1:
          return '未执行';
        case 2:
          return '执行中';
        case 3:
          return '已执行';
        default:
          return '未执行';
      }
    };
    return (
      <div className='process-box-wrapper' key={index}>
        <div className='triangle-up'>
          {/* <Icon type="caret-up" /> */}
          <img className='header-icon' src={require(`../../../../image/pms/EpibolyLifeCycle/${currentStep.length !== 0 && currentStep[xmIndex][0] - 1 === index || isHover[0] && isHover[1] === index ? 't2@2x' : 't1@2x'}.png`)} alt=''></img>
        </div>
        <div className='process-box' style={currentStep.length !== 0 && currentStep[xmIndex][0] - 1 === index ? { backgroundColor: '#fff' } : {}} onMouseOver={() => { setIsHover(p => [...[true, index]]) }} onMouseLeave={() => { setIsHover(p => [...[false, index]]) }}>
          <Scrollbars autoHide>
            {item.length !== 0 && item.map((element, index) => (
              <div className='process' key={index}>
                {getPoint(Number(element.zt))}
                <span className='process-name'>{element.swmc}<Icon style={{ marginLeft: '1.3392rem' }} type="right" /></span>
                <span className='process-exe' style={Number(element.zt) === 2 ? { color: '#3361FF' } : {}}>{getExe(Number(element.zt))}</span>
              </div>
            ))}
          </Scrollbars>
        </div>
      </div>
    );
  };
  return (
    <>
      {xmData.map((item, index) => (
        <div className='project-item' key={item.xmid}>
          <div className='item-header'>
            <img className='header-icon' src={require('../../../../image/pms/EpibolyLifeCycle/icon_01@2x.png')} alt=''></img>
            <span className='header-txt'>{item.xmmc}</span>
          </div>
          <div className='item-content'>
            <Scrollbars autoHide>
              <Steps className='content-steps' current={currentStep.length !== 0 && Number(currentStep[index][0]) - 1 || 0} size='small'>
                <Step title="需求提出及确认" />
                <Step title="简历管理" />
                <Step title="人员面试" />
                <Step title="人员录用" />
                <Step title="人员入场" />
              </Steps>
              {/* <Tooltip placement="BottomLeft" title={'111'}>
                <div>1</div>
              </Tooltip> */}
              <div className='content-processes' >
                {stepData.length !== 0 && stepData[index].map((x, i) => getProcess(x, i, index))}
              </div>
            </Scrollbars>
          </div>
          <div className='item-footer'>
            <div className='footer-txt'>日常任务</div>
            {dTaskData.length !== 0 && dTaskData[0].map((x, i) => getDailyTask(x.swmc, i + 1))}
          </div>
        </div>
      )
      )}
    </>
  )
}
