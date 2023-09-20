import React, { useEffect, useState, useRef } from 'react';
import { Breadcrumb, Button, message, Spin } from 'antd';
import moment from 'moment';
import { QueryCustomReportContent, QueryUserRole } from '../../../services/pmsServices';
import TableBox from './TableBox';
import { Link } from 'react-router-dom';

export default function CustomReportDetail(props) {
  const { bgid = -2, routes = [], bgmc = '' } = props;
  const [tableData, setTableData] = useState({
    data: [],
    origin: [], //编辑前的数据
  }); //表格数据
  const [columnsData, setColumnsData] = useState([]); //字段数据
  const [tableLoading, setTableLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [monthData, setMonthData] = useState(null); //月份下拉框数据
  const [isAdministrator, setIsAdministrator] = useState(false); //是否管理员
  let LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);

  useEffect(() => {
    if (bgid !== -2 && LOGIN_USER_ID !== undefined) {
      setMonthData(moment());
      getUserRole();
    }
    return () => {};
  }, [bgid, LOGIN_USER_ID]);

  //获取数据
  const getData = (reportID, month) => {
    setTableLoading(true);
    QueryCustomReportContent({
      current: 1,
      pageSize: 20,
      paging: -1,
      queryType: 'NR',
      reportID,
      sort: '',
      total: -1,
      month,
    })
      .then(res => {
        if (res?.success) {
          let tableArr = JSON.parse(res.nrxx);
          let columnsArr = JSON.parse(res.zdxx);
          console.log('🚀 ~ 本月', tableArr, columnsArr);
          //上月数据
          QueryCustomReportContent({
            current: 1,
            pageSize: 20,
            paging: -1,
            queryType: 'SY',
            reportID,
            sort: '',
            total: -1,
            month,
          })
            .then(res => {
              if (res?.success) {
                let tableArrLast = JSON.parse(res.nrxx);
                console.log('🚀 ~ 上月', tableArrLast);
                let mergeData = []; //本月上月数据合并
                let filteredArr = columnsArr.filter(item => item.ZDLX === '1'); //分类字段信息
                let otherArr = columnsArr.filter(item => item.ZDLX !== '1'); //填写字段信息
                tableArr.forEach(item1 => {
                  let newItem = { ...item1 };
                  tableArrLast.forEach(item2 => {
                    if (item2.ID === item1.SYJL) {
                      delete item2.ID;
                      delete item2.GXZT;
                      delete item2.SYJL;
                      delete item2.YF;
                      delete item2.TXR;
                      delete item2.GLXM;
                      delete item2.BBID;
                      delete item2.GLXMID;
                      delete item2.JHSXSJ;
                      delete item2.TXRID;
                      delete item2.XMFZRID;
                      delete item2.XMFZR;
                      delete item2.JD;
                      delete item2.XMJD;

                      Object.keys(item2).forEach(key => {
                        newItem[key + '_LAST'] = item2[key];
                      });
                    }
                  });
                  mergeData.push(newItem);
                });
                mergeData = mergeData.map(obj => {
                  const newObj = { ID: obj.ID };
                  for (const key in obj) {
                    if (key !== 'ID') {
                      // if (key === 'TXR') {
                      //   newObj[key + obj.ID] =
                      //     obj.TXR?.trim() === '' ? [] : obj.TXR?.trim()?.split(';');
                      // } else {
                      newObj[key + obj.ID] = obj[key] === 'undefined' ? '' : obj[key];
                      // }
                    }
                  }
                  // newObj.isEdited = false; //左上编辑图标显隐
                  return newObj;
                });
                console.log('🚀 ~ mergeData:', mergeData);
                //排列顺序 - 分类字段（合并） - 关联项目 - 填写人 - 上月字段 - 本月填写字段 - 固定字段
                let finalColumns = [
                  //分类字段（合并）
                  ...filteredArr,
                  //关联项目
                  {
                    ZDMC: '关联项目',
                    ZDLX: '3', //非分类、非填写
                    QZZD: 'GLXM',
                  },
                  //填写人
                  {
                    ZDMC: '填写人',
                    ZDLX: '3', //非分类、非填写
                    QZZD: 'TXR',
                  },
                  //上月字段
                  ...(tableArrLast.length === 0 ? [] : otherArr).map(x => ({
                    ZDMC: x.ZDMC + '(上期)',
                    ZDLX: '3', //非分类、非填写
                    QZZD: x.QZZD + '_LAST',
                  })),
                  //本月填写字段
                  ...otherArr,
                  //固定字段
                  {
                    ZDMC: '计划上线时间',
                    ZDLX: '3', //非分类、非填写
                    QZZD: 'JHSXSJ',
                  },
                  {
                    ZDMC: '项目负责人',
                    ZDLX: '3', //非分类、非填写
                    QZZD: 'XMFZR',
                  },
                  {
                    ZDMC: '项目阶段',
                    ZDLX: '3', //非分类、非填写
                    QZZD: 'XMJD',
                  },
                  {
                    ZDMC: '进度(%)',
                    ZDLX: '3', //非分类、非填写
                    QZZD: 'JD',
                  },
                ];
                console.log('🚀 ~ finalColumns:', finalColumns);
                let tableWidth = 0;
                finalColumns.forEach(x => {
                  if (x.ZDLX === '1') {
                    tableWidth += x.ZDMC?.length * 25;
                  } else if (x.QZZD === 'GLXM') {
                    tableWidth += 200;
                  } else if (x.ZDLX === '2') {
                    tableWidth += 300;
                  } else if (x.QZZD === 'JD') {
                    tableWidth += 80;
                  } else {
                    tableWidth += x.ZDMC?.length * 25;
                  }
                });
                setColumnsData(finalColumns);
                setTableData({
                  data: JSON.parse(JSON.stringify(mergeData)),
                  origin: JSON.parse(JSON.stringify([...mergeData])), //编辑前的原数据
                  customColumns: columnsArr
                    .map(x => x.QZZD)
                    .concat(['ID', 'GLXM', 'TXR', 'GXZT', 'YF']),
                  tableWidth,
                });
                setTableLoading(false);
              }
            })
            .catch(e => {
              console.error('🚀上月表格数据', e);
              message.error('上月表格数据获取失败', 1);
              setTableLoading(false);
            });
        }
      })
      .catch(e => {
        console.error('🚀本月表格数据', e);
        message.error('本月表格数据获取失败', 1);
        setTableLoading(false);
      });
  };

  //获取用户角色
  const getUserRole = () => {
    setTableLoading(true);
    QueryUserRole({
      userId: String(LOGIN_USER_ID),
    })
      .then(res => {
        if (res?.code === 1) {
          const { role = '', zyrole = '' } = res;
          console.log('🚀 ~ file: index.js:202 ~ getUserRole ~ res:', res);
          setIsAdministrator(zyrole === '自定义报告管理员');
          getData(Number(bgid), Number(moment().format('YYYYMM')));
        }
      })
      .catch(e => {
        console.error('HomePage-QueryUserRole', e);
        message.error('用户角色信息查询失败', 1);
        setTableLoading(false);
      });
  };
  // console.log(
  //   tableData.data.length > 0 ? tableData.data[0]['WJZT' + tableData.data[0].ID] === '1' : false,
  // );
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
      <Spin spinning={tableLoading} tip="加载中">
        <TableBox
          dataProps={{
            bgid,
            bgmc,
            tableData,
            columnsData,
            tableLoading,
            edited,
            monthData,
            isAdministrator,
            txzt:
              tableData.data.length > 0
                ? tableData.data[0]['BGZT' + tableData.data[0].ID] === '1'
                : false,
            isFinish:
              tableData.data.length > 0
                ? tableData.data[0]['WJZT' + tableData.data[0].ID] === '1'
                : false,
          }}
          funcProps={{
            setEdited,
            setTableData,
            setColumnsData,
            setTableLoading,
            setMonthData,
            getData,
          }}
        />
      </Spin>
    </div>
  );
}
