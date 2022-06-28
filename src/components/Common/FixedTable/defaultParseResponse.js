const defaultParseResponse = ({ total, records, totalrows }) => {
  const totalCount = total == null ? totalrows : total;

  return { total: totalCount, records };
};

export default defaultParseResponse;
