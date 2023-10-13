import React, { useEffect, useState } from 'react';
import { Modal, Form, message, Spin, Row, Col, Radio, DatePicker } from 'antd';
import moment from 'moment';
import { QueryBudgetStatistics } from '../../../../../services/pmsServices';
import * as XLSX from 'xlsx';

function ExportModal(props) {
  const { visible, setVisible, form } = props;
  const { validateFields, getFieldValue, resetFields, getFieldDecorator } = form;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [yearOpen, setYearOpen] = useState(false); //年份选择器展开收起
  const [curYear, setCurYear] = useState(moment()); //当前年份
  const columns = [
    {
      title: '预算类别',
      dataIndex: 'YSLB',
    },
    {
      title: '预算项目',
      dataIndex: 'YSXM',
    },
    {
      title: '负责人',
      dataIndex: 'FZR',
    },
    {
      title: '总预算（万元）',
      dataIndex: 'ZTZ',
    },
    {
      title: '可执行预算（万元）',
      dataIndex: 'SHHBNZF',
    },
    {
      title: '预算执行金额（万元）',
      dataIndex: 'YSZXJE',
    },
    {
      title: '预算执行率（%）',
      dataIndex: 'YSZXL',
    },
    {
      title: '合同金额（万元）',
      dataIndex: 'HTJE',
    },
    {
      title: '涉及项目数',
      dataIndex: 'SJXMS',
    },
  ];
  const columnsForALL = [
    {
      title: '预算类别',
      dataIndex: 'YSLB',
    },
    {
      title: '预算项目',
      dataIndex: 'YSXM',
    },
    {
      title: '负责人',
      dataIndex: 'FZR',
    },
    {
      title: '资本总预算（万元）',
      dataIndex: 'ZBZTZ',
    },
    {
      title: '资本可执行预算（万元）',
      dataIndex: 'ZBSHHBNZF',
    },
    {
      title: '非资本总预算（万元）',
      dataIndex: 'FZBZTZ',
    },
    {
      title: '非资本可执行预算（万元）',
      dataIndex: 'FZBSHHBNZF',
    },
    {
      title: '预算执行金额（万元）',
      dataIndex: 'YSZXJE',
    },
    {
      title: '预算执行率（%）',
      dataIndex: 'YSZXL',
    },
    {
      title: '合同金额（万元）',
      dataIndex: 'HTJE',
    },
    {
      title: '涉及项目数',
      dataIndex: 'SJXMS',
    },
  ];
  const columnsForKY = [
    {
      title: '预算项目',
      dataIndex: 'YSXM',
    },
    {
      title: '负责人',
      dataIndex: 'FZR',
    },
    {
      title: '总预算（万元）',
      dataIndex: 'ZYS',
    },
    {
      title: '可执行预算（万元）',
      dataIndex: 'KZXYS',
    },
    {
      title: '资本已执行预算（万元）',
      dataIndex: 'ZBYZXYS',
    },
    {
      title: '非资本已执行预算（万元）',
      dataIndex: 'FZBYZXYS',
    },
    {
      title: '人力已执行预算（万元）',
      dataIndex: 'RLYZXYS',
    },
    {
      title: '总执行预算（万元）',
      dataIndex: 'ZZXYS',
    },
    {
      title: '执行率（%）',
      dataIndex: 'ZXL',
    },
    {
      title: '涉及项目数',
      dataIndex: 'SJXM',
    },
  ];

  useEffect(() => {
    return () => {};
  }, []);

  const handleOk = () => {
    validateFields(err => {
      if (!err) {
        const type = getFieldValue('budgetType');
        // console.log(type, curYear.year());
        setIsSpinning(true);
        //预算统计信息
        QueryBudgetStatistics({
          budgetType: type,
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
                type === 'ALL' ? JSON.parse(res.allBudgetInfo) : JSON.parse(res.budgetInfo);
              let columnsArr =
                type === 'ALL' ? columnsForALL : type === 'KY' ? columnsForKY : columns;
              let finalArr = [];
              tableArr.forEach(obj => {
                let temp = {};
                columnsArr.forEach(x => {
                  temp[x.title] = obj[x.dataIndex];
                  delete obj[x.dataIndex];
                });
                finalArr.push(temp);
              });
              // console.log('🚀 ~ 导出信息:', finalArr);
              let fileName =
                (type === 'ZB'
                  ? '资本性'
                  : type === 'FZB'
                  ? '非资本性'
                  : type === 'KY'
                  ? '科研'
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
                    {/* <Radio value="KY">科研预算</Radio> */}
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
