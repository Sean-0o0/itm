import React, { useEffect, useState } from 'react';
import { Button, Table, message, Modal, Spin, Tooltip, Empty } from 'antd';
import moment from 'moment';
import { FinishProject, QueryUndoMatters } from '../../../../../services/pmsServices';

export default function PrjFinishModal(props) {
  const { visible, setVisible, data = {} } = props;
  const { xmid, xmjd, contrastArr = [], refresh } = data;
  const [tableData, setTableData] = useState([]); //未完成事项
  const [isSpinning, setIsSpinning] = useState(false); //加载状态

  useEffect(() => {
    if (visible) {
      getUndoMatters(xmid);
    }
    return () => {};
  }, [visible, xmid]);

  //查询未完成事项
  const getUndoMatters = () => {
    setIsSpinning(true);
    QueryUndoMatters({
      projectId: xmid,
    })
      .then(res => {
        if (res.success) {
          const data = JSON.parse(res.result).flatMap(
            ({ JSSJ, ZXXH, matters, KSSJ, LCBZXID, LCBMC }) =>
              matters.map(({ SWLX, ID, SXMC }) => ({
                JSSJ,
                ZXXH,
                KSSJ,
                LCBZXID,
                LCBMC,
                SWLX,
                ID,
                SXMC,
              })),
          );
          setTableData(data);
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('QueryUndoMatters', e);
        setIsSpinning(false);
      });
  };

  const columns = [
    {
      title: '里程碑',
      dataIndex: 'LCBMC',
      width: '31%',
      key: 'LCBMC',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '里程碑时间',
      dataIndex: 'KSSJ',
      width: '38%',
      key: 'KSSJ',
      ellipsis: true,
      render: (txt, row) =>
        row.SXMC === '付款流程'
          ? '-'
          : (txt ? moment(String(txt)).format('YYYY.MM.DD') : '') +
            ' ~ ' +
            (row.JSSJ ? moment(String(row.JSSJ)).format('YYYY.MM.DD') : ''),
    },
    {
      title: '未完成事项',
      dataIndex: 'SXMC',
      width: '31%',
      key: 'SXMC',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
  ];

  //允许完结
  const allowFinish = () => {
    const paymentFinish =
      contrastArr.reduce((acc, cur) => (cur.HTJE === cur.YFKJE ? 0 : 1) + acc, 0) === 0;
    return String(xmjd) === '100' && paymentFinish;
  };

  //多合同信息
  const getHtxxInfoRow = (contrastArr = []) => {
    const suffix = i => (contrastArr.length > 1 ? '-' + (i + 1) + '：' : '：'); //是否多合同，后缀
    //获取信息块
    const getInfoItem = (label, val, isLink = false) => {
      return (
        <div className="info-item" key={label}>
          <span>{label}</span>
          {isLink ? <a style={{ color: '#3361ff' }}>{val}</a> : val}
        </div>
      );
    };
    //金额格式化
    const getAmountFormat = value => {
      if ([undefined, null, '', ' ', NaN].includes(value)) return '';
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    return contrastArr.map((x, i) => (
      <div className="htxx-info-row-box" key={x.ID}>
        {x.HTJE && getInfoItem('合同金额' + suffix(i), getAmountFormat(x.HTJE) + '元')}
        {x.YFKJE && getInfoItem('已付款金额' + suffix(i), getAmountFormat(x.YFKJE) + '元')}
      </div>
    ));
  };

  //提交数据
  const onOk = () => {
    Modal.confirm({
      title: '提示：',
      content: `是否确定完结该项目？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setIsSpinning(true);
        FinishProject({
          finishDate: Number(moment().format('YYYYMMDD')),
          projectId: Number(xmid),
        })
          .then(res => {
            if (res?.success) {
              refresh();
              setIsSpinning(false);
              setVisible(false);
            }
          })
          .catch(e => {
            console.error('🚀项目完结', e);
            message.error('完结失败', 1);
            setIsSpinning(false);
          });
      },
    });
  };

  //取消
  const onCancel = () => {
    setVisible(false);
  };

  //弹窗参数
  const modalProps = {
    wrapClassName: 'prj-finish-modal',
    width: 600,
    maskClosable: false,
    style: { top: 10 },
    maskStyle: { backgroundColor: 'rgb(0 0 0 / 30%)' },
    zIndex: 103,
    title: null,
    visible,
    onCancel,
    onOk,
    footer: allowFinish() ? undefined : null,
  };

  return (
    <Modal {...modalProps}>
      <div className="body-title-box">
        <strong>项目完结</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <div className="content-box">
          <div className="prj-rate-row">
            项目进度：<span>{xmjd}%</span>
          </div>
          <div className="table-row">
            <div className="table-title">
              以下事项还未完成
              <span>（事项全部完成后且付款金额等于合同金额时，可进行项目完结）</span>：
            </div>
            {tableData.length > 0 ? (
              <Table
                columns={columns}
                rowKey={'ID'}
                dataSource={tableData}
                pagination={false}
                bordered
              />
            ) : (
              <div className="table-finish">恭喜您，所有的项目事项都已完成！</div>
            )}
          </div>
          {contrastArr.length > 0 && (
            <div className="payment-row">
              <div className="payment-title">付款情况：</div>
              {getHtxxInfoRow(contrastArr)}
            </div>
          )}
        </div>
      </Spin>
    </Modal>
  );
}
