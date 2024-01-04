import React, { useEffect, useState } from 'react';
import TopRanking from './TopRanking';
import TableTabs from './TableTabs';
import {
  QuerySupplierDetailInfo,
  QuerySupplierList,
  QuerySupplierOverviewInfo,
  QueryUserRole,
} from '../../../services/pmsServices';
import { Spin, Breadcrumb, message } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default function SupplierSituation(props) {
  const { dictionary = [], routes = [], defaultYear = moment().year() } = props;
  let LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const { GYSLX, WBRYGW } = dictionary;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [total, setTotal] = useState(0); //数据总数
  const [rankingData, setRankingData] = useState([]); //供应商排名数据
  const [uesrRole, setUserRole] = useState(''); //用户角色
  const [curTab, setCurTab] = useState('MX_ALL'); //当前tab

  useEffect(() => {
    getUserRole(defaultYear);
    setCurTab('MX_ALL');
    return () => {};
  }, [defaultYear]);

  //获取用户角色
  const getUserRole = year => {
    setIsSpinning(true);
    QueryUserRole({
      userId: String(LOGIN_USER_INFO.id),
    })
      .then(res => {
        if (res?.code === 1) {
          const { role = '' } = res;
          getRankingData(role, year);
          setUserRole(role);
        }
      })
      .catch(e => {
        message.error('用户信息查询失败', 1);
        console.error('QueryUserRole', e);
      });
  };
  //获取供应商排名数据
  const getRankingData = (role, year) => {
    QuerySupplierOverviewInfo({
      org: Number(LOGIN_USER_INFO.org),
      queryType: 'MX',
      role,
      paging: -1,
      current: 1,
      pageSize: 9999,
      total: -1,
      sort: '',
      year,
    })
      .then(res => {
        if (res?.success) {
          setRankingData(p => [...JSON.parse(res.gysxx)]);
          // console.log('🚀 ~ setRankingData:', JSON.parse(res.gysxx));
          getTableData({ role, year });
        }
      })
      .catch(e => {
        message.error('供应商排名查询失败', 1);
        console.error('QuerySupplierOverviewInfo', e);
      });
  };
  //获取报表格数据
  const getTableData = ({ role, queryType = 'MX_ALL', current = 1, pageSize = 10, year }) => {
    setTableLoading(true);
    let yearNum = year !== undefined ? year : defaultYear;
    QuerySupplierOverviewInfo({
      org: Number(LOGIN_USER_INFO.org),
      queryType,
      role,
      paging: 1,
      current,
      pageSize,
      total: -1,
      sort: '',
      year: yearNum,
    })
      .then(res => {
        if (res?.success) {
          setTableData(p => [...JSON.parse(res.xmxx)]);
          setTotal(res.total);
          setTableLoading(false);
          setIsSpinning(false);
          console.log('🚀 ~ setTableData', JSON.parse(res.xmxx));
        }
      })
      .catch(e => {
        message.error('表格数据查询失败', 1);
        console.error('QuerySupplierOverviewInfo', e);
      });
  };

  return (
    <div className="supplier-situation-box">
      <Spin
        spinning={isSpinning}
        tip="加载中"
        size="large"
        wrapperClassName="supplier-situation-spin"
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
        <TopRanking data={rankingData} />
        <TableTabs
          data={tableData}
          getData={getTableData}
          total={total}
          loading={tableLoading}
          role={uesrRole}
          routes={routes}
          curTab={curTab}
          setCurTab={setCurTab}
        />
      </Spin>
    </div>
  );
}
