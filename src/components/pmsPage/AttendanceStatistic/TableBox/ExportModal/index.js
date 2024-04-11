import React, { useEffect, useState } from 'react';
import { Modal, Form, message, Spin, Row, Col, Radio, DatePicker } from 'antd';
import moment from 'moment';
import {
  QueryBudgetStatistics,
  QuerySelfDevProjWHstatistics,
} from '../../../../../services/pmsServices';
import * as XLSX from 'xlsx';
import handleExport from '../exportUtils';

function ExportModal(props) {
  const {
    visible,
    setVisible,
    form,
    xmid = -1,
    defaultDate = moment(),
    getColumns = () => {},
  } = props;
  const { validateFields, setFieldsValue, resetFields, getFieldDecorator } = form;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [open, setOpen] = useState(false);
  const [flag, setFlag] = useState(0);

  useEffect(() => {
    if (visible) {
      setFieldsValue({
        range: [defaultDate, defaultDate],
      });
    }
    return () => {};
  }, [visible]);

  function getMonthRange(startMoment, endMoment) {
    const diffMonths = endMoment.diff(startMoment, 'months') + 1;
    const monthRange = [];

    for (let i = 0; i < diffMonths; i++) {
      const date = startMoment
        .clone()
        .add(i, 'months')
        .startOf('month');
      monthRange.push({ year: date.year(), month: Number(date.format('YYYYMM')) });
    }

    return monthRange;
  }

  const handleOk = () => {
    validateFields(async (err, values) => {
      if (!err) {
        try {
          setIsSpinning(true);
          const monthRange = getMonthRange(...values.range);
          const promiseArr = monthRange.reduce(
            (acc, cur) => [
              ...acc,
              QuerySelfDevProjWHstatistics({
                presentType: 'XQ',
                projectId: xmid,
                queryType: 'YDHZ',
                year: cur.year,
                month: cur.month,
              }),
              QuerySelfDevProjWHstatistics({
                presentType: 'HJ',
                projectId: xmid,
                queryType: 'YDHZ',
                year: cur.year,
                month: cur.month,
              }),
            ],
            [],
          );
          const resArr = await Promise.all(promiseArr);
          // console.log('🚀 ~ file: index.js:82 ~ validateFields ~ resArr:', resArr);
          const dataList = resArr.reduce((acc, cur, index) => {
            if (index % 2 === 0) {
              const tableArr = JSON.parse(cur.summaryResult || '[]'); //表格数据
              const obj = JSON.parse(resArr[index + 1].summaryResult || '[]')[0] || {}; //合计数据
              acc.push([
                ...tableArr,
                {
                  ...obj,
                  RYMC: obj.NR + '：',
                },
              ]);
            }
            return acc;
          }, []);

          // console.log('🚀 ~ file: index.js:97 ~ dataList ~ dataList:', dataList);
          const sheetNames = monthRange.map(x => moment(String(x.month)).format('YYYY年MM月'));
          const columnList = monthRange.map(x =>
            getColumns(x.year, moment(String(x.month)).month()).map(x => ({
              ...x,
              title: String(x.title),
            })),
          );
          // console.log('🚀 ~ file: index.js:97 ~ validateFields ~ columnList:', columnList);
          setIsSpinning(false);
          // console.log("🚀 ~ file: index.js:100 ~ validateFields ~ sheetNames:", sheetNames);
          handleExport({
            list: dataList,
            headList: columnList,
            sheetNames,
            sheetName: `月度汇总（${values.range[0].format('YYYYMM')}-${values.range[1].format(
              'YYYYMM',
            )}）`,
          });
          handleCancel();
        } catch (error) {
          setIsSpinning(false);
          console.error('🚀 ~ file: index.js:113 ~ validateFields ~ error:', error);
          message.error('导出失败', 1);
        }
      }
    });
  };

  const handleCancel = () => {
    resetFields();
    setVisible(false);
  };

  return (
    <Modal
      wrapClassName="editMessage-modify employment-application-modal"
      width={'600px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      style={{ top: '60px' }}
      title={null}
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="导出"
    >
      <div className="body-title-box">
        <strong>导出</strong>
      </div>
      <Spin spinning={isSpinning}>
        <Form className="content-box">
          <Row>
            <Col span={24}>
              <Form.Item label="月份范围" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                {getFieldDecorator('range', {
                  rules: [
                    {
                      required: true,
                      message: '月份范围不允许为空！',
                    },
                  ],
                })(
                  <DatePicker.RangePicker
                    style={{ minWidth: '100%' }}
                    mode={['month', 'month']}
                    placeholder="请选择"
                    format="YYYY-MM"
                    open={open}
                    onOpenChange={v => {
                      setOpen(v);
                      setFlag(0);
                    }}
                    onChange={(dates, dateStrings) => {
                      setFieldsValue({
                        range: dates,
                      });
                    }}
                    onPanelChange={dates => {
                      setFieldsValue({
                        range: dates,
                      });
                      let f = flag + 1;
                      setFlag(f);
                      setOpen(f < 2);
                    }}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
}
export default Form.create()(ExportModal);
