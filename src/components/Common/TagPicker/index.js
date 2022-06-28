import React, { Component } from 'react';
import classnames from 'classnames';
import { Tag, Popover } from 'antd';
import styles from './index.less';

const { CheckableTag } = Tag;

class TagPicker extends Component {
  state = {
    expand: this.props.expand || false,
    isMulti: this.props.isMulti || false,
    allTagData: { show: true, key: '', showText: '全部', ...(this.props.allTagData || {}) },
    value: this.props.initialValue || [],
  }
  // 选中全选tag
  handleSelectAll = (checked, allKeyValue) => {
    const { value } = this.state;
    // 选中'全选'后,将value清空,并将全选的key加入其中
    value.length = 0;
    value.push(allKeyValue);
    this.setState({ value });
    this.triggerChange(value);
  }
  // 选中其它tag
  handleSelect = (checked, tag, allKeyValue) => {
    const { isMulti, value: valueInstate } = this.state;
    const { rowKey = 'id', value = [] } = this.props;
    const tempValue = [...value];
    // 处理value值
    if (value.length === 0) {
      tempValue.push(...valueInstate);
    }
    const selectedValue = tag[rowKey] || '';
    if (isMulti) { // 多选
      if (checked) { // 选中时,去掉allKeyValue(全选的值),并将当前选中的值放入value中
        const index = tempValue.indexOf(allKeyValue);
        if (index >= 0) {
          tempValue.splice(index, 1);
        }
        tempValue.push(selectedValue);
      } else { // 取消选中,去掉当前取消选中的值,并将allKeyValue(全选的值)放入value中
        const index = tempValue.indexOf(selectedValue);
        if (index >= 0) {
          tempValue.splice(index, 1);
        }
        if (tempValue.length === 0) {
          tempValue.push(allKeyValue);
        }
      }
    } else if (checked) { // 单选, 选中后,清空value,并将当前选中的值放入value中,单选无法取消选中
      tempValue.length = 0;
      tempValue.push(selectedValue);
    }
    this.setState({ value: tempValue });
    this.triggerChange(tempValue);
  }
  // 向外层的form表单暴露的triggerChange函数(antd的form控件需求)
  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange([...changedValue]);
    }
  }
  // 判断某元素是否在数组中
  isInArray = (arr, value) => {
    for (let i = 0; i < arr.length; i++) {
      if (value === arr[i]) {
        return true;
      }
    }
    return false;
  }
  render() {
    const { value: valueInstate, expand: expandInstate, allTagData: allTagDataInstate } = this.state;
    const { className, style, tagClassName = 'm-tag-small', allTagData = {}, rowKey = 'id', titleKey = 'name', label = '', dataSource = [], value = valueInstate, expand = expandInstate, disableIds = [], disableResText = '', assign } = this.props;
    // 处理样式
    let cls = classnames('m-tagbox', styles.tagSelect, className);
    if (assign) cls = classnames('m-tagbox-nojustify', styles.tagSelect, className);
    // 处理全选的相关数据
    const atd = {
      ...allTagDataInstate,
      ...allTagData,
    };
    // 处理value值
    if (value.length === 0) {
      value.push(...valueInstate);
      if (value.length === 0) {
        value.push(atd.key);
      }
    }
    let atdDisabled = false; // 全部按钮是否禁用
    if (disableIds.indexOf('') > -1) {
      atdDisabled = true;
    }
    return (
      <div className={cls} style={style}>
        {label && !assign && <div className="m-tagbox-left">{label}</div>}
        {label && assign && <div className="m-tagbox-left-nojustify">{label}</div>}
        <div className={`m-tagbox-right ${styles.Tag}`}>
          <div className={expand ? 'm-tagbox-rightMain' : 'm-tagbox-rightMain'}>
            {
              atd.show && !atdDisabled ? (
                <CheckableTag
                  className={tagClassName}
                  key={atd.key}
                  checked={value.includes(atd.key)}
                  onChange={checked => this.handleSelectAll(checked, atd.key)}
                >
                  {atd.showText}
                </CheckableTag>
              ) : ''
            }
            {
              atd.show && atdDisabled ? (
                <CheckableTag
                  className={`${tagClassName} disable-tag`}
                  key={atd.key}
                  // checked={value.includes(atd.key)}
                  // onChange={checked => this.handleSelectAll(checked, atd.key)}
                >
                  {atd.showText}
                </CheckableTag>
              ) : ''
            }
            {
              dataSource.map((tag) => {
                if (this.isInArray(disableIds, tag[rowKey])) {
                  if (disableResText !== '') {
                    return (
                      <Popover placement="top" content={disableResText} trigger="hover" className="disable-tag-popover">
                        <CheckableTag
                          className={`${tagClassName} disable-tag`}
                          key={tag[rowKey]}
                        >
                          {tag[titleKey]}
                        </CheckableTag>
                      </Popover>
                    );
                  } else if (disableResText === '' && disableIds.length !== 0) {
                    return (
                      <CheckableTag
                        className={`${tagClassName} disable-tag`}
                        key={tag[rowKey]}
                      >
                        {tag[titleKey]}
                      </CheckableTag>
                    );
                  }
                  return (
                    <CheckableTag
                      className={tagClassName}
                      key={tag[rowKey]}
                    >
                      {tag[titleKey]}
                    </CheckableTag>
                  );
                }
                return (
                  <CheckableTag
                    className={tagClassName}
                    key={tag[rowKey]}
                    checked={value.includes(tag[rowKey])}
                    onChange={checked => this.handleSelect(checked, tag, atd.key)}
                  >
                    {tag[titleKey]}
                  </CheckableTag>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default TagPicker;
