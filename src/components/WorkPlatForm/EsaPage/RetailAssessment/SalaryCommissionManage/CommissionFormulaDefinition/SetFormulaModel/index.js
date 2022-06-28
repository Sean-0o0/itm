import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Select, Button, Divider, message } from 'antd';
import { FetchOperateRoyaltyFormulaIndicator } from '../../../../../../../services/EsaServices/commissionManagement';

class SetFormulaModel extends React.Component {
  state ={
  }

  componentDidMount = () => {
  }


  componentWillReceiveProps() {
  }

  handleSettingOk = async () => {
    const { data: { id } } = this.props;
    const { getFieldValue } = this.props.form;
    const indiId = getFieldValue('indiId') || '';
    await FetchOperateRoyaltyFormulaIndicator({
      fmlaId: id, // 公式ID
      indiId, // 指标id
    }).then((response) => {
      const { note = '操作成功!' } = response;
      message.info(note);
      const { handleCancel } = this.props;
      if (handleCancel) {
        handleCancel();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { data, indiData = [] } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <div style={{ padding: '1.833rem 1rem 0 0' }}>
          <Form className="m-form-default ant-form-horizontal ant-advanced-search-form m-form">
            <Row>
              <Col>
                <div style={{ marginBottom: '1.5rem', paddingLeft: '12.8rem' }}>
                  <span>模板名称: </span>
                  <span>&nbsp;{data.tmplName}</span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col push={4} span={14}>
                <Form.Item labelCol={{ span: 12 }} className="m-form-item" label="拆分提成指标:" wrapperCol={{ span: 12 }}>
                  {getFieldDecorator('indiId', {
                    rules: [{ required: true, message: '请选择拆分提成指标' }],
                  })(<Select className="m-select m-select-default" placeholder="请选择拆分指标">{indiData.map((item) => { return <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>; })}</Select>)
                  }
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button style={{ marginRight: '0.666rem' }} className="m-btn-radius m-btn-headColor" onClick={this.handleSettingOk}> 确定 </Button>
                <Button style={{ marginLeft: 8 }} className="m-btn-radius" onClick={this.props.handleCancel}> 取消 </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Fragment>
    );
  }
}
export default Form.create()(connect(({ commissionFormulaDefinition }) => ({
  indiData: commissionFormulaDefinition.indiData,
}))(SetFormulaModel));
