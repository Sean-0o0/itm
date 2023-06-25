import React, { useEffect, useState, useRef } from 'react';
import { Breadcrumb, Button, message, Spin } from 'antd';
import moment from 'moment';
import {
  QueryCustomQueryCriteria,
  QueryCustomReport,
  SaveCustomReportSetting,
} from '../../../services/pmsServices/index';
import TopConsole from './TopConsole';
import InfoTable from './InfoTable';
import { Link } from 'react-router-dom';

export default function CustomRptInfo(props) {
  const { bbid, routes } = props;
  const [data, setData] = useState({}); //通过报表id查询到的报表数据
  const [tableData, setTableData] = useState({
    data: [],
    curPage: 1,
    curPageSize: 20,
    total: 0,
  }); //表格数据
  const [isSpinning, setIsSpinning] = useState(false); //加载状态

  useEffect(() => {
    if (bbid !== -1) {
      getData();
    }
    return () => {};
  }, [bbid]);

  //转树结构
  function buildTree(list, label = 'label', value = 'value') {
    let map = {};
    let treeData = [];

    list.forEach(item => {
      map[item.ID] = item;
      item[value] = item.ID;
      item[label] = item.NAME;
      item.children = [];
    });

    // 递归遍历树，处理没有子节点的元素
    const traverse = node => {
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          traverse(child);
        });
      } else {
        // 删除空的 children 数组
        delete node.children;
      }
    };

    list.forEach(item => {
      let parent = map[item.FID];
      if (!parent) {
        treeData.push(item);
      } else {
        parent.children.push(item);
        item.fid = parent.ID;
      }
    });

    // 处理没有子节点的元素
    treeData.forEach(node => {
      traverse(node);
    });

    return treeData;
  }

  //获取数据
  const getData = () => {
    setIsSpinning(true);
    //报表信息
    QueryCustomReport({
      bbid,
      current: 1,
      cxlx: 'MB',
      pageSize: 20,
      paging: 1,
      sort: 'XMID DESC',
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          const obj = JSON.parse(res.mbxx)[0];
          getSelectorData(obj);
          setTableData(p => ({
            ...p,
            data: JSON.parse(res.result),
            total: res.totalrows,
          }));
        }
      })
      .catch(e => {
        console.error('🚀报表信息', e);
        message.error('报表信息获取失败', 1);
        setIsSpinning(false);
      });
  };

  //下拉框数据
  const getSelectorData = obj => {
    const columns = JSON.parse(obj.QDZSBTZD)?.map(x => {
      return {
        title: x.title,
        dataIndex: x.QDQZZD,
        key: x.QDQZZD,
        align: 'left',
        width: x.title.length * 20,
      };
    });
    let filterData = JSON.parse(obj.QDZSSXZD);
    filterData.forEach(x => {
      if (x.TJBCXLX) {
        QueryCustomQueryCriteria({
          queryType: x.TJBCXLX,
        })
          .then(res => {
            if (res?.success) {
              if (x.TJBCXLX === 'YSXM') {
                function uniqueFunc(arr, uniId) {
                  const res = new Map();
                  return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1));
                }
                let type = uniqueFunc(JSON.parse(res.result), 'YSLXID');
                let origin = JSON.parse(res.result);
                x.SELECTORDATA = {
                  type,
                  origin,
                };
                // if (type.length > 0)
                //   x.SELECTORVALUE = {
                //     type: type[0]?.YSLXID,
                //     typeObj: type[0],
                //     value: [],
                //   };
              } else if (x.ZJLX === 'TREE-MULTIPLE') {
                x.SELECTORDATA = buildTree(JSON.parse(res.result));
              } else {
                x.SELECTORDATA = JSON.parse(res.result);
              }
            }
          })
          .then(() => {
            let finalObj = {
              rptName: obj.BBMC,
              authIds: obj.KJR?.split(';'),
              columns,
              filterData,
              groupData: JSON.parse(obj.QDZSZHZD),
              origin: {
                columns: JSON.parse(obj.QDZSBTZD),
                filterData: JSON.parse(obj.QDZSSXZD),
                groupData: JSON.parse(obj.QDZSZHZD),
              },
            };
            setData(finalObj);
            setIsSpinning(false);
          })
          .catch(e => {
            console.error('🚀', e);
            message.error(obj.TJBCXLX + '信息获取失败', 1);
          });
      }
    });
  };

  //表格数据 - 查询按钮
  const getSQL = (tableParams = {}) => {
    console.log('🚀 ~ file: index.js:155 ~ getSQL ~ tableParams:', tableParams);
    setIsSpinning(true);
    const {
      origin = {
        columns: [],
      },
      filterData = [],
      groupData = [],
    } = data;
    const zszdArr = origin.columns.map(x => ({ ID: x.ID, ZSZD: x.ZSZD }));
    let bmArr = ['TXMXX_XMXX XM'];
    let sxtjArr = [];
    let columnFieldsArr = [...origin.columns];
    let conditionFilterArr = JSON.parse(JSON.stringify(filterData));
    let conditionGroupArr = [...groupData];
    columnFieldsArr.forEach(x => {
      bmArr.push(x.BM);
    });
    conditionFilterArr.forEach(x => {
      let SXSJ = x.SELECTORVALUE;
      let SXLX = x.ZJLX;
      let SXTJ = x.SXTJ;
      if (
        SXSJ !== undefined &&
        SXSJ !== null &&
        JSON.stringify(SXSJ) !== '[]' &&
        JSON.stringify(SXSJ?.value) !== '[]'
      ) {
        if (x.ZJLX === 'DATE') {
          SXSJ = [
            Number(moment(x.SELECTORVALUE).format('YYYYMMDD')),
            Number(moment(x.SELECTORVALUE).format('YYYYMMDD')),
          ];
          bmArr.push(x.BM);
        } else if (x.ZJLX === 'RANGE') {
          SXSJ = [x.SELECTORVALUE.min || 0, x.SELECTORVALUE.max || 9999999999];
          bmArr.push(x.BM);
        } else if (x.TJBCXLX === 'YSXM') {
          SXSJ = x.SELECTORVALUE.value;
          SXTJ = x.SELECTORVALUE.typeObj?.CXTJ;
          SXLX = 'MULTIPLE';
          bmArr.push(x.SELECTORVALUE.typeObj?.CXB);
        } else {
          bmArr.push(x.BM);
        }
        sxtjArr.push({
          SXLX,
          SXTJ,
          SXSJ,
        });
      }
      delete x.SELECTORDATA;
    });
    conditionGroupArr.forEach(x => {
      bmArr.push(x[x.length - 1].BM);
      sxtjArr.push({
        SXLX: 'ZHTJ',
        SXTJ: x[x.length - 1].SXTJ,
        SXSJ: [],
      });
    });
    bmArr = [...new Set(bmArr)]; //去重

    let params = {
      sxtj: sxtjArr,
      cxb: bmArr,
      cxzd: zszdArr,
      czlx: 'SEARCH',
    };
    SaveCustomReportSetting(params)
      .then(res => {
        if (res?.success) {
          getTableData({ sql: res.note.replace(/\n/g, ' '), ...tableParams });
        }
      })
      .catch(e => {
        console.error('🚀查询语句获取', e);
        message.error('查询语句获取', 1);
        setIsSpinning(false);
      });
  };
  const getTableData = ({ sql = '', current = 1, pageSize = 20, sort = 'XMID DESC' }) => {
    QueryCustomReport({
      bbid,
      current,
      cxlx: 'SQL',
      sql,
      pageSize,
      paging: 1,
      sort,
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          setTableData({
            data: JSON.parse(res.result),
            total: res.totalrows,
            curPage: current,
            curPageSize: pageSize,
          });
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀报表信息', e);
        message.error('报表信息获取失败', 1);
        setIsSpinning(false);
      });
  };

  return (
    <div className="custom-rpt-info-box">
      <Spin
        spinning={isSpinning}
        tip="加载中"
        size="large"
        wrapperClassName="diy-style-spin-custom-rpt-management"
      >
        <Breadcrumb separator=">">
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
        <div className="header">{data.rptName}</div>
      </Spin>
      <div className="content">
        <TopConsole data={data} setData={setData} getSQL={getSQL} />
        <InfoTable columns={data.columns} tableData={tableData} getSQL={getSQL} />
      </div>
    </div>
  );
}
