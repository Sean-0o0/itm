import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Button, message, Progress } from 'antd';
import moment from 'moment';

export default function PaymentRecord(props) {
  const { prjData = {} } = props;
  const { paymentRecord = [] } = prjData;
  const [dataShow, setDataShow] = useState([]); //展示用
  const [isUnfold, setIsUnfold] = useState(false); //是否展开

  useEffect(() => {
    if (paymentRecord.length > 0) {
      setDataShow([...paymentRecord.slice(0, 5)]);
      setIsUnfold(false);
    }
    return () => {};
  }, [JSON.stringify(paymentRecord)]);

  const getRecordItem = ({ FKJE = 0, KZXYS = 0, XMNF = '--' }, index) => {
    const isCurYear = index === 0;
    const isLastYear = index === paymentRecord.length - 1;
    const rate =
      Number(KZXYS) !== 0 ? Number(parseFloat((Number(FKJE) * 100) / Number(KZXYS)).toFixed(2)) : 0;
    const YOY = isLastYear
      ? 0
      : Number(parseFloat(Number(FKJE) - Number(paymentRecord[index + 1]?.FKJE)).toFixed(2));
    return (
      <div className="item" key={XMNF}>
        <div className="year-row">{XMNF}</div>
        {isCurYear && (
          <div className="progress-row">
            <div className="progress-top">
              执行率
              <span>{rate}%</span>
            </div>
            <Progress
              showInfo={false}
              percent={Number(rate)}
              strokeColor={{
                from: '#83AFFE',
                to: '#527EFD',
              }}
              strokeWidth={10}
            />
          </div>
        )}
        <div className="amount-row">
          <div className="amount-left">
            付款金额
            <div>{FKJE}</div>
          </div>
          <div className="amount-right">
            预算可执行金额
            <div>{KZXYS}</div>
          </div>
        </div>
        {isCurYear && YOY !== 0 && (
          <div className="YOY">
            同比
            <span style={YOY > 0 ? { color: '#ff2f31' } : {}}>
              {YOY > 0 ? (
                <i className="iconfont icon-fill-up" />
              ) : (
                <i className="iconfont icon-fill-down" />
              )}
              {Math.abs(YOY)}
            </span>
          </div>
        )}
      </div>
    );
  };

  //展开、收起
  const handleUnfold = (bool = true) => {
    setIsUnfold(bool);
    if (bool) {
      setDataShow([...paymentRecord]);
    } else {
      setDataShow([...paymentRecord.slice(0, 5)]);
    }
  };

  if (paymentRecord.length === 0) return null;
  return (
    <div className="payment-record-box">
      <div className="top-title">
        迭代付款记录
        <span>单位：万元</span>
      </div>
      <div className="content">
        {dataShow.map((x, i) => getRecordItem(x, i))}
        {paymentRecord.length > 5 &&
          (isUnfold ? (
            <Fragment>
              <div className="more-item-unfold" onClick={() => handleUnfold(false)}>
                收起
                <i className="iconfont icon-up" />
              </div>
            </Fragment>
          ) : (
            <div className="more-item" onClick={handleUnfold}>
              展开
              <i className="iconfont icon-down" />
            </div>
          ))}
      </div>
    </div>
  );
}
