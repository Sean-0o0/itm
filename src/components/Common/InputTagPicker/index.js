import React, { Component } from 'react';
import classnames from 'classnames';
import { Input, Cascader, Button, Tag } from 'antd';
import styles from './index.less';

class InputTagPicker extends Component {
  state = {
    dropBoxVisible: false,
    id: `InputTagPicker_${new Date().getTime()}${this.props.id || Math.random()}`,
  }
  isInDropBoxClick = false // 控制是否点击的是下拉层内部的一个标志
  // 处理下层的显示隐藏
  hanleDropboxPopupVisibleChange = (vislble) => {
    if (this.isInDropBoxClick) {
      this.isInDropBoxClick = false;
    } else {
      this.setState({ dropBoxVisible: vislble });
    }
  }
  // 如果点击的是下拉层,那么就把isInDropBoxClick设置为true,避免将下拉层点击后自动关闭
  handleDropBoxClick = () => {
    this.isInDropBoxClick = true;
  }
  handleDisplayRender = () => {
    const { value = {}, closable = true } = this.props;
    const { keys = [], titles = [] } = value;
    return keys.map((key, index) => {
      const title = titles[index];
      return (
        <Tag className="m-tag-small m-tag-blue" key={key}>
          <span>{title || '--'}</span>
          {closable && <i className="iconfont icon-close-small" onClick={e => this.handleTagClose(e, key, index)} />}
        </Tag>
      );
    });
  }
  handleTagClose = (e, key, index) => {
    e.stopPropagation();
    const { value = {} } = this.props;
    const { keys: keysInprops = [], titles: titlesInprops = [] } = value;
    const keys = [];
    const titles = [];
    keys.push(...keysInprops.filter(item => item !== key));
    titles.push(...titlesInprops);
    if (index >= 0) {
      titles.splice(index, 1);
    }
    this.triggerChange({ keys, titles });
  }
  handleButtonClick = (e) => {
    const { onButtonClick } = this.props;
    if (onButtonClick) {
      onButtonClick(e);
    }
  }
  // 向外层的form表单暴露的triggerChange函数(antd的form控件需求)
  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }
  render() {
    const { dropBoxVisible, id } = this.state;
    const { className, style, lable = '', hasButton = true, buttonIcon, allowClear = false, hasDropBox = false, dropBox = '' } = this.props;
    // 处理样式
    const clsSpan = classnames(styles.inputTagPicker, hasDropBox || styles.hideDropBoxAndArrow);
    const cls = classnames('m-input-group m-input-group-btn', className);
    return (
      <span id={id} className={clsSpan}>
        <Input.Group compact className={cls} style={style}>
          {lable !== '' && <div className="ant-input-group-addon">{lable}</div>}
          <Cascader
            className="m-cascader-picker"
            style={{ width: '100%' }}
            allowClear={allowClear}
            popupVisible={hasDropBox ? dropBoxVisible : false}
            popupPlacement="bottomRight"
            onPopupVisibleChange={this.hanleDropboxPopupVisibleChange}
            onChange={this.handleDropBoxClick}
            displayRender={this.handleDisplayRender}
            options={[{
              value: 'dropBox',
              label: (
                <div>{dropBox}</div>
              ),
            }]}
            getPopupContainer={() => document.getElementById(id)}
            placeholder=""
          />
          {hasButton ? (
            <Button className="m-btn-radius m-btn-radius-small m-btn-headColor" onClick={this.handleButtonClick}>
              <i className={`iconfont ${buttonIcon || 'icon-customer-tag'}`} />
            </Button>
          ) : '' }
        </Input.Group>
      </span>
    );
  }
}

export default InputTagPicker;
