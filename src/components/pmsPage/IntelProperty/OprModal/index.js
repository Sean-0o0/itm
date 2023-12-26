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
  Tooltip,
  DatePicker,
} from 'antd';
import moment from 'moment';
import RJZZ from './RJZZ';
import { FetchQueryOrganizationInfo, } from '../../../../services/projectManage';
import {
  EditIPRInfo,
  FetchQueryOwnerProjectList,
  QueryMemberInfo,
  QueryDocTemplate
} from '../../../../services/pmsServices';
import { connect } from 'dva';
import FMZL from './FMZL';
import HYBZ from './HYBZ';
import QYBZ from './QYBZ';
import axios from 'axios';
import config from '../../../../utils/config';
import { setParentSelectableFalse } from '../../../../utils/pmsPublicUtils';
const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;


export default connect(({ global = {} }) => ({
  userBasicInfo: global.userBasicInfo,
  dictionary: global.dictionary,
}))(
  Form.create()(function OprModal(props) {
    const {
      visible,
      setVisible,
      oprType = 'ADD',
      rowData, //修改时回显
      type = 'RJZZ',
      dictionary = {},
      userBasicInfo = {},
      form = {},
      refresh,
      fromPrjDetail = false,
      isGLY,
    } = props;
    const {
      FMZLDQZT = [],
      ZSCQDQZT = [],
      QYBZDQZT = [],
      ZLLX = [],
      CYXZ = [],
      HYBZLX = [],
    } = dictionary;
    const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
    const [isSpinning, setIsSpinning] = useState(false); //加载状态
    const [upldData, setUpldData] = useState([]); //附件数据
    const [isTurnRed, setIsTurnRed] = useState(false); //附件报红
    const [sltData, setSltData] = useState({
      contact: [],
      prjName: [],
    }); //下拉框数据
    const [upldError, setUpldError] = useState([]); //附件报红数据

    /** 模板数据 */
    const [docTemplateList, setDocTemplateList] = useState([])

    useEffect(() => {
      if (visible) {
        if (rowData !== undefined) {
          setIsSpinning(true);
          handleFileStrParse(rowData?.FJ, {
            objectName: 'TXMXX_ZSCQ',
            columnName: 'FJ',
            id: rowData?.ID,
          }).then(res => {
            setUpldData(res || []);
            getPrjNameData();
          });
        } else {
          setIsSpinning(true);
          getPrjNameData();
        }
      }
      return () => { };
    }, [visible, rowData]);

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
            getContactData();
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
                  setIsSpinning(false);
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

    //处理附件数据
    const handleFileStrParse = async (fjStr = '{}', { objectName, id, columnName }) => {
      function convertBlobsToBase64(fileArray) {
        return Promise.all(
          fileArray.map((file, index) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = function () {
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
              reader.onerror = function (error) {
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


    /** 下载申报材料示例 */
    const QueryDocTemplateHandle = async () => {
      setIsSpinning(true);
      const res = await QueryDocTemplate({
        fileType: 0,
        fileTypeName: type === 'RJZZ' ? '软件著作权申报材料示例' : '发明专利申报材料示例'
      })
      if (res.code === 1) {
        const obj = JSON.parse(res.result)
        const { FJ: fileList } = obj[0]
        setDocTemplateList(fileList)
      }
      setIsSpinning(false);
    }

    useEffect(() => {
      QueryDocTemplateHandle().catch((err) => {
        message.error(`查询文档示例失败${err}`, 2)
        setIsSpinning(false);
      })
    }, [type])

    const downloadHandle = (url) => {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none"; // 不可见
      iframe.style.height = "0"; // 高度为0
      iframe.src = url; // 下载地址
      document.body.appendChild(iframe); // 必须有，iframe挂在到dom树触发请求
    }

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
    const getInput = (
      label,
      dataIndex,
      initialValue,
      labelCol,
      wrapperCol,
      maxLength,
      disabled,
      colSpan,
      inputWidth,
      inputHeight
    ) => {
      return (
        <Col span={colSpan ?? 12}>
          <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
            {getFieldDecorator(dataIndex, {
              initialValue,
              rules: [
                {
                  required: disabled ? false : true,
                  message: label + '不允许空值',
                },
              ],
            })(
              <Input
                placeholder={disabled ? '待定' : '请输入' + label}
                allowClear
                style={{ width: `${inputWidth ?? 100}%`, height: `${inputHeight ?? ''}px` }}
                maxLength={maxLength}
                disabled={disabled}
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
    const getDatePicker = (label, dataIndex, initialValue, labelCol, wrapperCol) => {
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
            })(<DatePicker style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
      );
    };

    /** 灰色背景div文字 */
    const getGrayDiv = (colSpan, formLabel, labelCol, wrapperCol, content, isLabelWrap) => {
      return (
        <Col span={colSpan} className={isLabelWrap ? 'GrayDivBox_LabelWrap' : ''}>
          <Form.Item
            labelAlign='right'
            label={formLabel}
            labelCol={{ span: labelCol }}
            wrapperCol={{ span: wrapperCol }}
          >
            <div
              style={{
                width: '100%', minHeight: 32, marginTop: 5, lineHeight: '22px', padding: '4px 10px',
                backgroundColor: 'rgb(245, 245, 245)', border: '1px solid rgb(217, 217, 217)',
                borderRadius: 4, fontSize: 14
              }}>
              {content}
            </div>
          </Form.Item>
        </Col>
      );
    };

    //自定义下载框
    const getDownloadBox = (
      colSpan,
      label,
      labelCol,
      wrapperCol,
      boxMarginLeft
    ) => {
      return (
        <div className='intelProperty_getDownload' style={{ marginLeft: boxMarginLeft ? boxMarginLeft : '' }}>
          <Col span={colSpan}>
            <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
              <div className='intelProperty_getDownloadBox'>
                {docTemplateList.length !== 0 &&
                  docTemplateList.map((item) => {
                    return (
                      <div className='getDownloadBoxitem' >
                        <div className='leftBox'>
                          <img className='leftBox_wordIcon' src={require('../../../../assets/show/wordIcon.png')}></img>
                        </div>

                        <div className='rightBox'>
                          <a className='rightBox_content' href={item.url} title={item.fileName} download>{item.fileName}</a>
                          <Icon className='rightBox_btn' type="download" onClick={() => {
                            downloadHandle(item.url)
                          }} />
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </Form.Item>
          </Col>
        </div >
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

                  reader.onload = function () {
                    const base64 = reader.result.split(',')[1];
                    const fileName = file.name;
                    resolve({ name: fileName, data: base64 });
                  };

                  reader.onerror = function (error) {
                    reject(error);
                  };

                  reader.readAsDataURL(file);
                });
              }),
            );
          }
          function getCQLX(type = 'RJZZ') {
            switch (type) {
              case 'FMZL':
                return 2;
              case 'HYBZ':
                return 3;
              case 'QYBZ':
                return 4;
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
            id: oprType === 'ADD' ? -1 : rowData?.ID,
            name: values.name,
            type: getCQLX(type),
            projectId: turnNumber(values.xmmc),
            version: values.bbh,
            file: JSON.stringify(fileArr),
            contact: isGLY ? turnNumber(values.lxr) : turnNumber(userBasicInfo.id),
            state: turnNumber(values.dqzt),
            certificateNo: values.zsh,
            patentType: turnNumber(values.zllx),
            participateType: turnNumber(values.cyxz),
            checkInDate: turnNumber(values.djsj?.format('YYYYMMDD')),
            standardType: turnNumber(values.bzlx),
            operateType: oprType,
          };
          EditIPRInfo(params)
            .then(res => {
              if (res?.success) {
                refresh({ name: values.name, tab: type });
                message.success('操作成功', 1);
                setIsSpinning(false);
                onCancel();
              }
            })
            .catch(e => {
              console.error('🚀知识产权', e);
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
    const getTitle = (type, oprType) => {
      let prefix = '',
        suffix = '';
      switch (type) {
        case 'FMZL':
          prefix = '发明专利';
          break;
        case 'HYBZ':
          prefix = '行业标准';
          break;
        case 'QYBZ':
          prefix = '企业标准';
          break;
        case 'RJZZ':
          prefix = '软件著作权';
          break;
        default:
          prefix = '软件著作权';
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

    //弹窗内容
    const getContent = (type, oprType) => {
      switch (type) {
        case 'FMZL':
          return (
            <FMZL
              components={{
                getInput,
                getSingleSelector,
                getMultipleUpload,
                getSingleTreeSelector,
                getInputDisabled,
                getDatePicker,
                getDownloadBox,
                getGrayDiv
              }}
              dataProps={{
                rowData,
                upldData,
                isTurnRed,
                sltData,
                userBasicInfo,
                DQZT: FMZLDQZT,
                ZLLX,
                fromPrjDetail,
                isGLY,
              }}
              funcProps={{ setUpldData, setIsTurnRed, getFieldValue }}
              dictionary={dictionary}
            />
          );
        case 'HYBZ':
          return (
            <HYBZ
              components={{
                getInput,
                getSingleSelector,
                getMultipleUpload,
                getSingleTreeSelector,
                getInputDisabled,
                getDatePicker,
              }}
              dataProps={{
                rowData,
                upldData,
                isTurnRed,
                sltData,
                userBasicInfo,
                DQZT: ZSCQDQZT,
                CYXZ,
                fromPrjDetail,
                isGLY,
                HYBZLX,
              }}
              funcProps={{ setUpldData, setIsTurnRed, getFieldValue }}
            />
          );
        case 'QYBZ':
          return (
            <QYBZ
              components={{
                getInput,
                getSingleSelector,
                getMultipleUpload,
                getSingleTreeSelector,
                getInputDisabled,
                getDatePicker,
              }}
              dataProps={{
                rowData,
                upldData,
                isTurnRed,
                sltData,
                userBasicInfo,
                DQZT: QYBZDQZT,
                fromPrjDetail,
                isGLY,
              }}
              funcProps={{ setUpldData, setIsTurnRed, getFieldValue }}
            />
          );
        default:
          return (
            <RJZZ
              components={{
                getInput,
                getSingleSelector,
                getMultipleUpload,
                getSingleTreeSelector,
                getInputDisabled,
                getDatePicker,
                getDownloadBox,
                getGrayDiv
              }}
              dataProps={{
                rowData,
                upldData,
                isTurnRed,
                sltData,
                userBasicInfo,
                DQZT: ZSCQDQZT,
                fromPrjDetail,
                isGLY,
              }}
              funcProps={{ setUpldData, setIsTurnRed, getFieldValue }}
              dictionary={dictionary}
            />
          );
      }
    };

    return (
      <Modal {...modalProps}>
        <div className="body-title-box">
          <strong>{getTitle(type, oprType)}</strong>
        </div>
        <Spin spinning={isSpinning} tip="加载中">
          <Form className="content-box" style={type === 'QYBZ' ? { height: 260 }
            : type === 'RJZZ' ? { height: 450 }
              : type === 'FMZL' ? { height: 450 } : {}}>
            {getContent(type)}
          </Form>
        </Spin>
      </Modal>
    );
  }),
);
