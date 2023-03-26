import React, { useEffect, useState } from 'react';
import {
  FetchQueryOwnerWorkflow,
  GetApplyListProvisionalAuth,
} from '../../../../services/pmsServices';
import moment from 'moment';
import { Tooltip } from 'antd';

export default function ProcessCard(props) {
  const {} = props;
  const [processData, setProcessData] = useState([]); //流程情况
  useEffect(() => {
    getProcessData();
    return () => {};
  }, []);
  //获取流程情况
  const getProcessData = () => {
    FetchQueryOwnerWorkflow({
      paging: -1,
      current: 1,
      pageSize: 9999,
      total: -1,
      sort: '',
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ FetchQueryOwnerWorkflow ~ res', res?.record);
          setProcessData(p => [...res?.record]);
        }
      })
      .catch(e => {
        console.error('FetchQueryOwnerWorkflow', e);
      });
  };
  const getProcessItem = ({
    type = '1',
    content = '--',
    date = '--',
    isDone = false,
    key,
    url,
  }) => {
    let backgroundColor = '#FDC041CC';
    if (type.includes('易快报')) {
      backgroundColor = '#05BEFECC';
    }
    if (type.includes('本系统')) {
      backgroundColor = '#3361FFCC';
    }
    return (
      <div className="process-item" key={key}>
        <div className="item-top">
          <div className="left-tag" style={{ backgroundColor }}>
            {type}
          </div>
          <Tooltip title={content}>
            <div
              className="content"
              onClick={() => {
                if (url.includes('YKB:')) {
                  const arr = url.split(',');
                  const id = arr[0].split(':')[1];
                  const userykbid = arr[1];
                  GetApplyListProvisionalAuth({
                    id,
                    userykbid,
                  })
                    .then(res => {
                      window.open(res.url);
                    })
                    .catch(e => console.error('GetApplyListProvisionalAuth', e));
                } else {
                  //OA流程
                  window.open(url);
                }
              }}
            >
              {content}
            </div>
          </Tooltip>
        </div>
        {isDone && (
          <div className="right-tag">
            <i className="iconfont fill-success" />
            已完成
          </div>
        )}
        发起日期：{date}
      </div>
    );
  };
  return (
    <div className="process-card-box">
      <div className="home-card-title-box">流程情况</div>
      <div className="process-box">
        {processData?.map((item, index) =>
          getProcessItem({
            type: item.type,
            content: item.subject,
            date: moment(item.startdate).format('YYYY-MM-DD'),
            isDone: item.type === '本系统' ? item.state === '2' : item.state === '4',
            key: index,
            url: item.url,
          }),
        )}
      </div>
    </div>
  );
}
