import React from 'react';
import { Tag, Select, Input } from 'antd';
import styles from './commonSearchTags.less';

const { Option } = Select;
// 常用搜索功能中的标签组件
class CommonSearchTags extends React.Component {
  constructor(props) {
    super(props);
    const { selectedTags, hasAll } = this.props;
    this.state = {
      currentKey: 0,
      selectedTags: selectedTags || hasAll ? ['all'] : [],
      expand: true,
      show: false,
    };
  }
  falx = '';
  handelSelect=(value) => {
    const { hasAll } = this.props;
    this.setState({
      currentKey: value,
      selectedTags: hasAll ? ['all'] : [],
    });
  }
  handleChange = (key, falx, checked) => {
    this.falx = falx;
    const { selectedTags } = this.state;
    const { isMulti = false } = this.props;
    let nextSelectedTags = [];
    if (isMulti) {
      nextSelectedTags = checked ?
        [...selectedTags, key] :
        selectedTags.filter(t => t !== key);
    } else {
      nextSelectedTags = [key];
    }
    this.setState({ selectedTags: nextSelectedTags });
    this.triggerChange(nextSelectedTags);
  }
  handleExpand = () => {
    this.setState({
      show: !this.state.show,
    });
  }
   // 向外层的form表单暴露的triggerChange函数(antd的form控件需求)
   triggerChange = (changedValue) => {
     const { onChange } = this.props;
     if (onChange) {
       onChange({ currentKey: this.state.currentKey, falx: this.falx, value: [...changedValue] });
     }
   }
   render() {
     const { tags = {}, datas = [], hasAll = false, hasExtend = true } = this.props;
     return (
       <Input.Group className="m-input-group" compact>
         <Select style={{ width: '11rem !important' }} className={`m-select ant-select ant-select-enabled ${styles.m_select}`} value={this.state.currentKey} onSelect={this.handelSelect}>
           {datas.map((item) => {
            tags[item.key] = item.tags;
            return <Option key={item.key} value={item.key}>{item.label}</Option>;
          })}
         </Select>
         <span className={`m-right-input ${this.state.show ? '' : 'm-cascader-show'}`} style={{ marginRight: '3.666rem', marginLeft: '2rem' }}>
           {hasAll ? <Tag.CheckableTag checked={this.state.selectedTags.includes('all')} onChange={checked => this.handleChange('all', '', checked)} className="m-tag">不限</Tag.CheckableTag> : null}
           {tags[this.state.currentKey] ? tags[this.state.currentKey].map((item) => {
             const { falx = '' } = item;
          return (
            <Tag.CheckableTag key={item.key} className="m-tag m-tag-marginB" checked={this.state.selectedTags.includes(item.key)} onChange={checked => this.handleChange(item.key, falx, checked)} >
              {item.name || ''}
              {item.number ?
                (
                  <span className="m-badge ant-badge ant-badge-not-a-wrapper">
                    <sup data-show="true" className="ant-scroll-number ant-badge-count ant-badge-multiple-words" title="109" style={{ backgroundColor: 'rgb(82, 196, 26)' }}>{item.number > 99 ? '99+' : item.number}</sup>
                  </span>
                ) : ''
              }
            </Tag.CheckableTag>
          );
        }) : <Tag.CheckableTag className="m-tag m-tag-marginB">暂无数据</Tag.CheckableTag>}
         </span>
         {
           hasExtend ? (
             <div className="more-tag" style={{ display: this.state.expand ? '' : 'none' }} onClick={this.handleExpand}>
               <div className="m-tag ant-tag ant-tag-checkable">
                 <i className={`iconfont ${this.state.show ? 'icon-down-solid-arrow' : 'icon-right-solid-arrow'}`} style={{ fontSize: '1.25rem' }} />
               </div>
             </div>
            ) : null
         }
       </Input.Group>
     );
   }
}

export default CommonSearchTags;
