import React, { useState, useEffect } from 'react';
import { Modal, DatePicker, Table, Spin } from 'antd';
import moment from 'moment';
import { FetchQueryOwnerMessage } from '../../../../../services/pmsServices';

const { RangePicker } = DatePicker;

export default function PaymentModal(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const { visible=false, paymentPlan = [] } = dataProps;
  const { setVisible } = funcProps;
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
  }); //表格数据
  const [date, setDate] = useState([]); //公告日期

  //列配置
  const columns = [
    {
      title: '公告内容',
      dataIndex: 'txnr',
      key: 'txnr',
      ellipsis: true,
    },
    {
      title: '公告日期',
      dataIndex: 'txrq',
      key: 'txrq',
      width: 120,
      ellipsis: true,
      render: txt => moment(txt).format('YYYY-MM-DD'),
    },
  ];

  useEffect(() => {
 
    return () => {};
  }, []);

  return (
    <Modal
      wrapClassName="editMessage-modify system-notice-all-modal"
      width={800}
      maskClosable={false}
      style={{ top: 60 }}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      zIndex={103}
      footer={null}
      title={null}
      visible={visible}
      onCancel={() => setVisible(false)}
    >
      <div className="body-title-box">
        <strong>付款流程补录</strong>
      </div>
      <Spin spinning={tableData.loading} tip="加载中">
        <div className="content-box">
          {/* <Table
            columns={columns}
            rowKey={'xxid'}
            dataSource={tableData.data}
            onChange={handleTableChange}
            pagination={{
              current: tableData.current,
              pageSize: tableData.pageSize,
              defaultCurrent: 1,
              pageSizeOptions: ['10', '20', '30', '40'],
              showSizeChanger: true,
              hideOnSinglePage: false,
              showQuickJumper: true,
              showTotal: t => `共 ${tableData.total} 条数据`,
              total: tableData.total,
            }}
            scroll={{ y: 298 }}
            // bordered
          /> */}
        </div>
      </Spin>
    </Modal>
  );
}
