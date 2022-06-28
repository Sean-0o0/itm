import React, { Fragment } from 'react';
import { Row, Col, Form, Input } from 'antd';
import { connect } from 'dva';
import ShareInput from './FilterModel';
import BasicModal from '../../../../../../../components/Common/BasicModal';
const { TextArea } = Input;

class BusEvaluationSchemeModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  callBackForShareInput = (params) => {
    const { callBackForModel } = this.props.modalProps;
    if (callBackForModel) {
      callBackForModel(params);
    }
  };

  render() {
    const { modalProps } = this.props;
    // console.log("palnStatus-----",modalProps.palnStatus)
    // const planType = DecryptBase64(params.params).substring(DecryptBase64(params.params).indexOf(':') + 1)
    return (
      <Fragment>
        <Row style={{ height: '100%' }} className='evaluation-body'>
          {/* <Col span={24} className='dp-title'>
                        <PlanDeclare />
                    </Col> */}
          <Col span={24}>
            <Row>
              <BasicModal {...modalProps}>
                {/*this.props.modalProps.type = 1为意见征求,2提交审批,3发布*/}
                {this.props.modalProps.type === '3' ? null :
                  (this.props.modalProps.type === '2'?null:(<Form.Item style={{ margin: '1rem', padding: '1rem' }}
                              label={'意见征求人员:'} labelCol={{ span: 4 }}
                              wrapperCol={{ span: 20 }}>
                    <ShareInput
                      callBackForShareInput={this.callBackForShareInput} onChangeGXLX={(value) => {
                      this.props.form.setFieldsValue({ gxlx: value });
                    }} />
                    <div>{this.props.modalProps.type === '1' ?
                      <span style={{ color: 'grey' }}>意见征求人员可对考核方案进行意见反馈，同时支持授权其他人员进行意见反馈</span> : ''}</div>
                  </Form.Item>))
                }
                <Form.Item style={{ margin: '1rem', padding: '1rem' }} label='提示' labelCol={{ span: 4 }}
                           wrapperCol={{ span: 20 }}>
                  {/*意见征求,提交审批,封存显示不同提示,,,封存时勾选数据中存在!===4的数据就显示【存在尚未审批完成的数据，是否确认封存？】 否则显示【封存后将不再允许考核方案修改及意见反馈，是否确认封存？】*/}
                  <div>{this.props.modalProps.type === '1' ? (<span
                    style={{ color: 'blue' }}>发起意见征求后，根据角色[反馈意见处理人]获取反馈意见的处理人员，可对反馈意见进行处理！</span>) : (this.props.modalProps.type === '2'?'提交审批后将不再允许考核方案修改及意见反馈，是否确认提交？':(this.props.modalProps.palnStatus.indexOf("0")||this.props.modalProps.palnStatus.indexOf("1") !==-1||this.props.modalProps.palnStatus.indexOf("2") !==-1||this.props.modalProps.palnStatus.indexOf("3") !==-1?'存在尚未审批完成的数据，是否确认封存？':'封存后将不再允许考核方案修改及意见反馈，是否确认封存？'))}</div>
            </Form.Item>
              </BasicModal>
              {/* params={Number(planType)} onCancelOperate={onCancelOperate} */}
            </Row>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(BusEvaluationSchemeModel);
