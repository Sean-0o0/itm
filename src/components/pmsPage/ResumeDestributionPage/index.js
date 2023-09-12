import React, { useEffect, useState, useLayoutEffect, Fragment } from 'react';
import {
  Button,
  Empty,
  Input,
  Checkbox,
  message,
  Modal,
  Popconfirm,
  Spin,
  Tabs,
  Breadcrumb,
  Popover,
} from 'antd';
import moment from 'moment';
import config from '../../../utils/config';
import axios from 'axios';
import {
  ResumeDistribution,
  InsertResumeDownloadRecord,
  QueryResumeDownloadRecords,
} from '../../../services/pmsServices';
import { Link } from 'react-router-dom';
// import ResumeListModal from './ResumeListModal';

const { TabPane } = Tabs;
const { api } = config;
const {
  pmsServices: { queryFileStream, zipLivebosFilesRowsPost },
} = api;
const { Item } = Breadcrumb;
const LOGIN_USER_NAME = JSON.parse(sessionStorage.getItem('user')).name;

export default function ResumeDistributionPage(props) {
  const { params = {}, routes = [] } = props;
  const { JLXX = [], xqid, swzxid, reflush, XMXX, isAuth, isDock } = params;
  const [isSpinning, setIsSpinning] = useState(false);
  const [data, setData] = useState([]); //数据
  const [dataShow, setDataShow] = useState([]); //数据展示
  const [unsavedData, setUnsavedData] = useState([]); //上一次保存的数据/每次保存前的数据
  const [emptyArr, setEmptyArr] = useState([]); //为空的数据 - 用于接口提交
  const [activeKey, setActiveKey] = useState('1');
  const [jlTotal, setJlTotal] = useState(0); //简历数量
  const [editing, setEditing] = useState(false); //编辑状态
  const [batchDownload, setBatchDownload] = useState(false); //批量下载状态
  const [batchDownloadList, setBatchDownloadList] = useState([]); //批量下载选中的数据
  const [downloadedResumeList, setDownloadedResumeList] = useState([]); //已下载的简历数据
  // const [listModalVisible, setListModalVisible] = useState(false); //列表弹窗显隐

  useEffect(() => {
    // console.log(JLXX);
    if (JLXX.length > 0) {
      // console.log('🚀 ~ file: index.js:41 ~ useEffect ~ JLXX:', JLXX);
      setActiveKey(JLXX[0].RYXQ);
      let jlxxdata = JSON.parse(JSON.stringify(JLXX));
      //处理不分发的前缀标记
      jlxxdata.forEach(obj => {
        obj.DATA.forEach(item => {
          item.JLDATA.forEach(jItem => {
            if (jItem.JLMC.substring(0, 4) === '%no%') {
              jItem.destributeCancel = true;
              jItem.JLMC = jItem.JLMC.substring(4);
            }
          });
        });
      });
      // console.log('🚀 ~ file: index.js:54 ~ jlxxdata.forEach ~ jlxxdata:', jlxxdata);
      setData(JSON.parse(JSON.stringify(jlxxdata)));
      setUnsavedData([...JSON.parse(JSON.stringify(jlxxdata))]);
      let arr = JSON.parse(JSON.stringify(jlxxdata));
      arr.forEach(x => {
        x.DATA.forEach(y => {
          y.UNFOLD = false;
          y.SHOWFOLD = y.JLDATA?.length > 8;
          if (y.JLDATA?.length > 8) {
            y.JLDATA = y.JLDATA.slice(0, 8);
          }
        });
      });
      setDataShow(arr);
      let total = 0;
      JLXX.forEach(x => {
        let total2 = 0;
        x.DATA.forEach(y => {
          total2 += y.JLDATA.length;
        });
        total += total2;
      });
      setJlTotal(total);
    }

    queryResumeInsertRecords();
    return () => {};
  }, [JSON.stringify(JLXX)]);

  // 判断简历是否被下载过
  const isNewResume = x => {
    let flag = false; // 是否下载过
    downloadedResumeList.forEach(item => {
      if (item.entryno == x.ENTRYNO && item.jlid == x.JLID) {
        flag = true;
      }
    });
    return flag;
  };

  const queryResumeInsertRecords = () => {
    setIsSpinning(true);
    QueryResumeDownloadRecords({
      xqid: Number(xqid),
    })
      .then(res => {
        const { code = 0, note = '', records } = res;
        setIsSpinning(false);
        if (code > 0) {
          let result = JSON.parse(records);
          setDownloadedResumeList(result);
        } else {
          message.error(note);
        }
      })
      .catch(err => {
        setIsSpinning(false);
        message.error(err);
      });
  };

  //分发
  const handleDestribute = () => {
    setIsSpinning(true);
    let arr = data.filter(x => x.RYXQ === activeKey)[0].DATA;
    if (arr.length > 0) {
      const groupedData = {};
      for (const item of arr) {
        const { GYSID } = item;
        for (const jldata of item.JLDATA) {
          const { JLID, JLMC, NEXTID } = jldata;
          if (!groupedData[JLID]) {
            groupedData[JLID] = [];
          }
          const groupItem = groupedData[JLID].find(group => group.GYSID === GYSID);
          if (groupItem) {
            // group already exists
            if (jldata.destributeCancel) {
              groupItem.JLMC.items.push([jldata.ENTRYNO, '%no%' + jldata.JLMC.trim()]);
            } else {
              groupItem.JLMC.items.push([jldata.ENTRYNO, jldata.JLMC.trim()]);
            }
          } else {
            // create new group
            if (jldata.destributeCancel) {
              groupedData[JLID].push({
                JLID,
                GYSID,
                JLMC: {
                  nextId: NEXTID,
                  items: [[jldata.ENTRYNO, '%no%' + jldata.JLMC.trim()]],
                },
              });
            } else {
              groupedData[JLID].push({
                JLID,
                GYSID,
                JLMC: {
                  nextId: NEXTID,
                  items: [[jldata.ENTRYNO, jldata.JLMC.trim()]],
                },
              });
            }
          }
        }
      }
      const submitArr = Object.values(groupedData).flatMap(group => group);

      let submitArr2 = submitArr.map(x => {
        return {
          JLID: x.JLID,
          GYSID: x.GYSID,
          JLMC: JSON.stringify(x.JLMC).replace(/"/g, '!'),
        };
      });
      submitArr2 = submitArr2.concat([...emptyArr]);
      console.log('🚀 ~ file: index.js:124 ~ handleDestribute ~ submitArr2:', submitArr2);
      ResumeDistribution({
        xqid: Number(xqid),
        swzxid: Number(swzxid),
        wjmc: JSON.stringify(submitArr2),
        count: submitArr2.length,
      })
        .then(res => {
          if (res?.success) {
            message.success('分发成功', 1);
            setIsSpinning(false);
          }
        })
        .catch(e => {
          message.error('分发失败', 1);
        });
    }
  };

  //展开、收起
  const handleUnfold = (bool, GYSID) => {
    let arr = JSON.parse(JSON.stringify(data));
    arr.forEach(x => {
      if (x.RYXQ === activeKey) {
        x.DATA.forEach(y => {
          if (y.GYSID === GYSID) {
            y.UNFOLD = bool;
          }
          y.SHOWFOLD = y.JLDATA?.length > 8;
          if (!bool) {
            y.JLDATA = y.JLDATA.slice(0, 8);
          }
        });
      }
    });
    setDataShow([...arr]);
  };

  //供应商块
  const getSplierItem = ({ GYSMC = '--', JLDATA = [], UNFOLD, GYSID, SHOWFOLD }, index) => {
    //文件下载
    const handleFileDownload = (id, fileName, entryno) => {
      setIsSpinning(true);
      axios({
        method: 'POST',
        url: queryFileStream,
        responseType: 'blob',
        data: {
          objectName: 'TWBXQ_JLSC',
          columnName: 'JL',
          id,
          title: fileName,
          extr: entryno,
          type: '',
        },
      })
        .then(res => {
          const href = URL.createObjectURL(res.data);
          const a = document.createElement('a');
          a.download = fileName;
          a.href = href;
          a.click();
          window.URL.revokeObjectURL(a.href);
          setIsSpinning(false);
          insertResumeDownloadRecord([
            {
              JLID: id,
              ENTRYNO: entryno,
              JLMC: fileName,
            },
          ]);
        })
        .catch(err => {
          setIsSpinning(false);
          message.error('简历下载失败', 1);
        });
    };
    //单个编辑完成
    const handleInputBlur = (e, x) => {
      e.persist();
      const oldSuffix = x.JLMC.slice(x.JLMC.lastIndexOf('.')); //旧的文件后缀
      const newSuffix = e.target.value.slice(e.target.value.lastIndexOf('.')); //新的文件后缀
      const newFileName = e.target.value.slice(0, e.target.value.lastIndexOf('.'));
      const newNameOldSuffix = newFileName + oldSuffix;
      //编辑完保存数据
      const afterEdit = (newValue = '') => {
        let arr = data.filter(x => x.RYXQ === activeKey)[0]?.DATA;
        if (arr.length > 0) {
          let jldata = [...arr[index].JLDATA];
          jldata.forEach(j => {
            if (j.ENTRYNO === x.ENTRYNO && j.JLID === x.JLID && j.JLMC === x.JLMC) {
              j.JLMC = newValue;
            }
          });
          arr[index].JLDATA = jldata;
          let dataArr = JSON.parse(JSON.stringify(data));
          dataArr.forEach(d => {
            if (d.RYXQ === activeKey) {
              d.DATA = [...arr];
            }
          });
          setData([...dataArr]);
          let arrShow = JSON.parse(JSON.stringify(dataArr));
          arrShow.forEach(x => {
            x.DATA.forEach(y => {
              y.UNFOLD = false;
              y.SHOWFOLD = false;
            });
          });
          setDataShow(arrShow);
        }
      };

      if (e.target.value === '') {
        message.error('文件全名不能为空', 1);
        afterEdit(x.JLMC + ' ');
      } else if (newFileName === '') {
        message.error('文件名不能为空', 1);
        afterEdit(x.JLMC + ' ');
      } else if (newSuffix === '') {
        message.error('文件扩展名不能为空', 1);
        afterEdit(x.JLMC + ' ');
      } else {
        if (oldSuffix.trim() !== newSuffix.trim()) {
          Modal.confirm({
            content: (
              <div>
                修改文件扩展名，可能导致文件不可用。<div>是否确定修改？</div>
              </div>
            ),
            onOk: () => {
              afterEdit(e.target.value);
            },
            onCancel: () => {
              afterEdit(newNameOldSuffix + ' ');
            },
          });
        } else {
          afterEdit(e.target.value);
        }
      }
    };
    //单个删除
    const handleDelete = x => {
      let arr = data.filter(x => x.RYXQ === activeKey)[0]?.DATA;
      if (arr.length > 0) {
        arr[index].JLDATA = arr[index].JLDATA.filter(
          j => !(j.ENTRYNO === x.ENTRYNO && j.JLID === x.JLID && j.JLMC === x.JLMC),
        );
        if (
          arr[index].JLDATA.length == 0 ||
          arr[index].JLDATA.filter(jl => jl.JLID === x.JLID).length === 0
        ) {
          setEmptyArr(p => [
            ...p,
            {
              JLID: x.JLID,
              GYSID: arr[index].GYSID,
              JLMC: JSON.stringify({ nextId: x.NEXTID, items: [] }).replace(/"/g, '!'),
            },
          ]);
        }
        let total = 0;
        data.forEach(x => {
          let total2 = 0;
          x.DATA?.forEach(y => {
            total2 += y.JLDATA?.length;
          });
          total += total2;
        });
        setJlTotal(total);
        let dataArr = JSON.parse(JSON.stringify(data));
        dataArr.forEach(d => {
          if (d.RYXQ === activeKey) {
            d.DATA = [...arr];
          }
        });
        setData([...dataArr]);
        let arrShow = JSON.parse(JSON.stringify(dataArr));
        arrShow.forEach(x => {
          x.DATA.forEach(y => {
            y.UNFOLD = false;
            y.SHOWFOLD = false;
          });
        });
        setDataShow(arrShow);
        message.success('删除成功', 1);
      }
    };
    //不分发，但暂存
    const handleDestributeCancel = x => {
      let arr = data.filter(x => x.RYXQ === activeKey)[0]?.DATA;
      if (arr.length > 0) {
        arr[index].JLDATA.forEach(j => {
          if (j.ENTRYNO === x.ENTRYNO && j.JLID === x.JLID && j.JLMC === x.JLMC) {
            j.destributeCancel = true; //不分发
          }
        });
        let dataArr = JSON.parse(JSON.stringify(data));
        dataArr.forEach(d => {
          if (d.RYXQ === activeKey) {
            d.DATA = [...arr];
          }
        });
        setData([...dataArr]);
        let arrShow = JSON.parse(JSON.stringify(dataArr));
        arrShow.forEach(x => {
          x.DATA.forEach(y => {
            y.UNFOLD = false;
            y.SHOWFOLD = false;
          });
        });
        setDataShow(arrShow);
        // message.success('删除成功', 1);
      }
    };
    //取消不分发
    const handleDestributeReback = x => {
      let arr = data.filter(x => x.RYXQ === activeKey)[0]?.DATA;
      if (arr.length > 0) {
        arr[index].JLDATA.forEach(j => {
          if (j.ENTRYNO === x.ENTRYNO && j.JLID === x.JLID && j.JLMC === x.JLMC) {
            j.destributeCancel = false; //取消不分发
          }
        });
        let dataArr = JSON.parse(JSON.stringify(data));
        dataArr.forEach(d => {
          if (d.RYXQ === activeKey) {
            d.DATA = [...arr];
          }
        });
        setData([...dataArr]);
        let arrShow = JSON.parse(JSON.stringify(dataArr));
        arrShow.forEach(x => {
          x.DATA.forEach(y => {
            y.UNFOLD = false;
            y.SHOWFOLD = false;
          });
        });
        setDataShow(arrShow);
        // message.success('删除成功', 1);
      }
    };

    if (JLDATA.length === 0) return '';
    return (
      <div className="splier-item">
        <div className="splier-name">{GYSMC}</div>
        <div className="resume-list">
          {JLDATA.map((x, i) => (
            <div
              className="resume-item"
              key={`${x.JLMC}-${x.ENTRYNO}-${x.JLID}`}
              style={
                editing
                  ? {
                      backgroundColor: '#fff',
                      // border: x.destributeCancel ? '0' : '1px solid #3361ff',
                    }
                  : {}
              }
            >
              {!isNewResume(x) && !isDock && <div className="new-demand-exsit">新</div>}

              {editing ? (
                <Input
                  defaultValue={x.JLMC}
                  onBlur={e => handleInputBlur(e, x)}
                  style={{ width: '100%' }}
                  onFocus={e => {
                    e.target.value = e.target.value.trim();
                    const dotIndex = e.target.value.lastIndexOf('.');
                    e.target.focus();
                    e.target.setSelectionRange(0, dotIndex);
                    e.target.setSelectionRange(0, dotIndex);
                  }}
                />
              ) : (
                <Fragment>
                  {x.destributeCancel ? (
                    <i className="iconfont circle-reduce edit-disabled" />
                  ) : (
                    <>{isDock ? <i className="iconfont circle-check edit-disabled" /> : null}</>
                  )}
                  <span>{x.JLMC}</span>
                </Fragment>
              )}
              {editing ? (
                //    <Popconfirm title="确定要删除该简历吗?" onConfirm={() => handleDelete(x)}>
                //    <i className="iconfont delete" />
                //  </Popconfirm>
                <Fragment>
                  {x.destributeCancel ? (
                    <i className="iconfont circle-add" onClick={() => handleDestributeReback(x)} />
                  ) : (
                    <i
                      className="iconfont circle-reduce"
                      onClick={() => handleDestributeCancel(x)}
                    />
                  )}
                  <Popover
                    placement="bottom"
                    title={null}
                    trigger="click"
                    content={
                      <div className="list">
                        <Popconfirm title="确定要删除该简历吗?" onConfirm={() => handleDelete(x)}>
                          <div className="item">删除</div>
                        </Popconfirm>
                      </div>
                    }
                    overlayClassName="btn-more-content-popover"
                    arrowPointAtCenter
                  >
                    <i className="iconfont icon-more2" />
                  </Popover>
                </Fragment>
              ) : (
                <>
                  {batchDownload ? (
                    <Checkbox
                      defaultChecked={false}
                      style={{ marginTop: '3px' }}
                      onChange={e => {
                        if (e.target.checked) {
                          // 选中了
                          let newBatchDownloadList = batchDownloadList;
                          newBatchDownloadList.push(x);
                          setBatchDownloadList(newBatchDownloadList);
                        } else {
                          // 取消选中
                          let newBatchDownloadList = [];
                          batchDownloadList.forEach(item => {
                            if (item.JLID !== x.JLID || item.ENTRYNO !== x.ENTRYNO) {
                              newBatchDownloadList.push(item);
                            }
                          });
                          setBatchDownloadList(newBatchDownloadList);
                        }
                      }}
                    />
                  ) : (
                    <i
                      className="iconfont icon-download"
                      onClick={() => handleFileDownload(x.JLID, x.JLMC, x.ENTRYNO)}
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        {SHOWFOLD &&
          (UNFOLD ? (
            <div className="more-item-unfold" onClick={() => handleUnfold(false, GYSID)}>
              收起
              <i className="iconfont icon-up" />
            </div>
          ) : (
            <div className="more-item" onClick={() => handleUnfold(true, GYSID)}>
              展开
              <i className="iconfont icon-down" />
            </div>
          ))}
      </div>
    );
  };

  // 项目经理获取全部简历
  const getAllSplierItem = ({ GYSMC = '--', JLDATA = [], UNFOLD, GYSID, SHOWFOLD }, index) => {
    //文件下载
    const handleFileDownload = (id, fileName, entryno) => {
      setIsSpinning(true);
      axios({
        method: 'POST',
        url: queryFileStream,
        responseType: 'blob',
        data: {
          objectName: 'TWBXQ_JLSC',
          columnName: 'JL',
          id,
          title: fileName,
          extr: entryno,
          type: '',
        },
      })
        .then(res => {
          const href = URL.createObjectURL(res.data);
          const a = document.createElement('a');
          a.download = fileName;
          a.href = href;
          a.click();
          window.URL.revokeObjectURL(a.href);
          setIsSpinning(false);
          insertResumeDownloadRecord([
            {
              JLID: id,
              ENTRYNO: entryno,
              JLMC: fileName,
            },
          ]);
        })
        .catch(err => {
          setIsSpinning(false);
          message.error('简历下载失败', 1);
        });
    };
    //单个编辑完成
    const handleInputBlur = (e, x) => {
      e.persist();
      const oldSuffix = x.JLMC.slice(x.JLMC.lastIndexOf('.')); //旧的文件后缀
      const newSuffix = e.target.value.slice(e.target.value.lastIndexOf('.')); //新的文件后缀
      const newFileName = e.target.value.slice(0, e.target.value.lastIndexOf('.'));
      const newNameOldSuffix = newFileName + oldSuffix;
      //编辑完保存数据
      const afterEdit = (newValue = '') => {
        let arr = data.filter(x => x.RYXQ === activeKey)[0]?.DATA;
        if (arr.length > 0) {
          let jldata = [...arr[index].JLDATA];
          jldata.forEach(j => {
            if (j.ENTRYNO === x.ENTRYNO && j.JLID === x.JLID && j.JLMC === x.JLMC) {
              j.JLMC = newValue;
            }
          });
          arr[index].JLDATA = jldata;
          let dataArr = JSON.parse(JSON.stringify(data));
          dataArr.forEach(d => {
            if (d.RYXQ === activeKey) {
              d.DATA = [...arr];
            }
          });
          setData([...dataArr]);
          let arrShow = JSON.parse(JSON.stringify(dataArr));
          arrShow.forEach(x => {
            x.DATA.forEach(y => {
              y.UNFOLD = false;
              y.SHOWFOLD = false;
            });
          });
          setDataShow(arrShow);
        }
      };

      if (e.target.value === '') {
        message.error('文件全名不能为空', 1);
        afterEdit(x.JLMC + ' ');
      } else if (newFileName === '') {
        message.error('文件名不能为空', 1);
        afterEdit(x.JLMC + ' ');
      } else if (newSuffix === '') {
        message.error('文件扩展名不能为空', 1);
        afterEdit(x.JLMC + ' ');
      } else {
        if (oldSuffix.trim() !== newSuffix.trim()) {
          Modal.confirm({
            content: (
              <div>
                修改文件扩展名，可能导致文件不可用。<div>是否确定修改？</div>
              </div>
            ),
            onOk: () => {
              afterEdit(e.target.value);
            },
            onCancel: () => {
              afterEdit(newNameOldSuffix + ' ');
            },
          });
        } else {
          afterEdit(e.target.value);
        }
      }
    };
    //单个删除
    const handleDelete = x => {
      let arr = data.filter(x => x.RYXQ === activeKey)[0]?.DATA;
      if (arr.length > 0) {
        arr[index].JLDATA = arr[index].JLDATA.filter(
          j => !(j.ENTRYNO === x.ENTRYNO && j.JLID === x.JLID && j.JLMC === x.JLMC),
        );
        if (
          arr[index].JLDATA.length == 0 ||
          arr[index].JLDATA.filter(jl => jl.JLID === x.JLID).length === 0
        ) {
          setEmptyArr(p => [
            ...p,
            {
              JLID: x.JLID,
              GYSID: arr[index].GYSID,
              JLMC: JSON.stringify({ nextId: x.NEXTID, items: [] }).replace(/"/g, '!'),
            },
          ]);
        }
        let total = 0;
        data.forEach(x => {
          let total2 = 0;
          x.DATA?.forEach(y => {
            total2 += y.JLDATA?.length;
          });
          total += total2;
        });
        setJlTotal(total);
        let dataArr = JSON.parse(JSON.stringify(data));
        dataArr.forEach(d => {
          if (d.RYXQ === activeKey) {
            d.DATA = [...arr];
          }
        });
        setData([...dataArr]);
        let arrShow = JSON.parse(JSON.stringify(dataArr));
        arrShow.forEach(x => {
          x.DATA.forEach(y => {
            y.UNFOLD = false;
            y.SHOWFOLD = false;
          });
        });
        setDataShow(arrShow);
        message.success('删除成功', 1);
      }
    };
    //不分发，但暂存
    const handleDestributeCancel = x => {
      let arr = data.filter(x => x.RYXQ === activeKey)[0]?.DATA;
      if (arr.length > 0) {
        arr[index].JLDATA.forEach(j => {
          if (j.ENTRYNO === x.ENTRYNO && j.JLID === x.JLID && j.JLMC === x.JLMC) {
            j.destributeCancel = true; //不分发
          }
        });
        let dataArr = JSON.parse(JSON.stringify(data));
        dataArr.forEach(d => {
          if (d.RYXQ === activeKey) {
            d.DATA = [...arr];
          }
        });
        setData([...dataArr]);
        let arrShow = JSON.parse(JSON.stringify(dataArr));
        arrShow.forEach(x => {
          x.DATA.forEach(y => {
            y.UNFOLD = false;
            y.SHOWFOLD = false;
          });
        });
        setDataShow(arrShow);
        // message.success('删除成功', 1);
      }
    };
    //取消不分发
    const handleDestributeReback = x => {
      let arr = data.filter(x => x.RYXQ === activeKey)[0]?.DATA;
      if (arr.length > 0) {
        arr[index].JLDATA.forEach(j => {
          if (j.ENTRYNO === x.ENTRYNO && j.JLID === x.JLID && j.JLMC === x.JLMC) {
            j.destributeCancel = false; //取消不分发
          }
        });
        let dataArr = JSON.parse(JSON.stringify(data));
        dataArr.forEach(d => {
          if (d.RYXQ === activeKey) {
            d.DATA = [...arr];
          }
        });
        setData([...dataArr]);
        let arrShow = JSON.parse(JSON.stringify(dataArr));
        arrShow.forEach(x => {
          x.DATA.forEach(y => {
            y.UNFOLD = false;
            y.SHOWFOLD = false;
          });
        });
        setDataShow(arrShow);
        // message.success('删除成功', 1);
      }
    };

    return (
      <>
        {JLDATA.map((x, i) => (
          <>
            {!x.destributeCancel && (
              <div
                className="resume-item"
                key={`${x.JLMC}-${x.ENTRYNO}-${x.JLID}`}
                style={
                  editing
                    ? {
                        backgroundColor: '#fff',
                        // border: x.destributeCancel ? '0' : '1px solid #3361ff',
                      }
                    : {}
                }
              >
                {!isNewResume(x) && !isDock && <div className="new-demand-exsit">新</div>}

                {editing ? (
                  <Input
                    defaultValue={x.JLMC}
                    onBlur={e => handleInputBlur(e, x)}
                    style={{ width: '100%' }}
                    onFocus={e => {
                      e.target.value = e.target.value.trim();
                      const dotIndex = e.target.value.lastIndexOf('.');
                      e.target.focus();
                      e.target.setSelectionRange(0, dotIndex);
                      e.target.setSelectionRange(0, dotIndex);
                    }}
                  />
                ) : (
                  <Fragment>
                    {x.destributeCancel ? (
                      <i className="iconfont circle-reduce edit-disabled" />
                    ) : (
                      <>{isDock ? <i className="iconfont circle-check edit-disabled" /> : null}</>
                    )}
                    <span>{x.JLMC}</span>
                  </Fragment>
                )}
                {editing ? (
                  //    <Popconfirm title="确定要删除该简历吗?" onConfirm={() => handleDelete(x)}>
                  //    <i className="iconfont delete" />
                  //  </Popconfirm>
                  <Fragment>
                    {x.destributeCancel ? (
                      <i
                        className="iconfont circle-add"
                        onClick={() => handleDestributeReback(x)}
                      />
                    ) : (
                      <i
                        className="iconfont circle-reduce"
                        onClick={() => handleDestributeCancel(x)}
                      />
                    )}
                    <Popover
                      placement="bottom"
                      title={null}
                      trigger="click"
                      content={
                        <div className="list">
                          <Popconfirm title="确定要删除该简历吗?" onConfirm={() => handleDelete(x)}>
                            <div className="item">删除</div>
                          </Popconfirm>
                        </div>
                      }
                      overlayClassName="btn-more-content-popover"
                      arrowPointAtCenter
                    >
                      <i className="iconfont icon-more2" />
                    </Popover>
                  </Fragment>
                ) : (
                  <>
                    {batchDownload ? (
                      <Checkbox
                        style={{ marginTop: '3px' }}
                        // value={}
                        onChange={e => {
                          if (e.target.checked) {
                            // 选中了
                            let newBatchDownloadList = batchDownloadList;
                            newBatchDownloadList.push(x);
                            setBatchDownloadList(newBatchDownloadList);
                          } else {
                            // 取消选中
                            let newBatchDownloadList = [];
                            batchDownloadList.forEach(item => {
                              if (item.JLID !== x.JLID || item.ENTRYNO !== x.ENTRYNO) {
                                newBatchDownloadList.push(item);
                              }
                            });
                            setBatchDownloadList(newBatchDownloadList);
                          }
                        }}
                      />
                    ) : (
                      <i
                        className="iconfont icon-download"
                        onClick={() => handleFileDownload(x.JLID, x.JLMC, x.ENTRYNO)}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </>
        ))}
      </>
    );
  };

  // 切换tab
  const handleTabsChange = key => {
    // if (key === '1')
    if (editing) {
      Modal.confirm({
        content: '数据未保存，确定取消修改吗？',
        onOk: () => {
          handleEditCancel();
          setActiveKey(key);
        },
      });
    } else {
      setActiveKey(key);
    }
  };

  //修改
  const handleModify = () => {
    setEditing(true);
    let arrShow = JSON.parse(JSON.stringify(data));
    arrShow.forEach(x => {
      x.DATA.forEach(y => {
        y.UNFOLD = true;
        y.SHOWFOLD = false;
      });
    });
    setDataShow(arrShow);
  };

  //保存
  const handleSave = () => {
    //每次保存后赋值
    setUnsavedData(JSON.parse(JSON.stringify(data)));
    let arrShow = JSON.parse(JSON.stringify(data));
    arrShow.forEach(x => {
      x.DATA.forEach(y => {
        y.UNFOLD = false;
        y.SHOWFOLD = y.JLDATA?.length > 8;
        if (y.JLDATA?.length > 8) {
          y.JLDATA = y.JLDATA.slice(0, 8);
        }
      });
    });
    setDataShow(arrShow);
    setEditing(false);
    message.success('保存成功', 1);
  };

  //取消修改
  const handleEditCancel = () => {
    setEditing(false);
    //初始为上一次保存的数据
    setData(JSON.parse(JSON.stringify([...unsavedData])));
    let arrShow = JSON.parse(JSON.stringify([...unsavedData]));
    arrShow.forEach(x => {
      x.DATA.forEach(y => {
        y.UNFOLD = false;
        y.SHOWFOLD = y.JLDATA?.length > 8;
        if (y.JLDATA?.length > 8) {
          y.JLDATA = y.JLDATA.slice(0, 8);
        }
      });
    });
    setDataShow(arrShow);
  };
  if (JLXX.length === 0) return '';
  const getActiveKeyTotal = () => {
    let total = 0;
    dataShow
      .filter(x => x.RYXQ === activeKey)[0]
      ?.DATA?.forEach(m => {
        total += m.JLDATA?.length;
      });
    return total;
  };

  const insertResumeDownloadRecord = (resumeList = []) => {
    let info = [];
    resumeList.forEach(item => {
      info.push({
        jlid: item.JLID,
        entryno: item.ENTRYNO,
        title: item.JLMC,
      });
    });
    InsertResumeDownloadRecord({
      xqid: Number(xqid),
      info: JSON.stringify(info),
    })
      .then(res => {
        const { code = 0, note = '' } = res;
        if (code > 0) {
          queryResumeInsertRecords();
        } else {
          message.error(note);
        }
      })
      .catch(err => {
        message.error(err);
      });
  };

  const operateBatchDownload = (batchDownloadList = []) => {
    if (batchDownloadList.length === 0) {
      message.warn('请至少选择一个文件！');
      return false;
    }
    let tabName = '';
    JLXX.forEach(item => {
      if (item.RYXQ === activeKey) {
        tabName = item.RYXQNR;
      }
    });
    let param = {
      objectName: 'TWBXQ_JLSC',
      columnName: 'JL',
      title: tabName + '-' + (XMXX.XMMC || '') + moment().format('YYYYMMDD') + '.zip',
    };
    let attBaseInfos = [];
    batchDownloadList.forEach(item => {
      attBaseInfos.push({
        id: item.ENTRYNO,
        rowid: item.JLID,
        title: item.JLMC,
      });
    });
    param.attBaseInfos = attBaseInfos;
    setIsSpinning(true);
    axios({
      method: 'POST',
      url: zipLivebosFilesRowsPost,
      responseType: 'blob',
      data: param,
    })
      .then(res => {
        const href = URL.createObjectURL(res.data);
        const a = document.createElement('a');
        a.download = tabName + '-' + (XMXX.XMMC || '') + moment().format('YYYYMMDD') + '.zip';
        a.href = href;
        a.click();
        //批量记录下载历史
        insertResumeDownloadRecord(batchDownloadList);
        setBatchDownload(false);
        setBatchDownloadList([]);
        setBatchDownload(true);
        setIsSpinning(false);
      })
      .catch(err => {
        setIsSpinning(false);
        message.error(err);
      });
  };

  const handleSelectAll = () => {
    const allData =
      dataShow
        .filter(x => x.RYXQ === activeKey)[0]
        ?.DATA.reduce((acc, cur) => [...acc, ...cur.JLDATA], []) || [];
    operateBatchDownload(allData);
  };

  return (
    <div className="resume-destribution-box">
      {/* <ResumeListModal visible={listModalVisible} setVisible={setListModalVisible} /> */}
      <div className="top-console">
        <Breadcrumb separator=">" style={{ marginTop: 19.4 }}>
          {routes?.map((item, index) => {
            const { name = item, pathname = '' } = item;
            const historyRoutes = routes.slice(0, index + 1);
            return (
              <Item key={index}>
                {index === routes.length - 1 ? (
                  <>{name}</>
                ) : (
                  <Link to={{ pathname: pathname, state: { routes: historyRoutes } }}>{name}</Link>
                )}
              </Item>
            );
          })}
        </Breadcrumb>
        <Tabs activeKey={activeKey} onChange={handleTabsChange} size={'large'}>
          {JLXX.map(x => (
            <TabPane tab={x.RYXQNR} key={x.RYXQ}></TabPane>
          ))}
        </Tabs>
      </div>
      <Spin spinning={isSpinning} size="large" tip="加载中">
        <div className="content">
          <div className="btn-box">
            {editing ? (
              <>
                <Popconfirm title="确定要保存吗？" onConfirm={handleSave}>
                  <Button className="btn-opr">保存</Button>
                </Popconfirm>
                <Button className="btn-cancel" onClick={handleEditCancel}>
                  取消
                </Button>
              </>
            ) : (
              <>
                {!batchDownload && !(isAuth && !isDock) && (
                  <>
                    <Popconfirm title="确认要分发吗？" onConfirm={handleDestribute}>
                      <Button className="btn-opr">分发</Button>
                    </Popconfirm>
                    <Button className="btn-opr" onClick={handleModify}>
                      修改
                    </Button>
                  </>
                )}
              </>
            )}
            {!editing && batchDownload && (
              <>
                <Button className="btn-opr" onClick={handleSelectAll}>
                  全部下载
                </Button>
                <Button className="btn-opr" onClick={() => operateBatchDownload(batchDownloadList)}>
                  下载
                </Button>
                <Button
                  className="btn-cancel"
                  onClick={() => {
                    setBatchDownload(false);
                    setBatchDownloadList([]);
                  }}
                >
                  取消
                </Button>
              </>
            )}
            {!editing && !batchDownload && (
              <Button className="btn-opr" onClick={() => setBatchDownload(true)}>
                批量下载
              </Button>
            )}
            {/* {!editing && !batchDownload && isDock && (
              <Button className="btn-opr" onClick={() => setListModalVisible(true)}>
                列表展示
              </Button>
            )} */}
          </div>
          {getActiveKeyTotal() === 0 && (
            <Empty
              description="暂无简历"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ width: '100%' }}
            />
          )}
          <div className="splier-list">
            {isAuth && !isDock ? (
              //项目经理
              <div className="splier-item">
                <div className="resume-list">
                  {dataShow
                    .filter(x => x.RYXQ === activeKey)[0]
                    ?.DATA?.map((item, index) => getAllSplierItem(item, index))}
                </div>
              </div>
            ) : (
              <>
                {dataShow
                  .filter(x => x.RYXQ === activeKey)[0]
                  ?.DATA?.map((item, index) => getSplierItem(item, index))}
              </>
            )}
          </div>
        </div>
      </Spin>
    </div>
  );
}
