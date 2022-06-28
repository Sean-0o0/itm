import React from 'react';
import { Button as AntdButton } from 'antd';
import BasicModal from '../BasicModal';
import Form from '../Form/index';

class Button extends React.Component {
  constructor(props) {
    super(props);
    const { name, title, forms } = props;
    this.state = {
      name,
      title,
      forms,
      visible: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { forms } = nextProps;
    if (forms) {
      this.setState({
        forms,
      });
    }
  }
  showModal = () => {
    // 先dispatch
    const { open, dispatch } = this.props;
    if (open) {
      open(dispatch);
    }
    // 然后propsWillRecive
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    // ok按钮的操作
    if (this.myForm) {
      const { validateFieldsAndScroll } = this.myForm;
      validateFieldsAndScroll((err, values) => {
        const { ok } = this.props;
        if (ok) {
          ok(values);
        }
        if (!err) {
          this.setState({
            visible: false,
          });
        }
      });
    } else {
      this.setState({
        visible: false,
      });
    }
  }
  handleCancel = () => {
    // 取消按钮的操作
    const { cancel } = this.props;
    if (cancel) {
      cancel();
      // this.myForm.resetFields();
    }
    this.setState({
      visible: false,
    });
  }
  render() {
    const { dispatch, setFieldsValue, color = 'blue', content, ModalStyle = {} } = this.props;

    return (
      <span>
        <AntdButton className={`fcbtn m-btn-border m-btn-border-${color} ant-btn btn-1c`} onClick={this.showModal}>{this.state.name}
        </AntdButton>
        <BasicModal
          {...ModalStyle}
          with={410}
          destroyOnClose
          title={this.state.title}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {this.state.forms ? <Form setFieldsValue={setFieldsValue} dispatch={dispatch} ref={(c) => { this.myForm = c; }} forms={this.state.forms} /> : (content || <span>功能待开发</span>) }
        </BasicModal>
      </span>
    );
  }
}

export default Button;
