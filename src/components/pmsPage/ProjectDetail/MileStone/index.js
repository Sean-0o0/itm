import React, { useEffect, useState } from 'react';
import { Button, Popover, Steps, Tooltip } from 'antd';
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
  const getRiskTag = data => {
    const riskPopoverContent = data => {
      data = [
        {
          fl: '标题1',
          BT: '标题1-1',
          NR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          CLNR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          status: 1,
        },
        {
          fl: '标题1',
          BT: '标题1-1',
          NR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          CLNR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          status: 1,
        },
        {
          fl: '标题1',
          BT: '标题1-1',
          NR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          CLNR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          status: 2,
        },
        {
          fl: '标题1',
          BT: '标题1-1',
          NR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          CLNR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          status: 1,
        },
        {
          fl: '标题1',
          BT: '标题1-1',
          NR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          CLNR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          status: 1,
        },
      ];
      const getItem = (label, content) => {
        return (
          <div className="content">
            <span className="label">{label}：</span>
            <span>{content}</span>
          </div>
        );
      };
      return (
        <div className="list">
          {data.map((x, i) => (
            <div className="item" key={i}>
              <div className="top">
                <div className="left-bar"></div>
                {x.BT}
                {x.status === 1 ? (
                  <div className="handled-tag">
                    <div className="dot"></div>
                    已处理
                  </div>
                ) : (
                  <div className="unhandled-tag">
                    <div className="dot"></div>
                    未处理
                  </div>
                )}
              </div>
              {getItem('风险标题', x.NR || '')}
              {getItem('风险内容', x.NR || '')}
              {getItem('处理内容', x.CLNR || '')}
            </div>
          ))}
        </div>
      );
    };
    return (
      <Popover
        placement="rightBottom"
        title={null}
        content={riskPopoverContent(data)}
        overlayClassName="risk-content-popover"
      >
        <div className="risk-tag">有风险</div>
      </Popover>
    );
  };
  const reoprMoreCotent = (
    <div className="list">
      <div
        className="item"
        onClick={() => {
          // setEditingIndex(id);
          // setDrawerVisible(true);
        }}
      >
        选项123
      </div>
      <div
        className="item"
        onClick={() => {
          // handleMsgDelete(id, content);
        }}
      >
        选项234
      </div>
    </div>
  );

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
            subTitle={getRiskTag()}
            status="finish"
            description="2023-04-04至04-08"
          />
          <Step
            title="项目立项"
            subTitle={getRiskTag()}
            status="finish"
            description="2023-04-04至04-08"
          />
          <Step
            title="项目立项"
            subTitle={getRiskTag()}
            status="finish"
            description="2023-04-04至04-08"
          />
          <Step
            title="项目立项"
            subTitle={getRiskTag()}
            status="finish"
            description="2023-04-04至04-08"
          />
          <Step
            title="项目立项"
            subTitle={getRiskTag()}
            status="finish"
            description="2023-04-04至04-08"
          />
          <Step
            title="项目立项"
            subTitle={getRiskTag()}
            status="finish"
            description="2023-04-04至04-08"
          />
        </Steps>
      </div>
      <div className="bottom-box">
        <div className="left-box">
          <div className="top">
            <div className="circle">
              <div className="dot"></div>
            </div>
            项目实施
            <div className="rate-tag">进度50%</div>
          </div>
          <div className="middle">
            <div className="current-plan">现计划：2023-04-04至04-08</div>
            <div className="original-plan">原计划：2023-04-04至04-08</div>
            <div className="remarks">(延迟16天，修改一次)</div>
          </div>
          <div className="bottom">
            项目风险：
            <Button>
              <sapn>+</sapn>添加
            </Button>
          </div>
        </div>
        <div className="right-box">
          <div className="item">
            <div className="item-top"></div>
            <div className="item-bottom">
              <div className="bottom-row">
                <i className="iconfont circle-reduce" />
                {/* <i className="iconfont circle-check" /> */}
                <Tooltip title={'需求文档'}>
                  <span>需求文档</span>
                </Tooltip>
                {/* <div className="opr-btn">上传</div> */}
                <div className="opr-more">
                  <div className="reopr-btn">重新上传</div>
                  <Popover
                    placement="bottom"
                    title={null}
                    content={reoprMoreCotent}
                    overlayClassName="msg-edit-content-popover"
                  >
                    <div className="reopr-more">
                      <i className="iconfont circle-reduce" />
                    </div>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
