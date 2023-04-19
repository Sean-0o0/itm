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
  const [uploadFileParams, setUploadFileParams] = useState({}); //项目详情弹窗显示
  const [fileList, setFileList] = useState([]); //项目详情弹窗显示
  const {tableData, tableLoading, getTableData, total, params, callBackParams, lcxxData} = props; //表格数据
  const location = useLocation();
  // console.log("🚀 ~ tableData:", tableData)


  useEffect(() => {
    window.addEventListener('message', handleIframePostMessage);
    return () => {
      window.removeEventListener('message', handleIframePostMessage);
    };
  }, []);

  const openEditModel = (row) => {
    console.log("recordrecordrecord", row)
    setXbjglrModalVisible(true);
    let newFlowId = []
    if (row?.GLXQ) {
      newFlowId = row?.GLXQ.split(",");
    }
    getDocumentByLiveBos(row)
    console.log("uploadFileParams000", uploadFileParams)
    console.log("fileListfileList000", fileList)
    setPollInfo({
      //中标信息
      xmid: row?.XMID,
      name: row?.XBXM,
      flowId: newFlowId,
      // XBBG: rec?.XBBG,
      ID: row?.ID,
    })
  }

  const getDocumentByLiveBos = (rec) => {
    const {items} = JSON.parse(rec.XBBG)
    console.log("itemsitems", items)
    GetDocumentByLiveBos({
      objectName: "TXMXX_YJXBJG",
      columnName: "XBBG",
      title: items[0][1],
      entryNo: 0,
      id: rec?.ID
    }).then(res => {
      if (res) {
      }
    }).catch((res) => {
      console.log("eeeeee", res)
      if (res.success) {
        let arrTemp = [];
        if (res.documentUrl && res.documentData && items[0][1]) {
          arrTemp.push({
            uid: Date.now(),
            name: items[0][1],
            status: 'done',
            url: res.documentUrl,
          });
        }
        setUploadFileParams({
          documentData: res.documentData,
          fileName: items[0][1],
        })
        setFileList([...fileList, ...arrTemp])
      }
    });
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
    // console.log('handleTableChange', obj);
    const {current = 1, pageSize = 10} = obj;
    callBackParams({...params, current, pageSize})
  };

  const openVisible = () => {
    setFileAddVisible(true);
  };
  const closeFileAddModal = () => {
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
      width: '40%',
      key: 'XBXM',
      // ellipsis: true,
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
        let bt = ''
        const str = text.split(',')
        if (str.length > 0) {
          str.map(i => {
            bt = lcxxData.filter(item => item.ID == i)[0]?.BT + ',' + bt;
          })
        }
        return (
          <span>{bt}</span>
        );
      }
    },
    {
      title: '询比报告',
      dataIndex: 'XBBG',
      key: 'XBBG',
      width: '20%',
      // width: 100,
      // ellipsis: true,
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
      width: '10%',
      // fixed: 'right',
      ellipsis: true,
      render: (text, row, index) =>
        tableData.length >= 1 ? (
          <>
            <a onClick={() =>openEditModel(row)} style={{color: '#3361ff'}}>&nbsp;&nbsp;编辑</a>
          </>
        ) : null,
    }
  ];


  const handleCancel = () => {
    setXbjglrModalVisible(false)
  }

  const handleSavePollInfo = () => {
    if (pollInfo.name == '' || pollInfo.flowId == '' || fileList.length == 0) {
      message.warn("询比信息未填写完整！", 1);
      return;
    }
    let submitdata = {
      // projectId: pollInfo.xmid,
      projectId: 397,
      infoId: pollInfo.ID,
      name: pollInfo.name,
      flowId: String(pollInfo.flowId),
      fileInfo: [{fileName: uploadFileParams.fileName, data: uploadFileParams.documentData}],
      type: "UPDATE",
    };
    console.log('🚀submitdata', submitdata);
    UpdateInquiryComparisonInfo({
      ...submitdata,
    }).then(res => {
      if (res?.code === 1) {
        message.info('信息修改成功', 1);
        getTableData()
        setXbjglrModalVisible(false);
      } else {
        message.error('信息修改失败', 1);
      }
    });
  }

  const handleDataCallback = (params) => {
    setPollInfo({...pollInfo, ...params})
  }

  const handleFileCallback = (params) => {
    setFileList(params)
  }

  const handleParamsCallback = (params) => {
    setUploadFileParams(params)
  }

  return (
    <>
      {xbjglrModalVisible && (
        // <BridgeModel
        //   isSpining="customize"
        //   modalProps={xbjglrModalProps}
        //   onCancel={handleCancel}
        //   src={lbModalUrl}
        // />
        <Modal
          wrapClassName="editMessage-modify xbjgEditStyle"
          width={'880px'}
          maskClosable={false}
          zIndex={100}
          maskStyle={{backgroundColor: 'rgb(0 0 0 / 30%)'}}
          style={{top: '60px'}}
          visible={xbjglrModalVisible}
          okText="保存"
          onOk={handleSavePollInfo}
          onCancel={handleCancel}
          title={<span color='white'>询比结果编辑</span>}
          cancelText="取消"
        >
          <PollResultEditModel glxq={lcxxData} handleDataCallback={handleDataCallback}
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
            // scroll={{ y: 500 }}
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
