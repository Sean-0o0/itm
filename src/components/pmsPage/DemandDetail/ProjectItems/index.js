import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Tooltip } from 'antd';
import moment from 'moment';
import ResumeDestributionModal from './ResumeDestributionModal';
import PersonnelArrangementModal from './PersonnelArrangementModal';
import InterviewScoreModal from './InterviewScoreModal';
import DemandInitiated from '../../HardwareItems/DemandInitiated';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import { CreateOperateHyperLink } from '../../../../services/pmsServices';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { useLocation } from 'react-router-dom';
import SendMailModal from '../../SendMailModal';
import MoreOperationModal from '../EvaluationTable/MoreOperationModal';

export default function ProjectItems(props) {
  const {
    dtlData = {},
    isDock,
    isFqr,
    xqid,
    getDtldata,
    fqrid,
    WBRYGW,
    routes = [],
    dictionary,
  } = props;
  const { DFZT, LYZT } = dictionary;
  const {
    XQSX = [],
    FKTX = {},
    JLXX = [],
    JLXX2 = [],
    ZHPC = [],
    XQNR = [],
    XMXX = {},
    XQSX_ORIGIN = [],
  } = dtlData;
  const LOGIN_USER_ID = String(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [modalVisible, setModalVisible] = useState({
    demandInitiation: false,
    msgConfirmation: false,
    resumeDestribution: false,
    resumeUpload: false,
    personelArrangement: false,
    personelArrangementUpdate: false,
    interviewScore: false,
    employmentApplication: false,
    offerConfirmation: false,
    newAccount: false,
  }); //弹窗显隐
  const [lbModal, setLbModal] = useState({
    url: '#',
    title: '',
  }); //
  const [swzxid, setSwzxid] = useState(-1); //
  const location = useLocation();

  useEffect(() => {
    return () => {};
  }, []);

  //执行
  const handleZx = ({ SWMC = '--', ZXZT = '2', SWZXID }) => {
    let modalName = '';

    if (SWMC === '发送确认邮件') {
      modalName = 'msgConfirmation';
    } else if (SWMC === '简历分发') {
      // modalName = 'resumeDestribution';
      if (JLXX.length === 0) {
        message.info('请先上传简历', 1);
        return;
      }
      window.location.href = `/#/pms/manage/ResumeDistribution/${EncryptBase64(
        JSON.stringify({
          JLXX: JLXX2,
          xqid,
          swzxid: SWZXID,
          routes,
        }),
      )}`;
      return;
    } else if (SWMC === '简历上传') {
      getLink('View_JLSC1', 'View_JLSC1_M', [
        {
          name: 'XQMC',
          value: xqid,
        },
        {
          name: 'SWZX',
          value: SWZXID,
        },
      ]);
      modalName = 'resumeUpload';
      setLbModal(p => {
        return {
          ...p,
          title: SWMC,
        };
      });
    } else if (SWMC === '综合评测安排') {
      modalName = 'personelArrangement';
    } else if (SWMC === '综合评测打分') {
      modalName = 'interviewScore';
    } else if (SWMC === '提交录用申请') {
      modalName = 'employmentApplication';
      getLink('V_LYXX', 'V_LYXX_M', [
        {
          name: 'GLXQ',
          value: xqid,
        },
        {
          name: 'SWZXID',
          value: SWZXID,
        },
      ]);
      setLbModal(p => {
        return {
          ...p,
          title: SWMC,
        };
      });
    } else if (SWMC === '录用确认') {
      modalName = 'offerConfirmation';
    } else if (SWMC === '账号新增') {
      modalName = 'newAccount';
      getLink('V_RYXX', 'V_RYXX_ADD', [
        {
          name: 'SSWBXM2',
          value: XMXX.XMID,
        },
        {
          name: 'SWZXID',
          value: SWZXID,
        },
      ]);
      setLbModal(p => {
        return {
          ...p,
          title: SWMC,
        };
      });
    }
    setSwzxid(SWZXID);
    //打开弹窗
    setModalVisible(p => {
      return {
        ...p,
        [modalName]: true,
      };
    });
  };

  //查看
  const handleCk = (SWMC = '--', SWZXID) => {
    if (SWMC === '综合评测安排') {
      if (isDock || isFqr) {
        if (XQSX_ORIGIN.filter(x => x.SWMC === '提交录用申请')[0]?.ZXZT === '2') {
          //打开弹窗
          setModalVisible(p => {
            return {
              ...p,
              personelArrangement: true,
              personelArrangementUpdate: true,
            };
          });
          setSwzxid(SWZXID);
        } else {
          message.info('已提交录用申请，不允许综合评测安排', 1);
          return;
        }
      } else {
        message.info('只有外包项目对接人、需求发起人可以操作', 1);
        return;
      }
    } else if (SWMC === '录用确认') {
      if (isDock) {
        // modalName = 'offerConfirmation';
      } else {
        message.info('只有外包项目对接人可以操作', 1);
        return;
      }
    }
  };

  const getItemBtn = (item, SWZXID) => {
    const { SWMC = '--', ZXZT = '2' } = item;
    //是否评测人员
    const isPcry = () => {
      let arr = [];
      ZHPC.forEach(x => {
        arr = arr.concat(x.MSGID.split(','));
      });
      let newArr = [...new Set(arr)];
      // console.log("🚀 ~ file: index.js:51 ~ isPcry ~ isPcry:", newArr,LOGIN_USER_ID)
      return newArr.includes(LOGIN_USER_ID);
    };
    //1 已执行， 2 未执行
    if (
      [
        '账号新增',
        '综合评测打分',
        '发送确认邮件',
        '简历上传',
        '简历分发',
        '提交录用申请',
        '录用确认',
      ].includes(SWMC)
    ) {
      if (
        (['发送确认邮件', '简历上传', '简历分发', '录用确认'].includes(SWMC) && isDock) ||
        (['账号新增', '提交录用申请'].includes(SWMC) && isFqr) ||
        (SWMC === '综合评测打分' &&
          isPcry() &&
          XQSX_ORIGIN.filter(x => x.SWMC === '提交录用申请')[0]?.ZXZT === '2')
      )
        return (
          <div className="opr-btn" onClick={() => handleZx(item)}>
            执行
          </div>
        );
      return '';
    } else if (SWMC === '需求发起') {
      if (isDock || isFqr)
        return (
          <div
            className="reopr-btn"
            onClick={() =>
              setModalVisible(p => {
                return {
                  ...p,
                  demandInitiation: true,
                };
              })
            }
          >
            重新发起
          </div>
        );
      return '';
    } else if (SWMC === '综合评测安排') {
      if (
        (isDock || isFqr) &&
        XQSX_ORIGIN.filter(x => x.SWMC === '提交录用申请')[0]?.ZXZT === '2'
      ) {
        if (ZXZT === '1')
          return (
            <div className="reopr-btn" onClick={() => handleCk(SWMC, SWZXID)}>
              查看
            </div>
          );
        return (
          <div className="opr-btn" onClick={() => handleZx(item)}>
            执行
          </div>
        );
      }
      return '';
    } else {
      return '';
    }
  };

  //刷新数据
  const reflush = () => {
    getDtldata(xqid, fqrid);
  };

  //获取Livebos弹窗链接
  const getLink = (objName, oprName, data) => {
    //Livebos弹窗参数
    let params = {
      attribute: 0,
      authFlag: 0,
      objectName: objName,
      operateName: oprName,
      parameter: data,
      userId: String(JSON.parse(sessionStorage.getItem('user')).loginName),
    };
    CreateOperateHyperLink(params)
      .then((ret = {}) => {
        const { code, url } = ret;
        if (code === 1) {
          setLbModal(p => {
            return {
              ...p,
              url,
            };
          });
        }
      })
      .catch(error => {
        message.error('livebos链接创建失败', 1);
        console.error(!error.success ? error.message : error.note);
      });
  };

  const resumeUploadModalProps = {
    isAllWindow: 1,
    width: '760px',
    height: '305px',
    title: '简历上传',
    style: { top: '60px' },
    visible: modalVisible.resumeUpload,
    footer: null,
  };

  const employmentApplicationProps = {
    isAllWindow: 1,
    width: '760px',
    height: '325px',
    title: '提交录用申请',
    style: { top: '60px' },
    visible: modalVisible.employmentApplication,
    footer: null,
  };

  const newAccountProps = {
    isAllWindow: 1,
    width: '760px',
    height: '360px',
    title: '账号新增',
    style: { top: '60px' },
    visible: modalVisible.newAccount,
    footer: null,
  };

  const columns = [
    {
      title: '人员需求',
      dataIndex: 'RYDJ',
      width: '10%',
      // align: 'center',
      key: 'RYDJ',
      ellipsis: true,
      render: (txt, row) => {
        return (
          <Tooltip title={txt + ` | ` + row.GW} placement="topLeft">
            <span style={{ cursor: 'default' }}>{txt + ` | ` + row.GW}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '供应商名称',
      dataIndex: 'GYSMC',
      width: isDock ? '20%' : '0',
      key: 'GYSMC',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <Tooltip title={text} placement="topLeft">
            <Link
              to={{
                pathname: `/pms/manage/SupplierDetail/${EncryptBase64(
                  JSON.stringify({ splId: row.GYSID }),
                )}`,
                state: {
                  routes: [{ name: '需求详情', pathname: location.pathname }],
                },
              }}
              className="table-link-strong"
            >
              {text}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      title: '人员名称',
      dataIndex: 'RYMC',
      width: '8%',
      key: 'RYMC',
      ellipsis: true,
      render: (text, row, index) => {
        if (row.RYID === undefined) return text;
        return (
          <Link
            style={{ color: '#3361ff' }}
            to={{
              pathname: `/pms/manage/staffDetail/${EncryptBase64(
                JSON.stringify({
                  ryid: row.RYID,
                }),
              )}`,
              state: {
                routes: [{ name: '需求详情', pathname: location.pathname }],
              },
            }}
            className="table-link-strong"
          >
            {text}
          </Link>
        );
      },
    },
    {
      title: '评测人员',
      dataIndex: 'MSG',
      width: '12%',
      key: 'MSG',
      ellipsis: true,
      render: (txt, row) => {
        let nameArr = txt?.split(',');
        let idArr = row.MSGID?.split(',');
        if (nameArr?.length === 0) return '';
        return (
          <Tooltip title={nameArr?.join('、')} placement="topLeft">
            {nameArr?.map((x, i) => (
              <span>
                <Link
                  style={{ color: '#3361ff' }}
                  to={{
                    pathname: `/pms/manage/staffDetail/${EncryptBase64(
                      JSON.stringify({
                        ryid: idArr[i],
                      }),
                    )}`,
                    state: {
                      routes: [{ name: '需求详情', pathname: location.pathname }],
                    },
                  }}
                  className="table-link-strong-tagtxt"
                >
                  {x}
                </Link>
                {i === nameArr?.length - 1 ? '' : '、'}
              </span>
            ))}
          </Tooltip>
        );
      },
    },
    {
      title: '综合评测时间',
      dataIndex: 'ZHPCSJ',
      width: '13%',
      key: 'ZHPCSJ',
      ellipsis: true,
      render: (txt, row) => (txt && moment(txt).format('YYYY-MM-DD HH:mm')) || '--',
    },
    {
      title: '综合评测分数',
      dataIndex: 'ZHPCCJ',
      width: '10%',
      align: 'center',
      key: 'ZHPCCJ',
      ellipsis: true,
    },
    {
      title: '打分状态',
      dataIndex: 'DFZT',
      width: '10%',
      key: 'DFZT',
      ellipsis: true,
      render: txt => DFZT?.filter(x => x.ibm === txt)[0]?.note,
    },
    {
      title: '录用状态',
      dataIndex: 'LYZT',
      width: '8%',
      key: 'LYZT',
      ellipsis: true,
      render: txt => LYZT?.filter(x => x.ibm === txt)[0]?.note,
    },
    {
      title: '录用说明',
      dataIndex: 'LYSM',
      key: 'LYSM',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="prj-items-box">
      {modalVisible.offerConfirmation && (
        <MoreOperationModal
          visible={modalVisible.offerConfirmation}
          setVisible={v => {
            setModalVisible(p => {
              return {
                ...p,
                offerConfirmation: v,
              };
            });
          }}
          data={{
            tableData: ZHPC,
            DFZT,
            LYZT,
            xqid,
            reflush: () => {
              getDtldata(xqid, fqrid);
            },
            swzxid: XQSX_ORIGIN.filter(x => x.SWMC === '综合评测安排')[0]?.SWZXID,
            isDock,
            fqrid,
          }}
          tableColumns={columns}
        />
      )}
      {modalVisible.msgConfirmation && (
        <SendMailModal
          closeModal={() =>
            setModalVisible(p => {
              return {
                ...p,
                msgConfirmation: false,
              };
            })
          }
          successCallBack={() => {
            setModalVisible(p => {
              return {
                ...p,
                msgConfirmation: false,
              };
            });
            reflush();
          }}
          visible={modalVisible.msgConfirmation}
        />
      )}
      {/* 需求重新发起 */}
      {modalVisible.demandInitiation && (
        <DemandInitiated
          xmmc={XMXX.XMMC}
          xmid={Number(XMXX.XMID)}
          operateType="relaunch"
          xqid={Number(xqid)}
          closeModal={() =>
            setModalVisible(p => {
              return {
                ...p,
                demandInitiation: false,
              };
            })
          }
          visible={modalVisible.demandInitiation}
          successCallBack={() => {
            setModalVisible(p => {
              return {
                ...p,
                demandInitiation: false,
              };
            });
            reflush();
          }}
        />
      )}

      {/*简历上传*/}
      {modalVisible.resumeUpload && (
        <BridgeModel
          modalProps={resumeUploadModalProps}
          onSucess={() => {
            setModalVisible(p => {
              return {
                ...p,
                resumeUpload: false,
              };
            });
            reflush();
            message.success('上传成功', 1);
          }}
          onCancel={() =>
            setModalVisible(p => {
              return {
                ...p,
                resumeUpload: false,
              };
            })
          }
          src={lbModal.url}
        />
      )}

      {/* 简历分发 */}
      {modalVisible.resumeDestribution && (
        <ResumeDestributionModal
          visible={modalVisible.resumeDestribution}
          setVisible={v => {
            setModalVisible(p => {
              return {
                ...p,
                resumeDestribution: v,
              };
            });
          }}
          JLXX={JLXX}
          xqid={xqid}
          swzxid={swzxid}
          reflush={reflush}
        />
      )}

      {/* 综合评测安排 */}
      {modalVisible.personelArrangement && (
        <PersonnelArrangementModal
          visible={modalVisible.personelArrangement}
          setVisible={v => {
            setModalVisible(p => {
              return {
                ...p,
                personelArrangement: v,
              };
            });
          }}
          XQNR={XQNR}
          xqid={xqid}
          swzxid={swzxid}
          reflush={reflush}
          update={modalVisible.personelArrangementUpdate}
          ZHPC={ZHPC}
          isDock={isDock}
        />
      )}

      {/* 综合评测打分 */}
      {modalVisible.interviewScore && (
        <InterviewScoreModal
          visible={modalVisible.interviewScore}
          setVisible={v => {
            setModalVisible(p => {
              return {
                ...p,
                interviewScore: v,
              };
            });
          }}
          ZHPC={ZHPC}
          xqid={xqid}
          swzxid={swzxid}
          reflush={reflush}
          WBRYGW={WBRYGW}
        />
      )}

      {/* 提交录用申请 */}
      {modalVisible.employmentApplication && (
        <BridgeModel
          modalProps={employmentApplicationProps}
          onSucess={() => {
            setModalVisible(p => {
              return {
                ...p,
                employmentApplication: false,
              };
            });
            reflush();
            message.success('提交成功', 1);
          }}
          onCancel={() =>
            setModalVisible(p => {
              return {
                ...p,
                employmentApplication: false,
              };
            })
          }
          src={lbModal.url}
        />
      )}

      {/* 账号新增/ */}
      {modalVisible.newAccount && (
        <BridgeModel
          modalProps={newAccountProps}
          onSucess={() => {
            setModalVisible(p => {
              return {
                ...p,
                newAccount: false,
              };
            });
            reflush();
            window.location.href = `/#/pms/manage/MemberInfo/${EncryptBase64(
              JSON.stringify({
                xmid: XMXX.XMID,
              }),
            )}`;
            message.success('新增成功', 1);
          }}
          onCancel={() =>
            setModalVisible(p => {
              return {
                ...p,
                newAccount: false,
              };
            })
          }
          src={lbModal.url}
        />
      )}
      <div className="top">
        <div className="left">项目事项</div>
        {FKTX.TXNR !== undefined && (
          <div className="right">
            <i className="iconfont fill-info" />
            {FKTX.TXNR}
            <div className="opr-btn">发起付款</div>
          </div>
        )}
      </div>
      <div className="bottom">
        {XQSX.map(item => (
          <div className="item" key={item.SWLX}>
            <div className="item-top">{item.SWLX}</div>
            <div className="item-bottom">
              {item.SXDATA.map((x, i) => (
                <div
                  className="bottom-row"
                  style={x.ZXZT === '2' ? {} : { color: '#3361ff' }}
                  key={x.SWZXID}
                >
                  {x.ZXZT === '2' ? (
                    <i className="iconfont circle-reduce" />
                  ) : (
                    <i className="iconfont circle-check" />
                  )}
                  <Tooltip title={x.SWMC} placement="topLeft">
                    <span>{x.SWMC}</span>
                  </Tooltip>
                  {getItemBtn(x, x.SWZXID)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
