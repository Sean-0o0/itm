/* eslint-disable no-param-reassign */
import React, { Fragment } from 'react';
import { Row, Col, message } from 'antd';
import { FetchObjectQuery } from '../../../../../../services/sysCommon';
import { FetchQueryMotFactorInfo, FetchQueryMotFactorTree, FetchMotFactorMaintenance } from '../../../../../../services/motProduction';
import LeftSearchComponent from '../../LeftSearchComponent';
import RightMainContent from '../RightMainContent';

/**
 * 考评人员结构配置
 */

class FactorTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      factorInfoData: [],
      type: true,
      yzID: '',
      Data: [],
      dicfactorData: [],
      factorData: [],
      openKeys: [],
      clickKeys: '',
      searchValue: '',
      dxid: '',
      addType: '',
    };
  }

  componentDidMount() {
    this.fetchCompanyName();
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.tgtTp !== this.props.tgtTp) {
  //     this.fetchCompanyName('',nextProps.tgtTp);
  //   }
  // }

  fetchCompanyName = async (yzID) => {
    const { tgtTp } = this.props;
    const { searchValue } = this.state;
    const openKeys = [];
    // let dicfactorData = [];
    //const condition = `DIC_CL = 'MOT_FCTR_CL' AND TGT_TP = ${tgtTp} `;
    const condition = {
      cols: "DIC_CL,DIC_CODE,DIC_NM,DIC_NOTE,ID,TGT_TP",
      current: 1,
      cxtj: "DIC_CL==MOT_FCTR_CL&&TGT_TP=="+tgtTp, //原先direct接口传入的条件参数
      pageSize: 10,
      paging: 1,
      serviceid: "motDic",
      sort: "",
      total: -1
    }

    // const condition = {
    //   dic_cl: 'MOT_FCTR_CL',
    //   tgt_tp: tgtTp,
    // };
    FetchObjectQuery(condition).then(res => {
      let { code = 0, data = [] } = res
      if (code === 1) {
        let Data = []
        if (Array.isArray(data) && data.length > 0) {
          Data = data;
          this.setState({ dicfactorData: data });
        }
        let factorData = [];
        let ziData = [];
        // 子菜单查询
        FetchQueryMotFactorTree({ tgtTp }).then((ret = {}) => {
          const { records = [] } = ret;
          if (records && records.length > 0) {
            factorData = records;
            Data.forEach((item) => {
              ziData = factorData.filter((Item) => Item.fctrCl === item.DIC_CODE);
              ziData.forEach((itemZi) => {
                itemZi.id = itemZi.fctrId;
                itemZi.name = itemZi.fctrNm;
              });
              item.ziData = ziData;
              if (ziData.length > 0) {
                openKeys.push(item.DIC_CODE);
              }
            });
            this.setState({ factorData, openKeys, addType: '' });
            if (yzID !== undefined && yzID !== '') {
              this.setState({ clickKeys: yzID });
              this.setCompany(yzID);
            } else {
              this.setState({ clickKeys: factorData[0].fctrId });
              this.setCompany(factorData[0].fctrId);
            }
            this.handleOnkeyWord(searchValue);
          }
        }).catch(((error) => {
          message.error(!error.success ? error.message : error.note);
        }));
        this.setState({ Data });
      }
    }).catch(((error) => {
      message.error(!error.success ? error.message : error.note);
    }));

    // const { records: yzfl } = await fetchObject('yzfl', { condition });



    // const { dicfactorData } = this.state





  }
  setCompany = (id, value) => {
    if (id !== '') {
      FetchQueryMotFactorInfo({ fctrId: id }).then((ret = {}) => {
        const { records = [] } = ret;
        if (records && records.length > 0) {
          this.setState({ factorInfoData: records, yzID: records[0].fctrId });
        }
      }).catch(((error) => {
        message.error(!error.success ? error.message : error.note);
      }));
    } else {
      const newData = [{
        ...value,
        tgtTp: this.props.tgtTp,
        cmptMode: '1',
        fctrIdx: '',
      }];
      this.setState({ factorInfoData: newData, yzID: '' });
    }
  }
  maintain = (value) => {
    const { clickKeys } = this.state;
    const prams = {
      oprTp: value,
      fctrId: clickKeys,
    };
    FetchMotFactorMaintenance(prams).then((ret = {}) => {
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
    const { dicfactorData, searchValue } = this.state;
    const openKeys = [];
    let ziData = [];
    const Data = dicfactorData;
    let factorData = [];
    FetchQueryMotFactorTree({ tgtTp }).then((ret = {}) => {
      const { records = [] } = ret;
      if (records && records.length > 0) {
        factorData = records;
        Data.forEach((item) => {
          ziData = factorData.filter((Item) => {
            if (Item.fctrCl === item.DIC_CODE) {
              return true;
            }
            return false;
          });
          ziData.forEach((itemZi) => {
            itemZi.id = itemZi.fctrId;
            itemZi.name = itemZi.fctrNm;
          });
          item.ziData = ziData;
          if (ziData.length > 0) {
            openKeys.push(item.DIC_CODE);
          }
        });
        this.setState({ factorData, openKeys, Data, addType: '' });
        this.handleOnkeyWord(searchValue);
      }
    }).catch(((error) => {
      message.error(!error.success ? error.message : error.note);
    }));
  };
  handleOkAdd = (values) => {
    const { dicfactorData, factorData, clickKeys, searchValue } = this.state;
    let yzfl = '';
    factorData.forEach((item) => {
      if (item.fctrId === clickKeys) {
        yzfl = item.fctrCl;
      }
    });
    if (yzfl === '0' || yzfl === '') {
      yzfl = '1';
    }
    const newData = {
      fctrId: `${values.YZMC}`,
      fctrCl: yzfl,
      fctrNm: values.YZMC,
      strtUseSt: '1',
    };
    const newTreeList = factorData.filter((item) => {
      if (item.fctrNm.indexOf(searchValue) !== -1) {
        return true;
      }
      return false;
    });
    newTreeList.push(newData);
    const Data = dicfactorData;
    let ziData = [];
    const openKeys = [];
    Data.forEach((item) => {
      ziData = newTreeList.filter((Item) => {
        if (Item.fctrCl === item.DIC_CODE) {
          return true;
        }
        return false;
      });
      ziData.forEach((itemZi) => {
        itemZi.id = itemZi.fctrId;
        itemZi.name = itemZi.fctrNm;
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
    const { dicfactorData, factorData } = this.state;
    const newTreeList = factorData.filter((item) => {
      if (item.fctrNm.indexOf(keyWord) !== -1) {
        return true;
      }
      return false;
    });
    let ziData = [];
    const openKeys = [];
    const Data = dicfactorData;
    Data.forEach((item) => {
      ziData = newTreeList.filter((Item) => {
        if (Item.fctrCl === item.DIC_CODE) {
          return true;
        }
        return false;
      });
      ziData.forEach((itemZi) => {
        itemZi.id = itemZi.fctrId;
        itemZi.name = itemZi.fctrNm;
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
    const { factorInfoData, type, yzID, Data, openKeys, clickKeys, searchValue, dxid, addType } = this.state;
    return (
      <Fragment>
        <Row style={{ height: '100%', backgroundColor: '#FFF' }}>
          <Col xs={ 6} sm={6} lg={6} xl={6} style={{ height: 'calc(100% - 2rem)', borderRight: '1px solid #E3E3E3' }}>
            {/* 左侧搜索组件 */}
            <LeftSearchComponent addName="因子名称" setCompany={this.setCompany} tgtTp={this.props.tgtTp} addType={addType} type={type} setType={this.setType} setData={this.setData} handleOk={this.handleOk} handleOkAdd={this.handleOkAdd} handleOnkeyWord={this.handleOnkeyWord} maintain={this.maintain} Data={Data} openKeys={openKeys} clickKeys={clickKeys} searchValue={searchValue} dxid={dxid} />
          </Col>
          <Col xs={18} sm={18} lg={18} xl={18} style={{ height: 'calc(100% - 2rem)'}}>
            {/* 右侧主要内容 */}
            <RightMainContent factorInfoData={factorInfoData} yzID={yzID} addType={addType} tgtTp={this.props.tgtTp} type={type} dictionary={this.props.dictionary} setType={this.setType} setCompany={this.setCompany} fetchCompanyName={this.fetchCompanyName} />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
export default FactorTabs;
