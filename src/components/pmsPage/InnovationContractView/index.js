import React, { useEffect, useState } from 'react';
import { Breadcrumb, Table, Spin, Icon, Tooltip } from 'antd';
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
    ZDTSNRPZ = [],
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
  const [rowTitle, setRowTitle] = useState({
    oa: true,
    supplement: true,
  }); //标题展开收起

  useEffect(() => {
    if (params !== '') {
      let obj = JSON.parse(DecryptBase64(params));
      // console.log('🚀 ~ file: index.js:100 ~ useEffect ~ obj:', obj);
      queryDetailData(obj.id, setData, setTableData, setIsSpinning, setSltData);
      const routesArr = [...obj.routes, { name: '普通合同信息查看', pathname: location.pathname }];
      setRoutes(routesArr);
    }
    return () => {};
  }, [params]);

  const getRowTitle = ({ open, setOpen, title = '--', redTipTxt = '' }) => (
    <div
      className="row-title"
      style={{ margin: '16px 24px 0 0', width: '100%' }}
      key={title}
      onClick={setOpen}
    >
      <Icon
        type={'caret-right'}
        className={'row-title-icon' + (open ? ' row-title-icon-rotate' : '')}
      />
      <span>{title}</span>
      <span className="row-title-red-tip-txt">{redTipTxt}</span>
    </div>
  );

  //获取问号提示
  const getQesTip = (txt = '') => {
    return ZDTSNRPZ.find(x => x.cbm === txt)?.note ?? '';
  };

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
            {getRowTitle({
              title: 'OA合同信息',
              open: rowTitle.oa,
              setOpen: () =>
                setRowTitle(p => ({
                  ...p,
                  oa: !p.oa,
                })),
            })}
            {[
              { label: '合同编号', val: data.HTBH },
              { label: '合同名称', val: data.HTMC },
              { label: '合同主体甲方', val: data.HTJF },
              { label: '合同主体乙方', val: data.HTYF },
              { label: '合同其他主体', val: data.HTQTZT },
              { label: '合同有效期', val: data.HTYXQ },
              { label: '合同到期日', val: data.DQSJ },
              { label: '签订日期', val: data.QDRQ },
              { label: '合同金额', val: data.HTJE },
              { label: '负责人', val: data.FZR },
              { label: '联系方式', val: data.LXFS },
              { label: '合同备注', val: data.HTBZ },
            ].map(x => getInfoItem(x, rowTitle.oa))}
            {getRowTitle({
              title: '补充合同信息',
              open: rowTitle.supplement,
              setOpen: () =>
                setRowTitle(p => ({
                  ...p,
                  supplement: !p.supplement,
                })),
            })}
            {[
              {
                label: '关联项目',
                val: getPrjNode(sltData, data.GLXM, routes),
              },
              {
                label: (
                  <span>
                    合同金额(元)
                    <Tooltip title={getQesTip('合同金额问号内容')}>
                      <Icon type="question-circle-o" style={{ marginLeft: 4, marginRight: 2 }} />
                    </Tooltip>
                  </span>
                ),
                val: getAmountFormat(data.ZJE),
              },
              { label: '系统类型', val: getNote(xc_sys, data.XTLX) },
              { label: '合同类型', val: getNote(xc_cont_type, data.HTLX) },
              { label: '是否信创', val: getNote(SFXC, data.SFXC) },
              {
                label: '供应商',
                val: sltData.gys?.find(x => Number(x.id) === Number(data.GYS))?.gysmc,
              },
            ].map(x => getInfoItem(x, rowTitle.supplement))}
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
                // bordered
                scroll={{ x: 1420 }}
              />
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
});
