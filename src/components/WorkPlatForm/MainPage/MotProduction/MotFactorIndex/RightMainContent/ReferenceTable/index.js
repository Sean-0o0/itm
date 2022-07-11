/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-unused-state */
import React, { Fragment } from 'react';
import { Row, Col, Button, Table, Form, Radio, Input, Select, message } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';
import { FetchQueryStreamTable } from '../../../../../../../services/motProduction';

const { Option } = Select;
/**
 * 考评人员结构配置
 */

class ReferenceTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      data: '',
      blx: '1',
      lsjbList: [],
      lsjb: 0,
    };
  }
  componentDidMount() {
    this.FetchQueryStreamTable();
  }
  FetchQueryStreamTable = () => {
    FetchQueryStreamTable().then((ret = {}) => {
      const { records = [] } = ret;
      if (records && records.length > 0) {
        const one = { ibm: 0, note: '--请选择--', dataSrc: '', regTblNm: '', strmTblDesc: '' };
        const lsjbList = [];
        lsjbList.push(one);
        records.forEach((item, index) => {
          const Item = { ibm: index + 1, note: item.regTblNm, ...item };
          lsjbList.push(Item);
        });
        this.setState({ lsjbList });
      }
    }).catch(((error) => {
      message.error(!error.success ? error.message : error.note);
    }));
  }
  onAdd = () => {
    this.setState({ visible: true, data: '', selectedRowKeys: [] });
  }
  onDelete = () => {
    const { selectedRowKeys } = this.state;
    const { yybData } = this.props;
    if (selectedRowKeys.length === 0) {
      message.error('未选中记录');
    } else {
      selectedRowKeys.sort((a, b) => { return -(a - b); });
      selectedRowKeys.forEach((item) => {
        yybData.splice(item, 1);
      });
    }
    const { setData } = this.props;
    if (setData) {
      setData('yybData', yybData);
    }
    this.setState({ selectedRowKeys: [] });
  }
  f = (a, b) => { // 排序函数
    return -(a - b); // 取反并返回比较参数
  }
  onEdit = () => {
    const { selectedRowKeys, lsjbList } = this.state;
    const { yybData } = this.props;
    if (selectedRowKeys.length === 0) {
      message.error('未选中记录');
    } else if (selectedRowKeys.length > 1) {
      message.error('每次只能修改一条');
    } else {
      const data = yybData[selectedRowKeys[0]];
      const blx = yybData[selectedRowKeys[0]].TBL_TP;
      let lsjb = 0;
      if (blx === '2') {
        lsjbList.forEach((item, index) => {
          if (item.note === yybData[selectedRowKeys[0]].REG_TBL_NM) {
            lsjb = index;
          }
        });
      }
      this.setState({ visible: true, data, blx, lsjb });
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
      blx: '1',
      lsjb: 0,
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
    const { yybData, setData } = this.props;
    const { selectedRowKeys, lsjbList } = this.state;
    let lsjb = '';
    lsjbList.forEach((item) => {
      if (item.ibm === inParams.LSJB) {
        lsjb = item.note;
      }
    });
    const Data = {
      TBL_TP: inParams.BLX,
      SBRD_USR: inParams.BLX === '1' ? inParams.SJY : inParams.BSYZ,
      TBL_NM: inParams.BLX === '1' ? inParams.BM : inParams.LSJBBM,
      REG_TBL_NM: inParams.BLX === '1' ? inParams.ZCBM : inParams.LSJBZCBM,
      TBL_DESC: inParams.BLX === '1' ? inParams.BMS : inParams.LSJBBMS,
      TBL_FLD: inParams.BLX === '1' ? inParams.YYZD : '',
      FLTR_COND: inParams.BLX === '1' ? inParams.GLTJ : '',
      STRM_TBL_TP: inParams.BLX === '1' ? '' : inParams.LSJBLX,
    };
    if (selectedRowKeys.length === 0) {
      const data = {
        TBL_NO: Number(yybData.length + 1).toString(),
        ...Data,
      };
      yybData.push(data);
    } else {
      const index = selectedRowKeys[0];
      const data = {
        TBL_NO: yybData[index].TBL_NO,
        ...Data,
      };
      yybData[index] = data;
    }
    if (setData) {
      setData('yybData', yybData);
    }
    this.setState({
      visible: false,
      data: '',
      blx: '1',
      lsjb: 0,
    });
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };
  fetchYYBColums = (blxDicts) => {
    const columns = [
      {
        title: '表类型',
        dataIndex: 'STRM_TBL_TP',
        key: 'STRM_TBL_TP',
        textAlign: 'left',
        width: '10%',
        render: (text) => {
          let blx = '';
          if (text == "1") {
            blx = "流数据表-计算触发"
          } else if (text == '') {
            blx = '实体'
          } else if (text == "2") {
            blx = "流数据表-数据加载"
          }
          return blx;
        },
      },
      {
        title: '数据源',
        dataIndex: 'SBRD_USR',
        key: 'SBRD_USR',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '表名',
        dataIndex: 'TBL_NM',
        key: 'TBL_NM',
        textAlign: 'left',
        width: '15%',
      },
      {
        title: '注册表名',
        dataIndex: 'REG_TBL_NM',
        key: 'REG_TBL_NM',
        textAlign: 'left',
        width: '20%',
      },
      {
        title: '表描述',
        dataIndex: 'TBL_DESC',
        key: 'TBL_DESC',
        textAlign: 'left',
        width: '20%',
      },
      {
        title: '引用字段',
        dataIndex: 'TBL_FLD',
        key: 'TBL_FLD',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '过滤条件',
        dataIndex: 'FLTR_COND',
        key: 'FLTR_COND',
        textAlign: 'left',
        width: '10%',
      },
    ];
    return columns;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys, visible, data, blx, lsjbList, lsjb } = this.state;
    const { blxDicts, type, yybData } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <Fragment>
        <Row style={{ paddingBottom: 20 }}>
          <div className="factor-content-title">引用表定义</div>
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
                columns={this.fetchYYBColums(blxDicts, yybData)}
                dataSource={yybData}
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
                <Form.Item label={(<span>表类型</span>)} className="factor-item" >
                  {getFieldDecorator('BLX', { initialValue: data.TBL_TP !== undefined ? data.TBL_TP : blx, rules: [{ required: true, message: '请选择表类型!' }] })(<Radio.Group onChange={(e) => { this.onChange('blx', e.target.value); }}>{blxDicts.map(item => <Radio className="tg-radio mot-radio" value={item.ibm}>{item.note}</Radio>)}</Radio.Group>)}
                </Form.Item>
                {blx === '2' ? (
                  <Form.Item label={(<span>流数据表</span>)} className="factor-item" >
                    {getFieldDecorator('LSJB', { initialValue: lsjb, rules: [{ required: true, message: '请输入注册表名!' }] })(<Select
                      style={{ width: '300px' }}
                      className="mot-select"
                      onChange={(e) => { this.onChange('lsjb', e); }}
                    >
                      {lsjbList.map(item => <Option value={item.ibm}>{item.note}</Option>)}
                    </Select>)}
                  </Form.Item>
                ) : ''}
                {blx === '2' ? (
                  <Form.Item label={(<span>表所有者</span>)} className="factor-item" >
                    {getFieldDecorator('BSYZ', { initialValue: lsjbList.length !== 0 ? lsjbList[lsjb].dataSrc : '', rules: [{ required: true, message: '请选择数据源!' }] })(<Input className="mot-input" style={{ width: '300px' }} />)}
                  </Form.Item>
                ) : ''}
                {blx === '2' ? (
                  <Form.Item label={(<span>表名</span>)} className="factor-item" >
                    {getFieldDecorator('LSJBBM', { initialValue: lsjbList.length !== 0 ? lsjbList[lsjb].regTblNm : '', rules: [{ required: true, message: '请输入表名!' }] })(<Input className="mot-input" style={{ width: '300px' }} />)}
                  </Form.Item>
                ) : ''}
                {blx === '2' ? (
                  <Form.Item label={(<span>注册表名</span>)} className="factor-item" >
                    {getFieldDecorator('LSJBZCBM', { initialValue: lsjbList.length !== 0 ? lsjbList[lsjb].regTblNm : '', rules: [{ required: true, message: '请输入注册表名!' }] })(<Input className="mot-input" style={{ width: '300px' }} />)}
                  </Form.Item>
                ) : ''}
                {blx === '2' ? (
                  <Form.Item label={(<span>表描述</span>)} className="factor-item" >
                    {getFieldDecorator('LSJBBMS', { initialValue: lsjbList.length !== 0 ? lsjbList[lsjb].strmTblDesc : '', rules: [{ required: true, message: '请输入表描述!' }] })(<Input.TextArea className="mot-input" autosize={{ minRows: 2, maxRows: 4 }} style={{ width: '300px' }} />)}
                  </Form.Item>
                ) : ''}
                {blx === '2' ? (
                  <Form.Item label={(<span>流表类型</span>)} className="factor-item">
                    {getFieldDecorator('LSJBLX', { initialValue: data.STRM_TBL_TP !== undefined ? data.STRM_TBL_TP : '', rules: [{ required: true, message: '请选择流数据表类型' }] })(
                      <Radio.Group>
                        <Radio className="tg-radio mot-radio" value={"1"}>计算触发</Radio>
                        <Radio className="tg-radio mot-radio" value={"2"}>数据加载</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                ) : ''}
                {blx === '1' ? (
                  <Form.Item label={(<span>数据源</span>)} className="factor-item" >
                    {getFieldDecorator('SJY', { initialValue: data.SBRD_USR !== undefined && data.TBL_TP === '1' ? data.SBRD_USR : '', rules: [{ required: true, message: '请选择数据源!' }] })(<Input className="mot-input" style={{ width: '300px' }} />)}
                  </Form.Item>
                ) : ''}
                {blx === '1' ? (
                  <Form.Item label={(<span>表名</span>)} className="factor-item" >
                    {getFieldDecorator('BM', { initialValue: data.TBL_NM !== undefined && data.TBL_TP === '1' ? data.TBL_NM : '', rules: [{ required: true, message: '请输入表名!' }] })(<Input className="mot-input" style={{ width: '300px' }} />)}
                  </Form.Item>
                ) : ''}
                {blx === '1' ? (
                  <Form.Item label={(<span>注册表名</span>)} className="factor-item" >
                    {getFieldDecorator('ZCBM', { initialValue: data.REG_TBL_NM !== undefined && data.TBL_TP === '1' ? data.REG_TBL_NM : '', rules: [{ required: true, message: '请输入注册表名!' }] })(<Input className="mot-input" style={{ width: '300px' }} />)}
                  </Form.Item>
                ) : ''}
                {blx === '1' ? (
                  <Form.Item label={(<span>表描述</span>)} className="factor-item" >
                    {getFieldDecorator('BMS', { initialValue: data.TBL_DESC !== undefined && data.TBL_TP === '1' ? data.TBL_DESC : '', rules: [{ required: true, message: '请输入表描述!' }] })(<Input.TextArea className="mot-input" autosize={{ minRows: 2, maxRows: 4 }} style={{ width: '300px' }} />)}
                  </Form.Item>
                ) : ''}
                {blx === '1' ? (
                  <Form.Item label={(<span>引用字段</span>)} className="factor-item" >
                    {getFieldDecorator('YYZD', { initialValue: data.TBL_FLD !== undefined ? data.TBL_FLD : '' })(<Input className="mot-input" style={{ width: '300px' }} />)}
                  </Form.Item>
                ) : ''}
                {blx === '1' ? (
                  <Form.Item label={(<span>过滤条件</span>)} className="factor-item" >
                    {getFieldDecorator('GLTJ', { initialValue: data.FLTR_COND !== undefined ? data.FLTR_COND : '' })(<Input.TextArea className="mot-input" autosize={{ minRows: 2, maxRows: 4 }} style={{ width: '300px' }} />)}
                  </Form.Item>
                ) : ''}
              </Row>
            </Form>
          </BasicModal>
        </Row>
      </Fragment>
    );
  }
}
export default Form.create()(ReferenceTable);
