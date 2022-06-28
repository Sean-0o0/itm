/* eslint-disable react/sort-comp */
import React from 'react';
import some from 'lodash/some';
import differenceWith from 'lodash/differenceWith';
import intersectionWith from 'lodash/intersectionWith';

const handleCheckedState = (component) => {
  class HandleCheckedState extends React.Component {
    state = {
      allChecked: false,
      rowKeys: [], // 全选时，存放反选key
    };

    headerChecked = () => {
      return this.state.allChecked;
    }

    headerIndeterminate = () => {
      const { allChecked, rowKeys } = this.state;

      return allChecked && rowKeys.length;
    }

    cellChecked = ({ rowKey }) => {
      const { allChecked, rowKeys } = this.state;
      const exist = some(rowKeys, key => key === rowKey);

      return allChecked ? !exist : exist;
    }

    onCheckHeader = (allChecked) => {
      this.setState({ allChecked, rowKeys: [] });
    }

    resetState = () => {
      this.setState({ allChecked: false, rowKeys: [] });
    }

    onCheckRow = (checked, { rowKey }) => {
      const { allChecked, rowKeys: prevRowKeys } = this.state;

      let rowKeys;

      if (allChecked !== checked) {
        rowKeys = prevRowKeys.concat(rowKey);
      } else {
        rowKeys = prevRowKeys.filter(key => key !== rowKey);
      }

      this.setState({ rowKeys });
    }

    getCheckedItems = (data, keyExtractor) => {
      const func = this.state.allChecked ? differenceWith : intersectionWith;

      return func(data, this.state.rowKeys, (item, rowKey) => keyExtractor(item) === rowKey);
    }

    getCheckedKeys = (data, keyExtractor) => this.getCheckedItems(data, keyExtractor).map(keyExtractor);

    render() {
      const checkedState = {
        handlers: this._handlers,
        state: this.state,
        resetState: this.resetState,
        getCheckedItems: this.getCheckedItems,
        getCheckedKeys: this.getCheckedKeys,
      };

      return React.createElement(component, {
        ...this.props,
        checkedState,
      });
    }

    _handlers = {
      headerChecked: this.headerChecked,
      headerIndeterminate: this.headerIndeterminate,
      cellChecked: this.cellChecked,
      onCheckHeader: this.onCheckHeader,
      onCheckCell: this.onCheckRow,
    };
  }

  return HandleCheckedState;
};

export default handleCheckedState;
