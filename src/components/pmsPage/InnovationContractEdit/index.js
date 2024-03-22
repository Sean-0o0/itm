import React, { useEffect, useState, useRef, ReactDOM, Fragment } from 'react';
import {
  Breadcrumb,
  Button,
  InputNumber,
  message,
  Tooltip,
  Form,
  Select,
  Table,
  Popconfirm,
  Spin,
  Col,
  Icon,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { Link, useLocation } from 'react-router-dom';
import {
  queryDetailData,
  getIputNumber,
  getSelector,
  getInfoItem,
  getStaffNode,
  getNote,
  columns,
  getGysSelector,
  fetchQueryGysInZbxx,
} from './FuncUtils';
import OprtModal from './OprtModal';
import { OperateXCContract } from '../../../services/pmsServices';
import { useHistory } from 'react-router';
import { DecryptBase64, EncryptBase64 } from '../../Common/Encrypt';
import BridgeModel from '../../Common/BasicModal/BridgeModel';
import InfoOprtModal from '../SupplierDetail/TopConsole/InfoOprtModal';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  roleData: global.roleData,
}))(
  Form.create()(function InnovationContractEdit(props) {
    const {
      dictionary = {},
      match: {
        params: { params = '' },
      },
      userBasicInfo = {},
      form = {},
      roleData = {},
    } = props;
    const {
      xc_sys = [], //系统类型
      xc_cont_type = [], //合同类型
      xc_cat_1 = [], //信创大类
      xc_cat_2 = [], //信创小类
      ZDTSNRPZ = [], //问号内容
      GYSLX = [], //供应商类型
    } = dictionary;
    const SFXC = [
      { note: '是', ibm: 1 },
      { note: '否', ibm: 2 },
    ];
    const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
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
    const [delData, setDelData] = useState([]); //要删除的行数据
    const [oprtModalData, setOprtModalData] = useState({
      visible: false,
      type: 'ADD',
    }); //弹窗显隐
    const [rowTitle, setRowTitle] = useState({
      oa: true,
      supplement: true,
    }); //标题展开收起
    const history = useHistory();
    const location = useLocation();
    const roleTxt =
      (JSON.parse(roleData.testRole || '{}')?.ALLROLE ?? '') + ',' + (roleData.role ?? ''); //角色信息
    const [addGysModalVisible, setAddGysModalVisible] = useState(false); //新增供应商弹窗显隐

    useEffect(() => {
      if (params !== '') {
        let obj = JSON.parse(DecryptBase64(params));
        console.log('🚀 ~ useEffect ~ obj:', obj);
        queryDetailData(
          obj.id,
          setData,
          setTableData,
          setIsSpinning,
          setSltData, //setData2
          userBasicInfo.id,
        );
        //名称路由去重
        const routesArr = [
          ...obj.routes,
          { name: '普通合同信息编辑', pathname: location.pathname },
        ]?.filter((obj, index, arr) => {
          return !arr.slice(index + 1).some(item => item.name === obj.name);
        });
        setRoutes(routesArr);
      }
      return () => {
        resetFields();
        setTableData([]);
        setDelData([]);
        setData({});
      };
    }, [params]);

    //保存
    const handleSave = () => {
      validateFields((err, values) => {
        if (!err) {
          const subInfo = [...tableData, ...delData].map(x => ({
            xxid: x.CZLX === 'ADD' ? -1 : x.ID, //附属信息id，新增的传-1，其他传对应id
            xcdl: Number(x.XCDL), //信创大类             字典xc_cat_1
            xcxl: Number(x.XCXL), //信创小类            字典xc_cat_2
            sl: Number(x.SL), //数量
            dw: String(x.DW), //单位
            dj: String(x.DJ), //单价
            zje: String(x.ZJE), //总金额
            cpmc: String(x.CPMC), //产品名称
            cpxh: String(x.CPXH), //产品型号
            pzxq: String(x.PZXQ), //配置详情
            sfxc: Number(x.SFXC), //是否信创  1是|2否
            sccs: String(x.SCCS), //生产厂商
            czlx: x.CZLX, //ADD|新增；UPDATE|修改;DELETE|删除
            glxm: Number(x.GLXM), //关联项目
          }));
          const params = {
            amount: String(values.zje ?? data.ZJE), //现在显示为合同金额
            contractId: Number(data.HTID),
            contractType: Number(values.htlx ?? data.HTLX),
            isXC: Number(values.sfxc ?? data.SFXC),
            projectId: Number(values.glxm ?? data.GLXM),
            sysType: Number(values.xtlx ?? data.XTLX),
            subInfo,
            vendor: Number(values.gys ?? data.GYS), //查询的可能没值，所以得让他选
            state: Number(data.ZT),
            signingDate: Number(data.QDRQ),
          };
          setIsSpinning(true);
          OperateXCContract(params)
            .then(res => {
              if (res.success) {
                message.success('保存成功', 1);
                resetFields();
                setTableData([]);
                setDelData([]);
                setData({});
                history.push({
                  pathname:
                    '/pms/manage/InnovationContract/' +
                    EncryptBase64(
                      JSON.stringify({
                        timeStamp: new Date().getTime(),
                        tab: 'PTHT',
                      }),
                    ),
                });
                setIsSpinning(false);
              }
            })
            .catch(e => {
              console.error('保存失败', e);
              message.error('操作失败', 1);
              setIsSpinning(false);
            });
        }
      });
    };

    //取消-返回列表页
    const handleCancel = () => {
      resetFields();
      setTableData([]);
      setDelData([]);
      setData({});
      history.push({
        pathname: '/pms/manage/InnovationContract',
      });
    };

    //新增附属信息
    const handleAddRow = () => {
      setOprtModalData(p => ({ ...p, visible: true, type: 'ADD', data: {} }));
    };

    //修改附属信息
    const handleUpdateRow = (data = {}) => {
      setOprtModalData(p => ({ ...p, visible: true, type: 'UPDATE', data }));
    };

    //删除附属信息
    const handleDeleteRow = (row = {}) => {
      setTableData(p => {
        const arr = [...p];
        const index = p.findIndex(x => x.ID === row.ID);
        if (index !== -1) {
          if (arr[index].CZLX === 'ADD') {
            arr.splice(index, 1);
          } else {
            setDelData(p => [...p, { ...arr[index], CZLX: 'DELETE' }]);
            arr.splice(index, 1);
          }
        }
        return [...arr];
      });
    };

    //新增后滚至底部
    const scrolltoBottom = () => {
      let tableNode = document.querySelectorAll('.table-box .ant-table-body')[0];
      tableNode.scrollTop = tableNode.scrollHeight;
    };

    //判空
    const getValue = (v, type = 'number') => {
      if (['', null, undefined].includes(v)) return undefined;
      if (type === 'number') return Number(v);
      return String(v);
    };

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

    //判断是否为数字
    function IsNum(s) {
      if (s != null && s != '') {
        return !isNaN(s);
      }
      return false;
    }

    //获取问号提示
    const getQesTip = (txt = '') => {
      return ZDTSNRPZ.find(x => x.cbm === txt)?.note ?? '';
    };

    return (
      <div className="innovation-contract-edit-box">
        <Spin
          spinning={isSpinning}
          tip="加载中"
          wrapperClassName="innovation-contract-edit-box-spin"
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
          <div className="info-content">
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
              {/* 管理员但非经办人 、该合同有项目经理时且经办人但非项目经理 */}
              {(roleTxt.includes('信创管理员') &&
                Number(userBasicInfo.id) !== Number(data.JBRID)) ||
              (data.XMJL !== undefined &&
                Number(userBasicInfo.id) === Number(data.JBRID) &&
                Number(userBasicInfo.id) !== Number(data.XMJL)) ? (
                [
                  {
                    label: '关联项目',
                    val: sltData.glxm?.find(x => Number(x.XMID) === Number(data.GLXM))?.XMMC,
                  },
                  {
                    label: '合同金额(元)',
                    val: getValue(data.ZJE) ?? (IsNum(data.HTJE) ? Number(data.HTJE) : undefined),
                  },
                  {
                    label: '系统类型',
                    val: xc_sys.find(x => Number(x.ibm) === Number(data.XTLX))?.note,
                  },
                  {
                    label: '合同类型:',
                    val: xc_cont_type.find(x => Number(x.ibm) === Number(data.HTLX))?.note,
                  },
                  {
                    label: '是否信创',
                    val: SFXC.find(x => Number(x.ibm) === Number(data.SFXC))?.note,
                  },
                  {
                    label: '供应商',
                    val: sltData.gys?.find(x => Number(x.id) === Number(data.GYS))?.gysmc,
                  },
                ].map(x => getInfoItem(x, rowTitle.supplement))
              ) : (
                <Fragment>
                  {getSelector({
                    label: '关联项目',
                    labelNode: (
                      <span>
                        <span style={{ color: '#f5222d', marginRight: '4px' }}>*</span>
                        关联项目
                      </span>
                    ),
                    dataIndex: 'glxm',
                    initialValue: getValue(data.GLXM, 'string'),
                    data: sltData.glxm,
                    titleField: 'XMMC',
                    valueField: 'XMID',
                    getFieldDecorator,
                    display: rowTitle.supplement ? 'flex' : 'none',
                    optionNode: x => (
                      <Select.Option key={x.XMID} value={x.XMID} title={x.XMMC}>
                        <Tooltip title={x.XMMC} placement="topLeft">
                          {x.XMMC}
                          <div style={{ fontSize: '12px', color: '#bfbfbf' }}>{x.XMNF}</div>
                        </Tooltip>
                      </Select.Option>
                    ),
                    optionLabelProp: 'title',
                    optionFilterProp: 'title',
                  })}
                  {getIputNumber({
                    label: '合同金额(元)',
                    labelNode: (
                      <span>
                        <span style={{ color: '#f5222d', marginRight: '4px' }}>*</span>
                        合同金额(元)
                        <Tooltip title={getQesTip('合同金额问号内容')}>
                          <Icon
                            type="question-circle-o"
                            style={{ marginLeft: 4, marginRight: 2 }}
                          />
                        </Tooltip>
                      </span>
                    ),
                    dataIndex: 'zje',
                    initialValue:
                      getValue(data.ZJE) ?? (IsNum(data.HTJE) ? Number(data.HTJE) : undefined), //ZJE有值时直接取，没有则自行判断
                    getFieldDecorator,
                    display: rowTitle.supplement ? 'flex' : 'none',
                  })}
                  {getSelector({
                    label: '系统类型',
                    labelNode: (
                      <span>
                        <span style={{ color: '#f5222d', marginRight: '4px' }}>*</span>
                        系统类型
                      </span>
                    ),
                    dataIndex: 'xtlx',
                    initialValue: getValue(data.XTLX),
                    data: xc_sys,
                    titleField: 'note',
                    valueField: 'ibm',
                    getFieldDecorator,
                    display: rowTitle.supplement ? 'flex' : 'none',
                  })}
                  {getSelector({
                    label: '合同类型',
                    labelNode: (
                      <span>
                        <span style={{ color: '#f5222d', marginRight: '4px' }}>*</span>
                        合同类型
                      </span>
                    ),
                    dataIndex: 'htlx',
                    initialValue: getValue(data.HTLX),
                    data: xc_cont_type,
                    titleField: 'note',
                    valueField: 'ibm',
                    getFieldDecorator,
                    display: rowTitle.supplement ? 'flex' : 'none',
                  })}
                  {getSelector({
                    label: '是否信创',
                    labelNode: (
                      <span>
                        <span style={{ color: '#f5222d', marginRight: '4px' }}>*</span>
                        是否信创
                      </span>
                    ),
                    dataIndex: 'sfxc',
                    initialValue: getValue(data.SFXC),
                    data: SFXC,
                    titleField: 'note',
                    valueField: 'ibm',
                    getFieldDecorator,
                    display: rowTitle.supplement ? 'flex' : 'none',
                  })}
                  {getGysSelector({
                    label: '供应商',
                    labelNode: (
                      <span>
                        <span style={{ color: '#f5222d', marginRight: '4px' }}>*</span>
                        供应商
                      </span>
                    ),
                    dataIndex: 'gys',
                    initialValue: data.GYS !== undefined ? getValue(data.GYS) : undefined,
                    data: sltData.gys,
                    titleField: 'gysmc',
                    valueField: 'id',
                    getFieldDecorator,
                    display: rowTitle.supplement ? 'flex' : 'none',
                    setAddGysModalVisible,
                  })}
                  {rowTitle.supplement &&
                    Number(data.CLZT) === 1 &&
                    getFieldValue('gys') === undefined && (
                      <span style={{ color: '#f5222d', lineHeight: '61px' }}>
                        OA中的合同乙方在系统中无对应供应商，请先新增供应商数据
                      </span>
                    )}
                </Fragment>
              )}
            </div>
            <div className="table-box">
              <div className="btn-row">
                <Button type="primary" onClick={handleAddRow}>
                  新增
                </Button>
              </div>
              <div className="table-row">
                <Table
                  columns={columns({
                    getNote,
                    sltData,
                    handleUpdateRow,
                    handleDeleteRow,
                    SFXC,
                    xc_cat_1,
                    xc_cat_2,
                    routes,
                  })}
                  rowKey={'xxid'}
                  dataSource={tableData}
                  pagination={false}
                  // bordered
                  scroll={{ x: 1520 }}
                  // scroll={{ x: 1500, y: 'calc(100vh - 439px)' }}
                />
              </div>
            </div>
          </div>
          <div className="opr-btn-row">
            <Button className="btn-cancel" onClick={handleCancel}>
              取消
            </Button>
            <Button className="btn-submit" type="primary" onClick={handleSave}>
              保存
            </Button>
          </div>
          <OprtModal
            visible={oprtModalData.visible}
            setVisible={v => setOprtModalData(p => ({ ...p, visible: v }))}
            dataProps={{
              xc_cat_1,
              xc_cat_2,
              oprtModalData,
              sltData,
              glxm: getValue(data.GLXM),
            }}
            funcProps={{ setTableData, scrolltoBottom }}
          />
          <InfoOprtModal
            visible={addGysModalVisible}
            setVisible={setAddGysModalVisible}
            oprtType={'ADD'}
            GYSLX={GYSLX}
            getTableData={() => fetchQueryGysInZbxx(setSltData, setIsSpinning)}
          />
        </Spin>
      </div>
    );
  }),
);
