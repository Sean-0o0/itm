/*
 * @Author: 钟海秀(创新业务产品部) zhonghaixiu12534@apexsoft.com.cn
 * @Date: 2024-01-31 11:15:16
 * @LastEditTime: 2024-04-03 17:24:09
 * @FilePath: \pro-pms-fe\src\components\pmsPage\HomePage\ShortcutCard\SinglePaymentModal\index.js
 * @Descripttion: 单费用付款 新建/修改项目弹窗
 */
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Spin,
  TreeSelect,
  Icon,
} from 'antd';
import moment from 'moment';
import {
  FetchQueryBudgetProjects,
  FetchQueryMilepostInfo,
  FetchQueryProjectDetails,
} from '../../../../../services/projectManage';
import { OperateSinglePaymentProject } from '../../../../../services/pmsServices';
import { connect } from 'dva';
import { debounce, isNumber } from 'lodash';
import Decimal from 'decimal.js';

export default connect(({ global }) => ({
  userBasicInfo: global.userBasicInfo,
}))(
  Form.create()(function SinglePaymentModal(props) {
    const {
      visible,
      setVisible,
      type = 'ADD',
      xmid = -1,
      form = {},
      userBasicInfo = {},
      refresh,
    } = props;
    const { getFieldDecorator, getFieldValue, validateFields, resetFields, setFieldsValue } = form;
    const [isSpinning, setIsSpinning] = useState(false); //加载状态
    const [rowTitle, setRowTitle] = useState({
      basic: true,
      budget: true,
      milestoneItem: true,
    }); //标题显隐
    const [yearOpen, setYearOpen] = useState(false); //年份下拉框展开收起
    const [budgetSlt, setBudgetSlt] = useState([]); //预算下拉数据
    const [sltLoading, setSltLoading] = useState(false); //加载下拉框数据中
    const [budgetInfo, setBudgetInfo] = useState({}); //需要用的预算信息
    const [milestoneSlt, setMilestoneSlt] = useState([]); //事项下拉框数据
    const [updateData, setUpdateData] = useState({}); //编辑时回显数据
    const [lastValue, setLastValue] = useState(undefined); //本项目金额上一次调接口的值
    const labelCol = 8;
    const wrapperCol = 16;

    useEffect(() => {
      if (visible) {
        initData(type, xmid, 0);
      }
      return () => {
        setBudgetInfo({});
        setLastValue(undefined);
      };
    }, [visible, type, xmid]);

    //初始化获取数据
    const initData = async (type = 'ADD', projectId = -1, budget) => {
      try {
        setIsSpinning(true);
        let budgetPromise = FetchQueryBudgetProjects({
          type: 'NF',
          year: moment().year(),
        });
        if (type === 'ADD') {
          //新建时
          const milestonePromise = FetchQueryMilepostInfo({
            type: 17,
            isShortListed: '2',
            xmid: -1,
            biddingMethod: 1,
            budget,
            label: '',
            queryType: 'ALL',
            haveType: 1,
            softBudget: 0,
            frameBudget: 0,
            singleBudget: 0,
            haveChild: 2,
          });
          const [budgetRes, milestoneRes] = await Promise.all([budgetPromise, milestonePromise]);
          if (budgetRes.success) {
            let data = toTreeData(budgetRes.record);
            setBudgetSlt(data);
          }
          if (milestoneRes.success) {
            let data = JSON.parse(milestoneRes.result);
            data.forEach(first => {
              first.key = first.lcblxid;
              first.title = first.lcbmc;
              first.value = first.lcblxid;
              first.selectable = false;
              first.children = first.matterInfos;
              first.children?.forEach(second => {
                second.key = second.swlxmc;
                second.title = second.swlxmc;
                second.value = second.swlxmc;
                second.selectable = false;
                second.children = second.sxlb;
                second.children?.forEach(third => {
                  third.key = third.sxid;
                  third.title = third.sxmc;
                  third.value = third.sxid;
                });
              });
            });
            setMilestoneSlt(data);
            //默认选中项目立项下的所有事项
            const xzxsx =
              data
                .find(x => String(x.value) === '14')
                ?.children?.reduce(
                  (acc, cur) => [
                    ...acc,
                    ...(cur?.children
                      ?.filter(x => x.sxmc !== '框架内硬件采购流程')
                      .map(x => x.sxid) || []),
                  ],
                  [],
                ) || []; //去掉 框架内硬件采购流程
            setFieldsValue({
              xzxsx,
            });
          }
          setIsSpinning(false);
        } else {
          //编辑时
          const updateRes = await FetchQueryProjectDetails({ projectId });
          if (updateRes.success) {
            if (updateRes.record.length > 0) {
              const data = updateRes.record[0];
              console.log('🚀 ~ getUpdateData ~ data:', data);
              setUpdateData(data);
              setBudgetInfo({
                ysID: data.budgetProject,
                ysKGL: Decimal(data.budgetUse || 0)
                  .times(10000)
                  .toNumber(),
                ysKZX: Number(data.budgetCanUse || 0),
                ysZJE: Decimal(data.generalBudget || 0)
                  .times(10000)
                  .toNumber(),
                ysLXID: data.budgetTypeId,
              });
              const updateMilestonePromise = FetchQueryMilepostInfo({
                type: 17,
                isShortListed: '2',
                xmid: Number(projectId),
                biddingMethod: 1,
                budget: data.projectBudget !== undefined ? Number(data.projectBudget) : 0,
                label: '',
                queryType: 'ALL',
                haveType: 1,
                softBudget: 0,
                frameBudget: 0,
                singleBudget: 0,
                haveChild: 2,
              });
              const milestonePromise = FetchQueryMilepostInfo({
                type: 17,
                isShortListed: '2',
                xmid: -1,
                biddingMethod: 1,
                budget: data.projectBudget !== undefined ? Number(data.projectBudget) : 0,
                label: '',
                queryType: 'ALL',
                haveType: 1,
                softBudget: 0,
                frameBudget: 0,
                singleBudget: 0,
                haveChild: 2,
              });
              budgetPromise = FetchQueryBudgetProjects({
                type: 'NF',
                year: data.year,
              });
              const [updateMilestoneRes, milestoneRes, budgetRes] = await Promise.all([
                updateMilestonePromise,
                milestonePromise,
                budgetPromise,
              ]);
              if (budgetRes.success) {
                let data = toTreeData(budgetRes.record);
                setBudgetSlt(data);
              }
              if (updateMilestoneRes.success) {
                let data = JSON.parse(updateMilestoneRes.result);
                let arr = [];
                data.forEach(first => {
                  first.matterInfos?.forEach(second => {
                    arr = [...arr, ...(second.sxlb || [])];
                  });
                });
                console.log('🚀 ~ initData ~ arr:', arr);
                setFieldsValue({
                  xzxsx: arr.map(x => String(x.sxid)),
                });
              }
              if (milestoneRes.success) {
                let data = JSON.parse(milestoneRes.result);
                data.forEach(first => {
                  first.key = first.lcblxid;
                  first.title = first.lcbmc;
                  first.value = first.lcblxid;
                  first.selectable = false;
                  first.children = first.matterInfos;
                  first.children?.forEach(second => {
                    second.key = second.swlxmc;
                    second.title = second.swlxmc;
                    second.value = second.swlxmc;
                    second.selectable = false;
                    second.children = second.sxlb;
                    second.children?.forEach(third => {
                      third.key = third.sxid;
                      third.title = third.sxmc;
                      third.value = third.sxid;
                    });
                  });
                });
                setMilestoneSlt(data);
              }
              setIsSpinning(false);
            }
          }
        }
      } catch (e) {
        console.error('数据初始化', e);
        message.error('数据初始化失败', 1);
        setIsSpinning(false);
      }
    };

    //获取预算下拉数据
    const getBudgetPrj = async (year = moment().year()) => {
      try {
        setIsSpinning(true);
        setSltLoading(true);
        const res = await FetchQueryBudgetProjects({
          type: 'NF',
          year,
        });
        if (res?.success) {
          let data = toTreeData(res.record);
          console.log('🚀 ~ getLastYearBudgetPrj ~ data:', data);
          setBudgetSlt(data);
          setFieldsValue({ glysxm: undefined });
          setBudgetInfo({});
          setIsSpinning(false);
          setSltLoading(false);
        }
      } catch (e) {
        console.error('🚀预算下拉数据', e);
        message.error('预算下拉数据获取失败', 1);
        setIsSpinning(false);
        setSltLoading(false);
      }
    };

    //获取里程碑下拉数据
    const getMilestoneSlt = useCallback(
      debounce(async (budget = 0) => {
        setLastValue(budget);
        setIsSpinning(true);
        setSltLoading(true);
        try {
          const res = await FetchQueryMilepostInfo({
            type: 17,
            isShortListed: '2',
            xmid: -1,
            biddingMethod: 1,
            budget,
            label: '',
            queryType: 'ALL',
            haveType: 1,
            softBudget: 0,
            frameBudget: 0,
            singleBudget: 0,
            haveChild: 2,
          });
          if (res.success) {
            let data = JSON.parse(res.result);
            data.forEach(first => {
              first.key = first.lcblxid;
              first.title = first.lcbmc;
              first.value = first.lcblxid;
              first.selectable = false;
              first.children = first.matterInfos;
              first.children?.forEach(second => {
                second.key = second.swlxmc;
                second.title = second.swlxmc;
                second.value = second.swlxmc;
                second.selectable = false;
                second.children = second.sxlb;
                second.children?.forEach(third => {
                  third.key = third.sxid;
                  third.title = third.sxmc;
                  third.value = third.sxid;
                });
              });
            });
            console.log('🚀 ~ getMilestoneSlt ~ data:', data);
            setMilestoneSlt(data);
            //默认选中项目立项下的所有事项
            const xzxsx =
              data
                .find(x => String(x.value) === '14')
                ?.children?.reduce(
                  (acc, cur) => [
                    ...acc,
                    ...(cur?.children
                      ?.filter(x => x.sxmc !== '框架内硬件采购流程')
                      .map(x => x.sxid) || []),
                  ],
                  [],
                ) || []; //去掉 框架内硬件采购流程;
            setFieldsValue({
              xzxsx,
            });
            setSltLoading(false);
            setIsSpinning(false);
          }
        } catch (e) {
          console.error('🚀里程碑事项数据', e);
          setIsSpinning(false);
          setSltLoading(false);
          message.error('里程碑事项数据获取失败', 1);
        }
      }, 800),
      [],
    );

    //提交数据
    const onOk = debounce(() => {
      const getBudgetType = id => {
        if (id === '2') return 'FZB';
        else if (id === '3') return 'KY';
        else return 'ZBX';
      };
      function uniqueFunc(arr, uniId) {
        const res = new Map();
        return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1));
      }
      const handleMilestoneInfo = (idArr = []) => {
        let data = idArr.map(id => {
          let obj = {};
          milestoneSlt.forEach(first => {
            first.children?.forEach(second => {
              if (second.children?.findIndex(third => third.sxid === id) !== -1) {
                obj = second.children?.find(third => third.sxid === id);
              }
            });
          });
          return obj;
        });
        data.sort((a, b) => Number(a.xh) - Number(b.xh));
        return data;
      };
      const getMileposts = (arr = []) => {
        let data = uniqueFunc(arr, 'lcb');
        return data.map(x => ({
          lcb: x.lcb,
          kssj: moment()
            .startOf('year')
            .format('YYYYMMDD'),

          jssj: moment()
            .endOf('year')
            .format('YYYYMMDD'),
        }));
      };
      validateFields((err, values = {}) => {
        if (!err) {
          setIsSpinning(true);
          const mileposts = getMileposts(handleMilestoneInfo(values.xzxsx));
          const matters = handleMilestoneInfo(values.xzxsx).map(x => ({
            lcb: x.lcb,
            sxmc: x.sxid,
          }));
          console.log('onOk, values', values, mileposts, matters, userBasicInfo);
          const params = {
            projectName: values.xmmc,
            projectType: 17,
            org: Number(userBasicInfo.orgid),
            year: values.ysnf?.year(),
            budgetProject: Number(budgetInfo?.ysID),
            projectBudget: String(values.bxmys),
            mileposts,
            matters,
            projectManager: Number(userBasicInfo.id),
            projectId: type === 'ADD' ? -1 : Number(xmid),
            type,
            budgetType: getBudgetType(String(budgetInfo?.ysLXID)),
          };
          console.log('🚀 ~ validateFields ~ params:', params);
          OperateSinglePaymentProject(params)
            .then(res => {
              if (res.success) {
                refresh();
                message.success((type === 'ADD' ? '新建' : '编辑') + '项目成功', 1);
                setIsSpinning(false);
                onCancel();
              }
            })
            .catch(e => {
              console.error('🚀操作失败', e);
              setIsSpinning(false);
              message.error(e.note, 1);
            });
        }
      });
    }, 500);

    //取消
    const onCancel = () => {
      resetFields();
      setBudgetInfo({});
      setLastValue(undefined);
      setVisible(false);
    };

    //弹窗参数
    const modalProps = {
      wrapClassName: 'single-payment-prj-opr-modal',
      width: 860,
      maskClosable: false,
      style: { top: 10 },
      maskStyle: { backgroundColor: 'rgb(0 0 0 / 30%)' },
      zIndex: 103,
      title: null,
      visible,
      onCancel,
      onOk,
      destroyOnClose: true,
      okButtonProps: {
        loading: isSpinning,
      },
    };

    //日期选择器
    const getYearPicker = ({
      label,
      dataIndex,
      initialValue,
      labelCol,
      wrapperCol,
      display,
      open,
      setOpen = () => {},
      onChange = () => {},
    }) => {
      return (
        <Col span={12} style={{ display }}>
          <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
            {getFieldDecorator(dataIndex, {
              initialValue,
              rules: [
                {
                  required: true,
                  message: label + '不允许空值',
                },
              ],
            })(
              <DatePicker
                mode="year"
                open={open}
                placeholder="请选择年份"
                format="YYYY"
                allowClear={false}
                onChange={v => {
                  setFieldsValue({
                    [dataIndex]: v,
                  });
                  setOpen(false);
                }}
                onPanelChange={v => {
                  setFieldsValue({
                    [dataIndex]: v,
                  });
                  onChange(v?.year() ?? moment().year());
                  setOpen(false);
                }}
                onOpenChange={v => setOpen(v)}
                style={{ width: '100%' }}
              />,
            )}
          </Form.Item>
        </Col>
      );
    };

    //树型下拉框
    const getTreeSelect = ({
      label,
      labelNode = false,
      dataIndex,
      initialValue,
      labelCol,
      wrapperCol,
      colSpan = 12,
      treeData = [],
      display,
      componentProps = {},
    }) => {
      return (
        <Col span={colSpan} style={{ display }}>
          <Form.Item
            label={labelNode === false ? label : labelNode}
            labelCol={{ span: labelCol }}
            wrapperCol={{ span: wrapperCol }}
          >
            {getFieldDecorator(dataIndex, {
              initialValue,
              rules: [
                {
                  required: true,
                  message: label + '不允许空值',
                },
              ],
            })(
              <TreeSelect
                allowClear
                showSearch
                treeNodeFilterProp="title"
                dropdownClassName="newproject-treeselect"
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                treeData={treeData}
                placeholder="请选择"
                {...componentProps}
              />,
            )}
          </Form.Item>
        </Col>
      );
    };

    //关联预算项目
    const renderGLYSTreeNodes = (data = []) => {
      return data.map(item => {
        if (item.children?.length > 0) {
          return (
            <TreeSelect.TreeNode
              {...item}
              title={item.label}
              key={item.value}
              value={item.value}
              label={item.label}
              fzrandtitle={item.label}
            >
              {renderGLYSTreeNodes(item.children)}
            </TreeSelect.TreeNode>
          );
        }
        return (
          <TreeSelect.TreeNode
            {...item}
            key={item.value}
            title={
              <div>
                {item.label}
                <div style={{ fontSize: '12px', color: '#bfbfbf' }}>负责人：{item.ysfzr}</div>
              </div>
            }
            label={item.label}
            value={item.value}
            fzrandtitle={item.ysfzr + item.label}
          />
        );
      });
    };

    const getGLYSTreeSlt = ({
      label,
      labelNode = false,
      dataIndex,
      initialValue,
      labelCol,
      wrapperCol,
      colSpan = 12,
      treeData = [],
      display,
      componentProps = {},
    }) => {
      return (
        <Col span={colSpan} style={{ display }}>
          <Form.Item
            label={labelNode === false ? label : labelNode}
            labelCol={{ span: labelCol }}
            wrapperCol={{ span: wrapperCol }}
          >
            {getFieldDecorator(dataIndex, {
              initialValue,
              rules: [
                {
                  required: true,
                  message: label + '不允许空值',
                },
              ],
            })(
              <TreeSelect
                allowClear
                showSearch
                treeNodeFilterProp="fzrandtitle"
                dropdownClassName="newproject-treeselect"
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                placeholder="请选择"
                {...componentProps}
              >
                {renderGLYSTreeNodes(treeData)}
              </TreeSelect>,
            )}
          </Form.Item>
        </Col>
      );
    };

    //输入框 - 灰
    const getInputDisabled = (label, value, labelCol, wrapperCol, display) => {
      return (
        <Col span={12} style={{ display }}>
          <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
            <div
              style={{
                width: '100%',
                height: '32px',
                backgroundColor: '#F5F5F5',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                marginTop: '5px',
                lineHeight: '32px',
                paddingLeft: '10px',
                fontSize: '14px',
              }}
            >
              {value}
            </div>
          </Form.Item>
        </Col>
      );
    };

    //输入框
    const getInput = ({
      label,
      dataIndex,
      initialValue,
      labelCol,
      wrapperCol,
      colSpan = 12,
      display,
      addonBefore = '',
      labelNode = false,
      onChange = () => {},
    }) => {
      return (
        <Col span={colSpan} style={{ display }}>
          <Form.Item
            label={labelNode === false ? label : labelNode}
            labelCol={{ span: labelCol }}
            wrapperCol={{ span: wrapperCol }}
          >
            {getFieldDecorator(dataIndex, {
              initialValue,
              rules: [
                {
                  required: true,
                  message: label + '不允许空值',
                },
              ],
            })(
              <Input
                placeholder={'请输入' + label}
                allowClear
                style={{ width: '100%' }}
                addonBefore={addonBefore}
                onChange={onChange}
              />,
            )}
          </Form.Item>
        </Col>
      );
    };

    //输入框 - 数值型
    const getInputNumber = ({
      label,
      labelCol,
      wrapperCol,
      dataIndex,
      initialValue,
      rules,
      max = 999999999,
      display,
      colSpan = 12,
      componentProps = {},
    }) => {
      return (
        <Col span={colSpan} style={{ display }}>
          <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
            {getFieldDecorator(dataIndex, {
              initialValue,
              rules,
            })(
              <InputNumber
                style={{ width: '100%' }}
                max={max}
                min={0}
                step={0.01}
                precision={2}
                placeholder={'请输入' + label}
                {...componentProps}
              />,
            )}
          </Form.Item>
        </Col>
      );
    };

    //转为树结构-关联项目
    const toTreeData = list => {
      let a = list.reduce((pre, current, index) => {
        pre[current.ysLXID] = pre[current.ysLXID] || [];
        pre[current.ysLXID].push({
          key: current.ysLXID,
          label: current.ysLX,
          value: current.ysLXID,
          ysID: current.ysID,
          ysKGL: Number(current.ysKGL),
          ysLB: current.ysLB,
          ysName: current.ysName,
          ysZJE: Number(current.ysZJE),
          zdbm: current.zdbm,
          ysLX: current.ysLX,
          ysLXID: current.ysLXID,
          ysKZX: Number(current.ysKZX),
          ysfzr: current.ysfzr,
        });
        return pre;
      }, []);

      const treeData = [];
      for (const key in a) {
        const indexData = [];
        const childrenData = [];
        const childrenDatamini = [];
        if (a.hasOwnProperty(key)) {
          if (a[key] !== null) {
            // console.log("item",a[key]);
            let b = a[key].reduce((pre, current, index) => {
              pre[current.zdbm] = pre[current.zdbm] || [];
              pre[current.zdbm].push({
                key: current.ysID + current.ysLXID,
                label: current.ysName,
                value: current.ysID + current.ysLXID,
                ysID: current.ysID,
                ysKGL: Number(current.ysKGL),
                ysLB: current.ysLB,
                ysName: current.ysName,
                ysZJE: Number(current.ysZJE),
                zdbm: current.zdbm,
                ysLX: current.ysLX,
                ysLXID: current.ysLXID,
                ysKZX: Number(current.ysKZX),
                ysfzr: current.ysfzr,
              });
              return pre;
            }, []);
            a[key].map(item => {
              if (indexData.indexOf(item.zdbm) === -1) {
                indexData.push(item.zdbm);
                if (b[item.zdbm]) {
                  let treeDatamini = { children: [] };
                  if (item.zdbm === '6') {
                    // console.log('b[item.zdbm]', b['6']);
                    b[item.zdbm].map(i => {
                      let treeDatamini = {};
                      treeDatamini.key = i.ysID + i.ysLXID;
                      treeDatamini.value = i.ysID + i.ysLXID;
                      treeDatamini.label = i.ysName;
                      treeDatamini.ysID = i.ysID;
                      treeDatamini.ysKGL = Number(i.ysKGL);
                      treeDatamini.ysLB = i.ysLB;
                      treeDatamini.ysName = i.ysName;
                      treeDatamini.ysZJE = Number(i.ysZJE);
                      treeDatamini.ysKZX = Number(i.ysKZX);
                      treeDatamini.zdbm = i.zdbm;
                      treeDatamini.ysLX = i.ysLX;
                      treeDatamini.ysLXID = i.ysLXID;
                      (treeDatamini.ysfzr = i.ysfzr), childrenDatamini.push(treeDatamini);
                    });
                  } else {
                    treeDatamini.key = item.ysID + item.ysLXID;
                    treeDatamini.value = item.ysID + item.ysLXID;
                    treeDatamini.label = item.ysLB;
                    treeDatamini.ysID = item.ysID;
                    treeDatamini.ysKGL = Number(item.ysKGL);
                    treeDatamini.ysLB = item.ysLB;
                    treeDatamini.ysName = item.ysName;
                    treeDatamini.ysLX = item.ysLX;
                    treeDatamini.ysLXID = item.ysLXID;
                    treeDatamini.ysZJE = Number(item.ysZJE);
                    treeDatamini.ysKZX = Number(item.ysKZX);
                    treeDatamini.zdbm = item.zdbm;
                    treeDatamini.dropdownStyle = { color: '#666' };
                    treeDatamini.selectable = false;
                    treeDatamini.ysfzr = item.ysfzr;
                    treeDatamini.children = b[item.zdbm];
                    childrenDatamini.push(treeDatamini);
                  }
                }
                childrenData.key = key;
                childrenData.value = key;
                childrenData.label = item.ysLX;
                childrenData.dropdownStyle = { color: '#666' };
                childrenData.selectable = false;
                childrenData.children = childrenDatamini;
              }
            });
            treeData.push(childrenData);
          }
        }
      }
      return treeData;
    };

    //判断是否为数字
    function IsNum(s) {
      if (s != null && s != '') {
        return !isNaN(s);
      }
      return false;
    }

    return (
      <Modal {...modalProps}>
        <div className="body-title-box">
          <strong>{(type === 'ADD' ? '新建' : '编辑') + '项目'}</strong>
        </div>
        <Spin spinning={isSpinning} tip="加载中">
          <Form className="content-box">
            <RowTitle
              title="基本信息"
              open={rowTitle.basic}
              setOpen={v => setRowTitle(p => ({ ...p, basic: v }))}
            />
            {getInput({
              label: '项目名称',
              dataIndex: 'xmmc',
              initialValue: updateData.projectName,
              colSpan: 24,
              labelCol: labelCol / 2 - 1,
              wrapperCol: 24 - labelCol / 2 + 1,
              display: rowTitle.basic ? 'block' : 'none',
            })}
            <RowTitle
              title="预算信息"
              open={rowTitle.budget}
              setOpen={v => setRowTitle(p => ({ ...p, budget: v }))}
            />
            {getYearPicker({
              label: '预算年份',
              dataIndex: 'ysnf',
              initialValue:
                updateData.year !== undefined ? moment(String(updateData.year)) : moment(),
              labelCol: labelCol - 2,
              wrapperCol: wrapperCol + 2,
              open: yearOpen,
              setOpen: setYearOpen,
              onChange: getBudgetPrj,
              display: rowTitle.budget ? 'block' : 'none',
            })}
            {getGLYSTreeSlt({
              label: '关联预算项目',
              dataIndex: 'glysxm',
              initialValue:
                updateData.budgetProject === '' || updateData.budgetProject === undefined
                  ? undefined
                  : Number(updateData.budgetProject) <= 0
                  ? updateData.budgetProject + '4'
                  : updateData.budgetProject + updateData.budgetTypeId,
              treeData: budgetSlt,
              labelCol,
              wrapperCol,
              display: rowTitle.budget ? 'block' : 'none',
              componentProps: {
                disabled: sltLoading,
                onChange: (v, _, extra) => {
                  console.log('🚀 ~ SinglePaymentModal ~ v, extra:', v, extra?.triggerNode?.props);
                  setBudgetInfo(extra?.triggerNode?.props);
                },
              },
            })}
            {getInputDisabled(
              '总预算(元)',
              budgetInfo?.ysZJE,
              labelCol - 2,
              wrapperCol + 2,
              rowTitle.budget ? 'block' : 'none',
            )}
            {getInputDisabled(
              '可执行预算(元)',
              budgetInfo?.ysKZX,
              labelCol,
              wrapperCol,
              rowTitle.budget ? 'block' : 'none',
            )}
            {getInputDisabled(
              '剩余预算(元)',
              budgetInfo?.ysKGL,
              labelCol - 2,
              wrapperCol + 2,
              rowTitle.budget ? 'block' : 'none',
            )}
            {getInputNumber({
              label: '本项目预算(元)',
              dataIndex: 'bxmys',
              initialValue:
                updateData.projectBudget !== undefined
                  ? Number(updateData.projectBudget)
                  : undefined,
              treeData: budgetSlt,
              labelCol,
              wrapperCol,
              rules: [
                {
                  required: true,
                  message: '本项目预算不允许空值',
                },
              ],
              display: rowTitle.budget ? 'block' : 'none',
              componentProps: {
                onChange: v => {
                  // let v = getFieldValue('bxmys');
                  if (v !== lastValue && isNumber(v)) {
                    if (v > 999999999) {
                      getMilestoneSlt(999999999);
                    } else if (v < 0) {
                      getMilestoneSlt(0);
                    } else {
                      getMilestoneSlt(v);
                    }
                  }
                },
              },
            })}
            <RowTitle
              title="事项信息"
              open={rowTitle.milestoneItem}
              setOpen={v => setRowTitle(p => ({ ...p, milestoneItem: v }))}
            />
            {getTreeSelect({
              label: '需执行事项',
              dataIndex: 'xzxsx',
              initialValue: undefined,
              treeData: milestoneSlt,
              colSpan: 24,
              labelCol: labelCol / 2 - 1,
              wrapperCol: 24 - labelCol / 2 + 1,
              display: rowTitle.milestoneItem ? 'block' : 'none',
              componentProps: {
                multiple: true,
                disabled: sltLoading,
                treeDefaultExpandAll: true,
              },
            })}
          </Form>
        </Spin>
      </Modal>
    );
  }),
);

const RowTitle = ({
  title = '--',
  redTipTxt = '',
  style = {},
  open = false,
  setOpen = () => {},
}) => (
  <Col span={24} className="row-title" key={title}>
    <div onClick={() => setOpen(!open)} style={{ display: 'inline', cursor: 'pointer' }}>
      <Icon
        type={'caret-right'}
        className={'row-title-icon' + (open ? ' row-title-icon-rotate' : '')}
      />
      <span style={style}>{title}</span>
    </div>
    <span className="row-title-red-tip-txt">{redTipTxt}</span>
  </Col>
);
