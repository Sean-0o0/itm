import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import InfoDisplay from './InfoDisplay';
import MileStone from './MileStone';
import PrjMember from './PrjMember';
import PrjMessage from './PrjMessage';
import TopConsole from './TopConsole';
import { QueryProjectInfoAll, QueryUserRole } from '../../../services/pmsServices/index';
import { message, Spin } from 'antd';
import moment from 'moment';
import DemandInitiationModal from '../DemandInitiationModal';

export default function ProjectDetail(props) {
  const { routes, xmid, dictionary } = props;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [prjData, setPrjData] = useState({}); //项目信息-所有
  const { HJRYDJ, ZSCQLX, RYGW, CGFS } = dictionary; //获奖等级、知识产权类型、岗位、招采方式
  const [isLeader, setIsLeader] = useState(false); //判断用户是否为领导 - 权限控制
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const [isHwPrj, setIsHwPrj] = useState(false); //是否包含硬件
  const [isHwSltPrj, setIsHwSltPrj] = useState(false); //是否为硬件入围类型
  const XMLX = [
    {
      ibm: '-3',
      note: '自研项目',
    },
    {
      ibm: '-2',
      note: '外采项目',
    },
    {
      ibm: '-1',
      note: '全部项目',
    },
    {
      ibm: '1',
      note: '软硬件项目',
    },
    {
      ibm: '2',
      note: '普通项目',
    },
    {
      ibm: '4',
      note: '软件入围项目',
    },
    {
      ibm: '5',
      note: '软硬件项目',
    },
    {
      ibm: '6',
      note: '硬件入围项目',
    },
    {
      ibm: '7',
      note: '集合类项目',
    },
    {
      ibm: '8',
      note: '工程类项目',
    },
    {
      ibm: '9',
      note: '咨询服务项目',
    },
    {
      ibm: '10',
      note: '普通人力服务项目',
    },
    {
      ibm: '11',
      note: '人力服务入围项目',
    },
    {
      ibm: '13',
      note: '集合项目',
    },
  ];

  useEffect(() => {
    if (xmid !== -1) {
      setIsSpinning(true);
      getPrjDtlData();
      getIsLeader();
      const htmlContent = document.getElementById('htmlContent');
      // console.log('🚀 ~ file: index.js ~ line 26 ~ useEffect ~ htmlContent', htmlContent);
      htmlContent.scrollTop = 0; //页面跳转后滚至顶部
    }
    return () => {};
  }, [HJRYDJ, ZSCQLX, RYGW, CGFS, xmid]);

  //判断用户是否为领导
  const getIsLeader = () => {
    QueryUserRole({
      userId: Number(LOGIN_USER_INFO.id),
    })
      .then(res => {
        // console.log('res.role', res.role);
        setIsLeader(res.role !== '普通人员');
      })
      .catch(e => {
        message.error('用户信息查询失败', 1);
        console.error('QueryIsLeader', e);
      });
  };

  //获取项目详情数据
  const getPrjDtlData = () => {
    QueryProjectInfoAll({
      current: 1,
      cxlx: 'ALL',
      pageSize: 10,
      paging: -1,
      sort: 'string',
      total: -1,
      xmid: Number(xmid),
      // xmid: 334,
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ file: index.js ~ line 38 ~ getPrjDtlData ~ res', res);
          const p = (str, isArr = true) => {
            if (isArr) return JSON.parse(str) || [];
            return JSON.parse(str)[0] || {};
          };
          let member = p(res.ryxxRecord);
          member.forEach(item => {
            item.GW = RYGW?.filter(x => x.ibm === item.GW)[0]?.note;
          });
          let prjBasic = p(res.xmjbxxRecord, false);
          // console.log('🚀 ~ file: index.js:130 ~ getPrjDtlData ~ prjBasic:', prjBasic);
          setIsHwSltPrj(prjBasic.XMLX === '6');
          setIsHwPrj(prjBasic.SFBHYJ === '1');
          //字典处理
          let award = p(res.hjxxRecord);
          prjBasic.XMLX !== '6' &&
            award.forEach(item => {
              item.RYDJ = HJRYDJ?.filter(x => x.ibm === item.RYDJ)[0]?.note;
              item.ZSCQLX = ZSCQLX?.filter(x => x.ibm === item.ZSCQLX)[0]?.note;
              item.HJSJ = item.HJSJ.slice(0, 10);
            });
          prjBasic.ZBFS = CGFS?.filter(x => x.ibm === prjBasic.ZBFS)[0]?.note;
          prjBasic.XMLX = XMLX?.filter(x => x.ibm === prjBasic.XMLX)[0]?.note;
          let obj = {
            prjBasic,
            member,
            demand: p(res.xqxxRecord),
            risk: p(res.fxxxRecord),
            contrast: p(res.htxxRecord, false),
            bidding: p(res.zbxxRecord, false),
            otrSupplier: p(res.qtgysxxRecord),
            award,
            topic: p(res.ktxxRecord),
            payment: p(res.fkxxRecord),
            supplier: p(res.gysxxRecord),
          };
          // console.log('🚀 ~ getPrjDtlData', obj);
          setPrjData(obj);
        }
      })
      .catch(e => {
        console.error('QueryProjectInfoAll', e);
        message.error('项目详情信息查询失败', 1);
      });
  };

  return (
    <Spin
      spinning={isSpinning}
      tip="加载中"
      size="large"
      wrapperClassName="diy-style-spin-prj-detail"
    >
      <div className="prj-detail-box">
        {/* <DemandInitiationModal visible={true} setVisible={() => {}} dataProps={{}} /> */}
        <TopConsole
          xmid={xmid}
          routes={routes}
          prjData={prjData}
          getPrjDtlData={getPrjDtlData}
          isLeader={isLeader}
        />
        <div className="detail-row">
          <div className="col-left">
            <MileStone
              xmid={xmid}
              prjData={prjData}
              getPrjDtlData={getPrjDtlData}
              setIsSpinning={setIsSpinning}
              isLeader={isLeader}
              isHwPrj={isHwPrj}
            />
            <InfoDisplay
              isHwSltPrj={isHwSltPrj}
              prjData={prjData}
              routes={routes}
              xmid={xmid}
              isLeader={isLeader}
            />
          </div>
          <div className="col-right">
            <PrjMember routes={routes} prjData={prjData} dictionary={dictionary} />
            <PrjMessage xmid={xmid} />
          </div>
        </div>
      </div>
    </Spin>
  );
}
