import React, {useEffect, useState} from 'react';
import {Button, Table, Popover, message, Tooltip, Empty, Popconfirm} from 'antd';
import {EncryptBase64} from '../../../../Common/Encrypt';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router';
import axios from "axios";
import moment from "moment";
import config from "../../../../../utils/config";
import BridgeModel from "../../../../Common/BasicModal/BridgeModel";

const {api} = config;
const {pmsServices: {queryFileStream}} = api;


export default function InfoTable(props) {
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目详情弹窗显示
  const [xbjglrModalVisible, setXbjglrModalVisible] = useState(false); //项目详情弹窗显示
  const [lbModalUrl, setLbModalUrl] = useState(''); //项目详情弹窗显示
  const [lbModalTitle, setLbModalTitle] = useState(''); //项目详情弹窗显示
  const {tableData, tableLoading, getTableData, total, params, callBackParams, lcxxData} = props; //表格数据
  const location = useLocation();
  console.log("🚀 ~ tableData:", tableData)


  useEffect(() => {
    window.addEventListener('message', handleIframePostMessage);
    return () => {
      window.removeEventListener('message', handleIframePostMessage);
    };
  }, []);

  const openEditModel = (row) =>{
    console.log("recordrecordrecord",row)
    setLbModalTitle('询比结果编辑');
    setLbModalUrl(`/#/single/pms/PollResultInfo/${EncryptBase64(
      JSON.stringify({ record: JSON.stringify(row), type:'UPDATE' }),
    )}`);
    setXbjglrModalVisible(true);
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
        return (
          <span>{lcxxData.filter(item => item.ID == text)[0]?.BT}</span>
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
                    this.downlown(id, title, wdid)
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

  //硬件合同信息录入
  const xbjglrModalProps = {
    isAllWindow: 1,
    title: lbModalTitle,
    width: '800px',
    height: '600px',
    style: { top: '60px' },
    visible: true,
    footer: null,
  };

  return (
    <div className="info-table">
      {/* 硬件合同信息录入 */}
      {xbjglrModalVisible && (
        <BridgeModel
          isSpining="customize"
          modalProps={xbjglrModalProps}
          onCancel={() => {
            this.setState({
              xbjglrModalVisible: false,
            });
          }}
          src={lbModalUrl}
        />
      )}
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
  );
}
