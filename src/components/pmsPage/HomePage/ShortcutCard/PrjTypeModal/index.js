import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Button, Empty, Icon, Modal, Spin, message } from 'antd';
import moment from 'moment';
import { EncryptBase64 } from '../../../../Common/Encrypt';
import { FetchQueryProjectLabel } from '../../../../../services/projectManage';
import SinglePaymentModal from '../SinglePaymentModal';

export default function PrjTypeModal(props) {
  const {
    visible,
    setVisible,
    setFileAddVisible,
    setSrc_fileAdd,
    fromHome = false,
    refresh,
  } = props;
  const [typeData, setTypeData] = useState([]); //项目类型
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [singlePaymentVisible, setSinglePaymentVisible] = useState(false); //单费用付款弹窗显隐
  useEffect(() => {
    setIsSpinning(true);
    if (visible) {
      FetchQueryProjectLabel({})
        .then(res => {
          if (res?.success) {
            let data = JSON.parse(res.xmlxRecord).filter(x => !['0', '1'].includes(x.GRADE));
            // console.log('🚀 ~ file: index.js:17 ~ useEffect ~ data:', data);
            setTypeData(p => [...data]);
            setIsSpinning(false);
          }
        })
        .catch(e => {
          console.error('FetchQueryProjectLabel', e);
          message.error('项目类型查询失败', 1);
        });
    }
    return () => {};
  }, [visible]);

  const newProject = projectType => {
    if (String(projectType) === '17') {
      //单费用付款
      setSinglePaymentVisible(true);
    } else {
      setSrc_fileAdd(
        // `/#/single/pms/SaveProject/${EncryptBase64(
        //   JSON.stringify({ xmid: -1, projectType }),
        // )}`,
        { xmid: -1, type: fromHome, projectType },
      );
      setFileAddVisible(true);
    }
    setVisible(false);
  };

  //flex列表尾部占位置的空标签，处理justify-content对齐问题
  const getAfterItem = width => {
    let arr = [];
    for (let i = 0; i < 4; i++) {
      //每行最多n=4个
      arr.push('');
    }
    return arr.map((x, k) => <i key={k} style={{ width }} />);
  };

  return (
    <Fragment>
      <Modal
        wrapClassName="editMessage-modify prj-type-modal"
        width={'980px'}
        maskClosable={false}
        destroyOnClose={true}
        zIndex={100}
        maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
        style={{ top: '10px' }}
        title={null}
        footer={null}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <div className="body-title-box" style={{ fontSize: '16px' }}>
          <strong>选择项目类型</strong>
        </div>
        <Spin
          spinning={isSpinning}
          tip="加载中"
          size="large"
          wrapperClassName="prj-type-modal-spin"
        >
          {typeData.map((x, i) => (
            <div className="type-item" key={x.ID} onClick={() => newProject(x.ID)}>
              <div className="title">
                {/* <Icon type="pushpin" className="item-icon" /> */}
                {/* <div className="item-icon">{i + 1}</div> */}
                <div className="left-bar"></div>
                {x.NAME || '--'}
              </div>
              <div className="desc">
                {x.SM || (
                  <div className="desc-empty">
                    <Empty
                      description="暂无描述"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
              </div>
              <div className="footer-btn">新建项目</div>
            </div>
          ))}
          {getAfterItem('23.5%')}
        </Spin>
      </Modal>
      <SinglePaymentModal
        visible={singlePaymentVisible}
        setVisible={setSinglePaymentVisible}
        type="ADD"
        refresh={refresh}
      />
    </Fragment>
  );
}
