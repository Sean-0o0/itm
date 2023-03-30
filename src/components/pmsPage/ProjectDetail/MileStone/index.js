import React, { useEffect, useState } from 'react';
import { Steps } from 'antd';
import overallRateImg from '../../../../assets/projectDetail/overall-rate.png';

const { Step } = Steps;

export default function MileStone(props) {
  const {} = props;
  const [currentStep, setCurrentStep] = useState(0); //当前步骤

  useEffect(() => {
    return () => {};
  }, []);
  const handleStepChange = v => {
    console.log('handleStepChange', v);
    setCurrentStep(v);
  };

  return (
    <div className="mile-stone-box">
      <div className="top-box">
        项目里程碑
        <div className="overall-rate">
          <img src={overallRateImg} alt="" />
          <span>项目整体进度：</span>
          <span className="rate">31%</span>
        </div>
      </div>
      <div className="middle-box">
        <Steps type="navigation" size="small" current={currentStep} onChange={handleStepChange}>
          <Step
            title="项目立项"
            subTitle={<a>jjj</a>}
            status="finish"
            description="2023-04-04至04-08"
          />
          <Step
            title="项目立项"
            subTitle={<a>jjj</a>}
            status="finish"
            description="2023-04-04至04-08"
          />
          <Step
            title="项目立项"
            subTitle={<a>jjj</a>}
            status="finish"
            description="2023-04-04至04-08"
          />
          <Step
            title="项目立项"
            subTitle={<a>jjj</a>}
            status="finish"
            description="2023-04-04至04-08"
          />
          <Step
            title="项目立项"
            subTitle={<a>jjj</a>}
            status="finish"
            description="2023-04-04至04-08"
          />
          <Step
            title="项目立项"
            subTitle={<a>jjj</a>}
            status="finish"
            description="2023-04-04至04-08"
          />
        </Steps>
      </div>
      <div className="bottom-box">
        <div className="content">example</div>
      </div>
    </div>
  );
}
