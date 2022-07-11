/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/no-unused-state */
import React, { Fragment } from 'react';
import { Row, Col, Button, Table, Form, Radio, Input, Select, message } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';
import { getDictKey } from '../../../../../../../utils/dictUtils';

const { Option } = Select;
/**
 * 考评人员结构配置
 */

class VariableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      data: '',
      sjlx: '1',
      kjlx: '1',
      sfyxzdy: '0',
      variabletype: '',
    };
  }
  componentDidMount() {
  }
  onAdd = () => {
    this.setState({ visible: true, data: '', selectedRowKeys: [], variabletype: 'add' });
  }
  onDelete = () => {
    const { selectedRowKeys } = this.state;
    const { blData } = this.props;
    if (selectedRowKeys.length === 0) {
      message.error('未选中记录');
    } else {
      selectedRowKeys.sort((a, b) => { return -(a - b); });
      selectedRowKeys.forEach((item) => {
        blData.splice(item, 1);
      });
    }
    const { setData } = this.props;
    if (setData) {
      setData('blData', blData);
    }
    this.setState({ selectedRowKeys: [] });
  }
  onEdit = () => {
    const { selectedRowKeys } = this.state;
    const { blData } = this.props;
    if (selectedRowKeys.length === 0) {
      message.error('未选中记录');
    } else if (selectedRowKeys.length > 1) {
      message.error('每次只能修改一条');
    } else {
      const data = blData[selectedRowKeys[0]];
      const kjlx = blData[selectedRowKeys[0]].CTL_TP;
      this.setState({ visible: true, data, kjlx, variabletype: 'edit' });
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
      kjlx: '1',
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
    const { blData, setData } = this.props;
    const { selectedRowKeys, variabletype } = this.state;
    let type = true;
    blData.forEach((item) => {
      if (item.VAR_CODE === inParams.BLDM && variabletype === 'add') {
        message.error('变量代码重复，请重新输入!');
        type = false;
      }
    });
    if (!type) {
      return;
    }
    const Data = {
      VAR_CODE: inParams.BLDM,
      VAR_DESC: inParams.BLMS,
      DATA_TP: inParams.SJLX,
      CTL_TP: inParams.KJLX,
      DATA_SOURCE: inParams.KJLX === '2' ? inParams.SJY : '',
      VAL_FMLA: inParams.KJLX === '2' ? inParams.QZGS : '',
      WTHR_ALOW_DEF: inParams.SFYXZDY ? inParams.SFYXZDY : '0',
    };
    if (selectedRowKeys.length === 0) {
      const data = {
        VAR_NO: Number(blData.length + 1).toString(),
        ...Data,
      };
      blData.push(data);
    } else {
      const index = selectedRowKeys[0];
      const data = {
        VAR_NO: blData[index].VAR_NO,
        ...Data,
      };
      blData[index] = data;
    }
    if (setData) {
      setData('blData', blData);
    }
    this.setState({
      visible: false,
      data: '',
      kjlx: '1',
    });
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };
  fetchYYBColums = (sjlxDicts, kjlxDicts, sfzdyDicts) => {
    const columns = [
      {
        title: '变量代码',
        dataIndex: 'VAR_CODE',
        key: 'VAR_CODE',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '变量描述',
        dataIndex: 'VAR_DESC',
        key: 'VAR_DESC',
        textAlign: 'left',
        width: '20%',
      },
      {
        title: '数据类型',
        dataIndex: 'DATA_TP',
        key: 'DATA_TP',
        textAlign: 'left',
        width: '10%',
        render: (text) => {
          let sjlx = '';
          sjlxDicts.forEach((item) => {
            if (item.ibm === text) {
              sjlx = item.note;
            }
          });
          return sjlx;
        },
      },
      {
        title: '控件类型',
        dataIndex: 'CTL_TP',
        key: 'CTL_TP',
        textAlign: 'left',
        width: '10%',
        render: (text) => {
          let kjlx = '';
          kjlxDicts.forEach((item) => {
            if (item.ibm === text) {
              kjlx = item.note;
            }
          });
          return kjlx;
        },
      },
      {
        title: '数据源',
        dataIndex: 'DATA_SOURCE',
        key: 'DATA_SOURCE',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '取值公式',
        dataIndex: 'VAL_FMLA',
        key: 'VAL_FMLA',
        textAlign: 'left',
        width: '20%',
      },
      {
        title: '是否允许自定义',
        dataIndex: 'WTHR_ALOW_DEF',
        key: 'WTHR_ALOW_DEF',
        textAlign: 'left',
        width: '15%',
        render: (text) => {
          let sfzdy = '';
          sfzdyDicts.forEach((item) => {
            if (item.ibm === text) {
              sfzdy = item.note;
            }
          });
          return sfzdy;
        },
      },
    ];
    return columns;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys, visible, data, sjlx, kjlx, sfyxzdy } = this.state;
    const { dictionary = {}, type, blData, xskz } = this.props;
    const { [getDictKey('sjlx')]: sjlxDicts = [], [getDictKey('kjlx')]: kjlxDicts = [], [getDictKey('sfzdy')]: sfzdyDicts = [] } = dictionary; // MOT字典
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <Fragment>
        <Row style={{ paddingBottom: 20 }}>
          <div className="factor-content-title">变量定义</div>
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
                columns={this.fetchYYBColums(sjlxDicts, kjlxDicts, sfzdyDicts)}
                dataSource={blData}
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
            <Form className="factor-variable-form" onSubmit={this.handleSubmit}>
              <Row style={{ padding: '20px' }}>
                <Form.Item label={(<span>变量代码</span>)} >
                  {getFieldDecorator('BLDM', { initialValue: data.VAR_CODE !== undefined ? data.VAR_CODE : '', rules: [{ required: true, message: '请输入变量代码!' }] })(<Input className="mot-input" style={{ width: '300px' }} />)}
                </Form.Item>
                <Form.Item label={(<span>变量描述</span>)} >
                  {getFieldDecorator('BLMS', { initialValue: data.VAR_DESC !== undefined ? data.VAR_DESC : '', rules: [{ required: true, message: '请输入变量描述!' }] })(<Input className="mot-input" style={{ width: '300px' }} />)}
                </Form.Item>
                <Form.Item label={(<span>数据类型</span>)} >
                  {getFieldDecorator('SJLX', { initialValue: data.DATA_TP !== undefined ? data.DATA_TP : sjlx, rules: [{ required: true, message: '请选择数据类型!' }] })(<Select
                    style={{ width: '300px' }}
                    className="mot-select"
                  >
                    {sjlxDicts.map(item => <Option value={item.ibm}>{item.note}</Option>)}
                  </Select>)}
                </Form.Item>
                <Form.Item label={(<span>控件类型</span>)} >
                  {getFieldDecorator('KJLX', { initialValue: data.CTL_TP !== undefined ? data.CTL_TP : kjlx, rules: [{ required: true, message: '请选择控件类型!' }] })(<Select
                    style={{ width: '300px' }}
                    className="mot-select"
                    onChange={(e) => { this.onChange('kjlx', e); }}
                  >
                    {kjlxDicts.map(item => <Option value={item.ibm}>{item.note}</Option>)}
                  </Select>)}
                </Form.Item>
                {kjlx === '2' ? (
                  <Form.Item label={(<span>数据源</span>)} >
                    {getFieldDecorator('SJY', { initialValue: data.DATA_SOURCE !== undefined ? data.DATA_SOURCE : '', rules: [{ required: true, message: '请输入数据源!' }] })(<Input className="mot-input" style={{ width: '300px' }} />)}
                  </Form.Item>
) : ''}
                {kjlx === '2' ? (
                  <Form.Item label={(<span>取值公式</span>)} >
                    {getFieldDecorator('QZGS', { initialValue: data.VAL_FMLA !== undefined ? data.VAL_FMLA : '', rules: [{ required: true, message: '请输入取值公式!' }] })(<Input.TextArea className="mot-input" autosize={{ minRows: 2, maxRows: 4 }} style={{ width: '300px' }} />)}
                  </Form.Item>
) : ''}
                {xskz ? '' : (
                  <Form.Item label={(<span>是否允许自定义</span>)} style={{ marginLeft: 0 }} >
                    {getFieldDecorator('SFYXZDY', { initialValue: data.WTHR_ALOW_DEF !== undefined ? data.WTHR_ALOW_DEF : sfyxzdy, rules: [{ required: true, message: '请选择是否允许自定义!' }] })(<Radio.Group >{sfzdyDicts.map(item => <Radio className="tg-radio mot-radio" value={item.ibm}>{item.note}</Radio>)}</Radio.Group>)}
                  </Form.Item>
)}
              </Row>
            </Form>
          </BasicModal>
        </Row>
      </Fragment>
    );
  }
}
export default Form.create()(VariableTable);
