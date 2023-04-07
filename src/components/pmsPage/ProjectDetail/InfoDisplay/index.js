import { Popover, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import config from '../../../../utils/config';
import axios from 'axios';
import { EncryptBase64 } from '../../../Common/Encrypt';
const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;

export default function InfoDisplay(props) {
  const { prjData, xmid, routes, isLeader } = props;
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
  console.log('🚀 ~ file: index.js:28 ~ InfoDisplay ~ prjData:', prjData);
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    return () => {};
  }, []);

  //评标报告预览下载
  const handleFile = (id, fileName) => {
    console.log(id, fileName);
    axios({
      method: 'POST',
      url: queryFileStream,
      responseType: 'blob',
      data: {
        objectName: 'TXMXX_ZBXX',
        columnName: 'PBBG',
        id: id,
        title: fileName,
        extr: '',
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

  //金额显示,
  const getAmountFormat = (value = 0) => {
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
          {x.GYSMC}
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
  return (
    <div className="col-left info-display-box">
      {/* 项目信息 */}
      <div className="info-box" key="xmxx">
        <div className="top-title">项目信息</div>
        <div className="info-row">
          {getInfoItem('项目类型：', notNull(prjBasic.XMLX))}
          {getInfoItem('关联软件：', notNull(prjBasic.GLXT))}
          {getInfoItem('应用部门：', notNull(prjBasic.SSBM))}
        </div>
        <div className="info-row">
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
        </div>
        <div className="info-row">
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
                      <span style={{ cursor: 'default' }}>{moment(txt).format('YYYY-MM-DD')}</span>
                    ),
                  },
                ])}
                overlayClassName="unplanned-demand-content-popover"
              >
                <a style={{ color: '#3361ff' }}>查看详情</a>
              </Popover>
            )}
          </div>
        </div>
      </div>
      {/* 预算信息 */}
      {isMember() ? (
        <div className="info-box" key="ysxx">
          <div className="top-title">预算信息</div>
          <div className="info-row">
            {getInfoItem('项目预算：', getAmountFormat(prjBasic.YSJE) + '元')}
            <div
              className="info-item"
              key="关联预算项目："
              style={{ display: 'flex', height: 'unset' }}
            >
              <div style={{ flexShrink: 0, color: '#909399' }}>关联预算项目：</div>
              <div style={{ whiteSpace: 'break-spaces' }}>{notNull(prjBasic.YSXMMC)}</div>
            </div>

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
          <div className="info-row">
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
      <div className="info-box" key="gysxx">
        <div className="top-title">供应商信息</div>
        <div className="info-row">
          {notNull(supplier[0]?.GYSMC) !== '暂无数据' && (
            <div
              className="info-item"
              key="供应商名称："
              style={{ display: 'flex', height: 'unset' }}
            >
              <div style={{ flexShrink: 0, color: '#909399' }}>供应商名称：</div>
              <a
                style={{
                  whiteSpace: 'break-spaces',
                  color: '#3361ff',
                }}
              >
                {supplier[0]?.GYSMC}
              </a>
            </div>
          )}
          {notNull(supplier[0]?.GYSLX) !== '暂无数据' &&
            getInfoItem('供应商类型：', supplier[0]?.GYSLX)}
          {supplier[0]?.LXR && (
            <div
              className="info-item"
              key="供应商联系人："
              style={{ display: 'flex', height: 'unset' }}
            >
              <div className="payment-label" style={{ width: 98 }}>
                供应商联系人：
              </div>
              <div className="payment-plan">
                {supplier.map(x => (
                  <div key={x.LXRXXID}>
                    {x.LXR || ''} {x.SJ || ''}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 招采信息 */}
      {isMember() ? (
        <div className="info-box" key="zcxx">
          <div className="top-title">招采信息</div>
          <div className="info-row-box">
            {contrast.HTJE && getInfoItem('合同金额：', getAmountFormat(contrast.HTJE) + '元')}
            {notNull(prjBasic.ZBFS) !== '暂无数据' && getInfoItem('招采方式：', prjBasic.ZBFS)}
            {contrast.QSRQ &&
              getInfoItem('签署日期：', moment(contrast.QSRQ).format('YYYY年MM月DD日'))}
            {bidding.TBBZJ && getInfoItem('招标保证金：', getAmountFormat(bidding.TBBZJ) + '元')}
            {bidding.LYBZJ && getInfoItem('履约保证金：', getAmountFormat(bidding.LYBZJ) + '元')}
            {bidding.PBBG && (
              <div className="info-item" key="评标报告：">
                <span>评标报告：</span>
                <a
                  style={{ color: '#3361ff' }}
                  onClick={() => handleFile(bidding.ID, bidding.PBBG)}
                >
                  {bidding.PBBG}
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
        </div>
      ) : (
        <div className="info-box" key="zcxx">
          <div className="top-title">招采信息</div>
          <div className="info-row-box">
            {notNull(prjBasic.ZBFS) !== '暂无数据' && getInfoItem('招采方式：', prjBasic.ZBFS)}
            {contrast.QSRQ &&
              getInfoItem('签署日期：', moment(contrast.QSRQ).format('YYYY年MM月DD日'))}
            {bidding.PBBG && (
              <div className="info-item" key="评标报告：">
                <span>评标报告：</span>
                <a
                  style={{ color: '#3361ff' }}
                  onClick={() => handleFile(bidding.ID, bidding.PBBG)}
                >
                  {bidding.PBBG}
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
