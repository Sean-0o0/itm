import React, { useEffect, useState } from 'react';
import InfoTable from './InfoTable';
import { Button, Input, message, Modal, Spin, Tabs } from 'antd';
import { FetchQueryTenderStatisticsInfo } from '../../../../services/projectManage';

const { TabPane } = Tabs;

export default function BidSectionModel(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [isSpinning, setIsSpinning] = useState(true); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [total, setTotal] = useState(0); //数据总数
  const [params, setParams] = useState({ current: 1, pageSize: 10 });
  const [updateDate, setUpdateDate] = useState('--'); //更新时间
  const [bjmc, setBjmc] = useState(''); //包件名称
  const { visible = false, xmid, closeModal } = props;

  useEffect(() => {
    getTableData(params);
    return () => {};
  }, []);

  //获取表格数据
  const getTableData = params => {
    setTableLoading(true);
    let p = {
      ...params,
      packageId: 0,
      projectId: 0,
      year: 2023,
      paging: 1,
      sort: '',
      total: -1,
    };
    if (bjmc !== '') {
      p.packageId = bjmc;
    }
    FetchQueryTenderStatisticsInfo(p)
      .then(res => {
        if (res?.success) {
          let data = [...JSON.parse(res.result)];
          let zbData = [...JSON.parse(res.resultZB)];
          function uniqueFunc(arr, uniId) {
            const res = new Map();
            return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1));
          }
          let uniqueBjmc = uniqueFunc(data, 'BJMC');
          let bjmcArr = uniqueBjmc.map(x => x.BJMC);
          data.forEach(x => {
            let zbArr = zbData.filter(y => y.BJID === x.BJMC);
            zbArr.length > 0 && (x.ZB = zbArr[0].ZB);
          });
          bjmcArr.forEach(y => {
            let jeSum = 0;
            data.forEach(x => {
              if (x.BJMC === y) {
                jeSum += Number(x.XMJE);
              }
            });
            data.forEach(x => {
              if (x.BJMC === y) x.BDHJJE = jeSum;
            });
          });
          // console.log('🚀 ~ file: index.js:68 ~ getTableData ~ data:', data);
          setTableData([...data]);
          setTotal(res.total);
          setTableLoading(false);
          setIsSpinning(false);
        }
      })
      .catch(e => {
        // console.error('getTableData', e);
        setTableLoading(false);
        setIsSpinning(false);
      });
  };

  const callBackParams = params => {
    setParams({ ...params });
    getTableData(params);
  };

  const tabsCallback = () => {};

  const tabs = [
    {
      key: 0,
      title: '基础硬件',
    },
    {
      key: 1,
      title: '国产化基础硬件',
    },
  ];

  const handleReset = () => {
    setBjmc('');
  };

  return (
    <>
      <Modal
        wrapClassName="editMessage-modify"
        style={{ top: '10px', paddingBottom: '0' }}
        width={'1000px'}
        title={null}
        zIndex={100}
        bodyStyle={{
          padding: '0',
          // height: '697px',
          height: '650px',
        }}
        onCancel={closeModal}
        maskClosable={false}
        //   footer={
        //     <div className="modal-footer">
        //       <Button className="btn-default" onClick={closeModal}>
        //         取消
        //       </Button>
        //       {/* <Button className="btn-primary" type="primary" onClick={() => handleSubmit('save')}>
        //   暂存草稿
        // </Button> */}
        //       <Button disabled={isSpinning} className="btn-primary" type="primary">
        //         导出
        //       </Button>
        //     </div>
        //   }
        footer={null}
        visible={visible}
      >
        <div
          style={{
            height: '42px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#3361FF',
            color: 'white',
            padding: '0 24px',
            borderRadius: '8px 8px 0 0',
            fontSize: '16px',
          }}
        >
          <strong>标段信息统计</strong>
        </div>
        <Spin
          spinning={isSpinning}
          tip="加载中"
          size="large"
          wrapperClassName="bidSection-list-box"
        >
          {/* <div style={{height: '7%'}}>
            <Tabs className='tabs' style={{height: '100%'}} defaultActiveKey="0" onChange={tabsCallback}>
              {
                tabs.map(item => {
                  return <TabPane tab={item.title} key={item.key}></TabPane>;
                })
              }
            </Tabs>
          </div> */}
          <div className="top-console">
            <div className="item-box">
              <div className="console-item" style={{ width: '50%' }}>
                <div className="item-label">包件名称：</div>
                <Input
                  placeholder="请输入包件名称"
                  value={bjmc}
                  onChange={e => setBjmc(e.target.value)}
                />
              </div>
              <div className="btn-item" style={{ width: '50%' }}>
                <Button className="btn-search" type="primary" onClick={() => getTableData(params)}>
                  查询
                </Button>
                <Button className="btn-reset" onClick={handleReset}>
                  重置
                </Button>
              </div>
            </div>
          </div>
          <InfoTable
            params={params}
            callBackParams={callBackParams}
            tableData={tableData}
            tableLoading={tableLoading}
            getTableData={getTableData}
            total={total}
          />
        </Spin>
      </Modal>
    </>
  );
}
