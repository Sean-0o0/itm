/**
 * 合同签署流程发起弹窗页面
 */
import {
  Row,
  Col,
  Popconfirm,
  Modal,
  Form,
  Input,
  Table,
  DatePicker,
  message,
  Select,
  Spin,
} from 'antd';

const {Option} = Select;
import React from 'react';
import {connect} from "dva";
import OperateTab from "./OperateTab";

const columns = [
  {
    title: '标题',
    dataIndex: 'BT',
  },
  {
    title: '文号',
    dataIndex: 'WH',
  },
  {
    title: '拟稿日期',
    dataIndex: 'NGRQ',
  },
  {
    title: '文件类别',
    dataIndex: 'WJLB',
  },
];

const data = [];
for (let i = 0; i < 21; i++) {
  data.push({
    key: i,
    BT: `标题${i}`,
    WH: i,
    NGRQ: '2017-02-15',
    WJLB: `文件类别${i}`,
  });
}

class AssociatedFile extends React.Component {
  state = {
    isSpinning: false,
    selectedRowKeys: [],
  }

  componentDidMount() {

  }

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({selectedRowKeys});
  };


  render() {
    const {
      isSpinning = false,
      selectedRowKeys
    } = this.state;
    const {associatedFileVisible, dictionary: {LCJJCD = [], YZLX = []}} = this.props;
    const {getFieldDecorator, getFieldValue, setFieldsValue} = this.props.form;
    const userBasicInfo = JSON.parse(window.sessionStorage.getItem('userBasicInfo'));
    const basicFormItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (<>
      <Modal wrapClassName='editMessage-modify' width={'180rem'}
             title={null}
             zIndex={100}
             bodyStyle={{
               padding: '0'
             }}
        // onOk={e => this.handleFormValidate(e)}
             onCancel={this.props.closeAssociatedFileModal}
             visible={associatedFileVisible}>
        <div style={{
          height: '6.2496rem',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#3361FF',
          color: 'white',
          marginBottom: '2.3808rem',
          padding: '0 3.5712rem',
          borderRadius: '1.1904rem 1.1904rem 0 0',
          fontSize: '2.333rem'
        }}>
          <strong>关联文件搜索</strong>
        </div>
        <Spin spinning={isSpinning} tip='加载中' size='large' wrapperClassName='diy-style-spin'>
          <div style={{padding: '0 3.5712rem'}}>
            <div className="steps-content">
              <div>
                <OperateTab/>
              </div>
              <Table rowSelection={rowSelection} columns={columns} dataSource={data}/>
            </div>
          </div>
        </Spin>
      </Modal></>);
  }


}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(Form.create()(AssociatedFile));
