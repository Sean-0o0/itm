import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Modal, Form, message, Spin, Input, Button, Table, Steps, Select } from 'antd';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
const { Step } = Steps;

const SelectRenderer = ({ value }) => <Select value={value} disabled />;
const SelectEditor = ({ value, options, onChange }) => (
  <Select value={value} onChange={onChange}>
    {options.map(option => (
      <Select.Option key={option.value} value={option.value}>
        {option.label}
      </Select.Option>
    ))}
  </Select>
);

function OprtModal(props) {
  const { visible, setVisible, form } = props;
  const { validateFields, getFieldValue, resetFields, getFieldDecorator } = form;
  const [isSpinning, setIsSpinning] = useState(false); //
  const [curStep, setCurStep] = useState(0); //当前tab ID
  const [columnsData, setColumnsData] = useState([{}]); //字段数据
  const [presetData, setPresetData] = useState([{}]); //预设数据
  const [ZDLX, setZDLX] = useState(['分类字段', '填写字段']); //字段类型
  const hotRef = useRef(null);
  const hotRef2 = useRef(null);
  const hotElement = document.getElementById('tableContent1');
  const hotElement2 = document.getElementById('tableContent2');

  useEffect(() => {
    let count = 0;
    columnsData.forEach(x => {
      if (x.ZDLX === '分类字段') count++;
    });
    console.log('🚀 ~ file: index.js:25 ~ useEffect ~ columnsData:', columnsData);
    if (count === 3) {
      setZDLX(['填写字段']);
    } else {
      setZDLX(['分类字段', '填写字段']);
    }
    return () => {};
  }, [columnsData.length, JSON.stringify(columnsData)]);

  useEffect(() => {
    if (hotElement !== null && visible) {
      // console.log('🚀 ~ file: index.js:35 ~ useEffect ~ hotElement:', hotElement);
      const hotInstance = new Handsontable(hotElement, {
        data: columnsData,
        columns: [
          { data: 'ZDMC', title: '字段名称', width: 300 },
          {
            data: 'ZDLX',
            title: '字段类型',
            width: 180,
            type: 'dropdown',
            editor: 'select',
            selectOptions: ZDLX,
            // source: ZDLX,
          },
        ],
        colHeaders: true,
        // rowHeaders: true,
        height: 244,
        width: 722,
        columnHeaderHeight: 40,
        rowHeights: 40,
        mergeCells: true,
        stretchH: 'all',
        licenseKey: 'non-commercial-and-evaluation',
        minRows: 1,
        // contextMenu: ['mergeCells', 'row_above', 'row_below', 'col_left', 'col_right'],
        contextMenu: {
          items: {
            row_above: {
              name: '上面插入一行',
            },
            row_below: {
              name: '下面插入一行',
            },
            hsep1: '---------', //提供分隔线
            remove_row: {
              name: '移除本行',
            },
            // hsep2: '---------',
            clear_custom: {
              name: '清空所有单元格数据',
              callback: function() {
                this.clear();
              },
            },
          },
        },
        afterChange: (changes, source) => {
          changes?.forEach(([row, prop, oldValue, newValue]) => {
            console.log('🚀 ~ row, prop, oldValue, newValue:', row, prop, oldValue, newValue);
            // 更新状态中的数据
            setColumnsData(prevData =>
              prevData.map((rowData, index) =>
                index === row ? { ...rowData, [prop]: newValue } : rowData,
              ),
            );
          });
        },
        afterGetColHeader: (col, TH) => {
          TH.style.backgroundColor = '#f5f7fa';
          TH.style.lineHeight = '40px';
          TH.style.textAlign = 'center';
          TH.style.fontSize = '14px';
          TH.style.fontFamily = 'PingFangSC-Medium, PingFang SC';
          TH.style.fontWeight = 'bold';
          TH.style.color = '#606266';
        },
      });

      return () => {
        hotInstance?.destroy();
      };
    } else {
      setColumnsData([{}]);
    }
    return () => {};
  }, [visible, ZDLX]);

  useEffect(() => {
    if (hotElement2 !== null && visible) {
      // console.log('🚀 ~ file: index.js:115 ~ useEffect ~ hotElement2:', hotElement2);
      let presetColumns = [];
      columnsData.forEach((x, i) => {
        if (x.ZDLX === '分类字段') {
          presetColumns.push({ data: 'ZD' + (i + 1), title: x.ZDMC, width: 144 });
        } else if (x.ZDMC === '关联项目') {
          presetColumns.push({
            data: 'GLXM',
            title: x.ZDMC,
            width: 144,
            type: 'dropdown',
            editor: 'select',
            selectOptions: ZDLX,
          });
        } else if (x.ZDMC === '填写人') {
          presetColumns.push({
            data: 'TXR',
            title: x.ZDMC,
            width: 144,
            // type: 'dropdown',
            // editor: 'select',
            // selectOptions: ZDLX,
            // type: 'dropdown',
            renderer: SelectRenderer, // 使用自定义的Select渲染器
            editor: SelectEditor, // 使用自定义的Select编辑器
            selectOptions: [
              // Select的选项数组
              { value: 'Option 1', label: 'Option 1' },
              { value: 'Option 2', label: 'Option 2' },
              { value: 'Option 3', label: 'Option 3' },
            ],
          });
        }
      });
      // console.log('🚀 ~ presetColumns:', presetColumns);
      const hotInstance2 = new Handsontable(hotElement2, {
        data: presetData,
        columns: presetColumns,
        colHeaders: true,
        // rowHeaders: true,
        height: 454,
        width: 722,
        columnHeaderHeight: 40,
        rowHeights: 40,
        mergeCells: true,
        stretchH: 'all',
        licenseKey: 'non-commercial-and-evaluation',
        minRows: 1,
        // 启用 dropdownMenu 插件
        dropdownMenu: {
          maxRows: 5,
        },
        // 启用 filters 插件
        filters: true,
        // contextMenu: ['mergeCells', 'row_above', 'row_below', 'col_left', 'col_right'],
        contextMenu: {
          items: {
            mergeCells: {
              name: '合并单元格',
            },
            row_above: {
              name: '上面插入一行',
            },
            row_below: {
              name: '下面插入一行',
            },
            hsep1: '---------', //提供分隔线
            remove_row: {
              name: '移除本行',
            },
            clear_custom: {
              name: '清空所有单元格数据',
              callback: function() {
                this.clear();
              },
            },
          },
        },
        afterChange: (changes, source) => {
          changes?.forEach(([row, prop, oldValue, newValue]) => {
            console.log(
              '🚀 ~ file: index.js:180 ~ changes?.forEach ~ row, prop, oldValue, newValue:',
              row,
              prop,
              oldValue,
              newValue,
            );
            // 更新状态中的数据
            setPresetData(prevData =>
              prevData.map((rowData, index) =>
                index === row ? { ...rowData, [prop]: newValue } : rowData,
              ),
            );
          });
        },
        afterGetColHeader: (col, TH) => {
          TH.style.backgroundColor = '#f5f7fa';
          TH.style.lineHeight = '40px';
          TH.style.textAlign = 'center';
          TH.style.fontSize = '14px';
          TH.style.fontFamily = 'PingFangSC-Medium, PingFang SC';
          TH.style.fontWeight = 'bold';
          TH.style.color = '#606266';
        },
      });
      hotInstance2?.addHook('beforeMergeCells', function(cellRange, mergeParent) {
        if (cellRange.from.col !== cellRange.to.col) {
          // 如果合并的区域跨越了列，则取消合并
          mergeParent.setId(-1);
          mergeParent.setState(Handsontable.cellTypes.TextEditor.prototype.STATE_EDITING);
          mergeParent.setValue('');
        }
      });
      return () => {
        hotInstance2?.destroy();
      };
    }
    return () => {};
  }, [visible, JSON.stringify(columnsData), curStep]);

  useEffect(() => {
    console.log('@@presetData', presetData);
    return () => {};
  }, [JSON.stringify(presetData), presetData.length]);

  const handleOk = () => {
    form.validateFieldsAndScroll(err => {
      if (!err) {
        setVisible(false);
      }
    });
  };

  const handleCancel = () => {
    resetFields();
    setVisible(false);
  };

  const onStepChange = v => {
    if (v === 1) {
      handleNext();
    } else setCurStep(v);
  };

  const handleNext = () => {
    let empty = [];
    const arr = ['', ' ', undefined, null];
    for (let i = 0; i < columnsData.length; i++) {
      if (!empty.includes('字段名称') && arr.includes(columnsData[i].ZDMC)) {
        empty.push('字段名称');
      }
      if (!empty.includes('字段类型') && arr.includes(columnsData[i].ZDLX)) {
        empty.push('字段类型');
      }
    }
    if (empty.length > 0) {
      message.error(empty.join('、') + '不能为空', 1);
    } else {
      setCurStep(1);
      // setPresetData();
    }
  };
  const handleLast = () => {
    setCurStep(0);
  };

  //表格模板 - 列配置
  const rptTemplateColumns = [
    {
      title: '模板名称',
      key: 'MBMC',
      dataIndex: 'MBMC',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'CZ',
      dataIndex: 'CZ',
      align: 'center',
      width: 200,
      render: () => (
        <Fragment>
          <a style={{ color: '#3361ff' }}>查看</a>
          <a style={{ color: '#3361ff', marginLeft: 6 }}>使用</a>
        </Fragment>
      ),
    },
  ];

  return (
    <Modal
      wrapClassName="editMessage-modify custom-report-edit-modal"
      width={'850px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      style={{ top: '10px' }}
      title={null}
      visible={visible}
      onCancel={handleCancel}
      forceRender={true}
      footer={
        <div className="modal-footer">
          <Button className="btn-default" onClick={handleCancel}>
            取消
          </Button>
          {curStep === 0 ? (
            <Button
              loading={isSpinning}
              className="btn-primary"
              type="primary"
              onClick={handleNext}
            >
              下一步
            </Button>
          ) : (
            <Fragment>
              <Button
                loading={isSpinning}
                className="btn-primary"
                type="primary"
                onClick={handleLast}
              >
                上一步
              </Button>
              <Button
                loading={isSpinning}
                className="btn-primary"
                type="primary"
                onClick={handleOk}
              >
                保存
              </Button>
            </Fragment>
          )}
        </div>
      }
    >
      <div className="body-title-box">
        <strong>账号新增</strong>
      </div>
      <Spin spinning={isSpinning}>
        <Form className="content-box">
          <Steps
            current={curStep}
            onChange={onStepChange}
            type="navigation"
            style={{ marginBottom: 16 }}
          >
            <Step title="定义报告字段" status={curStep === 0 ? 'process' : 'wait'} />
            <Step title="预设填写数据" status={curStep === 1 ? 'process' : 'wait'} />
          </Steps>
          <div style={{ display: curStep !== 0 ? 'none' : 'block' }}>
            <Form.Item label="报告名称" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
              {getFieldDecorator('bbmc', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '报告名称不允许空值',
                  },
                ],
              })(<Input className="item-selector" placeholder="请输入报告名称" allowClear />)}
            </Form.Item>
            <Form.Item required label="报告模版" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
              <Table
                columns={rptTemplateColumns}
                rowKey={'MBMC'}
                dataSource={[
                  {
                    MBMC: 'xxxx模板名称',
                  },
                ]}
                pagination={false}
                bordered
              />
            </Form.Item>
            <Form.Item
              required
              label="报告名称"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              style={{ marginBottom: 0 }}
            >
              <div id="tableContent1" ref={hotRef}></div>
            </Form.Item>
          </div>
          <Form.Item
            required
            label="预设字段"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
            style={{ marginBottom: 0, display: curStep === 0 ? 'none' : 'block' }}
          >
            <div id="tableContent2"></div>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
export default Form.create()(OprtModal);
