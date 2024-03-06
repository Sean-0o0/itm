import { Empty, Popover, Table, Tooltip, message } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import config from '../../../../utils/config';
import axios from 'axios';
import { useHistory } from 'react-router';
import { EncryptBase64 } from '../../../Common/Encrypt';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import BidSectionModel from '../../HardwareItems/BidSectionModel';
const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;

export default function InfoDisplay(props) {
  const {
    prjData,
    xmid,
    routes,
    isLeader,
    isHwSltPrj,
    isBdgtMnger,
    isDDXM,
    grayTest = {},
    isSinglePayment = false,
  } = props;
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
    contrastArr = [],
    glddxmData = [],
    invCData = [],
  } = prjData;
  const history = useHistory();
  let LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
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
    const arr = member.filter(x => x.RYZT === '1').map(x => x.RYID);
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
  const getPmtPlan = (arr = [], label = '付款计划：', width = '100%') => {
    return (
      <div className="info-item" key={label} style={{ width, display: 'flex', height: 'unset' }}>
        <div className="payment-label">{label}</div>
        <div className="payment-plan">
          {arr.map((x, i) => (
            <div key={x.ID}>
              第{toChinesNum(i + 1)}期付款{x.FKJE}元，占总金额{Number(x.BFB || 0) * 100}%，{x.FKZT}
            </div>
          ))}
        </div>
      </div>
    );
  };

  //评标报告
  const getPbbg = (arr = []) => {
    return (
      <div
        className="info-item"
        key="评标报告："
        style={{ width: '32%', display: 'flex', height: 'unset' }}
      >
        <div className="payment-label">评标报告：</div>
        <div className="payment-plan">
          {arr.map((x, i) => (
            <Tooltip placement="topLeft" title={x[1]}>
              <a
                style={{
                  width: '100%',
                  color: '#3361ff',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                key={i}
                onClick={() => handleFile(bidding.ID, x[1], x[0])}
              >
                {x[1]}
              </a>
            </Tooltip>
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
      <div className="table-box" style={{ width: 580 }}>
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

  //供应商信息
  const getSupplierInfoRow = () => {
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

  //多合同信息
  const getHtxxInfoRow = (haveAuth = true) => {
    const suffix = i => (contrastArr.length > 1 ? '-' + (i + 1) + '：' : '：'); //是否多合同，后缀
    return contrastArr.map((x, i) => (
      <div className="htxx-info-row-box" key={x.ID}>
        {x.HTMC && getInfoItem('合同名称' + suffix(i), x.HTMC)}
        {x.GYSMC && getInfoItem('合同供应商' + suffix(i), x.GYSMC)}
        {x.HTJE && haveAuth && getInfoItem('合同金额' + suffix(i), getAmountFormat(x.HTJE) + '元')}
        {x.YFKJE &&
          haveAuth &&
          getInfoItem('已付款金额' + suffix(i), getAmountFormat(x.YFKJE) + '元')}
        {x.QSRQ && getInfoItem('签署日期' + suffix(i), moment(x.QSRQ).format('YYYY年MM月DD日'))}
        {x.payment?.length !== 0 &&
          haveAuth &&
          getPmtPlan(x.payment, '付款计划' + suffix(i), '64%')}
      </div>
    ));
  };

  //关联迭代项目名称
  const getGlddxmmc = (idStr = '') => {
    //.分割，取最后一个
    const glddxmIdArr = idStr === '' ? [] : idStr.split('.');
    const glddxmId = glddxmIdArr.length > 0 ? glddxmIdArr[glddxmIdArr.length - 1] : undefined;
    const glddxmmc = glddxmData.find(x => x.ID === glddxmId)?.XMMC || '';
    if (idStr !== '')
      return (
        <div className="info-item" key="关联迭代项目：">
          <span>关联迭代项目：</span>
          <Tooltip placement="topLeft" title={glddxmmc}>
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                  JSON.stringify({
                    xmid: glddxmId,
                  }),
                )}`,
                state: {
                  routes,
                },
              }}
            >
              {glddxmmc}
            </Link>
          </Tooltip>
        </div>
      );
    return null;
  };

  //知识产权获奖荣誉
  const ZSCQ_HJRY = (label, val) => {
    return (
      <div className="info-item" key={label}>
        <span>{label}</span>
        <Tooltip title={val} placement="topLeft">
          <div style={{ display: 'inline', cursor: 'default' }}>{val}</div>
        </Tooltip>
      </div>
    );
  };

  //合同其他明细
  const getHtqtmx = (data = []) => {
    //跳转合同信息查看页，先注释了，到时要，得确定下oahtxxid是否取对
    const handleClick = id => {
      history.push({
        pathname:
          '/pms/manage/InnovationContractView/' +
          EncryptBase64(
            JSON.stringify({
              id,
              routes,
            }),
          ),
      });
    };
    let node = null;
    if (data.length === 1)
      node = (
        <a style={{ color: '#3361ff' }} onClick={() => handleClick(data[0].HTID)}>
          查看详情
        </a>
      );
    else
      node = (
        <Popover
          placement="rightTop"
          title={null}
          arrowPointAtCenter
          content={
            <div className="list">
              {data.map(x => (
                <div
                  className="item"
                  key={x.HTMC + x.HTID}
                  style={{ maxWidth: 385, color: '#3361ff' }}
                  onClick={() => handleClick(x.HTID)}
                >
                  {x.HTMC}
                </div>
              ))}
            </div>
          }
          overlayClassName="other-supplier-content-popover"
        >
          <a style={{ color: '#3361ff' }}>查看详情</a>
        </Popover>
      );
    return (
      <div className="info-item" key="htqtmx">
        <span>合同其他明细：</span>
        {node}
      </div>
    );
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
      <div className="top-box">项目信息</div>

      {/* 基本信息 */}
      {!isSinglePayment && (
        <div className="info-box" key="xmxx">
          <div className="top-title">基本信息</div>
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
                <Tooltip placement="topLeft" title={prjBasic.FXMMC}>
                  <Link
                    style={{ color: '#3361ff' }}
                    to={{
                      pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                        JSON.stringify({
                          xmid: prjBasic.GLFXMID,
                        }),
                      )}`,
                      state: {
                        routes,
                      },
                    }}
                  >
                    {prjBasic.FXMMC}
                  </Link>
                </Tooltip>
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
            {isDDXM && getGlddxmmc(prjBasic.GLDDXM)}
          </div>
        </div>
      )}
      {/* 预算信息 */}
      {isMember() || isBdgtMnger ? (
        <div className="info-box" key="ysxx">
          <div className="top-title">预算信息</div>
          <div className="info-row-box">
            {getInfoItem('项目预算：', getAmountFormat(prjBasic.YSJE || 0) + '元')}
            <div className="info-item" key="项目预算已执行预算">
              <span>已执行预算：</span>
              {getAmountFormat(prjBasic.XMFKJE || 0) + '元'}
            </div>
            <div className="info-item" key="项目预算执行率">
              <span>执行率：</span>
              {getAmountFormat(Number(prjBasic.XMYSZXL || 0).toFixed(2)) + '%'}
            </div>
            {prjBasic.SFBHYJ === '1' &&
              getInfoItem('本项目软件金额：', getAmountFormat(prjBasic.RJYSJE || 0) + '元')}
            {prjBasic.SFBHYJ === '1' &&
              getInfoItem('框架采购金额：', getAmountFormat(prjBasic.KJCGJE || 0) + '元')}
            {prjBasic.SFBHYJ === '1' &&
              getInfoItem('单独采购金额：', getAmountFormat(prjBasic.DDCGJE || 0) + '元')}
            {/* <div className="info-item" style={{ height: '44px' }}>
              <div className="item-top">
                <span>已执行预算</span>
                {getAmountFormat(prjBasic.YSYYS)}元
              </div>
              <div className="item-bottom">
                <span>/执行率：</span>
                {((Number(prjBasic.YSYYS || 0) * 100) / Number(prjBasic.KZXYS || 0)).toFixed(2)}%
              </div>
            </div> */}
            <div
              className="info-item"
              key="关联预算项目："
              style={{ display: 'flex', height: 'unset' }}
            >
              <div style={{ flexShrink: 0, color: '#909399' }}>关联预算项目：</div>
              {/* <Link<div style={{ whiteSpace: 'break-spaces' }}>
              
                  style={{ color: '#3361ff' }}
                  to={{
                    pathname: `/pms/manage/BudgetDetail/${EncryptBase64(
                      JSON.stringify({
                        fromKey: prjBasic.YSLX,
                        budgetID: prjBasic.YSXMID,
                        routes,
                      }),
                    )}`,
                    state: {
                      routes,
                    },
                  }}
                  className="table-link-strong"
                >
                  {notNull(prjBasic.YSXMMC)}
                </Link> 
              </div>*/}
              <div style={{ whiteSpace: 'break-spaces' }}>{notNull(prjBasic.YSXMMC)}</div>
            </div>
            <div className="info-item" key="关联预算项目已执行预算">
              <span>已执行预算：</span>
              {getAmountFormat(prjBasic.YSYYS || 0) + '元'}
            </div>
            <div className="info-item" key="关联预算项目执行率">
              <span>执行率：</span>
              {(Number(prjBasic.KZXYS || 0) === 0
                ? 0
                : ((Number(prjBasic.YSYYS || 0) * 100) / Number(prjBasic.KZXYS || 0)).toFixed(2)) +
                '%'}
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
              {/* <div style={{ whiteSpace: 'break-spaces' }}>
                <Link
                  style={{ color: '#3361ff' }}
                  to={{
                    pathname: `/pms/manage/BudgetDetail/${EncryptBase64(
                      JSON.stringify({
                        fromKey: prjBasic.YSLX,
                        budgetID: prjBasic.YSXMID,
                        routes,
                      }),
                    )}`,
                    state: {
                      routes,
                    },
                  }}
                  className="table-link-strong"
                >
                  {notNull(prjBasic.YSXMMC)}
                </Link>
              </div> */}
              <div style={{ whiteSpace: 'break-spaces' }}>{notNull(prjBasic.YSXMMC)}</div>
            </div>
          </div>
        </div>
      )}
      {/* 招采信息 */}
      {!isHwSltPrj &&
        (isMember() ? (
          isNullArr([
            contrast.HTJE,
            prjBasic.ZBFS,
            contrast.QSRQ,
            bidding.TBBZJ,
            bidding.LYBZJ,
            bidding.PBBG,
            otrSupplier[0]?.GYSMC,
          ]) && invCData.length === 0 ? null : (
            <div className="info-box" key="zcxx">
              <div className="top-title">招采信息</div>
              {getHtxxInfoRow()}
              <div className="info-row-box">
                {notNull(prjBasic.ZBFS) !== '暂无数据' && getInfoItem('招采方式：', prjBasic.ZBFS)}
                {bidding.TBBZJ &&
                  getInfoItem('招标保证金：', getAmountFormat(bidding.TBBZJ) + '元')}
                {bidding.LYBZJ &&
                  getInfoItem('履约保证金：', getAmountFormat(bidding.LYBZJ) + '元')}
                {bidding.PBBG && getPbbg(JSON.parse(bidding.PBBG)?.items || [])}
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
                {/* {grayTest.XCHT && invCData.length > 0 && getHtqtmx(invCData)} */}
              </div>
            </div>
          )
        ) : isNullArr([
            prjBasic.ZBFS,
            contrast.QSRQ,
            bidding.PBBG,
            otrSupplier[0]?.GYSMC,
          ]) ? null : (
          <div className="info-box" key="zcxx">
            <div className="top-title">招采信息</div>
            <div className="info-row-box">
              {getHtxxInfoRow(false)}
              {notNull(prjBasic.ZBFS) !== '暂无数据' && getInfoItem('招采方式：', prjBasic.ZBFS)}
              {/* {contrast.QSRQ &&
                getInfoItem('签署日期：', moment(contrast.QSRQ).format('YYYY年MM月DD日'))} */}
              {bidding.PBBG && getPbbg(JSON.parse(bidding.PBBG)?.items || [])}
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
          </div>
        ))}
      {/* 实施信息 */}
      {isHwSltPrj && (
        <div className="info-box" key="zcxx">
          <div className="top-title">实施信息</div>
          <div className="info-row">
            {String(LOGIN_USER_INFO.id) === String(prjBasic.XMJLID) && (
              <div className="info-item" key="需求列表：">
                <span>需求列表：</span>
                {award[0]?.ID === '0' ? ( //与后端约定的，某些情况，如硬件入围时返回特殊数据用于判断是否显示
                  '暂无数据'
                ) : (
                  <a style={{ color: '#3361ff' }} onClick={() => openXqlbModal(xmid)}>
                    查看详情
                  </a>
                )}
              </div>
            )}
            {String(LOGIN_USER_INFO.id) === String(prjBasic.XMJLID) && (
              <div className="info-item" key="询比结果：">
                <span>询比结果：</span>
                {topic[0]?.XMID === '0' ? ( //与后端约定的，某些情况，如硬件入围时返回特殊数据用于判断是否显示
                  '暂无数据'
                ) : (
                  <a style={{ color: '#3361ff' }} onClick={() => openXbjglbModal(xmid)}>
                    查看详情
                  </a>
                )}
              </div>
            )}
            <div className="info-item" key="标段统计：">
              <span>标段统计：</span>
              {demand[0]?.XMID === '0' ? ( //与后端约定的，某些情况，如硬件入围时返回特殊数据用于判断是否显示
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
      {/* 供应商信息 */}
      {!isHwSltPrj && supplier.length !== 0 && (
        <div className="info-box" key="gysxx">
          <div className="top-title">供应商信息</div>
          {getSupplierInfoRow()}
        </div>
      )}
      {/* 知识产权和获奖荣誉信息 */}
      {[...topic.flatMap(x => x.data), ...award.flatMap(x => x.data)].length > 0 && (
        <div className="info-box" key="zscqhhjryxx">
          <div className="top-title">知识产权和获奖荣誉信息</div>
          <div className="info-row-box">
            {topic.map(x =>
              x.data.map((d, i) =>
                ZSCQ_HJRY(
                  x.title + (x.data.length > 1 ? '-' + (i + 1) : '') + '：',
                  `（${d.DQZT}）` + d.CQMC,
                ),
              ),
            )}
            {award.map(x =>
              x.data.map((d, i) =>
                ZSCQ_HJRY(
                  x.title + (x.data.length > 1 ? '-' + (i + 1) : '') + '：',
                  `（${d.DQZT}）` + d.HJMC,
                ),
              ),
            )}
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
