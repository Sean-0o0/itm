import React from 'react';
import { Table, Form, Input, Select, Radio, Button } from 'antd';

class FieldDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      rowIndex: 0,
      primKeyCheckIndex: undefined,
      incrColCheckIndex: undefined,
      tableRowType: {},
    };
  }
  componentWillReceiveProps(nextProps) {
    const { tableDetail: { colDtl: newColDtl = '' }, isEdit } = nextProps;
    const { tableDetail: { colDtl: oldColDtl = '' }, isEdit: oldIsEdit } = this.props;
    if (newColDtl !== oldColDtl || (!isEdit && oldIsEdit)) {
      let dataSource = [];
      let primKeyCheckIndex;
      let incrColCheckIndex;
      const tableRowType = {};
      if (newColDtl) {
        dataSource = JSON.parse(newColDtl).map((item, rowIndex) => {
          Reflect.set(tableRowType, rowIndex, item.DATA_TP);
          if (item.WTHR_INCR_COL === '1') {
            incrColCheckIndex = rowIndex;
          }
          if (item.WTHR_PRIM_KEY === '1') {
            primKeyCheckIndex = rowIndex;
          }
          return { ...item, rowIndex };
        });
      }
      this.setState({ dataSource, rowIndex: dataSource.length, incrColCheckIndex, primKeyCheckIndex, tableRowType });
    }
  }
  handleRowAdd=() => {
    const { dataSource = [], rowIndex } = this.state;
    dataSource.push({ rowIndex });
    this.setState({ dataSource, rowIndex: rowIndex + 1 });
  }
  handleRowDelete=(index) => {
    const { dataSource = [] } = this.state;
    dataSource.splice(index, 1);
    this.setState({ dataSource });
  }
  handleChange=(index, type) => {
    const { tableRowType = {} } = this.state;
    Reflect.set(tableRowType, index, type);
    this.setState({ tableRowType });
  }
  changePrimKeyCheckIndex=(index) => {
    this.setState({ primKeyCheckIndex: index });
  }
  changeIncrColCheckIndex=(index) => {
    this.setState({ incrColCheckIndex: index });
  }

  validateForm=() => {
    const { incrColCheckIndex } = this.state;
    const { validateFieldsAndScroll } = this.props.form;
    let fields;
    validateFieldsAndScroll(null, { scroll: { offsetTop: 80 } }, (err, values) => {
      if (!err) {
        fields = this.structFields(values, incrColCheckIndex);
      }
    });
    return fields;
  }
  structFields=(values = {}, incrColCheckIndex) => {
    const obj = {};
    // eslint-disable-next-line guard-for-in
    for (const key in values) {
      const keyList = key.split('-');
      if (!obj[keyList[0]]) {
        Reflect.set(obj, keyList[0], {});
      }
      if (keyList[1] === 'WTHR_INCR_COL') {
        Reflect.set(obj[keyList[0]], keyList[1], Number(keyList[0]) === Number(incrColCheckIndex) ? '1' : '0');
      } else {
        Reflect.set(obj[keyList[0]], keyList[1], values[key] || '');
      }
    }
    const dataList = [];
    // eslint-disable-next-line guard-for-in
    for (const key in obj) {
      dataList.push(obj[key]);
    }
    return JSON.stringify(dataList);
  }

  fetchColumns=() => {
    const { dataSource = [], incrColCheckIndex, primKeyCheckIndex, tableRowType = {} } = this.state;
    const { addType, isEdit = false, form: { getFieldDecorator, getFieldValue }, tableDataType = [], ctcTp } = this.props;
    const columns = [
      {
        title: '字段名',
        dataIndex: 'TBL_COL',
        align: 'center',
        render: (value, record) => (
          <Form.Item style={{ marginBottom: 0 }}>
            { getFieldDecorator(`${record.rowIndex}-TBL_COL`, {
            initialValue: value,
            rules: [{ required: true, message: '请输入字段名！' }],
          })(<Input />) }
          </Form.Item>
        ),
      },
      {
        title: '数据类型',
        dataIndex: 'DATA_TP',
        align: 'center',
        render: (value, record) => (
          <Form.Item style={{ marginBottom: 0 }}>
            { getFieldDecorator(`${record.rowIndex}-DATA_TP`, {
            initialValue: value,
            rules: [{ required: true, message: '请选择数据类型！' }],
          })(<Select getPopupContainer={node => node} onChange={v => this.handleChange(record.rowIndex, v)}>
              {tableDataType.map(item => <Select.Option key={item.dataTp}>{item.dataTp}</Select.Option>)}
            {/* eslint-disable-next-line react/jsx-indent */ }
              </Select>) }
          </Form.Item>
        ),
      },
    ];
    if ((dataSource.length > 0 && dataSource[0].COL_SCAL !== undefined && dataSource[0].COL_SCAL !== undefined) || addType) {
      columns.push({
        title: '数据长度',
        dataIndex: 'COL_PRCS',
        align: 'center',
        render: (value, record) => (
          <Form.Item style={{ marginBottom: 0 }}>
            { getFieldDecorator(`${record.rowIndex}-COL_PRCS`, {
            initialValue: value,
          })(<Input disabled={tableDataType.find(item => (item.dataTp === tableRowType[`${record.rowIndex}`]))?.wthrCfgPrcs === '0'} />) }
          </Form.Item>
        ),
      }, {
        title: '数据精度',
        dataIndex: 'COL_SCAL',
        align: 'center',
        render: (value, record) => (
          <Form.Item style={{ marginBottom: 0 }}>
            { getFieldDecorator(`${record.rowIndex}-COL_SCAL`, {
            initialValue: value,
          })(<Input disabled={tableDataType.find(item => (item.dataTp === tableRowType[`${record.rowIndex}`]))?.wthrCfgScal === '0'} />) }
          </Form.Item>
        ),
      });
    }
    if (dataSource.some(item => item.WTHR_INCR_COL === '1') || addType === '2' || addType === '' && ctcTp === '2') {
      columns.push({
        title: '是否增量列',
        dataIndex: 'WTHR_INCR_COL',
        align: 'center',
        render: (value, record) => {
          const dataType = getFieldValue(`${record.rowIndex}-DATA_TP`);
          const showRadio = tableDataType.filter(item => item.dataTp === dataType && item.incrTp !== '').length > 0;
          return (
            <Form.Item style={{ marginBottom: 0, display: showRadio ? 'block' : 'none' }}>
              {getFieldDecorator(`${record.rowIndex}-WTHR_INCR_COL`, {
                initialValue: value,
              })(<div className="ant-radio-group">
                <Radio
                  checked={incrColCheckIndex === record.rowIndex}
                  onClick={() => this.changeIncrColCheckIndex(record.rowIndex)}
                  disabled={!isEdit}
                />
                { /* eslint-disable-next-line react/jsx-closing-tag-location */}
              </div>)}
            </Form.Item>
          )
        },
      });
    }
    if (dataSource.some(item => item.WTHR_PRIM_KEY !== undefined)) {
      columns.push({
        title: '主键',
        dataIndex: 'WTHR_PRIM_KEY',
        align: 'center',
        render: (value, record) => (
          <Form.Item style={{ marginBottom: 0 }}>
            { getFieldDecorator(`${record.rowIndex}-WTHR_PRIM_KEY`, {
            initialValue: value,
          })(<Radio
            checked={primKeyCheckIndex === record.rowIndex}
            onClick={() => this.changePrimKeyCheckIndex(record.rowIndex)}
            disabled={!isEdit}
          />) }
          </Form.Item>
        ),
      });
    }
    if (isEdit) {
      columns.push({
        title: '操作',
        dataIndex: 'oper',
        align: 'center',
        render: (value, record, index) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={() => this.handleRowDelete(index)}>删除</a>
        ),
      });
    }
    return columns.map(col => ({ ...col, width: `${100 / columns.length}%` }));
  }
  fetchColumns2=() => {
    const { dataSource = [], incrColCheckIndex, primKeyCheckIndex } = this.state;
    const { addType, ctcTp, tableDataType = [] } = this.props;
    const columns = [
      {
        title: '字段名',
        dataIndex: 'TBL_COL',
        align: 'center',
      },
      {
        title: '数据类型',
        dataIndex: 'DATA_TP',
        align: 'center',
      },
    ];
    if ((dataSource.length > 0 && dataSource[0].COL_SCAL !== undefined && dataSource[0].COL_SCAL !== undefined) || addType) {
      columns.push({
        title: '数据长度',
        dataIndex: 'COL_PRCS',
        align: 'center',
      }, {
        title: '数据精度',
        dataIndex: 'COL_SCAL',
        align: 'center',
      });
    }
    if (dataSource.some(item => item.WTHR_INCR_COL === '1') || addType === '2' || addType === '' && ctcTp === '2') {
      columns.push({
        title: '是否增量列',
        dataIndex: 'WTHR_INCR_COL',
        align: 'center',
        render: (value, record) => {
          const dataType = record['DATA_TP'];
          if (tableDataType.filter(item => item.dataTp === dataType && item.incrTp !== '').length > 0) {
            return (
              <Radio checked={incrColCheckIndex === record.rowIndex} disabled />
            )
          }
        },
      });
    }
    if (dataSource.some(item => item.WTHR_PRIM_KEY !== undefined)) {
      columns.push({
        title: '主键',
        dataIndex: 'WTHR_PRIM_KEY',
        align: 'center',
        render: (value, record) => (
          <Radio checked={primKeyCheckIndex === record.rowIndex} disabled />
        ),
      });
    }
    return columns.map(col => ({ ...col, width: `${100 / columns.length}%` }));
  }

  render() {
    const { dataSource = [] } = this.state;
    const { isEdit = false } = this.props;
    return (
      <React.Fragment>
        <Form className="m-form">
          <div>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            {isEdit && <Button className="factor-bottom m-btn-table-headColor" style={{ margin: '0 0 10px 0' }} onClick={this.handleRowAdd}>新增</Button>}
          </div>
          {
            isEdit ? (
              <Table
                rowKey="TBL_COL"
                size="middle"
                className="mot-prod-no-border-table"
                bordered={false}
                columns={this.fetchColumns()}
                dataSource={dataSource}
                pagination={false}
              />
          ) : (
            <Table
              rowKey="TBL_COL"
              size="middle"
              bordered={false}
              columns={this.fetchColumns2()}
              dataSource={dataSource}
              pagination={false}
            />
          )}
        </Form>
      </React.Fragment>
    );
  }
}
export default Form.create()(FieldDetail);

