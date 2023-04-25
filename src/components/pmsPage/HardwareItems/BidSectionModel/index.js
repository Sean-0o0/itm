import React, {useEffect, useState} from 'react';
import InfoTable from './InfoTable';
import {Button, message, Modal, Spin, Tabs,} from 'antd';
import {FetchQueryTenderStatisticsInfo} from "../../../../services/projectManage";

const {TabPane} = Tabs

export default function BidSectionModel(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [isSpinning, setIsSpinning] = useState(true); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [total, setTotal] = useState(0); //数据总数
  const [params, setParams] = useState({current: 1, pageSize: 10});
  const {visible = false, closeModal} = props;


  useEffect(() => {
    getTableData(params);
    setIsSpinning(false)
    return () => {
    };
  }, []);

  //获取表格数据
  const getTableData = (params) => {
    setTableLoading(true);
    FetchQueryTenderStatisticsInfo({
      ...params,
      // projectId: 399,
      packageId: 0,
      year: 2023,
      paging: 1,
      sort: "",
      total: -1
    })
      .then(res => {
        if (res?.success) {
          setTableData([...JSON.parse(res.result)]);
          setTotal(res.total);
          setTableLoading(false);
        }
        console.log('🚀 ~ file: index.js ~ line 29 ~ getTableData ~ res', JSON.parse(res.result));
      })
      .catch(e => {
        // console.error('getTableData', e);
        setTableLoading(false);
      });
  };

  const callBackParams = (params) => {
    setParams({...params})
    getTableData(params);
  }


  const tabsCallback = () => {

  }

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

  return (

    <>
      <Modal
        wrapClassName="editMessage-modify"
        style={{top: '10px', paddingBottom: '0'}}
        width={'1000px'}
        title={null}
        zIndex={100}
        bodyStyle={{
          padding: '0',
          height: '697px',
        }}
        // onCancel={this.props.closeModal}
        footer={<div className="modal-footer">
          <Button className="btn-default">
            取消
          </Button>
          {/* <Button className="btn-primary" type="primary" onClick={() => handleSubmit('save')}>
        暂存草稿
      </Button> */}
          <Button disabled={isSpinning} className="btn-primary" type="primary">
            导出
          </Button>
        </div>}
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
        <Spin spinning={isSpinning} tip="加载中" size="large" wrapperClassName='bidSection-list-box'>
          <div style={{height: '7%'}}>
            <Tabs className='tabs' style={{height: '100%'}} defaultActiveKey="0" onChange={tabsCallback}>
              {
                tabs.map(item => {
                  return <TabPane tab={item.title} key={item.key}></TabPane>;
                })
              }
            </Tabs>
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
