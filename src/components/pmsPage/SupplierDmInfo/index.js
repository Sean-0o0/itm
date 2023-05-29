import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Select, Table } from 'antd';
import moment from 'moment';
import { QuerySupplierDemand } from '../../../services/pmsServices';

const { Option } = Select;

export default function SupplierDmInfo(props) {
  const {} = props;
  const [splDmData, setSplDmData] = useState({}); //应商需求信息
  const { gwxx = [], xqxx = [], xqList = [] } = splDmData;
  useEffect(() => {
    getSplierDmData();
    return () => {};
  }, []);

  //获取供应商需求信息
  const getSplierDmData = () => {
    QuerySupplierDemand({
      current: 1,
      cxlx: 'ALL',
      gwmc: 0,
      pageSize: 3,
      paging: 1,
      sort: '',
      total: -1,
      xqmc: 0,
    })
      .then(res => {
        if (res?.success) {
          const nullCheck = (str = '[]') => {
            let arr = JSON.parse(str);
            return arr.length <= 0 ? [] : arr[0].NOTE === '暂无数据' ? [] : arr;
          };

          //数据处理
          const map = nullCheck(res.xqxq).reduce((acc, curr) => {
            if (acc.has(curr.XQID)) {
              acc.get(curr.XQID).push({
                RYXQID: curr.RYXQID,
                GW: curr.GW,
                RYDJ: curr.RYDJ,
                RYSL: curr.RYSL,
                SC: curr.SC,
                YQ: curr.YQ,
              });
            } else {
              acc.set(curr.XQID, [
                {
                  RYXQID: curr.RYXQID,
                  GW: curr.GW,
                  RYDJ: curr.RYDJ,
                  RYSL: curr.RYSL,
                  SC: curr.SC,
                  YQ: curr.YQ,
                },
              ]);
            }
            return acc;
          }, new Map());

          const map2 = nullCheck(res.ryxq).reduce((acc, curr) => {
            if (acc.has(curr.XQID)) {
              acc.get(curr.XQID).push(curr.RYXQ);
            } else {
              acc.set(curr.XQID, [curr.RYXQ]);
            }
            return acc;
          }, new Map());

          const xqArr = nullCheck(res.xqgy).map(obj => ({
            ...obj,
            XQXQ: map.get(obj.XQID) || [],
          }));

          const xqList = xqArr.map(obj => ({
            ...obj,
            RYXQ: map2.get(obj.XQID) || [],
          }));

          const finalData = {
            gwxx: nullCheck(res.gwxx),
            xqxx: nullCheck(res.xqxx),
            xqList,
          };

          console.log('🚀 ~ file: index.js:38 ~ getSplierDmData ~ finalData:', finalData);
          setSplDmData(finalData);
        }
      })
      .catch(e => {
        message.error('供应商需求信息获取失败');
      });
  };

  //重置
  const handleReset = () => {};

  //列配置
  const columns = [
    {
      title: '人员等级',
      dataIndex: 'RYDJ',
      width: '15%',
      key: 'RYDJ',
      ellipsis: true,
    },
    {
      title: '岗位',
      dataIndex: 'GW',
      width: '15%',
      key: 'GW',
      ellipsis: true,
    },
    {
      title: '人员数量',
      dataIndex: 'RYSL',
      width: '15%',
      key: 'RYSL',
      ellipsis: true,
    },
    // {
    //   title: '时长(人/月)',
    //   dataIndex: 'SC',
    //   width: '12%',
    //   key: 'SC',
    //   ellipsis: true,
    // },
    {
      title: '要求',
      dataIndex: 'YQ',
      key: 'YQ',
      ellipsis: false,
    },
    {
      title: '操作',
      dataIndex: 'CZ',
      width: '10%',
      key: 'CZ',
      ellipsis: true,
      render: text => <a style={{ color: '#3361ff' }}>上传简历</a>,
    },
  ];

  //信息块
  const getInfoItem = ({
    XQID = '--',
    XQMC = '--',
    LXR = '--',
    LXRDH = '--',
    XMJJ = '--',
    JLRQ = '--',
    PCRQ = '--',
    DCRQ = '--',
    XQXQ = [],
    RYXQ = [],
  }) => {
    //小块
    const getItem = (label, value, width = '32%') => {
      return (
        <div className="item" key={label} style={{ width }}>
          <div className="label">{label}：</div>
          <div className="value">{value}</div>
        </div>
      );
    };

    return (
      <div className="info-item" key={XQID}>
        <div className="title">{XQMC}</div>
        <div className="content">
          <div className="introduction-box">
            {getItem('简历反馈截止日期', JLRQ)}
            {getItem('预计综合评测完成日期', PCRQ)}
            {getItem('预计到场日期', DCRQ)}
            {getItem(
              '联系人',
              <>
                {LXR}
                <span>{LXRDH}</span>
              </>,
            )}
            {getItem('人员需求', RYXQ.join('、'), '66%')}
            <div className="introduction">
              <div className="label">项目简介：</div>
              <div className="value">{XMJJ}</div>
            </div>
          </div>
          <div className="table-box">
            <div className="label">需求详情：</div>
            <Table dataSource={XQXQ} columns={columns} rowKey="RYXQID" pagination={false} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="splier-demand-info-box">
      <div className="top-console">
        <div className="title">信息技术人力外包需求</div>
        <div className="selector-row">
          <div className="console-item" key="xqmc">
            <div className="item-label">需求名称</div>
            <Select
              className="item-selector"
              dropdownClassName={'item-selector-dropdown'}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              allowClear
              // onChange={handlePrjNameChange}
              // value={prjName}
              placeholder="请选择"
            >
              {xqxx.map(x => (
                <Option key={x.XQID} value={x.XQID}>
                  {x.XQMC}
                </Option>
              ))}
            </Select>
          </div>
          <div className="console-item" key="gwmc">
            <div className="item-label">岗位名称</div>
            <Select
              className="item-selector"
              dropdownClassName={'item-selector-dropdown'}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              allowClear
              // onChange={handlePrjNameChange}
              // value={prjName}
              placeholder="请选择"
            >
              {gwxx.map(x => (
                <Option key={x.GWID} value={x.GWID}>
                  {x.GWMC}
                </Option>
              ))}
            </Select>
          </div>
          <Button className="btn-reset" onClick={handleReset}>
            重置
          </Button>
        </div>
      </div>
      <div className="info-box">{xqList.map(x => getInfoItem(x))}</div>
    </div>
  );
}
