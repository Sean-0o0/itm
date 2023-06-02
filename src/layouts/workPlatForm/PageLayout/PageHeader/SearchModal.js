/**
 * 邮件发送弹窗页面
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
  Radio,
  TreeSelect,
  InputNumber,
  Upload,
  Button,
  Icon, Divider, Tooltip,
} from 'antd';

const {Option} = Select;
import React from 'react';
import {connect} from 'dva';
import searchModalicon from "../../../../image/pms/searchModalIcon@2x.png"
import {InfoCircleOutlined} from "@ant-design/icons";
import RichTextEditor from "../../../../components/pmsPage/SendMailModal/RichTextEditor";

class searchModal extends React.Component {
  state = {
    isSpinning: false,
  };

  componentDidMount() {

  }

  render() {
    const {
      isSpinning
    } = this.state;
    const {
      visible,
      dictionary: {},
      closeModal
    } = this.props;
    const {getFieldDecorator,} = this.props.form;

    return (
      <>
        <Modal
          wrapClassName="searchModal-modify"
          style={{top: '150px'}}
          width={'860px'}
          title={null}
          zIndex={100}
          bodyStyle={{
            padding: '0',
          }}
          // onOk={e => this.handleFormValidate(e)}
          onCancel={closeModal}
          maskClosable={true}
          footer={null}
          visible={visible}
        >
          <Spin spinning={isSpinning} style={{position: 'fixed'}} tip="加载中" size="large"
                wrapperClassName="searchModal-box-spin">
            <div>
              <Input
                className="searchModal-input"
                placeholder="可查询项目、预算、文档、供应商、人员"
                suffix={
                  <i className="iconfont icon-search-name icon-personal"/>
                }
              />
              <Divider/>
              <div className="searchModal-div">
                <div><img className="searchModal-img" src={searchModalicon}/></div>
                <div style={{paddingTop: '12px'}}><span className="searchModal-span">随时随地，搜索项目相关信息</span></div>
              </div>
            </div>
          </Spin>
        </Modal>
      </>
    );
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(Form.create()(searchModal));
