import React from 'react';
import { Column } from 'react-virtualized-table';

const TableColumn = () => {};

TableColumn.defaultProps = {
  ...Column.defaultProps,
  cellRenderer: (info) => {
    const { column, rowData } = info;
    const { dataKey } = column.props;
    return (
      <span>{rowData[dataKey] || '--'}</span>
    );
  },
};

export default TableColumn;
