import React, { useEffect, useState, useRef, ReactDOM, Fragment } from 'react';
import {
  Button,
  InputNumber,
  message,
  Tooltip,
  Form,
  Select,
  Popconfirm,
  Input,
  Spin,
  Row,
  Col,
  DatePicker,
  Radio,
  Upload,
  Icon,
  Breadcrumb,
  TreeSelect,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { Link, useLocation } from 'react-router-dom';

import {
  OperateCapitalBeginYearBudgetInfo,
  OperateXCContract,
  QueryCapitalBudgetCarryoverInfo,
  QueryDocTemplate,
} from '../../../services/pmsServices';
import { useHistory } from 'react-router';
import { DecryptBase64, EncryptBase64 } from '../../Common/Encrypt';
import Decimal from 'decimal.js';
import { FetchQueryBudgetProjects } from '../../../services/projectManage';
const { TextArea } = Input;

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(
  Form.create()(function BudgetSubmit(props) {
    const {
      dictionary = {},
      match: {
        params: { params = '' },
      },
      userBasicInfo = {},
      form = {},
    } = props;
    const { YSFL = [], YSLB = [], ZDTSNRPZ = [] } = dictionary;
    // console.log('🚀 ~ BudgetSubmit ~ ZDTSNRPZ:', ZDTSNRPZ);
    const radioArr = [
      { note: '是', ibm: 1 },
      { note: '否', ibm: 2 },
    ];
    const JZZT = [
      {
        ibm: 1,
        note: '新增',
      },
      {
        ibm: 2,
        note: '结转',
      },
    ];
    const { getFieldDecorator, getFieldValue, validateFields, resetFields, setFieldsValue } = form;
    const [isSpinning, setIsSpinning] = useState(false); //加载状态
    const history = useHistory();
    const [rowTitle, setRowTitle] = useState({
      basic: true,
      budget: true,
      yearPlan: true,
      attachment: true,
    }); //标题展开收起
    const [yearOpen, setYearOpen] = useState(false); //年份下拉框展开收起
    const [fileList, setFileList] = useState([]); //附件
    const [isTurnRed, setIsTurnRed] = useState(false); //附件报红
    const [fileTpl, setFileTpl] = useState([]); //文件模板
    const [updateData, setUpdateData] = useState({}); //详情/修改时 回显的数据
    const [propsData, setPropsData] = useState({
      operateType: 'ADD', //operateType
      budgetId: -1, //UPDATE时有传
      submitType: 1, //在外边判断好
    }); //
    const [routes, setRoutes] = useState([]); //路由
    const [lastBudgetPrj, setLastBudgetPrj] = useState([]); //去年同类预算下拉框数据

    useEffect(() => {
      if (params !== '') {
        let obj = JSON.parse(DecryptBase64(params));
        setPropsData(obj);
        getUpdateData(obj.budgetId, obj.defaultYear);
        getFileTemplateData();
        if (obj.defaultYear !== undefined) {
          setFieldsValue({
            nf: moment(obj.defaultYear, 'YYYY'),
          });
        }
        //名称路由去重
        const routesArr = [
          ...(obj.routes || []),
          {
            name: '预算填报',
            pathname: location.pathname,
          },
        ]?.filter((obj, index, arr) => {
          return !arr.slice(index + 1).some(item => item.name === obj.name);
        });
        setRoutes(routesArr);
      }
      return () => {};
    }, [params]);

    useEffect(() => {
      if (Decimal(getFieldValue('bn_ztz') || 0).gt(50)) {
        getFileTemplateData('可行性研究报告');
      }
      return () => {};
    }, [getFieldValue('bn_ztz')]);

    //详情/修改时 回显的数据
    const getUpdateData = (budgetId, year) => {
      setIsSpinning(true);
      QueryCapitalBudgetCarryoverInfo({
        queryType: 'YSXQ',
        budgetId,
      })
        .then(res => {
          if (res?.success) {
            const data = JSON.parse(res.result);
            if (data.length > 0) {
              setUpdateData(data[0]);
              getLastYearBudgetPrj(Number(data[0].NF) - 1);
              const fileList = JSON.parse(data[0].LXBAB || '[]').map((x, index) => ({
                uid: Date.now() + '-' + index,
                name: x.fileName,
                status: 'done',
                base64: x.data,
                blob: x.data,
                url: x.url,
              }));
              setFileList(fileList);
            } else {
              getLastYearBudgetPrj(Number(year) - 1);
            }
            setIsSpinning(false);
          }
        })
        .catch(e => {
          console.error('🚀详情回显数据', e);
          message.error('详情回显数据获取失败', 1);
          setIsSpinning(false);
        });
    };

    //获取附件模板
    const getFileTemplateData = (fileTypeName = '立项备案表') => {
      setIsSpinning(true);
      QueryDocTemplate({
        fileTypeName,
      })
        .then(res => {
          if (res?.success) {
            const data = JSON.parse(res.result);
            if (data.length > 0) {
              if (data[0].FJ && data[0].FJ.length > 0) {
                setFileTpl(data[0].FJ);
              }
            }
            setIsSpinning(false);
          }
        })
        .catch(e => {
          console.error('🚀附件模板', e);
          message.error('附件模板获取失败', 1);
          setIsSpinning(false);
        });
    };

    //获取去年同类预算下拉数据
    const getLastYearBudgetPrj = year => {
      FetchQueryBudgetProjects({
        type: 'ZBX',
        year,
      })
        .then(res => {
          if (res?.success) {
            let data = toTreeData(res.record);
            setLastBudgetPrj(data.length > 0 ? data[0]?.children : []);
            setIsSpinning(false);
          }
        })
        .catch(e => {
          console.error('🚀获取去年同类预算下拉数据', e);
          message.error('去年同类预算下拉数据获取失败', 1);
          setIsSpinning(false);
        });
    };

    //转为树结构-关联项目
    const toTreeData = list => {
      let a = list.reduce((pre, current, index) => {
        pre[current.ysLX] = pre[current.ysLX] || [];
        pre[current.ysLX].push({
          key: current.ysLX,
          title: current.ysLX,
          value: current.ysLX,
          ysID: current.ysID,
          ysKGL: Number(current.ysKGL),
          ysLB: current.ysLB,
          ysName: current.ysName,
          ysZJE: Number(current.ysZJE),
          zdbm: current.zdbm,
          ysLX: current.ysLX,
          ysLXID: current.ysLXID,
          ysKZX: Number(current.ysKZX),
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
            // ////console.log("item",a[key]);
            let b = a[key].reduce((pre, current, index) => {
              pre[current.zdbm] = pre[current.zdbm] || [];
              pre[current.zdbm].push({
                key: current.ysID,
                title: current.ysName,
                value: current.ysID,
                ysID: current.ysID,
                ysKGL: Number(current.ysKGL),
                ysLB: current.ysLB,
                ysName: current.ysName,
                ysZJE: Number(current.ysZJE),
                zdbm: current.zdbm,
                ysLX: current.ysLX,
                ysLXID: current.ysLXID,
                ysKZX: Number(current.ysKZX),
              });
              return pre;
            }, []);
            a[key].map(item => {
              if (indexData.indexOf(item.zdbm) === -1) {
                indexData.push(item.zdbm);
                if (b[item.zdbm]) {
                  let treeDatamini = { children: [] };
                  if (item.zdbm === '6') {
                    b[item.zdbm].map(i => {
                      let treeDataby = {};
                      treeDataby.key = i.ysID;
                      treeDataby.value = i.ysID;
                      treeDataby.title = i.ysName;
                      treeDataby.ysID = i.ysID;
                      treeDataby.ysKGL = Number(i.ysKGL);
                      treeDataby.ysLB = i.ysLB;
                      treeDataby.ysName = i.ysName;
                      treeDataby.ysZJE = Number(i.ysZJE);
                      treeDataby.ysKZX = Number(i.ysKZX);
                      treeDataby.zdbm = i.zdbm;
                      childrenDatamini.push(treeDataby);
                    });
                  } else {
                    treeDatamini.key = item.zdbm;
                    treeDatamini.value = item.zdbm;
                    treeDatamini.title = item.ysLB;
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
                    treeDatamini.children = b[item.zdbm];
                    childrenDatamini.push(treeDatamini);
                  }
                }
                childrenData.key = key;
                childrenData.value = key;
                childrenData.title = item.ysLX;
                childrenData.dropdownStyle = { color: '#666' };
                childrenData.selectable = false;
                childrenData.children = childrenDatamini;
              }
            });
            treeData.push(childrenData);
          }
        }
      }
      // ////console.log("treeData",treeData)
      return treeData;
    };

    //获取问号提示
    const getQesTip = (txt = '') => {
      return ZDTSNRPZ.find(x => x.cbm === txt)?.note ?? '';
    };

    //输入框
    const getInput = ({
      label,
      dataIndex,
      initialValue,
      labelCol,
      wrapperCol,
      display,
      addonBefore = '',
      labelNode = false,
    }) => {
      return (
        <Col span={8} style={{ display }}>
          <Form.Item
            disabled
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
                disabled={propsData.operateType === 'XQ'}
                addonBefore={addonBefore}
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
      max,
      display,
      onChange = () => {},
      colSpan = 8,
      redTipTxt = '',
    }) => {
      return (
        <Col span={colSpan} style={{ display }}>
          <Form.Item
            label={
              <span>
                {label}
                <span
                  style={{
                    color: '#f5222d',
                    marginLeft: -8,
                  }}
                >
                  {redTipTxt}
                </span>
              </span>
            }
            labelCol={{ span: labelCol }}
            wrapperCol={{ span: wrapperCol }}
          >
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
                onChange={onChange}
                disabled={propsData.operateType === 'XQ'}
              />,
            )}
          </Form.Item>
        </Col>
      );
    };

    //单选框
    const getRadio = ({
      label,
      dataIndex,
      initialValue,
      radioArr = [{ title: 'xx', value: 1 }],
      labelCol,
      wrapperCol,
      valueField,
      titleField,
      display,
    }) => {
      return (
        <Col span={8} style={{ display }}>
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
              <Radio.Group disabled={propsData.operateType === 'XQ'}>
                {radioArr.map(x => (
                  <Radio key={x[valueField]} value={x[valueField]}>
                    {x[titleField]}
                  </Radio>
                ))}
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
      );
    };

    //单选普通下拉框
    const getSingleSelector = ({
      label,
      dataIndex,
      initialValue,
      labelCol,
      wrapperCol,
      sltArr = [],
      valueField,
      titleFeild,
      display,
    }) => {
      return (
        <Col span={8} style={{ display }}>
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
              <Select
                placeholder="请选择"
                optionFilterProp="children"
                showSearch
                allowClear
                disabled={propsData.operateType === 'XQ'}
              >
                {sltArr.map(x => (
                  <Select.Option key={x[valueField]} value={x[valueField]}>
                    {x[titleFeild]}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      );
    };

    //文本域
    const getTextArea = ({
      label,
      dataIndex,
      initialValue,
      labelCol,
      wrapperCol,
      maxLength,
      rules,
      display,
    }) => {
      return (
        <Col span={24} style={{ display }}>
          <Form.Item
            style={{ marguinBottom: 6 }}
            label={label}
            labelCol={{ span: labelCol }}
            wrapperCol={{ span: wrapperCol }}
            className={'budget-submit-textarea textarea-margin-bottom-style'}
          >
            {getFieldDecorator(dataIndex, {
              initialValue,
              rules,
            })(
              <TextArea
                placeholder={'请输入' + label}
                maxLength={maxLength}
                autoSize={{ maxRows: 6, minRows: 3 }}
                disabled={propsData.operateType === 'XQ'}
                allowClear
              ></TextArea>,
            )}
          </Form.Item>
        </Col>
      );
    };

    //日期选择器
    const getDatePicker = ({
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
        <Col span={8} style={{ display }}>
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
                disabled={propsData.operateType === 'XQ'}
                mode="year"
                open={open}
                placeholder="请选择年份"
                format="YYYY"
                allowClear={false}
                onChange={v => {
                  setFieldsValue({ [dataIndex]: v });
                  setOpen(false);
                }}
                onPanelChange={v => {
                  setFieldsValue({ [dataIndex]: v });
                  onChange(v.year() - 1);
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

    const getTreeSelect = ({
      label,
      labelNode = false,
      dataIndex,
      initialValue,
      labelCol,
      wrapperCol,
      treeData = [],
      display,
    }) => {
      return (
        <Col span={8} style={{ display }}>
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
                disabled={propsData.operateType === 'XQ' && !propsData.isGLY} //管理员允许编辑 “关联去年同类预算”
                allowClear
                showSearch
                treeNodeFilterProp="title"
                dropdownClassName="newproject-treeselect"
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                treeData={treeData}
                placeholder="请选择"
              />,
            )}
          </Form.Item>
        </Col>
      );
    };

    //多附件上传
    const getMultipleUpload = ({
      label,
      labelCol,
      wrapperCol,
      fileList = [],
      setFileList,
      isTurnRed,
      setIsTurnRed,
      display,
    }) => {
      const onUploadDownload = file => {
        if (!file.url) {
          let reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = e => {
            var link = document.createElement('a');
            link.href = e.target.result;
            link.download = file.name;
            link.click();
            window.URL.revokeObjectURL(link.href);
          };
        } else {
          var link = document.createElement('a');
          link.href = file.url;
          link.download = file.name;
          link.click();
          window.URL.revokeObjectURL(link.href);
        }
      };
      const onUploadChange = info => {
        let list = [...info.fileList]; //每次改变后的数据列表
        if (list.length > 0) {
          list.forEach(item => {
            if (fileList.findIndex(x => x.uid === item.uid) === -1) {
              //原来没有，则为新数据，加进去
              setFileList([
                ...fileList,
                {
                  ...item,
                  uid: item.uid,
                  name: item.name,
                  status: item.status === 'uploading' ? 'done' : item.status,
                },
              ]);
              // setIsTurnRed(false);
            } else {
              //原来有的数据，判断是否已移除
              setFileList(fileList.filter(x => x.status !== 'removed'));
              setIsTurnRed(fileList.length === 0);
            }
          });
        } else {
          setFileList([]);
          setIsTurnRed(true);
        }
      };
      const onBeforeUpload = () => {};
      return (
        <Col span={8} style={{ display }}>
          <Form.Item
            label={label}
            labelCol={{ span: labelCol }}
            wrapperCol={{ span: wrapperCol }}
            required
            help={isTurnRed ? label + '不允许空值' : ''}
            validateStatus={isTurnRed ? 'error' : 'success'}
          >
            <Upload
              disabled={propsData.operateType === 'XQ'}
              action={'/api/projectManage/queryfileOnlyByupload'}
              onDownload={onUploadDownload}
              showUploadList={{
                showDownloadIcon: true,
                showRemoveIcon: true,
                showPreviewIcon: false,
              }}
              multiple={true}
              onChange={onUploadChange}
              beforeUpload={onBeforeUpload}
              accept={
                '.doc,.docx,.xml,.pdf,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              }
              fileList={fileList}
            >
              <Button type="dashed">
                <Icon type="upload" />
                点击上传
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      );
    };

    const getFileTemplate = ({ label = '--', display, listData = [] }) => {
      const handleDownload = (fileName, url) => {
        var link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
      };
      return (
        <Col span={8} style={{ display }}>
          <Form.Item label={label}>
            <div className="template-box" style={listData.length > 5 ? { paddingRight: 4 } : {}}>
              {listData.map((x, i) => (
                <div className="file-template-box" key={x.fileName + i}>
                  <Tooltip title={x.fileName} placement="topLeft">
                    <span onClick={() => handleDownload(x.fileName, x.url)}>{x.fileName}</span>
                  </Tooltip>
                  <i
                    onClick={() => handleDownload(x.fileName, x.url)}
                    className="iconfont icon-download"
                  />
                </div>
              ))}
            </div>
          </Form.Item>
        </Col>
      );
    };

    const getRowTitle = ({ open, setOpen, title = '--', redTipTxt = '' }) => (
      <Col span={24} className="row-title" key={title} onClick={setOpen}>
        <Icon
          type={'caret-right'}
          className={'row-title-icon' + (open ? ' row-title-icon-rotate' : '')}
        />
        <span>{title}</span>
        <span className="row-title-red-tip-txt">{redTipTxt}</span>
      </Col>
    );

    const getBasic = () => {
      const display = rowTitle.basic ? 'block' : 'none';
      return (
        <Fragment key={'基本信息'}>
          {getRowTitle({
            title: '基本信息',
            open: rowTitle.basic,
            setOpen: () =>
              setRowTitle(p => ({
                ...p,
                basic: !p.basic,
              })),
          })}
          <Row gutter={24}>
            {getDatePicker({
              label: '年份',
              dataIndex: 'nf',
              initialValue:
                updateData.NF !== undefined ? moment(String(updateData.NF), 'YYYY') : null,
              display,
              open: yearOpen,
              setOpen: setYearOpen,
              onChange: v => getLastYearBudgetPrj(v),
            })}
            {getInput({
              label: '预算项目名称',
              labelNode: (
                <span>
                  预算项目名称
                  <Tooltip title={getQesTip('预算项目名称问号内容')}>
                    <Icon type="question-circle-o" style={{ marginLeft: 4, marginRight: 2 }} />
                  </Tooltip>
                </span>
              ),
              dataIndex: 'ysxmmc',
              initialValue:
                updateData.YSXMMC?.slice(0, 4) === updateData.NF + ''
                  ? updateData.YSXMMC?.slice(4)
                  : updateData.YSXMMC,
              display,
              addonBefore: getFieldValue('nf')?.year(),
            })}
            {getRadio({
              label: '属于新增/结转项目',
              dataIndex: 'syxzjzxm',
              initialValue: updateData.JZHXZ,
              radioArr: JZZT,
              valueField: 'ibm',
              titleField: 'note',
              display,
            })}
          </Row>
          <Row gutter={24}>
            {getSingleSelector({
              label: '预算类别',
              dataIndex: 'yslb',
              initialValue: updateData.YSLB !== undefined ? String(updateData.YSLB) : undefined,
              sltArr: YSFL,
              valueField: 'ibm',
              titleFeild: 'note',
              display,
            })}
            {getRadio({
              label: '是否首次立项',
              dataIndex: 'sfsclx',
              initialValue: updateData.SFSCLX,
              radioArr,
              valueField: 'ibm',
              titleField: 'note',
              display,
            })}
            {getTreeSelect({
              label: '关联去年同类预算',
              labelNode: (
                <span>
                  关联去年同类预算
                  <Tooltip title={getQesTip('关联去年同类预算问号内容')}>
                    <Icon type="question-circle-o" style={{ marginLeft: 4, marginRight: 2 }} />
                  </Tooltip>
                </span>
              ),
              dataIndex: 'glqntlys',
              initialValue: updateData.GLJZYS !== undefined ? String(updateData.GLJZYS) : undefined,
              treeData: lastBudgetPrj,
              display,
            })}
          </Row>
          <Row gutter={24}>
            {getRadio({
              label: '是否涉及软件开发或系统对接',
              dataIndex: 'sfsjrjkfhxtdj',
              initialValue: updateData.RJKFHXTDJ,
              radioArr,
              valueField: 'ibm',
              titleField: 'note',
              display,
            })}
            {getInput({
              label: '系统名称',
              dataIndex: 'xtmc',
              initialValue: updateData.XTMC,
              display,
            })}
            {getSingleSelector({
              label: '项目分类',
              dataIndex: 'xmfl',
              initialValue: updateData.XMFL !== undefined ? String(updateData.XMFL) : undefined,
              sltArr: YSLB.filter(x => Number(x.ibm) <= 5),
              valueField: 'ibm',
              titleFeild: 'note',
              display,
            })}
          </Row>
          <Row gutter={24}>
            {getInput({
              label: '项目分类说明',
              dataIndex: 'xmflsm',
              initialValue: updateData.XMFLSM,
              display,
            })}
          </Row>
          {getTextArea({
            label: '项目必要性',
            dataIndex: 'xmbyx',
            initialValue: updateData.XMBYX,
            rules: [
              {
                required: true,
                message: '项目必要性不允许为空',
              },
            ],
            maxLength: 500,
            display,
          })}
          {getTextArea({
            label: '项目内容',
            dataIndex: 'xmnr',
            initialValue: updateData.XMNR,
            rules: [
              {
                required: true,
                message: '项目内容不允许为空',
              },
            ],
            maxLength: 500,
            display,
          })}
        </Fragment>
      );
    };

    const getBudget = () => {
      const display = rowTitle.budget ? 'block' : 'none';
      return (
        <Fragment key={'预算信息'}>
          {getRowTitle({
            title: '预算信息',
            open: rowTitle.budget,
            setOpen: () =>
              setRowTitle(p => ({
                ...p,
                budget: !p.budget,
              })),
          })}
          <Row gutter={24}>
            {getInputNumber({
              label: '软件投资（万元）',
              dataIndex: 'rjtz',
              initialValue: updateData.RJTZ,
              rules: [
                {
                  required: true,
                  message: '软件投资不允许为空',
                },
              ],
              max: 999999999,
              display,
              onChange: v => {
                setFieldsValue({
                  ztz: Decimal(getFieldValue('yjtzzje') || 0).plus(v || 0),
                });
              },
            })}
            {getInputNumber({
              label: '其中信创-软件投资（万元）',
              dataIndex: 'qzxcrjtz',
              initialValue: updateData.XCRJTZ,
              rules: [
                {
                  required: true,
                  message: '其中信创-软件投资不允许为空',
                },
              ],
              max: 999999999,
              display,
            })}
          </Row>
          <Row gutter={24}>
            {getInputNumber({
              label: '硬件服务器（万元）',
              dataIndex: 'yjfwq',
              initialValue: updateData.YJFWQ,
              rules: [
                {
                  required: true,
                  message: '硬件服务器不允许为空',
                },
              ],
              max: 999999999,
              display,
            })}
            {getInputNumber({
              label: '硬件网络设备（万元）',
              dataIndex: 'yjwlsb',
              initialValue: updateData.YJWLSB,
              rules: [
                {
                  required: true,
                  message: '硬件网络设备不允许为空',
                },
              ],
              max: 999999999,
              display,
            })}
            {getInputNumber({
              label: '硬件其他（万元）',
              dataIndex: 'yjqt',
              initialValue: updateData.YJQT,
              rules: [
                {
                  required: true,
                  message: '硬件其他不允许为空',
                },
              ],
              max: 999999999,
              display,
            })}
          </Row>
          <Row gutter={24}>
            {getInputNumber({
              label: '硬件投资总金额（万元）',
              dataIndex: 'yjtzzje',
              initialValue: updateData.YJTZZJE,
              rules: [
                {
                  required: true,
                  message: '硬件投资总金额不允许为空',
                },
              ],
              max: 999999999,
              display,
              onChange: v => {
                setFieldsValue({
                  ztz: Decimal(getFieldValue('rjtz') || 0).plus(v || 0),
                });
              },
            })}
            {getInputNumber({
              label: '其中信创-硬件投资（万元）',
              dataIndex: 'qzxcyjtz',
              initialValue: updateData.XCYJTZ,
              rules: [
                {
                  required: true,
                  message: '其中信创-硬件投资不允许为空',
                },
              ],
              max: 999999999,
              display,
            })}
            {getInputNumber({
              label: '其中基础硬件入围金额',
              dataIndex: 'qzjcyjrwje',
              initialValue: updateData.JCYJRWJE,
              rules: [
                {
                  required: true,
                  message: '其中基础硬件入围金额不允许为空',
                },
              ],
              max: 999999999,
              display,
            })}
          </Row>
          <Row gutter={24}>
            {getInputNumber({
              label: '总投资（万元）',
              dataIndex: 'ztz',
              initialValue: updateData.ZTZ,
              rules: [
                {
                  required: true,
                  message: '总投资不允许为空',
                },
              ],
              max: 999999999,
              display,
              colSpan: 24,
              redTipTxt:
                getFieldValue('syxzjzxm') === 2 //结转项目时显示提示文本
                  ? '（总投资金额=去年预算关联项目的总合同金额+待签合同金额）'
                  : '',
            })}
          </Row>
          <Row gutter={24}>
            {getTextArea({
              label: '硬件云资源配置',
              dataIndex: 'yjyzypz',
              initialValue: updateData.YJYZYPZ,
              rules: [
                {
                  required: true,
                  message: '硬件云资源配置不允许为空',
                },
              ],
              maxLength: 500,
              display,
            })}
          </Row>
          {getTextArea({
            label: '硬件存储配置',
            dataIndex: 'yjccpz',
            initialValue: updateData.YJCCPZ,
            rules: [
              {
                required: true,
                message: '硬件存储配置不允许为空',
              },
            ],
            maxLength: 500,
            display,
          })}
        </Fragment>
      );
    };

    const getYearPlan = () => {
      const display = rowTitle.yearPlan ? 'block' : 'none';
      return (
        <Fragment key={'本年计划支付预算信息'}>
          {getRowTitle({
            title: '本年计划支付预算信息',
            open: rowTitle.yearPlan,
            setOpen: () =>
              setRowTitle(p => ({
                ...p,
                yearPlan: !p.yearPlan,
              })),
          })}
          <Row gutter={24}>
            {getInputNumber({
              label: '软件投资（万元）',
              dataIndex: 'bn_rjtz',
              initialValue: updateData.BNJHRJTZ,
              rules: [
                {
                  required: true,
                  message: '软件投资不允许为空',
                },
              ],
              max: 999999999,
              display,
              onChange: v => {
                setFieldsValue({
                  bn_ztz: Decimal(getFieldValue('bn_yjtzzje') || 0).plus(v || 0),
                });
              },
            })}
            {getInputNumber({
              label: '其中信创-软件投资（万元）',
              dataIndex: 'bn_qzxcrjtz',
              initialValue: updateData.BNJHXCRJTZ,
              rules: [
                {
                  required: true,
                  message: '其中信创-软件投资不允许为空',
                },
              ],
              max: 999999999,
              display,
            })}
          </Row>
          <Row gutter={24}>
            {getInputNumber({
              label: '硬件服务器（万元）',
              dataIndex: 'bn_yjfwq',
              initialValue: updateData.BNJHYJFWQ,
              rules: [
                {
                  required: true,
                  message: '硬件服务器不允许为空',
                },
              ],
              max: 999999999,
              display,
            })}
            {getInputNumber({
              label: '硬件网络设备（万元）',
              dataIndex: 'bn_yjwlsb',
              initialValue: updateData.BNJHYJWLSB,
              rules: [
                {
                  required: true,
                  message: '硬件网络设备不允许为空',
                },
              ],
              max: 999999999,
              display,
            })}
            {getInputNumber({
              label: '硬件其他（万元）',
              dataIndex: 'bn_yjqt',
              initialValue: updateData.BNJHYJQT,
              rules: [
                {
                  required: true,
                  message: '硬件其他不允许为空',
                },
              ],
              max: 999999999,
              display,
            })}
          </Row>
          <Row gutter={24}>
            {getInputNumber({
              label: '硬件投资总金额（万元）',
              dataIndex: 'bn_yjtzzje',
              initialValue: updateData.BNJHYJTZZJE,
              rules: [
                {
                  required: true,
                  message: '硬件投资总金额不允许为空',
                },
              ],
              max: 999999999,
              display,
              onChange: v => {
                setFieldsValue({
                  bn_ztz: Decimal(getFieldValue('bn_rjtz') || 0).plus(v || 0),
                });
              },
            })}
            {getInputNumber({
              label: '其中信创-硬件投资（万元）',
              dataIndex: 'bn_qzxcyjtz',
              initialValue: updateData.BNJHXCYJTZ,
              rules: [
                {
                  required: true,
                  message: '其中信创-硬件投资不允许为空',
                },
              ],
              max: 999999999,
              display,
            })}
            {getInputNumber({
              label: '其中基础硬件入围金额',
              dataIndex: 'bn_qzjcyjrwje',
              initialValue: updateData.KZXJCYJRWJE,
              rules: [
                {
                  required: true,
                  message: '其中基础硬件入围金额不允许为空',
                },
              ],
              max: 999999999,
              display,
            })}
          </Row>
          <Row gutter={24}>
            {getInputNumber({
              label: '总投资（万元）',
              dataIndex: 'bn_ztz',
              initialValue: updateData.BNJHZTZ,
              rules: [
                {
                  required: true,
                  message: '总投资不允许为空',
                },
              ],
              max: 999999999,
              display,
              colSpan: 24,
              redTipTxt:
                getFieldValue('syxzjzxm') === 2 //结转项目时显示提示文本
                  ? '（总投资金额=去年预算关联项目的总合同金额+待签合同金额）'
                  : '',
            })}
          </Row>
          {getTextArea({
            label: '硬件云资源配置',
            dataIndex: 'bn_yjyzypz',
            initialValue: updateData.BNJHYJYZYPZ,
            rules: [
              {
                required: true,
                message: '硬件云资源配置不允许为空',
              },
            ],
            maxLength: 500,
            display,
          })}
          {getTextArea({
            label: '硬件存储配置',
            dataIndex: 'bn_yjccpz',
            initialValue: updateData.BNJHYJCCPZ,
            rules: [
              {
                required: true,
                message: '硬件存储配置不允许为空',
              },
            ],
            maxLength: 500,
            display,
          })}
        </Fragment>
      );
    };

    const getAttachment = () => {
      const display = rowTitle.attachment ? 'block' : 'none';
      return (
        <Fragment key={'附件信息'}>
          {getRowTitle({
            title: '附件信息',
            open: rowTitle.attachment,
            setOpen: () =>
              setRowTitle(p => ({
                ...p,
                attachment: !p.attachment,
              })),
          })}
          <Row gutter={24}>
            {Decimal(getFieldValue('bn_ztz') || 0).gt(50)
              ? getMultipleUpload({
                  label: '可行性研究报告',
                  dataIndex: 'lxbab',
                  fileList,
                  setFileList,
                  isTurnRed,
                  setIsTurnRed,
                  display,
                })
              : getMultipleUpload({
                  label: '立项备案表',
                  dataIndex: 'lxbab',
                  fileList,
                  setFileList,
                  isTurnRed,
                  setIsTurnRed,
                  display,
                })}
            {getFileTemplate({
              label: '附件模板',
              listData: fileTpl,
              display,
            })}
          </Row>
        </Fragment>
      );
    };

    function convertFilesToBase64(fileArray, filetype) {
      return Promise.all(
        fileArray.map(file => {
          if (file.url !== undefined || file.url === '')
            //查询到的已有旧文件的情况
            return new Promise((resolve, reject) => {
              resolve({
                name: file.name,
                data: file.base64,
                filetype,
              });
            });
          return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function() {
              const base64 = reader.result.split(',')[1];
              const fileName = file.name;
              resolve({
                name: fileName,
                data: base64,
                filetype,
              });
            };

            reader.onerror = function(error) {
              reject(error);
            };

            reader.readAsDataURL(file);
          });
        }),
      );
    }

    const getValue = (value, type = 'string') => {
      if (value === '' || value === undefined || value === null) {
        return undefined;
      } else if (type === 'string') {
        return value.toString();
      } else {
        return Number(value);
      }
    };

    //保存
    const handleSave = () => {
      validateFields(async (err, values) => {
        if (fileList.length === 0) {
          setIsTurnRed(true);
          message.warn('必填项未填写完整，请检查！', 3);
        } else if (!err && !isTurnRed) {
          if (
            Decimal(values.rjtz)
              .plus(values.yjtzzje)
              .gt(values.ztz)
          ) {
            message.warn('预算信息中的软硬件总金额不能大于总投资，请修改！', 3);
          } else if (
            Decimal(values.bn_rjtz)
              .plus(values.bn_yjtzzje)
              .gt(values.bn_ztz)
          ) {
            message.warn('本年计划支付预算信息中的软硬件总金额不能大于总投资，请修改！', 3);
          } else {
            setIsSpinning(true);
            const fileInfo = await convertFilesToBase64(
              fileList.map(x => x.originFileObj || x),
              '立项备案表',
            );
            const params = {
              operateType: propsData.operateType,
              submitType: Number(propsData.submitType),
              budgetId: Number(propsData.budgetId),
              year: values.nf.year(),
              budgetName: values.nf.year() + values.ysxmmc,
              newOrCarryover: Number(values.syxzjzxm),
              budgetClassify: Number(values.yslb),
              isFirst: Number(values.sfsclx),
              lastYearBudget: Number(values.glqntlys),
              isSoftDevOrSysDock: Number(values.sfsjrjkfhxtdj),
              sysName: values.xtmc,
              budgetCategory: Number(values.xmfl),
              projectCategoryDes: String(values.xmflsm),
              projectNecessity: String(values.xmbyx),
              projectContent: String(values.xmnr),
              softBudget: String(values.rjtz),
              xcSoftBudget: String(values.qzxcrjtz),
              hwServer: String(values.yjfwq),
              hwNetworkEquipment: String(values.yjwlsb),
              hwOther: String(values.yjqt),
              hwBudget: String(values.yjtzzje),
              xcHWBudget: String(values.qzxcyjtz),
              hwBase: String(values.qzjcyjrwje),
              totalBudget: String(values.ztz),
              cloudResources: String(values.yjyzypz),
              hwStorageConfig: String(values.yjccpz),
              tySoftBudget: String(values.bn_rjtz),
              tyXCSoftBudget: String(values.bn_qzxcrjtz),
              tyHWServer: String(values.bn_yjfwq),
              tyHWNetworkEquipment: String(values.bn_yjwlsb),
              tyHWOther: String(values.bn_yjqt),
              tyHWBudget: String(values.bn_yjtzzje),
              tyXCHWBudget: String(values.bn_qzxcyjtz),
              tyHWBase: String(values.bn_qzjcyjrwje),
              tyTotalBudget: String(values.bn_ztz),
              tyCloudResources: String(values.bn_yjyzypz),
              tyHwStorageConfig: String(values.bn_yjccpz),
              fileInfo: JSON.stringify(fileInfo),
            };
            OperateCapitalBeginYearBudgetInfo(params)
              .then(res => {
                if (res.success) {
                  resetFields();
                  setRowTitle({
                    basic: true,
                    budget: true,
                    yearPlan: true,
                    attachment: true,
                  });
                  setFileList([]);
                  setIsTurnRed(false);
                  setPropsData({
                    operateType: 'ADD', //operateType
                    budgetId: -1, //UPDATE时有传
                    submitType: 1, //在外边判断好
                  });
                  setIsSpinning(false);
                  message.success('保存成功', 1);
                  history.push({
                    pathname:
                      '/pms/manage/BudgetInput/' +
                      EncryptBase64(
                        JSON.stringify({
                          refreshParams: propsData.refreshParams,
                          timeStamp: new Date().getTime(), //用于数据刷新
                        }),
                      ),
                  });
                }
              })
              .catch(e => {
                console.error('保存失败', e);
                message.error('操作失败', 1);
                setIsSpinning(false);
              });
          }
        } else {
          message.warn('必填项未填写完整，请检查！', 3);
        }
      });
    };

    //暂存
    const handleStage = () => {
      validateFields(['ysxmmc'], async err => {
        if (!err) {
          setIsSpinning(true);
          const fileInfo = await convertFilesToBase64(
            fileList.map(x => x.originFileObj || x),
            '立项备案表',
          );
          const params = {
            operateType: propsData.operateType,
            submitType: 4,
            budgetId: Number(propsData.budgetId),
            year: getFieldValue('nf')?.year(),
            budgetName: +getFieldValue('nf')?.year() + getFieldValue('ysxmmc'),
            newOrCarryover: getValue(getFieldValue('syxzjzxm'), 'number'),
            budgetClassify: getValue(getFieldValue('yslb'), 'number'),
            isFirst: getValue(getFieldValue('sfsclx'), 'number'),
            lastYearBudget: getValue(getFieldValue('glqntlys'), 'number'),
            isSoftDevOrSysDock: getValue(getFieldValue('sfsjrjkfhxtdj'), 'number'),
            sysName: getFieldValue('xtmc'),
            budgetCategory: getValue(getFieldValue('xmfl'), 'number'),
            projectCategoryDes: getValue(getFieldValue('xmflsm')),
            projectNecessity: getValue(getFieldValue('xmbyx')),
            projectContent: getValue(getFieldValue('xmnr')),
            softBudget: getValue(getFieldValue('rjtz')),
            xcSoftBudget: getValue(getFieldValue('qzxcrjtz')),
            hwServer: getValue(getFieldValue('yjfwq')),
            hwNetworkEquipment: getValue(getFieldValue('yjwlsb')),
            hwOther: getValue(getFieldValue('yjqt')),
            hwBudget: getValue(getFieldValue('yjtzzje')),
            xcHWBudget: getValue(getFieldValue('qzxcyjtz')),
            hwBase: getValue(getFieldValue('qzjcyjrwje')),
            totalBudget: getValue(getFieldValue('ztz')),
            cloudResources: getValue(getFieldValue('yjyzypz')),
            hwStorageConfig: getValue(getFieldValue('yjccpz')),
            tySoftBudget: getValue(getFieldValue('bn_rjtz')),
            tyXCSoftBudget: getValue(getFieldValue('bn_qzxcrjtz')),
            tyHWServer: getValue(getFieldValue('bn_yjfwq')),
            tyHWNetworkEquipment: getValue(getFieldValue('bn_yjwlsb')),
            tyHWOther: getValue(getFieldValue('bn_yjqt')),
            tyHWBudget: getValue(getFieldValue('bn_yjtzzje')),
            tyXCHWBudget: getValue(getFieldValue('bn_qzxcyjtz')),
            tyHWBase: getValue(getFieldValue('bn_qzjcyjrwje')),
            tyTotalBudget: getValue(getFieldValue('bn_ztz')),
            tyCloudResources: getValue(getFieldValue('bn_yjyzypz')),
            tyHwStorageConfig: getValue(getFieldValue('bn_yjccpz')),
            fileInfo: JSON.stringify(fileInfo),
          };
          OperateCapitalBeginYearBudgetInfo(params)
            .then(res => {
              if (res.success) {
                resetFields();
                setRowTitle({
                  basic: true,
                  budget: true,
                  yearPlan: true,
                  attachment: true,
                });
                setFileList([]);
                setIsTurnRed(false);
                setPropsData({
                  operateType: 'ADD', //operateType
                  budgetId: -1, //UPDATE时有传
                  submitType: 1, //在外边判断好
                });
                setIsSpinning(false);
                message.success('暂存成功', 1);
                history.push({
                  pathname:
                    '/pms/manage/BudgetInput/' +
                    EncryptBase64(
                      JSON.stringify({
                        refreshParams: propsData.refreshParams,
                        timeStamp: new Date().getTime(), //用于数据刷新
                      }),
                    ),
                });
              }
            })
            .catch(e => {
              console.error('暂存失败', e);
              message.error('暂存失败', 1);
              setIsSpinning(false);
            });
        } else {
          message.warn('预算项目名称不允许空值！', 3);
        }
      });
    };

    //退回
    const handleSendBack = () => {
      setIsSpinning(true);
      OperateCapitalBeginYearBudgetInfo({
        ...propsData.sendBackParams,
        fileInfo: '[]',
      })
        .then(res => {
          if (res.success) {
            message.success('退回成功', 1);
            setIsSpinning(false);
            history.push({
              pathname:
                '/pms/manage/BudgetInput/' +
                EncryptBase64(
                  JSON.stringify({
                    refreshParams: propsData.refreshParams,
                    timeStamp: new Date().getTime(), //用于数据刷新
                  }),
                ),
            });
          }
        })
        .catch(e => {
          console.error('退回失败', e);
          message.error('退回失败', 1);
          setIsSpinning(false);
        });
    };

    //取消-返回列表页
    const handleCancel = () => {
      resetFields();
      setRowTitle({
        basic: true,
        budget: true,
        yearPlan: true,
        attachment: true,
      });
      setFileList([]);
      setIsTurnRed(false);
      setPropsData({
        operateType: 'ADD', //operateType
        budgetId: -1, //UPDATE时有传
        submitType: 1, //在外边判断好
      });
      history.push({
        pathname: '/pms/manage/BudgetInput',
      });
    };

    return (
      <div className="budget-submit-box">
        <Spin spinning={isSpinning} tip="加载中" wrapperClassName="budget-submit-box-spin">
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
                      <Link
                        to={{
                          pathname: pathname,
                          state: {
                            routes: historyRoutes,
                          },
                        }}
                      >
                        {name}
                      </Link>
                    )}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          </div>
          <Form className="content-box">
            {getBasic()}
            {getBudget()}
            {getYearPlan()}
            {getAttachment()}
          </Form>
          <div className="opr-btn-row">
            {propsData.operateType !== 'XQ' ? (
              <Fragment>
                <Button className="btn-cancel" onClick={handleCancel}>
                  取消
                </Button>

                <Button className="btn-submit" type="primary" onClick={handleStage}>
                  暂存
                </Button>

                <Popconfirm title="是否确定保存？" onConfirm={handleSave}>
                  <Button className="btn-submit" type="primary">
                    保存
                  </Button>
                </Popconfirm>
              </Fragment>
            ) : (
              <Fragment>
                <Button className="btn-cancel" onClick={handleCancel}>
                  返回
                </Button>
                <Popconfirm title="是否确定退回？" onConfirm={handleSendBack}>
                  <Button className="btn-submit" type="primary">
                    退回
                  </Button>
                </Popconfirm>
                {propsData.isGLY && (
                  <Popconfirm title="是否确定保存？" onConfirm={handleSave}>
                    <Button className="btn-submit" type="primary">
                      保存
                    </Button>
                  </Popconfirm>
                )}
              </Fragment>
            )}
          </div>
        </Spin>
      </div>
    );
  }),
);
