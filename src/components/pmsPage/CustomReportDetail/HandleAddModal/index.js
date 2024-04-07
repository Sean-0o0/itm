import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Form,
  message,
  Spin,
  Button,
  Table,
  Icon,
  Popconfirm,
} from 'antd';
import { EditableCell, EditableRow } from './EditableTable';
import {
  EditCustomReport,
  QueryCustomReportContent,
  QueryMemberSelectList,
  QueryProjectSelectList,
} from '../../../../services/pmsServices';
import { connect } from 'dva';
import { debounce } from 'lodash';
import moment from 'moment';

function HandleAddModal(props) {
  const {
    visible,
    setVisible,
    form,
    tableColumns = [],
    data = {},
    refresh = () => {},
    topData = {},
    userBasicInfo = {},
    dataArr = [],
    roleData = {},
    bgid,
    monthData
  } = props;
  const {
    validateFields,
    getFieldValue,
    resetFields,
    getFieldDecorator,
    setFieldsValue,
    validateFieldsAndScroll,
  } = form;
  const [tableData, setTableData] = useState([]); //表格数据
  const [editData, setEditData] = useState([]); //编辑数据
  const [delData, setDelData] = useState([]); //删除数据
  const [isSpinning, setIsSpinning] = useState(false);
  const [sltData, setSltData] = useState({
    glxm: [], //关联项目
    txr: [], //填写人
  }); //下拉框数据
  const isBGHZR = (
    (JSON.parse(roleData.testRole || '{}')?.ALLROLE ?? '') + (roleData.role ?? '')
  ).includes('报告汇总人');

  useEffect(() => {
    if (visible) {
      if (dataArr.length > 0) {
        setTableData(
          dataArr.map(obj => {
            const newObj = { ID: obj.ID };
            for (const key in obj) {
              if (key !== 'ID') {
                if (key === 'TXR') {
                  if (isBGHZR) {
                    //可编辑
                    newObj[key + obj.ID] =
                      obj['TXRID'] === undefined || obj['TXRID'] === '-1'
                        ? undefined
                        : String(obj['TXRID']);
                  } else {
                    newObj[key] =
                      obj['TXR'] === undefined || obj['TXR'] === '-1'
                        ? undefined
                        : String(obj['TXR']);
                  }
                } else if (key === 'GLXM') {
                  // if (isBGHZR) {
                  //   //可编辑
                  newObj[key + obj.ID] =
                    obj['GLXMID'] === undefined || obj['GLXMID'] === '-1'
                      ? undefined
                      : String(obj['GLXMID']);
                  // } else {
                  //   newObj[key] =
                  //     obj['GLXM'] === undefined || obj['GLXM'] === '-1'
                  //       ? undefined
                  //       : String(obj['GLXM']);
                  // }
                } else {
                  newObj[key + obj.ID] =
                    obj[key] === 'undefined' || obj[key] === '-1' ? '' : obj[key];
                }
              }
            }
            return newObj;
          }),
        );
      } else {
        //帮忙新增一条
        const UUID = new Date().getTime();
        setTableData([
          tableColumns.reduce((obj = {}, item = {}) => {
            obj.ID = UUID;
            obj[item.key + UUID] = undefined;
            if (item.key === 'TXR') {
              !isBGHZR
                ? (obj.TXR = userBasicInfo.name)
                : (obj['TXR' + UUID] = String(userBasicInfo.id));
              obj['TXRID' + UUID] = String(userBasicInfo.id);
            }
            return obj;
          }, {}),
        ]);
        setEditData([
          tableColumns.reduce((obj = {}, item = {}) => {
            obj.ID = UUID;
            obj[item.key + UUID] = undefined;
            if (item.key === 'TXR' && !isBGHZR) {
              !isBGHZR
                ? (obj.TXR = userBasicInfo.name)
                : (obj['TXR' + UUID] = String(userBasicInfo.id));
              obj['TXRID' + UUID] = String(userBasicInfo.id);
            }
            obj.isNew = true;
            return obj;
          }, {}),
        ]);
      }
      setIsSpinning(true);
      getPrjData();
      if (isBGHZR) {
        getStaffData();
      }
    }
    return () => {};
  }, [visible, JSON.stringify(dataArr), isBGHZR, tableColumns, JSON.stringify(userBasicInfo)]);

  //获取数据
  const getData = (reportID, month, queryType) => {
    setIsSpinning(true);
    QueryCustomReportContent({
      current: 1,
      pageSize: 20,
      paging: -1,
      queryType: 'BMYB',
      reportID,
      sort: '',
      total: -1,
      month,
    })
      .then(res => {
        if (res?.success) {
          let mergeData = JSON.parse(res.nrxx);
          let temp = JSON.parse(JSON.stringify(tableData));
          setTableData(JSON.parse(JSON.stringify(returnNewTable(mergeData, temp))));

        }
      })
      .catch(e => {
        message.error('获取上月表格数据获取失败', 1);
      }).finally(() => {
      setIsSpinning(false);
    });
  };

  const returnNewTable = (mergeData, temp) => {
    console.log("temp", mergeData)
    mergeData.forEach( m => {
      temp.forEach( t => {
        if(m.ZD3 === t["ZD3" + t.ID]) {
          t["GLXM" + t.ID] = m.GLXMID === undefined || m.GLXMID === '-1' ? undefined : m.GLXMID;
          t["GLXMID" + t.ID] = m.GLXMID === undefined || m.GLXMID === '-1' ? undefined : m.GLXMID;
          t["ZD4" + t.ID] = m.ZD4;
          t["ZD5" + t.ID] = m.ZD5;
          t["TXR" + t.ID] = m.TXRID === undefined || m.TXRID === '-1' ? undefined : m.TXRID;
          t["TXRID" + t.ID] = m.TXRID === undefined || m.TXRID === '-1' ? undefined : m.TXRID;

          setFieldsValue({
            ["GLXM" + t.ID]: m.GLXMID === undefined || m.GLXMID === '-1' ? undefined : m.GLXMID,
            ["GLXMID" + t.ID]: m.GLXMID === undefined || m.GLXMID === '-1' ? undefined : m.GLXMID,
            ["ZD4" + t.ID]: m.ZD4,
            ["ZD5" + t.ID]: m.ZD5,
            ["TXR" + t.ID]: m.TXRID === undefined || m.TXRID === '-1' ? undefined : m.TXRID,
            ["TXRID" + t.ID]: m.TXRID === undefined || m.TXRID === '-1' ? undefined : m.TXRID,
          })
          setEditData(p => {
              p.push(t);
            return p;
          });
        }
      });
    })
    return temp;
  }

  const getPrjData = useCallback(
    debounce(async value => {
      try {
        setSltData(p => ({ ...p, loading: true }));
        const res = await QueryProjectSelectList({
          // projectManagerUnderOrg: isBGHZR ? Number(userBasicInfo.orgid) : undefined,
          projectOrManagerName: value,
          current: 1,
          pageSize: 9999, //暂定，不分页排不了序
          paging: 1,
          sort: isBGHZR
            ? `DECODE (ORGID,${userBasicInfo.orgid},1,2), XMNF DESC, ID DESC`
            : `DECODE (XMJLID,${userBasicInfo.id},1,2), XMNF DESC, ID DESC`,
          total: -1,
        });
        if (res.success) {
          setSltData(p => ({
            ...p,
            glxm: JSON.parse(res.result)?.map(x => ({
              ...x,
              XMID: x.id,
              XMMC: x.projectName,
            })),
            loading: false,
          }));
          setIsSpinning(false);
        }
      } catch (error) {
        console.error('🚀关联项目下拉框数据', error);
        message.error('关联项目下拉框数据获取失败', 1);
        setIsSpinning(false);
        setSltData(p => ({ ...p, loading: false }));
      }
    }, 500),
    [JSON.stringify(roleData), JSON.stringify(userBasicInfo)],
  );

  const getStaffData = async name => {
    try {
      const res = await QueryMemberSelectList({
        orgId: isBGHZR ? Number(userBasicInfo.orgid) : undefined,
        name,
        current: 1,
        pageSize: 100,
        paging: -1,
        sort: '',
        total: -1,
      });
      if (res.success) {
        setSltData(p => ({
          ...p,
          txr: JSON.parse(res.result),
        }));
        // console.log('🚀 ~ getStaffData ~ JSON.parse(res.result):', JSON.parse(res.result));
      }
    } catch (error) {
      console.error('🚀填写人下拉框数据', error);
      message.error('填写人下拉框数据获取失败', 1);
      setIsSpinning(false);
      setSltData(p => ({ ...p, loading: false }));
    }
  };

  //保存
  const handleOK = () => {
    validateFieldsAndScroll(err => {
      if (!err) {
        setIsSpinning(true);
        //过滤删除的数据
        let editDataDelFilter = editData.filter(
          x => delData.findIndex(item => x.ID === item.ID) === -1,
        );
        // console.log('🚀 ~ handleOK ~ editDataDelFilter:', editDataDelFilter);
        const notNullStr = v => {
          if (['', ' ', undefined, null].includes(v)) return 'undefined';
          return String(v)?.replace(/\t/g, '');
        };
        let submitTable = [];
        let objData = { ...data };
        delete objData.fieldCount;
        editDataDelFilter.forEach((obj = {}) => {
          const restoredObj = { ID: obj.isNew ? '-1' : obj.ID };
          for (const key in { ...objData, ...obj }) {
            if (key !== 'ID' && key in obj) {
              const originalKey = key.replace(obj.ID, '');
              if (originalKey === 'TXR') {
                restoredObj[originalKey] = isBGHZR
                  ? String(notNullStr(obj['TXR' + obj.ID]))
                  : String(notNullStr(obj['TXRID' + obj.ID]));
              } else if (originalKey === 'GLXM') {
                // restoredObj[originalKey] = isBGHZR
                //   ? String(notNullStr(obj['GLXM' + obj.ID]))
                //   : String(notNullStr(obj['GLXMID' + obj.ID]));
                restoredObj[originalKey] = String(
                  ['', ' ', undefined, null].includes(obj['GLXM' + obj.ID])
                    ? -1
                    : obj['GLXM' + obj.ID],
                );
              } else {
                restoredObj[originalKey] = notNullStr(obj[key]);
              }
            } else if (key !== 'ID' && key in objData) {
              const originalKey = key.replace(objData.ID, '');
              restoredObj[originalKey] = notNullStr(objData[key]);
            }
          }
          submitTable.push(restoredObj);
        });
        console.log('🚀 ~ editDataDelFilter submitTable:', submitTable);
        let updateParams = {
          fieldCount: 5,
          infoCount: submitTable.length,
          operateType: 'UPDATE',
          reportId: Number(data['BBID']),
          reportInfo: JSON.stringify(submitTable),
        };
        console.log('🚀 ~ handleOK ~ updateParams:', updateParams);
        if (delData.length !== 0) {
          let deleteTable = [];
          let objData = { ...data };
          delete objData.fieldCount;
          delData.forEach((obj = {}) => {
            const restoredObj = { ID: obj.isNew ? '-1' : obj.ID };
            for (const key in { ...objData, ...obj }) {
              if (key !== 'ID' && key in obj) {
                const originalKey = key.replace(obj.ID, '');
                if (originalKey === 'TXR') {
                  restoredObj[originalKey] = isBGHZR
                    ? String(notNullStr(obj['TXR' + obj.ID]))
                    : String(notNullStr(obj['TXRID' + obj.ID]));
                } else if (originalKey === 'GLXM') {
                  // restoredObj[originalKey] = isBGHZR
                  //   ? String(notNullStr(obj['GLXM' + obj.ID]))
                  //   : String(notNullStr(obj['GLXMID' + obj.ID]));
                  restoredObj[originalKey] = String(notNullStr(obj['GLXM' + obj.ID]));
                } else {
                  restoredObj[originalKey] = notNullStr(obj[key]);
                }
              } else if (key !== 'ID' && key in objData) {
                const originalKey = key.replace(objData.ID, '');
                restoredObj[originalKey] = notNullStr(objData[key]);
              }
            }
            deleteTable.push(restoredObj);
          });
          console.log('🚀 ~ delData. .deleteTable:', deleteTable);
          let deledtParams = {
            fieldCount: 5,
            infoCount: deleteTable.length,
            operateType: 'DELETE',
            reportId: Number(data['BBID']),
            reportInfo: JSON.stringify(deleteTable),
          };
          EditCustomReport({ ...deledtParams })
            .then(res => {
              if (res?.code === 1) {
                if (submitTable.length !== 0) {
                  EditCustomReport({ ...updateParams })
                    .then(res => {
                      if (res?.code === 1) {
                        refresh();
                        handleCancel();
                        message.success('操作成功', 1);
                        setIsSpinning(false);
                      }
                    })
                    .catch(e => {
                      console.error('操作失败', e);
                      message.error('操作失败', 1);
                      setIsSpinning(false);
                    });
                } else {
                  refresh();
                  handleCancel();
                  message.success('操作成功', 1);
                  setIsSpinning(false);
                }
              }
            })
            .catch(e => {
              console.error('操作失败', e);
              message.error('操作失败', 1);
              setIsSpinning(false);
            });
        } else {
          EditCustomReport({ ...updateParams })
            .then(res => {
              if (res?.code === 1) {
                refresh();
                handleCancel();
                message.success('操作成功', 1);
                setIsSpinning(false);
              }
            })
            .catch(e => {
              console.error('操作失败', e);
              message.error('操作失败', 1);
              setIsSpinning(false);
            });
        }
      }
    });
  };

  //取消
  const handleCancel = () => {
    setVisible(false);
    resetFields();
    setEditData([]);
    setDelData([]);
    setIsSpinning(false);
  };

  // 获取上个月填写信息填入
  const getLastMonth = () => {
    const nowTime = new Date(monthData);
    const year = nowTime.getFullYear();
    const month = nowTime.getMonth();
    let date = new Date(year, month, 1); // 创建日期对象，月份是从0开始的，所以减1
    date.setMonth(date.getMonth() - 1); // 将月份减去1
    getData(
      Number(bgid),
      Number(moment(date).format("YYYYMM")),
      roleData.zyrole === '自定义报告管理员' ? 'YBHZ' : 'BMYB',
    );
  }

  const cancel = () => {}

  //表格数据保存
  const handleTableSave = row => {
    setEditData(p => {
      let index = p.findIndex(item => row.ID === item.ID);
      if (index !== -1) {
        p.splice(index, 1, {
          ...p[index], //old row
          ...row, //new row
        });
      } else {
        p.push(row);
      }
      return p;
    });
    setTableData(p => {
      const index = p.findIndex(item => row.ID === item.ID);
      if (index !== -1) {
        p.splice(index, 1, {
          ...p[index], //old row
          ...row, //new row
        });
      }
      return p;
    });
  };

  const columns = [
    ...tableColumns,
    {
      title: '操作',
      dataIndex: 'OPRT',
      width: 80,
      key: 'OPRT',
      align: 'center',
      ellipsis: true,
      render: (_, record) => (
        <Popconfirm
          title="确定要删除吗?"
          onConfirm={() => {
            setTableData(p => p.filter(x => x.ID !== record.ID));
            setEditData(p => p.filter(x => x.ID !== record.ID));
            if (dataArr.findIndex(x => x.ID === record.ID) !== -1) {
              setDelData(p => [...p, record]);
            }
          }}
        >
          <a style={{ color: '#3361ff' }}>删除</a>
        </Popconfirm>
      ),
    },
  ].map(col => {
    if (
      // ((col.dataIndex === 'TXR' || col.dataIndex === 'GLXM') && !isBGHZR) ||
      (col.dataIndex === 'TXR' && !isBGHZR) ||
      !col.editable
    ) {
      col.editable = false;
      // if (col.dataIndex === 'GLXM') {
      //   col.render = txt => (
      //     <Tooltip title={txt} placement="topLeft">
      //       {txt}
      //     </Tooltip>
      //   );
      // }
      return col;
    }
    return {
      ...col,
      onCell: record => {
        return {
          record,
          ...col,
          editable: col.editable,
          dataIndex: col.dataIndex,
          handleSave: handleTableSave,
          key: col.key,
          formdecorate: form,
          sltdata: sltData,
          setsltdata: setSltData,
          label: col?.label,
          getPrjData,
          getStaffData,
          tableColumns,
          isBGHZR,
        };
      },
    };
  });

  //覆盖默认table元素
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <Modal
      wrapClassName="custom-report-detail-add-modal"
      width={'1200px'}
      maskClosable={false}
      zIndex={103}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      // cancelText={'关闭'}
      style={{ top: '10px' }}
      title={null}
      visible={visible}
      okText="保存"
      onOk={handleOK}
      onCancel={handleCancel}
      confirmLoading={isSpinning}
    >
      <div className="body-title-box">
        <strong>报告内容编辑</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <div className="content-box">
          {topData.map(x => (
            <div className="top-info" key={x.title}>
              <span>{x.title} ：</span>
              {data[x.dataIndex]}
            </div>
          ))}
          <Popconfirm
            title={<div>将复制上月系统名称与本月系统名称一致的数据，<br/>覆盖上月工作总结和本月工作计划</div>}
            onConfirm={getLastMonth}
            onCancel={cancel}
            okText="确认"
            cancelText="取消"
          >
            <Button style={{ marginBottom: '16px' }} type="primary">
              复制上月填写内容
            </Button>
          </Popconfirm>
          <Table
            columns={columns}
            components={components}
            rowKey={'ID'}
            rowClassName={() => 'editable-row'}
            dataSource={tableData}
            scroll={{ y: 420 }}
            pagination={false}
            size="middle"
          />

          <div
            className="table-add-row"
            onClick={() => {
              const UUID = new Date().getTime();
              setTableData(p => [
                ...p,
                tableColumns.reduce((obj = {}, item = {}) => {
                  obj.ID = UUID;
                  obj[item.key + UUID] = undefined;
                  obj['TXR' + UUID] = String(userBasicInfo.id);
                  if (item.key === 'TXR') {
                    !isBGHZR
                      ? (obj.TXR = userBasicInfo.name)
                      : (obj['TXR' + UUID] = String(userBasicInfo.id));
                    obj['TXRID' + UUID] = String(userBasicInfo.id);
                  }
                  return obj;
                }, {}),
              ]);
              setEditData(p => [
                ...p,
                tableColumns.reduce((obj = {}, item = {}) => {
                  obj.ID = UUID;
                  obj[item.key + UUID] = undefined;
                  if (item.key === 'TXR') {
                    !isBGHZR
                      ? (obj.TXR = userBasicInfo.name)
                      : (obj['TXR' + UUID] = String(userBasicInfo.id));
                    obj['TXRID' + UUID] = String(userBasicInfo.id);
                  }
                  obj.isNew = true;
                  return obj;
                }, {}),
              ]);
              setTimeout(() => {
                const table = document.querySelectorAll(
                  `.custom-report-detail-add-modal .ant-table-body`,
                )[0];
                if (table) {
                  table.scrollTop = table.scrollHeight;
                }
              }, 200);
            }}
          >
            <span>
              <Icon type="plus" style={{ fontSize: '12px' }} />
              <span style={{ paddingLeft: '6px', fontSize: '14px' }}>新增</span>
            </span>
          </div>
        </div>
      </Spin>
    </Modal>
  );
}
export default connect(({ global = {} }) => ({
  userBasicInfo: global.userBasicInfo,
  dictionary: global.dictionary,
  roleData: global.roleData,
}))(Form.create()(HandleAddModal));
