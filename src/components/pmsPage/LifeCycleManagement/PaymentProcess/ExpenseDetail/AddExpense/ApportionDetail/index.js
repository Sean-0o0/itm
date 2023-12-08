import React, { useEffect, useState, useRef, Fragment } from 'react';
import {
  Button,
  message,
  Form,
  Checkbox,
  Tooltip,
  Popconfirm,
  Table,
  Menu,
  Dropdown,
  Icon,
  Modal,
} from 'antd';
import moment from 'moment';
import { EditableCell, EditableRow } from './EditableTable';
import UpdateModal from './UpdateModal';
import Decimal from 'decimal.js';

export default function ApportionDetail(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const { formData = {}, form = {}, bxbmData = [], bxbmOrigin = [] } = dataProps;
  const { isApportion = false, apportionmentData = [] } = formData;
  const { getFieldDecorator, getFieldValue, validateFields, resetFields, setFieldsValue } = form;
  const { setFormData, setIsGx } = funcProps;
  const [selectedRowIds, setSelectedRowIds] = useState([]); //选中行id
  const [updateModalData, setUpdateModalData] = useState({
    visible: false,
    type: '', //org、rate、amount、batch-add
  }); //修改弹窗

  useEffect(() => {
    console.log('#### apportionmentData', apportionmentData);
    return () => {};
  }, [JSON.stringify(apportionmentData)]);

  //总分摊金额
  // const zftje = () => {
  //   let sum = 0;
  //   apportionmentData.forEach(x => {
  //     sum += x['FTJE' + x.ID];
  //   });
  //   return parseFloat(sum.toFixed(2));
  // };
  // //总金额比例
  // const zjebl = () => {
  //   let sum = 0;
  //   apportionmentData.forEach(x => {
  //     sum += x['FTBL' + x.ID];
  //     // console.log("🚀 ~ file: index.js:271 ~ zjebl ~ x['FTBL' + x.ID]:", x['FTBL' + x.ID]);
  //   });
  //   return parseFloat(sum.toFixed(2));
  // };
  //总分摊金额
  const zftje = () => {
    let sum = Decimal(0);
    apportionmentData.forEach(x => {
      sum = sum.plus(x['FTJE' + x.ID] || 0);
    });
    return sum.toNumber();
  };

  //总金额比例
  const zjebl = () => {
    let sum = Decimal(0);
    apportionmentData.forEach(x => {
      sum = sum.plus(x['FTBL' + x.ID] || 0);
    });
    return sum.toNumber();
  };

  //分摊比例
  const handleFTBL = () => {
    let zdxx = []; //字段校验
    apportionmentData.forEach(x => {
      zdxx.push('FTBL' + x.ID);
      zdxx.push('FTJE' + x.ID);
    });
    validateFields(zdxx, e => {
      if (!e) {
        let arr = apportionmentData.map(x => x['FTJE' + x.ID]);
        if (apportionmentData.length === 0) {
          message.info('请先添加分摊数据', 1);
        } else if (arr.includes(0)) {
          message.warn('无法更新分摊比例和费用金额，有为零的分摊金额', 1);
        } else {
          Modal.confirm({
            title: '确定更新分摊比例？',
            content: '系统将根据分摊金额，自动调整「费用金额、分摊比例」，确定更新？',
            onOk: () => {
              setIsGx(true);
              let data = [...apportionmentData];
              setFieldsValue({ je: zftje() });
              // let sum = 0;
              let sum = Decimal(0);
              data.forEach((x, i) => {
                // const value = parseFloat(((x['FTJE' + x.ID] / zftje()) * 100).toFixed(2));
                const value = parseFloat(
                  Decimal(x['FTJE' + x.ID])
                    .div(zftje())
                    .times(100)
                    .toFixed(2),
                );
                // const lastValue = parseFloat((100 - sum).toFixed(2));
                const lastValue = parseFloat(Decimal(100).minus(sum));
                if (i === data.length - 1) {
                  x['FTBL' + x.ID] = lastValue;
                  setFieldsValue({
                    ['FTBL' + x.ID]: lastValue,
                  });
                } else {
                  x['FTBL' + x.ID] = value;
                  setFieldsValue({
                    ['FTBL' + x.ID]: value,
                  });
                  // sum += value;
                  sum = sum.plus(value);
                }
              });
              setFormData(p => ({
                ...p,
                apportionmentData: [...data],
              }));
            },
          });
        }
      }
    });
  };

  //分摊金额
  const handleFTJE = () => {
    let zdxx = []; //字段校验
    apportionmentData.forEach(x => {
      zdxx.push('FTBL' + x.ID);
      zdxx.push('FTJE' + x.ID);
    });
    validateFields(zdxx, e => {
      if (!e) {
        if (apportionmentData.length === 0) {
          message.info('请先添加分摊数据', 1);
        } else if (zjebl() !== 100) {
          message.warn('无法更新分摊金额，总分摊比例不等于100.00%', 1);
        } else {
          Modal.confirm({
            title: '确定更新分摊金额？',
            content: '系统将根据费用金额、分摊比例，自动调整「分摊金额」，确定更新？',
            onOk: () => {
              setIsGx(true);
              let data = [...apportionmentData];
              // let sum = 0;
              let sum = Decimal(0);
              data.forEach((x, i) => {
                // const value = parseFloat(
                //   ((x['FTBL' + x.ID] / 100) * (getFieldValue('je') || 0)).toFixed(2),
                // );
                const value = parseFloat(
                  Decimal(x['FTBL' + x.ID])
                    .div(100)
                    .times(getFieldValue('je') || 0)
                    .toFixed(2),
                );
                // const lastValue = parseFloat((getFieldValue('je') - sum).toFixed(2))
                const lastValue = parseFloat(
                  Decimal(getFieldValue('je') || 0)
                    .minus(sum)
                    .toFixed(2),
                );
                if (i === data.length - 1) {
                  x['FTJE' + x.ID] = lastValue;
                  setFieldsValue({
                    ['FTJE' + x.ID]: lastValue,
                  });
                } else {
                  x['FTJE' + x.ID] = value;
                  setFieldsValue({
                    ['FTJE' + x.ID]: value,
                  });
                  // sum += value;
                  sum = sum.plus(value);
                }
              });
              setFormData(p => ({
                ...p,
                apportionmentData: [...data],
              }));
            },
          });
        }
      }
    });
  };

  //平均分摊
  const handleEven = () => {
    try {
      Modal.confirm({
        title: '确定平均分摊?',
        content: '系统将根据费用金额，自动调整「分摊金额、分摊比例」，确定平均分摊？',
        onOk: () => {
          let data = [...apportionmentData];
          let ftbl = parseFloat(
            Decimal(100)
              .div(data.length)
              .toFixed(2),
          );
          if (
            Decimal(ftbl)
              .times(data.length)
              .eq(100)
          ) {
            const value = parseFloat(
              Decimal(ftbl)
                .div(100)
                .times(getFieldValue('je') || 0)
                .toFixed(2),
            );
            data.forEach(x => {
              x['FTJE' + x.ID] = value;
              x['FTBL' + x.ID] = ftbl;
              setFieldsValue({
                ['FTJE' + x.ID]: value,
                ['FTBL' + x.ID]: ftbl,
              });
            });
          } else if (Decimal(ftbl * data.length).gt(100)) {
            data.forEach((x, i) => {
              if (i === data.length - 1) {
                ftbl = parseFloat(
                  Decimal(ftbl)
                    .mimus(
                      Decimal(ftbl)
                        .times(data.length)
                        .minus(100),
                    )
                    .toFixed(2),
                );
              }
              const value = parseFloat(
                Decimal(ftbl)
                  .div(100)
                  .times(getFieldValue('je') || 0)
                  .toFixed(2),
              );
              x['FTJE' + x.ID] = value;
              x['FTBL' + x.ID] = ftbl;
              setFieldsValue({
                ['FTJE' + x.ID]: value,
                ['FTBL' + x.ID]: ftbl,
              });
            });
          } else if (Decimal(ftbl * data.length).lt(100)) {
            data.forEach((x, i) => {
              if (i === data.length - 1) {
                ftbl = parseFloat(
                  Decimal(100)
                    .minus(Decimal(ftbl).times(data.length))
                    .plus(ftbl)
                    .toFixed(2),
                );
              }
              const value = parseFloat(
                Decimal(ftbl)
                  .div(100)
                  .times(getFieldValue('je') || 0)
                  .toFixed(2),
              );
              x['FTJE' + x.ID] = value;
              x['FTBL' + x.ID] = ftbl;
              setFieldsValue({
                ['FTJE' + x.ID]: value,
                ['FTBL' + x.ID]: ftbl,
              });
            });
          }
          setFormData(p => ({
            ...p,
            apportionmentData: [...data],
          }));
        },
      });
    } catch (e) {
      console.log('🚀 ~ file: index.js:281 ~ handleEven ~ e:', e);
    }
  };

  //添加平均分摊
  const handleAddRow = () => {
    let arrData = [...apportionmentData];
    const UUID = String(Date.now());
    const FTBL = Decimal(100)
      .minus(zjebl())
      .toNumber();
    arrData.push({
      ID: UUID,
      ['BXBM' + UUID]: undefined,
      ['BXBMYKBID' + UUID]: undefined,
      ['FTBL' + UUID]: FTBL,
      // ['FTJE' + UUID]: parseFloat(
      //   (((getFieldValue('je') || 0) * parseFloat((100 - zjebl()).toFixed(2))) / 100).toFixed(2),
      // ),
      ['FTJE' + UUID]: parseFloat(
        Decimal(getFieldValue('je') || 0)
          .times(FTBL)
          .div(100)
          .toFixed(2),
      ),
    });

    setFormData(p => ({
      ...p,
      apportionmentData: arrData,
    }));
    //滚动至底部
    setTimeout(() => {
      const element = document.querySelectorAll('.add-expense-drawer .ant-drawer-body')[0];
      element.scrollTop = element.scrollHeight;
    }, 200);
  };

  //表格数据保存
  const handleTableSave = row => {
    let newData = [...apportionmentData];
    const index = newData.findIndex(item => row.ID === item.ID);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item, //old row
      ...row, //rew row
    });
    console.log('🚀 ~ handleTableSave ~ newData:', newData);
    setFormData(p => ({
      ...p,
      apportionmentData: newData,
    }));
  };

  //列配置
  const tableColumns = [
    {
      title: '报销部门',
      dataIndex: 'BXBM',
      width: '40%',
      key: 'BXBM',
      ellipsis: true,
      editable: true,
    },
    {
      title: (
        <div className="table-header-diy">
          分摊比例(%)
          <Tooltip
            title="根据分摊金额，自动调整费用金额、分摊比例"
            overlayStyle={{ maxWidth: 300 }}
          >
            <div className="update-tag" onClick={handleFTBL}>
              <Icon type="sync" />
              更新
            </div>
          </Tooltip>
        </div>
      ),
      dataIndex: 'FTBL',
      width: '25%',
      key: 'FTBL',
      ellipsis: true,
      editable: true,
    },
    {
      title: (
        <div className="table-header-diy">
          分摊金额(￥)
          <Tooltip
            title="根据费用金额、分摊比例，自动调整分摊金额"
            overlayStyle={{ maxWidth: 300 }}
          >
            <div className="update-tag" onClick={handleFTJE}>
              <Icon type="sync" />
              更新
            </div>
          </Tooltip>
        </div>
      ),
      dataIndex: 'FTJE',
      width: '25%',
      key: 'FTJE',
      ellipsis: true,
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'OPRT',
      width: '10%',
      key: 'OPRT',
      align: 'center',
      ellipsis: true,
      render: (text, record) => (
        <Popconfirm
          title="确定要删除吗?"
          placement="topRight"
          onConfirm={() => {
            const dataSource = [...apportionmentData];
            setFormData(p => ({
              ...p,
              apportionmentData: dataSource.filter(item => item.ID !== record.ID),
            }));
            setSelectedRowIds(p => p.filter(item => item.ID !== record.ID));
          }}
        >
          <a style={{ color: '#3361ff' }}>删除</a>
        </Popconfirm>
      ),
    },
  ];
  const columns = tableColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => {
        return {
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          handleSave: handleTableSave,
          key: col.key,
          formdecorate: form,
          title: col?.title?.props?.children || col?.title || '',
          bxbmdata: bxbmData,
        };
      },
    };
  });

  //行选择
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let newSelectedRowIds = [];
      selectedRows?.forEach(item => {
        newSelectedRowIds.push(item.ID);
      });
      setSelectedRowIds(newSelectedRowIds);
    },
  };

  //覆盖默认table元素
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const menu = (
    <Menu>
      <Menu.Item onClick={() => openUpdateModal('org')}>报销部门</Menu.Item>
      <Menu.Item onClick={() => openUpdateModal('rate')}>分摊比例</Menu.Item>
      <Menu.Item onClick={() => openUpdateModal('amount')}>分摊金额</Menu.Item>
    </Menu>
  );

  //显示修改弹窗
  const openUpdateModal = (type = 'batch-add') => {
    setUpdateModalData({
      visible: true,
      type,
    });
  };

  // //平均分摊
  // const handleEven = () => {
  //   Modal.confirm({
  //     title: '确定平均分摊?',
  //     content: '系统将根据费用金额，自动调整「分摊金额、分摊比例」，确定平均分摊？',
  //     onOk: () => {
  //       let data = [...apportionmentData];
  //       let ftbl = parseFloat((100 / data.length).toFixed(2));
  //       if (ftbl * data.length === 100) {
  //         data.forEach(x => {
  //           x['FTJE' + x.ID] = parseFloat(((ftbl / 100) * (getFieldValue('je') || 0)).toFixed(2));
  //           x['FTBL' + x.ID] = ftbl;
  //           setFieldsValue({
  //             ['FTJE' + x.ID]: parseFloat(((ftbl / 100) * (getFieldValue('je') || 0)).toFixed(2)),
  //             ['FTBL' + x.ID]: ftbl,
  //           });
  //         });
  //       } else if (ftbl * data.length > 100) {
  //         data.forEach((x, i) => {
  //           if (i === data.length - 1) {
  //             ftbl = parseFloat((ftbl - (ftbl * data.length - 100)).toFixed(2));
  //           }
  //           x['FTJE' + x.ID] = parseFloat(((ftbl / 100) * (getFieldValue('je') || 0)).toFixed(2));
  //           x['FTBL' + x.ID] = ftbl;
  //           setFieldsValue({
  //             ['FTJE' + x.ID]: parseFloat(((ftbl / 100) * (getFieldValue('je') || 0)).toFixed(2)),
  //             ['FTBL' + x.ID]: ftbl,
  //           });
  //         });
  //       } else if (ftbl * data.length < 100) {
  //         data.forEach((x, i) => {
  //           if (i === data.length - 1) {
  //             ftbl = parseFloat((ftbl + (100 - ftbl * data.length)).toFixed(2));
  //           }
  //           x['FTJE' + x.ID] = parseFloat(((ftbl / 100) * (getFieldValue('je') || 0)).toFixed(2));
  //           x['FTBL' + x.ID] = ftbl;
  //           setFieldsValue({
  //             ['FTJE' + x.ID]: parseFloat(((ftbl / 100) * (getFieldValue('je') || 0)).toFixed(2)),
  //             ['FTBL' + x.ID]: ftbl,
  //           });
  //         });
  //       }
  //       setFormData(p => ({
  //         ...p,
  //         apportionmentData: [...data],
  //       }));
  //     },
  //   });
  // };

  //批量删除
  const handleBatchDelete = () => {
    const dataSource = [...apportionmentData];
    // console.log(
    //   '🚀 ~ file: index.js:267 ~ ApportionDetail ~ dataSource:',
    //   dataSource,
    //   selectedRowIds,
    // );
    setFormData(p => ({
      ...p,
      apportionmentData: dataSource.filter(item => !selectedRowIds.includes(item.ID)),
    }));
    setSelectedRowIds([]);
  };

  //添加分摊
  // const handleAddRow = () => {
  //   let arrData = [...apportionmentData];
  //   const UUID = String(Date.now());
  //   arrData.push({
  //     ID: UUID,
  //     ['BXBM' + UUID]: undefined,
  //     ['BXBMYKBID' + UUID]: undefined,
  //     ['FTBL' + UUID]: parseFloat((100 - zjebl()).toFixed(2)),
  //     ['FTJE' + UUID]: parseFloat(
  //       (((getFieldValue('je') || 0) * parseFloat((100 - zjebl()).toFixed(2))) / 100).toFixed(2),
  //     ),
  //   });

  //   setFormData(p => ({
  //     ...p,
  //     apportionmentData: arrData,
  //   }));
  //   //滚动至底部
  //   setTimeout(() => {
  //     const element = document.querySelectorAll('.add-expense-drawer .ant-drawer-body')[0];
  //     element.scrollTop = element.scrollHeight;
  //   }, 200);
  // };

  //勾选
  const handleApportionCheck = e => {
    if (!e.target.checked) {
      Modal.confirm({
        title: '关闭费用分摊',
        content: '关闭费用分摊填写的分摊明细会被清空，是否关闭？',
        onOk: () => {
          setFormData(p => ({
            ...p,
            isApportion: e.target.checked,
            apportionmentData: [],
          }));
          resetFields(['org', 'rate', 'amount', 'org-multiple']);
          setSelectedRowIds([]);
        },
      });
    } else {
      setFormData(p => ({ ...p, isApportion: e.target.checked }));
    }
  };

  return (
    <div className="apportion-detail-box">
      <div className="top-check-row">
        <Checkbox checked={isApportion} onChange={handleApportionCheck}>
          分摊明细
        </Checkbox>
        <div className="check-tip">若本明细的费用由多部门共同承担，请勾选</div>
      </div>
      <UpdateModal
        dataProps={{
          visible: updateModalData.visible,
          form,
          type: updateModalData.type,
          bxbmData,
          apportionmentData,
          selectedRowIds,
          bxbmOrigin,
        }}
        funcProps={{
          setVisible: v =>
            setUpdateModalData(p => ({
              ...p,
              visible: v,
            })),
          setFormData,
        }}
      />
      {isApportion && (
        <div className="detail-box">
          <div className="apportion-ways">分摊方式：报销部门分摊</div>
          <div className="amount-display-box">
            <div className="info-item">
              <div className="label">费用金额：</div>
              <div className="value">
                ¥&nbsp;{parseFloat((getFieldValue('je') || 0).toFixed(2))}
              </div>
            </div>
            <div className="info-item">
              <div className="label">总分摊金额：</div>
              <div className="value">¥&nbsp;{zftje()}</div>
            </div>
            <div className="info-item">
              <div className="label">总金额比例：</div>
              <div className="value">{zjebl()}%</div>
            </div>
            {apportionmentData.length > 0 && (
              <div className="info-item">
                <div className="label">总计：</div>
                <div className="value">{apportionmentData.length}条</div>
              </div>
            )}
          </div>
          <Form.Item className="apportion-table-box">
            <Table
              columns={columns}
              components={components}
              rowSelection={rowSelection}
              rowKey={'ID'}
              rowClassName={() => 'editable-row'}
              dataSource={apportionmentData}
              pagination={false}
              size="middle"
            />
            <div className="oprt-row">
              <div className="row-left">
                {apportionmentData.length === 0 ? (
                  <span className={'row-right-disable'}>平均分摊</span>
                ) : (
                  <Tooltip
                    title="根据费用金额，自动平均分摊比例、分摊金额"
                    overlayStyle={{ maxWidth: 300 }}
                  >
                    <span onClick={handleEven}>平均分摊</span>
                  </Tooltip>
                )}
                <span onClick={() => openUpdateModal('batch-add')}>批量添加分摊</span>
              </div>
              <div
                className={'row-right' + (selectedRowIds.length === 0 ? ' row-right-disable' : '')}
              >
                <Dropdown
                  overlay={menu}
                  overlayClassName="tc-btn-more-content-dropdown"
                  disabled={selectedRowIds.length === 0}
                >
                  <span>批量修改</span>
                </Dropdown>
                <Popconfirm
                  title="确定删除选中的分摊？"
                  onConfirm={handleBatchDelete}
                  disabled={selectedRowIds.length === 0}
                >
                  <span>批量删除</span>
                </Popconfirm>
              </div>
            </div>
            <div className="table-add-row" onClick={handleAddRow}>
              <span>
                <Icon type="plus" style={{ fontSize: '12px' }} />
                <span style={{ paddingLeft: '6px', fontSize: '14px' }}>添加分摊</span>
              </span>
            </div>
          </Form.Item>
        </div>
      )}
    </div>
  );
}
