import React from 'react';
import { Checkbox } from 'antd';
import { Column } from 'react-virtualized-table';

const wrapValueGetter = (value) => {
  return typeof value === 'function' ? value : () => value;
};

const onChangeValue = (onChange, ...args) => (event) => {
  if (typeof onChange === 'function') {
    onChange(event.target.checked, ...args);
  }
};

const headerRenderer = (info) => {
  const {
    headerChecked,
    headerIndeterminate,
    headerDisabled,
    onCheckHeader,
  } = info.column.props;

  const checked = wrapValueGetter(headerChecked)(info);
  const indeterminate = wrapValueGetter(headerIndeterminate)(info);
  const disabled = wrapValueGetter(headerDisabled)(info);

  return (
    <Checkbox
      indeterminate={indeterminate}
      checked={checked}
      disabled={disabled}
      onChange={onChangeValue(onCheckHeader, info)}
    />
  );
};

const cellRenderer = (info) => {
  const {
    cellChecked,
    onCheckCell,
  } = info.column.props;

  const checked = wrapValueGetter(cellChecked)(info);

  return (
    <Checkbox
      checked={checked}
      onChange={onChangeValue(onCheckCell, info)}
    />
  );
};

class CheckboxColumn extends React.Component {
  static defaultProps = {
    ...Column.defaultProps,
    width: 80,
    headerRenderer,
    cellRenderer,
  }
}

export default CheckboxColumn;
