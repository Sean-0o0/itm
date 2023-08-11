import React, { useEffect, useState, useRef } from 'react';
import { Button, Tooltip, Table, Popover } from 'antd';
import moment from 'moment';
import config from '../../../../utils/config';
import axios from 'axios';

const { api } = config;
const {
  pmsServices: { queryFileStream, zipLivebosFilesRowsPost },
} = api;

export default function DemandTable(props) {
  const { dtlData = {}, fqrid, setIsSpinning, isDock, xqid } = props;
  const { XQNR = [], XQSX_ORIGIN = [], JLXX = [], XQXQ = [], XMXX = {} } = dtlData;
  let LOGIN_USER_ID = String(JSON.parse(sessionStorage.getItem('user'))?.id);
  useEffect(() => {
    return () => {};
  }, []);

  const getDateItem = (label, date) => {
    return (
      <div className="date-item" key={label}>
        <span>{label}</span>
        {moment(date).format('YYYY-MM-DD')}
      </div>
    );
  };
  //批量下载
  // const batchDownload = (arr = [], prefix = '') => {
  //   let param = {
  //     objectName: 'TWBXQ_JLSC',
  //     columnName: 'JL',
  //     title: prefix + XQXQ.find(xq => xq.XQID === xqid)?.XQMC + '.zip',
  //   };
  //   let attBaseInfos = arr.reduce(
  //     (acc, cur) => [
  //       ...acc,
  //       {
  //         id: cur.ENTRYNO,
  //         rowid: cur.JLID,
  //         title: cur.JLMC,
  //       },
  //     ],
  //     [],
  //   );
  //   param.attBaseInfos = attBaseInfos;
  //   axios({
  //     method: 'POST',
  //     url: zipLivebosFilesRowsPost,
  //     responseType: 'blob',
  //     data: param,
  //   })
  //     .then(res => {
  //       const href = URL.createObjectURL(res.data);
  //       const a = document.createElement('a');
  //       a.download = prefix + XQXQ.find(xq => xq.XQID === xqid)?.XQMC + '.zip';
  //       a.href = href;
  //       a.click();
  //     })
  //     .catch(err => {
  //       message.error('下载失败', 1);
  //     });
  // };

  // //单个下载
  // const singleDownload = (id, fileName, entryno) => {
  //   setIsSpinning(true);
  //   axios({
  //     method: 'POST',
  //     url: queryFileStream,
  //     responseType: 'blob',
  //     data: {
  //       objectName: 'TWBXQ_JLSC',
  //       columnName: 'JL',
  //       id,
  //       title: fileName,
  //       extr: entryno,
  //       type: '',
  //     },
  //   })
  //     .then(res => {
  //       const href = URL.createObjectURL(res.data);
  //       const a = document.createElement('a');
  //       a.download = fileName;
  //       a.href = href;
  //       a.click();
  //       window.URL.revokeObjectURL(a.href);
  //       setIsSpinning(false);
  //     })
  //     .catch(err => {
  //       setIsSpinning(false);
  //       message.error('简历下载失败', 1);
  //     });
  // };

  // const batchDownloadContent = (arr = [], wdid) => {
  //   console.log('🚀 ~ file: index.js:94 ~ DemandTable ~ arr:', arr);
  //   return (
  //     <div className="fj-box">
  //       <div className="fj-header">
  //         <div className="fj-title flex1">附件</div>
  //         {arr.length > 0 && (
  //           <div className="fj-header-btn" onClick={() => batchDownload(arr, wdid)}>
  //             全部下载
  //           </div>
  //         )}
  //       </div>
  //       {
  //         <div style={{ height: 'auto', width: 320 }}>
  //           {arr.map(x => {
  //             return (
  //               <div
  //                 className="item"
  //                 key={x.ENTRYNO + x.JLMC + x.JLID}
  //                 onClick={() => singleDownload(x.JLID, x.JLMC, x.ENTRYNO)}
  //               >
  //                 {x.JLMC}
  //               </div>
  //             );
  //           })}
  //         </div>
  //       }
  //       {arr.length === 0 && (
  //         <div className="empty-box">
  //           <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无风险信息" />
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  const columns = [
    {
      title: '人员需求',
      dataIndex: 'RYDJ',
      width: '10%',
      key: 'RYDJ',
      ellipsis: true,
      render: (txt, row) => {
        return (
          <Tooltip title={txt + ` | ` + row.GW} placement="topLeft">
            <span style={{ cursor: 'default' }}>{txt + ` | ` + row.GW}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '人员数量',
      dataIndex: 'RYSL',
      width: '10%',
      align: 'right',
      key: 'RYSL',
      ellipsis: true,
    },
    {
      title: '人员时长(人/月)',
      dataIndex: 'SC',
      width: '12%',
      align: 'right',
      key: 'SC',
      ellipsis: true,
    },
    {
      title: '需求内容',
      dataIndex: 'YQ',
      key: 'YQ',
      ellipsis: true,
      render: text => (
        <Tooltip
          title={text?.replace(/<br>/g, '\n')}
          placement="topLeft"
          overlayClassName="pre-wrap-tooltip"
        >
          <span style={{ cursor: 'default' }}>{text?.replace(/<br>/g, '')}</span>
        </Tooltip>
      ),
    },
    {
      title: '备注',
      dataIndex: 'BZ',
      key: 'BZ',
      ellipsis: true,
      render: text => (
        <Tooltip
          title={text?.replace(/<br>/g, '\n')}
          placement="topLeft"
          overlayClassName="pre-wrap-tooltip"
        >
          <span style={{ cursor: 'default' }}>{text?.replace(/<br>/g, '')}</span>
        </Tooltip>
      ),
    },
    {
      title: '预估预算(元)',
      dataIndex: 'YGYS',
      width: '10%',
      align: 'right',
      key: 'YGYS',
      ellipsis: true,
    },
    {
      title: '简历信息',
      dataIndex: 'JLDATA',
      key: 'JLDATA',
      width:
        (String(fqrid) === LOGIN_USER_ID //发起人
        || isDock  //外包项目对接人
        // ||XMXX.XMJLID === LOGIN_USER_ID //项目经理
        ) && 
        JLXX.length !== 0 && //简历信息不为空
        XQSX_ORIGIN.filter(x => x.SWMC === '简历查看')[0]?.ZXZT === '1' //且 简历查看 已执行
          ? '10%'
          : 0,
      align: 'center',
      ellipsis: true,
      render: (arr, row) => {
        const handleFilePreview = (id, fileName, entryno) => {
          setIsSpinning(true);
          axios({
            method: 'POST',
            url: queryFileStream,
            responseType: 'blob',
            data: {
              objectName: 'TWBXQ_JLSC',
              columnName: 'JL',
              id,
              title: fileName,
              extr: entryno,
              type: '',
            },
          })
            .then(res => {
              const href = URL.createObjectURL(res.data);
              const a = document.createElement('a');
              a.download = fileName;
              a.href = href;
              a.click();
              window.URL.revokeObjectURL(a.href);
              setIsSpinning(false);
            })
            .catch(err => {
              setIsSpinning(false);
              message.error('简历下载失败', 1);
            });
        };
        const popoverContent = (data = []) => (
          <div className="list">
            {data.map(x => (
              <div
                className="item"
                key={x.ENTRYNO + x.JLMC + x.JLID}
                onClick={() => handleFilePreview(x.JLID, x.JLMC, x.ENTRYNO)}
              >
                <a style={{ color: '#3361ff' }}>{x.JLMC}</a>
              </div>
            ))}
          </div>
        );
        if (arr.filter(x => x.ZT === '2')?.length === 0) return '暂无';
        return (
          <Popover
            placement="rightTop"
            title={null}
            // content={batchDownloadContent(
            //   arr.filter(x => x.ZT === '2'),
            //   row.RYDJ + `|` + row.GW,
            // )}
            // overlayClassName="demand-detail-resume-info-popover"
            content={popoverContent(arr.filter(x => x.ZT === '2'))}
            overlayClassName="demand-detail-content-popover"
            arrowPointAtCenter
          >
            <a style={{ color: '#3361ff' }}>查看详情</a>
          </Popover>
        );
      },
    },
  ];

  if (XQNR.length === 0) return null;
  return (
    <div className="demand-table-box info-box">
      <div className="title">需求信息</div>
      <div className="date-row">
        {getDateItem('开发商反馈期限：', XQNR[0]?.KFSFKQX)}
        {/* {getDateItem('预计初筛日期：', XQNR[0]?.CSRQ)} */}
        {getDateItem('预计综合评测日期：', XQNR[0]?.YJZHPCRQ)}
        {getDateItem('预计试用日期：', XQNR[0]?.YJSYRQ)}
      </div>
      <div className="table-box">
        <Table columns={columns} rowKey={'XQNRID'} dataSource={XQNR} pagination={false} />
      </div>
    </div>
  );
}
