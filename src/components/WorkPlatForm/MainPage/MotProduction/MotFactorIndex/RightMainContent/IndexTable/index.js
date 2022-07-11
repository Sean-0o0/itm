/* eslint-disable react/no-unused-state */
import React, { Fragment } from 'react';
import { Row, Col, Button, Table, Form, Input, message } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';

/**
 * 指标定义
 */

class IndexTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      data: '',
    };
  }
  componentDidMount() {
  }
  onAdd = () => {
    this.setState({ visible: true, data: '', selectedRowKeys: [] });
  }
  onDelete = () => {
    const { selectedRowKeys } = this.state;
    const { zbData } = this.props;
    if (selectedRowKeys.length === 0) {
      message.error('未选中记录');
    } else {
      selectedRowKeys.sort((a, b) => { return -(a - b); });
      selectedRowKeys.forEach((item) => {
        zbData.splice(item, 1);
      });
    }
    const { setData } = this.props;
    if (setData) {
      setData('zbData', zbData);
    }
    this.setState({ selectedRowKeys: [] });
  }
  onEdit = () => {
    const { selectedRowKeys } = this.state;
    const { zbData } = this.props;
    if (selectedRowKeys.length === 0) {
      message.error('未选中记录');
    } else if (selectedRowKeys.length > 1) {
      message.error('每次只能修改一条');
    } else {
      const data = zbData[selectedRowKeys[0]];
      this.setState({ visible: true, data });
    }
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
      data: '',
    });
  }
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      // 提交创建组合
      if (!err) {
        this.setState({ loading: true }, () => this.createFun(values));
      }
    });
  }
  createFun = (inParams) => {
    const { zbData, setData } = this.props;
    const { selectedRowKeys } = this.state;
    let type = true;


    const Data = {
      IDX_CODE: inParams.ZBBM,
      IDX_DESC: inParams.ZBMC,
    };
    if (selectedRowKeys.length === 0) {
      zbData.forEach((item) => {
        if (item.IDX_CODE === inParams.ZBBM) {
          message.error('指标编码重复，请重新输入!');
          type = false;
        }
      });
      zbData.forEach((item) => {
        if (item.IDX_DESC === inParams.ZBMC) {
          message.error('指标名称重复，请重新输入!');
          type = false;
        }
      });
      if (!type) {
        return;
      }
      const data = {
        IDX_NO: Number(zbData.length + 1).toString(),
        ...Data,
      };
      zbData.push(data);
    } else {
      const index = selectedRowKeys[0];
      const data = {
        IDX_NO: zbData[index].IDX_NO,
        ...Data,
      };
      zbData[index] = data;
    }
    if (setData) {
      setData('zbData', zbData);
    }
    this.setState({
      visible: false,
      data: '',
    });
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };
  fetchYYBColums = () => {
    const columns = [
      {
        title: '指标编码',
        dataIndex: 'IDX_CODE',
        key: 'IDX_CODE',
        textAlign: 'left',
      },
      {
        title: '指标名称',
        dataIndex: 'IDX_DESC',
        key: 'IDX_DESC',
        textAlign: 'left',
      },
    ];
    return columns;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys, visible, data } = this.state;
    const { type, zbData } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <Fragment>
        <Row style={{ paddingBottom: 20 }}>
          <div className="factor-content-title">指标定义</div>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="factor-item">
              {
                type ? '' : (
                  <span><Button className="factor-bottom m-btn-table-headColor" onClick={this.onAdd} >新增</Button>
                    <Button className="factor-bottom m-btn-table-headColor" onClick={this.onDelete} >删除</Button>
                    <Button className="factor-bottom m-btn-table-headColor" onClick={this.onEdit} >修改</Button>
                  </span>
)}
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="factor-item">
              <Table
                className="factor-table"
                rowSelection={type ? '' : rowSelection}
                style={{ minWidth: '300px', marginRight: '2.6rem' }}
                columns={this.fetchYYBColums()}
                dataSource={zbData}
                pagination={false}
                size="middle "
                bordered={false}
              />
            </div>
          </Col>
          <BasicModal
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width="500px"
          >
            <Form className="factor-form" onSubmit={this.handleSubmit}>
              <Row style={{ padding: '20px' }}>
                <Form.Item label={(<span>指标编码</span>)} className="factor-item" >
                  {getFieldDecorator('ZBBM', { initialValue: data.IDX_CODE !== undefined ? data.IDX_CODE : '', rules: [{ required: true, message: '请输入指标编码!' }] })(<Input className="mot-input" style={{ width: '300px' }} />)}
                </Form.Item>
                <Form.Item label={(<span>指标名称</span>)} className="factor-item" >
                  {getFieldDecorator('ZBMC', { initialValue: data.IDX_DESC !== undefined ? data.IDX_DESC : '', rules: [{ required: true, message: '请输入指标编码!' }] })(<Input className="mot-input" style={{ width: '300px' }} />)}
                </Form.Item>
              </Row>
            </Form>
          </BasicModal>
        </Row>
      </Fragment>
    );
  }
}
export default Form.create()(IndexTable);
