
/* eslint-disable react/jsx-indent */
import React from 'react';
import { Form, Row, Select, Button, Table, Input, Modal } from 'antd';
import AppraiserSelect from '../AppraiserSelect';

const { Option } = Select;
/**
 * 右侧配置主要内容
 */

class DepartmentalEvaluation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idxData: [],
      labelList: [{ lbLId: '0', lblNm: '福州营业部绩效考核方案' }, { lbLId: '1', lblNm: '内部绩效考核方案' }],
      type: 0,
      data: [],
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
        data: [{ kpzt: '董事长', kpr: '杨某某,刘某某', qz: '5' }, { kpzt: '分管领导', kpr: '张某某', qz: '2' }],
      });
    } else {
      this.setState({
        type: 0,
        data: [],
      });
    }
  }
  // eslint-disable-next-line react/sort-comp
  fetchState = () => {
    this.setState({
      type: 0,
      idxData: { kpfa: '0' },
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

  changeTable = (e, value) => {
    const qz = e.target.value;
    const { data } = this.state;
    data.forEach((item, index) => {
      if (item.kpzt.indexOf(value.kpzt) > -1) {
        data[index].qz = qz;
        this.setState({
          data,
        });
      }
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
  handleOk = () => {
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
  handleCancel = () => {
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
        render: (text, record) => {
          return (
                <Input disabled={this.state.type !== 0} value={text} onChange={e => this.changeTable(e, record)} />
          );
        },
      },
    ];
    return columns;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { idxData, labelList, type, data, kpryVisible } = this.state;
    //console.log(data);
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Row style={{ margin: '0 16px' }}>
          <Form.Item label="考评方案" style={{ marginBottom: '0.833rem' }}>
            {getFieldDecorator('KPFA', { initialValue: idxData.kpfa !== undefined ? idxData.kpfa : '' })(<Select
              style={{ width: '240px' }}
              disabled={type !== 0}
            >
              {labelList.map(item => (
                <Option value={item.lbLId}>{item.lblNm}</Option>
                    ))}
                                                                                                         </Select>)}
          </Form.Item>
        <Button className="fcbtn m-btn-border m-btn-border-headColor" style={{ backgroundColor: '#EFF6FF', marginTop: '0.4rem', marginLeft: '3rem' }} >
              {type !== 0 ? <a onClick={() => this.setType()}>编辑</a> : <a onClick={() => this.onSubmit()}>保存</a>}
        </Button>
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
        <Modal
          title="选择"
          visible={kpryVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="800px"
        >
          <AppraiserSelect kprySelect={this.kprySelect} checkData={data} />
        </Modal>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(DepartmentalEvaluation);
