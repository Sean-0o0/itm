import React, { useEffect, useState, useRef } from 'react';
import { Breadcrumb, Button, message } from 'antd';
import moment from 'moment';
import { QueryCustomReportContent } from '../../../services/pmsServices';
import TableBox from './TableBox';
import { Link } from 'react-router-dom';

export default function CustomReportDetail(props) {
  const { bgid = -2, routes } = props;
  const [tableData, setTableData] = useState({
    data: [],
    origin: [], //编辑前的数据
  }); //表格数据
  const [columnsData, setColumnsData] = useState([]); //字段数据
  const [tableLoading, setTableLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [monthData, setMonthData] = useState(null); //月份下拉框数据

  useEffect(() => {
    if (bgid !== -2) {
      getData(Number(bgid));
    }
    return () => {};
  }, [bgid]);

  //获取数据
  const getData = reportID => {
    QueryCustomReportContent({
      current: 1,
      pageSize: 20,
      paging: -1,
      queryType: 'TXR',
      reportID,
      sort: '',
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          console.log('🚀 ~ QueryCustomReportContent ~ res', res);
        }
      })
      .catch(e => {
        console.error('🚀表格数据', e);
        message.error('表格数据获取失败', 1);
      });
  };

  return (
    <div className="weekly-report-detail">
      <Breadcrumb separator=">" style={{ margin: '16px 24px' }}>
        {routes?.map((item, index) => {
          const { name = item, pathname = '' } = item;
          const historyRoutes = routes.slice(0, index + 1);
          return (
            <Breadcrumb.Item key={index}>
              {index === routes.length - 1 ? (
                <>{name}</>
              ) : (
                <Link to={{ pathname: pathname, state: { routes: historyRoutes } }}>{name}</Link>
              )}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
      <TableBox
        dataProps={{
          tableData,
          columnsData,
          tableLoading,
          edited,
          monthData,
        }}
        funcProps={{
          setEdited,
          setTableData,
          setColumnsData,
          setTableLoading,
          setMonthData,
        }}
      />
    </div>
  );
}
