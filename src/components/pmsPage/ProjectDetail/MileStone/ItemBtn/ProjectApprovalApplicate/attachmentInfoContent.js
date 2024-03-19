import React, { Fragment, useEffect, useState } from 'react';
import {
  Button, Col, Form, message, Modal, Row, Spin, Select, DatePicker, Input, InputNumber,
  Radio, Upload, Tooltip, Icon, Popconfirm, Checkbox,
} from 'antd';
import moment from 'moment';
import { QueryDocTemplate, QueryProjectFiles } from '../../../../../../services/pmsServices';
import Lodash from 'lodash'
import { handleFileStrParse } from '../../../../IntelProperty/OprModal'

/**
 * 附件信息
 * @param {*} props 
 * @returns 
 */
const AttachmentInfoContent = (props) => {

  const { componentsObj, stateObj, dataObj, form, judgeMoneyHanlde } = props

  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;

  const { isUnfold, } = stateObj



  const { userBasicInfo, dictionary, prjBasic,
    XWHmotionData, setXWHmotionData,//信委会议案
    XWHsummaryData, setXWHsummaryData,//信委会会议纪要
    ZBHmotionData, setZBHmotionData,//总办会提案
    ZBHsummaryData, setZBHsummaryData, //总办会会议纪要
    BQHYscannerData, setBQHYscannerData,//标前会议纪要扫描件
    ZBshoppingData, setZBshoppingData, //招标采购文件
    otherUplodData, setOtherUplodData, //其他附件,
    currentXmid, // 当前项目ID
  } = dataObj

  const [isXWHmotionTurnRed, setIsXWHmotionTurnRed] = useState(false) //信委会议案——校验
  const [isXWHsummaryTurnRed, setIsXWHsummaryTurnRed] = useState(false) //信委会会议纪要——校验
  const [isZBHmotionTurnRed, setIsZBHmotionTurnRed] = useState(false) //总办会提案——校验
  const [isZBHsummaryTurnRed, setIsZBHsummaryTurnRed] = useState(false) //总办会会议纪要——校验

  const [templateData, setTemplateData] = useState({
    XWHmotionTemplate: [],//信委会议案模板
    XWHsummaryTemplate: [],//信委会会议纪要模板
    ZBHmotionTemplate: [],//总办会提案模板
    ZBHsummaryTemplate: [],//总办会会议纪要模板
    ZBshoppingTemplate: [],//招标采购文件模板
  })

  const { getTitle } = componentsObj

  const labelCol = 8;
  const wrapperCol = 16;

  /** 查初始附件数据 */
  const queryInitialAttachmentHandle = async () => {
    const queryPamras = {
      paging: 1,
      queryType: 'XMWD',
      projectId: currentXmid
    }
    try {
      const res = await QueryProjectFiles(queryPamras)
      if (res.code === 1) {
        const arr = JSON.parse(res?.wdResult) || []

        console.log('1.查询项目文档————JSON解析成功', arr)

        if (!Lodash.isEmpty(arr) && arr.length !== 0) {

          console.log('2.查询项目文档————数组不为空', arr)

          arr?.forEach((item) => {

            console.log('3.查询项目文档————forEach执行成功')

            const { WDLX: fileType, WDID: fileId } = item
            switch (fileType) {
              case '信委会议案':
                handleFileStrParse(item?.WDFJ, {
                  objectName: 'TWD_XM',
                  columnName: 'DFJ',
                  id: fileId,
                }).then(parsedData => {
                  setXWHmotionData(parsedData || []);
                })
                break;
              case '信委会会议纪要':
                handleFileStrParse(item?.WDFJ, {
                  objectName: 'TWD_XM',
                  columnName: 'DFJ',
                  id: fileId,
                }).then(parsedData => {
                  setXWHsummaryData(parsedData || []);
                })
                break;
              case '总办会提案':
                handleFileStrParse(item?.WDFJ, {
                  objectName: 'TWD_XM',
                  columnName: 'DFJ',
                  id: fileId,
                }).then(parsedData => {
                  setZBHmotionData(parsedData || []);
                })
                break;
              case '总办会会议纪要':
                handleFileStrParse(item?.WDFJ, {
                  objectName: 'TWD_XM',
                  columnName: 'DFJ',
                  id: fileId,
                }).then(parsedData => {
                  setZBHsummaryData(parsedData || []);
                })
                break;
            }
          })
        }
      }
    }
    catch (err) {
      console.log('4.查询项目文档失败，错误原因是', err)
      message.error(`查询项目文档失败，${!err.success ? err.message : err.note}`, 3)
    }
  }


  /** 查附件模板 */
  const queryDocTemplateHandle = async (fileTypeName, templateName) => {
    const queryPamras = {
      // fileType:0,
      fileTypeName,
    }
    try {
      const res = await QueryDocTemplate(queryPamras)
      if (res.code === 1) {
        const data = JSON.parse(res.result);
        if (data.length > 0) {
          if (data[0].FJ && data[0].FJ.length > 0) {
            setTemplateData(p => ({ ...p, [templateName]: data[0].FJ }));
          }
        }
      }
    }
    catch (err) {
      message.error(`查附件模板失败，${!err.success ? err.message : err.note}`, 3)
    }
  }

  useEffect(() => {
    queryInitialAttachmentHandle()
    queryDocTemplateHandle('信委会议案', 'XWHmotionTemplate')
    queryDocTemplateHandle('信委会会议纪要', 'XWHsummaryTemplate')
    queryDocTemplateHandle('总办会提案', 'ZBHmotionTemplate')
    queryDocTemplateHandle('总办会会议纪要', 'ZBHsummaryTemplate')
    queryDocTemplateHandle('招标采购文件', 'ZBshoppingTemplate')
  }, [])

  /** 多附件上传 */
  const getMultipleUpload = ({ label, labelCol, wrapperCol, fileList = [],
    setFileList, isTurnRed, setIsTurnRed }) => {

    const onUploadDownload = file => {
      if (!file.url) {
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
    return (
      <Col span={12}>
        <Form.Item
          label={label}
          labelCol={{ span: labelCol }}
          wrapperCol={{ span: wrapperCol }}
          required={isTurnRed !== undefined}
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

  /** 附件模板 */
  const getFileTemplate = (label, listData = []) => {
    const handleDownload = (fileName, url) => {
      var link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    };
    return (
      <Col span={8}>
        <Form.Item label={label}>
          <div className='ProjectApprovalApplicate_templateBox'>
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
          </div>
        </Form.Item>
      </Col>
    );
  };


  return (
    <>
      {getTitle('附件', isUnfold.attachmentInfo, 'attachmentInfo')}

      {isUnfold.attachmentInfo &&
        <div>
          {judgeMoneyHanlde(500000) === true &&
            <div>
              <Row>
                {getMultipleUpload({
                  label: '信委会议案',
                  labelCol: labelCol,
                  wrapperCol: wrapperCol,
                  fileList: XWHmotionData,
                  setFileList: setXWHmotionData,
                  isTurnRed: isXWHmotionTurnRed,
                  setIsTurnRed: setIsXWHmotionTurnRed,
                })}


                {templateData.XWHmotionTemplate.length !== 0 &&
                  getFileTemplate('信委会议案模板', templateData.XWHmotionTemplate)
                }
              </Row>

              <Row>
                {getMultipleUpload({
                  label: '信委会会议纪要',
                  labelCol: labelCol,
                  wrapperCol: wrapperCol,
                  fileList: XWHsummaryData,
                  setFileList: setXWHsummaryData,
                  isTurnRed: isXWHsummaryTurnRed,
                  setIsTurnRed: setIsXWHsummaryTurnRed,
                })}

                {templateData.XWHsummaryTemplate.length !== 0 &&
                  getFileTemplate('信委会会议纪要模板', templateData.XWHsummaryTemplate)
                }
              </Row>
            </div >
          }

          {
            (
              (getFieldValue('xmlx') === 1 && judgeMoneyHanlde(4000000) === true)
              || (getFieldValue('xmlx') === 2 && judgeMoneyHanlde(2000000) === true)
              || (getFieldValue('xmlx') === 3 && judgeMoneyHanlde(1000000) === true)
            )
            && <div>
              <Row>
                {getMultipleUpload({
                  label: '总办会提案',
                  labelCol: labelCol,
                  wrapperCol: wrapperCol,
                  fileList: ZBHmotionData,
                  setFileList: setZBHmotionData,
                  isTurnRed: isZBHmotionTurnRed,
                  setIsTurnRed: setIsZBHmotionTurnRed,
                })}

                {templateData.ZBHmotionTemplate.length !== 0 &&
                  getFileTemplate('总办会提案模板', templateData.ZBHmotionTemplate)
                }
              </Row>

              <Row>
                {getMultipleUpload({
                  label: '总办会会议纪要',
                  labelCol: labelCol,
                  wrapperCol: wrapperCol,
                  fileList: ZBHsummaryData,
                  setFileList: setZBHsummaryData,
                  isTurnRed: isZBHsummaryTurnRed,
                  setIsTurnRed: setIsZBHsummaryTurnRed,
                })}

                {templateData.ZBHsummaryTemplate.length !== 0 &&
                  getFileTemplate('总办会会议纪要模板', templateData.ZBHsummaryTemplate)
                }
              </Row>
            </div>
          }

          <Row>
            {getMultipleUpload({
              label: '标前会议纪要扫描件',
              labelCol: labelCol,
              wrapperCol: wrapperCol,
              fileList: BQHYscannerData,
              setFileList: setBQHYscannerData,
              isTurnRed: undefined,
              setIsTurnRed: () => { },
            })}
          </Row>

          <Row>
            {getMultipleUpload({
              label: '招标采购文件',
              labelCol: labelCol,
              wrapperCol: wrapperCol,
              fileList: ZBshoppingData,
              setFileList: setZBshoppingData,
              isTurnRed: undefined,
              setIsTurnRed: () => { },
            })}

            {templateData.ZBshoppingTemplate.length !== 0 &&
              getFileTemplate('招标采购文件模板', templateData.ZBshoppingTemplate)
            }
          </Row>

          <Row>
            {getMultipleUpload({
              label: '其他附件',
              labelCol: labelCol,
              wrapperCol: wrapperCol,
              fileList: otherUplodData,
              setFileList: setOtherUplodData,
              isTurnRed: undefined,
              setIsTurnRed: () => { },
              showRemoveIcon: false
            })}
          </Row>

        </div >
      }
    </>
  )
}

export default AttachmentInfoContent