/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import React, { Fragment } from 'react';
import { Row, Col, message } from 'antd';
import TreeUtils from '../../../../../../utils/treeUtils';
//import { fetchObject } from '../../../../../../services/sysCommon';
import { fetchUserAuthorityDepartment } from '../../../../../../services/commonbase/userAuthorityDepartment';
import { FetchqueryMotEventInfo, FetchqueryMotEventTree, FetcheventMaintenance } from '../../../../../../services/motProduction';
import { FetchObjectQuery } from '../../../../../../services/sysCommon/index';
import LeftSearchComponent from '../../LeftSearchComponent';
import RightMainContent from '../RightMainContent';

/**
 * 考评人员结构配置
 */

class EventTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventInfoData: [],
      type: true,
      sjID: '',
      gxyybDatas: [], // 营业部数据
      gxyybTree: [], // 营业部数据
      Data: [],
      diceventData: [],
      eventData: [],
      openKeys: [],
      clickKeys: '',
      searchValue: '',
      dxid: '',
      addType: '',
    };
  }
  componentDidMount() {
    this.fetchGxyybList();
    this.fetchCompanyName();
  }
  fetchCompanyName = async (yzID) => {
    const { tgtTp } = this.props;
    const { searchValue } = this.state;
    const openKeys = [];
    let diceventData = [];
    //const condition = `DIC_CL = 'MOT_SBRD_STG' AND TGT_TP = ${tgtTp} `;
    // const condition = {
    //   dic_cl: 'MOT_SBRD_STG',
    //   tgt_tp: tgtTp,
    // };

    // const { records: yzfl } = await fetchObject('yzfl', { condition });
    // if (Array.isArray(yzfl) && yzfl.length > 0) {
    //   diceventData = yzfl;
    //   this.setState({ diceventData });
    // }

    await FetchObjectQuery(
      {
        "cols": "DIC_CL,DIC_CODE,DIC_NM,DIC_NOTE,ID,TGT_TP",
        "current": 1,
        "cxtj": "DIC_CL==MOT_SBRD_STG&&TGT_TP=="+tgtTp,
        "pageSize": 100,
        "paging": 1,
        "serviceid": "motDic",
        "sort": "",
        "total": -1
      }
    ).then(res => {
      const { data } = res
      if (data.length > 0) {
        diceventData = data;
        this.setState({ diceventData });
      }
    }).catch(err => {
      // const { result } = err
      // const { data } = JSON.parse(result)
      // console.log("获取到的data", data)
      // if (Array.isArray(data) && data.length > 0) {
      //   diceventData = data;
      //   this.setState({ diceventData });
      // }
    })
    let ziData = [];
    const Data = diceventData;

    let eventData = [];
    FetchqueryMotEventTree({ tgtTp }).then((ret = {}) => {
      const { records = [] } = ret;
      if (records && records.length > 0) {
        eventData = records;
        Data.forEach((item) => {
          ziData = eventData.filter((Item) => {
            if (Item.sbrdStg === item.DIC_CODE) {
              return true;
            }
            return false;
          });
          ziData.forEach((item) => {
            item.id = item.evntId;
            item.name = item.evntNm;
          });

          item.ziData = ziData;
          if (ziData.length > 0) {
            openKeys.push(item.DIC_CODE);
          }
        });
        this.setState({ eventData, openKeys, addType: '' });
        if (yzID !== undefined && yzID !== '') {
          this.setState({ clickKeys: yzID });
          this.setCompany(yzID);
        } else {
          this.setState({ clickKeys: eventData[0].evntId });
          this.setCompany(eventData[0].evntId);
        }
        if (searchValue !== '') {
          this.handleOnkeyWord(searchValue);
        }
      }
    }).catch(((error) => {
      message.error(!error.success ? error.message : error.note);
    }));
    this.setState({ Data });
  }
  // 获取管辖营业部的数据
  fetchGxyybList = () => {
    const gxyybCurrent = this.state.gxyybDatas;
    fetchUserAuthorityDepartment({ paging: 0, current: 1, pageSize: 10, total: -1, sort: '' }).then((result) => {
      const { code = 0, records = [] } = result;
      if (code > 0) {
        const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'key' }, true);
        gxyybCurrent.datas = [];
        datas.forEach((item) => {
          const { children } = item;
          gxyybCurrent.datas.push(...children);
        });
        gxyybCurrent.dataLoaded = true;
        this.setState({ gxyybDatas: records, gxyybTree: gxyybCurrent });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  setCompany = (id, value) => {
    if (id !== '') {
      FetchqueryMotEventInfo({ evntId: id, orgId: '10000' }).then((ret = {}) => {
        const { records = [] } = ret;
        if (records && records.length > 0) {
          this.setState({ eventInfoData: records, sjID: id });
        }
      }).catch(((error) => {
        message.error(!error.success ? error.message : error.note);
      }));
    } else {
      const newData = [{
        ...value,
        tgtTp: this.props.tgtTp,
        cmptMode: '1',
        avlRng: '',
        jsonMsgSndRule: '',
        msgPreSndTm: '',
      }];
      this.setState({ eventInfoData: newData, sjID: '' });
    }
  }
  maintain = (value) => {
    const { clickKeys } = this.state;
    const prams = {
      oprTp: value,
      evntId: clickKeys,
    };
    FetcheventMaintenance(prams).then((ret = {}) => {
      const { code } = ret;
      if (code > 0) {
        message.success('操作成功！');
        this.fetchCompanyName(value === '3' ? undefined : clickKeys);
      }
    }).catch(((error) => {
      message.error(!error.success ? error.message : error.note);
    }));
  };
  setType = (value) => {
    this.setState({ type: value });
  }
  setData = (field, value) => {
    this.setState({
      [field]: value,
    });
  };
  handleOk = () => {
    const { tgtTp } = this.props;
    const { diceventData, searchValue } = this.state;
    let ziData = [];
    const openKeys = [];
    const Data = diceventData;
    let eventData = [];
    FetchqueryMotEventTree({ tgtTp }).then((ret = {}) => {
      const { records = [] } = ret;
      if (records && records.length > 0) {
        eventData = records;
        const newTreeList = eventData.filter((item) => {
          if (item.evntNm.indexOf(searchValue) !== -1) {
            return true;
          }
          return false;
        });
        Data.forEach((item) => {
          ziData = newTreeList.filter((Item) => {
            if (Item.sbrdStg === item.DIC_CODE) {
              return true;
            }
            return false;
          });
          ziData.forEach((item) => {
            item.id = item.evntId;
            item.name = item.evntNm;
          });
          item.ziData = ziData;
          if (ziData.length > 0) {
            openKeys.push(item.DIC_CODE);
          }
        });
        this.setState({ eventData, openKeys, Data, addType: '' });
      }
    }).catch(((error) => {
      message.error(!error.success ? error.message : error.note);
    }));
  };
  handleOkAdd = (values) => {
    const { diceventData, eventData, clickKeys, searchValue } = this.state;
    let yzfl = '';
    eventData.forEach((item) => {
      if (item.evntId === clickKeys) {
        yzfl = item.sbrdStg;
      }
    });
    if (yzfl === '0' || yzfl === '') {
      yzfl = '1';
    }
    const newData = {
      evntId: `${values.YZMC}`,
      sbrdStg: yzfl,
      evntNm: values.YZMC,
      strtUseSt: '1',
    };
    const newTreeList = eventData.filter((item) => {
      if (item.evntNm.indexOf(searchValue) !== -1) {
        return true;
      }
      return false;
    });
    const lsData = newTreeList;
    lsData.push(newData);
    const Data = diceventData;
    let ziData = [];
    const openKeys = [];
    Data.forEach((item) => {
      ziData = lsData.filter((Item) => {
        if (Item.sbrdStg === item.DIC_CODE) {
          return true;
        }
        return false;
      });
      ziData.forEach((item) => {
        item.id = item.evntId;
        item.name = item.evntNm;
      });
      item.ziData = ziData;
      if (ziData.length > 0) {
        openKeys.push(item.DIC_CODE);
      }
    });
    this.setState({ Data, clickKeys: `${values.YZMC}`, openKeys });
    this.setCompany('', newData);
    this.setType(false);
  };
  handleOnkeyWord = (keyWord) => {
    // 筛选数据
    const { diceventData, eventData } = this.state;
    const newTreeList = eventData.filter((item) => {
      if (item.evntNm.indexOf(keyWord) !== -1) {
        return true;
      }
      return false;
    });

    let ziData = [];
    const openKeys = [];
    const Data = diceventData;
    Data.forEach((item) => {
      ziData = newTreeList.filter((Item) => {
        if (Item.sbrdStg === item.DIC_CODE) {
          return true;
        }
        return false;
      });
      ziData.forEach((item) => {
        item.id = item.evntId;
        item.name = item.evntNm;
      });
      item.ziData = ziData;
      if (ziData.length > 0) {
        openKeys.push(item.DIC_CODE);
      }
    });

    this.setState({
      openKeys,
      Data,
      searchValue: keyWord,
    });
  };

  render() {
    const { eventInfoData, type, sjID, gxyybDatas, gxyybTree, Data, openKeys, clickKeys, searchValue, dxid, addType } = this.state;
    return (
      <Fragment>
        <Row style={{ height: '100%', backgroundColor: '#FFF' }}>
          <Col xs={6} sm={6} lg={6} xl={6} style={{ borderRight: '1px solid #E3E3E3', height: 'calc(100% - 2rem)' }}>
            {/* 左侧搜索组件 */}
            <LeftSearchComponent addName="事件名称" setCompany={this.setCompany} tgtTp={this.props.tgtTp}
              addType={addType} type={type} setType={this.setType} setData={this.setData}
              handleOk={this.handleOk} handleOkAdd={this.handleOkAdd} handleOnkeyWord={this.handleOnkeyWord}
              maintain={this.maintain} Data={Data} openKeys={openKeys} clickKeys={clickKeys} searchValue={searchValue} dxid={dxid} />
          </Col>
          <Col xs={18} sm={18} lg={18} xl={18} style={{ height: '100%' }}>
            <RightMainContent eventInfoData={eventInfoData} sjID={sjID}
              gxyybDatas={gxyybDatas} gxyybTree={gxyybTree} tgtTp={this.props.tgtTp}
              setData={this.setData} type={type} addType={addType} dictionary={this.props.dictionary}
              setType={this.setType} fetchCompanyName={this.fetchCompanyName}
              ref={(c) => { this.informationeRight = c; }} />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
export default EventTabs;
