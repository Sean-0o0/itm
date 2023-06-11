import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Pagination, Popover, Select, Spin, Table } from 'antd';
import moment from 'moment';
import { QuerySupplierDemand } from '../../../services/pmsServices';
import UploadModal from './UploadModal';

const { Option } = Select;

export default function SupplierDmInfo(props) {
  const {} = props;
  const [splDmData, setSplDmData] = useState({}); //供应商需求信息
  const { xqList = [], total = 0, jlxx = [], gysid = -1 } = splDmData;
  const [sltData, setSltData] = useState({}); //选择框数据
  const { gwxx = [], xqxx = [] } = sltData;
  const [sltParams, setSltParams] = useState({
    current: 1,
    xqmc: undefined,
    gwmc: undefined,
  }); //查询参数
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const nodeArr = document.getElementsByClassName('value xmjj');
  const [uploadModalVisible, setUploadModalVisible] = useState(false); //上传弹窗显隐
  const [curData, setCurData] = useState({
    xqid: '-1',
    ryxqid: '-1',
    jldata: [],
  }); //当前ryxqid的数据

  useEffect(() => {
    getSltData();
    return () => {};
  }, []);

  useEffect(() => {
    if (nodeArr.length !== 0) {
      let data = JSON.parse(JSON.stringify([...xqList]));
      for (let i = 0; i < nodeArr.length; i++) {
        let x = nodeArr[i];
        data[i].SHOWDTL = !(x.clientHeight <= 44 && x.scrollHeight <= 44);
      }
      setSplDmData(p => {
        return {
          ...p,
          xqList: data,
        };
      });
    }
    return () => {};
  }, [xqList.length, JSON.stringify(xqList)]);

  const getSltData = () => {
    QuerySupplierDemand({
      current: 1,
      pageSize: 3,
      paging: -1,
      sort: '',
      total: -1,
      cxlx: 'CXTJ',
    })
      .then(res => {
        if (res?.success) {
          const nullCheck = (str = '[]') => {
            let arr = JSON.parse(str);
            return arr.length <= 0 ? [] : arr[0].NOTE === '暂无数据' ? [] : arr;
          };

          const finalData = {
            gwxx: nullCheck(res.gwxx),
            xqxx: nullCheck(res.xqxx),
          };
          setSltData(finalData);
          getSplierDmData(sltParams);
        }
      })
      .catch(e => {
        setIsSpinning(false);
        message.error('供应商需求信息获取失败');
      });
  };

  //获取供应商需求信息
  const getSplierDmData = ({ current = 1, gwmc = undefined, xqmc = undefined }) => {
    setIsSpinning(true);
    setSltParams({ current, gwmc, xqmc });
    QuerySupplierDemand({
      current,
      pageSize: 3,
      paging: 1,
      sort: '',
      total: -1,
      cxlx: 'ALL',
      gwmc,
      xqmc,
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
                XQID: curr.XQID,
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
                  XQID: curr.XQID,
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
            ISUNFOLD: false, //是否展开
            SHOWDTL: false, //详情显隐
          }));

          const finalData = {
            xqList,
            total: res.totalrows ?? 0,
            jlxx: nullCheck(res.jlxx),
            gysid: res.gysid,
          };
          setSplDmData(finalData);
          setIsSpinning(false);
        }
      })
      .catch(e => {
        setIsSpinning(false);
        message.error('供应商需求信息获取失败');
      });
  };

  //重置
  const handleReset = () => {
    setSltParams({
      current: 1,
      xqmc: undefined,
      gwmc: undefined,
    });
    getSplierDmData({});
  };

  //展开、收起
  const handleUnfold = (bool, xqid) => {
    console.log('🚀 ~ file: index.js:120 ~ handleUnfold ~ bool, xqid:', bool, xqid);
    let arr = JSON.parse(JSON.stringify(xqList));
    arr.forEach(x => {
      if (x.XQID === xqid) {
        x.ISUNFOLD = bool;
      }
    });
    console.log('🚀 ~ file: index.js:127 ~ handleUnfold ~ arr:', arr);
    setSplDmData(p => {
      return {
        ...p,
        xqList: arr,
      };
    });
  };
  //查询参数变化
  const handleParamsChange = (paramName, v) => {
    setSltParams(p => {
      return {
        ...p,
        [paramName]: v,
      };
    });
    getSplierDmData({ ...sltParams, [paramName]: v });
  };

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
      align: 'center',
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
      render: (txt, row) => {
        const arr = jlxx.filter(x => x.RYXQID === row.RYXQID);
        let data = {};
        if (arr.length > 0) {
          data = {
            ...arr[0],
            JLXX: JSON.parse(arr[0].JLXX),
          };
        }
        return (
          <a
            style={{ color: '#3361ff' }}
            onClick={() => {
              if (gysid === -1) {
                message.info('只有供应商联系人可以操作', 1);
              } else {
                setUploadModalVisible(true);
                setCurData({
                  ryxqid: row.RYXQID,
                  xqid: row.XQID,
                  jldata: data,
                });
              }
            }}
          >
            {arr.length === 0 ? '上传简历' : '更新简历'}
          </a>
        );
      },
    },
  ];

  //信息块
  const getInfoItem = ({
    XQID = '--',
    XQMC = '--',
    LXR = '--',
    LXRDH = '--',
    XMJJ = '--',
    JLRQ,
    PCRQ,
    DCRQ,
    XQXQ = [],
    RYXQ = [],
    ISUNFOLD = false, // 展开
    SHOWDTL = false, //显示详情
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
            {getItem('简历反馈截止日期', JLRQ ? moment(JLRQ).format('YYYY-MM-DD') : '--')}
            {getItem('预计综合评测完成日期', PCRQ ? moment(PCRQ).format('YYYY-MM-DD') : '--')}
            {getItem('预计到场日期', DCRQ ? moment(DCRQ).format('YYYY-MM-DD') : '--')}
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
              <div
                className="value xmjj"
                style={
                  SHOWDTL
                    ? {
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '2',
                      }
                    : {}
                }
              >
                {SHOWDTL && (
                  <Popover
                    title={null}
                    content={<div className="content">{XMJJ}</div>}
                    placement="bottomRight"
                    overlayClassName="empolyment-remark-popover"
                  >
                    <div className="float">详情</div>
                  </Popover>
                )}
                {XMJJ}
              </div>
            </div>
          </div>
          {ISUNFOLD && (
            <div className="table-box">
              <div className="label">需求详情：</div>
              <Table dataSource={XQXQ} columns={columns} rowKey="RYXQID" pagination={false} />
            </div>
          )}
        </div>
        {ISUNFOLD ? (
          <div className="more-item-unfold" onClick={() => handleUnfold(false, XQID)}>
            收起
            <i className="iconfont icon-up" />
          </div>
        ) : (
          <div className="more-item" onClick={() => handleUnfold(true, XQID)}>
            展开
            <i className="iconfont icon-down" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="splier-demand-info-box">
      {uploadModalVisible && (
        <UploadModal
          visible={uploadModalVisible}
          setVisible={setUploadModalVisible}
          data={{
            gysid,
            ...curData,
          }}
          reflush={getSltData}
        />
      )}
      <Spin
        spinning={isSpinning}
        tip="加载中"
        size="large"
        wrapperClassName="diy-style-spin-prj-detail"
      >
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
                onChange={v => {
                  handleParamsChange('xqmc', v);
                }}
                value={sltParams.xqmc}
                placeholder="请选择"
              >
                {xqxx.map(x => (
                  <Option key={x.XQID} value={x.XQID}>
                    {x.DWXQMC}
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
                onChange={v => {
                  handleParamsChange('gwmc', v);
                }}
                value={sltParams.gwmc}
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
        <div className="info-box" style={{ paddingBottom: splDmData.total <= 3 ? 8 : 24 }}>
          {xqList.map(x => getInfoItem(x))}
          {splDmData.total > 3 && (
            <Pagination
              defaultCurrent={1}
              current={sltParams.current}
              pageSize={3}
              total={splDmData.total}
              showQuickJumper
              onChange={v => {
                handleParamsChange('current', v);
              }}
            />
          )}
        </div>
      </Spin>
    </div>
  );
}
