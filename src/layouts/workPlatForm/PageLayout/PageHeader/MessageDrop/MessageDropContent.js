import { Empty, Spin, Form, Input, message } from 'antd';
import { EncryptBase64 } from '../../../../../components/Common/Encrypt';
import { history } from 'umi';
import BasicModal from '../../../../../components/Common/BasicModal';
import { Fragment, useState } from 'react';
// import { FetchMonitorRemindTreatment } from '../../../../../services/fma/assetConfig';

export default function MessageDropContent({ data = [], loading = false, clCode, setVisible, QRY_SQL_ID }) {

  const [selectedRow, setSelectedRow] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [remindModalVisible, setRemindModalVisible] = useState(false);
  const [execNote, setExecNote] = useState('');

  // 查看全部的url
  const pushAllMsgPage = (clCode) => {
    const params = { execSt: '0' , strtDt: '' ,endDt: '', tgtTp: clCode };
    let url = `/fma/assetConfig/riskManagement/riskmonitor/${EncryptBase64(JSON.stringify(params))}`;
    if(clCode === '7' || clCode === '8') {
      url = `/fma/assetConfig/riskManagement/complianceRiskMonitor/${EncryptBase64(JSON.stringify(params))}`;
    }
    setVisible(false);
    history.push(url);
  };

  // 打开提醒处理弹框
  const openRemindModal = (item) => {
    setSelectedRow(item);
    setRemindModalVisible(true);
  };

  // 处理提醒
  const handleRemind = async () => {
    const rmndId = {
      QRY_SQL_ID,
      WTHR_ALL: '0',
      CHC_ID: selectedRow.rmndId,
    };
    const params = {
      execSt: '1',
      execNote,
      rmndId: JSON.stringify(rmndId),
    };
    // try {
    //   setBtnLoading(true);
    //   const { note, code } = await FetchMonitorRemindTreatment(params);
    //   if(code === 1) {
    //     message.success(note);
    //     setSelectedRow(null);
    //     setRemindModalVisible(false);
    //     setVisible(false);
    //   }
    //   setBtnLoading(false);
    // } catch (e) {
    //   setBtnLoading(false);
    //   message.error(!e.success ? e.message : e.note);
    // }
  };

  return (
    <Fragment>
      <div style={{ padding: '1rem', marginTop: '-20px' }}>
        <Spin spinning={loading}>
          {
            data.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无未读消息" />
              : data.filter((_, i) => i < 3).map((item = {}, index) => {
                return (
                  <div className="dis-fx alc" style={{ padding: '0.333rem 1rem' }}>
                    <div className="flex tl inoneline" style={{ marginRight: '1rem' }}>
                      <a className="m-link" onClick={() => openRemindModal(item)}>{item.rmndSbj}</a>
                    </div>
                    <div>{item.crtTm.substr(0, 10)}</div>
                  </div>
                );
              })
          }
        </Spin>
        <div style={{ textAlign: 'center', marginTop: '.5rem' }}>
          <a className="m-headColor" onClick={() => pushAllMsgPage(clCode)}  >查看全部 &gt;&gt;</a>
        </div>
      </div>
      {
        remindModalVisible && (
          <BasicModal
            title="提醒处理"
            visible={remindModalVisible}
            onCancel={() => { setRemindModalVisible(false); setSelectedRow(null); }}
            onOk={handleRemind}
            confirmLoading={btnLoading}
          >
            <Form className="m-form" style={{ padding: '20px', margin: 0 }}>
              <div className="dis-fx mb10"><span className="tr" style={{ minWidth: 100 }}>标题：</span><div>{selectedRow?.rmndSbj}</div></div>
              <div className="dis-fx mb10"><span className="tr" style={{ minWidth: 100 }}>内容：</span><div>{selectedRow?.rmndCntnt}</div></div>
              <div className="dis-fx mb10">
                <span className="tr" style={{ minWidth: 100 }}>处理说明：</span>
                <div style={{ width: 400 }}>
                  <Input.TextArea onInput={e => setExecNote(e.target.value)} value={execNote} autoSize={{ minRows: 4, maxRows: 6 }} />
                </div>
              </div>
            </Form>
          </BasicModal>
        )
      }
    </Fragment>
  );
}
