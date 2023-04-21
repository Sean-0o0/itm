import { Breadcrumb, Button, message, Popover, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { EncryptBase64 } from '../../../Common/Encrypt';
import InfoOprtModal from './InfoOprtModal';
import RYZS from '../../../../assets/supplierDetail/overview-ryzs.png';
import JNYZF from '../../../../assets/supplierDetail/overview-jnyzf.png';
import LNYZF from '../../../../assets/supplierDetail/overview-lnyzf.png';
import DataCenter from '../../../../utils/api/dataCenter';
const { Item } = Breadcrumb;
export default function TopConsole(props) {
  const { routes, detailData, GYSLX, getDetailData, splId } = props;
  const {
    splInfo = [],
    overviewInfo = [],
  } = detailData;
  const [visible, setVisible] = useState(false); //弹窗显示
  useEffect(() => {
    return () => {};
  }, []);
  //获取供应商标签
  const getTags = () => {
    //获取供应商标签数据
    let arr = splInfo?.GYSLX?.split(',') || [];
    if (splInfo?.SFHMD === '1') arr.push('黑名单供应商');
    if (splInfo?.SFTT === '1') arr.push('淘汰供应商');
    // console.log('🚀 ~ file: index.js:26 ~ getTags ~ arr:', arr);
    return (
      <div className="prj-tags">
        {arr.map(x => (
          <div className="tag-item" key={x}>
            {x}
          </div>
        ))}
      </div>
    );
  };

  //总览块
  const getOverviewItem = (imgSrc = RYZS, label = '--', value = '--', isImg = true) => {
    return (
      <div className="item" key={label}>
        {isImg ? (
          <img src={imgSrc} alt="" className="left-img" />
        ) : (
          <div className="img-wrapper">
            <i className={'iconfont ' + imgSrc} />
          </div>
        )}
        <div className="right-txt">
          <div className="label">{label}</div>
          {/* <Tooltip title={value} placement="topLeft" > */}
           <span style={{ cursor: 'default' }}> {value}</span>
          {/* </Tooltip> */}
        </div>
      </div>
    );
  };

  return (
    <div className="top-console-box">
      {visible && (
        <InfoOprtModal
          visible={visible}
          setVisible={setVisible}
          oprtType={'UPDATE'}
          detailData={detailData}
          GYSLX={GYSLX}
          getDetailData={getDetailData}
          splId={splId}
        />
      )}
      <Breadcrumb separator=">">
        {routes?.map((item, index) => {
          const { name = item, pathname = '' } = item;
          const historyRoutes = routes.slice(0, index + 1);
          return (
            <Item key={index}>
              {index === routes.length - 1 ? (
                <>{name}</>
              ) : (
                <Link to={{ pathname: pathname, state: { routes: historyRoutes } }}>{name}</Link>
              )}
            </Item>
          );
        })}
      </Breadcrumb>
      <div className="prj-info-row">
        <div className="prj-name">{splInfo.GYSMC}</div>
        <div className="tag-row">
          {getTags()}
          {
            <Button className="btn-edit" onClick={() => setVisible(true)}>
              编辑
            </Button>
          }
        </div>
      </div>
      <div className="overview-row">
        <div className="left-box">
          <div className="title">
            金额总览<span>{moment(overviewInfo.JEZLGXSJ).format('YYYY-MM-DD')}更新</span>
          </div>
          <div className="item-row">
            {getOverviewItem(
              'icon-money-collect',
              '今年项目总额(万元)',
              (Number(overviewInfo.JNXMJE || 0) / 10000).toFixed(2),
              false,
            )}
            {getOverviewItem(
              JNYZF,
              '今年已支付(万元)',
              (Number(overviewInfo.JNYZF || 0) / 10000).toFixed(2),
            )}
            {getOverviewItem(
              LNYZF,
              '历年项目总额(万元)',
              (Number(overviewInfo.LNXMZE || 0) / 10000).toFixed(2),
            )}
          </div>
        </div>
        <div className="right-box">
          <div className="title">
            人力外包总览<span>{moment(overviewInfo.RLFWGXSJ).format('YYYY-MM-DD')}更新</span>
          </div>
          <div className="item-row">
            {getOverviewItem(RYZS, '人员总数', overviewInfo.RYZS || 0)}
            {getOverviewItem(
              'icon-cash',
              '已支付总金额(万元)',
              (Number(overviewInfo.YZFZJE || 0) / 10000).toFixed(2),
              false,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
