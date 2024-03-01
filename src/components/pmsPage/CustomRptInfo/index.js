import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Breadcrumb, Button, message, Spin, Tooltip } from 'antd';
import moment from 'moment';
import {
  QueryCustomQueryCriteria,
  QueryCustomReport,
  QueryUserRole,
  SaveCustomReportSetting,
} from '../../../services/pmsServices/index';
import TopConsole from './TopConsole';
import InfoTable from './InfoTable';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

export default function CustomRptInfo(props) {
  const {
    bbid,
    bbmc,
    routes = [],
    cjrid,
    handleEdit = () => {},
    setIsSpinning = () => {},
    handleError = () => {},
    isFold = false,
    isSpinning = false,
    emptyImg = '',
    refreshAfterSave = () => {},
  } = props;
  const [data, setData] = useState({}); //通过报表id查询到的报表数据
  const [isUnfold, setIsUnfold] = useState(false); //是否展开
  const [tableData, setTableData] = useState({
    data: [],
    curPage: 1,
    curPageSize: 20,
    total: 0,
    sort: 'XMID DESC',
  }); //表格数据
  const [curSQL, setCurSQL] = useState(''); //当前sql
  const [firstLoading, setFirstLoading] = useState(true); //第一次加载后设为false
  const [sortInfo, setSortInfo] = useState({
    sort: undefined,
    columnKey: '',
  }); //
  const [yearData, setYearData] = useState({
    year: moment(), //年份
    open: false, //下拉框展开收起
  }); //年份数据特殊处理，另外在保存时入参
  // const [exportData, setExportData] = useState([]); //导出的数据 - 不分页
  var s = 0;
  var e = 0;

  useEffect(() => {
    if (bbid !== -1) {
      getData();
      setIsUnfold(false);
      setFirstLoading(true);
    }
    return () => {
      setTableData({
        data: [],
        curPage: 1,
        curPageSize: 20,
        total: 0,
        sort: 'XMID DESC',
      });
      setSortInfo({
        sort: undefined,
        columnKey: '',
      });
    };
  }, [bbid, bbmc]);

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

  //获取组合条件树形数据
  const getConditionGroupTreeData = (arr = []) => {
    let treeData = buildTree(arr);
    // 递归遍历树，处理没有子节点的元素
    const traverse = node => {
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          traverse(child);
        });
        // node.selectable = false;
      } else {
        if (node.GRADE < 3 && node.ID !== 19 && node.FID !== 28) {
          // node.selectable = true;
        }
      }
    };
    // 处理没有子节点的元素
    treeData.forEach(node => {
      traverse(node);
    });
    // 加handledTitle，用于显示区分
    function handleTreeData(data, parentTitle) {
      return data.map(node => {
        const handledTitle = parentTitle ? `${parentTitle}-${node.NAME}` : node.NAME;
        const children = node.children ? handleTreeData(node.children, node.NAME) : null;
        return {
          ...node,
          handledTitle,
          children,
        };
      });
    }
    treeData = handleTreeData(treeData, '');
    // console.log('🚀 ~ getConditionGroupTreeData ~ treeData:', treeData);
    return treeData;
  };

  //获取数据
  const getData = () => {
    s = performance.now();
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
        message.error('报表信息获取失败', 2);
        setIsSpinning(false);
        handleError();
      });
  };

  //下拉框数据
  const getSelectorData = async obj => {
    const columns = JSON.parse(obj.QDZSBTZD)?.map(x => {
      return {
        ...x,
        title: x.title,
        dataIndex: x.QDQZZD,
        key: x.QDQZZD,
        width: x.title.length * 20,
        jumpId: x.QDTZZD,
        ellipsis: true,
      };
    });
    let filterData = JSON.parse(obj.QDZSSXZD);
    filterData.forEach(async x => {
      if (x.ZJLX === 'ZHTJ') {
        //组合条件特殊处理
      } else if (x.TJBCXLX) {
        //TJBCXLX用于查询下拉框数据入参
        try {
          const res = await QueryCustomQueryCriteria({
            queryType: x.TJBCXLX,
            year: obj.NF !== undefined ? Number(obj.NF) : moment().year(),
          });
          // .then(res => {
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
            } else if (x.ZJLX === 'TREE-MULTIPLE') {
              x.SELECTORDATA = buildTree(JSON.parse(res.result));
            } else if (x.ZJLX === 'RADIO') {
              // x.SELECTORVALUE = false;
            } else if (x.ZJLX === 'RADIO-XMZT') {
              // x.SELECTORVALUE = false;
            } else {
              x.SELECTORDATA = JSON.parse(res.result);
            }
          }
        } catch (error) {
          console.error('🚀', error);
          message.error(x.TJBCXLX + '信息获取失败', 1);
        }
      }
    });
    let finalObj = {
      rptName: obj.BBMC,
      authIds: obj.KJR?.split(';'),
      columns,
      filterData,
      groupData: [],
      origin: {
        columns: JSON.parse(obj.QDZSBTZD),
        filterData,
        groupData: [],
      },
    };
    setData(finalObj);
    setYearData({
      year: obj.NF !== undefined ? moment(String(obj.NF), 'YYYY') : moment(),
      open: false,
    });
    e = performance.now();
    console.log(`下拉框数据Request time: ${e - s} milliseconds`, s, e, filterData);
    s = performance.now();
    getSQL({}, finalObj, obj.NF !== undefined ? Number(obj.NF) : moment().year());
  };

  //表格数据 - 查询按钮
  const getSQL = async (tableParams = {}, data, year = moment().year()) => {
    setIsSpinning(true);
    const {
      origin = {
        columns: [],
      },
      filterData = [],
    } = data;
    const zszdArr = origin.columns.map(x => ({ ID: x.ID, ZSZD: x.ZSZD }));
    let bmArr = ['TXMXX_XMXX XM'];
    let sxtjArr = [];
    let columnFieldsArr = [...origin.columns];
    let conditionFilterArr = filterData.filter(x => x.ZJLX !== 'ZHTJ');
    //组合条件特殊处理
    let conditionGroupObj = filterData.find(x => x.ZJLX === 'ZHTJ') || {};
    let conditionGroupArr = [];
    if (JSON.stringify(conditionGroupObj) !== '{}') {
      //组合条件特殊处理
      const res = await QueryCustomQueryCriteria({
        queryType: 'ZHTJ',
      });
      if (res?.success) {
        filterData.forEach(x => {
          if (x.ZJLX === 'ZHTJ') {
            x.SELECTORDATA = getConditionGroupTreeData(JSON.parse(res.result));
            x.SELECTDATAORIGIN = JSON.parse(res.result);
          }
        });
        setData({ ...data, filterData });
        conditionGroupArr = JSON.parse(res.result)?.filter(x =>
          conditionGroupObj.SELECTORVALUE?.includes(x.ID),
        );
      }
    }
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
          if (x.SELECTORVALUE[0] === '' && x.SELECTORVALUE[1] === '') {
            SXSJ = [0, 20500000];
          } else {
            SXSJ = [
              Number(moment(x.SELECTORVALUE[0]).format('YYYYMMDD')),
              Number(moment(x.SELECTORVALUE[1]).format('YYYYMMDD')),
            ];
          }
          bmArr.push(x.BM);
        } else if (x.ZJLX === 'TREE-MULTIPLE' && x.TJBCXLX !== 'YSXM') {
          SXSJ = x.SELECTORVALUE?.map(x => x.value ?? x);
          bmArr.push(x.BM);
        } else if (x.ZJLX === 'RANGE') {
          SXSJ = [x.SELECTORVALUE.min ?? 0, x.SELECTORVALUE.max ?? 9999999999];
          bmArr.push(x.BM);
        } else if (x.ZJLX === 'RADIO') {
          //是否为父项目，暂时写死以下情况
          SXSJ = undefined;
          SXLX = 'ZHTJ';
          if (x.SELECTORVALUE) {
            SXTJ = '(SELECT COUNT(*) FROM TXMXX_XMXX WHERE GLFXM = XM.ID AND ZT != 0 ) > 0';
          } else {
            SXTJ = '(SELECT COUNT(*) FROM TXMXX_XMXX WHERE GLFXM = XM.ID AND ZT != 0 ) <= 0';
          }
          bmArr.push(x.BM);
        } else if (x.ZJLX === 'RADIO-XMZT') {
          //项目状态，暂时写死以下情况
          SXSJ = undefined;
          SXLX = 'ZHTJ';
          if (x.SELECTORVALUE) {
            SXTJ =
              '(SELECT COUNT(*) FROM TSMZQ_LCBZX WHERE ZT = 4 AND XGZT = 1 AND XMMC = XM.ID) = 0';
          } else {
            SXTJ =
              '(SELECT COUNT(*) FROM TSMZQ_LCBZX WHERE ZT = 4 AND XGZT = 1 AND XMMC = XM.ID) > 0';
          }
          bmArr.push(x.BM);
        } else if (x.TJBCXLX === 'YSXM') {
          if (JSON.stringify(SXSJ?.value) !== '[]') {
            SXSJ = x.SELECTORVALUE.value;
            SXTJ = x.SELECTORVALUE.typeObj?.CXTJ;
            SXLX = 'MULTIPLE';
          } else {
            SXSJ = [];
            if (x.SELECTORVALUE.typeObj?.YSLXID === 1) {
              SXTJ = 'XM.GLYSXM IS NOT NULL';
            } else if (x.SELECTORVALUE.typeObj?.YSLXID === 2) {
              SXTJ = 'XM.GLFZBYSXM IS NOT NULL';
            } else if (x.SELECTORVALUE.typeObj?.YSLXID === 3) {
              SXTJ = 'XM.GLKYYS IS NOT NULL';
            } else {
              SXTJ = 'XM.GLYSXM <=0';
            }
            SXLX = 'ZHTJ';
          }
          bmArr.push(x.SELECTORVALUE.typeObj?.CXB);
        } else {
          bmArr.push(x.BM);
        }
        if (
          !(
            (x.ZJLX === 'RADIO' && x.SELECTORVALUE === undefined) ||
            (x.ZJLX === 'RADIO-XMZT' && x.SELECTORVALUE === undefined) ||
            (x.ZJLX === 'RANGE' &&
              ['', undefined, null].includes(x.SELECTORVALUE.min) &&
              ['', undefined, null].includes(x.SELECTORVALUE.max)) ||
            (x.ZJLX === 'DATE' &&
              ['', undefined, null].includes(x.SELECTORVALUE.min) &&
              ['', undefined, null].includes(x.SELECTORVALUE.max))
          )
        ) {
          //当前里程碑和是否父项目这种单选的条件空了也不要把条件传过来
          sxtjArr.push({
            SXLX,
            SXTJ,
            SXSJ,
          });
        }
      }
      delete x.SELECTORDATA;
    });
    conditionGroupArr.forEach(x => {
      bmArr.push(x.BM);
      sxtjArr.push({
        SXLX: 'ZHTJ',
        SXTJ: x.SXTJ,
        SXSJ: [],
      });
    });

    bmArr = [...new Set(bmArr)]; //去重

    let params = {
      sxtj: sxtjArr,
      cxb: bmArr,
      cxzd: zszdArr,
      czlx: 'SEARCH',
      year,
    };
    SaveCustomReportSetting(params)
      .then(res => {
        if (res?.success) {
          setCurSQL(res.note.replace(/\n/g, ' '));
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
            sort,
          });
          setIsSpinning(false);
          setFirstLoading(false);
          e = performance.now();
          console.log(`表格数据Request time: ${e - s} milliseconds`, s, e);
        }
      })
      .catch(e => {
        console.error('🚀报表信息', e);
        message.error('报表信息获取失败', 1);
        setIsSpinning(false);
      });
  };

  //导出
  const handleExport = () => {
    QueryCustomReport({
      bbid,
      current: 1,
      cxlx: 'SQL',
      sql: curSQL,
      pageSize: 20,
      paging: -1, //不分页
      sort: 'XMID DESC',
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          let LOGIN_USERID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
          QueryUserRole({
            userId: LOGIN_USERID,
          }).then(res2 => {
            if (res2.success) {
              const isLeader = res2.role !== '普通人员';
              const isBudgetMnger = res2.zyrole === '预算管理人'; //是否预算管理人
              let exportData = JSON.parse(res.result);
              let dataIndexArr = data.columns.map(item => item.dataIndex);
              let finalArr = [];
              exportData.forEach(obj => {
                let temp = {};
                dataIndexArr.forEach(dataIndex => {
                  let title = data.columns.find(item => item.dataIndex === dataIndex)?.title;
                  if (
                    //金额类型
                    ['XMYSJE', 'YSXMJE', 'HTJE', 'LYBZJ', 'TBBZJ', 'YFKFY', 'WFKFY'].includes(
                      dataIndex,
                    )
                  ) {
                    temp[title] =
                      isLeader || LOGIN_USERID === Number(obj.XMJLID) || isBudgetMnger
                        ? obj[dataIndex]
                        : '***';
                  } else {
                    temp[title] = obj[dataIndex];
                  }
                  delete obj[dataIndex];
                });
                finalArr.push(temp);
              });
              //导出的顺序
              let titleOrder = [];
              data.columns.forEach(e => {
                titleOrder.push(e.title);
              });
              exportExcelFile(finalArr, 'Sheet1', bbmc + '.xlsx');
            }
          });
        }
      })
      .catch(e => {
        console.error('🚀导出数据', e);
        message.error('导出数据获取失败', 1);
      });
  };

  /**
   * 导出 excel 文件
   * @param array JSON 数组
   * @param sheetName 第一张表名
   * @param fileName 文件名
   */
  const exportExcelFile = (array = [], sheetName = 'Sheet1', fileName = 'example.xlsx') => {
    console.log('要导出的数据', array);
    const jsonWorkSheet = XLSX.utils.json_to_sheet(array);
    const workBook = {
      SheetNames: [sheetName],
      Sheets: {
        [sheetName]: jsonWorkSheet,
      },
    };
    return XLSX.writeFile(workBook, fileName);
  };

  //年份变化后刷新预算项目、项目名称数据
  const handleYearChange = async year => {
    try {
      setIsSpinning(true);
      let arr = JSON.parse(JSON.stringify(data.filterData));
      let filterArr = arr
        .filter(x => x.TJBCXLX === 'YSXM' || x.TJBCXLX === 'XM')
        .sort((a, b) => Number(a.ID) - Number(b.ID)); //保证项目名称第一个
      let promiseArr = filterArr.map(x =>
        QueryCustomQueryCriteria({
          queryType: x.TJBCXLX === 'YSXM' ? 'YSXM' : 'XM',
          year,
        }),
      );
      const resArr = await Promise.all(promiseArr);
      if (arr.findIndex(x => x.TJBCXLX === 'YSXM') !== -1) {
        const res = resArr[1] || {};
        if (res.success) {
          arr.forEach(x => {
            if (x.TJBCXLX === 'YSXM') {
              x.sltOpen = false; //树下拉框展开收起
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
              //默认赋值
              if (type.length > 0) {
                x.SELECTORVALUE = {
                  type: type[0]?.YSLXID,
                  typeObj: type[0],
                  value: [],
                };
              }
            }
          });
        }
      }
      if (arr.findIndex(x => x.TJBCXLX === 'XM') !== -1) {
        const res = resArr[0] || {};
        if (res.success) {
          arr.forEach(x => {
            if (x.TJBCXLX === 'XM') {
              x.SELECTORDATA = JSON.parse(res.result);
              x.SELECTORVALUE = [];
            }
          });
        }
      }
      setData(p => ({
        ...p,
        filterData: arr,
      }));
      setIsSpinning(false);
    } catch (error) {
      console.error('🚀 ~ handleYearChange ~ error:', error);
      message.error('数据加载异常', 2);
      setIsSpinning(false);
    }
  };

  return (
    <div
      className="custom-rpt-info-box"
      style={isFold ? { paddingLeft: 0, borderRadius: '8px' } : {}}
    >
      {isSpinning && firstLoading && (
        <div className="rpt-right-empty">
          <>
            <img src={emptyImg} alt="" />
            <div className="empty-txt">欢迎使用自定义查询</div>
          </>
        </div>
      )}
      <Fragment>
        <TopConsole
          data={data}
          setData={setData}
          tableData={tableData}
          getSQL={getSQL}
          isUnfold={isUnfold}
          setIsUnfold={setIsUnfold}
          yearData={yearData}
          setYearData={setYearData}
          handleYearChange={handleYearChange}
        />
        <InfoTable
          data={data}
          columns={data.columns}
          tableData={tableData}
          getSQL={getSQL}
          handleExport={handleExport}
          exportExcelFile={exportExcelFile}
          routes={routes}
          bbid={bbid}
          setIsSpinning={setIsSpinning}
          cjrid={cjrid}
          bbmc={bbmc}
          handleEdit={handleEdit}
          refreshAfterSave={refreshAfterSave}
          sortInfo={sortInfo}
          setSortInfo={setSortInfo}
          yearData={yearData}
        />
      </Fragment>
    </div>
  );
}
