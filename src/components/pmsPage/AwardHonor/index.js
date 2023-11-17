import React, { useLayoutEffect, useState } from 'react';
import { Button, message, Spin, Tabs } from 'antd';
import moment from 'moment';
import { QueryAwardAndHonorList, QueryIPRList, QueryUserRole } from '../../../services/pmsServices';
import TableBox from './TableBox';
import { DecryptBase64 } from '../../Common/Encrypt';

const { TabPane } = Tabs;

export default function AwardHonor(props) {
  const {
    dictionary = {},
    match: {
      params: { params = '' },
    },
  } = props;
  const {
    HJLX = [], //tab
    JXJB = [], //奖项级别
    HJQK = [], //获奖情况
    KTZT = [], //课题状态
  } = dictionary;
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 20,
    total: 0,
    sort: '',
  });
  const [filterData, setFilterData] = useState({
    awardName: undefined,
    awardLevel: undefined,
    unit: undefined,
    status: undefined,
    listId: undefined,
  }); //筛选栏数据
  const [activeKey, setActiveKey] = useState('KJJX');
  const [spinningData, setSpinningData] = useState({
    spinning: false,
    tip: '加载中',
    sltDisabled: false,
  }); //加载状态
  const [isGLY, setIsGLY] = useState(false); //是否管理员
  const CUR_USER_ID = Number(JSON.parse(sessionStorage.getItem('user')).id);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]); //默认展开行
  const [subTableData, setSubTableData] = useState([]); //子表数据
  const tabData = [
    { title: '科技奖项', value: 'KJJX' },
    { title: '研究课题', value: 'YJKT' },
  ];

  useLayoutEffect(() => {
    if (params !== '') {
      let obj = JSON.parse(DecryptBase64(params));
      setSpinningData(p => ({
        tip: '加载中',
        spinning: true,
      }));
      setActiveKey(obj.tab);
      setFilterData(p => ({ ...p, awardName: obj.name }));
      getSubTableData(obj.rowID);
      queryTableData({ tab: obj.tab, ...filterData, awardName: obj.name });
    } else {
      queryTableData({});
      getUserRole();
    }
    return () => {};
  }, [params]);

  //获取用户角色
  const getUserRole = () => {
    QueryUserRole({
      userId: CUR_USER_ID,
    })
      .then(res => {
        if (res?.code === 1) {
          const { testRole = '{}' } = res;
          setIsGLY(JSON.parse(testRole).ALLROLE?.includes('知识产权管理员'));
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
    awardName,
    awardLevel,
    unit,
    status,
    listId, //查展开详情时必传
    tab = activeKey, //KJJX|科技奖项;YJKT|研究课题
    queryType = 'LB', //LB|列表;XQ|展开的详情
  }) => {
    setSpinningData(p => ({
      tip: '加载中',
      spinning: true,
    }));
    // 查询获奖荣誉
    QueryAwardAndHonorList({
      awardName,
      awardLevel,
      unit,
      status,
      listId,
      tab,
      current,
      pageSize,
      paging: 1,
      queryType,
      sort,
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          console.log('🚀 ~ AwardHonor:', JSON.parse(res.result), JXJB, HJQK, KTZT);
          setTableData(p => ({
            ...p,
            current,
            pageSize,
            sort,
            total: res.totalrows,
            data: JSON.parse(res.result),
          }));
          setSpinningData(p => ({
            ...p,
            spinning: false,
          }));
        }
      })
      .catch(e => {
        console.error('🚀表格数据', e);
        message.error('表格数据获取失败', 1);
        setSpinningData(p => ({
          ...p,
          spinning: false,
        }));
      });
  };

  //查询获奖荣誉 子表
  const getSubTableData = async ID => {
    if (!expandedRowKeys.includes(ID)) {
      setExpandedRowKeys(p => [...p, ID]);
    }
    let arr = [...tableData.data];
    arr.forEach(x => {
      if (x.ID === ID) x.loading = true;
    });
    setTableData(p => ({ ...p, data: arr }));
    // 查询获奖荣誉 子表
    let res = await QueryAwardAndHonorList({
      listId: Number(ID),
      tab: activeKey,
      current: 1,
      pageSize: 10,
      paging: -1,
      queryType: 'XQ',
      sort: '',
      total: -1,
    });
    const data = JSON.parse(res.result);
    setSubTableData(p => ({
      ...p,
      [ID]: data,
    }));
    arr.forEach(x => {
      if (x.ID === ID) x.loading = false;
    });
    setTableData(p => ({ ...p, data: arr }));
  };

  //tab切换回调
  const handleTabsChange = key => {
    //清空筛选数据
    setFilterData({});
    queryTableData({ tab: key });
    setActiveKey(key);
  };

  //是否允许编辑
  const allowEdit = id => {
    return Number(CUR_USER_ID) === Number(id) || isGLY;
  };

  return (
    <div className="intel-property-box">
      <Spin
        spinning={spinningData.spinning}
        tip={spinningData.tip}
        wrapperClassName="intel-property-spin-wrapper"
      >
        <div className="top-console">
          <Tabs
            defaultActiveKey="ZB"
            activeKey={activeKey}
            onChange={handleTabsChange}
            size={'large'}
          >
            {tabData.map(x => (
              <TabPane tab={x.title} key={x.value}></TabPane>
            ))}
          </Tabs>
        </div>
        <TableBox
          dataProps={{
            tableData,
            filterData,
            activeKey,
            spinningData,
            JXJB,
            HJQK,
            KTZT,
            isGLY,
            expandedRowKeys,
            subTableData,
          }}
          funcProps={{
            setFilterData,
            queryTableData,
            setSpinningData,
            setTableData,
            allowEdit,
            setExpandedRowKeys,
            setSubTableData,
            getSubTableData,
          }}
        />
      </Spin>
    </div>
  );
}
