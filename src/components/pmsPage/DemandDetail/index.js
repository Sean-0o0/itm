import React, { useEffect, useState } from 'react';
import TopConsole from './TopConsole';
import {
  QueryProjectInfoAll,
  QueryRequirementDetail,
  QueryUserRole,
} from '../../../services/pmsServices/index';
import { message, Spin } from 'antd';
import ProjectItems from './ProjectItems';
import DemandTable from './DemandTable';
import ResumeInfo from './ResumeInfo';
import EvaluationTable from './EvaluationTable';
import EmploymentInfo from './EmploymentInfo';
// import { FetchQueryProjectLabel } from '../../../services/projectManage';

export default function DemandDetail(props) {
  const { routes, xqid, dictionary } = props;
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
        XQFQR: '111',
      },
      {
        XQMC: 'xqmc',
        XQID: '2',
        XQFQR: '222',
      },
    ],
    XQXQ: [
      {
        XQID: '123',
        SXLX: '人员面试',
        SXDATA: [
          {
            SXMC: '需求发起',
            ZXZT: '2',
          },
          {
            SXMC: '发送确认邮件',
            ZXZT: '2',
          },
        ],
      },
      {
        XQID: '123',
        SXLX: '需求申请',
        SXDATA: [
          {
            SXMC: '简历分发',
            ZXZT: '2',
          },
        ],
      },
      {
        XQID: '123',
        SXLX: '简历筛选',
        SXDATA: [
          {
            SXMC: '综合评测安排',
            ZXZT: '2',
          },
          {
            SXMC: '面试评分',
            ZXZT: '2',
          },
          {
            SXMC: '提交录用申请',
            ZXZT: '2',
          },
        ],
      },

      {
        XQID: '123',
        SXLX: '人员录用',
        SXDATA: [
          {
            SXMC: '录用确认',
            ZXZT: '2',
          },
          {
            SXMC: '账号新增',
            ZXZT: '2',
          },
        ],
      },
    ],
    XQNR: [
      {
        XQNRID: '1',
        KFSRQ: '20230115',
        CSRQ: '20230501',
        PCRQ: '20230406',
        SYRQ: '20230614',
        RYXQ: '123',
        RYSL: '123',
        RYSC: '123',
        RYXQNR: '1、精通前端开发的基础技术（HTML、CSS、HTML5、CSS3等）。2、 精通原理深刻',
        YGYS: '123',
      },
      {
        XQNRID: '2',
        KFSRQ: '20230115',
        CSRQ: '20230501',
        PCRQ: '20230406',
        SYRQ: '20230614',
        RYXQ: '123',
        RYSL: '123',
        RYSC: '123',
        RYXQNR: '1、精通前端开发的基础技术（HTML、CSS、HTML5、CSS3等）。2、 精通原理深刻',
        YGYS: '123',
      },
      {
        XQNRID: '3',
        KFSRQ: '20230115',
        CSRQ: '20230501',
        PCRQ: '20230406',
        SYRQ: '20230614',
        RYXQ: '123',
        RYSL: '123',
        RYSC: '123',
        RYXQNR: '1、精通前端开发的基础技术（HTML、CSS、HTML5、CSS3等）。2、 精通原理深刻',
        YGYS: '123',
      },
    ],
    JLXX: [
      {
        GYSMC: '福建顶点软件股份有限公司：',
        JLFS: '3',
        JLDATA: [
          {
            JLMC: '123',
            JLID: '1',
          },
          {
            JLMC: '123',
            JLID: '1',
          },
          {
            JLMC: '123',
            JLID: '1',
          },
        ],
      },
      {
        GYSMC: '福建顶点软件股份有限公司：',
        JLFS: '3',
        JLDATA: [
          {
            JLMC: '123',
            JLID: '1',
          },
          {
            JLMC: '123',
            JLID: '1',
          },
          {
            JLMC: '123',
            JLID: '1',
          },
        ],
      },
      {
        GYSMC: '福建顶点软件股份有限公司：',
        JLFS: '3',
        JLDATA: [
          {
            JLMC: '123',
            JLID: '1',
          },
          {
            JLMC: '123',
            JLID: '1',
          },
          {
            JLMC: '123',
            JLID: '1',
          },
        ],
      },
      {
        GYSMC: '福建顶点软件股份有限公司：',
        JLFS: '3',
        JLDATA: [
          {
            JLMC: '123',
            JLID: '1',
          },
          {
            JLMC: '123',
            JLID: '1',
          },
          {
            JLMC: '123',
            JLID: '1',
          },
        ],
      },
      {
        GYSMC: '福建顶点软件股份有限公司：',
        JLFS: '3',
        JLDATA: [
          {
            JLMC: '123',
            JLID: '1',
          },
          {
            JLMC: '123',
            JLID: '1',
          },
          {
            JLMC: '123',
            JLID: '1',
          },
        ],
      },
    ],
    ZHPC: [
      {
        ZHPCID: '1',
        RYXQ: '123',
        GYSID: '1',
        GYSMC: '福建顶点软件股份有限公司福建顶点软件股份有限公司',
        RYMC: '123',
        RYID: '123',
        PCRY: '123',
        ZHPCSJ: '20230114 1500',
        ZHPCFS: '123',
        DFZT: '2',
        LYZT: '3',
        LYSM: '123',
      },
      {
        ZHPCID: '2',
        RYXQ: '123',
        GYSID: '1',
        GYSMC: '福建顶点软件股份有限公司福建顶点软件股份有限公司',
        RYMC: '123',
        RYID: '123',
        PCRY: '123',
        ZHPCSJ: '123',
        ZHPCFS: '123',
        DFZT: '3',
        LYZT: '1',
        LYSM: '123',
      },
      {
        ZHPCID: '3',
        RYXQ: '123',
        GYSID: '1',
        GYSMC: '福建顶点软件股份有限公司福建顶点软件股份有限公司',
        RYMC: '123',
        RYID: '123',
        PCRY: '123',
        ZHPCSJ: '123',
        ZHPCFS: '123',
        DFZT: '1',
        LYZT: '2',
        LYSM: '123',
      },
      {
        ZHPCID: '4',
        RYXQ: '123',
        GYSID: '1',
        GYSMC: '福建顶点软件股份有限公司福建顶点软件股份有限公司',
        RYMC: '123',
        RYID: '123',
        PCRY: '123',
        ZHPCSJ: '123',
        ZHPCFS: '123',
        DFZT: '1',
        LYZT: '2',
        LYSM: '123',
      },
      {
        ZHPCID: '5',
        RYXQ: '123',
        GYSID: '1',
        GYSMC: '福建顶点软件股份有限公司福建顶点软件股份有限公司',
        RYMC: '123',
        RYID: '123',
        PCRY: '123',
        ZHPCSJ: '123',
        ZHPCFS: '123',
        DFZT: '1',
        LYZT: '2',
        LYSM: '123',
      },
      {
        ZHPCID: '6',
        RYXQ: '123',
        GYSID: '1',
        GYSMC: '福建顶点软件股份有限公司福建顶点软件股份有限公司',
        RYMC: '123',
        RYID: '123',
        PCRY: '123',
        ZHPCSJ: '123',
        ZHPCFS: '123',
        DFZT: '1',
        LYZT: '2',
        LYSM: '123',
      },
    ],
    LYSQ: {
      LYBZ:
        '这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注这里是录用备注',
      MSWJ: '123',
    },
    FKTX: {
      TXNR: '1-3月的费用已计算完成',
    },
    RYXQ: ['G3｜前端', 'G3｜JAVA', 'G3｜UI'],
  }); //详情信息
  const [example, setexample] = useState(example); //example
  // const { HJRYDJ, ZSCQLX, RYGW, CGFS } = dictionary; //获奖等级、知识产权类型、岗位、招采方式
  const [isLeader, setIsLeader] = useState(false); //判断用户是否为领导 - 权限控制
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    if (xqid !== -2) {
      // setIsSpinning(true);
      getDtldata();
    }
    return () => {};
  }, [xqid]);

  //获取详情数据
  const getDtldata = () => {
    QueryUserRole({
      userId: Number(LOGIN_USER_INFO.id),
    })
      .then(res => {
        QueryRequirementDetail({
          current: 1,
          pageSize: 10,
          paging: -1,
          sort: '',
          total: -1,
          cxlx: 'ALL',
          js: res.role,
          xqid,
        })
          .then(res => {
            if (res?.success) {
              console.log('🚀 ~ QueryRequirementDetail ~ res', res);
            }
          })
          .catch(e => {
            console.error('QueryRequirementDetail', e);
          });
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
        <TopConsole xqid={xqid} routes={routes} dtlData={dtlData} isLeader={isLeader} />
        <ProjectItems dtlData={dtlData} />
        <DemandTable dtlData={dtlData} />
        <ResumeInfo dtlData={dtlData} />
        <EvaluationTable dtlData={dtlData} dictionary={dictionary} />
        <EmploymentInfo dtlData={dtlData} />
      </div>
    </Spin>
  );
}
