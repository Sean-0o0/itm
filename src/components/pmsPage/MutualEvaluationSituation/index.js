import React, { useEffect, useState, useRef } from 'react';
import { Breadcrumb, Button, message, Spin, Tabs } from 'antd';
import { connect } from 'dva';
import { Link, useLocation } from 'react-router-dom';
import { DecryptBase64 } from '../../Common/Encrypt';
import PersonnelEvaluation from './PersonnelEvaluation';
import YearsPrjEvaluation from './YearsPrjEvaluation';
import { FetchQueryOrganizationInfo } from '../../../services/projectManage';
import { setParentSelectableFalse } from '../../../utils/pmsPublicUtils';
import { QueryMemberInfo, QueryUserRole } from '../../../services/pmsServices';

export default connect(({ global = {} }) => ({
  userBasicInfo: global.userBasicInfo,
  dictionary: global.dictionary,
}))(function MutualEvaluationSituation(props) {
  const {
    dictionary = {},
    match: {
      params: { params = '' },
    },
    userBasicInfo = {},
  } = props;

  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [activeKey, setActiveKey] = useState('RYPJ'); //顶部高亮tab
  const location = useLocation();
  const [routes, setRoutes] = useState([{ name: '人员评价统计', pathname: location.pathname }]); //路由
  const [orgData, setOrgData] = useState([]); //部门
  const [staffData, setStaffData] = useState([]); //人员评价统计树型数据 - 改部门了，但区分上边的，父级可选
  const [role, setRole] = useState(''); //角色文本
  const [tabData, setTabData] = useState([]);

  useEffect(() => {
    getOrgData();
    return () => {};
  }, []);

  //将员工数据插入对应部门
  const handleStaffData = (memberArr = [], orgArr = []) => {
    orgArr.forEach(item => {
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
    orgArr = orgArr.filter(item => {
      return item.children.length > 0;
    });
    orgArr.forEach(node => setParentSelectableFalse(node));
    return orgArr;
  };

  const getUserRole = () => {
    //获取用户角色
    QueryUserRole({
      userId: String(userBasicInfo.id),
    })
      .then(res => {
        if (res?.code === 1) {
          const { role = '', testRole = '{}' } = res;
          const roleTxt = role + JSON.parse(testRole).ALLROLE;
          console.log('用户角色', roleTxt);
          setRole(roleTxt);
          setTabData(
            roleTxt.includes('二级部门领导')
              ? [
                  {
                    title: '人员评价统计',
                    value: 'RYPJ',
                  },
                ]
              : [
                  {
                    title: '人员评价统计',
                    value: 'RYPJ',
                  },
                  {
                    title: '项目评价统计',
                    value: 'LNXMPJ',
                  },
                ],
          );
          setIsSpinning(false);
        }
      })
      .catch(e => {
        message.error('用户角色查询失败', 1);
        console.error('QueryUserRole', e);
        setIsSpinning(false);
      });
  };

  const getOrgData = () => {
    setIsSpinning(true);
    FetchQueryOrganizationInfo({
      type: 'XXJS',
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
          let data = toTreeData(res.record)[0].children[0].children[0].children;
          console.log('🚀 ~ getOrgData ~ data:', toTreeData(res.record)[0].children[0].children);
          // data.forEach(node => {
          //   setParentSelectableFalse(node);
          // });
          //父级也要可选
          setOrgData(data);
          setStaffData(toTreeData(res.record)[0].children[0].children);
          getUserRole();
          // QueryMemberInfo({
          //   type: 'XXJS',
          // })
          //   .then(res => {
          //     if (res.success) {
          //       let orgArr = JSON.parse(JSON.stringify(data));
          //       let memberArr = JSON.parse(res.record).map(x => ({
          //         ...x,
          //         title: x.name,
          //         value: x.id,
          //       }));
          //       setOriginStaffData({
          //         staff: JSON.parse(JSON.stringify(memberArr)),
          //         org: JSON.parse(JSON.stringify(data)),
          //       });
          //       const finalData = handleStaffData(memberArr, orgArr);
          //       setStaffData(finalData);
          //       setIsSpinning(false);
          //     }
          //   })
          //   .catch(e => {
          //     message.error('人员评价统计数据查询失败', 1);
          //     setIsSpinning(false);
          //   });
        }
      })
      .catch(e => {
        console.error('🚀部门信息', e);
        message.error('部门信息获取失败', 1);
        setIsSpinning(false);
      });
  };

  useEffect(() => {
    if (params !== '') {
      let obj = JSON.parse(DecryptBase64(params));
      const routesArr = [...obj.routes, { name: '人员评价', pathname: location.pathname }];
      setRoutes(routesArr);
    }
    return () => {};
  }, [params]);

  //切换tab
  const handleTabsChange = key => {
    setActiveKey(key);
  };

  return (
    <div className="mutual-evaluation-situation-box">
      <div className="top-tab">
        <div className="breadcrumb-box">
          <Breadcrumb separator=">">
            {routes?.map((item, index) => {
              const { name = item, pathname = '' } = item;
              const historyRoutes = routes.slice(0, index + 1);
              return (
                <Breadcrumb.Item key={index}>
                  {index === routes.length - 1 ? (
                    <>{name}</>
                  ) : (
                    <Link to={{ pathname: pathname, state: { routes: historyRoutes } }}>
                      {name}
                    </Link>
                  )}
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
        </div>
        <Tabs activeKey={activeKey} onChange={handleTabsChange} size={'large'}>
          {tabData.map(x => (
            <Tabs.TabPane tab={x.title} key={x.value}></Tabs.TabPane>
          ))}
        </Tabs>
      </div>
      <Spin
        spinning={isSpinning}
        tip="加载中"
        wrapperClassName="mutual-evaluation-situation-spin-wrapper"
      >
        {activeKey === 'RYPJ' ? (
          <PersonnelEvaluation
            dataProps={{ routes, userBasicInfo, staffData, role }}
            funcProps={{ setIsSpinning, handleStaffData }}
          />
        ) : (
          <YearsPrjEvaluation
            dataProps={{ routes, userBasicInfo, orgData }}
            funcProps={{ setIsSpinning }}
          />
        )}
      </Spin>
    </div>
  );
});
