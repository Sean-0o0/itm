import React, { useEffect, useState, useRef } from 'react';
import { Breadcrumb, Button, message, Spin, Tabs } from 'antd';
import moment from 'moment';
import { QueryCustomReportContent, QueryUserRole } from '../../../services/pmsServices';
import TableBox from './TableBox';
import { Link } from 'react-router-dom';
import { connect } from 'dva';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  roleData: global.roleData,
  authorities: global.authorities,
}))(function CustomReportDetail(props) {
  const { bgid = -2, bgmc = '', roleData = {}, userBasicInfo = {}, authorities = {} } = props;
  const [tableData, setTableData] = useState({
    data: [],
    origin: [], //编辑前的数据
  }); //表格数据
  const [columnsData, setColumnsData] = useState([]); //字段数据
  const [tableLoading, setTableLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [monthData, setMonthData] = useState(null); //月份数据
  const [activeKey, setActiveKey] = useState(undefined);
  const isBGHZR = (
    (JSON.parse(roleData.testRole || '{}')?.ALLROLE ?? '') + (roleData.role ?? '')
  ).includes('报告汇总人');
  const tabsData =
    roleData.zyrole === '自定义报告管理员'
      ? [
          {
            title: '事业部报告汇总',
            value: 'YBHZ',
          },
          {
            title: '二级部门报告',
            value: 'BMYB',
          },
        ]
      : (roleData.role === '一级部门领导' || roleData.role === '信息技术事业部领导') && !isBGHZR
      ? [
          {
            title: '事业部报告汇总',
            value: 'YBHZ',
          },
        ]
      : [
          {
            title: '二级部门报告',
            value: 'BMYB',
          },
          {
            title: '事业部报告汇总',
            value: 'YBHZ',
          },
        ];

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    if (bgid !== -2) {
      let defaultKey = 'BMYB';
      if (
        roleData.zyrole === '自定义报告管理员' ||
        ((roleData.role === '一级部门领导' || roleData.role === '信息技术事业部领导') && !isBGHZR)
      ) {
        defaultKey = 'YBHZ';
      }
      setMonthData(moment());
      setActiveKey(defaultKey);
      getData(Number(bgid), Number(moment().format('YYYYMM')), defaultKey);
    }
    return () => {};
  }, [bgid, JSON.stringify(roleData), isBGHZR]);

  //获取数据
  const getData = (reportID, month, queryType) => {
    setTableLoading(true);
    QueryCustomReportContent({
      current: 1,
      pageSize: 20,
      paging: -1,
      queryType,
      reportID,
      sort: '',
      total: -1,
      month,
    })
      .then(res => {
        if (res?.success) {
          let mergeData = JSON.parse(res.nrxx);
          let columnsArr = JSON.parse(res.zdxx);
          let filteredArr = columnsArr.filter(item => item.ZDLX === '1'); //分类字段信息
          let otherArr = columnsArr.filter(item => item.ZDLX !== '1'); //填写字段信息
          // 找到 "系统项目" 的索引
          const index = otherArr.findIndex(item => item.ZDMC === '系统项目');
          // 如果找到了 "系统项目"，则在它之后插入新对象
          if (index !== -1) {
            otherArr = [
              ...otherArr.slice(0, index + 1), // 插入位置之前的部分（包括系统项目）
              {
                ZDMC: '关联项目',
                ZDLX: '3', //非分类、非填写
                QZZD: 'GLXM',
              },
              ...otherArr.slice(index + 1), // 插入位置之后的部分
            ];
          }
          // console.log('🚀 ~ mergeData:', mergeData);
          //排列顺序 - 分类字段（合并） - 关联项目 - 填写人 - 上月字段 - 本月填写字段 - 固定字段
          let finalColumns = [
            //分类字段（合并）
            ...filteredArr,
            //关联项目
            // {
            //   ZDMC: '关联项目',
            //   ZDLX: '3', //非分类、非填写
            //   QZZD: 'GLXM',
            // },
            //上月字段
            // ...(tableArrLast.length === 0 ? [] : otherArr).map(x => ({
            //   ZDMC: x.ZDMC + '(上期)',
            //   ZDLX: '3', //非分类、非填写
            //   QZZD: x.QZZD + '_LAST',
            // })),
            //本月填写字段
            ...otherArr,
            //固定字段
            // {
            //   ZDMC: '计划上线时间',
            //   ZDLX: '3', //非分类、非填写
            //   QZZD: 'JHSXSJ',
            // },
            // {
            //   ZDMC: '项目负责人',
            //   ZDLX: '3', //非分类、非填写
            //   QZZD: 'XMFZR',
            // },
            // {
            //   ZDMC: '项目阶段',
            //   ZDLX: '3', //非分类、非填写
            //   QZZD: 'XMJD',
            // },
            // {
            //   ZDMC: '进度(%)',
            //   ZDLX: '3', //非分类、非填写
            //   QZZD: 'JD',
            // },
            //填写人
            {
              ZDMC: '填写人',
              ZDLX: '3', //非分类、非填写
              QZZD: 'TXR',
            },
          ];
          // console.log('🚀 ~ finalColumns:', finalColumns);
          let tableWidth = 0;
          finalColumns.forEach(x => {
            if (x.ZDLX === '1') {
              tableWidth += x.ZDMC?.length * 25;
            } else if (x.QZZD === 'GLXM') {
              tableWidth += 200;
            } else if (x.ZDLX === '2') {
              tableWidth += 300;
            } else if (x.QZZD === 'JD') {
              tableWidth += 80;
            } else {
              tableWidth += x.ZDMC?.length * 25;
            }
          });
          console.log('finalColumns', finalColumns);
          setColumnsData(finalColumns);
          setTableData({
            data: JSON.parse(JSON.stringify(mergeData)),
            origin: JSON.parse(JSON.stringify([...mergeData])), //编辑前的原数据
            customColumns: columnsArr.map(x => x.QZZD).concat(['ID', 'GLXM', 'TXR', 'GXZT', 'YF']),
            tableWidth,
          });
          setTableLoading(false);
        }
      })
      .catch(e => {
        console.error('🚀本月表格数据', e);
        message.error('本月表格数据获取失败', 1);
        setTableLoading(false);
      });
  };

  const handleTabsChange = key => {
    console.log('🚀 ~ handleTabsChange ~ key:', key);
    getData(Number(bgid), Number(monthData.format('YYYYMM')), key);
    setActiveKey(key);
  };
  return (
    <div className="weekly-report-detail custom-report-detail-box">
      <Spin spinning={tableLoading} tip="加载中">
        <div className="top-console">
          <Tabs activeKey={activeKey} onChange={handleTabsChange} size={'large'}>
            {tabsData.map(x => (
              <Tabs.TabPane tab={x.title} key={x.value} />
            ))}
          </Tabs>
        </div>
        <TableBox
          dataProps={{
            bgid,
            bgmc,
            tableData,
            columnsData,
            tableLoading,
            monthData,
            activeKey,
            roleData,
            userBasicInfo,
            authorities,
          }}
          funcProps={{
            setTableLoading,
            setMonthData,
            getData,
          }}
        />
      </Spin>
    </div>
  );
});
