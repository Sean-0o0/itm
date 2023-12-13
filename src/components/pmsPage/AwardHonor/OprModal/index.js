import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  message,
  Modal,
  Spin,
  Input,
  Select,
  Upload,
  Col,
  TreeSelect,
  Icon,
  DatePicker,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { FetchQueryOrganizationInfo } from '../../../../services/projectManage';
import {
  FetchQueryOwnerProjectList,
  OperateAwardAndHonor,
  QueryAwardAndHonorList,
  QueryMemberInfo,
} from '../../../../services/pmsServices';
import { connect } from 'dva';
import axios from 'axios';
import config from '../../../../utils/config';
import YJKT from './YJKT';
import KJJX from './KJJX';
import KJJXSB from './KJJXSB';
import YJKTSB from './YJKTSB';
import { setParentSelectableFalse } from '../../../../utils/pmsPublicUtils';
const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;
const { TextArea } = Input;

export default connect(({ global = {} }) => ({
  userBasicInfo: global.userBasicInfo,
  dictionary: global.dictionary,
}))(
  Form.create()(function OprModal(props) {
    const {
      data = {},
      type = 'KJJX',
      setVisible,
      dictionary = {},
      userBasicInfo = {},
      form = {},
      refresh,
      isGLY,
    } = props;
    const {
      visible,
      oprType = 'ADD',
      rowData, //修改时回显
      isSB = false, //是否申报
      fromPrjDetail = false, //入口是否在项目详情
      fromHome = false, //入口是否在首页
      parentRow = {}, //申报行的父行数据{}
    } = data;
    const { KTZT = [], HJQK = [], JXJB = [] } = dictionary;
    const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
    const [isSpinning, setIsSpinning] = useState(false); //加载状态
    const [upldData, setUpldData] = useState([]); //附件数据
    const [isTurnRed, setIsTurnRed] = useState(false); //附件报红
    const [sltData, setSltData] = useState({
      contact: [],
      prjName: [],
      tableData: [],
    }); //下拉框数据
    const [upldError, setUpldError] = useState([]); //附件报红数据

    useEffect(() => {
      if (visible && rowData !== undefined) {
        setIsSpinning(true);
        handleFileStrParse(rowData?.FJ, {
          objectName: 'TXMXX_ZSCQ',
          columnName: 'FJ',
          id: rowData?.ID,
        }).then(res => {
          setUpldData(res || []);
          if (isSB) getPrjNameData();
          else setIsSpinning(false);
        });
      } else if (visible && isSB) {
        setIsSpinning(true);
        getPrjNameData();
      }
      return () => {};
    }, [visible, rowData, isSB]);

    //项目名称下拉数据
    const getPrjNameData = () => {
      FetchQueryOwnerProjectList({
        paging: -1,
        total: -1,
        sort: '',
        cxlx: isGLY ? 'ALL' : 'GR',
      })
        .then(res => {
          if (res.code === 1) {
            setSltData(p => ({
              ...p,
              prjName: [...res.record].map(x => ({ XMMC: x.xmmc, XMID: x.xmid })),
            }));
            if (isGLY) {
              getContactData();
            } else if (fromPrjDetail !== false) {
              getTableData();
            } else {
              setIsSpinning(false);
            }
          }
        })
        .catch(e => {
          console.error('FetchQueryOwnerProjectList', e);
          message.error('项目名称下拉框信息查询失败', 1);
          setIsSpinning(false);
        });
    };

    //联系人下拉数据
    const getContactData = () => {
      FetchQueryOrganizationInfo({
        type: 'FXRY',
      })
        .then(res => {
          if (res?.success) {
            //转树结构
            function toTreeData(list, label = 'title', value = 'value') {
              let map = {};
              let treeData = [];

              list.forEach(item => {
                map[item.orgId] = item;
                item[value] = item.orgId;
                item[label] = item.orgName;
                item.children = [];
              });

              // 递归遍历树，处理没有子节点的元素
              const traverse = node => {
                if (node.children && node.children.length > 0) {
                  node.children.forEach(child => {
                    traverse(child);
                  });
                } else {
                  // 删除空的 children 数组
                  delete node.children;
                }
              };

              list.forEach(item => {
                let parent = map[item.orgFid];
                if (!parent) {
                  treeData.push(item);
                } else {
                  parent.children.push(item);
                  item.orgFid = parent.orgId;
                }
              });

              // 处理没有子节点的元素
              treeData.forEach(node => {
                traverse(node);
              });

              return treeData;
            }
            let data = toTreeData(res.record)[0].children[0].children;
            QueryMemberInfo({
              type: 'XXJS',
            })
              .then(res => {
                if (res.success) {
                  let finalData = JSON.parse(JSON.stringify(data));
                  let memberArr = JSON.parse(res.record).map(x => ({
                    ...x,
                    title: x.name,
                    value: x.id,
                  }));
                  finalData.forEach(item => {
                    let parentArr = [];
                    memberArr.forEach(y => {
                      if (y.orgId === item.value) parentArr.push(y);
                    });
                    item.children = [
                      ...parentArr,
                      ...(item.children || []).filter(x => {
                        let childArr = [];
                        memberArr.forEach(y => {
                          if (y.orgId === x.value) childArr.push(y);
                        });
                        return childArr.length > 0;
                      }),
                    ];
                    if (item.value === '11168') {
                      item.children?.unshift({
                        gw: '总经理',
                        value: '1852',
                        title: '黄玉锋',
                        orgId: '11168',
                        orgName: '信息技术开发部',
                        xb: '男',
                        xh: '1',
                      });
                    }
                    item.children?.forEach(x => {
                      let childArr = [];
                      memberArr.forEach(y => {
                        if (y.orgId === x.value) childArr.push(y);
                      });
                      x.children = [
                        ...childArr,
                        ...(x.children || []).filter(m => {
                          let childArr2 = [];
                          memberArr.forEach(n => {
                            if (n.orgId === m.value) childArr2.push(n);
                          });
                          return childArr2.length > 0;
                        }),
                      ];
                    });
                  });
                  finalData = finalData.filter(item => {
                    let parentArr = [];
                    memberArr.forEach(y => {
                      if (y.orgId === item.value) parentArr.push(y);
                    });
                    return parentArr.length > 0;
                  });
                  finalData.forEach(node => setParentSelectableFalse(node));
                  setSltData(p => ({ ...p, contact: [...finalData] }));
                  if (fromPrjDetail !== false) {
                    console.log('ggg');
                    getTableData(); //来自项目详情才有下拉框
                  } else {
                    setIsSpinning(false);
                  }
                }
              })
              .catch(e => {
                message.error('联系人下拉数据查询失败', 1);
                setIsSpinning(false);
              });
          }
        })
        .catch(e => {
          console.error('🚀部门信息', e);
          message.error('部门信息获取失败', 1);
        });
    };

    //选择奖项、课题下拉数据
    const getTableData = () => {
      QueryAwardAndHonorList({
        tab: type,
        current: 1,
        pageSize: 1,
        paging: -1,
        queryType: fromPrjDetail ? 'XLK' : 'LB',
        sort: '',
        total: -1,
      })
        .then(res => {
          if (res?.success) {
            setSltData(p => ({ ...p, tableData: JSON.parse(res.result) }));
            setIsSpinning(false);
          }
        })
        .catch(e => {
          console.error('🚀表格数据', e);
          message.error('数据获取失败', 1);
          setIsSpinning(false);
        });
    };

    //处理附件数据
    const handleFileStrParse = async (fjStr = '{}', { objectName, id, columnName }) => {
      function convertBlobsToBase64(fileArray) {
        return Promise.all(
          fileArray.map((file, index) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = function() {
                const base64 = reader.result.split(',')[1];
                const fileName = file.name;
                resolve({
                  uid: Date.now() + '-' + index,
                  name: fileName,
                  status: 'done',
                  base64,
                  blob: file.blob,
                  url: '',
                });
              };
              reader.onerror = function(error) {
                reject(error);
              };
              reader.readAsDataURL(file.blob);
            });
          }),
        );
      }
      const fjObj = JSON.parse(fjStr);
      const fjPromiseArr =
        fjObj.items?.map(x =>
          axios({
            method: 'POST',
            url: queryFileStream,
            responseType: 'blob',
            data: {
              objectName,
              columnName,
              id,
              title: x[1],
              extr: x[0],
              type: '',
            },
          }),
        ) || [];
      const resArr = await Promise.all(fjPromiseArr);
      return convertBlobsToBase64(
        resArr.map(x => ({ name: JSON.parse(x?.config?.data || '{}').title, blob: x.data })),
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
      titleField,
      required = true,
    }) => {
      return (
        <Col span={12}>
          <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
            {getFieldDecorator(dataIndex, {
              initialValue,
              rules: [
                {
                  required,
                  message: label + '不允许空值',
                },
              ],
            })(
              <Select placeholder="请选择" optionFilterProp="children" showSearch allowClear>
                {sltArr.map(x => (
                  <Select.Option key={x[valueField]} value={x[valueField]}>
                    {x[titleField]}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      );
    };

    //单选树型下拉框
    const getSingleTreeSelector = ({
      label,
      dataIndex,
      initialValue,
      labelCol,
      wrapperCol,
      sltArr = [],
      treeDefaultExpandedKeys = [],
    }) => (
      <Col span={12}>
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
            <TreeSelect
              style={{ width: '100%' }}
              treeDefaultExpandedKeys={treeDefaultExpandedKeys}
              showSearch
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              dropdownClassName="newproject-treeselect"
              allowClear
              treeNodeFilterProp="title"
              showCheckedStrategy="SHOW_CHILD"
              treeData={sltArr}
            />,
          )}
        </Form.Item>
      </Col>
    );

    //输入框
    const getInput = (label, dataIndex, initialValue, labelCol, wrapperCol, maxLength) => {
      return (
        <Col span={12}>
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
              <Input
                placeholder={'请输入' + label}
                allowClear
                style={{ width: '100%' }}
                maxLength={maxLength}
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
    }) => {
      const onUploadDownload = file => {
        if (file.url === undefined || file.url === '') {
          let reader = new FileReader();
          reader.readAsDataURL(file.originFileObj || file.blob);
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
            //原来没有，则为新数据，加进去
            if (fileList.findIndex(x => x.uid === item.uid) === -1) {
              //没报错
              if (!upldError.includes(item.uid)) {
                setFileList([
                  ...fileList,
                  {
                    ...item,
                    uid: item.uid,
                    name: item.name,
                    status: item.status === 'uploading' ? 'done' : item.status,
                  },
                ]);
              }
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
      const onBeforeUpload = async file => {
        if ((await file.size) === 0) {
          setUpldError(p => [...p, file.uid]);
          message.error(`不能上传0字节文件（${file.name}）！`, 2);
        }
      };
      return (
        <Col span={12}>
          <Form.Item
            label={label}
            labelCol={{ span: labelCol }}
            wrapperCol={{ span: wrapperCol }}
            required
            help={isTurnRed ? label + '不允许空值' : ''}
            validateStatus={isTurnRed ? 'error' : 'success'}
          >
            <Upload
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
              accept={'*'}
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

    //文本域
    const getTextArea = ({ label, dataIndex, initialValue, labelCol, wrapperCol, maxLength }) => {
      return (
        <Col span={24}>
          <Form.Item
            label={label}
            labelCol={{ span: labelCol }}
            wrapperCol={{ span: wrapperCol }}
            style={{ marginTop: 6, marginBottom: 14 }}
          >
            {getFieldDecorator(dataIndex, {
              initialValue,
            })(
              <TextArea
                placeholder={'请输入' + label}
                maxLength={maxLength}
                autoSize={{ maxRows: 6, minRows: 3 }}
                allowClear
              ></TextArea>,
            )}
          </Form.Item>
        </Col>
      );
    };

    //输入框 - 灰
    const getInputDisabled = ({ label, dataIndex, initialValue, value, labelCol, wrapperCol }) => {
      return (
        <Col span={12}>
          <Form.Item
            required
            label={label}
            labelCol={{ span: labelCol }}
            wrapperCol={{ span: wrapperCol }}
          >
            {getFieldDecorator(dataIndex, {
              initialValue,
            })(
              <Tooltip title={value} placement="topLeft">
                <div
                  style={{
                    width: '100%',
                    minHeight: '32px',
                    backgroundColor: '#F5F5F5',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    marginTop: '5px',
                    lineHeight: '22px',
                    padding: '4px 10px',
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {value}
                </div>
              </Tooltip>,
            )}
          </Form.Item>
        </Col>
      );
    };

    //日期选择器
    const getDatePicker = ({ label, labelNode, dataIndex, initialValue, labelCol, wrapperCol }) => {
      return (
        <Col span={12}>
          <Form.Item
            label={labelNode ? labelNode : label}
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
            })(<DatePicker style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
      );
    };

    //提交数据
    const onOk = () => {
      validateFields(async (err, values) => {
        if (upldData.length === 0) {
          setIsTurnRed(true);
        } else if (!err && !isTurnRed) {
          setIsSpinning(true);
          function convertFilesToBase64(fileArray) {
            return Promise.all(
              fileArray.map(file => {
                if (file.url !== undefined || file.url === '')
                  //查询到的已有旧文件的情况
                  return new Promise((resolve, reject) => {
                    resolve({ name: file.name, data: file.base64 });
                  });
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();

                  reader.onload = function() {
                    const base64 = reader.result.split(',')[1];
                    const fileName = file.name;
                    resolve({ name: fileName, data: base64 });
                  };

                  reader.onerror = function(error) {
                    reject(error);
                  };

                  reader.readAsDataURL(file);
                });
              }),
            );
          }
          function getHJLX(type = 'KJJX') {
            switch (type) {
              case 'YJKT':
                return 2;
              default:
                return 1;
            }
          }
          function turnNumber(numStr) {
            if (numStr !== undefined) return Number(numStr);
            return numStr;
          }
          const fileArr = await convertFilesToBase64(upldData.map(x => x.originFileObj || x));
          const params = {
            operateType: oprType,
            awardId: isSB ? values.awardId : oprType === 'ADD' ? -1 : rowData?.ID,
            awardType: getHJLX(type),
            dataType: isSB ? 'XQ' : 'LB',
            awardName: values.name,
            honorLeve: turnNumber(values.jxjb),
            unit: values.fqdw,
            deadline: turnNumber(values.sbjzrq?.format('YYYYMMDD')),
            projectId: turnNumber(values.xmmc),
            declareProject: values.sbxm,
            contact: isGLY ? turnNumber(values.lxr) : turnNumber(userBasicInfo.id),
            illustrate: values.sbsm,
            awardStatus: turnNumber(values.hjzt),
            topicStatus: turnNumber(values.ktzt),
            awardDate: turnNumber(values.hjrq?.format('YYYYMMDD')),
            fileInfo: JSON.stringify(fileArr),
            detailId: isSB ? (oprType === 'ADD' ? -1 : rowData?.ID) : undefined,
          };
          console.log('🚀 ~ validateFields ~ params:', params);
          OperateAwardAndHonor(params)
            .then(res => {
              if (res?.success) {
                refresh(
                  data.fromPrjDetail === false && fromHome === false
                    ? {}
                    : {
                        name:
                          parentRow.JXMC ??
                          sltData?.tableData?.find(x => String(x.ID) === String(values.awardId))[
                            type === 'KJJX' ? 'JXMC' : 'KTMC'
                          ],
                        tab: type,
                        rowID: values.awardId,
                      },
                );
                message.success('操作成功', 1);
                setIsSpinning(false);
                onCancel();
              }
            })
            .catch(e => {
              console.error('🚀获奖荣誉', e);
              message.error('操作失败', 1);
              setIsSpinning(false);
            });
        }
      });
    };

    //取消
    const onCancel = () => {
      resetFields();
      setUpldData([]);
      setIsTurnRed(false);
      setVisible(false);
    };

    //弹窗参数
    const modalProps = {
      wrapClassName: 'intel-property-opr-modal',
      width: 800,
      maskClosable: false,
      style: { top: 60 },
      maskStyle: { backgroundColor: 'rgb(0 0 0 / 30%)' },
      zIndex: 103,
      destroyOnClose: true,
      title: null,
      visible,
      onCancel,
      onOk,
    };

    //弹窗标题
    const getTitle = (type, oprType, isSB) => {
      let prefix = '',
        suffix = '';
      switch (type + (isSB ? 'SB' : '')) {
        case 'YJKT':
          prefix = '研究课题';
          break;
        case 'YJKTSB':
          prefix = '研究课题申报';
          break;
        case 'KJJXSB':
          prefix = '科技奖项申报';
          break;
        default:
          prefix = '科技奖项';
          break;
      }
      switch (oprType) {
        case 'UPDATE':
          suffix = '修改';
          break;
        default:
          suffix = '新增';
          break;
      }
      return prefix + suffix;
    };

    //高度
    const getContentHeight = (type = 'KJJX', isSB) => {
      switch (type + (isSB ? 'SB' : '')) {
        case 'YJKT':
          return 213;
        case 'KJJXSB':
          return 473;
        case 'YJKTSB':
          return 473;
        default:
          return 273;
      }
    };

    //弹窗内容
    const getContent = (type, isSB) => {
      switch (type + (isSB ? 'SB' : '')) {
        case 'KJJXSB':
          return (
            <KJJXSB
              components={{
                getInput,
                getMultipleUpload,
                getDatePicker,
                getTextArea,
                getSingleSelector,
                getSingleTreeSelector,
                getInputDisabled,
              }}
              dataProps={{
                rowData,
                upldData,
                sltData,
                isTurnRed,
                HJQK,
                fromPrjDetail,
                parentRow,
                userBasicInfo,
                isGLY,
              }}
              funcProps={{ setUpldData, setIsTurnRed, getFieldValue }}
            />
          );
        case 'YJKTSB':
          return (
            <YJKTSB
              components={{
                getInput,
                getMultipleUpload,
                getDatePicker,
                getTextArea,
                getSingleSelector,
                getSingleTreeSelector,
                getInputDisabled,
              }}
              dataProps={{
                rowData,
                upldData,
                sltData,
                isTurnRed,
                KTZT,
                fromPrjDetail,
                parentRow,
                userBasicInfo,
                isGLY,
              }}
              funcProps={{ setUpldData, setIsTurnRed, getFieldValue }}
            />
          );
        case 'YJKT':
          return (
            <YJKT
              components={{
                getInput,
                getMultipleUpload,
                getDatePicker,
              }}
              dataProps={{
                rowData,
                upldData,
                isTurnRed,
              }}
              funcProps={{ setUpldData, setIsTurnRed }}
            />
          );
        default:
          return (
            <KJJX
              components={{
                getInput,
                getSingleSelector,
                getMultipleUpload,
                getDatePicker,
              }}
              dataProps={{
                rowData,
                upldData,
                isTurnRed,
                JXJB,
              }}
              funcProps={{ setUpldData, setIsTurnRed }}
            />
          );
      }
    };

    return (
      <Modal {...modalProps}>
        <div className="body-title-box">
          <strong>{getTitle(type, oprType, isSB)}</strong>
        </div>
        <Spin spinning={isSpinning} tip="加载中">
          <Form className="content-box" style={{ height: getContentHeight(type, isSB) }}>
            {getContent(type, isSB)}
          </Form>
        </Spin>
      </Modal>
    );
  }),
);
