import React, { useState, useEffect } from 'react';
import { Modal, DatePicker, Table, Spin, message } from 'antd';
import moment from 'moment';
import { FetchQueryOwnerMessage } from '../../../../../services/pmsServices';

const { RangePicker } = DatePicker;

export default function ShowAllModal(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const { visible } = dataProps;
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
    if (visible) {
      //开启时加载数据
      getTableData({
        date: Number(
          moment()
            .subtract(30, 'days')
            .format('YYYYMMDD'),
        ),
        endDate: Number(moment().format('YYYYMMDD')),
      });
      setDate([moment().subtract(30, 'days'), moment()]);
    } else {
      //关闭时重置数据
      setTableData(p => ({
        ...p,
        current: 1,
        pageSize: 10,
      }));
      setDate([]);
    }
    return () => {};
  }, [visible]);

  //获取表格数据
  const getTableData = ({ date, endDate, current = 1, pageSize = 10 }) => {
    setTableData(p => ({ ...p, loading: true }));
    FetchQueryOwnerMessage({
      cxlx: 'GG',
      date,
      endDate,
      paging: 1,
      current,
      pageSize,
      total: -1,
      sort: '',
    })
      .then(res => {
        if (res?.success) {
          setTableData(p => ({
            ...p,
            data: [...res.record],
            total: res.totalrows,
            loading: false,
            current,
            pageSize,
          }));
        }
      })
      .catch(e => {
        console.error('FetchQueryOwnerMessage', e);
        message.error('系统公告信息查询失败', 1);
        setTableData(p => ({ ...p, loading: false }));
      });
  };

  //表格操作后更新数据
  const handleTableChange = pagination => {
    const { current = 1, pageSize = 10 } = pagination;
    getTableData({
      current,
      pageSize,
      date: Number(date[0]?.format('YYYYMMDD')),
      endDate: Number(date[1]?.format('YYYYMMDD')),
    });
  };

  //公告日期变化
  const onDateChange = (d, ds) => {
    setDate(d);
    if (d.length === 0) {
      getTableData({ date: Number(moment().format('YYYYMMDD')), endDate: undefined });
    } else {
      getTableData({
        date: Number(d[0].format('YYYYMMDD')),
        endDate: Number(d[1].format('YYYYMMDD')),
      });
    }
  };

  return (
    <Modal
      wrapClassName="editMessage-modify system-notice-all-modal"
      width={1000}
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
        <strong>系统公告</strong>
      </div>
      <Spin spinning={tableData.loading} tip="加载中">
        <div className="content-box">
          <div className="notice-date">
            公告日期：
            <RangePicker value={date} onChange={onDateChange} style={{ width: 300 }} />
          </div>
          <Table
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
          />
        </div>
      </Spin>
    </Modal>
  );
}
