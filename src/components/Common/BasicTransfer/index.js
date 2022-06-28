import React, { Component } from 'react';
import classnames from 'classnames';
import { Row, Col, List, Button, Checkbox, Input } from 'antd';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import styles from './index.less';

const SortableItem = SortableElement(({ item, targetSelectedKeys, render, onRowClick }) => {
  const { key, title, disabled = false } = item;
  const position = 'right';
  return (
    <a className={styles.listItem} herf="#" onClick={e => onRowClick(e, key, position)}>
      <List.Item>
        <List.Item.Meta
          avatar={<Checkbox key={key} disabled={disabled} checked={targetSelectedKeys.includes(key)} />}
          description={render ? render(item, position) : title}
        />
      </List.Item>
    </a>
  );
});

const SortableList = SortableContainer(({ items, rightClassName, renderHeader, ...itemParams }) => {
  return (
    <List
      className={classnames(styles.list, styles.rightList, rightClassName)}
      itemLayout="horizontal"
      header={renderHeader('right')}
    >
      <div style={{ height: '380px', overflowY: 'auto' }}>
        {items.map((item, index) => (
          <SortableItem key={item.key} index={index} item={item} {...itemParams} />
        ))}
      </div>
    </List>
  );
});

class BasicTransfer extends Component {
  state = {
    showSearch: this.props.showSearch || false,
    searchPlaceholder: this.props.searchPlaceholder || this.props.searchPlaceholder === '' ? this.props.searchPlaceholder : '搜索',
    searchValue: this.props.searchValue || [],
    searchType: this.props.searchType || 'title', // 可选的有key, title, 和 both
    dataSource: this.props.dataSource || [],
    sourceSelectedKeys: this.props.sourceSelectedKeys || [],
    targetSelectedKeys: [],
    targetKeys: this.props.targetKeys || [],
    targetTitles: this.props.targetTitles || [],
    targetItems: this.props.targetKeys ? this.props.targetKeys.map((key, index) => { return { key, title: this.props.targetTitles[index] }; }) : [],
  }
  componentWillReceiveProps(nextProps) {
    const {
      searchValue = this.state.searchValue,
      dataSource = this.state.dataSource,
      targetKeys = this.state.targetKeys,
      targetTitles = this.state.targetTitles,
    } = nextProps;
    const { sourceSelectedKeys } = this.state;

    // 如果有sourceSelectedKeys,那么就判断dataSource数据和sourceSelectedKeys是否已经不匹配了,如果不匹配了,那么就将sourceSelectedKeys给清空
    if (sourceSelectedKeys.length > 0) {
      let count = 0;
      dataSource.forEach((item) => {
        const { key } = item;
        if (sourceSelectedKeys.includes(key)) {
          count++;
        }
      });
      if (sourceSelectedKeys.length !== count) {
        sourceSelectedKeys.length = 0;
        this.setState({
          sourceSelectedKeys,
        });
      }
    }
    const targetItems = targetKeys ? targetKeys.map((key, index) => { return { key, title: targetTitles[index] }; }) : [];
    this.setState({
      searchValue,
      dataSource,
      targetKeys,
      targetItems,
    });
  }
  // 选中一条记录
  onRowClick = (e, key, position) => {
    e.preventDefault();
    const { sourceSelectedKeys, targetSelectedKeys } = this.state;
    if (position === 'left') {
      if (sourceSelectedKeys.includes(key)) {
        const index = sourceSelectedKeys.indexOf(key);
        sourceSelectedKeys.splice(index, 1);
      } else {
        sourceSelectedKeys.push(key);
      }
      this.setState({ sourceSelectedKeys });
    } else {
      if (targetSelectedKeys.includes(key)) {
        const index = targetSelectedKeys.indexOf(key);
        if (index >= 0) {
          targetSelectedKeys.splice(index, 1);
        }
      } else {
        targetSelectedKeys.push(key);
      }
      this.setState({ targetSelectedKeys });
    }
  }
  // 全选
  onCheckAll = (e, position) => {
    const { dataSource, targetItems } = this.state;
    const { checked } = e.target;
    let datas = null;
    if (position === 'left') {
      datas = dataSource;
      let selectedKeys = null;
      if (checked) {
        selectedKeys = datas.map((item) => {
          return item.key;
        });
      } else {
        selectedKeys = [];
      }
      this.setState({
        sourceSelectedKeys: selectedKeys,
      });
    } else {
      datas = targetItems;
      let selectedKeys = null;
      if (checked) {
        selectedKeys = datas.map((item) => {
          return item.key;
        });
      } else {
        selectedKeys = [];
      }
      this.setState({
        targetSelectedKeys: selectedKeys,
      });
    }
  }
  // 加入到左(右)边
  onSelectChange = (e, position) => {
    const { dataSource, targetKeys, targetTitles, targetItems, sourceSelectedKeys, targetSelectedKeys } = this.state;
    if (position === 'toRight') { // 加入到右边
      dataSource.forEach((item) => {
        const { key, title } = item;
        if (sourceSelectedKeys.includes(key)) {
          targetKeys.push(key);
          targetTitles.push(title);
          targetItems.push(item);
        }
      });
      this.setState({
        targetKeys,
        targetTitles,
        targetItems,
        sourceSelectedKeys: [],
      });
      this.triggerChange({ targetKeys, targetTitles });
    } else { // 从右边移除
      const targetKeysNew = [];
      const targetTitlesNew = [];
      const targetItemsNew = [];
      targetItems.forEach((item) => {
        const { key, title } = item;
        if (!targetSelectedKeys.includes(key)) {
          targetKeysNew.push(key);
          targetTitlesNew.push(title);
          targetItemsNew.push(item);
        }
      });
      this.setState({
        targetKeys: targetKeysNew,
        targetTitles: targetTitlesNew,
        targetItems: targetItemsNew,
        targetSelectedKeys: [],
      });
      this.triggerChange({ targetKeys: targetKeysNew, targetTitles: targetTitlesNew });
    }
  }
  // 搜索框输入内容的时候的回调
  onSearchChange = (e, position) => {
    const { searchValue } = this.state;
    const { value } = e.target;
    if (position === 'left') {
      searchValue[0] = value;
      this.setState({ searchValue });
    } else {
      searchValue[1] = value;
      this.setState({ searchValue });
    }
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { targetKeys, targetTitles, targetItems } = this.state;
    const newTargetKeys = arrayMove(targetKeys, oldIndex, newIndex);
    const newTargetTitles = arrayMove(targetTitles, oldIndex, newIndex);
    // console.info(oldIndex, newIndex, arrayMove(this.state.targetKeys, oldIndex, newIndex), 123);
    this.setState({
      targetKeys: newTargetKeys,
      targetTitles: newTargetTitles,
      targetItems: arrayMove(targetItems, oldIndex, newIndex),
    });
    this.triggerChange({ targetKeys: newTargetKeys, targetTitles: newTargetTitles });
  };
  getListDataSource = (position) => {
    const { dataSource, targetKeys, targetItems, searchValue, searchType } = this.state;
    let sValue = null;
    let datas = null;
    if (position === 'left') {
      sValue = searchValue[0] || '';
      datas = dataSource.filter((item) => {
        return !targetKeys.includes(item.key);
      });
    } else {
      sValue = searchValue[1] || '';
      datas = targetItems;
    }
    // 根据搜索条件过滤数据
    if (!sValue && sValue !== 0) {
      return datas;
    } else if (searchType === 'key') {
      return datas.filter((item) => {
        const { key } = item;
        return key.includes(sValue);
      });
    } else if (searchType === 'title') {
      return datas.filter((item) => {
        const { title } = item;
        return title.includes(sValue);
      });
    } else if (searchType === 'both') {
      return datas.filter((item) => {
        const { key, title } = item;
        return key.includes(sValue) || title.includes(sValue);
      });
    }
  }
  // 获取src, tar两个数组中相同元素的个数;
  getSameKeysAmount = (src, tar) => {
    let count = 0;
    tar.forEach((key) => {
      if (src.includes(key)) {
        count++;
      }
    });
    return count;
  }
  // 向外层的form表单暴露的triggerChange函数(antd的form控件需求)
  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }
  renderHeader = (position) => {
    const { dataSource, targetKeys, targetItems, sourceSelectedKeys, targetSelectedKeys, searchPlaceholder, showSearch, searchValue } = this.state;
    const { sortable = false } = this.props;
    let selectedKeys = null;
    let datas = null;
    let value = 'null';
    let count = null;
    if (position === 'left') {
      selectedKeys = sourceSelectedKeys;
      datas = dataSource;
      value = searchValue[0] || '';
      count = datas.length - this.getSameKeysAmount(datas.map(item => item.key), targetKeys);
    } else {
      selectedKeys = targetSelectedKeys;
      datas = targetItems;
      value = searchValue[1] || '';
      count = datas.length;
    }
    return (
      <div className={styles.listHeader}>
        <div className={classnames(styles.checkAllBox, 'clearfix')}>
          <Checkbox
            indeterminate={selectedKeys.length > 0 && selectedKeys.length !== count}
            checked={selectedKeys.length !== 0 && selectedKeys.length === count}
            onChange={e => this.onCheckAll(e, position)}
          />
          <span>
            {selectedKeys.length > 0 ? `${selectedKeys.length}/` : ''}{count}条
          </span>
          {
            sortable && position === 'right' && <span style={{ float: 'right', fontSize: '12px', color: '#9e9e9e' }}>提示: 按住可以拖拽排序!</span>
          }
        </div>
        {
          showSearch && position === 'left' ? (
            <Input.Search
              placeholder={searchPlaceholder}
              value={value}
              onChange={e => this.onSearchChange(e, position)}
            />
          ) : ''
        }
      </div>
    );
  }
  renderItem = (item, position) => {
    const { key, title, disabled = false } = item;
    const { sourceSelectedKeys, targetSelectedKeys } = this.state;
    const { render } = this.props;
    let selectedKeys = null;
    if (position === 'left') {
      selectedKeys = sourceSelectedKeys;
    } else {
      selectedKeys = targetSelectedKeys;
    }
    return (
      <a className={styles.listItem} herf="#" onClick={e => this.onRowClick(e, key, position)}>
        <List.Item>
          <List.Item.Meta
            avatar={<Checkbox key={key} disabled={disabled} checked={selectedKeys.includes(key)} />}
            description={render ? render(item, position) : title}
          />
        </List.Item>
      </a>
    );
  }
  render() {
    const { sourceSelectedKeys, targetSelectedKeys } = this.state;
    const { className, leftClassName, rightClassName, sortable = false, operations = ['>', '<'], render } = this.props;
    return (
      <Row className={classnames(styles.basicTransfer, className)} type="flex" align="middle">
        <Col span={11}>
          <List
            className={classnames(styles.list, styles.leftList, leftClassName)}
            itemLayout="horizontal"
            header={this.renderHeader('left')}
            dataSource={this.getListDataSource('left')}
            renderItem={item => this.renderItem(item, 'left')}
          />
        </Col>
        <Col span={2}>
          <Button type="primary" size="small" disabled={sourceSelectedKeys.length === 0} onClick={e => this.onSelectChange(e, 'toRight')}>{operations[0]}</Button>
          <Button type="primary" size="small" disabled={targetSelectedKeys.length === 0} onClick={e => this.onSelectChange(e, 'toLeft')}>{operations[1]}</Button>
        </Col>
        <Col span={11}>
          {
            sortable ? (
              <div>
                <SortableList
                  lockAxis="y"
                  helperClass={styles.helperClass}
                  rightClassName={rightClassName}
                  renderHeader={this.renderHeader}
                  items={this.getListDataSource('right')}
                  onSortEnd={this.onSortEnd}
                  targetSelectedKeys={targetSelectedKeys}
                  render={render}
                  onRowClick={this.onRowClick}
                />
              </div>
            ) : (
              <List
                className={classnames(styles.list, styles.rightList, rightClassName)}
                itemLayout="horizontal"
                header={this.renderHeader('right')}
                dataSource={this.getListDataSource('right')}
                renderItem={item => this.renderItem(item, 'right')}
              />
            )
          }
        </Col>
      </Row>
    );
  }
}

export default BasicTransfer;
