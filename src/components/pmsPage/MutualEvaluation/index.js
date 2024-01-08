import React, { useEffect, useState, useRef, Fragment, useCallback } from 'react';
import { Breadcrumb, Button, Empty, message, Modal, Popconfirm, Spin, Tooltip } from 'antd';
import TopFilter from './TopFilter';
import {
  OperateEmployeeAppraise,
  QueryEmployeeAppraiseList,
  QueryUserRole,
} from '../../../services/pmsServices';
import LeftPrjList from './LeftPrjList';
import TableBox from './TableBox';
import { debounce } from 'lodash';
import { connect } from 'dva';
import { Link, useLocation } from 'react-router-dom';
import { DecryptBase64, EncryptBase64 } from '../../Common/Encrypt';
import OpenValuationModal from './OpenValuationModal';

export default connect(({ global = {} }) => ({
  userBasicInfo: global.userBasicInfo,
  dictionary: global.dictionary,
}))(function MutualEvaluation(props) {
  const {
    dictionary = {},
    match: {
      params: { params = '' },
    },
    userBasicInfo = {},
  } = props;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [prjList, setPrjList] = useState([]); //左侧项目列表
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 10,
    loading: false,
  }); //右侧表格数据
  const [curPrj, setCurPrj] = useState({
    id: -1,
    name: '',
    done: false, //是否完成打分
    open: false, //是否开启评价
  }); //选中的项目
  const [updateData, setUpdateData] = useState([]); //评分新增、修改数据
  const [isGLY, setIsGLY] = useState(false); //人员评价管理员
  const location = useLocation();
  const [routes, setRoutes] = useState([{ name: '人员评价', pathname: location.pathname }]); //路由
  const [modalVisible, setModalVisible] = useState(false); //开启评价弹窗显隐
  const [defXmmc, setDefXmmc] = useState(''); //待办跳转 传的 项目名称
  const [filterData, setFilterData] = useState({});

  const filterConfig = [
    {
      label: '项目名称',
      componentType: 'input',
      valueField: 'projectName',
      valueType: 'string',
      initialValue: defXmmc,
    },
  ];

  useEffect(() => {
    if (params !== '') {
      let obj = JSON.parse(DecryptBase64(params));
      const routesArr = [...obj.routes, { name: '人员评价', pathname: location.pathname }];
      setRoutes(routesArr);
      setFilterData(p => ({ ...p, projectName: obj.xmmc }));
      getPrjList({ projectName: obj.xmmc });
    } else {
      getPrjList({});
    }
    return () => { };
  }, [params]);

  useEffect(() => {
    if (curPrj.id !== -1) getTableData(Number(curPrj.id));
    return () => { };
  }, [curPrj.id]);

  //获取用户角色
  const getUserRole = useCallback(userId => {
    QueryUserRole({
      userId,
    })
      .then(res => {
        if (res?.code === 1) {
          const { testRole = '{}' } = res;
          setIsGLY(JSON.parse(testRole).ALLROLE?.includes('人员评价管理员'));
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('QueryUserRole', e);
        message.error('用户角色信息查询失败', 1);
        setIsSpinning(false);
      });
  }, []);

  //获取左侧项目列表
  const getPrjList = useCallback(({ projectName, isSubmitted = false, curPrjID = -1 }) => {
    setIsSpinning(true);
    QueryEmployeeAppraiseList({
      queryType: 'XMGK',
      userType: 'XMJL',
      projectName,
    })
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.gkResult || '[]') || [];
          // console.log('🚀 ~ QueryEmployeeAppraiseList ~ res', data);
          setPrjList(data);
          if (data.length > 0 && !isSubmitted) {
            // 默认选中第一个
            // setCurPrj({
            //   id: data[0].XMID,
            //   name: data[0].XMMC,
            //   done: data[0].DFZT === '打分完成',
            //   open: data[0].KQZT === '1',
            // });
            setCurPrj({
              id: -1,
              name: '',
              done: false,
              open: false,
            });
          } else if (data.length > 0 && isSubmitted) {
            // 已提交 选回当前项目
            const obj = data.find(x => Number(x.XMID) === curPrjID) || {};
            setCurPrj({
              id: obj.XMID,
              name: obj.XMMC,
              done: obj.DFZT === '打分完成',
              open: obj.KQZT === '1',
            });
          } else {
            setCurPrj({
              id: -1,
              name: '',
              done: false,
              open: false,
            });
            setTableData({ data: [], current: 1, pageSize: 10, loading: false });
          }
          getUserRole(userBasicInfo.id);
        }
      })
      .catch(e => {
        console.error('🚀左侧项目列表', e);
        message.error('左侧项目列表获取失败', 1);
        setIsSpinning(false);
      });
  }, []);

  //获取右侧表格数据
  const getTableData = useCallback(projectId => {
    setTableData(p => ({ ...p, loading: true }));
    QueryEmployeeAppraiseList({
      queryType: 'XMXQ',
      userType: 'XMJL',
      projectId,
    })
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.xqmxResult || '[]') || [];
          const finalData = data.reduce((result, item) => {
            const existingItem = result.find(i => i.RYMCID === item.RYMCID);
            if (existingItem) {
              existingItem.GW += `、${item.GW}`;
            } else {
              result.push(item);
            }
            return result;
          }, []);
          // console.log('🚀 ~ QueryEmployeeAppraiseList ~ res', finalData);
          setTableData({ data: finalData, current: 1, pageSize: 10, loading: false });
        }
      })
      .catch(e => {
        console.error('🚀右侧表格数据', e);
        message.error('右侧表格数据', 1);
        setTableData(p => ({ ...p, loading: false }));
      });
  }, []);

  //选中左侧项目
  const handlePrjItemClick = useCallback(
    (id, name, done, open) => {
      if (updateData.length > 0 && curPrj.id !== id) {
        Modal.confirm({
          okText: '确认',
          cancelText: '取消',
          title: '提示',
          content: `当前项目打分数据未提交，切换项目数据不会保存，是否确认切换？`,
          onOk: () => {
            setCurPrj({ id, name, done, open });
            setUpdateData([]);
          },
          onCancel() { },
        });
      } else {
        setCurPrj({ id, name, done, open });
      }
    },
    [curPrj.id, updateData.length],
  );

  //分数变化
  const handleScoreChange = useCallback(
    debounce((score = '0.0', obj = {}) => {
      // console.log('🚀 ~ file: index.js:100 ~ handleScoreChange ~ score:', score);
      setUpdateData(p => {
        const index = p.filter(x => x.ID !== '-1').findIndex(x => x.ID === obj.PFID);
        const index2 = p.filter(x => x.ID === '-1').findIndex(x => x.XMRY === String(obj.RYMCID));
        if (index2 === -1)
          // 未打分过的数据，加进去
          return [...p, { FS: score, XMRY: String(obj.RYMCID), CZLX: 'ADD', ID: '-1' }];
        else if (index2 !== -1) {
          // 已加进去过的未打分过的数据， 替换分数
          let arr = [...p];
          arr.splice(index2, 1, {
            ...p[index2],
            FS: score,
          });
          return arr;
        } else if (index === -1)
          // 新的修改数据，加进去
          return [...p, { FS: score, XMRY: String(obj.RYMCID), CZLX: 'UPDATE', ID: obj.PFID }];
        else {
          // 已加进去过的修改数据， 替换分数
          let arr = [...p];
          arr.splice(index, 1, {
            ...p[index],
            FS: score,
          });
          return arr;
        }
      });
    }, 100),
    [],
  );

  const handleOpen = () => {
    setModalVisible(true);
  };

  //提交评分数据
  const handleSave = useCallback(() => {
    //需要评分的数据
    const arr = tableData.data.filter(x => x.PF === undefined);
    console.log('提交数据：', updateData, '需要评分的数据：', arr);
    if (updateData.length !== arr.length) {
      message.warn('未全部打分！', 2);
    } else {
      setIsSpinning(true);
      OperateEmployeeAppraise({
        appraiseInfo: updateData,
        infoCount: updateData.length,
        operateType: 'PF',
        projectId: String(curPrj.id),
      })
        .then(res => {
          if (res?.success) {
            // console.log('🚀 ~ OperateEmployeeAppraise ~ res');
            getPrjList({ isSubmitted: true, curPrjID: Number(curPrj.id) });
            message.success('提交成功', 1);
            setIsSpinning(false);
            setUpdateData([]);
          }
        })
        .catch(e => {
          console.error('🚀desc', e);
          message.error('提交失败', 1);
          setIsSpinning(false);
        });
    }
  }, [JSON.stringify(updateData), JSON.stringify(tableData), JSON.stringify(curPrj)]);


  return (
    <div className="mutual-evaluation-box">
      <Spin
        spinning={isSpinning}
        tip="加载中"
        wrapperClassName="mutual-evaluation-box-spin-wrapper"
      >
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
        <TopFilter
          handleSearch={getPrjList}
          config={filterConfig}
          defValue={{ field: 'projectName', value: defXmmc }}
          filterData={filterData}
          setFilterData={setFilterData}
        />
        <div className="content-box">
          <div className="left-box">
            <div className="btn-row">
              <Button onClick={handleOpen}>评价状态管理</Button>
            </div>
            <OpenValuationModal
              visible={modalVisible}
              setVisible={setModalVisible}
              routes={routes}
              refresh={() => getPrjList({})}
              projectManager={isGLY ? undefined : Number(userBasicInfo.id)}
            />
            <LeftPrjList
              list={prjList}
              handlePrjItemClick={handlePrjItemClick}
              curPrjID={curPrj.id}
            // height={showSwitch ? '' : '100%'}
            />
          </div>
          <div className="right-box">
            {curPrj.id === -1 ? (
              <Empty
                description="选择项目后进行评分"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ margin: 'auto 0' }}
              />
            ) : (
              <Fragment>
                <div className="btn-row">
                  <Tooltip title={curPrj.name} placement="topLeft">
                    <Link
                      style={{ color: '#3361ff' }}
                      to={{
                        pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                          JSON.stringify({
                            xmid: curPrj.id,
                          }),
                        )}`,
                        state: {
                          routes,
                        },
                      }}
                      className="prj-name"
                    >
                      {curPrj.name}
                    </Link>
                  </Tooltip>
                  {!curPrj.done && curPrj.open && (
                    <Popconfirm
                      placement="topRight"
                      title="提交后无法修改评价分数，请仔细确认！"
                      onConfirm={handleSave}
                    >
                      <Button>提交</Button>
                    </Popconfirm>
                  )}
                </div>
                <TableBox
                  routes={routes}
                  tableData={tableData}
                  setTableData={setTableData}
                  curPrj={curPrj}
                  handleScoreChange={handleScoreChange}
                />
              </Fragment>
            )}
          </div>
        </div>
      </Spin>
    </div>
  );
});
