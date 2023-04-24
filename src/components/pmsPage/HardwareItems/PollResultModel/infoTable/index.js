import React, {useEffect, useState} from 'react';
import {Button, Table, Popover, message, Tooltip, Empty, Popconfirm, Modal, Divider} from 'antd';
import {EncryptBase64} from '../../../../Common/Encrypt';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router';
import axios from "axios";
import moment from "moment";
import config from "../../../../../utils/config";
import BridgeModel from "../../../../Common/BasicModal/BridgeModel";
import PollResultEnterModel from "../../PollResultEnterModel";
import PollResultEditModel from "../../PollResultEditModel";
import {
  FetchQueryInquiryComparisonInfo,
  GetDocumentByLiveBos,
  UpdateInquiryComparisonInfo
} from "../../../../../services/projectManage";

const {api} = config;
const {pmsServices: {queryFileStream}} = api;


export default function InfoTable(props) {
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目详情弹窗显示
  const [xbjglrModalVisible, setXbjglrModalVisible] = useState(false); //项目详情弹窗显示
  const [pollInfo, setPollInfo] = useState({}); //项目详情弹窗显示
  const [uploadFileParams, setUploadFileParams] = useState([]); //项目详情弹窗显示
  const [fileList, setFileList] = useState([]); //项目详情弹窗显示
  const [isSpinning, setIsSpinning] = useState(false); //项目详情弹窗显示
  const {tableData, tableLoading, getTableData, total, params, callBackParams, lcxxData} = props; //表格数据
  const location = useLocation();
  console.log("🚀 ~ tableData:", tableData)


  useEffect(() => {
    window.addEventListener('message', handleIframePostMessage);
    return () => {
      window.removeEventListener('message', handleIframePostMessage);
    };
  }, []);

  const getUuid = () => {
    var s = []
    var hexDigits = '0123456789abcdef'
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'

    let uuid = s.join('')
    return uuid
  }

  const handleSingleDelete = (row) => {
    console.log("rowrowrow", row)
    setIsSpinning(true)
    let submitdata = {
      projectId: row?.XMID,
      // projectId: 397,
      infoId: row?.ID,
      name: row?.XBXM,
      flowId: String(row.GLXQ),
      fileInfo: [],
      type: "DELETE",
    };
    console.log('🚀submitdata', submitdata);
    UpdateInquiryComparisonInfo({
      ...submitdata,
    }).then(res => {
      if (res?.code === 1) {
        message.info('信息修改成功', 1);
        getTableData()
        setIsSpinning(false)
      } else {
        message.error('信息修改失败', 1);
      }
    });
  }

  const openEditModel = (row) => {
    console.log("recordrecordrecord", row)
    setXbjglrModalVisible(true);
    let newFlowId = []
    if (row?.GLXQ) {
      newFlowId = row?.GLXQ.split(",");
    }
    // getDocumentByLiveBos(row)
    console.log("uploadFileParams000", uploadFileParams)
    console.log("fileListfileList000", fileList)
    let arrTemp = [];
    let arrTemp2 = [];
    if (row.FileInfo.length > 0) {
      row.FileInfo.map(item => {
        arrTemp.push({
          uid: getUuid(),
          name: item.fileName,
          status: 'done',
          url: item.url,
          base64: item.data,
        });
        arrTemp2.push({
          base64: item.data,
          name: item.fileName,
        })
      })
      setFileList([...fileList, ...arrTemp])
      setUploadFileParams([...uploadFileParams, ...arrTemp2])
    }
    setPollInfo({
      //中标信息
      xmid: row?.XMID,
      name: row?.XBXM,
      flowId: newFlowId,
      // XBBG: rec?.XBBG,
      ID: row?.ID,
    })
  }

  //监听新建项目弹窗状态-按钮
  const handleIframePostMessage = event => {
    if (typeof event.data !== 'string' && event.data.operate === 'close') {
      closeFileAddModal();
    }
    if (typeof event.data !== 'string' && event.data.operate === 'success') {
      closeFileAddModal();
    }
  };

  //表格操作后更新数据
  const handleTableChange = obj => {
    console.log('handleTableChange', obj);
    const {current = 1, pageSize = 10} = obj;
    callBackParams({...params, current, pageSize})
  };

  const openVisible = () => {
    setFileAddVisible(true);
  };
  const closeFileAddModal = () => {
    setFileList([]);
    setFileAddVisible(false);
  };

  const downlown = (id, title, wdid) => {
    axios({
      method: 'POST',
      url: queryFileStream,
      responseType: 'blob',
      data: {
        objectName: 'TXMXX_YJXBJG',
        columnName: 'XBBG',
        id: wdid,
        title: title,
        extr: id
      }
    }).then(res => {
      const href = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.download = title
      a.href = href
      a.click()
    }).catch(err => {
      message.error(err)
    })
  }

  const downlownRow = (items = [], wdid) => {
    items.forEach(element => {
      const [id, title] = element;
      axios({
        method: 'post',
        url: queryFileStream,
        responseType: 'blob',
        data: {
          objectName: 'TXMXX_YJXBJG',
          columnName: 'XBBG',
          id: wdid,
          title: title,
          extr: id
        }
      }).then(res => {
        const href = URL.createObjectURL(res.data)
        const a = document.createElement('a')
        a.download = title
        a.href = href
        a.click()
      }).catch(err => {
        message.error(err)
      })
    });
  }


  //列配置
  const columns = [
    {
      title: '询比项目名称',
      dataIndex: 'XBXM',
      // width: 200,
      width: '20%',
      key: 'XBXM',
      // ellipsis: true,
      render: (text, record) => {
        if (text.length > 20) {
          return <Tooltip title={text}>
            <span>{text.slice(0, 20) + '...'}</span>
          </Tooltip>
        } else {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '关联需求',
      dataIndex: 'GLXQ',
      // width: 205,
      width: '40%',
      key: 'GLXQ',
      // ellipsis: true,
      render: (text, row, index) => {
        // console.log("texttext", text)
        let bt = []
        const str = text.split(',')
        if (str.length > 0) {
          str.map(i => {
            bt.push(lcxxData.filter(item => item.ID == i)[0]?.BT);
          })
        }
        return <div className="prj-tags">
          {bt.length !== 0 && (
            <>
              {bt?.slice(0, 4)
                .map((x, i) => (
                  <div key={i} className="tag-item">
                    {x}
                  </div>
                ))}
              {bt?.length > 4 && (
                <Popover
                  overlayClassName="tag-more-popover"
                  content={
                    <div className="tag-more">
                      {bt?.slice(4)
                        .map((x, i) => (
                          <div key={i} className="tag-item">
                            {x}
                          </div>
                        ))}
                    </div>
                  }
                  title={null}
                >
                  <div className="tag-item">...</div>
                </Popover>
              )}
            </>
          )}
        </div>

        // return (
        //   <span>{bt}</span>
        // );
      }
    },
    {
      title: '询比报告',
      dataIndex: 'XBBG',
      key: 'XBBG',
      width: '20%',
      // width: 100,
      ellipsis: true,
      render: (text, record) => {
        if (text) {
          const {wdid = ''} = record;
          const wdmc = JSON.parse(text)
          const {items = []} = wdmc;
          let content = <div className='fj-box'>
            <div className='fj-header'>
              <div className='fj-title flex1'>附件</div>
              <div className='fj-header-btn' onClick={() => downlownRow(items, wdid)}>全部下载</div>
            </div>
            {items.length ?
              <div
                style={{height: 'auto', width: 320}}
              >
                {items.map((item, index) => {
                  const [id, title] = item;
                  return <div className='fj-item flex-r'>
                    <div className='fj-title flex1'><i className='iconfont icon-file-word'/>&nbsp;{title}</div>
                    <div className='fj-btn' onClick={() => downlown(id, title, wdid)}><i
                      className='iconfont icon-download'/></div>
                  </div>
                })
                }
              </div> :
              <div className='empty-box'><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无风险信息"/></div>

            }
          </div>
          return <Popover placement="bottomLeft" overlayClassName="main-tooltip" content={content}>
            <div className='opr-btn-box'>
              {
                items.map((item, index) => {
                  const [id, title] = item;
                  return <a key={id} className='opr-btn' onClick={() => {
                    downlown(id, title, wdid)
                  }}>{title};&nbsp;</a>
                })
              }
            </div>
          </Popover>
        } else {
          return ''
        }
      }
    },
    {
      title: <span style={{color: '#606266', fontWeight: 500}}>操作</span>,
      dataIndex: 'operator',
      key: 'operator',
      width: '12%',
      // fixed: 'right',
      ellipsis: true,
      render: (text, row, index) =>
        tableData.length >= 1 ? (
          <>
            <a onClick={() => openEditModel(row)} style={{color: '#3361ff'}}>编辑</a>
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => handleSingleDelete(row)}
            >
              <a style={{color: '#3361ff'}}>&nbsp;&nbsp;删除</a>
            </Popconfirm>
          </>
        ) : null,
    }
  ];


  const handleCancel = () => {
    setFileList([]);
    setXbjglrModalVisible(false)
  }

  const handleSavePollInfo = () => {
    if (pollInfo.name == '' || pollInfo.flowId == '' || fileList.length == 0) {
      message.warn("询比信息未填写完整！", 3);
      return;
    }
    setIsSpinning(true)
    let fileInfo = [];
    console.log('uploadFileParams', uploadFileParams);
    uploadFileParams.map(item => {
      fileInfo.push({fileName: item.name, data: item.base64})
    })
    let submitdata = {
      projectId: pollInfo.xmid,
      // projectId: 397,
      infoId: pollInfo.ID,
      name: pollInfo.name,
      flowId: String(pollInfo.flowId),
      fileInfo: [...fileInfo],
      type: "UPDATE",
    };
    console.log('🚀submitdata', submitdata);
    UpdateInquiryComparisonInfo({
      ...submitdata,
    }).then(res => {
      if (res?.code === 1) {
        message.info('信息修改成功', 3);
        getTableData()
        setIsSpinning(false)
        setXbjglrModalVisible(false);
      } else {
        message.error('信息修改失败', 3);
      }
      setFileList([]);
    });
  }

  const handleDataCallback = (params) => {
    setIsSpinning(true)
    setPollInfo({...pollInfo, ...params})
    setIsSpinning(false)
  }

  const handleFileCallback = (params) => {
    setIsSpinning(true)
    setFileList(params)
    setIsSpinning(false)
  }

  const handleParamsCallback = (params) => {
    setIsSpinning(true)
    setUploadFileParams(params)
    setIsSpinning(false)
  }

  return (
    <>
      {xbjglrModalVisible && (
        <Modal
          wrapClassName="editMessage-modify xbjgEditStyle"
          width={'760px'}
          maskClosable={false}
          zIndex={100}
          maskStyle={{backgroundColor: 'rgb(0 0 0 / 30%)'}}
          style={{top: '60px'}}
          visible={xbjglrModalVisible}
          okText="保存"
          // onOk={handleSavePollInfo}
          onCancel={handleCancel}
          title={<div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#3361FF',
              color: 'white',
              borderRadius: '8px 8px 0 0',
              fontSize: '16px',
            }}
          >
            <strong>询比结果编辑</strong>
          </div>}
          cancelText="取消"
          footer={<div className="modal-footer">
            <Button className="btn-default" onClick={handleCancel}>
              取消
            </Button>
            {/* <Button className="btn-primary" type="primary" onClick={() => handleSubmit('save')}>
        暂存草稿
      </Button> */}
            <Button disabled={isSpinning} className="btn-primary" type="primary" onClick={handleSavePollInfo}>
              确定
            </Button>
          </div>}
        >
          <PollResultEditModel isSpinning={isSpinning} glxq={lcxxData} handleDataCallback={handleDataCallback}
                               handleFileCallback={handleFileCallback} handleParamsCallback={handleParamsCallback}
                               pollInfo={pollInfo} uploadFileParams={uploadFileParams} fileList={fileList}
                               handleSavePollInfo={handleSavePollInfo}/>
        </Modal>
      )}
      <div className="info-table">
        {/* 硬件合同信息录入 */}
        <div className="project-info-table-box">
          <Table
            loading={tableLoading}
            columns={columns}
            rowKey={'projectId'}
            dataSource={tableData}
            onChange={handleTableChange}
            scroll={{y: 405}}
            pagination={{
              pageSizeOptions: ['10', '20', '30', '40'],
              showSizeChanger: true,
              hideOnSinglePage: false,
              showQuickJumper: true,
              showTotal: t => `共 ${total} 条数据`,
              total: total,
            }}
            // bordered
          />
        </div>
      </div>
    </>
  );
}
