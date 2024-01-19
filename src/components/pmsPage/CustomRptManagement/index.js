import React, { useEffect, useState, useRef } from 'react';
import { message, Spin, Breadcrumb } from 'antd';
import {
  FetchQueryCustomReportList,
  QueryCustomQueryCriteria,
  QueryCustomReport,
} from '../../../services/pmsServices/index';
import emptyImg from '../../../assets/homePage/custom-rpt-empty.png';
import SiderRptList from './SiderRptList';
import RightRptContent from './RightRptContent';
import { Link, useHistory } from 'react-router-dom';
import { isEqual } from 'lodash';
import CustomRptInfo from '../CustomRptInfo';

export default function CustomRptManagement(props) {
  const { routes = [], propsData = {}, isNew = false } = props;
  const [basicData, setBasicData] = useState({
    conditionFilter: [],
    conditionGroup: [],
    columnFields: [],
  }); //条件基础数据
  const [selectingData, setSelectingData] = useState({
    conditionFilter: [],
    conditionGroup: [],
    columnFields: [],
  }); //选择中条件数据 - 确定前
  const [selectedData, setSelectedData] = useState({
    conditionFilter: [],
    conditionGroup: [],
    columnFields: [],
  }); //已选条件数据
  const [selectedOrigin, setSelectedOrigin] = useState({
    conditionFilter: [],
    conditionGroup: [],
    columnFields: [],
  }); //已选条件数据 - 原数据 - 新建时
  const [selectedEditOrigin, setSelectedEditOrigin] = useState({
    conditionFilter: [],
    conditionGroup: [],
    columnFields: [],
  }); //已选条件数据 - 原数据 - 编辑时
  const [rptNameOrigin, setRptNameOrigin] = useState('未命名报表'); //报表名称
  const [rptList, setRptList] = useState([]); //我的报表列表数据
  const [rptOrigin, setRptOrigin] = useState([]); //我的报表列表数据 - 原数据
  const [dragKey, setDragKey] = useState(null); //拖动id
  const [rptName, setRptName] = useState('未命名报表'); //报表名称
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [status, setStatus] = useState('unSlt'); //editing 修改中、adding 新建中、unSlt 还未选中具体报表、slted 已选中具体报表
  const [activeBbData, setActiveBbData] = useState({
    bbid: -1,
    bbmc: '未命名报表',
    cjrid: -1,
  }); //已选中的报表数据，不动旧代码新加的
  const [isFold, setIsFold] = useState(false); //是否收起侧边列表
  const history = useHistory();
  var s = 0;
  var e = 0;

  useEffect(() => {
    if (isNew) {
      getRptList(undefined, 1, true);
      //新建
      if (basicData.conditionFilter?.length === 0 || selectedOrigin.conditionFilter?.length === 0) {
        //需要获取基础数据
        getBasicData(true);
      } else {
        hangleDataRestore();
      }
      setStatus('adding');
      setSelectedData({
        ...selectedOrigin,
      });
      setSelectingData({
        conditionFilter: [],
        conditionGroup: [],
        columnFields: [],
      });
      setRptName('未命名报表');
      setRptNameOrigin('未命名报表');
      setActiveBbData({ bbid: -1, bbmc: '未命名报表', cjrid: -1 });
    }
    return () => {};
  }, [isNew]);

  useEffect(() => {
    if (JSON.stringify(propsData) !== '{}') {
      getRptList(undefined, 1, true); //等到加载到最后再结束loading
      // console.log('🚀 ~ useEffect ~ propsData:', propsData);
      setActiveBbData(propsData);
      setStatus('slted');
    }
    return () => {};
  }, [JSON.stringify(propsData)]);

  // 获取条件基础数据
  const getBasicData = async (isAdding = true) => {
    s = performance.now();
    try {
      setIsSpinning(true);
      const promiseArr = [
        QueryCustomQueryCriteria({
          queryType: 'SXTJ',
        }),
        QueryCustomQueryCriteria({
          queryType: 'ZSZD',
        }),
      ];
      const [conditionFilterRes, columnFieldsRes] = await Promise.all(promiseArr);
      if (conditionFilterRes?.success && columnFieldsRes?.success) {
        let conditionFilterData = JSON.parse(conditionFilterRes.result);
        let columnFieldsArr = JSON.parse(columnFieldsRes.result);
        columnFieldsArr.forEach(x => {
          if (x.ID === 8) {
            x.disabled = true; //项目名称不可操作, ID为8
          }
        });
        const columnFieldsData = buildTree(columnFieldsArr, 'title', 'key');
        setBasicData({
          conditionFilter: conditionFilterData,
          conditionGroup: [],
          columnFields: columnFieldsData,
        });
        //新增时 - 筛选条件和展示字段默认项目名称, ID为8
        if (isAdding) {
          let conditionFilterDefault = conditionFilterData.filter(x =>
            [8, 10, 102].includes(Number(x.ID)),
          );
          let columnFieldsDefault = JSON.parse(columnFieldsRes.result)
            .filter(x => [8, 10, 102, 18, 21].includes(Number(x.ID)))
            ?.map(x => ({ ...x, key: x.ID, title: x.NAME }));
          const promiseArr = conditionFilterDefault.map(x =>
            QueryCustomQueryCriteria({
              queryType: x.TJBCXLX,
            }),
          );
          const resArr = await Promise.all(promiseArr);
          resArr.forEach((res, index) => {
            if (res?.success) {
              if (conditionFilterDefault[index].TJBCXLX === 'YSXM') {
                conditionFilterDefault[index].sltOpen = false; //树下拉框展开收起
                function uniqueFunc(arr, uniId) {
                  const res = new Map();
                  return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1));
                }
                let type = uniqueFunc(JSON.parse(res.result), 'YSLXID');
                let origin = JSON.parse(res.result);
                conditionFilterDefault[index].SELECTORDATA = {
                  type,
                  origin,
                };
                //默认赋值
                if (type.length > 0) {
                  conditionFilterDefault[index].SELECTORVALUE = {
                    type: type[0]?.YSLXID,
                    typeObj: type[0],
                    value: [],
                  };
                }
              } else if (conditionFilterDefault[index].ZJLX === 'TREE-MULTIPLE') {
                conditionFilterDefault[index].SELECTORDATA = buildTree(JSON.parse(res.result));
              } else if (!conditionFilterDefault[index].TJBCXLX) {
                conditionFilterDefault[index].SELECTORDATA = undefined;
                conditionFilterDefault[index].SELECTORVALUE = undefined;
              } else {
                conditionFilterDefault[index].SELECTORDATA = JSON.parse(res.result);
              }
            }
          });
          setSelectedData(p => ({
            ...p,
            conditionFilter: conditionFilterDefault,
            columnFields: columnFieldsDefault,
          }));
          setSelectedOrigin(p => ({
            ...p,
            conditionFilter: [...JSON.parse(JSON.stringify(conditionFilterDefault))],
            columnFields: JSON.parse(JSON.stringify(columnFieldsDefault)),
          }));
          setIsSpinning(false);
        }
      }
    } catch (e) {
      console.error('🚀', e);
      message.error('筛选条件信息获取失败', 1);
      setIsSpinning(false);
    }
    e = performance.now();
    console.log(`基础数据Request time: ${e - s} milliseconds`, s, e);
  };

  //获取编辑基础数据
  const getEditData = bbid => {
    setIsSpinning(true);
    setActiveBbData(p => ({ ...p, bbid }));
    //报表信息
    QueryCustomReport({
      bbid,
      current: 1,
      cxlx: 'NORESULT',
      pageSize: 20,
      paging: 1,
      sort: 'XMID DESC',
      total: -1,
    })
      .then(async res => {
        if (res?.success) {
          s = performance.now();
          const obj = JSON.parse(res.mbxx)[0];
          let filterData = JSON.parse(obj.QDZSSXZD || '[]');
          const promiseArr = filterData.map(x =>
            QueryCustomQueryCriteria({
              queryType: x.TJBCXLX,
            }),
          );
          const resArr = (await Promise.all(promiseArr)) || [];
          resArr.forEach((res, index) => {
            if (res?.success) {
              if (filterData[index].TJBCXLX === 'YSXM') {
                function uniqueFunc(arr, uniId) {
                  const res = new Map();
                  return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1));
                }
                let type = uniqueFunc(JSON.parse(res.result), 'YSLXID');
                let origin = JSON.parse(res.result);
                filterData[index].SELECTORDATA = {
                  type,
                  origin,
                };
              } else if (filterData[index].ZJLX === 'TREE-MULTIPLE') {
                filterData[index].SELECTORDATA = buildTree(JSON.parse(res.result));
              } else {
                filterData[index].SELECTORDATA = JSON.parse(res.result);
              }
            }
          });
          setSelectedData({
            conditionFilter: filterData,
            conditionGroup: JSON.parse(obj.QDZSZHZD),
            columnFields: JSON.parse(obj.QDZSBTZD),
          });
          setSelectedEditOrigin({
            conditionFilter: JSON.parse(JSON.stringify(filterData)),
            conditionGroup: JSON.parse(obj.QDZSZHZD),
            columnFields: JSON.parse(obj.QDZSBTZD),
          });
          setRptName(obj.BBMC);
          setRptNameOrigin(obj.BBMC);
          setStatus('editing');
          setIsSpinning(false);
          e = performance.now();
          console.log(`下拉框数据Request time: ${e - s} milliseconds`, s, e);
        }
      })
      .catch(e => {
        console.error('🚀报表信息', e);
        message.error('报表信息获取失败', 1);
        setIsSpinning(false);
      });
  };

  //获取我的报表列表数据
  const getRptList = (bbmc = undefined, current = 1, stopSpinning = false) => {
    setIsSpinning(true);
    let params = {
      current,
      cxlx: 'CJ',
      pageSize: 10,
      paging: -1,
      sort: '',
      total: -1,
      // bbmc:''
    };
    if (bbmc !== '' && bbmc !== undefined) {
      params.bbmc = bbmc;
    }
    FetchQueryCustomReportList(params)
      .then(res => {
        if (res?.success) {
          let rec = JSON.parse(res.result);
          // if (res.totalrows <= 10) {
          //   isNoMoreData.current = true;
          //   setRptList([...rec]);
          // } else if (rec.length === 0) {
          //   isNoMoreData.current = true;
          // } else {
          //   isNoMoreData.current = false;
          //   setRptList(p => [...p, ...rec]);
          // }
          setRptList([...rec]);
          setRptOrigin([...rec]);
          !stopSpinning && setIsSpinning(false); //新建时不调用这个
        }
      })
      .catch(e => {
        console.error('🚀我的报表列表数据', e);
        message.error('我的报表列表数据获取失败', 1);
        setIsSpinning(false);
      });
  };

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

  //数据还原
  const hangleDataRestore = () => {
    setSelectedData({
      ...selectedOrigin,
    });

    setSelectingData({
      conditionFilter: [],
      conditionGroup: [],
      columnFields: [],
    });
    setRptName('未命名报表');
    setRptNameOrigin('未命名报表');
    setDragKey(null);
    setStatus('unSlt');
    setActiveBbData({ bbid: -1, bbmc: '未命名报表', cjrid: -1 });
  };

  //是否保存
  const getIsSaved = (status = 'unSlt') => {
    console.log(
      '🚀 ~ getIsSaved',
      rptName,
      rptNameOrigin,
      selectedData,
      selectedOrigin,
      selectedEditOrigin,
    );
    if (status === 'adding')
      return isEqual(selectedData, selectedOrigin) && isEqual(rptName, rptNameOrigin);
    else if (status === 'editing')
      return isEqual(selectedData, selectedEditOrigin) && isEqual(rptName, rptNameOrigin);
    else return true;
  };

  //点击编辑
  const handleEdit = bbid => {
    //需要获取基础数据
    getBasicData(false);
    setStatus('editing');
    getEditData(bbid);
  };

  //选中左侧报表报错情况处理
  const handleError = () => {
    setStatus('unSlt');
    setActiveBbData({ bbid: -1, bbmc: '未命名报表', cjrid: -1 });
  };

  //保存至我的后刷新
  const refreshAfterSave = (obj = {}) => {
    getRptList(undefined, 1, true);
    setActiveBbData(obj);
  };

  return (
    <div className="custom-rpt-management-box">
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
                  <Link
                    to={{
                      pathname: pathname,
                      state: {
                        routes: historyRoutes,
                      },
                    }}
                  >
                    {name}
                  </Link>
                )}
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
        <div className="bottom-wrapper">
          <SiderRptList
            dataProps={{
              status,
              rptList,
              rptOrigin,
              basicData,
              selectedOrigin,
              activeBbData,
              isFold,
            }}
            funcProps={{
              hangleDataRestore,
              getEditData,
              setRptList,
              getBasicData,
              setStatus,
              getIsSaved,
              setRptName,
              setRptNameOrigin,
              setSelectingData,
              setSelectedData,
              setActiveBbData,
              setIsFold,
            }}
          />
          {status === 'unSlt' && (
            <div className="rpt-right-empty" style={isFold ? { marginLeft: 0 } : {}}>
              <>
                <img src={emptyImg} alt="" />
                <div className="empty-txt">欢迎使用自定义查询</div>
              </>
            </div>
          )}
          {['editing', 'adding'].includes(status) && (
            <div className="rpt-right" style={isFold ? { borderRadius: '8px' } : {}}>
              <RightRptContent
                dataProps={{
                  status,
                  dragKey,
                  rptName,
                  basicData,
                  selectingData,
                  selectedData,
                  selectedOrigin,
                  activeBbData,
                }}
                funcProps={{
                  setStatus,
                  setDragKey,
                  setRptName,
                  setIsSpinning,
                  buildTree,
                  setSelectingData,
                  setSelectedData,
                  hangleDataRestore,
                  getRptList,
                  setActiveBbData,
                  getIsSaved,
                }}
              />
            </div>
          )}
          {status === 'slted' && (
            <div className="rpt-right">
              <CustomRptInfo
                {...activeBbData}
                handleEdit={handleEdit}
                setIsSpinning={setIsSpinning}
                handleError={handleError}
                isFold={isFold}
                isSpinning={isSpinning}
                emptyImg={emptyImg}
                refreshAfterSave={refreshAfterSave}
              />
            </div>
          )}
        </div>
      </Spin>
    </div>
  );
}
