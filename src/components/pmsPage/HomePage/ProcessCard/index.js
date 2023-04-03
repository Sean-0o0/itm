import React, { useEffect, useState } from 'react';
import { GetApplyListProvisionalAuth } from '../../../../services/pmsServices';
import moment from 'moment';
import { Empty, Tooltip } from 'antd';

export default function ProcessCard(props) {
  const { processData } = props;
  const [processDataList, setProcessDataList] = useState([]); //流程情况 - 展示
  const [isUnfold, setIsUnfold] = useState(false); //是否展开

  useEffect(() => {
    if (processData.length !== 0) {
      setProcessDataList(p => [...processData?.slice(0, 3)]);
      setIsUnfold(false);
    }
    return () => {};
  }, [props]);

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
  //展开、收起
  const handleUnfold = bool => {
    setIsUnfold(bool);
    if (bool) setProcessDataList(p => [...processData]);
    else setProcessDataList(p => [...processData?.slice(0, 3)]);
  };
  return (
    <div className="process-card-box">
      <div className="home-card-title-box">流程情况</div>
      <div className="process-box">
        {processDataList?.map((item, index) =>
          getProcessItem({
            type: item.type,
            content: item.subject,
            date: moment(item.startdate).format('YYYY-MM-DD'),
            isDone: item.type === '本系统' ? item.state === '2' : item.state === '4',
            key: index,
            url: item.url,
          }),
        )}
        {processDataList?.length === 0 && (
          <Empty
            description="暂无待办事项"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ width: '100%' }}
          />
        )}
        {processData?.length > 3 &&
          (isUnfold ? (
            <div className="more-item" onClick={() => handleUnfold(false)}>
              收起
              <i className="iconfont icon-up" />
            </div>
          ) : (
            <div className="more-item" onClick={() => handleUnfold(true)}>
              更多
              <i className="iconfont icon-down" />
            </div>
          ))}
      </div>
    </div>
  );
}
