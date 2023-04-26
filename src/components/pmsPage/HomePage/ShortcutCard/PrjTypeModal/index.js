import React, { useEffect, useState, useRef } from 'react';
import { Button, Empty, Icon, Modal, Spin } from 'antd';
import moment from 'moment';
import { FetchQueryProjectLabel } from '../../../../../services/projectManage';

export default function PrjTypeModal(props) {
  const { visible, setVisible, setFileAddVisible } = props;
  const [typeData, setTypeData] = useState([]); //项目类型
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  useEffect(() => {
    setIsSpinning(true);
    FetchQueryProjectLabel({})
      .then(res => {
        if (res?.success) {
          console.log('🚀 ~ FetchQueryProjectLabel ~ res', JSON.parse(res.xmlxRecord));
          setTypeData(p => [
            ...JSON.parse(res.xmlxRecord).filter(x => !['0', '1'].includes(x.GRADE)),
          ]);
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('FetchQueryProjectLabel', e);
      });

    return () => {};
  }, []);

  const newProject = () => {
    setVisible(false);
    setFileAddVisible(true);
  };

  return (
    <Modal
      wrapClassName="editMessage-modify prj-type-modal"
      width={'880px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      centered
      title={null}
      footer={null}
      visible={visible}
      onCancel={() => setVisible(false)}
    >
      <div className="body-title-box" style={{ fontSize: '16px' }}>
        <strong>点击想要创建的项目类型</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中" size="large" wrapperClassName="prj-type-modal-spin">
        {typeData.map(x => (
          <div className="type-item" key={x.id} onClick={newProject}>
            <div className="title">
              <Icon type="pushpin" className="item-icon" />
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
            {/* <div className="footer-btn" onClick={newProject}>
              新建项目
            </div> */}
          </div>
        ))}
      </Spin>
    </Modal>
  );
}
