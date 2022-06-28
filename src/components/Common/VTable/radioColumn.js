import React from 'react';
import { Radio } from 'antd';
import { Column } from 'react-virtualized-table';

const wrapValueGetter = (value) => {
  return typeof value === 'function' ? value : () => value;
};

const onChangeValue = (onChange, ...args) => (event) => {
  if (typeof onChange === 'function') {
    onChange(event.target.checked, ...args);
  }
};

const headerRenderer = () => {
  return (
    <span />
  );
};

const cellRenderer = (info) => {
  const {
    cellChecked,
    onCheckCell,
  } = info.column.props;

  const checked = wrapValueGetter(cellChecked)(info);

  return (
    <Radio
      checked={checked}
      onClick={onChangeValue(onCheckCell, info)}
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
