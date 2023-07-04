import React, {useEffect, useState} from 'react';
import {Table, Popover} from 'antd';

export default function BasicInfo() {
  const [tableData, setTableData] = useState([]); //表格数据

  useEffect(() => {
    setTableData(p => [...[{
      xqbt: '需求需求需求需求需求需求需求需求需求需求需求需求',
      xqnr: '需求需求需求需求需求需求需求需求需求需求需求需求',
      xqrq: '2023-02-02xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    }, {
      xqbt: '需求需求需求需求需求需求需求需求需求需求需求需求',
      xqnr: '需求需求需求需求需求需求需求需求需求需求需求需求',
      xqrq: '2023-02-02xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    }, {
      xqbt: '需求需求需求需求需求需求需求需求需求需求需求需求',
      xqnr: '需求需求需求需求需求需求需求需求需求需求需求需求',
      xqrq: '2023-02-02xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    },]])
    return () => {
    }
  }, []);
  const columns = [
    {
      title: '需求标题',
      dataIndex: 'xqbt',
      width: 200,
      key: 'xqbt',
      ellipsis: true,
    },
    {
      title: '需求内容',
      dataIndex: 'xqnr',
      width: 200,
      key: 'xqnr',
      ellipsis: true,
    },
    {
      title: '需求日期',
      dataIndex: 'xqrq',
      width: 200,
      key: 'xqrq',
      ellipsis: true,
    }
  ];
  const getInfoTitle = (txt) => {
    return (
      <div className='info-title'>
        <div className='blue-bar'></div>
        {txt}
      </div>
    );
  };
  const getInfoItem = (key, val) => {
    return (
      <div className='info-item'>
        <span>{key}</span>{val}
      </div>
    );
  };
  //获取项目标签数据
  const getTagData = (tag) => {
    let arr = [];
    if (tag !== '' && tag !== null && tag !== undefined) {
      if (tag.includes(';')) {
        arr = tag.split(';');
      } else {
        arr.push(tag);
      }
    }
    return arr;
  };
  //获取项目标签
  const getTags = (text = '') => {
    return (
      <div className='info-item info-tags'>
        <span>项目标签：</span>
        <div className='prj-tags'>
          {getTagData(text).length !== 0 && <>
            {getTagData(text)?.slice(0, 2).map((x, i) => <div key={i} className='tag-item'>{x}</div>)}
            {getTagData(text)?.length > 2 && <Popover overlayClassName='tag-more-popover' content={(
              <div className='tag-more'>
                {getTagData(text)?.slice(2).map((x, i) => <div key={i} className='tag-item'>{x}</div>)}
              </div>
            )} title={null}>
              <div className='tag-item'>...</div>
            </Popover>}
          </>}
        </div>
      </div>
    );
  };

  return (
    <div className='basic-info-box'>
      {getInfoTitle('基本信息')}
      <div className='info-row'>
        {getInfoItem('项目名称：', '测试项目1')}
        {getInfoItem('项目类型：', '测试项目1')}
        {getTags('迭代项目;数字化专班;项目课题;抵税扣除;信创项目;软著专利;党建项目')}
      </div>
      <div className='info-row'>
        {getInfoItem('关联软件：', '测试项目1')}
        {getInfoItem('招标方式：', '测试项目1')}
        {getInfoItem('应用部门：', '测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1')}
      </div>
      <div className='info-row'>
        {getInfoItem('关联预算：', '测试项目1')}
        {getInfoItem('项目金额(元)：', '测试项目1')}
        {getInfoItem('已使用金额(元)：', '测试项目1')}
      </div>
      <div className='info-row'>
        {getInfoItem('项目进度：', '测试项目1')}
        {getInfoItem('当前里程碑：', '测试项目1')}
        {getInfoItem('里程碑进度：', '测试项目1')}
      </div>
      {getInfoTitle('项目人员')}
      <div className='info-row'>
        {getInfoItem('项目经理：', '测试项目1')}
        {getInfoItem('产品经理：', '测试项目1')}
        {getInfoItem('UI设计师：', '测试项目1')}
      </div>
      <div className='info-row'>
        {getInfoItem('前端开发人员：：', '测试项目1')}
        {getInfoItem('后端开发人员：', '测试项目1')}
        {getInfoItem('测试人员：', '测试项目1')}
      </div>
      <div className='info-row'>
        {getInfoItem('基础框架人员：', '测试项目1')}
        {getInfoItem('网络安全员：', '测试项目1')}
      </div>
      {getInfoTitle('变更类或计划外需求')}
      <div className='info-table'>
        <Table
          columns={columns}
          rowKey={'id'}
          dataSource={tableData}
          size='middle'
          scroll={{x: true}}
          pagination={false}
        ></Table>
      </div>
    </div>
  );
};
