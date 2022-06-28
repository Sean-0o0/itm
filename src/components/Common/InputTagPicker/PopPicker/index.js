import React, { Component } from 'react';
import classnames from 'classnames';
import { Input, Tag, Cascader, Popover } from 'antd';
import styles from './index.less';

class InputTagPicker extends Component {
  state = {
    id: `InputTagPicker_${new Date().getTime()}${this.props.id || Math.random()}`,
  }

  handleDisplayRender = () => {
    const { value = {}, closable = true } = this.props;
    const { keys = [], titles = [] } = value;
    const ohterShareObj = [];
    keys.forEach((key, index) => {
      const title = titles[index] || '--';
      let tempTittle = title;
      if (tempTittle && tempTittle.length >= 4) {
        tempTittle = `${tempTittle.substring(0, 3)}...`;
      }
      if (index >= 7) {
        ohterShareObj.push((
          <Tag className="m-tag-small m-tag-blue" style={{ background: '#54a9df' }} key={key}>
            <span title={title} style={{ color: '#fff' }} >{tempTittle}</span>
            {closable && <i className="iconfont icon-close-small" onClick={e => this.handleTagClose(e, key, index)} />}
          </Tag>
        ));
      }
    });
    // eslint-disable-next-line array-callback-return
    return keys.map((key, index) => {
      const title = titles[index] || '--';
      let tempTittle = title;
      if (tempTittle && tempTittle.length >= 4) {
        tempTittle = `${tempTittle.substring(0, 3)}...`;
      }
      const ohterShareObjCentext = (
        <div>
          {
            ohterShareObj.map((item) => {
              return item;
            })
          }
        </div>
      );
      if (index < 7) {
        return (
          <Tag className="m-tag-small m-tag-blue" key={key}>
            <span title={title}>{tempTittle}</span>
            {closable && <i className="iconfont icon-close-small" onClick={e => this.handleTagClose(e, key, index)} />}
          </Tag>
        );
      }
      if (keys.length >= 7 && (keys.length === index + 1)) {
        return (
          <Popover placement="right" content={ohterShareObjCentext}>
            <Tag className="m-tag-small m-tag-blue">
              <span title="...">......</span>
            </Tag>
          </Popover>
        );
      }
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

  handleButtonClick = (e) => { // 输入框点击事件
    const { onButtonClick } = this.props;
    if (onButtonClick) {
      onButtonClick(e);
    }
  }
  handleManageClick = (e) => { // 设置按钮点击事件
    const { onManageClick } = this.props;
    if (onManageClick) {
      onManageClick(e);
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
    const { id } = this.state;
    const { className, style, lable = '', hasButton = true, allowClear = false } = this.props;
    // 处理样式
    const clsSpan = classnames(styles.inputTagPicker, styles.hideDropBoxAndArrow);
    const cls = classnames('m-input-group m-input-group-btn', className);
    return (
      <span id={id} className={clsSpan}>
        <Input.Group compact className={cls} style={style}>
          {lable !== '' && <div className="ant-input-group-addon">{lable}{hasButton ? (<span className="m-set-handle"><i className="m-color iconfont icon-set" onClick={this.handleManageClick} /><span /></span>) : '' }</div>}
          <Cascader
            onClick={this.handleButtonClick}
            className="m-cascader-picker"
            style={{ width: '100%' }}
            allowClear={allowClear}
            popupVisible={false}
            // popupPlacement="bottomRight"
            displayRender={this.handleDisplayRender}
            // getPopupContainer={() => document.getElementById(id)}
            placeholder=""
          />
          <span className={`${styles.m_suffix} ant-input-suffix`}><i className="anticon anticon-search ant-input-search-icon" /></span>
        </Input.Group>
      </span>
    );
  }
}

export default InputTagPicker;
