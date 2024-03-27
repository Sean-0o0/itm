import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { message, Spin, Tabs } from 'antd';
import { connect } from 'dva';
import {
  FetchQueryOwnerProjectList,
  QueryIteContractInfoList,
  QueryMemberInfo,
  QueryUserRole,
  QueryXCContractInfo,
} from '../../../services/pmsServices';
import TableBox from './TableBox';
import { DecryptBase64 } from '../../Common/Encrypt';
import { FetchQueryOrganizationInfo } from '../../../services/projectManage';
import { setParentSelectableFalse } from '../../../utils/pmsPublicUtils';
import IterationContractInfo from './IterationContractInfo';
import { debounce } from 'lodash';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  roleData: global.roleData,
}))(function InnovationContract(props) {
  const {
    dictionary = {},
    match: {
      params: { params = '' },
    },
    userBasicInfo = {},
    roleData = {},
  } = props;
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 20,
    total: 0,
    sort: '',
  });
  const [filterData, setFilterData] = useState({
    projectId: undefined, //  关联项目
    contractCode: undefined, //合同编号
    contractName: undefined, //合同名称
    handleStatus: undefined, //处理状态
    trustee: undefined, //经办人
    sysType: undefined, //系统类型
    contractType: undefined, //合同类型
    isXC: undefined, //是否信创
  }); //筛选栏数据
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [sltData, setSltData] = useState({
    glxm: [], //关联项目
    jbr: [], //经办人
  }); //筛选栏下拉框数据
  const [filterFold, setFilterFold] = useState(true); //收起 true、展开 false
  const [activeKey, setActiveKey] = useState('PTHT');
  const [sortInfo, setSortInfo] = useState({
    sort: undefined,
    columnKey: '',
  }); //控制排序状态
  const [searchData, setSearchData] = useState([]); //点过查询后的筛选栏数据
  const roleTxt =
    (JSON.parse(roleData.testRole || '{}')?.ALLROLE ?? '') + ',' + (roleData.role ?? ''); //角色信息

  useLayoutEffect(() => {
    if (params !== '') {
      let obj = JSON.parse(DecryptBase64(params));
      console.log('🚀 ~ useLayoutEffect ~ obj:', obj);
      if (obj.tab === 'PTHT') {
        setFilterData(p => ({ ...p, contractCode: obj.htbh }));
        setSearchData(p => ({ ...p, contractCode: obj.htbh }));
        queryTableData({ contractCode: obj.htbh });
        queryProjectData(roleTxt.includes('信创管理员'));
      } else {
        queryDDHTTableData({});
      }
    } else {
      if (activeKey === 'PTHT') {
        queryTableData({});
        queryProjectData(roleTxt.includes('信创管理员'));
      } else {
        queryDDHTTableData({});
      }
    }
    return () => {};
  }, [params, roleTxt]);

  //查询表格数据
  const queryTableData = (
    {
      current = 1,
      pageSize = 20,
      sort = '',
      projectId = undefined, //  关联项目
      contractCode = undefined, //合同编号
      // contractName = undefined, //合同名称
      handleStatus = undefined, //处理状态
      trustee = undefined, //经办人
      sysType = undefined, //系统类型
      contractType = undefined, //合同类型
      isXC = undefined, //是否信创
    },
    setSearchData = () => {},
  ) => {
    setIsSpinning(true);
    //信创合同信息
    QueryXCContractInfo({
      projectId, //  关联项目
      contractCode, //合同编号
      handleStatus, //处理状态
      trustee, //经办人
      sysType, //系统类型
      contractType, //合同类型
      isXC,
      current,
      pageSize,
      paging: 1,
      sort,
      total: -1,
      role: roleTxt,
    })
      .then(res => {
        if (res?.success) {
          console.log('🚀 ~ tableData:', JSON.parse(res.result));
          setTableData(p => ({
            ...p,
            current,
            pageSize,
            sort,
            total: res.totalrows,
            data: JSON.parse(res.result),
          }));
          setSearchData({
            projectId, //  关联项目
            contractCode, //合同编号
            handleStatus, //处理状态
            trustee, //经办人
            sysType, //系统类型
            contractType, //合同类型
            isXC,
          });
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀表格数据', e);
        message.error('表格数据获取失败', 1);
        setIsSpinning(false);
      });
  };

  //项目下拉框数据
  const queryProjectData = (isGLY = false) => {
    FetchQueryOwnerProjectList({
      paging: -1,
      total: -1,
      sort: '',
      cxlx: isGLY ? 'ALL' : 'GR',
    }).then(res => {
      if (res.code === 1) {
        // console.log('🚀 ~ file: index.js:136 ~ queryProjectData ~ res:', res);
        setSltData(p => ({
          ...p,
          glxm: [...res.record].map(x => ({ XMMC: x.xmmc, XMID: x.xmid, XMNF: x.xmnf })),
        }));
        getJbrData();
      }
    });
  };

  //经办人下拉框数据
  const getJbrData = () => {
    FetchQueryOrganizationInfo({
      type: roleTxt.includes('非IT部门') ? 'FITBM' : 'FXRY',
    })
      .then(res => {
        if (res?.success) {
          //转树结构
          function toTreeData(list, label = 'title', value = 'value') {
            let map = {};
            let treeData = [];

            list.forEach(item => {
              map[item.orgId] = item;
              item[value] = item.orgId;
              item[label] = item.orgName;
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
              let parent = map[item.orgFid];
              if (!parent) {
                treeData.push(item);
              } else {
                parent.children.push(item);
                item.orgFid = parent.orgId;
              }
            });

            // 处理没有子节点的元素
            treeData.forEach(node => {
              traverse(node);
            });

            return treeData;
          }
          let data = toTreeData(res.record)[0].children[0].children;
          QueryMemberInfo({
            type: roleTxt.includes('非IT部门') ? 'FITBM' : 'XXJS',
          })
            .then(res => {
              if (res.success) {
                let finalData = JSON.parse(JSON.stringify(data));
                let memberArr = JSON.parse(res.record).map(x => ({
                  ...x,
                  title: x.name,
                  value: x.id,
                }));
                finalData.forEach(item => {
                  let parentArr = [];
                  memberArr.forEach(y => {
                    if (y.orgId === item.value) parentArr.push(y);
                  });
                  item.children = [
                    ...parentArr,
                    ...(item.children || []).filter(x => {
                      let childArr = [];
                      memberArr.forEach(y => {
                        if (y.orgId === x.value) childArr.push(y);
                      });
                      return childArr.length > 0;
                    }),
                  ];
                  if (item.value === '11168') {
                    item.children?.unshift({
                      gw: '总经理',
                      value: '1852',
                      title: '黄玉锋',
                      orgId: '11168',
                      orgName: '信息技术开发部',
                      xb: '男',
                      xh: '1',
                    });
                  }
                  item.children?.forEach(x => {
                    let childArr = [];
                    memberArr.forEach(y => {
                      if (y.orgId === x.value) childArr.push(y);
                    });
                    x.children = [
                      ...childArr,
                      ...(x.children || []).filter(m => {
                        let childArr2 = [];
                        memberArr.forEach(n => {
                          if (n.orgId === m.value) childArr2.push(n);
                        });
                        return childArr2.length > 0;
                      }),
                    ];
                  });
                });
                if (!roleTxt.includes('非IT部门')) {
                  finalData = finalData.filter(item => {
                    let parentArr = [];
                    memberArr.forEach(y => {
                      if (y.orgId === item.value) parentArr.push(y);
                    });
                    return parentArr.length > 0;
                  });
                }
                finalData.forEach(node => setParentSelectableFalse(node));
                setSltData(p => ({ ...p, jbr: finalData }));
                setIsSpinning(false);
              }
            })
            .catch(e => {
              message.error('经办人下拉框数据查询失败', 1);
              setIsSpinning(false);
            });
        }
      })
      .catch(e => {
        console.error('🚀部门信息', e);
        message.error('部门信息获取失败', 1);
        setIsSpinning(false);
      });
  };

  //迭代合同表格数据
  const queryDDHTTableData = useCallback(
    debounce(
      (
        {
          current = 1,
          pageSize = 20,
          sort = '',
          entrant, //录入人
          vendor, //供应商
          projectName, //关联项目
          contractName, //合同名称
        },
        setSearchData = () => {},
      ) => {
        setIsSpinning(true);
        //信创合同信息
        QueryIteContractInfoList({
          vendor,
          entrant,
          projectName,
          contractName,
          current,
          pageSize,
          paging: 1,
          sort,
          total: -1,
          queryType: 'LIST',
          role: roleTxt,
        })
          .then(res => {
            if (res?.success) {
              setTableData(p => ({
                ...p,
                current,
                pageSize,
                sort,
                total: res.totalrows,
                data: JSON.parse(res.result),
              }));
              setSearchData({
                vendor,
                entrant,
                projectName,
                contractName,
              });
              setIsSpinning(false);
            }
          })
          .catch(e => {
            console.error('🚀表格数据', e);
            message.error('表格数据获取失败', 1);
            setIsSpinning(false);
          });
      },
      500,
    ),
    [],
  );

  const handleTabsChange = key => {
    setFilterData({});
    setSortInfo({ sort: undefined, columnKey: '' });
    setActiveKey(key);
    setIsSpinning(true);
    setTableData({
      data: [],
      current: 1,
      pageSize: 20,
      total: 0,
      sort: '',
    });
    if (key === 'PTHT') {
      queryTableData({});
    } else {
      queryDDHTTableData({});
    }
  };

  return (
    <div className="innovation-contract-box">
      <Spin spinning={isSpinning} tip="加载中" wrapperClassName="innovation-contract-spin-wrapper">
        <div className="top-console">
          <Tabs
            defaultActiveKey="PTHT"
            activeKey={activeKey}
            onChange={handleTabsChange}
            size={'large'}
          >
            <Tabs.TabPane tab="普通合同信息" key="PTHT"></Tabs.TabPane>
            <Tabs.TabPane tab="迭代合同信息" key="DDHT"></Tabs.TabPane>
          </Tabs>
        </div>
        {activeKey === 'PTHT' ? (
          <TableBox
            dataProps={{
              tableData,
              filterData,
              isSpinning,
              dictionary,
              sltData,
              filterFold,
              userBasicInfo,
              roleTxt,
              searchData,
            }}
            funcProps={{
              setFilterData,
              queryTableData,
              setIsSpinning,
              setFilterFold,
              setSearchData,
            }}
          />
        ) : (
          <IterationContractInfo
            dataProps={{ tableData, filterData, sortInfo, searchData }}
            funcProps={{
              setFilterData,
              queryDDHTTableData,
              setIsSpinning,
              setSortInfo,
              setSearchData,
            }}
          />
        )}
      </Spin>
    </div>
  );
});
