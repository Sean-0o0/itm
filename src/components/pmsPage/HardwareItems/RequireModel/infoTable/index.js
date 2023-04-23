import React, {useEffect, useState} from 'react';
import {Button, Table, Popover, message, Tooltip} from 'antd';
import {EncryptBase64} from '../../../../Common/Encrypt';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router';

export default function InfoTable(props) {
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目详情弹窗显示
  const {tableData, tableLoading, getTableData, total, params, callBackParams,FRQData} = props; //表格数据
  const location = useLocation();
  // console.log("🚀 tableDatatableData:", tableData)

  //lb弹窗配置
  const src_fileAdd = `/#/single/pms/SaveProject/${EncryptBase64(
    JSON.stringify({xmid: -1, type: true}),
  )}`;
  const fileAddModalProps = {
    isAllWindow: 1,
    title: '新建项目',
    width: '1000px',
    height: '750px',
    style: {top: '10px'},
    visible: true,
    footer: null,
  };

  useEffect(() => {
    window.addEventListener('message', handleIframePostMessage);
    return () => {
      window.removeEventListener('message', handleIframePostMessage);
    };
  }, []);

  //监听新建项目弹窗状态-按钮
  const handleIframePostMessage = event => {
    if (typeof event.data !== 'string' && event.data.operate === 'close') {
      closeFileAddModal();
    }
    if (typeof event.data !== 'string' && event.data.operate === 'success') {
      closeFileAddModal();
      // message.success('保存成功');
    }
  };

  //获取项目标签数据
  const getTagData = (tag, idtxt) => {
    // console.log("🚀 ~ file: index.js:52 ~ getTagData ~ tag, idtxt:", tag, idtxt)
    let arr = [];
    let arr2 = [];
    if (
      tag !== '' &&
      tag !== null &&
      tag !== undefined &&
      idtxt !== '' &&
      idtxt !== null &&
      idtxt !== undefined
    ) {
      if (tag.includes(',')) {
        arr = tag.split(',');
        arr2 = idtxt.split(',');
      } else {
        arr.push(tag);
        arr2.push(idtxt);
      }
    }
    let arr3 = arr.map((x, i) => {
      return {
        name: x,
        id: arr2[i],
      };
    });
    // console.log('🚀 ~ file: index.js ~ line 73 ~ arr3 ~ arr3 ', arr3, arr, arr2);
    return arr3;
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

  //列配置
  const columns = [
    {
      title: '需求',
      dataIndex: 'XQ',
      // width: 200,
      width: '20%',
      key: 'XQ',
      // ellipsis: true,
    },
    {
      title: '发起人',
      dataIndex: 'FQR',
      // width: 200,
      width: '10%',
      key: 'FQR',
      // ellipsis: true,
      render: (text, row, index) => {
        return (
          <span>{FRQData?.filter(item =>item.FQR == text)[0]?.NAME}</span>
        )
      }
    },
    {
      title: '发起日期',
      dataIndex: 'projectName',
      // width: 200,
      width: '10%',
      key: 'projectName',
      // ellipsis: true,
    },
    {
      title: '请示报告内容',
      dataIndex: 'QSBGNR',
      // width: 200,
      width: '10%',
      key: 'YHTBT',
      // ellipsis: true,
    },
    {
      title: '关联系统设备采购合同流程',
      dataIndex: 'YHTBT',
      // width: 205,
      width: '30%',
      key: 'YHTBT',
      // ellipsis: true,
    },
    {
      //0|未发起，1|已发起
      title: '状态',
      dataIndex: 'ZT',
      key: 'ZT',
      width: '10%',
      // width: 100,
      // ellipsis: true,
      render: (text, row, index) => {
        return (
          text == '0' ? <span>未发起</span> : <span>已发起</span>
        )
      }
    },
  ];

  return (
    <div className="info-table">
      <div className="project-info-table-box">
        <Table
          loading={tableLoading}
          columns={columns}
          rowKey={'XQID'}
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
