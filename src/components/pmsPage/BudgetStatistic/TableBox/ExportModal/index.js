import React, { useEffect, useState } from 'react';
import { Modal, Form, message, Spin, Row, Col, Radio, DatePicker } from 'antd';
import moment from 'moment';
import { QueryBudgetStatistics } from '../../../../../services/pmsServices';
import * as XLSX from 'xlsx';

function ExportModal(props) {
  const { visible, setVisible, columns, form } = props;
  const { validateFields, getFieldValue, resetFields, getFieldDecorator } = form;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [yearOpen, setYearOpen] = useState(false); //年份选择器展开收起
  const [curYear, setCurYear] = useState(moment()); //当前年份

  useEffect(() => {
    return () => {};
  }, []);

  const handleOk = () => {
    validateFields(err => {
      if (!err) {
        console.log(getFieldValue('budgetType'), curYear.year());
        setIsSpinning(true);
        //预算统计信息
        QueryBudgetStatistics({
          budgetType: getFieldValue('budgetType'),
          current: 1,
          pageSize: 99999,
          paging: -1,
          queryType: 'YSTJ',
          sort: '',
          total: -1,
          year: curYear.year(),
        })
          .then(res => {
            if (res?.success) {
              // console.log('🚀 ~ QueryBudgetStatistics ~ res', JSON.parse(res.budgetInfo));
              let tableArr =
                getFieldValue('budgetType') === 'ALL'
                  ? JSON.parse(res.allBudgetInfo)
                  : JSON.parse(res.budgetInfo);
              let dataIndexArr = columns.map(item => item.dataIndex);
              let finalArr = [];
              tableArr.forEach(obj => {
                let temp = {};
                dataIndexArr.forEach(dataIndex => {
                  let title = columns.find(item => item.dataIndex === dataIndex)?.title;
                  temp[title] = obj[dataIndex];
                  delete obj[dataIndex];
                });
                finalArr.push(temp);
              });
              console.log('🚀 ~ 导出信息:', finalArr);
              let fileName =
                (getFieldValue('budgetType') === 'ZB'
                  ? '资本性'
                  : getFieldValue('budgetType') === 'FZB'
                  ? '非资本性'
                  : '资本性和非资本性') +
                '预算执行统计（' +
                moment().format('YYYYMMDD') +
                '）.xlsx';
              exportExcelFile(finalArr, 'Sheet1', fileName);
              setVisible(false);
              setIsSpinning(false);
            }
          })
          .catch(e => {
            console.error('🚀导出信息', e);
            message.error('导出信息获取失败', 1);
            setIsSpinning(false);
          });
      }
    });
  };
  /**
   * 导出 excel 文件
   * @param array JSON 数组
   * @param sheetName 第一张表名
   * @param fileName 文件名
   */
  const exportExcelFile = (array = [], sheetName = 'Sheet1', fileName = 'example.xlsx') => {
    const jsonWorkSheet = XLSX.utils.json_to_sheet(array);
    const workBook = {
      SheetNames: [sheetName],
      Sheets: {
        [sheetName]: jsonWorkSheet,
      },
    };
    return XLSX.writeFile(workBook, fileName);
  };

  const handleCancel = () => {
    resetFields();
    setCurYear(moment());
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
    >
      <div className="body-title-box">
        <strong>导出</strong>
      </div>
      <Spin spinning={isSpinning}>
        <Form className="content-box">
          <Row>
            <Col span={24}>
              <Form.Item label="年份" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <DatePicker
                  mode="year"
                  value={curYear}
                  open={yearOpen}
                  placeholder="请选择年份"
                  format="YYYY"
                  allowClear={false}
                  onOpenChange={v => setYearOpen(v)}
                  onChange={v => setCurYear(v)}
                  onPanelChange={d => {
                    setCurYear(d);
                    setYearOpen(false);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="导出类型" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                {getFieldDecorator('budgetType', {
                  initialValue: 'ZB',
                  rules: [
                    {
                      required: true,
                      message: '导出类型不允许空值',
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio value="ZB">资本性预算</Radio>
                    <Radio value="FZB">非资本性预算</Radio>
                    <Radio value="ALL">资本性和非资本性预算</Radio>
                  </Radio.Group>,
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
