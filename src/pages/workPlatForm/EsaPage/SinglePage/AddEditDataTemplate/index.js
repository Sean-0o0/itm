import React from 'react';
import { Row, Col, message, Button, Divider } from 'antd';
import { FetchoperateDataTemplateField } from '../../../../../services/EsaServices/commissionManagement';
import LeftContent from './LeftContent';

/**
 * 数据模板列的新增和修改
 */

class AddEditDataTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIndex: 0,
      inputIndex: 0,
      inputChangIndex: 0,
      params: [],
      salaryTemplateConfData: {},
      height:0
    };
  }

  componentDidMount() {
    // const { match = {} } = this.props;
    // const { id } = match.params;
    // if (id) {
    //   this.queryInfoSalaryTemplateConf(id);
    // }
    window.addEventListener('resize', this.updateDimensions);

  }
  componentWillMount() {
    this.updateDimensions();
  }

  // // 查询薪酬模板配置
  // queryInfoSalaryTemplateConf = async (id = '') => {
  //   await FetchqueryInfoSalaryTemplateConf({ id }).then((res) => {
  //     const { code, records = [] } = res;
  //     if (code > 0) {
  //       this.setState({
  //         salaryTemplateConfData: records[0] ? records[0] : [],
  //         Variable: records[0] ? records[0].paramValues : [],
  //       });
  //     }
  //   }).catch((e) => {
  //     message.error(!e.success ? e.message : e.note);
  //   });
  // }

  handelInputChange = () => {
    this.setState({ inputIndex: ++this.state.inputIndex });
  }

  handleSubmit = () => {
    // 确定按钮的操作
    if (this.myFormto) {
      const { validateFieldsAndScroll } = this.myFormto;
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.myForm(values);
        }
      });
    }
  }

  // 计算公式内容改变
  inputChang = (params) => {
    this.setState({ inputChangIndex: ++this.state.inputChangIndex, params });
  }

  // 提交表单
  myForm = async (values) => {
    const { match = {} } = this.props;
    const { id } = match.params;
    const oprType = id ? 2 : 1;
    await FetchoperateDataTemplateField({
      oprType, // 1|新增;2|修改;3|删除
      ...values
    }).then((response) => {
      const { code, note } = response;
      if (code > 0) {
        message.success(note);
      }
      const { onSubmitOperate } = this.props;
      if (onSubmitOperate) {
        onSubmitOperate();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  updateDimensions = () => {
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    this.setState({ height });
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  render() {
    const { height, salaryTemplateConfData, params, selectIndex, inputChangIndex } = this.state;
    const { onCancelOperate, dictionary } = this.props;
    return (
      <React.Fragment>
        <Row style={{ background: '#fff', height }}>
          <Row className="m-row" style={{ width: '100%' }}>
            <Col xs={24} sm={24} lg={24}>
              <LeftContent
                ref={(node) => { this.myFormto = node; }}
                selectIndex={selectIndex}
                inputChangIndex={inputChangIndex}
                handelInputChange={this.handelInputChange}
                params={params}
                dictionary={dictionary}
                salaryTemplateConfData={salaryTemplateConfData}
              />
            </Col>
          </Row>
          <Divider style={{ marginTop: 0 }} />
          <Row style={{ height: '5rem', width: '100%' }}>
            <Col span={23} style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: '0.666rem' }} className="m-btn-radius m-btn-headColor" onClick={this.handleSubmit}> 确定 </Button>
              <Button style={{ marginLeft: 8 }} className="m-btn-radius" onClick={onCancelOperate}> 取消 </Button>
            </Col>
          </Row>
        </Row>
      </React.Fragment>
    );
  }
}

export default AddEditDataTemplate;
