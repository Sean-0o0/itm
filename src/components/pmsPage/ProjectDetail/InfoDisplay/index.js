import { Empty, Popover, Table, Tooltip, message } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import config from '../../../../utils/config';
import axios from 'axios';
import { EncryptBase64 } from '../../../Common/Encrypt';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import BidSectionModel from '../../HardwareItems/BidSectionModel';
const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;

export default function InfoDisplay(props) {
  const { prjData, xmid, routes, isLeader, isHwSltPrj } = props;
  const {
    prjBasic = {},
    award = [],
    demand = [],
    topic = [],
    payment = [],
    otrSupplier = [],
    contrast = {},
    bidding = {},
    supplier = [],
    member = [],
  } = prjData;
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  //liveBos弹窗配置
  const [lbModal, setLbModal] = useState({
    url: '#',
    title: '',
    xqlbModalVisible: false,
    xbjglbModalVisible: false,
    bdtjlbModalVisible: false,
  });
  //询比结果录入
  const xbjglbModalProps = {
    isAllWindow: 1,
    title: lbModal.title,
    width: '1000px',
    height: '650px',
    style: { top: '10px' },
    visible: true,
    footer: null,
  };
  //询比结果录入
  const xqlbModalProps = {
    isAllWindow: 1,
    title: lbModal.title,
    width: '1000px',
    height: '650px',
    style: { top: '10px' },
    visible: true,
    footer: null,
  };

  // useEffect(() => {
  //   window.addEventListener('message', handleIframePostMessage);
  //   return () => {
  //     window.removeEventListener('message', handleIframePostMessage);
  //   };
  // }, []);
  //
  // //监听弹窗状态
  // const handleIframePostMessage = event => {
  //   if (typeof event.data !== 'string' && event.data.operate === 'close') {
  //     setLbModal(p => {
  //       return {
  //         ...p,
  //         xbjglbModalVisible: false
  //       };
  //     });
  //   }
  //   if (typeof event.data !== 'string' && event.data.operate === 'success') {
  //     setLbModal(p => {
  //       return {
  //         ...p,
  //         xbjglbModalVisible: false
  //       };
  //     });
  //   }
  // };

  //评标报告预览下载
  const handleFile = (id, fileName, entryno) => {
    axios({
      method: 'POST',
      url: queryFileStream,
      responseType: 'blob',
      data: {
        objectName: 'TXMXX_ZBXX',
        columnName: 'PBBG',
        id,
        title: fileName,
        extr: entryno,
        type: '',
      },
    })
      .then(res => {
        const href = URL.createObjectURL(res.data);
        const a = document.createElement('a');
        a.download = fileName;
        a.href = href;
        a.click();
        window.URL.revokeObjectURL(a.href);
      })
      .catch(err => {
        console.error(err);
        message.error('评标报告下载失败', 1);
      });
  };

  //是否为项目成员或领导
  const isMember = () => {
    const arr = [];
    member.forEach(x => {
      arr.push(x.RYID);
    });
    // console.log(
    //   '🚀 ~ isLeader:',
    //   arr.includes(String(LOGIN_USER_INFO.id)) || isLeader,
    //   member,
    //   arr,
    //   isLeader,
    // );
    return arr.includes(String(LOGIN_USER_INFO.id)) || isLeader;
  };

  //金额格式化
  const getAmountFormat = value => {
    if ([undefined, null, '', ' ', NaN].includes(value)) return '';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  //获取信息块
  const getInfoItem = (label, val, isLink = false) => {
    return (
      <div className="info-item" key={label}>
        <span>{label}</span>
        {isLink ? <a style={{ color: '#3361ff' }}>{val}</a> : val}
      </div>
    );
  };
  //付款计划
  const getPmtPlan = (arr = []) => {
    return (
      <div
        className="info-item"
        key="付款计划："
        style={{ width: '100%', display: 'flex', height: 'unset' }}
      >
        <div className="payment-label">付款计划：</div>
        <div className="payment-plan">
          {arr.map((x, i) => (
            <div key={x.ID}>
              第{toChinesNum(i + 1)}期付款{x.FKJE}万，占总金额{Number(x.BFB || 0) * 100}%，{x.FKZT}
            </div>
          ))}
        </div>
      </div>
    );
  };
  const otherSupplierPopover = data => (
    <div className="list">
      {data.map(x => (
        <div className="item" key={x.GYSID} onClick={() => {}}>
          <Link
            to={{
              pathname:
                '/pms/manage/SupplierDetail/' +
                EncryptBase64(
                  JSON.stringify({
                    splId: x.GYSID,
                  }),
                ),
              state: { routes },
            }}
            style={{
              // whiteSpace: 'break-spaces',
              color: '#3361ff',
            }}
          >
            {x.GYSMC}
          </Link>
        </div>
      ))}
    </div>
  );
  const tablePopover = (data, columns) => {
    return (
      <div className="table-box">
        <Table columns={columns} rowKey={'id'} dataSource={data} size="middle" pagination={false} />
      </div>
    );
  };
  //判空
  const notNull = data => {
    if (['', ' ', undefined, null].includes(data)) return '暂无数据';
    return data;
  };
  const isNullArr = arr => {
    let data = [];
    arr.forEach(x => {
      if (!['', ' ', undefined, null].includes(x)) {
        data.push(x);
      }
    });
    return data.length === 0;
  };
  //需求列表
  const openXqlbModal = xmid => {
    setLbModal(p => {
      return {
        ...p,
        xqlbModalVisible: true,
        title: '需求列表',
        url: `/#/single/pms/RequireList/${EncryptBase64(JSON.stringify({ xmid }))}`,
      };
    });
  };

  //询比结果列表
  const openXbjglbModal = xmid => {
    setLbModal(p => {
      return {
        ...p,
        xqlbModalVisible: true,
        title: '询比结果',
        url: `/#/single/pms/PollResultList/${EncryptBase64(JSON.stringify({ xmid }))}`,
      };
    });
  };

  //标段统计列表
  const openBdtjlbModal = xmid => {
    setLbModal(p => {
      return {
        ...p,
        bdtjlbModalVisible: true,
        // title: '标段统计',
        url: xmid,
      };
    });
  };

  //联系人展示
  const getLxrinfContent = (arr = []) => {
    return (
      <div className="list">
        {arr.map(x => (
          <div className="item" key={x.LXR + x.DH}>
            <div className="top">
              <div>{x.LXR}</div>
              <div className="position-tag">{x.ZW}</div>
            </div>
            <div className="bottom">
              <span>电话：</span> {x.DH || '无'}
              <span className="email">｜ 邮箱：</span> {x.QTLXFS || '无'}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getSupplierInfoRow = () => {
    if (supplier.length === 0)
      return (
        <Empty
          description="暂无信息"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ width: '100%', margin: 0 }}
        />
      );
    return supplier.map(item => (
      <div className="info-row" key={item.GYSID}>
        <div className="info-item" key="供应商名称：" style={{ display: 'flex', height: 'unset' }}>
          <div style={{ flexShrink: 0, color: '#909399' }}>供应商名称：</div>
          <Link
            to={{
              pathname:
                '/pms/manage/SupplierDetail/' +
                EncryptBase64(
                  JSON.stringify({
                    splId: item?.GYSID,
                  }),
                ),
              state: { routes },
            }}
            style={{
              whiteSpace: 'break-spaces',
              color: '#3361ff',
            }}
          >
            {item.GYSMC}
          </Link>
        </div>
        {getInfoItem('供应商类型：', item.GYSLX)}
        {!['', ' ', undefined, null].includes(item.LXRDATA && item.LXRDATA[0]?.LXR) && (
          <div
            className="info-item"
            key="供应商联系人："
            style={{ display: 'flex', height: 'unset' }}
          >
            <div className="payment-label" style={{ width: 98 }}>
              供应商联系人：
            </div>
            <div className="lxr-info">
              <Popover
                title={null}
                content={getLxrinfContent(item.LXRDATA)}
                placement="bottomRight"
                overlayClassName="lxr-info-popover"
              >
                <span>查看详情</span>
              </Popover>
            </div>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="info-display-box">
      {/* 需求列表 */}
      {lbModal.xqlbModalVisible && (
        <BridgeModel
          isSpining="customize"
          modalProps={xqlbModalProps}
          onCancel={() => {
            setLbModal(p => {
              return {
                ...p,
                xqlbModalVisible: false,
              };
            });
          }}
          src={lbModal.url}
        />
      )}

      {/* 询比结果列表 */}
      {lbModal.xbjglbModalVisible && (
        <BridgeModel
          isSpining="customize"
          modalProps={xbjglbModalProps}
          onCancel={() => {
            setLbModal(p => {
              return {
                ...p,
                xbjglbModalVisible: false,
              };
            });
          }}
          src={lbModal.url}
        />
      )}

      {/* 标段统计 */}
      {lbModal.bdtjlbModalVisible && (
        <BidSectionModel
          xmid={lbModal.url}
          visible={lbModal.bdtjlbModalVisible}
          closeModal={() =>
            setLbModal(p => {
              return {
                ...p,
                bdtjlbModalVisible: false,
              };
            })
          }
        />
      )}

      {/* 项目信息 */}
      <div className="info-box" key="xmxx">
        <div className="top-title">项目信息</div>
        <div className="info-row-box">
          {getInfoItem('项目类型：', notNull(prjBasic.XMLX))}
          <div className="info-item" key="关联软件：">
            <span>关联软件：</span>
            {notNull(prjBasic.GLXT) === '暂无数据' ? (
              '暂无数据'
            ) : (
              <Tooltip placement="topLeft" title={prjBasic.GLXT.replace(/,/g, '、')}>
                <span style={{ cursor: 'default', color: '#303133' }}>
                  {prjBasic.GLXT.replace(/,/g, '、')}
                </span>
              </Tooltip>
            )}
          </div>
          <div className="info-item" key="应用部门：">
            <span>应用部门：</span>
            {notNull(prjBasic.SSBM) === '暂无数据' ? (
              '暂无数据'
            ) : (
              <Tooltip placement="topLeft" title={prjBasic.SSBM.replace(/,/g, '、')}>
                <span style={{ cursor: 'default', color: '#303133' }}>
                  {prjBasic.SSBM.replace(/,/g, '、')}
                </span>
              </Tooltip>
            )}
          </div>
          {prjBasic.FXMMC && (
            <div className="info-item" key="父项目名称：">
              <span>父项目名称：</span>
              <Link
                style={{ color: '#3361ff' }}
                to={{
                  pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                    JSON.stringify({
                      xmid: prjBasic.GLFXMID,
                    }),
                  )}`,
                  state: {
                    routes: [{ name: '项目详情', pathname: location.pathname }],
                  },
                }}
              >
                {prjBasic.FXMMC}
              </Link>
            </div>
          )}
          {getInfoItem('是否包含硬件：', prjBasic.SFBHYJ === '1' ? '是' : '否')}
          {/* {getInfoItem('是否在硬件入围内：', prjBasic.SFYJRW === '1' ? '是' : '否')} */}
          {isMember() && (
            <div className="info-item" key="文档库：">
              <span>文档库：</span>
              <Link
                to={{
                  pathname: '/pms/manage/attachLibrary',
                  query: {
                    xmid,
                  },
                }}
                style={{ color: '#3361ff' }}
              >
                查看详情
              </Link>
            </div>
          )}
          {!isHwSltPrj && (
            <div className="info-item">
              <span>获奖信息：</span>
              {award.length === 0 ? (
                '暂无数据'
              ) : (
                <Popover
                  placement="bottom"
                  title={null}
                  content={tablePopover(award, [
                    {
                      title: '奖项名称',
                      dataIndex: 'JXMC',
                      width: 180,
                      key: 'JXMC',
                      ellipsis: true,
                      render: txt => (
                        <Tooltip title={txt} placement="topLeft">
                          <span style={{ cursor: 'default' }}>{txt}</span>
                        </Tooltip>
                      ),
                    },
                    {
                      title: '荣誉等级',
                      dataIndex: 'RYDJ',
                      width: 150,
                      key: 'RYDJ',
                      ellipsis: true,
                      render: txt => <span style={{ cursor: 'default' }}>{txt}</span>,
                    },
                    {
                      title: '知识产权类型',
                      dataIndex: 'ZSCQLX',
                      width: 150,
                      key: 'ZSCQLX',
                      ellipsis: true,
                      render: txt => <span style={{ cursor: 'default' }}>{txt}</span>,
                    },
                    {
                      title: '获奖日期',
                      dataIndex: 'HJSJ',
                      key: 'HJSJ',
                      ellipsis: true,
                      render: txt => <span style={{ cursor: 'default' }}>{txt}</span>,
                    },
                  ])}
                  overlayClassName="project-topic-content-popover"
                >
                  <a style={{ color: '#3361ff' }}>查看详情</a>
                </Popover>
              )}
            </div>
          )}
          {!isHwSltPrj && (
            <div className="info-item">
              <span>项目课题：</span>
              {topic.length === 0 ? (
                '暂无数据'
              ) : (
                <Popover
                  placement="bottomLeft"
                  title={null}
                  content={tablePopover(topic, [
                    {
                      title: '课题名称',
                      dataIndex: 'XMKT',
                      width: 160,
                      key: 'XMKT',
                      ellipsis: true,
                      render: txt => (
                        <Tooltip title={txt} placement="topLeft">
                          <span style={{ cursor: 'default' }}>{txt}</span>
                        </Tooltip>
                      ),
                    },
                    {
                      title: '进度',
                      dataIndex: 'JD',
                      width: 100,
                      key: 'JD',
                      ellipsis: true,
                      render: txt => <span style={{ cursor: 'default' }}>{txt}%</span>,
                    },
                    {
                      title: '简介',
                      dataIndex: 'JJ',
                      key: 'JJ',
                      ellipsis: true,
                      render: txt => (
                        <Tooltip title={txt} placement="topLeft">
                          <span style={{ cursor: 'default' }}>{txt}</span>
                        </Tooltip>
                      ),
                    },
                    {
                      title: '当前进展',
                      dataIndex: 'DQJZ',
                      width: 100,
                      key: 'DQJZ',
                      ellipsis: true,
                      render: txt => <span style={{ cursor: 'default' }}>{txt}</span>,
                    },
                  ])}
                  overlayClassName="project-topic-content-popover"
                >
                  <a style={{ color: '#3361ff' }}>查看详情</a>
                </Popover>
              )}
            </div>
          )}
          {!isHwSltPrj && (
            <div className="info-item">
              <span>变更类/计划外需求：</span>
              {demand.length === 0 ? (
                '暂无数据'
              ) : (
                <Popover
                  placement="bottom"
                  title={null}
                  content={tablePopover(demand, [
                    {
                      title: '需求标题',
                      dataIndex: 'XQBT',
                      width: 144,
                      key: 'XQBT',
                      ellipsis: true,
                      render: txt => (
                        <Tooltip title={txt} placement="topLeft">
                          <span style={{ cursor: 'default' }}>{txt}</span>
                        </Tooltip>
                      ),
                    },
                    {
                      title: '需求内容',
                      dataIndex: 'XQNR',
                      width: 188,
                      key: 'XQNR',
                      ellipsis: true,
                      render: txt => (
                        <Tooltip title={txt} placement="topLeft">
                          <span style={{ cursor: 'default' }}>{txt}</span>
                        </Tooltip>
                      ),
                    },
                    {
                      title: '需求日期',
                      dataIndex: 'XQRQ',
                      // width: 100,
                      key: 'XQRQ',
                      ellipsis: true,
                      render: txt => (
                        <span style={{ cursor: 'default' }}>
                          {moment(txt).format('YYYY-MM-DD')}
                        </span>
                      ),
                    },
                  ])}
                  overlayClassName="unplanned-demand-content-popover"
                >
                  <a style={{ color: '#3361ff' }}>查看详情</a>
                </Popover>
              )}
            </div>
          )}
        </div>
      </div>
      {/* 预算信息 */}
      {isMember() ? (
        <div className="info-box" key="ysxx">
          <div className="top-title">预算信息</div>
          <div className="info-row-box">
            {getInfoItem('项目预算：', getAmountFormat(prjBasic.YSJE) + '元')}
            <div
              className="info-item"
              key="关联预算项目："
              style={{ display: 'flex', height: 'unset' }}
            >
              <div style={{ flexShrink: 0, color: '#909399' }}>关联预算项目：</div>
              <div style={{ whiteSpace: 'break-spaces' }}>{notNull(prjBasic.YSXMMC)}</div>
            </div>
            {prjBasic.SFBHYJ === '1' &&
              getInfoItem('本项目软件金额：', getAmountFormat(prjBasic.RJYSJE) + '元')}
            {prjBasic.SFBHYJ === '1' &&
              getInfoItem('框架采购金额：', getAmountFormat(prjBasic.KJCGJE) + '元')}
            {prjBasic.SFBHYJ === '1' &&
              getInfoItem('单独采购金额：', getAmountFormat(prjBasic.DDCGJE) + '元')}
            <div className="info-item" style={{ height: '44px' }}>
              <div className="item-top">
                <span>已执行预算</span>
                {getAmountFormat(prjBasic.YSYYS)}元
              </div>
              <div className="item-bottom">
                <span>/执行率：</span>
                {((Number(prjBasic.YSYYS || 0) * 100) / Number(prjBasic.KZXYS || 0)).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="info-box" key="ysxx">
          <div className="top-title">预算信息</div>
          <div className="info-row-box">
            {prjBasic.SFBHYJ === '1' &&
              getInfoItem('本项目软件金额：', getAmountFormat(prjBasic.RJYSJE) + '元')}
            {prjBasic.SFBHYJ === '1' &&
              getInfoItem('框架采购金额：', getAmountFormat(prjBasic.KJCGJE) + '元')}
            {prjBasic.SFBHYJ === '1' &&
              getInfoItem('单独采购金额：', getAmountFormat(prjBasic.DDCGJE) + '元')}
            <div
              className="info-item"
              key="关联预算项目："
              style={{ display: 'flex', height: 'unset', width: '100%' }}
            >
              <div style={{ flexShrink: 0, color: '#909399' }}>关联预算项目：</div>
              <div style={{ whiteSpace: 'break-spaces' }}>{notNull(prjBasic.YSXMMC)}</div>
            </div>
          </div>
        </div>
      )}
      {/* 供应商信息 */}
      {!isHwSltPrj && (
        <div className="info-box" key="gysxx">
          <div className="top-title">供应商信息</div>
          {getSupplierInfoRow()}
        </div>
      )}
      {/* 招采信息 */}
      {!isHwSltPrj &&
        (isMember() ? (
          <div className="info-box" key="zcxx">
            <div className="top-title">招采信息</div>
            {isNullArr([
              contrast.HTJE,
              prjBasic.ZBFS,
              contrast.QSRQ,
              bidding.TBBZJ,
              bidding.LYBZJ,
              bidding.PBBG,
              otrSupplier[0]?.GYSMC,
            ]) ? (
              <Empty
                description="暂无信息"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ width: '100%', margin: 0 }}
              />
            ) : (
              <div className="info-row-box">
                {contrast.HTJE && getInfoItem('合同金额：', getAmountFormat(contrast.HTJE) + '元')}
                {notNull(prjBasic.ZBFS) !== '暂无数据' && getInfoItem('招采方式：', prjBasic.ZBFS)}
                {contrast.QSRQ &&
                  getInfoItem('签署日期：', moment(contrast.QSRQ).format('YYYY年MM月DD日'))}
                {bidding.TBBZJ &&
                  getInfoItem('招标保证金：', getAmountFormat(bidding.TBBZJ) + '元')}
                {bidding.LYBZJ &&
                  getInfoItem('履约保证金：', getAmountFormat(bidding.LYBZJ) + '元')}
                {bidding.PBBG && (
                  <div className="info-item" key="评标报告：">
                    <span>评标报告：</span>
                    <a
                      style={{ color: '#3361ff' }}
                      onClick={() =>
                        handleFile(
                          bidding.ID,
                          JSON.parse(bidding.PBBG)?.items[0][1],
                          JSON.parse(bidding.PBBG)?.items[0][0],
                        )
                      }
                    >
                      {JSON.parse(bidding.PBBG)?.items[0][1]}
                    </a>
                  </div>
                )}
                {payment.length !== 0 && getPmtPlan(payment)}
                {otrSupplier.length !== 0 && (
                  <div className="info-item" key="zcxx-4-1">
                    <span>其他投标供应商：</span>
                    <Popover
                      placement="rightTop"
                      title={null}
                      content={otherSupplierPopover(otrSupplier)}
                      overlayClassName="other-supplier-content-popover"
                    >
                      <a style={{ color: '#3361ff' }}>查看详情</a>
                    </Popover>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="info-box" key="zcxx">
            <div className="top-title">招采信息</div>
            {isNullArr([prjBasic.ZBFS, contrast.QSRQ, bidding.PBBG, otrSupplier[0]?.GYSMC]) ? (
              <Empty
                description="暂无信息"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ width: '100%', margin: 0 }}
              />
            ) : (
              <div className="info-row-box">
                {notNull(prjBasic.ZBFS) !== '暂无数据' && getInfoItem('招采方式：', prjBasic.ZBFS)}
                {contrast.QSRQ &&
                  getInfoItem('签署日期：', moment(contrast.QSRQ).format('YYYY年MM月DD日'))}
                {bidding.PBBG && (
                  <div className="info-item" key="评标报告：">
                    <span>评标报告：</span>
                    <a
                      style={{ color: '#3361ff' }}
                      onClick={() =>
                        handleFile(
                          bidding.ID,
                          JSON.parse(bidding.PBBG)?.items[0][1],
                          JSON.parse(bidding.PBBG)?.items[0][0],
                        )
                      }
                    >
                      {JSON.parse(bidding.PBBG)?.items[0][1]}
                    </a>
                  </div>
                )}
                {otrSupplier.length !== 0 && (
                  <div className="info-item" key="zcxx-4-1">
                    <span>其他投标供应商：</span>
                    <Popover
                      placement="rightTop"
                      title={null}
                      content={otherSupplierPopover(otrSupplier)}
                      overlayClassName="other-supplier-content-popover"
                    >
                      <a style={{ color: '#3361ff' }}>查看详情</a>
                    </Popover>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      {/* 实施信息 */}
      {isHwSltPrj && (
        <div className="info-box" key="zcxx">
          <div className="top-title">实施信息</div>
          <div className="info-row">
            <div className="info-item" key="需求列表：">
              <span>需求列表：</span>
              {award[0]?.ID === '0' ? (
                '暂无数据'
              ) : (
                <a style={{ color: '#3361ff' }} onClick={() => openXqlbModal(xmid)}>
                  查看详情
                </a>
              )}
            </div>
            <div className="info-item" key="询比结果：">
              <span>询比结果：</span>
              {topic[0]?.XMID === '0' ? (
                '暂无数据'
              ) : (
                <a style={{ color: '#3361ff' }} onClick={() => openXbjglbModal(xmid)}>
                  查看详情
                </a>
              )}
            </div>
            <div className="info-item" key="标段统计：">
              <span>标段统计：</span>
              {demand[0]?.XMID === '0' ? (
                '暂无数据'
              ) : (
                <a style={{ color: '#3361ff' }} onClick={() => openBdtjlbModal(xmid)}>
                  查看详情
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
/**
 * 数字转成汉字
 * @params num === 要转换的数字
 * @return 汉字
 * */
const toChinesNum = num => {
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let unit = ['', '十', '百', '千', '万'];
  num = parseInt(num);
  let getWan = temp => {
    let strArr = temp
      .toString()
      .split('')
      .reverse();
    let newNum = '';
    let newArr = [];
    strArr.forEach((item, index) => {
      newArr.unshift(item === '0' ? changeNum[item] : changeNum[item] + unit[index]);
    });
    let numArr = [];
    newArr.forEach((m, n) => {
      if (m !== '零') numArr.push(n);
    });
    if (newArr.length > 1) {
      newArr.forEach((m, n) => {
        if (newArr[newArr.length - 1] === '零') {
          if (n <= numArr[numArr.length - 1]) {
            newNum += m;
          }
        } else {
          newNum += m;
        }
      });
    } else {
      newNum = newArr[0];
    }

    return newNum;
  };
  let overWan = Math.floor(num / 10000);
  let noWan = num % 10000;
  if (noWan.toString().length < 4) {
    noWan = '0' + noWan;
  }
  return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num);
};
