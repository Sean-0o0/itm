import React, {useEffect, useState} from 'react';
import {Table} from 'antd';

export default function OtherInfo() {
  const [tableData1, setTableData1] = useState([]); //表格数据 - 获奖信息
  const [tableData2, setTableData2] = useState([]); //表格数据 - 课题信息
  const [isUnfold, setIsUnfold] = useState(false); //其他投标供应商信息是否展开，展开 true

  useEffect(() => {
    setTableData1(p => [...[{
      hjmc: '需求需求需求需求需求需求需求需求需求需求需求需求',
      rydj: '需求需求需求需求需求需求需求需求需求需求需求需求',
      zscqlx: '需求需求需求需求需求需求需求需求需求需求需求需求',
      hjsj: '2023-02-02xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    }, {
      hjmc: '需求需求需求需求需求需求需求需求需求需求需求需求',
      rydj: '需求需求需求需求需求需求需求需求需求需求需求需求',
      zscqlx: '需求需求需求需求需求需求需求需求需求需求需求需求',
      hjsj: '2023-02-02xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    },
      {
        hjmc: '需求需求需求需求需求需求需求需求需求需求需求需求',
        rydj: '需求需求需求需求需求需求需求需求需求需求需求需求',
        zscqlx: '需求需求需求需求需求需求需求需求需求需求需求需求',
        hjsj: '2023-02-02xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      },]]);
    setTableData2(p => [...[{
      xmkt: '需求需求需求需求需求需求需求需求需求需求需求需求',
      jd: '需求需求需求需求需求需求需求需求需求需求需求需求',
      jj: '需求需求需求需求需求需求需求需求需求需求需求需求',
      dqjz: '2023-02-02xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    }, {
      xmkt: '需求需求需求需求需求需求需求需求需求需求需求需求',
      jd: '需求需求需求需求需求需求需求需求需求需求需求需求',
      jj: '需求需求需求需求需求需求需求需求需求需求需求需求',
      dqjz: '2023-02-02xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    },
      {
        xmkt: '需求需求需求需求需求需求需求需求需求需求需求需求',
        jd: '需求需求需求需求需求需求需求需求需求需求需求需求',
        jj: '需求需求需求需求需求需求需求需求需求需求需求需求',
        dqjz: '2023-02-02xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      },]]);
    return () => {
    }
  }, []);
  //列配置 - 获奖信息
  const columns1 = [
    {
      title: '获奖名称',
      dataIndex: 'hjmc',
      width: 200,
      key: 'hjmc',
      ellipsis: true,
    },
    {
      title: '荣誉等级',
      dataIndex: 'rydj',
      width: 200,
      key: 'rydj',
      ellipsis: true,
    },
    {
      title: '知识产权类型',
      dataIndex: 'zscqlx',
      width: 200,
      key: 'zscqlx',
      ellipsis: true,
    },
    {
      title: '获奖时间',
      dataIndex: 'hjsj',
      width: 200,
      key: 'hjsj',
      ellipsis: true,
    }
  ];
  //列配置 - 课题信息
  const columns2 = [
    {
      title: '项目课题',
      dataIndex: 'xmkt',
      width: 200,
      key: 'xmkt',
      ellipsis: true,
    },
    {
      title: '进度(%)',
      dataIndex: 'jd',
      width: 200,
      key: 'jd',
      ellipsis: true,
    },
    {
      title: '简介',
      dataIndex: 'jj',
      width: 200,
      key: 'jj',
      ellipsis: true,
    },
    {
      title: '当前进展',
      dataIndex: 'dqjz',
      width: 200,
      key: 'dqjz',
      ellipsis: true,
    }
  ];
  //信息标题
  const getInfoTitle = (txt) => {
    return (
      <div className='info-title'>
        <div className='blue-bar'></div>
        {txt}
      </div>
    );
  };
  //信息内容
  const getInfoItem = (key, val, span = 1) => {
    let w = '32%'
    if (span === 2) w = '66%';
    if (span === 3) w = '100%';
    return (
      <div className='info-item' style={span !== 1 ? {width: w} : {}}>
        <div className='info-item-title'>{key}</div>
        {val}
      </div>
    );
  };
  //其他投标供应商
  const getFoldInfo = (arr = []) => {
    let temp = [...arr];
    if (!isUnfold) temp = temp.slice(0, 3);
    return (
      <div className='info-item' style={{width: '100%'}}>
        <div className='info-item-title'>其他投标供应商：</div>
        {temp.map((x, i) => (<div className='info-item-txt' key={i}>{x}</div>))}
        {isUnfold ?
          <div className='info-item-fold' onClick={() => setIsUnfold(false)}>
            收起<i className='iconfont icon-up'/>
          </div>
          :
          <div className='info-item-unfold' onClick={() => setIsUnfold(true)}>
            展开<i className='iconfont icon-down'/>
          </div>}
      </div>
    )
  };
  //付款详情
  const getPmtDetail = (arr = []) => {
    let str = '第一期 付款50万元，占总金额 50%，计划付款时间 2022.10.01，已付款；;第二期 付款30万元，占总金额 30%，计划付款时间 2023.01.01，未付款；;第三期 付款20万元，占总金额 20%，计划付款时间 2024.01.01，未付款。'
    arr = str.split(';');
    return (
      <div className='info-item' style={{width: '100%'}}>
        <div className='info-item-title'>付款详情：</div>
        <div className='info-item-txt-box'>
          {arr.map((x, i) => (<div key={i}>{x}</div>))}
        </div>
      </div>
    );
  };
  //评标报告
  const getFileList = (arr = []) => {
    return (
      <div className='file-list'>
        {arr.map((x, i) => (
          <div className='file-item' key={i}>
            <i className='iconfont icon-file-word'/>
            <a className='item-name'>
              {x}
            </a>
            <i className='iconfont icon-download'/>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='other-info-box'>
      {getInfoTitle('合同信息')}
      <div className='info-row'>
        {getInfoItem('合同金额(元)：', '测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1')}
        {getInfoItem('签署日期：', '测试项目1')}
        {getInfoItem('供应商：', '测试项目1')}
      </div>
      <div className='info-row'>
        {getPmtDetail()}
      </div>
      {getInfoTitle('招标信息')}
      <div className='info-row'>
        {getInfoItem('合同金额(元)：', '测试项目1')}
        {getInfoItem('签署日期：', '测试项目1')}
        {getInfoItem('供应商：', '测试项目1')}
      </div>
      <div className='info-row'>
        {getInfoItem('供应商收款账号：', '测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1', 2)}
        {getInfoItem('评标报告：', getFileList(['测试项目评标报告11111111111111.docx', '测试项目评标报告.docx', '测试项目评标报告.docx']))}
      </div>
      <div className='info-row'>
        {getFoldInfo(`1、阿里云计算有限公司;2、腾讯云计算（北京）有限责任公司;3、深证证券信息有限公司;4、腾讯云计算（北京）有限责任公司;5、深证证券信息有限公司`.split(';'))}
      </div>
      {getInfoTitle('获奖信息')}
      <div className='info-table'>
        <Table
          columns={columns1}
          rowKey={'id'}
          dataSource={tableData1}
          size='middle'
          scroll={{x: true}}
          pagination={false}
        ></Table>
      </div>
      {getInfoTitle('课题信息')}
      <div className='info-table'>
        <Table
          columns={columns2}
          rowKey={'id'}
          dataSource={tableData2}
          size='middle'
          scroll={{x: true}}
          pagination={false}
        ></Table>
      </div>
    </div>
  )
};
