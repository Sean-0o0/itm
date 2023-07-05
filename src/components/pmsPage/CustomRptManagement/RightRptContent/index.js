import React, { Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import {
  Button,
  Cascader,
  message,
  Popover,
  Table,
  Tree,
  Input,
  Form,
  Modal,
  Select,
  Timeline,
} from 'antd';
import {
  SaveCustomReportSetting,
  QueryCustomQueryCriteria,
  QueryUserInfo,
  QueryReportOperateRecord,
  QueryMemberInfo,
} from '../../../../services/pmsServices/index';
import ConditionFilter from '../ConditionFilter';
import emptyImg from '../../../../assets/homePage/img_no data@2x.png';

export default function RightRptContent(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const {
    basicData = { conditionFilter: [], conditionGroup: [], columnFields: [] },
    selectingData = { conditionFilter: [], conditionGroup: [], columnFields: [] },
    selectedData = { conditionFilter: [], conditionGroup: [], columnFields: [] },
    status = 'normal',
    dragKey,
    rptName,
    editingId = -1,
  } = dataProps;
  const {
    setIsSpinning,
    buildTree,
    setSelectedData,
    setDragKey,
    setRptName,
    setSelectingData,
    hangleDataRestore,
    getRptList,
    setStatus,
  } = funcProps;
  const [popoverVisible, setPopoverVisible] = useState({
    setting: false, //字段设置
    share: false, //分享
    history: false, //操作记录
  }); //浮窗显隐
  const [shareRyData, setShareRyData] = useState({
    selector: [],
    value: [],
    name: [],
    turnRed: false,
  }); //分享人员下拉数据
  const [historyData, setHistoryData] = useState([]); //报表历史操作记录

  useEffect(() => {
    getShareRyData();
    return () => {};
  }, []);

  useEffect(() => {
    if (editingId !== -1) {
      getHistoryData(editingId);
    }
    return () => {};
  }, [editingId]);

  //字段浮窗显隐时数据回显
  useEffect(() => {
    setSelectingData(p => ({
      ...p,
      columnFields: [...selectedData.columnFields],
    }));
    return () => {};
  }, [popoverVisible.setting]);

  //分享浮窗显隐时数据回显
  useEffect(() => {
    setShareRyData(p => ({
      ...p,
      value: [],
    }));
    return () => {};
  }, [popoverVisible.share]);

  //分享人员下拉数据
  const getShareRyData = () => {
    QueryMemberInfo({
      type: 'XXJS',
    })
      .then(res => {
        if (res.success) {
          setShareRyData({ selector: [...JSON.parse(res.record)], value: [] });
        }
      })
      .catch(e => {
        message.error('分享人员下拉数据查询失败', 1);
      });
  };

  //历史操作记录
  const getHistoryData = bbid => {
    QueryReportOperateRecord({
      bbid,
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ QueryReportOperateRecord ~ res', JSON.parse(res.result));
          setHistoryData(JSON.parse(res.result));
        }
      })
      .catch(e => {
        console.error('🚀历史操作记录', e);
        message.error('历史操作记录获取失败', 1);
      });
  };

  //组合、筛选条件变化
  const handleConditionGroupChange = (value, selectedOptions) => {
    // console.log(value, selectedOptions);
    // setSelectingData(p => ({ ...p, conditionGroup: [...selectedOptions] }));
    setSelectedData(p => ({ ...p, conditionGroup: [...p.conditionGroup, [...selectedOptions]] }));
  };
  const handleConditionFilterChange = (value, selectedOptions) => {
    let obj = selectedOptions[selectedOptions.length - 1];
    if (obj.TJBCXLX) {
      setIsSpinning(true);
      QueryCustomQueryCriteria({
        queryType: obj.TJBCXLX,
      })
        .then(res => {
          if (res?.success) {
            // console.log(obj.TJBCXLX, JSON.parse(res.result));
            if (obj.TJBCXLX === 'YSXM') {
              obj.sltOpen = false; //树下拉框展开收起
              function uniqueFunc(arr, uniId) {
                const res = new Map();
                return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1));
              }
              let type = uniqueFunc(JSON.parse(res.result), 'YSLXID');
              let origin = JSON.parse(res.result);
              obj.SELECTORDATA = {
                type,
                origin,
              };
              if (type.length > 0)
                obj.SELECTORVALUE = {
                  type: type[0]?.YSLXID,
                  typeObj: type[0],
                  value: [],
                };
            } else if (obj.ZJLX === 'TREE-MULTIPLE') {
              obj.SELECTORDATA = buildTree(JSON.parse(res.result));
              obj.sltOpen = false; //树下拉框展开收起
            } else if (obj.ZJLX === 'RADIO') {
              obj.SELECTORVALUE = false;
            } else {
              obj.SELECTORDATA = JSON.parse(res.result);
            }
            setIsSpinning(false);
          }
        })
        .catch(e => {
          console.error('🚀', e);
          message.error(obj.TJBCXLX + '信息获取失败', 1);
          setIsSpinning(false);
        });
    }
    setSelectedData(p => ({
      ...p,
      conditionFilter: [...p.conditionFilter, obj],
    }));
  };

  //组合、筛选条件删除
  const onConditionGroupDelete = id => {
    let arr = [...selectedData.conditionGroup].filter(x => x[x.length - 1].ID !== id);
    setSelectedData(p => ({ ...p, conditionGroup: arr }));
  };
  const onConditionFilterDelete = id => {
    console.log('🚀 ~ file: index.js:110 ~ onConditionFilterDelete ~ id:', id);
    let arr = [...selectedData.conditionFilter].filter(x => x.ID !== id);
    setSelectedData(p => ({ ...p, conditionFilter: arr }));
  };

  //获取组合、筛选条件树形数据
  const getConditionGroupTreeData = () => {
    let idArr = selectedData.conditionGroup.map(x => x[x?.length - 1].ID);
    let arr = basicData.conditionGroup.filter(x => !idArr.includes(x.ID));
    let treeData = buildTree(arr);
    // 递归遍历树，处理没有子节点的元素
    const traverse = node => {
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          traverse(child);
        });
        node.disabled = false;
      } else {
        if (node.GRADE < 3 && node.ID !== 19 && node.FID !== 28) {
          node.disabled = true;
        }
      }
    };
    // 处理没有子节点的元素
    treeData.forEach(node => {
      traverse(node);
    });
    return treeData;
  };
  const getConditionFilterTreeData = () => {
    let idArr = selectedData.conditionFilter.map(x => x.ID);
    let arr = basicData.conditionFilter.filter(x => !idArr.includes(x.ID));
    let treeData = buildTree(arr);
    // 递归遍历树，处理没有子节点的元素
    const traverse = node => {
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          traverse(child);
        });
        node.disabled = false;
      } else {
        if (node.GRADE < 2) {
          node.disabled = true;
        }
      }
    };
    // 处理没有子节点的元素
    treeData.forEach(node => {
      traverse(node);
    });
    return treeData;
  };

  //分享浮窗
  const shareContent = () => {
    const onChange = (v, nodeArr) => {
      let nameArr = nodeArr.map(x => x.props?.name);
      setShareRyData(p => ({ ...p, value: v, name: nameArr, turnRed: v.length === 0 }));
    };
    const onBlur = () => {
      setShareRyData(p => ({ ...p, turnRed: p.value.length === 0 }));
    };
    const onCancel = () => {
      setShareRyData(p => ({ ...p, value: [], turnRed: false }));
      setPopoverVisible(p => ({ ...p, share: false }));
    };
    const onConfirm = () => {
      if (shareRyData.value.length !== 0) {
        setPopoverVisible(p => ({ ...p, share: false }));
        Modal.confirm({
          title: '提示：',
          content: `是否确定分享给${shareRyData.name.join('、')}吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            if (editingId !== -1) {
              SaveCustomReportSetting({
                cxzd: [],
                cxb: [],
                sxtj: [],
                qdzssxzd: [],
                qdzszhzd: [],
                qdzsbtzd: [],
                bbid: editingId,
                bbmc: shareRyData.value.join(';'),
                czlx: 'SHARE',
              })
                .then(res => {
                  if (res?.success) {
                    getHistoryData(editingId);
                    getRptList();
                    message.success('分享成功', 1);
                    setIsSpinning(false);
                  }
                })
                .catch(e => {
                  console.error('🚀分享', e);
                  message.error('分享失败', 1);
                  setIsSpinning(false);
                });
            }
          },
        });
      } else {
        setShareRyData(p => ({ ...p, turnRed: true }));
      }
    };
    return (
      <div className="share-box">
        <Form.Item
          className="selector"
          label="分享人员"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          required
          help={shareRyData.turnRed ? '分享人员不能为空' : null}
          validateStatus={shareRyData.turnRed ? 'error' : 'success'}
        >
          <Select
            style={{ width: '100%' }}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            mode="multiple"
            maxTagCount={3}
            maxTagPlaceholder={extraArr => {
              return `等${extraArr.length + 3}个`;
            }}
            showSearch
            allowClear
            value={shareRyData.value}
            onChange={onChange}
            placeholder="请选择"
          >
            {shareRyData.selector?.map(x => (
              <Select.Option key={x.id} value={x.id} name={x.name}>
                {x.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <div className="footer-btn">
          <Button className="btn-cancel" onClick={onCancel}>
            取消
          </Button>
          <Button className="btn-submit" type="primary" onClick={onConfirm}>
            确定
          </Button>
        </div>
      </div>
    );
  };

  //操作记录浮窗
  const historyContent = () => {
    const getName = id => shareRyData.selector.filter(x => Number(x.id) === id)[0]?.name;
    return (
      <Timeline className="history-box">
        {historyData.map((x, i) => (
          <Timeline.Item color="#3361ff" className="history-item" key={i}>
            <div>
              {getName(x.CZR) +
                (x.CZFF === '分享'
                  ? '把模版分享给了' + x.FXDX?.replace(/,/g, '、')
                  : x.CZFF + '了模板信息')}
            </div>
            <span>
              {x.CZSJ &&
                moment(x.CZSJ.substring(0, 8) + ' ' + x.CZSJ.substring(8)).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
            </span>
          </Timeline.Item>
        ))}
      </Timeline>
    );
  };

  //表格字段设置浮窗
  const columnFieldsSetting = () => {
    //选择中的字段数据
    const onColumnFieldsCheck = (checkedKeys, e) => {
      let nodeArr = e?.checkedNodes?.map(x => ({
        ...x.props,
      }));
      setSelectingData(p => ({
        ...p,
        columnFields: nodeArr.filter(x => x.GRADE !== 1),
      }));
    };

    //清空
    const onColumnFieldsClear = () => {
      setSelectingData(p => ({ ...p, columnFields: p.columnFields.filter(x => x.ID === 8) }));
    };

    //单个删除
    const onColumnFieldsDelete = id => {
      if (id !== 8) {
        //项目名称不允许删除，ID为8
        let arr = [...selectingData.columnFields].filter(x => x.ID !== id);
        setSelectingData(p => ({ ...p, columnFields: arr }));
      }
    };

    //取消
    const onColumnFieldsCancel = () => {
      setPopoverVisible(p => ({ ...p, setting: false }));
    };

    //确定
    const onColumnFieldsConfirm = () => {
      // console.log('selectingData.columnFields', selectingData.columnFields);
      setSelectedData(p => ({ ...p, columnFields: [...selectingData.columnFields] }));
      onColumnFieldsCancel();
    };

    //拖拽实现
    const handleDragStart = e => {
      e.persist();
      const index = parseInt(e.currentTarget.dataset.index);
      setDragKey(index);
    };
    const handleDragOver = e => {
      e.persist();
      e.preventDefault();
    };
    const handleDrop = e => {
      e.persist();
      const index = parseInt(e.currentTarget.dataset.index);
      if (index !== dragKey) {
        const arr = Array.from(selectingData.columnFields);
        const removedIndex = arr.findIndex(x => x.ID === dragKey);
        const originIndex = arr.findIndex(x => x.ID === index);
        const temp = arr[removedIndex];

        arr.splice(removedIndex, 1);
        arr.splice(originIndex, 0, temp);
        setSelectingData(p => ({ ...p, columnFields: arr }));
      }
      setDragKey(null);
    };

    return (
      <div className="setting-box">
        <div className="content">
          <div className="left">
            <div className="top">可选字段(**)</div>
            <div className="list">
              <Tree
                treeData={basicData.columnFields}
                checkable
                selectable={false}
                // defaultCheckedKeys={selectedData.columnFields.map(x => x.ID)}
                checkedKeys={selectingData.columnFields.map(x => x.ID)}
                onCheck={onColumnFieldsCheck}
              ></Tree>
            </div>
          </div>
          <div className="right">
            <div className="top">
              已选字段({selectingData.columnFields.length})
              <span onClick={onColumnFieldsClear}>清空</span>
            </div>
            <div className="list">
              {selectingData.columnFields.map(x => (
                <div
                  className="slted-item"
                  key={x?.ID}
                  data-index={x?.ID}
                  draggable
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <i className="iconfont icon-drag-2" />
                  <span>{x?.title}</span>
                  {x?.ID !== 8 && (
                    <i
                      className="iconfont icon-close"
                      onClick={() => onColumnFieldsDelete(x?.ID)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-btn">
          <Button className="btn-cancel" onClick={onColumnFieldsCancel}>
            取消
          </Button>
          <Button className="btn-submit" type="primary" onClick={onColumnFieldsConfirm}>
            确定
          </Button>
        </div>
      </div>
    );
  };

  //表格字段、字段新增浮窗
  const columns = [
    ...selectedData.columnFields.map((x, i) => {
      return {
        title: x.title,
        dataIndex: x.ZSZD,
        key: x.ZSZD,
        align: 'left',
        width: x.title?.length * 20,
      };
    }),
    {
      title: (
        <Popover
          placement="left"
          content={columnFieldsSetting()}
          overlayClassName="custom-rpt-management-popover"
          title={null}
          trigger="click"
          visible={popoverVisible.setting}
          onVisibleChange={v => setPopoverVisible(p => ({ ...p, setting: v }))}
          arrowPointAtCenter
          // autoAdjustOverflow={false}
          // getPopupContainer = {() => document.body}
        >
          <i className="iconfont icon-set" />
        </Popover>
      ),
      dataIndex: 'setting',
      key: 'setting',
      align: 'left',
      width: '58px',
      // fixed: 'left',
    },
  ];

  //报表名称
  const handleRptNameChange = e => {
    setRptName(e.target.value);
  };

  //操作按钮
  //删除
  const handleDelete = () => {
    Modal.confirm({
      title: '提示：',
      content: `是否确定删除该报表？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        hangleDataRestore();
        if (editingId !== -1) {
          SaveCustomReportSetting({ bbid: editingId, czlx: 'DELETE' })
            .then(res => {
              if (res?.success) {
                message.success('删除成功', 1);
                getRptList(); //刷新数据
                setIsSpinning(false);
              }
            })
            .catch(e => {
              console.error('🚀删除', e);
              message.error('删除失败', 1);
              setIsSpinning(false);
            });
        } else {
          message.success('删除成功', 1);
        }
      },
    });
  };
  //保存
  const handleSave = () => {
    if (rptName !== '') {
      if (rptName === '未命名报表') {
        message.error('请修改默认报表名称', 1);
      } else {
        setIsSpinning(true);
        const zszdArr = selectedData.columnFields.map(x => ({ ID: x.ID, ZSZD: x.ZSZD }));
        let bmArr = ['TXMXX_XMXX XM'];
        let sxtjArr = [];
        let columnFieldsArr = [...selectedData.columnFields];
        let conditionFilterArr = JSON.parse(JSON.stringify(selectedData.conditionFilter));
        let conditionGroupArr = [...selectedData.conditionGroup];
        columnFieldsArr.forEach(x => {
          bmArr.push(x.BM);
        });
        conditionFilterArr.forEach(x => {
          let SXSJ = x.SELECTORVALUE;
          let SXLX = x.ZJLX;
          let SXTJ = x.SXTJ;
          if (
            SXSJ !== undefined &&
            SXSJ !== null &&
            JSON.stringify(SXSJ) !== '[]' &&
            JSON.stringify(SXSJ?.value) !== '[]'
          ) {
            if (x.ZJLX === 'DATE') {
              if (x.SELECTORVALUE[0] === '' && x.SELECTORVALUE[1] === '') {
                SXSJ = [0, 20500000];
              } else {
                SXSJ = [
                  Number(moment(x.SELECTORVALUE[0]).format('YYYYMMDD')),
                  Number(moment(x.SELECTORVALUE[1]).format('YYYYMMDD')),
                ];
              }
              bmArr.push(x.BM);
            } else if (x.ZJLX === 'RANGE') {
              SXSJ = [x.SELECTORVALUE.min || 0, x.SELECTORVALUE.max || 9999999999];
              bmArr.push(x.BM);
            } else if (x.ZJLX === 'RADIO') {
              //目前只有是否为父项目，暂时写死以下情况
              SXSJ = undefined;
              SXLX = 'ZHTJ';
              if (x.SELECTORVALUE) {
                SXTJ = '(SELECT COUNT(*) FROM TXMXX_XMXX WHERE GLFXM = XM.ID AND ZT != 0 ) > 0';
              } else {
                SXTJ = '(SELECT COUNT(*) FROM TXMXX_XMXX WHERE GLFXM = XM.ID AND ZT != 0 ) <= 0';
              }
              bmArr.push(x.BM);
            } else if (x.TJBCXLX === 'YSXM') {
              if (JSON.stringify(SXSJ?.value) !== '[]') {
                SXSJ = x.SELECTORVALUE.value;
                SXTJ = x.SELECTORVALUE.typeObj?.CXTJ;
                SXLX = 'MULTIPLE';
              } else {
                SXSJ = [];
                if (x.SELECTORVALUE.typeObj?.YSLXID === 1) {
                  SXTJ = 'XM.GLYSXM IS NOT NULL';
                } else if (x.SELECTORVALUE.typeObj?.YSLXID === 2) {
                  SXTJ = 'XM.GLFZBYSXM IS NOT NULL';
                } else if (x.SELECTORVALUE.typeObj?.YSLXID === 3) {
                  SXTJ = 'XM.GLKYYS IS NOT NULL';
                } else {
                  SXTJ = 'XM.GLYSXM <=0';
                }
                SXLX = 'ZHTJ';
              }
              bmArr.push(x.SELECTORVALUE.typeObj?.CXB);
            } else {
              bmArr.push(x.BM);
            }
            sxtjArr.push({
              SXLX,
              SXTJ,
              SXSJ,
            });
          }
          delete x.SELECTORDATA;
        });
        conditionGroupArr.forEach(x => {
          bmArr.push(x[x.length - 1].BM);
          sxtjArr.push({
            SXLX: 'ZHTJ',
            SXTJ: x[x.length - 1].SXTJ,
            SXSJ: [],
          });
        });
        bmArr = [...new Set(bmArr)]; //去重

        let params = {
          sxtj: sxtjArr,
          cxb: bmArr,
          cxzd: zszdArr,
          qdzssxzd: conditionFilterArr,
          qdzszhzd: conditionGroupArr,
          qdzsbtzd: columnFieldsArr,
          czlx: status === 'adding' ? 'ADD' : 'UPDATE',
          bbid: status === 'adding' ? -1 : editingId,
          bbmc: rptName,
        };
        console.log('🚀 ~ file: index.js:439 ~ handleSave ~ params:', params);
        //保存自定义报表配置
        SaveCustomReportSetting(params)
          .then(res => {
            if (res?.success) {
              message.success('保存成功', 1);
              getRptList(); //刷新数据
              setStatus('normal');
              setIsSpinning(false);
            }
          })
          .catch(e => {
            console.error('🚀保存', e);
            message.error('保存失败', 1);
            setIsSpinning(false);
          });
      }
    }
  };

  return (
    <div className="rpt-right">
      <div className="rpt-header">
        <Form.Item
          className="rpt-title"
          required
          help={rptName === '' ? '报表名称不能为空' : null}
          validateStatus={rptName === '' ? 'error' : 'success'}
        >
          <Input
            placeholder="请输入报表名称"
            value={rptName}
            onChange={handleRptNameChange}
            allowClear
          />
        </Form.Item>
        {status !== 'adding' && (
          <Button className="btn-delete" onClick={handleDelete}>
            删除
          </Button>
        )}
        {/* <Button className="btn-cancel">取消</Button> */}
        <Button className="btn-save" onClick={handleSave}>
          保存
        </Button>
        {status === 'editing' ? (
          <Fragment>
            <Popover
              placement="bottomRight"
              content={historyContent()}
              overlayClassName="custom-rpt-management-popover"
              title={null}
              trigger="click"
              visible={popoverVisible.history}
              onVisibleChange={v => setPopoverVisible(p => ({ ...p, history: v }))}
              arrowPointAtCenter
            >
              <Button className="btn-history">操作记录</Button>
            </Popover>
            <Popover
              placement="bottomRight"
              content={shareContent()}
              overlayClassName="custom-rpt-management-popover"
              title={null}
              trigger="click"
              visible={popoverVisible.share}
              onVisibleChange={v => setPopoverVisible(p => ({ ...p, share: v }))}
              arrowPointAtCenter
            >
              <Button className="btn-share" type="primary">
                分享
              </Button>
            </Popover>
          </Fragment>
        ) : null}
      </div>
      <div className="rpt-content">
        <div className="top">
          <ConditionFilter
            options={getConditionFilterTreeData()}
            data={selectedData.conditionFilter}
            onChange={handleConditionFilterChange}
            onDelete={onConditionFilterDelete}
            setData={v => {
              setSelectedData(p => ({ ...p, conditionFilter: v }));
            }}
          />
          <div className="group-condition">
            <span className="label">组合条件</span>
            {selectedData.conditionGroup.map(x => (
              <div className="condition-group-item" key={x[x.length - 1].ID}>
                {x.length - 2 >= 0 && x[x.length - 2].NAME + ' - '}
                {x[x.length - 1].NAME}
                <i
                  className="iconfont icon-close"
                  onClick={() => onConditionGroupDelete(x[x.length - 1].ID)}
                />
              </div>
            ))}
            <Cascader
              options={getConditionGroupTreeData()}
              onChange={handleConditionGroupChange}
              popupClassName="custom-rpt-management-cascader"
            >
              <Button type="dashed" icon={'plus-circle'}>
                添加组合条件
              </Button>
            </Cascader>
          </div>
        </div>
        <div className="bottom">
          <div className="table-box">
            <div className="table-header">
              {columns.map(x => (
                <div className="header-item" key={x.dataIndex}>
                  {x.title}
                </div>
              ))}
            </div>
            <div className="table-empty">
              <img src={emptyImg} alt="" />
              <div>暂无数据</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
