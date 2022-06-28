/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Table, Button, message, Modal } from 'antd';
import EditableCell from './EditableCell';
import EditableRow from './EditableRow';

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
    };
  }

  componentDidMount() {
    this.assembleColumns(this.props);
    this.handleData();
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.royaltyFormulaParamData) !== JSON.stringify(nextProps.royaltyFormulaParamData)) {
      this.assembleColumns(nextProps);
      this.handleData();
    }
  }

  handleData = () => {
    const { templateParamData, updateTemplateParamData } = this.props;
    const tempData = [];
    templateParamData.forEach((item = {}, index) => {
      const tObj = { key: index };
      const keys = Object.keys(item).filter(m => m !== 'key');
      keys.forEach((m) => {
        if (item[m]) {
          tObj[m] = Number(item[m]);
        }
      });
      tempData.push(tObj);
    });
    if (updateTemplateParamData) {
      updateTemplateParamData(tempData);
    }
  }
  assembleColumns = (props) => {
    const { royaltyFormulaParamData } = props;
    const columns = [];
    // 构建columns
    royaltyFormulaParamData.forEach((item) => {
      columns.push({
        title: item.name,
        dataIndex: `fld${item.seq}`,
        editable: true,
        minVal: item.minVal,
        maxVal: item.maxVal,
      });
    });
    // columns添加操作列
    columns.push({
      title: '操作',
      dataIndex: 'operation',
      width: 50,
      render: (_text, record) => (
        <a onClick={() => this.handleDeleteConfirm(record)}>删除</a>
      ),
    });
    this.setState({ columns });
  }
  // 删除确认框
  handleDeleteConfirm = (record) => {
    const { theme = 'blue-dark-theme' } = this.props;
    Modal.confirm({
      title: '确认删除？',
      cancelText: '取消',
      okText: '确定',
      centered: true,
      className: theme,
      okButtonProps: { className: 'm-btn-radius m-btn-headColor', style: { marginLeft: 0 } },
      cancelButtonProps: { className: 'm-btn-radius m-btn-gray' },
      onOk: () => { this.handleDelete(record.key) },
      onCancel() { },
    });
  }
  handleDelete = (key) => {
    const { templateParamData = [], updateTemplateParamData } = this.props;
    const dataSource = [...templateParamData];
    if (updateTemplateParamData) {
      updateTemplateParamData(dataSource.filter(item => item.key !== key));
    }
  }

  handleAdd = () => {
    const { royaltyFormulaParamData = [], updateTemplateParamData, templateParamData = [] } = this.props;
    // 全为空的数据只能有一条
    let hasNullData = false;
    templateParamData.forEach((item) => {
      const keys = Object.keys(item).filter(m => m !== 'key');
      const values = Object.values(item);
      const tmpl = keys.map(m => item[m]);
      if (tmpl.filter(m => m !== '').length === 0) {
        hasNullData = true;
        message.warning('请先填写上一次添加的行数据');
        return false;
      }
      if (values.filter(m => m === '').length > 0) {
        hasNullData = true;
        message.warning('请完善添加行各列的数据');
        return false;
      }
    });
    if (hasNullData) {
      return;
    }
    // 构建新数据格式
    const newData = { key: new Date().getTime() };
    royaltyFormulaParamData.forEach((item) => {
      newData[`fld${item.seq}`] = '';
    });
    // 更新数据
    templateParamData.push(newData);
    if (updateTemplateParamData) {
      updateTemplateParamData(templateParamData);
    }
  }

  handleSave = (row) => {
    const { templateParamData, updateTemplateParamData } = this.props;
    const newData = [...templateParamData];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    if (updateTemplateParamData) {
      updateTemplateParamData(newData);
    }
  }

  render() {
    const { templateParamData } = this.props;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.state.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          minVal: col.minVal,
          maxVal: col.maxVal,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Button className="m-btn-radius m-btn-headColor" onClick={this.handleAdd} style={{ marginBottom: 16 }}>添加</Button>
        <Table
          className="m-table-customer"
          components={components}
          rowKey="key"
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={templateParamData}
          columns={columns}
          pagination={false}
          scroll={{ x: true }}
        />
      </div>
    );
  }
}

export default EditableTable;
