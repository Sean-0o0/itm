import React from 'react';
import BasicModal from '../../../../../../../Common/BasicModal';
import DGroupShare from './DGroupShare';
import InputTagPicker from '../../../../../../../Common/InputTagPicker/PopPicker';

class ShareInput extends React.Component {
  state = {
    modalVisible: false,
    inputTagPickerValue: this.props.inputTagPickerValue || { // 外面input框里的标签
      keys: [],
      titles: [],
    },
    tempRemeberValues: {
      keys: [],
      titles: [],
    },
  }

  // 标签弹出层按钮
  buttonShowModal = () => {
    this.setState({
      modalVisible: true,
    });
  }

  // 弹出层中确认按钮点击事件
  handleOk = (e) => { // eslint-disable-line
    const tempMembers = this.state.tempRemeberValues;
    //为多选人员ID的拼接字符串，以;进行分割，例子：2341;23532;2312
    const keys = tempMembers.keys.length > 0 ? tempMembers.keys.join(';') : '';
    const titles = tempMembers.titles.length > 0 ? tempMembers.titles.join(',') : '';
    this.triggerChange({ keys, titles });
    this.setState({
      modalVisible: false,
      inputTagPickerValue: {
        keys: typeof keys === 'string' ? (keys !== '' ? keys.split(';') : []) : keys,
        titles: typeof titles === 'string' ? (titles !== '' ? titles.split(',') : []) : titles,
      },
    });
    const { callBackForShareInput } = this.props;
    if (callBackForShareInput) {
      callBackForShareInput(keys);
    }
  }

  // 人员选择回调
  handleRemeberSelected = (keys = [], titles = []) => {
    this.setState({
      tempRemeberValues: { keys, titles },
    });
  }

  // 弹出层中取消按钮点击事件
  handleCancel = (e) => { // eslint-disable-line
    this.setState({
      modalVisible: false,
    });
  }

  hanleInputTagPickerChange = (value) => {
    const { keys = [], titles = [] } = value;
    this.triggerChange({ keys: keys.join(','), titles: titles.join(',') });
    this.setState({ inputTagPickerValue: value });
  }

  triggerChange = (changedValue) => {
    // 将值改变传递给form组件.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, changedValue));
    }
  }

  render() {
    const { inputTagPickerValue, modalVisible } = this.state;
    //个性化标签时传入opr
    // const {opr} = this.props;
    const inputTagPickerProps = {
      // lable: '客户标签',
      value: inputTagPickerValue,
      onChange: this.hanleInputTagPickerChange,
      onButtonClick: this.buttonShowModal,
      hasButton: true,
    };
    return (
      <React.Fragment>
        <InputTagPicker {...inputTagPickerProps} />
        <BasicModal
          title={'人员筛选'}
          width="70rem"
          style={{ height: '70rem', margin: '0 auto', top: '3rem' }}
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          visible={modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <DGroupShare
            handleRemeberSelected={this.handleRemeberSelected}
            onChangeGXLX={this.props.onChangeGXLX}
            selectedKeys={inputTagPickerValue.keys}
          />
        </BasicModal>
      </React.Fragment>
    );
  }
}
export default ShareInput;
