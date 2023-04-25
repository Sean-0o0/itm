import React, {useEffect, useState} from 'react';
import {Button, Table, Popover, message, Tooltip} from 'antd';
import {EncryptBase64} from '../../../../Common/Encrypt';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router';
import BasicIndexTable from "../../../../Common/BasicIndexTable";
import moment from "moment";

export default function InfoTable(props) {
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目详情弹窗显示
  const {tableData, tableLoading, total, params, callBackParams} = props; //表格数据
  const location = useLocation();
  // console.log("🚀 tableDatatableData:", tableData)

  //lb弹窗配置
  const src_fileAdd = `/#/single/pms/SaveProject/${EncryptBase64(
    JSON.stringify({xmid: -1, type: true}),
  )}`;

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

  //表格跨行合并
  const getRowSpanCount = (data, key, target, bool = false) => {
    //当合并项为可编辑时，最后传true
    if (!Array.isArray(data)) return 1;
    data = data.map(_ => _[key]); // 只取出筛选项
    let preValue = data[0];
    const res = [[preValue]]; // 放进二维数组里
    let index = 0; // 二维数组下标
    for (let i = 1; i < data.length; i++) {
      if (data[i] === preValue) {
        // 相同放进二维数组
        res[index].push(data[i]);
      } else {
        // 不相同二维数组下标后移
        index += 1;
        res[index] = [];
        res[index].push(data[i]);
        preValue = data[i];
      }
    }
    const arr = [];
    res.forEach(_ => {
      const len = _.length;
      for (let i = 0; i < len; i++) {
        arr.push(i === 0 ? len : 0);
      }
    });
    return arr[target];
  };

  //表格跨行合并总计数值计算
  const getRowNumCount = (data, key, target, bool = false) => {
    //当合并项为可编辑时，最后传true
    if (!Array.isArray(data)) return 1;
    console.log("datadatadata", data)
    data = data.map(_ => _[key + (bool ? _.id : '')]); // 只取出筛选项
    console.log("datadatadata22222", data)
    let preValue = data[0];
    const res = [[preValue]]; // 放进二维数组里
    let index = 0; // 二维数组下标
    for (let i = 1; i < data.length; i++) {
      if (data[i] === preValue) {
        // 相同放进二维数组
        res[index].push(data[i]);
      } else {
        // 不相同二维数组下标后移
        index += 1;
        res[index] = [];
        res[index].push(data[i]);
        preValue = data[i];
      }
    }
    const arr = [];
    console.log("resresresres", res)
    const totalarr = [];
    let num = [];
    res.forEach(_ => {
      const len = _.length;
      for (let i = 0; i < len; i++) {
        num = tableData.filter(item => item.BJID === _[i])
        arr.push(i === 0 ? len : 0);
      }
      console.log("numnum", num)
      console.log("arr", arr)
      let total = 0;
      num.map(item => {
        total = item.XMJE + total;
      })
      for (let i = 0; i < len; i++) {
        totalarr.push(i === 0 ? total : 0);
      }
      console.log("totalarr", totalarr)
    });
    return totalarr[target];
  };


  //列配置
  const columns = [
    {
      title: '包件名称',
      dataIndex: 'BJMC',
      // width: 200,
      width: '22.5%',
      key: 'BJMC',
      // ellipsis: true,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = getRowSpanCount(tableData, 'BJID', index);
        return obj;
      },
    },
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      // width: 200,
      width: '22.5%',
      key: 'XMMC',
      // ellipsis: true,
    },
    {
      title: '金额(元)',
      dataIndex: 'XMJE',
      // width: 200,
      width: '10%',
      key: 'XMJE',
    },
    {
      title: '标段合计金额(元)',
      dataIndex: 'BDHJJE',
      // width: 200,
      width: '12.5%',
      key: 'BDHJJE',
      render: (value, row, index) => {
        const obj = {
          props: {},
        };
        obj.props.rowSpan = getRowSpanCount(tableData, 'BJID', index);
        obj.children = getRowNumCount(tableData, 'BJID', index);
        return obj;
      },
    },
    {
      title: '单项占比',
      dataIndex: 'DXZB',
      // width: 205,
      width: '10%',
      key: 'DXZB',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = getRowSpanCount(tableData, 'BJID', index);
        return obj;
      },
    },
    {
      //0|未发起，1|已发起
      title: '备注',
      dataIndex: 'BZ',
      key: 'BZ',
      width: '22.5%',
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
      {/*<div className="project-info-table-box">*/}
      <div style={{display: 'flex', padding: '12px 24px'}}>
        <div style={{width: '50%', textAlign: 'left', color: '#303133', fontSize: '14px'}}>总类占比：49%</div>
        <div style={{
          width: '50%',
          textAlign: 'right',
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: '14px'
        }}>更新时间：{moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}</div>
      </div>
      <div className="table-content">
        <Table
          loading={tableLoading}
          columns={columns}
          rowKey={'BJID'}
          dataSource={tableData}
          onChange={handleTableChange}
          scroll={{y: 407}}
          pagination={{
            pageSizeOptions: ['10', '20', '30', '40'],
            showSizeChanger: true,
            hideOnSinglePage: false,
            showQuickJumper: true,
            showTotal: t => `共 ${total} 条数据`,
            total: total,
          }}
          bordered
        />
      </div>
      {/*</div>*/}
    </div>
  );
}
