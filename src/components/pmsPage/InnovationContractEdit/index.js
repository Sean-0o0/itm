import React, { useEffect, useState, useRef, ReactDOM } from 'react';
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
} from './FuncUtils';
import OprtModal from './OprtModal';
import { OperateXCContract } from '../../../services/pmsServices';
import { useHistory } from 'react-router';
import { DecryptBase64, EncryptBase64 } from '../../Common/Encrypt';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(
  Form.create()(function InnovationContractEdit(props) {
    const {
      dictionary = {},
      match: {
        params: { params = '' },
      },
      userBasicInfo = {},
      form = {},
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
    const [isTurnRed, setIsTurnRed] = useState(false); //关联项目是否报红
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
      if (params !== '') {
        let obj = JSON.parse(DecryptBase64(params));
        queryDetailData(
          obj.htbh,
          setData,
          setTableData,
          setIsSpinning,
          v =>
            setSltData(p => ({
              ...p,
              glxm: v,
            })),
          userBasicInfo.id,
        );
        //名称路由去重
        const routesArr = [
          ...obj.routes,
          { name: '信创合同信息编辑', pathname: location.pathname },
        ]?.filter((obj, index, arr) => {
          return !arr.slice(index + 1).some(item => item.name === obj.name);
        });
        setRoutes(routesArr);
      }
      return () => {
        resetFields();
        setTableData([]);
        setDelData([]);
        setIsTurnRed(false);
        setData({});
      };
    }, [params]);

    //保存
    const handleSave = () => {
      validateFields((err, values) => {
        if (values.glxm === undefined) {
          setIsTurnRed(true);
        } else if (!err) {
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
            amount: String(values.zje),
            contractId: Number(data.HTID),
            contractType: Number(values.htlx),
            isXC: Number(values.sfxc),
            projectId: Number(values.glxm),
            sysType: Number(values.xtlx),
            subInfo,
          };
          OperateXCContract(params)
            .then(res => {
              if (res.success) {
                message.success('保存成功', 1);
                resetFields();
                setTableData([]);
                setDelData([]);
                setIsTurnRed(false);
                setData({});
                history.push({
                  pathname:
                    '/pms/manage/InnovationContract/' +
                    EncryptBase64(
                      JSON.stringify({
                        timeStamp: new Date().getTime(),
                      }),
                    ),
                });
              }
            })
            .catch(e => {
              console.error('保存失败', e);
              message.error('操作失败', 1);
            });
        }
      });
    };

    //取消-返回列表页
    const handleCancel = () => {
      resetFields();
      setTableData([]);
      setDelData([]);
      setIsTurnRed(false);
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

    //关联项目报错时特殊处理行高
    const styleLineHeight = { lineHeight: isTurnRed ? '61px' : '42px' };

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
              {[
                { label: '合同编号', val: data.HTBH },
                { label: '合同名称', val: data.HTMC },
                { label: '合同甲方', val: data.HTJF },
                { label: '合同乙方', val: data.HTYF },
                {
                  label: '签订日期',
                  val: (data.QDRQ && moment(String(data.QDRQ)).format('YYYY年MM月DD日')) || '',
                },
                { label: '到期日', val: data.DQSJ },
                {
                  label: '经办人',
                  node: data.JBR ? getStaffNode(data.JBR, data.JBRID, routes) : data.YJBR,
                },
              ].map(x => getInfoItem(x))}
              {getSelector({
                label: '关联项目',
                dataIndex: 'glxm',
                initialValue: getValue(data.GLXM),
                data: sltData.glxm,
                titleField: 'XMMC',
                valueField: 'XMID',
                getFieldDecorator,
              })}
              {getIputNumber({
                label: '总金额(元)',
                dataIndex: 'zje',
                initialValue: getValue(data.ZJE),
                getFieldDecorator,
              })}
              {getSelector({
                label: '系统类型',
                dataIndex: 'xtlx',
                initialValue: getValue(data.XTLX),
                data: xc_sys,
                titleField: 'note',
                valueField: 'ibm',
                getFieldDecorator,
              })}
              {getSelector({
                label: '合同类型',
                dataIndex: 'htlx',
                initialValue: getValue(data.HTLX),
                data: xc_cont_type,
                titleField: 'note',
                valueField: 'ibm',
                getFieldDecorator,
              })}
              {getSelector({
                label: '是否信创',
                dataIndex: 'sfxc',
                initialValue: getValue(data.SFXC),
                data: SFXC,
                titleField: 'note',
                valueField: 'ibm',
                getFieldDecorator,
              })}
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
                  bordered
                  scroll={{ x: 1520}}
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
        </Spin>
      </div>
    );
  }),
);
