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

export default function CustomRptManagement(props) {
  const { routes = [] } = props;
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
  const [status, setStatus] = useState('normal'); //editing、adding、normal
  const [editingId, setEditingId] = useState(-1); //正在编辑的报表id
  const history = useHistory();

  useEffect(() => {
    getRptList();
    return () => {};
  }, []);

  useEffect(() => {
    console.log('🚀 ~ selectedData:', selectedData);
    return () => {};
  }, [JSON.stringify(selectedData)]);

  // 获取条件基础数据
  const getBasicData = (isAdding = true) => {
    setIsSpinning(true);
    QueryCustomQueryCriteria({
      queryType: 'SXTJ',
    })
      .then(res => {
        if (res?.success) {
          let data = JSON.parse(res.result);
          QueryCustomQueryCriteria({
            queryType: 'ZHTJ',
          })
            .then(res => {
              if (res?.success) {
                let data2 = JSON.parse(res.result);
                QueryCustomQueryCriteria({
                  queryType: 'ZSZD',
                })
                  .then(res => {
                    if (res?.success) {
                      let columnFieldsArr = JSON.parse(res.result);
                      columnFieldsArr.forEach(x => {
                        if (x.ID === 8) {
                          x.disabled = true; //项目名称不可操作, ID为8
                        }
                      });
                      const data3 = buildTree(columnFieldsArr, 'title', 'key');
                      // console.log(
                      //   'conditionFilter: ',
                      //   data,
                      //   'conditionGroup: ',
                      //   data2,
                      //   'columnFields: ',
                      //   data3,
                      // );
                      setBasicData({
                        conditionFilter: data,
                        conditionGroup: data2,
                        columnFields: data3,
                      });
                      //新增时 - 筛选条件和展示字段默认项目名称, ID为8
                      if (isAdding) {
                        // console.log('新建数据初始化');
                        let conditionFilterXmmc = data.filter(x => x.ID === 8)[0];
                        let columnFieldsXmmc = JSON.parse(res.result).filter(x => x.ID === 8)[0];
                        columnFieldsXmmc.title = columnFieldsXmmc.NAME;
                        columnFieldsXmmc.key = columnFieldsXmmc.ID;
                        if (conditionFilterXmmc.TJBCXLX) {
                          QueryCustomQueryCriteria({
                            queryType: conditionFilterXmmc.TJBCXLX,
                          })
                            .then(res => {
                              if (res?.success) {
                                conditionFilterXmmc.SELECTORVALUE = undefined;
                                conditionFilterXmmc.SELECTORDATA = JSON.parse(res.result);
                                setSelectedData(p => ({
                                  ...p,
                                  conditionFilter: [conditionFilterXmmc],
                                  columnFields: [columnFieldsXmmc],
                                }));
                                setSelectedOrigin(p => ({
                                  ...p,
                                  conditionFilter: [
                                    {
                                      ...JSON.parse(JSON.stringify(conditionFilterXmmc)),
                                      SELECTORVALUE: undefined,
                                    },
                                  ],
                                  columnFields: [JSON.parse(JSON.stringify(columnFieldsXmmc))],
                                }));
                                setIsSpinning(false);
                              }
                            })
                            .catch(e => {
                              console.error('🚀', e);
                              message.error(conditionFilterXmmc.TJBCXLX + '信息获取失败', 1);
                              setIsSpinning(false);
                            });
                        }
                      } else {
                        setIsSpinning(false);
                      }
                    }
                  })
                  .catch(e => {
                    console.error('🚀', e);
                    message.error('表格字段信息获取失败', 1);
                    setIsSpinning(false);
                  });
              }
            })
            .catch(e => {
              console.error('🚀', e);
              message.error('组合条件获取失败', 1);
              setIsSpinning(false);
            });
        }
      })
      .catch(e => {
        console.error('🚀', e);
        message.error('筛选条件信息获取失败', 1);
        setIsSpinning(false);
      });
  };

  //获取编辑基础数据
  const getEditData = bbid => {
    setIsSpinning(true);
    setEditingId(bbid);
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
      .then(res => {
        if (res?.success) {
          const obj = JSON.parse(res.mbxx)[0];
          let filterData = JSON.parse(obj.QDZSSXZD);
          if (filterData.length > 0) {
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
                          return arr.filter(
                            item => !res.has(item[uniId]) && res.set(item[uniId], 1),
                          );
                        }
                        let type = uniqueFunc(JSON.parse(res.result), 'YSLXID');
                        let origin = JSON.parse(res.result);
                        x.SELECTORDATA = {
                          type,
                          origin,
                        };
                      } else if (x.ZJLX === 'TREE-MULTIPLE') {
                        x.SELECTORDATA = buildTree(JSON.parse(res.result));
                      } else {
                        x.SELECTORDATA = JSON.parse(res.result);
                      }
                    }
                  })
                  .then(() => {
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
                  })
                  .catch(e => {
                    console.error('🚀', e);
                    message.error(x.TJBCXLX + '信息获取失败', 1);
                  });
              }
            });
          } else {
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
          }
        }
      })
      .catch(e => {
        console.error('🚀报表信息', e);
        message.error('报表信息获取失败', 1);
        setIsSpinning(false);
      });
  };

  //获取我的报表列表数据
  const getRptList = (bbmc = undefined, current = 1) => {
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
          setIsSpinning(false);
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
      conditionFilter: [{ ...selectedOrigin.conditionFilter[0], SELECTORVALUE: undefined }],
    });

    setSelectingData({
      conditionFilter: [],
      conditionGroup: [],
      columnFields: [],
    });
    setRptName('未命名报表');
    setRptNameOrigin('未命名报表');
    setDragKey(null);
    setStatus('normal');
    setEditingId(-1);
  };

  //是否保存
  const getIsSaved = (status = 'normal') => {
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
                  <Link to={{ pathname: pathname, state: { routes: historyRoutes } }}>{name}</Link>
                )}
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      </Spin>
      <div className="bottom-wrapper">
        <SiderRptList
          dataProps={{
            status,
            rptList,
            rptOrigin,
            editingId,
            basicData,
            selectedOrigin,
          }}
          funcProps={{
            hangleDataRestore,
            getEditData,
            setRptList,
            getBasicData,
            setStatus,
            getIsSaved,
          }}
        />
        {status === 'normal' ? (
          <div className="rpt-right-empty">
            <>
              <img src={emptyImg} alt="" />
              <div className="empty-txt">欢迎使用自定义查询</div>
            </>
          </div>
        ) : (
          <RightRptContent
            dataProps={{
              status,
              dragKey,
              rptName,
              basicData,
              selectingData,
              selectedData,
              editingId,
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
            }}
          />
        )}
      </div>
    </div>
  );
}
