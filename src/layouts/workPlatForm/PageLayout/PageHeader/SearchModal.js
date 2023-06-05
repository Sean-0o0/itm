/**
 * 邮件发送弹窗页面
 */
import {
  Row,
  Col,
  Popconfirm,
  Modal,
  Form,
  Input,
  Table,
  DatePicker,
  message,
  Select,
  Spin,
  Radio,
  TreeSelect,
  InputNumber,
  Upload,
  Button,
  Icon, Divider, Tooltip,
} from 'antd';

const {Option} = Select;
import React from 'react';
import {connect} from 'dva';
import searchModalIcon from "../../../../image/pms/searchModal/searchModalIcon@2x.png"
import xmxxIcon from "../../../../image/pms/searchModal/xmxx@2x.png"
import ysxxIcon from "../../../../image/pms/searchModal/ysxx@2x.png"
import gysxxIcon from "../../../../image/pms/searchModal/gysxx@2x.png"
import ryxxIcon from "../../../../image/pms/searchModal/ryxx@2x.png"
import wdxxIcon from "../../../../image/pms/searchModal/wdxx@2x.png"
import {InfoCircleOutlined} from "@ant-design/icons";
import RichTextEditor from "../../../../components/pmsPage/SendMailModal/RichTextEditor";
import {GlobalSearch, QueryUserRole} from "../../../../services/pmsServices";

class searchModal extends React.Component {
  state = {
    isSpinning: false,
    //标题
    titleDataList: [],
    //项目信息
    xmxxData: [],
    totalrowsXm: 0,
    xmxxDataMoreFlag: false,
    //预算信息
    ysxxData: [],
    totalrowsYs: 0,
    ysxxDataMoreFlag: false,
    //文档信息
    wdxxData: [],
    totalrowsWd: 0,
    wdxxDataMoreFlag: false,
    //供应商信息
    gysxxData: [],
    totalrowsGys: 0,
    gysxxDataMoreFlag: false,
    //人员信息
    ryxxData: [],
    totalrowsRy: 0,
    ryxxDataMoreFlag: false,
    suffixVisable: false,
    //是否搜索过
    isSearch: false,
  };

  componentDidMount() {
    // this.globalSearch();
  }


  globalSearch = (e) => {
    console.log("String(e.target.value)", String(e.target.value))
    console.log("String(e.target.value)", e)
    console.log("String(e.target.value)", String(e.target.value) === "")
    console.log("111111")
    const key = String(e.target.value);
    this.setState({
      keyWord: String(e.target.value)
    })
    GlobalSearch({
      "content": key,
      "current": 1,
      "pageSize": 5,
      "paging": 1,
      "queryType": "ALL",
      "sort": "",
      "totalGys": -1,
      "totalRy": -1,
      "totalWd": -1,
      "totalXm": -1,
      "totalYs": -1
    })
      .then(res => {
        if (res?.code === 1) {
          this.setState({
            isSearch: true,
          })
          if (key === "") {
            console.log("22222")
            this.setState({
              titleDataList: [],
              //项目信息
              xmxxData: [],
              totalrowsXm: 0,
              xmxxDataMoreFlag: false,
              //预算信息
              ysxxData: [],
              totalrowsYs: 0,
              ysxxDataMoreFlag: false,
              //文档信息
              wdxxData: [],
              totalrowsWd: 0,
              wdxxDataMoreFlag: false,
              //供应商信息
              gysxxData: [],
              totalrowsGys: 0,
              gysxxDataMoreFlag: false,
              //人员信息
              ryxxData: [],
              totalrowsRy: 0,
              ryxxDataMoreFlag: false,
            })
          } else {
            const {
              xmxx,
              ysxx,
              wdxx,
              gysxx,
              ryxx,
              totalrowsGys,
              totalrowsRy,
              totalrowsWd,
              totalrowsXm,
              totalrowsYs
            } = res;
            let titleDataList = [];
            let reg = new RegExp("(" + key + ")", "g");
            let xmxxData = JSON.parse(xmxx);
            xmxxData.map(item => {
              return item.XMMC = item.XMMC.split(key).flatMap(str => [<span
                style={{color: '#3361ff'}}>{key}</span>, str]).slice(1)
            })
            let ysxxData = JSON.parse(ysxx);
            ysxxData.map(item => {
              return item.YSXM = item.YSXM.split(key).flatMap(str => [<span
                style={{color: '#3361ff'}}>{key}</span>, str]).slice(1)
            })
            let wdxxData = JSON.parse(wdxx);
            let gysxxData = JSON.parse(gysxx);
            gysxxData.map(item => {
              return item.GYSMC = item.GYSMC.split(key).flatMap(str => [<span
                style={{color: '#3361ff'}}>{key}</span>, str]).slice(1)
            })
            let ryxxData = JSON.parse(ryxx);
            ryxxData.map(item => {
              return item.RYMC = item.RYMC.split(key).flatMap(str => [<span
                style={{color: '#3361ff'}}>{key}</span>, str]).slice(1)
            })
            if (xmxxData.length > 0) {
              titleDataList.push("项目")
            }
            if (wdxxData.length > 0) {
              titleDataList.push("文档")
            }
            if (ysxxData.length > 0) {
              titleDataList.push("预算")
            }
            if (gysxxData.length > 0) {
              titleDataList.push("供应商")
            }
            if (ryxxData.length > 0) {
              titleDataList.push("人员")
            }
            this.setState({
              //标题
              titleDataList,
              //项目信息
              xmxxData,
              //预算信息
              ysxxData,
              //文档信息
              wdxxData,
              //供应商信息
              gysxxData,
              //人员信息
              ryxxData,
              totalrowsGys,
              totalrowsRy,
              totalrowsWd,
              totalrowsXm,
              totalrowsYs
            })
          }
        }
      })
      .catch(e => {
        message.error('全局搜索失败', 1);
      });
  }

