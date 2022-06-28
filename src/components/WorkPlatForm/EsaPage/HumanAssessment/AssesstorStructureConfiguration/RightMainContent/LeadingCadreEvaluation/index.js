
/* eslint-disable react/jsx-indent */
import React from 'react';
import { Form, Row, Select, Button, Table, Input, Modal } from 'antd';
import TargetEvaluationSelect from './TargetEvaluationSelect';
import AppraiserSelect from '../AppraiserSelect';

const { Option } = Select;
/**
 * 右侧配置主要内容
 */

class LeadingCadreEvaluation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idxData: { },
      labelList: [],
      type: 0,
      data: [],
      kpdxVisible: false,
      kpdxData: {},
      kpryVisible: false,
      kpryData: [],
    };
  }
  componentDidMount() {
    this.fetchState();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.companyData !== this.props.companyData && nextProps.companyData.grade === '0') {
      this.setState({
        type: 1,
        idxData: { bmfzr: '董事长', kpdx: '某某' },
        data: [{ kpzt: '董事长', kpr: '杨某某,刘某某', qz: '5' }, { kpzt: '分管领导', kpr: '张某某', qz: '2' }],
      });
    } else {
      this.setState({
        type: 0,
        idxData: {},
        data: [],
      });
    }
  }
  // eslint-disable-next-line react/sort-comp
  fetchState = () => {
    this.setState({
      type: 0,
      idxData: { bmfzr: '董事长', kpdx: '某某' },
      data: [{ kpzt: '董事长', kpr: '杨某某,刘某某', qz: '5' }, { kpzt: '分管领导', kpr: '张某某', qz: '2' }],
      labelList: [{ lbLId: '0', lblNm: '福州营业部绩效考核方案' }, { lbLId: '1', lblNm: '内部绩效考核方案' }],
    });
  }
  onSubmit = () => {
    this.setState({
      type: 1,
    });
  }

  setType = () => {
    this.setState({
      type: 0,
    });
  }

  changeTable = (e, index) => {
    const qz = e.target.value;
    const { data } = this.state;
    data[index].qz = qz;
    this.setState({
      data,
    });
  }
  kpdxVisible = () => {
    this.setState({
      kpdxVisible: true,
    });
  }
  kpdxSelect = (value) => {
    this.setState({
      kpdxData: value,
    });
  }
  handleOk = () => {
    const { kpdxData } = this.state;
    this.setState({
      idxData: { kpdx: kpdxData.rymc },
      kpdxVisible: false,
    });
  }
  handleCancel = () => {
    this.setState({
      kpdxVisible: false,
    });
  }
  kpryVisible = () => {
    this.setState({
      kpryVisible: true,
    });
  }
  kprySelect = (value) => {
    this.setState({
      kpryData: value,
    });
  }
  handleKpryOk = () => {
    const { kpryData } = this.state;
    const newData = [];
    kpryData.forEach((item) => {
      if (item.grade === '0') {
        const kpzt = item.yybmc;
        const qz = item.yyqz;
        const newList = [];
        kpryData.forEach((listItem) => {
          if (listItem.fid === item.yybid) {
            newList.push(listItem.yybmc);
          }
        });
        const kpr = newList.toString();
        newData.push({ kpzt, kpr, qz });
      }
    });
    this.setState({
      data: newData,
      kpryVisible: false,
    });
  }
  handleKpryCancel = () => {
    this.setState({
      kpryVisible: false,
    });
  }
  fetchColums = () => {
    const columns = [
      {
        title: '考评主体',
        dataIndex: 'kpzt',
        key: 'kpzt',
        width: '25%',
        textAlign: 'left',
      },
      {
        title: '考评人',
        dataIndex: 'kpr',
        key: 'kpr',
        width: '50%',
        textAlign: 'left',
      },
      {
        title: '权重（%）',
        dataIndex: 'qz',
        key: 'qz',
        width: '25%',
        textAlign: 'left',
        render: (text, index) => {
          return (
                <Input disabled={this.state.type !== 0} value={text} onChange={e => this.changeTable(e, index)} />
          );
        },
      },
    ];
    return columns;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { idxData, labelList, type, data, kpdxVisible, kpryVisible } = this.state;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Row style={{ margin: '0 16px' }}>
          <Form.Item label="部门负责人" style={{ marginBottom: '0.833rem' }}>
            <div style={{ width: '226px' }}>{idxData.bmfzr}</div>
          </Form.Item>
        <Button className="fcbtn m-btn-border m-btn-border-headColor" style={{ backgroundColor: '#EFF6FF', marginTop: '0.4rem', marginLeft: '3rem' }} >
              {type !== 0 ? <a onClick={() => this.setType()}>编辑</a> : <a onClick={() => this.onSubmit()}>保存</a>}
        </Button>
        </Row>
        <Row style={{ margin: '0 16px' }}>
          <Form.Item label="考评对象" style={{ marginBottom: '0.833rem' }}>
            {getFieldDecorator('KPDX', { initialValue: idxData.kpdx !== undefined ? idxData.kpdx : '' })(<Input
              style={{ width: '240px' }}
              readonly
              disabled={type !== 0}
              suffix={type !== 0 ? '' : <i className="iconfont icon-ss" style={{ fontSize: '15px' }} onClick={() => this.kpdxVisible()} />}
            />)}
          </Form.Item>
        </Row>
        <Row style={{ margin: '0 16px' }}>
          <Form.Item label="考评方案" style={{ marginBottom: '0.833rem' }}>
            {getFieldDecorator('KPFA', { initialValue: idxData.actvLbl !== undefined ? idxData.actvLbl : '0' })(<Select
              style={{ width: '240px' }}
              disabled={type !== 0}
            >
              {labelList.map(item => (
                <Option value={item.lbLId}>{item.lblNm}</Option>
                    ))}
                                                                                                                </Select>)}
          </Form.Item>
        </Row>
        <Row style={{ margin: '0 16px' }}>
          <Form.Item label="考评人员" style={{ marginBottom: '0.833rem' }}>
          {getFieldDecorator('KPRY')(<Button
            className={type !== 0 ? '' : 'fcbtn m-btn-border m-btn-border-headColor'}
            style={{ backgroundColor: '#EFF6FF', marginTop: '0.4rem' }}
            onClick={() => this.kpryVisible()}
            disabled={type !== 0}
          >
              选择
                                     </Button>)}
          </Form.Item>
        </Row>
        <Row style={{ margin: '0 86px' }}>
        <Table
          className="tg-table"
          style={{ minWidth: '300px' }}
          columns={this.fetchColums()}
          dataSource={data}
          pagination={false}
          size="middle "
          bordered={false}
        />
        </Row>
        <Modal
          title="选择记录"
          visible={kpdxVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="800px"
        >
          <TargetEvaluationSelect kpdxSelect={this.kpdxSelect} />
        </Modal>
        <Modal
          title="选择"
          visible={kpryVisible}
          onOk={this.handleKpryOk}
          onCancel={this.handleKpryCancel}
          width="800px"
        >
          <AppraiserSelect kprySelect={this.kprySelect} checkData={data} />
        </Modal>
      </Form>
    );
  }
}

export default Form.create()(LeadingCadreEvaluation);
