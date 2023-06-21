import React, {useEffect, useState, useRef} from 'react';
import {Icon, message, Rate, Tabs} from 'antd';
import styles from "../../../Common/TagSelect/index.less";

const {TabPane} = Tabs;

export default function RepInfos(props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showExtends, setShowExtends] = useState(false);

  useEffect(() => {
    return () => {
    };
  }, []);

  const item = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <>
      <div className="rep-infos">
        <div className="rep-infos-title">
          我收藏的
        </div>
        <div className="rep-infos-box">
          {
            item.map(i => {
              return <div className="rep-infos-content">
                <div className="rep-infos-content-box">
                  <div className="rep-infos-name">
                    集团预算统计报告<Rate className="rep-infos-star" count={1}/>
                  </div>
                  <div className="rep-infos-time">
                    王建军 2023-05-25创建
                  </div>
                </div>
              </div>
            })
          }
        </div>
        {
          true && (
            <a className='rep-infos-foot' onClick={() => setShowExtends(!showExtends)}>
              {showExtends ? '收起' : '展开'} <Icon type={showExtends ? 'up' : 'down'}/>
            </a>
          )
        }
      </div>
      <div className="rep-infos">
        <div className="rep-infos-title">
          我创建的
        </div>
        <div className="rep-infos-content">
          {
            item.map(i => {
              return <div className="rep-infos-content">
                <div className="rep-infos-content-box">
                  <div className="rep-infos-name">
                    集团预算统计报告<Rate className="rep-infos-star" count={1}/>
                  </div>
                  <div className="rep-infos-time">
                    王建军 2023-05-25创建
                  </div>
                </div>
              </div>
            })
          }
        </div>
      </div>
    </>
  );
}