  getMoreRes = (title, type) => {
    const {keyWord} = this.state;
    let params = {
      "content": keyWord,
      "paging": -1,
      //ALL|全部；XM|项目；WD|文档；YS|预算；GYS|供应商；RY|人员；
      "queryType": title,
      "sort": "",
      "totalGys": -1,
      "totalRy": -1,
      "totalWd": -1,
      "totalXm": -1,
      "totalYs": -1
    }
    if (type === "收起") {
      params.current = 1;
      params.pageSize = 5;
      params.paging = 1;
    }
    GlobalSearch({...params})
      .then(res => {
        if (res?.code === 1) {
          const {xmxx, ysxx, wdxx, gysxx, ryxx, totalrowsGys, totalrowsRy, totalrowsWd, totalrowsXm, totalrowsYs} = res;
          if (title === "XM") {
            let xmxxData = JSON.parse(xmxx);
            xmxxData.map(item => {
              return item.XMMC = item.XMMC.split(keyWord).flatMap(str => [<span
                style={{color: '#3361ff'}}>{keyWord}</span>, str]).slice(1)
            })
            this.setState({
              //项目信息
              xmxxData,
              xmxxDataMoreFlag: true,
            })
          }
          if (type === "收起") {
            this.setState({
              xmxxDataMoreFlag: false,
            })
          }
          if (title === "YS") {
            let ysxxData = JSON.parse(ysxx);
            ysxxData.map(item => {
              return item.YSXM = item.YSXM.split(keyWord).flatMap(str => [<span
                style={{color: '#3361ff'}}>{keyWord}</span>, str]).slice(1)
            })
            this.setState({
              //项目信息
              ysxxData,
              ysxxDataMoreFlag: true,
            })
          }
          if (type === "收起") {
            this.setState({
              ysxxDataMoreFlag: false,
            })
          }
          if (title === "WD") {
            let wdxxJson = JSON.parse(wdxx);
            this.setState({
              //项目信息
              wdxxData,
              wdxxDataMoreFlag: true,
            })
          }
          if (type === "收起") {
            this.setState({
              wdxxDataMoreFlag: false,
            })
          }
          if (title === "GYS") {
            let gysxxData = JSON.parse(gysxx);
            gysxxData.map(item => {
              return item.GYSMC = item.GYSMC.split(keyWord).flatMap(str => [<span
                style={{color: '#3361ff'}}>{keyWord}</span>, str]).slice(1)
            })
            this.setState({
              //项目信息
              gysxxData,
              gysxxDataMoreFlag: true,
            })
          }
          if (type === "收起") {
            this.setState({
              gysxxDataMoreFlag: false,
            })
          }
          if (title === "RY") {
            let ryxxData = JSON.parse(ryxx);
            ryxxData.map(item => {
              return item.RYMC = item.RYMC.split(keyWord).flatMap(str => [<span
                style={{color: '#3361ff'}}>{keyWord}</span>, str]).slice(1)
            })
            this.setState({
              //项目信息
              ryxxData,
              ryxxDataMoreFlag: true,
            })
          }
          if (type === "收起") {
            this.setState({
              ryxxDataMoreFlag: false,
            })
          }
        }
      })
      .catch(e => {
        message.error('全局搜索失败', 1);
      });
  }

