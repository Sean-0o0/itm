import React, { useEffect, useState } from 'react';
import {
  CreateOperateHyperLink,
  FetchQueryOwnerWorkflow,
  GetApplyListProvisionalAuth,
} from '../../../../services/pmsServices';
import moment from 'moment';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import { Empty, message, Tooltip, Icon } from 'antd';

export default function ProcessCard(props) {
  const { processData, total } = props;
  const [processDataList, setProcessDataList] = useState([]); //流程情况 - 展示
  const [isUnfold, setIsUnfold] = useState(false); //是否展开
  const [xwhyaModalVisible, setXwhyaModalVisible] = useState(false); //信委会议案弹窗显隐
  const [lbModalUrl, setLbModalUrl] = useState('#'); //弹窗链接
  const [lbModalTitle, setLbModaolTitle] = useState('操作'); //弹窗标题
  const [allPrc, setAllPrc] = useState([]); //全部流程
  const [isLoading, setIsLoading] = useState(false); //查询全部数据时加载状态
  const Loginname = String(JSON.parse(sessionStorage.getItem('user')).loginName);

  useEffect(() => {
    if (processData.length !== 0) {
      setProcessDataList(p => [...processData?.slice(0, 3)]);
      setIsUnfold(false);
    }
    return () => {};
  }, [props]);

  //Livebos弹窗参数
  const getParams = (objName, oprName, data) => {
    return {
      attribute: 0,
      authFlag: 0,
      objectName: objName,
      operateName: oprName,
      parameter: data,
      userId: Loginname,
    };
  };

  //获取Livebos弹窗链接
  const getLink = (params, fn) => {
    CreateOperateHyperLink(params)
      .then((ret = {}) => {
        const { code, message, url } = ret;
        if (code === 1) {
          fn(url);
        }
      })
      .catch(error => {
        console.error(!error.success ? error.message : error.note);
        message.error('链接获取失败', 1);
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
      <div
        className="process-item"
        key={key}
        onClick={() => {
          if (type === '本系统') {
            let params = getParams('LC_XWHYALC', 'TrackWork', [
              {
                name: 'ID',
                value: Number(url),
              },
            ]);
            setXwhyaModalVisible(true);
            getLink(params, setLbModalUrl);
            return;
          } else if (url.includes('YKB:')) {
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
              .catch(e => {
                console.error('GetApplyListProvisionalAuth', e);
                message.error('链接跳转失败', 1);
              });
          } else {
            //OA流程
            window.open(url);
          }
        }}
      >
        <div className="item-top">
          <div className="left-tag" style={{ backgroundColor }}>
            {type}
          </div>
          <Tooltip title={content}>
            <div className="content">{content}</div>
          </Tooltip>
        </div>
        {isDone && (
          <div className="right-tag">
            <i className="iconfont fill-success" />
            已完成
          </div>
        )}
        {isDone ? '结束' : '发起'}日期：{date}
      </div>
    );
  };
  //展开、收起
  const handleUnfold = bool => {
    if (bool) {
      // if (allPrc.length === 0) {
      setIsLoading(true);
      FetchQueryOwnerWorkflow({
        paging: -1,
        current: 1,
        pageSize: 9999,
        total: -1,
        sort: '',
      })
        .then(res => {
          if (res?.success) {
            setProcessDataList(p => [...res?.record]);
            setAllPrc(p => [...res?.record]);
            setIsLoading(false);
            setIsUnfold(bool);
          }
        })
        .catch(e => {
          console.error('FetchQueryOwnerWorkflow', e);
          message.error('流程情况信息查询失败', 1);
        });
      // } else {
      //   setProcessDataList(p => [...allPrc]);
      //   setIsUnfold(bool);
      // }
    } else {
      setProcessDataList(p => [...processData?.slice(0, 3)]);
      setIsUnfold(bool);
    }
  };
  //信委会立案流程查看
  const xwhyaModalProps = {
    isAllWindow: 1,
    title: '信委会立案流程查看',
    width: '800px',
    height: '600px',
    style: { top: '60px' },
    visible: xwhyaModalVisible,
    footer: null,
  };

  if (total === 0) return null;
  return (
    <div className="process-card-box">
      {/* 信委会立案流程查看 */}
      {xwhyaModalVisible && (
        <BridgeModel
          modalProps={xwhyaModalProps}
          onCancel={() => setXwhyaModalVisible(false)}
          // onSucess={this.OnSuccess}
          src={lbModalUrl}
        />
      )}
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
        {/* {total === 0 && (
          <Empty
            description="暂无流程"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ width: '100%' }}
          />
        )} */}
        {total > 3 &&
          (isUnfold ? (
            <div className="more-item" onClick={() => handleUnfold(false)}>
              收起
              <i className="iconfont icon-up" />
            </div>
          ) : (
            <div className="more-item" onClick={() => handleUnfold(true)}>
              更多
              {isLoading ? <Icon type="loading" /> : <i className="iconfont icon-down" />}
            </div>
          ))}
      </div>
    </div>
  );
}
