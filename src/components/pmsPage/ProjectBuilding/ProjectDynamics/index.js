import React, {Component, useState} from 'react'
import {Empty, Spin, Tabs} from 'antd'
import StaffTable from '../InfoTable/StaffTable'
import moment from "moment";
import {EncryptBase64} from "../../../Common/Encrypt";
import {Link} from "react-router-dom";
import {useLocation} from "react-router";
import prj1 from '../../../../assets/projectBuilding/01.png'
import prj2 from '../../../../assets/projectBuilding/02.png'
import prj3 from '../../../../assets/projectBuilding/03.png'
import prj4 from '../../../../assets/projectBuilding/04.png'
import prj5 from '../../../../assets/projectBuilding/05.png'
import prj6 from '../../../../assets/projectBuilding/06.png'
import prj7 from '../../../../assets/projectBuilding/07.png'

const {TabPane} = Tabs;

export default function ProjectDynamics(props) {
  const {
    //项目动态信息-付款信息
    prjDynamicsFKInfo = [],
    totalrowsFK = 0,
    //项目动态信息-合同信息
    prjDynamicsHTInfo = [],
    totalrowsHT = 0,
    //项目动态信息-立项信息
    prjDynamicsLXInfo = [],
    totalrowsLX = 0,
    //项目动态信息-上线信息
    prjDynamicsSXInfo = [],
    totalrowsSX = 0,
    //项目动态信息-完结信息
    prjDynamicsWJInfo = [],
    totalrowsWJ = 0,
    //项目动态信息-信委会信息
    prjDynamicsXWHInfo = [],
    totalrowsXWH = 0,
    //项目动态信息-总办会信息
    prjDynamicsZBHInfo = [],
    totalrowsZBH = 0,
  } = props;
  const location = useLocation();

  return (<div className='info-prj-dynamics'>
    <Spin spinning={false} wrapperClassName="spin" tip="正在努力的加载中..." size="large">
      <div className='info-prj-dynamics-card-box'>
        {
          // prjDynamicsXWHInfo.length > 0 &&
          <div className='info-prj-dynamics-card'>
            {
              // prjDynamicsXWHInfo.length > 0 &&
              <div className='info-prj-dynamics-title'>
                <img src={prj1} className='prj-img' alt=''/>
                <div className='info-prj-dynamics-title-left'>
                  <div className='prj-name'>信委会过会</div>
                  <div className='info-prj-dynamics-title-right'>
                    <div className='info-prj-dynamics-title-right-box'>
                      <div className='info-prj-dynamics-title-right-time'>
                        今年：
                        <div className='info-prj-dynamics-title-right-num'>
                          {prjDynamicsXWHInfo[0]?.JNSL || 0}个
                        </div>
                      </div>
                      <div style={{paddingLeft: '8px'}} className='info-prj-dynamics-title-right-time'>
                        近一周：
                        <div className='info-prj-dynamics-title-right-num'>
                          {prjDynamicsXWHInfo[0]?.JYZSL || 0}个
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            <div className='info-prj-dynamics-content-box'>
              {
                prjDynamicsXWHInfo.length > 0 ? prjDynamicsXWHInfo.map(item => {
                  return <Link
                    // style={{ color: '#303133' }}
                    to={{
                      pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                        JSON.stringify({
                          xmid: item.XMID,
                        }),
                      )}`,
                      state: {
                        routes: [{name: '项目建设情况', pathname: location.pathname}],
                      },
                    }}
                    className="table-link-strong"
                  >
                    <div className='info-prj-dynamics-content'>
                      <div className='info-prj-dynamics-content-row1'>
                        {item.XMMC}
                      </div>
                      <div className='info-prj-dynamics-content-row2'>
                        <div className='info-prj-dynamics-content-row2-name'>
                          <i className="iconfont icon-user"/>{item.XMJL}
                        </div>
                        <div className='info-prj-dynamics-content-row2-time'>
                          <i
                            className="iconfont icon-time"/>{item.SJ && moment(item.SJ, 'YYYY-MM-DD').format('YYYY-MM-DD')}
                        </div>
                      </div>
                    </div>
                  </Link>
                }) : <Empty
                  description="暂无数据"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{
                    width: '100%', display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}/>
              }
            </div>
            {
              prjDynamicsXWHInfo.length > 0 && <div className='info-prj-dynamics-footer'>
                <Link
                  style={{color: '#303133'}}
                  to={{
                    pathname: `/pms/manage/ProjectStateInfo/${EncryptBase64(
                      JSON.stringify({
                        cxlx: 'XWH',
                      }),
                    )}`,
                    state: {
                      routes: [{name: '项目建设情况', pathname: location.pathname}],
                    },
                  }}
                  className="table-link-strong"
                >
                  查看详情<i class="iconfont icon-right"/>
                </Link>
              </div>
            }
          </div>
        }
        {
          // prjDynamicsZBHInfo.length > 0 &&
          <div className='info-prj-dynamics-card'>
            {
              // prjDynamicsZBHInfo.length > 0 &&
              <div className='info-prj-dynamics-title'>
                <img src={prj2} className='prj-img' alt=''/>
                <div className='info-prj-dynamics-title-left'>
                  <div className='prj-name'>总办会过会</div>
                  <div className='info-prj-dynamics-title-right'>
                    <div className='info-prj-dynamics-title-right-box'>
                      <div className='info-prj-dynamics-title-right-time'>
                        今年：
                        <div className='info-prj-dynamics-title-right-num'>
                          {prjDynamicsZBHInfo[0]?.JNSL || 0}个
                        </div>
                      </div>
                      <div style={{paddingLeft: '8px'}} className='info-prj-dynamics-title-right-time'>
                        近一周：
                        <div className='info-prj-dynamics-title-right-num'>
                          {prjDynamicsZBHInfo[0]?.JYZSL || 0}个
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            <div className='info-prj-dynamics-content-box'>
              {
                prjDynamicsZBHInfo.length > 0 ? prjDynamicsZBHInfo.map(item => {
                  return <Link
                    // style={{ color: '#303133' }}
                    to={{
                      pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                        JSON.stringify({
                          xmid: item.XMID,
                        }),
                      )}`,
                      state: {
                        routes: [{name: '项目建设情况', pathname: location.pathname}],
                      },
                    }}
                    className="table-link-strong"
                  >
                    <div className='info-prj-dynamics-content'>
                      <div className='info-prj-dynamics-content-row1'>
                        {item.XMMC}
                      </div>
                      <div className='info-prj-dynamics-content-row2'>
                        <div className='info-prj-dynamics-content-row2-name'>
                          <i className="iconfont icon-user"/>{item.XMJL}
                        </div>
                        <div className='info-prj-dynamics-content-row2-time'>
                          <i
                            className="iconfont icon-time"/>{item.SJ && moment(item.SJ, 'YYYY-MM-DD').format('YYYY-MM-DD')}
                        </div>
                      </div>
                    </div>
                  </Link>
                }) : <Empty
                  description="暂无数据"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{
                    width: '100%', display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}/>
              }
            </div>
            {
              prjDynamicsZBHInfo.length > 0 && <div className='info-prj-dynamics-footer'>
                <Link
                  style={{color: '#303133'}}
                  to={{
                    pathname: `/pms/manage/ProjectStateInfo/${EncryptBase64(
                      JSON.stringify({
                        cxlx: 'ZBH',
                      }),
                    )}`,
                    state: {
                      routes: [{name: '项目建设情况', pathname: location.pathname}],
                    },
                  }}
                  className="table-link-strong"
                >
                  查看详情<i class="iconfont icon-right"/>
                </Link>
              </div>
            }
          </div>
        }
        {
          // prjDynamicsLXInfo.length > 0 &&
          <div className='info-prj-dynamics-card'>
            {
              // prjDynamicsLXInfo.length > 0 &&
              <div className='info-prj-dynamics-title'>
                <img src={prj3} className='prj-img' alt=''/>
                <div className='info-prj-dynamics-title-left'>
                  <div className='prj-name'>项目立项</div>
                  <div className='info-prj-dynamics-title-right'>
                    <div className='info-prj-dynamics-title-right-box'>
                      <div className='info-prj-dynamics-title-right-time'>
                        今年：
                        <div className='info-prj-dynamics-title-right-num'>
                          {prjDynamicsLXInfo[0]?.JNSL || 0}个
                        </div>
                      </div>
                      <div style={{paddingLeft: '8px'}} className='info-prj-dynamics-title-right-time'>
                        近一周：
                        <div className='info-prj-dynamics-title-right-num'>
                          {prjDynamicsLXInfo[0]?.JYZSL || 0}个
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            <div className='info-prj-dynamics-content-box'>
              {
                prjDynamicsLXInfo.length > 0 ? prjDynamicsLXInfo.map(item => {
                  return <Link
                    // style={{ color: '#303133' }}
                    to={{
                      pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                        JSON.stringify({
                          xmid: item.XMID,
                        }),
                      )}`,
                      state: {
                        routes: [{name: '项目建设情况', pathname: location.pathname}],
                      },
                    }}
                    className="table-link-strong"
                  >
                    <div className='info-prj-dynamics-content'>
                      <div className='info-prj-dynamics-content-row1'>
                        {item.XMMC}
                      </div>
                      <div className='info-prj-dynamics-content-row2'>
                        <div className='info-prj-dynamics-content-row2-name'>
                          <i className="iconfont icon-user"/>{item.XMJL}
                        </div>
                        <div className='info-prj-dynamics-content-row2-time'>
                          <i
                            className="iconfont icon-time"/>{item.SJ && moment(item.SJ, 'YYYY-MM-DD').format('YYYY-MM-DD')}
                        </div>
                      </div>
                    </div>
                  </Link>
                }) : <Empty
                  description="暂无数据"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{
                    width: '100%', display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}/>
              }
            </div>
            {
              prjDynamicsLXInfo.length > 0 && <div className='info-prj-dynamics-footer'>
                <Link
                  style={{color: '#303133'}}
                  to={{
                    pathname: `/pms/manage/ProjectStateInfo/${EncryptBase64(
                      JSON.stringify({
                        cxlx: 'XMLX',
                      }),
                    )}`,
                    state: {
                      routes: [{name: '项目建设情况', pathname: location.pathname}],
                    },
                  }}
                  className="table-link-strong"
                >
                  查看详情<i class="iconfont icon-right"/>
                </Link>
              </div>
            }
          </div>
        }
        {
          // prjDynamicsHTInfo.length > 0 &&
          <div className='info-prj-dynamics-card'>
            {
              // prjDynamicsHTInfo.length > 0 &&
              <div className='info-prj-dynamics-title'>
                <img src={prj4} className='prj-img' alt=''/>
                <div className='info-prj-dynamics-title-left'>
                  <div className='prj-name'>合同签署完成</div>
                  <div className='info-prj-dynamics-title-right'>
                    <div className='info-prj-dynamics-title-right-box'>
                      <div className='info-prj-dynamics-title-right-time'>
                        今年：
                        <div className='info-prj-dynamics-title-right-num'>
                          {prjDynamicsHTInfo[0]?.JNSL || 0}个
                        </div>
                      </div>
                      <div style={{paddingLeft: '8px'}} className='info-prj-dynamics-title-right-time'>
                        近一周：
                        <div className='info-prj-dynamics-title-right-num'>
                          {prjDynamicsHTInfo[0]?.JYZSL || 0}个
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            <div className='info-prj-dynamics-content-box'>
              {
                prjDynamicsHTInfo.length > 0 ? prjDynamicsHTInfo.map(item => {
                  return <Link
                    // style={{ color: '#303133' }}
                    to={{
                      pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                        JSON.stringify({
                          xmid: item.XMID,
                        }),
                      )}`,
                      state: {
                        routes: [{name: '项目建设情况', pathname: location.pathname}],
                      },
                    }}
                    className="table-link-strong"
                  >
                    <div className='info-prj-dynamics-content'>
                      <div className='info-prj-dynamics-content-row1'>
                        {item.XMMC}
                      </div>
                      <div className='info-prj-dynamics-content-row2'>
                        <div className='info-prj-dynamics-content-row2-name'>
                          <i className="iconfont icon-user"/>{item.XMJL}
                        </div>
                        <div className='info-prj-dynamics-content-row2-time'>
                          <i
                            className="iconfont icon-time"/>{item.SJ && moment(item.SJ, 'YYYY-MM-DD').format('YYYY-MM-DD')}
                        </div>
                      </div>
                    </div>
                  </Link>
                }) : <Empty
                  description="暂无数据"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{
                    width: '100%', display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}/>
              }
            </div>
            {
              prjDynamicsHTInfo.length > 0 &&
              <div className='info-prj-dynamics-footer'>
                <Link
                  style={{color: '#303133'}}
                  to={{
                    pathname: `/pms/manage/ProjectStateInfo/${EncryptBase64(
                      JSON.stringify({
                        cxlx: 'HTQS',
                      }),
                    )}`,
                    state: {
                      routes: [{name: '项目建设情况', pathname: location.pathname}],
                    },
                  }}
                  className="table-link-strong"
                >
                  查看详情<i class="iconfont icon-right"/>
                </Link>
              </div>
            }
          </div>
        }
        {
          // prjDynamicsSXInfo.length > 0 &&
          <div className='info-prj-dynamics-card'>
            {
              // prjDynamicsSXInfo.length > 0 &&
              <div className='info-prj-dynamics-title'>
                <img src={prj5} className='prj-img' alt=''/>
                <div className='info-prj-dynamics-title-left'>
                  <div className='prj-name'>项目上线</div>
                  <div className='info-prj-dynamics-title-right'>
                    <div className='info-prj-dynamics-title-right-box'>
                      <div className='info-prj-dynamics-title-right-time'>
                        今年：
                        <div className='info-prj-dynamics-title-right-num'>
                          {prjDynamicsSXInfo[0]?.JNSL || 0}个
                        </div>
                      </div>
                      <div style={{paddingLeft: '8px'}} className='info-prj-dynamics-title-right-time'>
                        近一周：
                        <div className='info-prj-dynamics-title-right-num'>
                          {prjDynamicsSXInfo[0]?.JYZSL || 0}个
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            <div className='info-prj-dynamics-content-box'>
              {
                prjDynamicsSXInfo.length > 0 ? prjDynamicsSXInfo.map(item => {
                  return <Link
                    // style={{ color: '#303133' }}
                    to={{
                      pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                        JSON.stringify({
                          xmid: item.XMID,
                        }),
                      )}`,
                      state: {
                        routes: [{name: '项目建设情况', pathname: location.pathname}],
                      },
                    }}
                    className="table-link-strong"
                  >
                    <div className='info-prj-dynamics-content'>
                      <div className='info-prj-dynamics-content-row1'>
                        {item.XMMC}
                      </div>
                      <div className='info-prj-dynamics-content-row2'>
                        <div className='info-prj-dynamics-content-row2-name'>
                          <i className="iconfont icon-user"/>{item.XMJL}
                        </div>
                        <div className='info-prj-dynamics-content-row2-time'>
                          <i
                            className="iconfont icon-time"/>{item.SJ && moment(item.SJ, 'YYYY-MM-DD').format('YYYY-MM-DD')}
                        </div>
                      </div>
                    </div>
                  </Link>
                }) : <Empty
                  description="暂无数据"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{
                    width: '100%', display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}/>
              }
            </div>
            {
              prjDynamicsHTInfo.length > 0 &&
              <div className='info-prj-dynamics-footer'>
                <Link
                  style={{color: '#303133'}}
                  to={{
                    pathname: `/pms/manage/ProjectStateInfo/${EncryptBase64(
                      JSON.stringify({
                        cxlx: 'SXXM',
                      }),
                    )}`,
                    state: {
                      routes: [{name: '项目建设情况', pathname: location.pathname}],
                    },
                  }}
                  className="table-link-strong"
                >
                  查看详情<i class="iconfont icon-right"/>
                </Link>
              </div>
            }
          </div>
        }
        {
          // prjDynamicsFKInfo.length > 0 &&
          <div className='info-prj-dynamics-card'>
            {
              // prjDynamicsFKInfo.length > 0 &&
              <div className='info-prj-dynamics-title'>
                <img src={prj6} className='prj-img' alt=''/>
                <div className='info-prj-dynamics-title-left'>
                  <div className='prj-name'>项目付款</div>
                  <div className='info-prj-dynamics-title-right'>
                    <div className='info-prj-dynamics-title-right-box'>
                      <div className='info-prj-dynamics-title-right-time'>
                        今年：
                        <div className='info-prj-dynamics-title-right-num'>
                          {prjDynamicsFKInfo[0]?.JNSL || 0}个
                        </div>
                      </div>
                      <div style={{paddingLeft: '8px'}} className='info-prj-dynamics-title-right-time'>
                        近一周：
                        <div className='info-prj-dynamics-title-right-num'>
                          {prjDynamicsFKInfo[0]?.JYZSL || 0}个
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            <div className='info-prj-dynamics-content-box'>
              {
                prjDynamicsFKInfo.length > 0 ? prjDynamicsFKInfo.map(item => {
                  return <Link
                    // style={{ color: '#303133' }}
                    to={{
                      pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                        JSON.stringify({
                          xmid: item.XMID,
                        }),
                      )}`,
                      state: {
                        routes: [{name: '项目建设情况', pathname: location.pathname}],
                      },
                    }}
                    className="table-link-strong"
                  >
                    <div className='info-prj-dynamics-content'>
                      <div className='info-prj-dynamics-content-row1'>
                        {item.XMMC}
                      </div>
                      <div className='info-prj-dynamics-content-row2'>
                        <div className='info-prj-dynamics-content-row2-name'>
                          <i className="iconfont icon-user"/>{item.XMJL}
                        </div>
                        <div className='info-prj-dynamics-content-row2-time'>
                          <i
                            className="iconfont icon-time"/>{item.SJ && moment(item.SJ, 'YYYY-MM-DD').format('YYYY-MM-DD')}
                        </div>
                      </div>
                    </div>
                  </Link>
                }) : <Empty
                  description="暂无数据"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{
                    width: '100%', display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}/>
              }
            </div>
            {
              prjDynamicsHTInfo.length > 0 &&
              <div className='info-prj-dynamics-footer'>
                <Link
                  style={{color: '#303133'}}
                  to={{
                    pathname: `/pms/manage/ProjectStateInfo/${EncryptBase64(
                      JSON.stringify({
                        cxlx: 'FKXM',
                      }),
                    )}`,
                    state: {
                      routes: [{name: '项目建设情况', pathname: location.pathname}],
                    },
                  }}
                  className="table-link-strong"
                >
                  查看详情<i class="iconfont icon-right"/>
                </Link>
              </div>
            }
          </div>
        }
        {
          // prjDynamicsWJInfo.length > 0 &&
          <div className='info-prj-dynamics-card'>
            {
              // prjDynamicsWJInfo.length > 0 &&
              <div className='info-prj-dynamics-title'>
                <img src={prj7} className='prj-img' alt=''/>
                <div className='info-prj-dynamics-title-left'>
                  <div className='prj-name'>项目完结</div>
                  <div className='info-prj-dynamics-title-right'>
                    <div className='info-prj-dynamics-title-right-box'>
                      <div className='info-prj-dynamics-title-right-time'>
                        今年：
                        <div className='info-prj-dynamics-title-right-num'>
                          {prjDynamicsWJInfo[0]?.JNSL || 0}个
                        </div>
                      </div>
                      <div style={{paddingLeft: '8px'}} className='info-prj-dynamics-title-right-time'>
                        近一周：
                        <div className='info-prj-dynamics-title-right-num'>
                          {prjDynamicsWJInfo[0]?.JYZSL || 0}个
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            <div className='info-prj-dynamics-content-box'>
              {
                prjDynamicsWJInfo.length > 0 ? prjDynamicsWJInfo.map(item => {
                  return <Link
                    // style={{ color: '#303133' }}
                    to={{
                      pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                        JSON.stringify({
                          xmid: item.XMID,
                        }),
                      )}`,
                      state: {
                        routes: [{name: '项目建设情况', pathname: location.pathname}],
                      },
                    }}
                    className="table-link-strong"
                  >
                    <div className='info-prj-dynamics-content'>
                      <div className='info-prj-dynamics-content-row1'>
                        {item.XMMC}
                      </div>
                      <div className='info-prj-dynamics-content-row2'>
                        <div className='info-prj-dynamics-content-row2-name'>
                          <i className="iconfont icon-user"/>{item.XMJL}
                        </div>
                        <div className='info-prj-dynamics-content-row2-time'>
                          <i
                            className="iconfont icon-time"/>{item.SJ && moment(item.SJ, 'YYYY-MM-DD').format('YYYY-MM-DD')}
                        </div>
                      </div>
                    </div>
                  </Link>
                }) : <Empty
                  description="暂无数据"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{
                    width: '100%', display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}/>
              }
            </div>
            {
              prjDynamicsHTInfo.length > 0 &&
              <div className='info-prj-dynamics-footer'>
                <Link
                  style={{color: '#303133'}}
                  to={{
                    pathname: `/pms/manage/ProjectStateInfo/${EncryptBase64(
                      JSON.stringify({
                        cxlx: 'WJXM',
                      }),
                    )}`,
                    state: {
                      routes: [{name: '项目建设情况', pathname: location.pathname}],
                    },
                  }}
                  className="table-link-strong"
                >
                  查看详情<i class="iconfont icon-right"/>
                </Link>
              </div>
            }
          </div>
        }
      </div>
    </Spin>
  </div>);
}
