import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Spin,
  Table,
  Tooltip,
  Popconfirm,
  Radio,
  Select,
  TreeSelect,
  InputNumber,
} from 'antd';
import moment from 'moment';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import {
  OperateEmployeeAppraise,
  QueryProjectAppraiseSwitchList,
} from '../../../../services/pmsServices';
import { debounce } from 'lodash';
import {
  FetchQueryMilestoneStageInfo,
  FetchQueryProjectLabel,
} from '../../../../services/projectManage';
import TreeUtils from '../../../../utils/treeUtils';
import { setParentSelectableFalse } from '../../../../utils/pmsPublicUtils';

export default function OpenValuationModal(props) {
  const { visible, setVisible, routes = [], refresh, projectManager, projectName } = props;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 10,
    total: -1,
  }); //右侧表格数据
  const [selectedRowIds, setSelectedRowIds] = useState([]); //选中行id
  const [conditions, setConditions] = useState({
    includesOpened: false, //是否存在 已开启评价的
    includesClosed: false, //是否存在 未开启评价的
  });
  const [sltData, setSltData] = useState({
    xmlx: [],
    xmjd: [],
  }); //下拉框数据
  const [filterData, setFilterData] = useState({
    projectName: undefined,
    memberCount: undefined,
    projectType: undefined,
    projectStage: undefined,
    openStatus: undefined,
    appraiseState: undefined,
  });
  const [memberCount, setMemberCount] = useState({
    type: '1',
    value: undefined,
  });
  const notAllowOpen = selectedRowIds.length === 0 || conditions.includesOpened;
  const notAllowClose = selectedRowIds.length === 0 || conditions.includesClosed;
  const KQZT = [
    {
      ibm: 1,
      note: '已开启',
    },
    {
      ibm: 2,
      note: '未开启',
    },
  ];
  const PJZT = [
    {
      ibm: 2,
      note: '未开始',
    },
    {
      ibm: 1,
      note: '评价中',
    },
    {
      ibm: 3,
      note: '评价完成',
    },
  ];

  useEffect(() => {
    visible && getPrjList({ ...filterData, isFirst: true, projectManager, projectName });
    setFilterData(p => ({ ...p, projectName }));
    return () => {};
  }, [visible]);

  //获取项目数据
  const getPrjList = ({
    current = 1,
    pageSize = 10,
    projectName,
    memberCount,
    projectType,
    projectStage,
    openStatus,
    appraiseState,
    isFirst = false,
    projectManager, //判断管理员，其他人为普通人员。普通人员需传项目经理id，管理员不传
  }) => {
    setIsSpinning(true);
    QueryProjectAppraiseSwitchList({
      queryType: 'ALL',
      paging: 1,
      current,
      pageSize,
      sort: '',
      total: -1,
      projectName,
      memberCount,
      projectType,
      projectStage,
      openStatus,
      appraiseState,
      projectManager,
    })
      .then(res => {
        if (res?.success) {
          setTableData({ data: JSON.parse(res.result), current, pageSize, total: res.totalrows });
          setSelectedRowIds([]);
          isFirst ? getXMLX() : setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀项目数据', e);
        message.error('项目数据获取失败', 1);
        setIsSpinning(false);
      });
  };

  //获取项目类型数据
  const getXMLX = () => {
    FetchQueryProjectLabel({})
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ file: index.js:89 ~ getXMLX ~ res:', JSON.parse(res.xmlxRecord));
          let xmlx = TreeUtils.toTreeData(JSON.parse(res.xmlxRecord), {
            keyName: 'ID',
            pKeyName: 'FID',
            titleName: 'NAME',
            normalizeTitleName: 'title',
            normalizeKeyName: 'value',
          })[0].children[0];
          xmlx.selectable = false;
          xmlx.children?.forEach(node => setParentSelectableFalse(node));
          setSltData(p => ({ ...p, xmlx: [xmlx] }));
          getXMJD();
        }
      })
      .catch(e => {
        console.error('FetchQueryProjectLabel', e);
        message.error('项目类型查询失败', 1);
        setIsSpinning(false);
      });
  };

  //获取项目阶段数据
  const getXMJD = () => {
    FetchQueryMilestoneStageInfo({ type: 'ALL' })
      .then(res => {
        if (res?.success) {
          setSltData(p => ({ ...p, xmjd: res.record }));
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('FetchQueryMilestoneStageInfo', e);
        message.error('项目阶段查询失败', 1);
        setIsSpinning(false);
      });
  };

  //获取下拉框
  const getSelector = ({ value, onChange, data = [], titleField, valueField }) => {
    return (
      <Select
        showSearch
        allowClear
        onChange={onChange}
        placeholder="请选择"
        style={{ width: '100%' }}
      >
        {data.map((x, i) => (
          <Option key={i} value={Number(x[valueField])}>
            {x[titleField]}
          </Option>
        ))}
      </Select>
    );
  };

  const getTreeSelect = ({ onChange = () => {}, data = [] }) => {
    return (
      <TreeSelect
        allowClear
        showArrow
        showSearch
        treeNodeFilterProp="title"
        dropdownClassName="newproject-treeselect"
        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
        treeData={data}
        placeholder="请选择"
        onChange={onChange}
        treeDefaultExpandAll
        style={{ width: '100%' }}
      />
    );
  };

  //取消
  const onCancel = () => {
    setVisible(false);
    setSelectedRowIds([]);
    setFilterData({});
    setMemberCount({
      type: '1',
      value: undefined,
    });
  };

  //列配置
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      // width: 200,
      width: '30%',
      key: 'XMMC',
      ellipsis: true,
      render: (text, row, index) => (
        <Tooltip title={text} placement="topLeft">
          <Link
            style={{ color: '#3361ff' }}
            to={{
              pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                JSON.stringify({
                  xmid: row.XMID,
                }),
              )}`,
              state: {
                routes,
              },
            }}
            onClick={onCancel}
            className="table-link-strong"
          >
            {text}
          </Link>
        </Tooltip>
      ),
    },
    {
      title: '项目经理',
      dataIndex: 'XMJL',
      // width: 90,
      width: '10%',
      key: 'XMJL',
      ellipsis: true,
      render: (text, row, index) => (
        <Link
          style={{ color: '#3361ff' }}
          to={{
            pathname: `/pms/manage/staffDetail/${EncryptBase64(
              JSON.stringify({
                ryid: row.XMJLID,
              }),
            )}`,
            state: {
              routes,
            },
          }}
          onClick={onCancel}
          className="table-link-strong"
        >
          {text}
        </Link>
      ),
    },
    {
      title: '项目类型',
      dataIndex: 'XMLX',
      width: '15%',
      key: 'XMLX',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '项目阶段',
      dataIndex: 'XMJD',
      width: '15%',
      key: 'XMJD',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '项目人数',
      dataIndex: 'XMRS',
      width: '10%',
      key: 'XMRS',
      ellipsis: true,
    },
    {
      title: '开启状态',
      dataIndex: 'KQZT',
      key: 'KQZT',
      width: '10%',
      ellipsis: true,
    },
    {
      title: '评价状态',
      dataIndex: 'PJZT',
      key: 'PJZT',
      width: '10%',
      ellipsis: true,
    },
  ];

  //表格操作后更新数据
  const handleTableChange = useCallback(
    (pagination = {}) => {
      const { current = 1, pageSize = 20 } = pagination;
      getPrjList({ current, pageSize, projectManager, ...filterData });
      return;
    },
    [JSON.stringify(filterData), projectManager],
  );

  //弹窗参数
  const modalProps = {
    wrapClassName: 'open-valuation-modal',
    width: 1100,
    maskClosable: false,
    style: { top: 10 },
    maskStyle: { backgroundColor: 'rgb(0 0 0 / 30%)' },
    zIndex: 103,
    title: null,
    visible,
    onCancel,
    footer: null,
    destroyOnClose: true,
  };

  //行选择
  const rowSelection = {
    selectedRowKeys: selectedRowIds,
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(
      //   '🚀 ~ rowSelection.selectedRowKeys, selectedRows:',
      //   selectedRowKeys,
      //   selectedRows,
      // );
      setSelectedRowIds(selectedRowKeys);
      setConditions({
        includesOpened: selectedRows.some(x => x.KQZT === '已开启'),
        includesClosed: selectedRows.some(x => x.KQZT !== '已开启'),
      });
    },
  };

  const handleValuate = isOpen => {
    setIsSpinning(true);
    const arr = selectedRowIds.map(x => ({ XMID: String(x) }));
    OperateEmployeeAppraise({
      appraiseInfo: arr,
      infoCount: arr.length,
      operateType: isOpen ? 'KQPJ' : 'GBPJ',
    })
      .then(res => {
        if (res?.success) {
          getPrjList({ ...filterData, projectManager });
          refresh();
          message.success('操作成功', 1);
          setIsSpinning(false);
          setSelectedRowIds([]);
        }
      })
      .catch(e => {
        console.error('🚀desc', e);
        message.error('操作失败', 1);
        setIsSpinning(false);
      });
  };

  return (
    <Modal {...modalProps}>
      <div className="body-title-box">
        <strong>评价状态管理</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <div className="content-box">
          <div className="filter-row" key="row1">
            <div className="filter-item" key={'项目名称'}>
              <div className="item-label">项目名称</div>
              <div className="item-component">
                <Input
                  value={filterData.projectName}
                  onChange={e => {
                    e.persist();
                    setFilterData(p => ({ ...p, projectName: e.target.value }));
                    debounce(e => {
                      getPrjList({
                        ...filterData,
                        projectName: e?.target?.value,
                        projectManager,
                      });
                    }, 300)(e);
                  }}
                  placeholder={'请输入'}
                  style={{ width: '100%' }}
                  allowClear
                />
              </div>
            </div>
            <div className="filter-item" key={'项目人数'}>
              <div className="item-label">项目人数</div>
              <div className="item-component">
                <div className="item-compact">
                  <Select
                    defaultValue="1"
                    className="item-selector"
                    dropdownClassName="item-selector-dropdown"
                    onChange={v => {
                      setMemberCount(p => ({ ...p, type: v }));
                      memberCount.value !== undefined &&
                        getPrjList({
                          ...filterData,
                          memberCount: (v === '1' ? '>' : '<') + memberCount.value,
                          projectManager,
                        });
                    }}
                  >
                    <Option value="1">大于</Option>
                    <Option value="2">小于</Option>
                  </Select>
                  {memberCount.type === '1' && (
                    <InputNumber
                      className="item-input"
                      value={memberCount.value}
                      onChange={v => {
                        setMemberCount({ type: '1', value: v });
                        setFilterData(p => ({
                          ...p,
                          memberCount: ![undefined, '', null, ' '].includes(v)
                            ? '>' + v
                            : undefined,
                        }));
                        ![undefined, '', null, ' '].includes(v)
                          ? debounce(v => {
                              getPrjList({
                                ...filterData,
                                memberCount: '>' + v,
                                projectManager,
                              });
                            }, 300)(v)
                          : debounce(v => {
                              getPrjList({
                                ...filterData,
                                memberCount: undefined,
                                projectManager,
                              });
                            }, 300)(v);
                      }}
                      placeholder="请输入"
                    />
                  )}
                  {memberCount.type === '2' && (
                    <InputNumber
                      className="item-input"
                      value={memberCount.value}
                      onChange={v => {
                        setMemberCount({ type: '2', value: v });
                        setFilterData(p => ({
                          ...p,
                          memberCount: ![undefined, '', null, ' '].includes(v)
                            ? '<' + v
                            : undefined,
                        }));
                        ![undefined, '', null, ' '].includes(v)
                          ? debounce(v => {
                              getPrjList({
                                ...filterData,
                                memberCount: '<' + v,
                                projectManager,
                              });
                            }, 300)(v)
                          : debounce(v => {
                              getPrjList({
                                ...filterData,
                                memberCount: undefined,
                                projectManager,
                              });
                            }, 300)(v);
                      }}
                      placeholder="请输入"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="filter-item" key={'项目类型'}>
              <div className="item-label">项目类型</div>
              <div className="item-component">
                {getTreeSelect({
                  onChange: v => {
                    setFilterData(p => ({ ...p, projectType: v }));
                    getPrjList({
                      ...filterData,
                      projectType: Number(v),
                      projectManager,
                    });
                  },
                  data: sltData.xmlx,
                })}
              </div>
            </div>
          </div>
          <div className="filter-row" key="row2">
            <div className="filter-item" key={'项目阶段'}>
              <div className="item-label">项目阶段</div>
              <div className="item-component">
                {getSelector({
                  onChange: v => {
                    setFilterData(p => ({ ...p, projectStage: v }));
                    getPrjList({
                      ...filterData,
                      projectStage: Number(v),
                      projectManager,
                    });
                  },
                  data: sltData.xmjd,
                  valueField: 'id',
                  titleField: 'lcbmc',
                })}
              </div>
            </div>
            <div className="filter-item" key={'开启状态'}>
              <div className="item-label">开启状态</div>
              <Radio.Group
                className="item-component"
                value={filterData.openStatus}
                onChange={e => {
                  getPrjList({
                    ...filterData,
                    openStatus: Number(e.target.value),
                    projectManager,
                  });
                  setFilterData(p => ({ ...p, openStatus: Number(e.target.value) }));
                }}
              >
                {KQZT.map(x => (
                  <Radio key={x.ibm} value={x.ibm}>
                    {x.note}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
            <div className="filter-item" key={'评价状态'}>
              <div className="item-label">评价状态</div>
              <Radio.Group
                className="item-component"
                value={filterData.appraiseState}
                onChange={e => {
                  getPrjList({
                    ...filterData,
                    appraiseState: Number(e.target.value),
                    projectManager,
                  });
                  setFilterData(p => ({ ...p, appraiseState: Number(e.target.value) }));
                }}
              >
                {PJZT.map(x => (
                  <Radio key={x.ibm} value={x.ibm}>
                    {x.note}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </div>
          <div className="table-box">
            <div className="btn-row">
              <Popconfirm
                title="确定开启选中项目的评价？"
                onConfirm={() => handleValuate(true)}
                disabled={notAllowOpen}
              >
                <Button
                  disabled={notAllowOpen}
                  className={notAllowOpen ? '' : 'antd-primary-btn-diy'}
                >
                  开启评价
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定关闭选中项目的评价？"
                onConfirm={() => handleValuate(false)}
                disabled={notAllowClose}
              >
                <Button
                  disabled={notAllowClose}
                  className={notAllowClose ? '' : 'antd-primary-btn-diy'}
                >
                  关闭评价
                </Button>
              </Popconfirm>
              {selectedRowIds.length === 0 && '（请选择要“开启”/“关闭”的项目）'}
              {conditions.includesClosed &&
                conditions.includesOpened &&
                '（不允许一次性操作包含“未开启”和“已开启”状态的项目）'}
            </div>
            <Table
              loading={tableData.loading}
              rowSelection={rowSelection}
              rowKey={'XMID'}
              columns={columns}
              dataSource={tableData.data}
              onChange={handleTableChange}
              pagination={{
                current: tableData.current,
                pageSize: tableData.pageSize,
                defaultCurrent: 1,
                pageSizeOptions: ['10', '20', '30', '40'],
                showSizeChanger: true,
                hideOnSinglePage: false,
                showTotal: t => `共 ${tableData.total} 条数据`,
                total: tableData.total,
              }}
            />
          </div>
        </div>
      </Spin>
    </Modal>
  );
}
