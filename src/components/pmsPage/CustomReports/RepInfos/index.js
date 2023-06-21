import React, {useEffect, useState, useRef} from 'react';
import {Button, Icon, message, Rate, Select, Tabs} from 'antd';
import styles from "../../../Common/TagSelect/index.less";

const {TabPane} = Tabs;

export default function RepInfos(props) {
  const [showExtendsWD, setShowExtendsWD] = useState(false);
  const [showExtendsCJ, setShowExtendsCJ] = useState(false);
  const [showExtendsGX, setShowExtendsGX] = useState(false);
  const [bbmc, setBbmc] = useState(false);
  const [cjr, setCjr] = useState(false);
  const {
    cusRepDataWD = [],
    totalWD = 0,
    cusRepDataCJ = [],
    totalCJ = 0,
    cusRepDataGX = [],
    totalGX = 0,
    tabsKey = 1,
    params = {},
    paramsCallback,
    getCusRepData,
  } = props;

  useEffect(() => {
    return () => {
    };
  }, []);

  const handleBbmcChange = (key) => {
    setBbmc(key);
    paramsCallback({...params, bbmc: key})
  }

  const handleCjrChange = (key) => {
    setCjr(key);
    paramsCallback({...params, cjr: key})
  }

  //重置按钮
  const handleReset = () => {
    setBbmc(undefined);
    setCjr(undefined);
    paramsCallback({bbmc: '', cjr: ''})
  };

  const handleExtendsWD = (flag) => {
    if (!flag) {
      getCusRepData("WD", 99999);
    } else {
      getCusRepData("WD", 12);
    }
    setShowExtendsWD(!flag)
  }

  const handleExtendsCJ = (flag) => {
    if (!flag) {
      getCusRepData("CJ", 99999);
    } else {
      getCusRepData("CJ", 12);
    }
    setShowExtendsCJ(!flag)
  }

  const handleExtendsGX = (flag) => {
    if (!flag) {
      getCusRepData("GX", 99999);
    } else {
      getCusRepData("GX", 28);
    }
    setShowExtendsGX(!flag)
  }

  return (
    <>
      {
        cusRepDataWD.length > 0 && tabsKey === 1 && <div id="rep-infos" className="rep-infos">
          <div className="rep-infos-title">
            我收藏的
          </div>
          <div className="rep-infos-box">
            {
              cusRepDataWD.map(i => {
                return <div className="rep-infos-content">
                  <div className="rep-infos-content-box">
                    <div className="rep-infos-name">
                      <i className="rep-infos-icon iconfont icon-report"/>{i.BBMC}<i
                      className={i.SFSC === 0 ? "rep-infos-icon2 iconfont icon-star" : "rep-infos-icon2 iconfont icon-fill-star"}/>
                    </div>
                    <div className="rep-infos-time">
                      {i.CJR}&nbsp;&nbsp;{i.CJSJ}创建
                    </div>
                  </div>
                </div>
              })
            }
            {
              totalWD > 12 && (
                <div className='rep-infos-foot' onClick={() => handleExtendsWD(showExtendsWD)}>
                  {showExtendsWD ? '收起' : '展开'} <Icon type={showExtendsWD ? 'up' : 'down'}/>
                </div>
              )
            }
          </div>
        </div>
      }
      {
        cusRepDataCJ.length > 0 && tabsKey === 1 && <div className="rep-infos">
          <div className="rep-infos-title">
            我创建的
          </div>
          <div className="rep-infos-box">
            {
              cusRepDataCJ.map(i => {
                return <div className="rep-infos-content">
                  <div className="rep-infos-content-box">
                    <div className="rep-infos-name">
                      <i className="rep-infos-icon iconfont icon-report"/>{i.BBMC}<i
                      className={i.SFSC === 0 ? "rep-infos-icon2 iconfont icon-star" : "rep-infos-icon2 iconfont icon-fill-star"}/>
                    </div>
                    <div className="rep-infos-time">
                      {i.CJR}&nbsp;&nbsp;{i.CJSJ}创建
                    </div>
                  </div>
                </div>
              })
            }
            {
              totalCJ > 12 && (
                <div className='rep-infos-foot' onClick={() => handleExtendsCJ(showExtendsCJ)}>
                  {showExtendsCJ ? '收起' : '展开'} <Icon type={showExtendsCJ ? 'up' : 'down'}/>
                </div>
              )
            }
          </div>
        </div>
      }
      {
        tabsKey === 2 && <div className="rep-infos-GX">
          <div className="top-console">
            <div className="item-box">
              <div className="console-item">
                <div className="item-label">报表名称</div>
                <Select
                  className="item-selector"
                  dropdownClassName={'item-selector-dropdown'}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  allowClear
                  onChange={handleBbmcChange}
                  value={bbmc}
                  placeholder="请选择"
                >
                  {cusRepDataGX.map((x, i) => (
                    <Option key={x.BBID} value={x.BBID}>
                      {x.BBMC}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="console-item">
                <div className="item-label">创建人</div>
                <Select
                  className="item-selector"
                  dropdownClassName={'item-selector-dropdown'}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  allowClear
                  onChange={handleCjrChange}
                  value={cjr}
                  placeholder="请选择"
                >
                  {cusRepDataGX.map((x, i) => (
                    <Option key={x.CJRID} value={x.CJRID}>
                      {x.CJR}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="item-btn">
                <Button
                  className="btn-search"
                  type="primary"
                  onClick={() => getCusRepData("GX", 28)}
                >
                  查询
                </Button>
                <Button className="btn-reset"
                        onClick={handleReset}
                >
                  重置
                </Button>
              </div>
            </div>
          </div>
          {
            cusRepDataGX.length > 0 && <div className="rep-infos">
              <div className="rep-infos-box">
                {
                  cusRepDataGX.map(i => {
                    return <div className="rep-infos-content">
                      <div className="rep-infos-content-box">
                        <div className="rep-infos-name">
                          <i className="rep-infos-icon iconfont icon-report"/>{i.BBMC}<i
                          className={i.SFSC === 0 ? "rep-infos-icon2 iconfont icon-star" : "rep-infos-icon2 iconfont icon-fill-star"}/>
                        </div>
                        <div className="rep-infos-time">
                          {i.CJR}&nbsp;&nbsp;{i.CJSJ}创建
                        </div>
                      </div>
                    </div>
                  })
                }
                {
                  totalGX > 28 && (
                    <div className='rep-infos-foot' onClick={() => handleExtendsGX(showExtendsGX)}>
                      {showExtendsGX ? '收起' : '展开'} <Icon type={showExtendsGX ? 'up' : 'down'}/>
                    </div>
                  )
                }
              </div>
            </div>
          }
        </div>
      }
    </>
  );
}
