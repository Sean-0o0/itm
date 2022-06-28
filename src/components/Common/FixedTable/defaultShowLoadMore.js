// @flow
const defaultShowLoadMore = ({
  data,
  current,
  pageSize,
  total,
  getRowCount,
  loading,
}) => {
  if (current === 0) {
    return true;
  }

  if (current === 1 && loading) {
    return true;
  }

  if (total === -1) {
    return true;
  }

  const rowCount = getRowCount(data);
  const maxRowCount = pageSize * 3;
  const pageSizeCount = current * pageSize;

  return rowCount < maxRowCount && pageSizeCount < total;
};

export default defaultShowLoadMore;
