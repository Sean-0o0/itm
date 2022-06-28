/* eslint-disable react/sort-comp */
import React from 'react';
import { Table, Button, Popconfirm, Form, message } from 'antd';
import EditableCell from './EditableCell';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableTable extends React.Component {
  state = {
    columns: [],
    // rowCount: 0, // 行数
  }

  componentDidMount() {
    this.assembleColumns(this.props, true);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.tempParams) !== JSON.stringify(nextProps.tempParams)) {
      this.assembleColumns(nextProps, false);
    }
  }

  assembleColumns = (props, isFirstCall) => {
    const { tempParams } = props;
    const columns = [];
    // 构建columns
    tempParams.forEach((item) => {
      columns.push({
        title: item.descr,
        dataIndex: `FLD${item.corrCol}`,
        key: `FLD${item.corrCol}`,
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
      render: (text, record, index) => (
        <Popconfirm title="确认删除？" onConfirm={() => this.handleDelete(record.key, record, index)}>
          <a>删除</a>
        </Popconfirm>
      ),
    });
    this.setState({ columns });
    if (!isFirstCall && this.props.updatePayload) {
      this.props.updatePayload({ tempData: [] });
    }
  }


  handleDelete = (key, record, delelteIndex) => {
    const { templateArr = [] } = this.props;

    const temp = templateArr.filter((item, index) => {
      return delelteIndex !== index;
    });
    this.props.onTemplateArrChange(temp);
  }

  handleAdd = () => {
    const { tempParams = [], templateArr = [] } = this.props;


    // 全为空的数据只能有一条;
    let hasNullData = false;
    templateArr.forEach((item) => {
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

    // 添加行
    // 根据查询参数变量数组，确定添加对象的变量数
    const tempArr = templateArr;
    const obj = {};
    tempParams.forEach((item, index) => {
      obj[`FLD${index}`] = '';
    });

    tempArr.push(obj);

    this.props.onTemplateArrChange(tempArr);
  }

  handleSave = () => {
    // const { tempParams = [], templateArr = [] } = this.props;
    // const { payload: { tempData } } = this.props;
    // const newData = [...tempData];
    // const index = newData.findIndex(item => row.key === item.key);
    // const item = newData[index];
    // newData.splice(index, 1, {
    //   ...item,
    //   ...row,
    // });
    // if (this.props.updatePayload) {
    //   this.props.updatePayload({ tempData: newData });
    // }
  }

  render() {
    const { templateArr = [] } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.state.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record, rowIndex) => ({
          record,
          rowIndex,
          editable: col.editable,
          dataIndex: col.dataIndex,
          minVal: col.minVal,
          maxVal: col.maxVal,
          title: col.title,
          templateArr,
          onTemplateArrChange: this.props.onTemplateArrChange,
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
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={templateArr}
          columns={columns}
          pagination={false}
          scroll={{ x: true }}
        />
      </div>
    );
  }
}

export default EditableTable;
