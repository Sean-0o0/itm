import React, { useEffect, useState } from 'react';
import TopConsole from './TopConsole';
import { QueryProjectInfoAll, QueryUserRole } from '../../../services/pmsServices/index';
import { message, Spin } from 'antd';
import PrjItems from './PrjItems';
// import { FetchQueryProjectLabel } from '../../../services/projectManage';

export default function DemandDetail(props) {
  const { routes, xmid, dictionary } = props;
  console.log("🚀 ~ file: index.js:10 ~ DemandDetail ~ dictionary:", dictionary)
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [dtlData, setDtlData] = useState({
    XMXX: {
      XMID: '123',
      XMMC: '123',
      XMBQ: '123',
      XMBQID: '123',
      XMJL: '123',
      CJSJ: '123',
    },
    XQ: [
      {
        XQMC: 'xqmc',
        XQID: '1',
      },
      {
        XQMC: 'xqmc',
        XQID: '2',
      },
      {
        XQMC: 'xqmc',
        XQID: '3',
      },
      {
        XQMC: 'xqmc',
        XQID: '4',
      },
    ],
    XQXQ: [
      {
        XQID: '123',
        SXLX: '需求申请',
        SXDATA: [
          {
            SXMC: '需求发起',
            ZXZT: '1',
          },
          {
            SXMC: '发送确认邮件',
            ZXZT: '1',
          },
        ],
      },
      {
        XQID: '123',
        SXLX: '简历筛选',
        SXDATA: [
          {
            SXMC: '需求发起',
            ZXZT: '1',
          },
          {
            SXMC: '发送确认邮件',
            ZXZT: '1',
          },
        ],
      },
      {
        XQID: '123',
        SXLX: '人员面试',
        SXDATA: [
          {
            SXMC: '需求发起',
            ZXZT: '1',
          },
          {
            SXMC: '发送确认邮件',
            ZXZT: '1',
          },
        ],
      },
      {
        XQID: '123',
        SXLX: '人员录用',
        SXDATA: [
          {
            SXMC: '需求发起',
            ZXZT: '1',
          },
          {
            SXMC: '发送确认邮件',
            ZXZT: '1',
          },
        ],
      },
    ],
    ZXNR: [
      {
        KFSRQ: '123',
        CSRQ: '123',
        PCRQ: '123',
        SYRQ: '123',
        RYXQ: '123',
        RYSL: '123',
        RYSC: '123',
        RYXQNR: '123',
        YGYS: '123',
      },
    ],
    JLXX: [
      {
        GYSMC: '123',
        JLFS: '123',
        JLMC: '123',
      },
    ],
    ZHPC: [
      {
        RYXQ: '123',
        GYSMC: '123',
        RYMC: '123',
        RYID: '123',
        PCRY: '123',
        ZHPCSJ: '123',
        ZHPCFS: '123',
        DFZT: '123',
        LYZT: '123',
        LYSM: '123',
      },
    ],
    LYSQ: {
      LYBZ: '123',
      MSWJ: '123',
    },
    FKTX: {
      TXNR: '123',
    },
  }); //详情信息
  // const { HJRYDJ, ZSCQLX, RYGW, CGFS } = dictionary; //获奖等级、知识产权类型、岗位、招采方式
  const [isLeader, setIsLeader] = useState(false); //判断用户是否为领导 - 权限控制
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));

  // useEffect(() => {
  //   if (xmid !== -1) {
  //     setIsSpinning(true);
  //   }
  //   return () => {};
  // }, [HJRYDJ, ZSCQLX, RYGW, CGFS, xmid]);

  //判断用户是否为领导
  const getIsLeader = () => {
    QueryUserRole({
      userId: Number(LOGIN_USER_INFO.id),
    })
      .then(res => {
        // console.log('res.role', res.role);
        setIsLeader(res.role !== '普通人员');
        // getXMLX();
      })
      .catch(e => {
        message.error('用户信息查询失败', 1);
        console.error('QueryIsLeader', e);
      });
  };

  return (
    <Spin
      spinning={isSpinning}
      tip="加载中"
      size="large"
      wrapperClassName="diy-style-spin-prj-detail"
    >
      <div className="demand-detail-box">
        <TopConsole xmid={xmid} routes={routes} dtlData={dtlData} isLeader={isLeader} />
        <PrjItems dtlData={dtlData}/>
      </div>
    </Spin>
  );
}
