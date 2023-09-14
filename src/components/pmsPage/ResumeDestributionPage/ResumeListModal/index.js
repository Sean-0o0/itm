import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  message,
  Modal,
  Row,
  Spin,
  Table,
  Form,
  Input,
  DatePicker,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { QueryUploadRcd } from '../../../../services/pmsServices';
import { debounce } from 'lodash';

const { RangePicker } = DatePicker;

export default Form.create()(function ResumeListModal(props) {
  const { visible, setVisible, form, ryxqid } = props;
  const { getFieldDecorator, getFieldValue } = form;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 10,
    total: -1,
  }); //表格数据
  const [filterData, setFilterData] = useState({
    jlmc: '',
    gys: '',
  }); //筛选栏各个值

  //防抖定时器
  // let timer = null;

  useEffect(() => {
    return () => {
      // clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setIsSpinning(true);
      getData({});
    }
    return () => {};
  }, [visible]);

  // 防抖
  // const debounce = (fn, waits = 500) => {
  //   if (timer) {
  //     clearTimeout(timer);
  //     timer = null;
  //   }
  //   timer = setTimeout(() => {
  //     fn(...arguments);
  //   }, waits);
  // };

  //获取简历列表
  const getData = debounce(
    ({ current = 1, pageSize = 10, endDate, fileName, startDate, vendor }) => {
      setIsSpinning(true);
      setFilterData({
        jlmc: fileName || '',
        gys: vendor || '',
      });
      let params = {
        current,
        pageSize,
        paging: 1,
        sort: '',
        total: -1,
        endDate,
        fileName,
        startDate,
        vendor,
        memberDemandId: Number(ryxqid),
        // uploadBy: 0,
      };
      console.log('🚀 ~ getData ~ params:', params);
      QueryUploadRcd(params)
        .then(res => {
          if (res?.success) {
            // console.log('🚀 ~ QueryUploadRcd ~ res', JSON.parse(res.result));
            //to do ...
            setTableData({
              data: JSON.parse(res.result),
              current,
              pageSize,
              total: res.totalrows,
            });
            setIsSpinning(false);
          }
        })
        .catch(e => {
          console.error('🚀简历列表', e);
          message.error('简历列表获取失败', 1);
          setIsSpinning(false);
        });
    },
    500,
  );

  //提交数据
  const onOk = () => {
    setVisible(false);
  };

  //取消
  const onCancel = () => {
    setVisible(false);
    setTableData({
      data: [],
      current: 1,
      pageSize: 10,
      total: -1,
    });
    setFilterData({
      jlmc: '',
      gys: '',
    });
  };

  //列配置
  const columns = [
    {
      title: '简历名称',
      dataIndex: 'scjl',
      key: 'scjl',
      width: '40%',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          {txt}
        </Tooltip>
      ),
    },
    {
      title: '供应商',
      dataIndex: 'gysmc',
      key: 'gysmc',
      width: '35%',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          {txt}
        </Tooltip>
      ),
    },
    {
      title: '上传时间',
      dataIndex: 'scsj',
      key: 'scsj',
      width: '25%',
      ellipsis: true,
    },
  ];

  //表格变化
  const handleTableChange = pagination => {
    const { current = 1, pageSize = 10 } = pagination;
    setIsSpinning(true);
    getData({
      current,
      pageSize,
      fileName: filterData.jlmc === '' ? undefined : filterData.jlmc,
      vendor: filterData.gys === '' ? undefined : filterData.gys,
      startDate:
        getFieldValue('scsj').length === 0
          ? undefined
          : Number(getFieldValue('scsj')[0].format('YYYYMMDD')),
      endDate:
        getFieldValue('scsj').length === 0
          ? undefined
          : Number(getFieldValue('scsj')[1].format('YYYYMMDD')),
    });
  };

  const onJlmcChange = e => {
    e.persist();
    // setIsSpinning(true);
    getData({
      fileName: e.target.value === '' ? undefined : e.target.value,
      vendor: filterData.gys === '' ? undefined : filterData.gys,
      startDate:
        getFieldValue('scsj').length === 0
          ? undefined
          : Number(getFieldValue('scsj')[0].format('YYYYMMDD')),
      endDate:
        getFieldValue('scsj').length === 0
          ? undefined
          : Number(getFieldValue('scsj')[1].format('YYYYMMDD')),
    });
    // setFilterData(p => ({
    //   ...p,
    //   jlmc: e.target.value,
    // }));
  };

  const onGysChange = e => {
    e.persist();
    // setIsSpinning(true);
    getData({
      vendor: e.target.value === '' ? undefined : e.target.value,
      fileName: filterData.fileName === '' ? undefined : filterData.fileName,
      startDate:
        getFieldValue('scsj').length === 0
          ? undefined
          : Number(getFieldValue('scsj')[0].format('YYYYMMDD')),
      endDate:
        getFieldValue('scsj').length === 0
          ? undefined
          : Number(getFieldValue('scsj')[1].format('YYYYMMDD')),
    });
    // setFilterData(p => ({
    //   ...p,
    //   gys: e.target.value,
    // }));
  };

  const onScsjChange = (dArr, dsArr) => {
    // console.log('🚀 ~ file: index.js:126 ~ onScsjChange ~ dArr, dsArr:', dArr, dsArr);
    setIsSpinning(true);
    getData({
      fileName: filterData.jlmc === '' ? undefined : filterData.jlmc,
      vendor: filterData.gys === '' ? undefined : filterData.gys,
      startDate: dArr.length === 0 || !dArr[0] ? undefined : Number(dArr[0].format('YYYYMMDD')),
      endDate: dArr.length === 0 || !dArr[1] ? undefined : Number(dArr[1].format('YYYYMMDD')),
    });
  };

  return (
    <Modal
      wrapClassName="resume-list-modal"
      width={1000}
      maskClosable={false}
      style={{ top: 10 }}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      zIndex={103}
      footer={null}
      title={null}
      destroyOnClose
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <div className="body-title-box">
        <strong>简历列表</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <div className="content-box">
          <Row className="filter-row">
            <Col span={8}>
              <Form.Item label="简历名称" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
                <Input onChange={onJlmcChange} allowClear placeholder="请输入简历名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="供应商" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
                <Input onChange={onGysChange} allowClear placeholder="请输入供应商名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="上传时间" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('scsj', { initialValue: [] })(
                  <RangePicker onChange={onScsjChange} allowClear />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Table
            columns={columns}
            rowKey={'id'}
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
            bordered //记得注释
          />
        </div>
      </Spin>
    </Modal>
  );
});
