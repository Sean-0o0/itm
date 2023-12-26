import React, { useLayoutEffect, useState } from 'react';
import { Button, message, Spin, Tabs } from 'antd';
import moment from 'moment';
import { QueryIPRList, QueryUserRole } from '../../../services/pmsServices';
import TableBox from './TableBox';
import { DecryptBase64 } from '../../Common/Encrypt';

const { TabPane } = Tabs;

export default function IntelProperty(props) {
  const {
    dictionary = {},
    match: {
      params: { params = '' },
    },
  } = props;
  const {
    ZLLX = [],
    CYXZ = [],
    ZSCQDQZT = [],
    FMZLDQZT = [],
    QYBZDQZT = [],
    HYBZLX = [],
  } = dictionary;
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 20,
    total: 0,
    sort: '',
  });
  const [filterData, setFilterData] = useState({
    contact: undefined,
    propertyName: undefined,
    status: undefined,
  }); //筛选栏数据
  const [activeKey, setActiveKey] = useState('RJZZ');
  const [spinningData, setSpinningData] = useState({
    spinning: false,
    tip: '加载中',
    sltDisabled: false,
  }); //加载状态
  const [isGLY, setIsGLY] = useState(false); //是否管理员
  const CUR_USER_ID = String(JSON.parse(sessionStorage.getItem('user')).id);
  const tabData = [
    { title: '软件著作权', value: 'RJZZ' },
    { title: '发明专利', value: 'FMZL' },
    { title: '行业标准', value: 'HYBZ' },
    { title: '企业标准', value: 'QYBZ' },
  ];

  useLayoutEffect(() => {
    if (params !== '') {
      let obj = JSON.parse(DecryptBase64(params));
      setSpinningData(p => ({
        tip: '加载中',
        spinning: true,
      }));
      setActiveKey(obj.tab);
      setFilterData(p => ({ ...p, propertyName: obj.name }));
      queryTableData({ queryType: obj.tab, ...filterData, propertyName: obj.name });
    } else {
      queryTableData({});
      getUserRole();
    }
    return () => { };
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
    propertyName,
    status,
    contact,
    queryType = activeKey,
  }) => {
    setSpinningData(p => ({
      tip: '加载中',
      spinning: true,
    }));
    //知识产权信息
    QueryIPRList({
      propertyName,
      status,
      contact,
      current,
      pageSize,
      paging: 1,
      queryType,
      sort,
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ IntelProperty:', JSON.parse(res.result));
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

  //tab切换回调
  const handleTabsChange = key => {
    //清空筛选数据
    setFilterData({});
    queryTableData({ queryType: key });
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
            ZSCQDQZT,
            FMZLDQZT,
            QYBZDQZT,
            ZLLX,
            CYXZ,
            isGLY,
            HYBZLX,
          }}
          funcProps={{ setFilterData, queryTableData, setSpinningData, allowEdit }}
        />
      </Spin>
    </div>
  );
}
