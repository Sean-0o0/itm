import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Tooltip } from 'antd';
import moment from 'moment';
import ResumeDestributionModal from './ResumeDestributionModal';
import PersonnelArrangementModal from './PersonnelArrangementModal';
import InterviewScoreModal from './InterviewScoreModal';
import EmploymentApplicationModal from './EmploymentApplicationModal';
import NewAccountModal from './NewAccountModal';
import DemandInitiated from '../../HardwareItems/DemandInitiated';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import { CreateOperateHyperLink } from '../../../../services/pmsServices';

export default function ProjectItems(props) {
  const { dtlData = {}, isAuth, xqid, getDtldata, fqrid} = props;
  const { XQSX = [], FKTX = {}, JLXX = [], ZHPC = [], XQNR = [], XMXX = {}} = dtlData;
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

  useEffect(() => {
    return () => {};
  }, []);

  //执行
  const handleZx = (SWMC = '--', ZXZT = '2', SWZXID) => {
    if (!isAuth) {
      message.info('只有外包项目对接人和需求发起人可以操作', 1);
      return;
    }
    let modalName = '';
    if (SWMC === '需求发起') {
      // modalName = 'demandInitiation';
    } else if (SWMC === '发送确认邮件') {
      modalName = 'msgConfirmation';
    } else if (SWMC === '简历分发') {
      modalName = 'resumeDestribution';
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
    //打开弹窗
    setModalVisible(p => {
      return {
        ...p,
        [modalName]: true,
      };
    });
    setSwzxid(SWZXID);
  };

  //查看
  const handleCk = (SWMC = '--', SWZXID) => {
    if (SWMC === '需求发起') {
      // modalName = 'demandInitiation';
    } else if (SWMC === '发送确认邮件') {
      // modalName = 'msgConfirmation';
    } else if (SWMC === '简历分发') {
      // modalName = 'resumeDestribution';
    } else if (SWMC === '综合评测安排') {
      //打开弹窗
      setModalVisible(p => {
        return {
          ...p,
          personelArrangement: true,
          personelArrangementUpdate: true,
        };
      });
      setSwzxid(SWZXID);
    } else if (SWMC === '综合评测打分') {
      // modalName = 'interviewScore';
    } else if (SWMC === '提交录用申请') {
      // modalName = 'employmentApplication';
    } else if (SWMC === '录用确认') {
      // modalName = 'offerConfirmation';
    } else if (SWMC === '账号新增') {
      // modalName = 'newAccount';
    }
  };

  const getItemBtn = ({ SWMC = '--', ZXZT = '2' }, SWZXID) => {
    //1 已执行， 2 未执行
    if (
      ['账号新增', '综合评测打分', '发送确认邮件', '简历上传', '简历分发', '提交录用申请'].includes(SWMC) ||
      ZXZT === '2'
    ) {
      return (
        <div className="opr-btn" onClick={() => handleZx(SWMC, ZXZT, SWZXID)}>
          执行
        </div>
      );
    } else if (SWMC === '需求发起') {
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
    } else {
      return (
        <div className="reopr-btn" onClick={() => handleCk(SWMC, SWZXID)}>
          查看
        </div>
      );
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

  return (
    <div className="prj-items-box">
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