  closeModal = () => {
    const {closeModal} = this.props;
    closeModal();
    this.setState({
      isSearch: false,
    })
  }

  render() {
    const {
      isSpinning,
      //标题
      titleDataList = [],
      //项目信息
      xmxxData = [],
      //预算信息
      ysxxData = [],
      //文档信息
      wdxxData = [],
      //供应商信息
      gysxxData = [],
      //人员信息
      ryxxData = [],
      totalrowsGys,
      totalrowsRy,
      totalrowsWd,
      totalrowsXm,
      totalrowsYs,
      suffixVisable = false,
      xmxxDataMoreFlag = false,
      ysxxDataMoreFlag = false,
      wdxxDataMoreFlag = false,
      gysxxDataMoreFlag = false,
      ryxxDataMoreFlag = false,
      isSearch = false,
    } = this.state;
    const {
      visible,
      dictionary: {},
      closeModal
    } = this.props;
    const {getFieldDecorator,} = this.props.form;

    return (
      <>
        <Modal
          wrapClassName="searchModal-modify"
          style={{top: '10px'}}
          width={'860px'}
          title={null}
          zIndex={100}
          bodyStyle={{
            padding: '0',
          }}
          // onOk={e => this.handleFormValidate(e)}
          onCancel={() => this.closeModal()}
          maskClosable={true}
          footer={null}
          visible={visible}
        >
          <Spin spinning={isSpinning} style={{position: 'fixed'}} tip="加载中" size="large"
                wrapperClassName="searchModal-box-spin">
            <div>
              <Input
                className="searchModal-input"
                placeholder="可查询项目、预算、文档、供应商、人员"
                onFocus={() => this.setState({
                  suffixVisable: true
                })}
                onBlur={() => this.setState({
                  suffixVisable: false
                })}
                onChange={e => this.globalSearch(e)}
                suffix={
                  <i style={{display: suffixVisable ? '' : 'none', paddingRight: '24px'}}
                     className="iconfont icon-search-name icon-personal"/>
                }
              />
              <Divider className="searchModal-divider"/>
              {
                xmxxData?.length > 0 || ysxxData?.length > 0 || wdxxData?.length > 0 || gysxxData?.length > 0 || ryxxData?.length > 0 ?
                  <div className="searchRes-div">
                    <div className="res-title">
                      {
                        titleDataList?.map((item, index) => {
                          console.log("item", item)
                          return <>
                            <div className="title">{item}</div>
                            <div className="content-box">
                              {
                                item === "项目" && xmxxData?.map(xmxx => {
                                  return <div className="content">
                                    <img className="icon" src={xmxxIcon}/>&nbsp;&nbsp;{xmxx.XMMC}
                                  </div>
                                })
                              }
                              {
                                item === "项目" && totalrowsXm > 5 && (
                                  xmxxDataMoreFlag ? <div className="more" onClick={() => this.getMoreRes("XM", "收起")}>
                                    收起&nbsp;
                                    <Icon
                                      type="up"
                                      className='label-selector-arrow'
                                    />
                                  </div> : <div className="more" onClick={() => this.getMoreRes("XM")}>
                                    更多&nbsp;
                                    <Icon
                                      type="down"
                                      className='label-selector-arrow'
                                    />
                                  </div>
                                )
                              }
                              {/*{*/}
                              {/*  item === "文档" && wdxxData?.map(wdxx =>{*/}
                              {/*    return <div className="content">*/}
                              {/*      <img className="icon" src={wdxxIcon}/>&nbsp;&nbsp;{wdxx.DFJ?.}*/}
                              {/*    </div>*/}
                              {/*  })*/}
                              {/*}*/}
                              {/*{*/}
                              {/*  item === "文档" && totalrowsWd > 5 && (*/}
                              {/*    wdxxDataMoreFlag?<div className="more" onClick={() => this.getMoreRes("WD","收起")}>*/}
                              {/*      收起&nbsp;*/}
                              {/*      <Icon*/}
                              {/*        type="up"*/}
                              {/*        className='label-selector-arrow'*/}
                              {/*      />*/}
                              {/*    </div>:<div className="more" onClick={() => this.getMoreRes("WD")}>*/}
                              {/*      更多&nbsp;*/}
                              {/*      <Icon*/}
                              {/*        type="down"*/}
                              {/*        className='label-selector-arrow'*/}
                              {/*      />*/}
                              {/*    </div>*/}
                              {/*  )*/}
                              {/*}*/}
                              {
                                item === "预算" && ysxxData?.map(ysxx => {
                                  return <div className="content">
                                    <img className="icon" src={ysxxIcon}/>&nbsp;&nbsp;{ysxx.YSXM}
                                  </div>
                                })
                              }
                              {
                                item === "预算" && totalrowsYs > 5 && (
                                  ysxxDataMoreFlag ? <div className="more" onClick={() => this.getMoreRes("YS", "收起")}>
                                    收起&nbsp;
                                    <Icon
                                      type="up"
                                      className='label-selector-arrow'
                                    />
                                  </div> : <div className="more" onClick={() => this.getMoreRes("YS")}>
                                    更多&nbsp;
                                    <Icon
                                      type="down"
                                      className='label-selector-arrow'
                                    />
                                  </div>
                                )
                              }
                              {
                                item === "供应商" && gysxxData?.map(gysxx => {
                                  return <div className="content">
                                    <img className="icon" src={gysxxIcon}/>&nbsp;&nbsp;{gysxx.GYSMC}
                                  </div>
                                })
                              }
                              {
                                item === "供应商" && totalrowsGys > 5 && (
                                  gysxxDataMoreFlag ?
                                    <div className="more" onClick={() => this.getMoreRes("GYS", "收起")}>
                                      收起&nbsp;
                                      <Icon
                                        type="up"
                                        className='label-selector-arrow'
                                      />
                                    </div> : <div className="more" onClick={() => this.getMoreRes("GYS")}>
                                      更多&nbsp;
                                      <Icon
                                        type="down"
                                        className='label-selector-arrow'
                                      />
                                    </div>
                                )
                              }
                              {
                                item === "人员" && ryxxData?.map(ryxx => {
                                  return <div className="content">
                                    <img className="icon" src={ryxxIcon}/>&nbsp;&nbsp;{ryxx.NAME}
                                  </div>
                                })
                              }
                              {
                                item === "人员" && totalrowsRy > 5 && (
                                  ryxxDataMoreFlag ? <div className="more" onClick={() => this.getMoreRes("RY", "收起")}>
                                    收起&nbsp;
                                    <Icon
                                      type="up"
                                      className='label-selector-arrow'
                                    />
                                  </div> : <div className="more" onClick={() => this.getMoreRes("RY")}>
                                    更多&nbsp;
                                    <Icon
                                      type="down"
                                      className='label-selector-arrow'
                                    />
                                  </div>
                                )
                              }
                            </div>
                            <Divider style={{display: index === titleDataList.length - 1 ? "none" : ''}}
                                     className='content-divider'/>
                          </>
                        })
                      }
                    </div>
                  </div>
                  : <div className="searchModal-div">
                    <div><img className="searchModal-img" src={searchModalIcon} alt=''/></div>
                    <div style={{paddingTop: '12px'}}><span
                      className="searchModal-span">{isSearch ? "暂无数据" : "随时随地，搜索项目相关信息"}</span></div>
                  </div>

              }
            </div>
          </Spin>
        </Modal>
      </>
    );
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(Form.create()(searchModal));
