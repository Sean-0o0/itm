import React, { useEffect, useState } from 'react';
import { Breadcrumb, Table, Spin } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { Link, useLocation } from 'react-router-dom';
import {
  queryDetailData,
  getInfoItem,
  getStaffNode,
  getNote,
  columns,
  getAmountFormat,
  getPrjNode,
} from './FuncUtils';
import { useHistory } from 'react-router';
import { DecryptBase64 } from '../../Common/Encrypt';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(function InnovationContractView(props) {
  const {
    dictionary = {},
    match: {
      params: { params = '' },
    },
    userBasicInfo = {},
  } = props;
  const {
    xc_sys = [], //系统类型
    xc_cont_type = [], //合同类型
    xc_cat_1 = [], //信创大类
    xc_cat_2 = [], //信创小类
  } = dictionary;
  const SFXC = [
    { note: '是', ibm: 1 },
    { note: '否', ibm: 2 },
  ];
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [sltData, setSltData] = useState({
    glxm: [],
  }); //下拉框数据
  const [routes, setRoutes] = useState([]); //路由
  const [data, setData] = useState({
    HTID: undefined,
    HTMC: undefined,
    HTBH: undefined,
    HTJF: undefined,
    HTYF: undefined,
    HTJE: undefined,
    QDRQ: undefined,
    XTLX: undefined,
    HTLX: undefined,
    SFXC: undefined,
    JBRID: undefined,
    JBR: undefined,
    CLZT: undefined,
  }); //编辑那行的数据
  const [tableData, setTableData] = useState([]); //附属信息-下方表格数据
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (params !== '') {
      let obj = JSON.parse(DecryptBase64(params));
      // console.log('🚀 ~ file: index.js:100 ~ useEffect ~ obj:', obj);
      queryDetailData(obj.htbh, setData, setTableData, setIsSpinning, v =>
        setSltData(p => ({
          ...p,
          glxm: v,
        })),
      );
      const routesArr = [...obj.routes, { name: '信创合同信息查看', pathname: location.pathname }];
      setRoutes(routesArr);
    }
    return () => {};
  }, [params]);

  return (
    <div className="innovation-contract-edit-box">
      <Spin spinning={isSpinning} tip="加载中" wrapperClassName="innovation-contract-edit-box-spin">
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
        <div className="info-content" style={{ marginBottom: 24 }}>
          <div className="info-top">
            {[
              { label: '合同编号', val: data.HTBH },
              { label: '合同名称', val: data.HTMC },
              { label: '合同甲方', val: data.HTJF },
              { label: '合同乙方', val: data.HTJF },
              {
                label: '签订日期',
                val: (data.QDRQ && moment(String(data.QDRQ)).format('YYYY年MM月DD日')) || '',
              },
              { label: '到期日', val: data.DQSJ },
              {
                label: '经办人',
                node: data.JBR ? getStaffNode(data.JBR, data.JBRID, routes) : data.YJBR,
              },
              {
                label: '关联项目',
                val: getPrjNode(sltData, data.GLXM, routes),
              },
              { label: '总金额(元)', val: getAmountFormat(data.ZJE) },
              { label: '系统类型', val: getNote(xc_sys, data.XTLX) },
              { label: '合同类型', val: getNote(xc_cont_type, data.HTLX) },
              { label: '是否信创', val: getNote(SFXC, data.SFXC) },
            ].map(x => getInfoItem(x))}
          </div>
          <div className="table-box">
            <div className="table-row">
              <Table
                columns={columns({
                  getNote,
                  sltData,
                  SFXC,
                  xc_cat_1,
                  xc_cat_2,
                  routes,
                  glxm: data.GLXM,
                })}
                rowKey={'xxid'}
                dataSource={tableData}
                pagination={false}
                bordered
                scroll={{ x: 1420 }}
              />
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
});
