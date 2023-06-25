import React, { useEffect, useState, useRef } from 'react';
import { Button, Cascader, message, Popover, Spin, Table, Tree, Breadcrumb, Input } from 'antd';
import moment from 'moment';
import {
  QueryCustomQueryCriteria,
  SaveCustomReportSetting,
  SaveCustomReportSettingU,
} from '../../../services/pmsServices/index';
import ConditionFilter from './ConditionFilter';
import Form from 'antd/es/form/Form';

const { TreeNode } = Tree;

export default function CustomRptManagement(props) {
  const {} = props;
  const [basicData, setBasicData] = useState({
    conditionFilter: [],
    conditionGroup: [],
    columnFields: [],
  }); //条件基础数据
  const [selectingData, setSelectingData] = useState({
    conditionFilter: [],
    conditionGroup: [],
    columnFields: [],
  }); //选择中条件数据 - 确定前
  const [selectedData, setSelectedData] = useState({
    conditionFilter: [],
    conditionGroup: [],
    columnFields: [],
  }); //已选条件数据
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [popoverVisible, setPopoverVisible] = useState({
    setting: false, //字段设置
    share: false, //分享
    history: false, //操作记录
  }); //浮窗显隐
  const [dragKey, setDragKey] = useState(null); //拖动id
  const [rptName, setRptName] = useState('未命名报表'); //报表名称

  useEffect(() => {
    getBasicData();
    return () => {};
  }, []);

  //浮窗显隐时数据回显
  useEffect(() => {
    setSelectingData(p => ({
      ...p,
      columnFields: [...selectedData.columnFields],
    }));
    return () => {};
  }, [popoverVisible.setting]);

  // 获取条件基础数据
  const getBasicData = () => {
    setIsSpinning(true);
    QueryCustomQueryCriteria({
      queryType: 'SXTJ',
    })
      .then(res => {
        if (res?.success) {
          let data = JSON.parse(res.result);
          QueryCustomQueryCriteria({
            queryType: 'ZHTJ',
          })
            .then(res => {
              if (res?.success) {
                let data2 = JSON.parse(res.result);
                QueryCustomQueryCriteria({
                  queryType: 'ZSZD',
                })
                  .then(res => {
                    if (res?.success) {
                      let data3 = buildTree(JSON.parse(res.result), 'title', 'key');
                      console.log(
                        '🚀 ~ file: index.js:62 ~ getBasicData ~ data3:',
                        data,
                        data2,
                        data3,
                      );
                      setBasicData({
                        conditionFilter: data,
                        conditionGroup: data2,
                        columnFields: data3,
                      });
                      //筛选条件和展示字段默认项目名称
                      let conditionFilterXmmc = data.filter(x => x.ID === 8)[0];
                      let columnFieldsXmmc = JSON.parse(res.result).filter(x => x.ID === 8)[0];
                      columnFieldsXmmc.title = columnFieldsXmmc.NAME;
                      columnFieldsXmmc.key = columnFieldsXmmc.ID;
                      if (conditionFilterXmmc.TJBCXLX) {
                        QueryCustomQueryCriteria({
                          queryType: conditionFilterXmmc.TJBCXLX,
                        })
                          .then(res => {
                            if (res?.success) {
                              conditionFilterXmmc.SELECTORDATA = JSON.parse(res.result);
                              setSelectedData(p => ({
                                ...p,
                                conditionFilter: [conditionFilterXmmc],
                                columnFields: [columnFieldsXmmc],
                              }));
                              setIsSpinning(false);
                            }
                          })
                          .catch(e => {
                            console.error('🚀', e);
                            message.error(obj.TJBCXLX + '信息获取失败', 1);
                            setIsSpinning(false);
                          });
                      }
                    }
                  })
                  .catch(e => {
                    console.error('🚀', e);
                    message.error('表格字段信息获取失败', 1);
                    setIsSpinning(false);
                  });
              }
            })
            .catch(e => {
              console.error('🚀', e);
              message.error('组合条件获取失败', 1);
              setIsSpinning(false);
            });
        }
      })
      .catch(e => {
        console.error('🚀', e);
        message.error('筛选条件信息获取失败', 1);
        setIsSpinning(false);
      });
  };

  //转树结构
  function buildTree(list, label = 'label', value = 'value') {
    let map = {};
    let treeData = [];

    list.forEach(item => {
      map[item.ID] = item;
      item[value] = item.ID;
      item[label] = item.NAME;
      item.children = [];
    });

    // 递归遍历树，处理没有子节点的元素
    const traverse = node => {
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          traverse(child);
        });
      } else {
        // 删除空的 children 数组
        delete node.children;
      }
    };

    list.forEach(item => {
      let parent = map[item.FID];
      if (!parent) {
        treeData.push(item);
      } else {
        parent.children.push(item);
        item.fid = parent.ID;
      }
    });

    // 处理没有子节点的元素
    treeData.forEach(node => {
      traverse(node);
    });

    return treeData;
  }

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
            console.log(obj.TJBCXLX, JSON.parse(res.result));
            if (obj.TJBCXLX === 'YSXM') {
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
    return (
      <div className="box">
        <Form.Item
          className="selector"
          required
          help={rptName === '' ? '报表名称不能为空' : null}
          validateStatus={rptName === '' ? 'error' : 'success'}
        ></Form.Item>
        <div className="footer-btn"></div>
      </div>
    );
  };
  //操作记录浮窗
  const historyContent = () => {};

  //表格字段设置浮窗
  const columnFieldsSetting = () => {
    //选择中的字段数据
    const onColumnFieldsCheck = (checkedKeys, e) => {
      let nodeArr = e?.checkedNodes?.map(x => ({
        ...x.props,
      }));
      // console.log('🚀 ~ file: index.js:245 ~ nodeArr ~ nodeArr:', nodeArr);
      setSelectingData(p => ({
        ...p,
        columnFields: nodeArr.filter(x => x.GRADE !== 1),
      }));
    };

    //清空
    const onColumnFieldsClear = () => {
      setSelectingData(p => ({ ...p, columnFields: [] }));
    };

    //单个删除
    const onColumnFieldsDelete = id => {
      let arr = [...selectingData.columnFields].filter(x => x.ID !== id);
      setSelectingData(p => ({ ...p, columnFields: arr }));
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
                  <i className="iconfont icon-close" onClick={() => onColumnFieldsDelete(x?.ID)} />
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
    {
      title: (
        <Popover
          placement="bottomRight"
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
    ...selectedData.columnFields.map((x, i) => {
      return {
        title: x.title,
        dataIndex: x.ZSZD,
        key: x.ZSZD,
        align: 'left',
        width: x.title?.length * 20,
      };
    }),
  ];

  //报表名称
  const handleRptNameChange = e => {
    setRptName(e.target.value);
  };

  //操作按钮
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
              SXSJ = [
                Number(moment(x.SELECTORVALUE).format('YYYYMMDD')),
                Number(moment(x.SELECTORVALUE).format('YYYYMMDD')),
              ];
              bmArr.push(x.BM);
            } else if (x.ZJLX === 'RANGE') {
              SXSJ = [x.SELECTORVALUE.min || 0, x.SELECTORVALUE.max || 9999999999];
              bmArr.push(x.BM);
            } else if (x.TJBCXLX === 'YSXM') {
              SXSJ = x.SELECTORVALUE.value;
              SXTJ = x.SELECTORVALUE.typeObj?.CXTJ;
              SXLX = 'MULTIPLE';
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
          czlx: 'ADD',
          bbid: -1,
          bbmc: rptName,
        };
        console.log('🚀 ~ file: index.js:438 ~ handleSave ~ params:', params);
        //保存自定义报表配置
        SaveCustomReportSetting(params)
          .then(res => {
            if (res?.success) {
              message.success('保存成功', 1);
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
    <div className="custom-rpt-management-box">
      <Spin
        spinning={isSpinning}
        tip="加载中"
        size="large"
        wrapperClassName="diy-style-spin-custom-rpt-management"
      >
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="">Application Center</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="">Application List</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>An Application</Breadcrumb.Item>
        </Breadcrumb>
      </Spin>
      <div className="bottom-wrapper">
        <div className="rpt-sider"></div>
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

            <Button className="btn-delete">删除</Button>
            {/* <Button className="btn-cancel">取消</Button> */}
            <Button className="btn-save" onClick={handleSave}>
              保存
            </Button>
            <Button className="btn-history">操作记录</Button>
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
          </div>
          <div className="rpt-content">
            <div className="top">
              <ConditionFilter
                options={getConditionFilterTreeData()}
                data={selectedData.conditionFilter}
                onChange={handleConditionFilterChange}
                onDelete={onConditionFilterDelete}
                setData={v => setSelectedData(p => ({ ...p, conditionFilter: v }))}
              />
              <div className="group-condition">
                <span className="label">组合条件</span>
                {selectedData.conditionGroup.map(x => (
                  <div className="condition-group-item">
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
              <Table
                columns={columns}
                rowKey={'ID'}
                dataSource={[]}
                pagination={false}
                bordered
                // scroll={{ x: tablewidth }}
                scroll={{ x: true }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
