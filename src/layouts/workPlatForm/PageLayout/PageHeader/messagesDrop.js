import React, { useState, useEffect } from 'react';
import { Card, Tabs, Badge, message, Icon } from 'antd';
import DropdownBox from '../../../../components/Common/DropdownBox';
import MessageDropContent from './MessageDrop/MessageDropContent';
// import { FetchQueryMonitorRemind } from '../../../../services/fma/assetConfig';

export default function MessagesDrop() {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [unreadMsgConf, setUnreadMsgConf] = useState([
    { clCode: '4', clName: '策略配置', evntNum: 0, data: [] },
    { clCode: '5', clName: '组合配置', evntNum: 0, data: [] },
    { clCode: '6', clName: '产品研究', evntNum: 0, data: [] },
    { clCode: '7', clName: '客户运营', evntNum: 0, data: [] },
    { clCode: '8', clName: '组合运营', evntNum: 0, data: [] },
  ]);

  useEffect(() => {
    getMsgNum();
    const timer = setInterval(getMsgNum, 3 * 60 * 1000);
    return () => {
      clearInterval(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMsgNum = async () => {
    try {
      setLoading(true);
      // const resultList = await Promise.all(unreadMsgConf.map(({ clCode }) => FetchQueryMonitorRemind({ tgtTp: clCode, execSt: 0, paging: 1, current: 1, pageSize: 3, sort: '', total: '-1' })));
      const resultList = [];
      const newUnreadMsgConf = resultList.map(({ records, total, note }, index) => {
        return {
          ...unreadMsgConf[index],
          data: records,
          evntNum: total,
          QRY_SQL_ID: note.split('|')[0],
        };
      });
      setUnreadMsgConf(newUnreadMsgConf);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(!error.success ? error.message : error.note);
    }
  };

  const toggleDropdown = () => {
    if(visible) {
      setVisible(false);
    } else {
      setVisible(true);
      getMsgNum();
    }
  };

  return (
    <DropdownBox
      id="message"
      title={
        <div className="tc" style={{ width: '4rem' }}>
          <a onClick={toggleDropdown} style={{ position: 'relative', top: '4px' }}>
            <Badge style={{ right: '-8px' }} count={unreadMsgConf.reduce((count, { evntNum }) => count + evntNum, 0)} showZero><Icon type="bell" style={{ fontSize: '2.333rem' }} /></Badge>
          </a>
        </div>
      }
      visible={visible}
      onVisibleChange={setVisible}
      dropbox={
        <Card
          className="m-card default"
          style={{ width: 400 }}
        >
          {
            unreadMsgConf.length > 0 && (
              <Tabs className="c-tabs" >
                {
                  unreadMsgConf.map((item) => {
                    const { evntNum = 0, clName = '', clCode = '', data = [], QRY_SQL_ID } = item;
                    return (
                      <Tabs.TabPane
                        key={clCode}
                        tab={(
                          <Badge
                            count={evntNum}
                            style={{ height: '1rem', minWidth: '1rem', lineHeight: '1rem', fontSize: '.8rem', right: '-.8rem' }}
                          >
                            <span style={{ padding: '1rem' }}>{clName}</span>
                          </Badge>
                        )}
                      >
                        <MessageDropContent 
                          data={data} 
                          loading={loading} 
                          clCode={clCode} 
                          setVisible={setVisible} 
                          QRY_SQL_ID={QRY_SQL_ID}
                        />
                      </Tabs.TabPane>
                    );
                  })
                }
              </Tabs>
            )
          }
        </Card>
      }
    />
  );
}
