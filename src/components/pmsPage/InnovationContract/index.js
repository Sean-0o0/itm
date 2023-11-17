import React, { useEffect, useLayoutEffect, useState } from 'react';
import { message, Spin } from 'antd';
import TopConsole from './TopConsole';
import { connect } from 'dva';
import {
  FetchQueryOwnerProjectList,
  QueryMemberInfo,
  QueryUserRole,
  QueryXCContractInfo,
} from '../../../services/pmsServices';
import TableBox from './TableBox';
import { DecryptBase64 } from '../../Common/Encrypt';
import { FetchQueryOrganizationInfo } from '../../../services/projectManage';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(function InnovationContract(props) {
  const {
    dictionary = {},
    match: {
      params: { params = '' },
    },
    userBasicInfo = {},
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

  useLayoutEffect(() => {
    if (params !== '') {
      let obj = JSON.parse(DecryptBase64(params));
      // console.log('🚀 ~ file: index.js:43 ~ useLayoutEffect ~ obj:', obj);
    }
    console.log("🚀 ~ file: index.js:53 ~ useLayoutEffect ~ params:", params)
    queryTableData({});
    getUserRole();
    return () => {};
  }, [params]);

  //获取用户角色
  const getUserRole = () => {
    QueryUserRole({
      userId: userBasicInfo.id,
    })
      .then(res => {
        if (res?.code === 1) {
          const { testRole = '{}' } = res;
          queryProjectData(JSON.parse(testRole).ALLROLE?.includes('信创管理员'));
        }
      })
      .catch(e => {
        console.error('QueryUserRole', e);
        message.error('用户角色信息查询失败', 1);
      });
  };

  //查询表格数据
  const queryTableData = ({
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
  }) => {
    setIsSpinning(true);
    //信创合同信息
    QueryXCContractInfo({
      projectId, //  关联项目
      contractCode, //合同编号
      // contractName , //合同名称
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
          glxm: [...res.record].map(x => ({ XMMC: x.xmmc, XMID: x.xmid })),
        }));
        getJbrData();
      }
    });
  };

  //经办人下拉框数据
  const getJbrData = () => {
    FetchQueryOrganizationInfo({
      type: 'FXRY',
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
            type: 'XXJS',
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
                finalData = finalData.filter(item => {
                  let parentArr = [];
                  memberArr.forEach(y => {
                    if (y.orgId === item.value) parentArr.push(y);
                  });
                  return parentArr.length > 0;
                });
                setSltData(p => ({ ...p, jbr: [...finalData] }));
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

  //是否允许编辑
  const allowEdit = cjrid => {
    return true;
  };

  return (
    <div className="innovation-contract-box">
      <Spin spinning={isSpinning} tip="加载中" wrapperClassName="innovation-contract-spin-wrapper">
        <TopConsole
          dataProps={{ filterData, sltData, dictionary, filterFold }}
          funcProps={{ setFilterData, queryTableData, setFilterFold }}
        />
        <TableBox
          dataProps={{ tableData, filterData, isSpinning, dictionary, sltData, filterFold }}
          funcProps={{ setFilterData, queryTableData, setIsSpinning, allowEdit }}
        />
      </Spin>
    </div>
  );
});
