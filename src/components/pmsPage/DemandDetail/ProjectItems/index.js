import React, { useEffect, useState, useRef } from 'react';
import { Button, Tooltip } from 'antd';
import moment from 'moment';
import ResumeDestributionModal from './ResumeDestributionModal';
import PersonnelArrangementModal from './PersonnelArrangementModal';

export default function ProjectItems(props) {
  const { dtlData = {} } = props;
  const { XQXQ = [], FKTX = {}, JLXX = [], RYXQ = [] } = dtlData;
  const [modalVisible, setModalVisible] = useState({
    resumeDestribution: false,
    personelArrangement: false,
  }); //弹窗显隐

  useEffect(() => {
    return () => {};
  }, []);

  const handleZx = (SXMC = '--', ZXZT = '2') => {
    if (SXMC === '简历分发') {
      setModalVisible(p => {
        return {
          ...p,
          resumeDestribution: true,
        };
      });

      return;
    }
    if (SXMC === '综合评测安排') {
      setModalVisible(p => {
        return {
          ...p,
          personelArrangement: true,
        };
      });
      return;
    }
  };

  const getItemBtn = ({ SXMC = '--', ZXZT = '2' }) => {
    if (['账号新增', '综合评测打分', '发送确认邮件'].includes(SXMC) || ZXZT === '2') {
      return (
        <div className="opr-btn" onClick={() => handleZx(SXMC, ZXZT)}>
          执行
        </div>
      );
    } else if (SXMC === '需求发起') {
      return <div className="reopr-btn">重新发起</div>;
    } else {
      return <div className="reopr-btn">查看</div>;
    }
  };

  return (
    <div className="prj-items-box">
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
        />
      )}
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
          RYXQ={RYXQ}
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
        {XQXQ.map(item => (
          <div className="item" key={item.SXLX}>
            <div className="item-top">{item.SXLX}</div>
            <div className="item-bottom">
              {item.SXDATA.map((x, i) => (
                <div
                  className="bottom-row"
                  style={x.ZXZT === '2' ? {} : { color: '#3361ff' }}
                  key={i}
                >
                  {x.ZXZT === '2' ? (
                    <i className="iconfont circle-reduce" />
                  ) : (
                    <i className="iconfont circle-check" />
                  )}
                  <Tooltip title={x.SXMC} placement="topLeft">
                    <span>{x.SXMC}</span>
                  </Tooltip>
                  {getItemBtn(x)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
