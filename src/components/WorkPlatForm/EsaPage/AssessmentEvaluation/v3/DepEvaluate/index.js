/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { Row, Card, Button, Col, message, Modal, Spin } from 'antd';
import {
  FetchqueryExamTotal,
  FetchqueryExamResult,
  FetchOperateHrPrfmScorePsrv,
  FetchOperateHrPrfmScorePsrvSpecial,
} from '../../../../../../services/EsaServices/assessmentEvaluation';
import { FetchSysCommonTable } from '../../../../../../services/sysCommon';
import RightTable from './RightTable';
import LeftTable from './LeftTable';
import SearchItem from "./SearchItem";
import moment from 'moment';
import 'moment/locale/zh-cn';
import _ from 'lodash';
import config from '../../../../../../utils/config';
const { api } = config;
const { esa: { operateExamResultExport } } = api;

const event = new Event("setItemEvent");


class LeaderEvaluate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageState: {  // 分页查询条件
        paging: 0,
        current: 1,
        pageSize: 99,
        total: -1,
        sort: '',
      },
      examParams: {
        orgId: '1',//组织机构
        yr: moment().add(-1, 'y').year().toString(), //年度
        pgmId: '',
      },
      selectedRow: {}, // 已经选中的行
      columnsMinStatus: true,   //表格是否是收缩状态
      examData: { // 左边打分合计表格数据
        records: [],
        total: 0,
      },
      examMxData: { // 右边打分明细表格数据
        records: [],
        total: 0,
      },
      oldExamMxData: [], // 暂存选中行对应右边打分明细数据
      falb: [], // 打分明细按方案类别划分
      xmlb: [], // 打分明细按考核项目类别划分
      xmsm: [], // 打分明细按考核项目说明相同合并
      spinning: false,
      disabled: false,
      pgmList: [], // 考核主方案
      initialization: false, // 是否展示右边表格
      height: 0, // 左侧表格显示高度
    };
  }

  componentDidMount() {
    this.fetchProgramme();
    this.updateDimensions();
    this.updateDimensionsThrottled = _.throttle(this.updateDimensions, 1000, { leading: true, trailing: true });
    window.addEventListener('resize', this.updateDimensionsThrottled);
    this.newLocalStorage();
  }

  newLocalStorage = () => {
    let originalSetItem = localStorage.setItem;
		//重写setItem函数
		localStorage.setItem = function(key,newValue){
      //创建setItemEvent事件

			event.key = key;
			event.newValue = newValue;
			//提交setItemEvent事件
			window.dispatchEvent(event);
			//执行原setItem函数
			originalSetItem.apply(this,arguments);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensionsThrottled);
  }

  updateDimensions = () => {
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    const [search] = document.getElementsByClassName('esa-evaluate-form');
    const searchBottom = search.getBoundingClientRect().bottom + 16;
    height -= searchBottom;
    this.setState({ height });
  };

  //获取考核方案
  fetchProgramme = () => {
    const { id = '' } = this.props;
    const { examParams } = this.state;
    FetchSysCommonTable({ objectName: 'TPRFM_PGM' }).then((res) => {
      const { code, records = [] } = res;
      if (code > 0 && records.length > 0) {
        const pgmList = [];
        records.forEach((item) => {
          const list = {
            ibm: item.PGM_NO,
            note: item.PGM_NAME,
          }
          pgmList.push(list);
        });
        this.setState({
          pgmList,
          examParams: {
            ...examParams,
            pgmId: id !== '' ? id : records[1].PGM_NO,
          }
        }, () => { this.fetchLeftTable(); });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    })
  }

  //获取左侧表格数据
  fetchLeftTable = (type = this.state.initialization) => {
    const { pageState, examParams } = this.state;
    const { id = '' } = this.props;
    const params = {
      ...pageState,
      ...examParams,
    }
    FetchqueryExamTotal(params).then(res => {
      const { records = [], code = 0, total = 0 } = res;
      const numList = records.filter((item) => item.flag === '1' );
      localStorage.setItem('examTotal', numList.length);
      if (code > 0 && records.length > 0) {
        this.setState({
          examData: {
            records: [
              ...records,
            ],
            total: total,
          },
          columnsMinStatus:false,
          selectedRow: type ? records[0] : {},
          disabled: id !== '' || records[0].flag === '0',
        }, () => { type && this.fetchRightTable(type); });
      } else {
        this.setState({
          examData: { // 左边打分合计表格数据
            records: [],
            total: 0,
          },
          examMxData: { // 右边打分明细表格数据
            records: [],
            total: 0,
          },
          selectedRow: {}, // 已经选中的行
          oldExamMxData: [],
          disabled: true,
        });
        type && message.success('查询成功,暂无数据');
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    });
  }

  //获取右侧明细表格数据
  fetchRightTable = (type) => {
    const { pageState, examParams: { yr = '', pgmId = '' }, selectedRow: { orgId = '', roleId = '' } } = this.state;
    const params = {
      ...pageState,
      yr,
      orgId,
      roleId,
      examType: '',
      examPgmId: pgmId,
    }
    FetchqueryExamResult(params).then(res => {
      const { records = [], code = 0, total = 0 } = res;
      if (code > 0 && records.length > 0) {
        const arrayFalb = Object.values(records.reduce((res, item) => {
          res[item.pgmType] ? res[item.pgmType].push(item) : res[item.pgmType] = [item];
          return res;
        }, {}));
        const arrayXmlb = Object.values(records.reduce((res, item) => {
          res[item.itmClass] ? res[item.itmClass].push(item) : res[item.itmClass] = [item];
          return res;
        }, {}));
        const arrayXmsm = Object.values(records.reduce((res, item, index) => {
          item.pgmType === '质量考核' || item.itmClass === '重点事项' ? res[item.examItmRemk] ? res[item.examItmRemk].push(item) : res[item.examItmRemk] = [item] : res[item.examItm + index] = [item];
          return res;
        }, {}));
        const falb = [0];
        const xmlb = [0];
        const xmsm = [0];
        arrayFalb.map((item, index) => {
          falb.push(item.length + falb[index]);
        });
        arrayXmlb.map((item, index) => {
          xmlb.push(item.length + xmlb[index]);
        });
        arrayXmsm.map((item, index) => {
          xmsm.push(item.length + xmsm[index]);
        });
        this.setState({
          examMxData: {
            records: [
              ...records,
            ],
            total: total,
          },
          oldExamMxData: JSON.parse(JSON.stringify(records)),
          falb,
          xmlb,
          xmsm,
          spinning: false,
        });
        type && message.success('查询成功');
      } else {
        this.setState({
          examMxData: { // 右边打分明细表格数据
            records: [],
            total: 0,
          },
          oldExamMxData: [],
          falb: [],
          xmlb: [],
          spinning: false,
        });
        type && message.success('查询成功,暂无数据');
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    });
  }

  // 打分后刷新左侧总计数据
  fetchMxTotalData = () => {
    const { pageState, examParams, selectedRow } = this.state;
    const { id = '' } = this.props;
    const params = {
      ...pageState,
      ...examParams,
      // orgId: selectedRow.orgId,
    }
    FetchqueryExamTotal(params).then(res => {
      const { records = [], code = 0 } = res;
      const numList = records.filter((item) => item.flag === '1' );
      localStorage.setItem('examTotal', numList.length);
      if (code > 0 && records.length > 0) {
        const newSelected = records.filter((item) => item.orgId === selectedRow.orgId && item.roleId === selectedRow.roleId);
        this.setState({
          examData: {
            records: [
              ...records,
            ],
            total: records.length,
          },
          selectedRow: newSelected.length > 0 ? newSelected[0] : records[0],
          disabled: id !== '' || newSelected[0]?(newSelected[0].flag === '0'):false,
        }, () => { this.fetchRightTable(false); });
      } else if (code > 0 && records.length === 0) {
        this.setState({
          examData: { // 左边打分合计表格数据
            records: [],
            total: 0,
          },
          examMxData: { // 右边打分明细表格数据
            records: [],
            total: 0,
          },
          selectedRow: {}, // 已经选中的行
          oldExamMxData: [],
          disabled: true,
        });
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    });
  }

  //左侧表格收缩状态改变
  changeLeftColumnsStatus = (value) => {
    this.setState({
      columnsMinStatus: value
    })
  }

  //改变选择行
  changeSelectedRow = (row) => {
    const { id = '' } = this.props;
    const xg = this.operationXg();
    if (xg) {
      Modal.confirm({
        title: '提示：',
        content: '你还没有保存草稿或者提交，是否继续？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.setState({
            selectedRow: row,
            disabled: id !== '' || row.flag === '0',
            initialization: true,
          }, () => { this.fetchRightTable(true); this.refleshForm(); });
        },
      });
    } else {
      this.setState({
        selectedRow: row,
        disabled: id !== '' || row.flag === '0',
        initialization: true,
      }, () => { this.fetchRightTable(true); this.refleshForm(); });
    }
  }

  //组织机构改变
  zzjgChange = (value) => {
    const { examParams } = this.state;
    if (examParams.orgId !== value) {
      const xg = this.operationXg();
      if (xg) {
        Modal.confirm({
          title: '提示：',
          content: '你还没有保存草稿或者提交，是否继续？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => this.setState({
            examParams: {
              ...examParams,
              orgId: value,
            },
          }, () => { this.fetchLeftTable(); this.refleshForm() }),
        });
      } else {
        this.setState({
          examParams: {
            ...examParams,
            orgId: value,
          },
        }, () => { this.fetchLeftTable(); this.refleshForm() })
      }
    }
  }

  //年度时间改变
  yearChange = (value) => {
    const { examParams } = this.state;
    if (examParams.yr !== value) {
      const xg = this.operationXg();
      if (xg) {
        Modal.confirm({
          title: '提示：',
          content: '你还没有保存草稿或者提交，是否继续？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => this.setState({
            examParams: {
              ...examParams,
              yr: value,
            },
          }, () => { this.fetchLeftTable(); this.refleshForm() }),
        });
      } else {
        this.setState({
          examParams: {
            ...examParams,
            yr: value,
          },
        }, () => { this.fetchLeftTable(); this.refleshForm() })
      }
    }
  }

  // 考核方案改变
  khfaChange = (value) => {
    const { examParams } = this.state;
    if (examParams.pgmId !== value) {
      const xg = this.operationXg();
      if (xg) {
        Modal.confirm({
          title: '提示：',
          content: '你还没有保存草稿或者提交，是否继续？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => this.setState({
            examParams: {
              ...examParams,
              pgmId: value,
            },
          }, () => { this.fetchLeftTable(); this.refleshForm() }),
        });
      } else {
        this.setState({
          examParams: {
            ...examParams,
            pgmId: value,
          },
        }, () => { this.fetchLeftTable(); this.refleshForm() })
      }
    }
  }

  // 判断是否修改打分明细
  operationXg = () => {
    const { oldExamMxData = [], examMxData: { records = [] } } = this.state;
    let xg = false;
    oldExamMxData.forEach((item, index) => {
      if (item.scor !== records[index].scor || item.scorRemk !== records[index].scorRemk) {
        xg = true;
      }
    });
    return xg;
  }

  // 清空右边明细表格数据
  refleshForm = (type = this.state.initialization) => {
    type && this.rightValue.refleshForm()
    type && this.leftValue.refleshForm()
  }

  // 表单提交
  handleClick = (e, type) => {
    if (type === '1') {
      this.rightValue.preservation();
      this.leftValue.preservation();
    } else {
      this.rightValue.submit();
      this.leftValue.submit();
    }
  };

  handleSubmit = (type) => {
    this.setState({ spinning: true }, async () => {
      const { examParams: { yr = '' }, examMxData: { records = [] } } = this.state;
      const arrayKhfa = Object.values(records.reduce((res, item) => {
        res[item.examPgmId] ? res[item.examPgmId].push(item) : res[item.examPgmId] = [item];
        return res;
      }, {}));
      try {
        for (let data of arrayKhfa) {
          const itmDtl = data.map((item) => {
            return `${item.examItmId};${item.scor}`;
          }).join("|");
          const remk = data.map((item) => {
            return `${item.examItmId};${item.scorRemk}`;
          }).join("|");
          let examScore = 0
          data.map((item) => {
            let examItemScore = 0;
            if (item.examItmWt === '') {
              examItemScore = Number(item.scor);
            } else {
              examItemScore = Number(Number(item.scor) * Number(item.examItmWt));
            }
            examScore = examScore + examItemScore;
          });
          await FetchOperateHrPrfmScorePsrv({
            year: yr,
            examPgmId: data[0].examPgmId,
            oprType: type, // 1|保存草稿;2|提交
            prfmRelaId: data[0].prfmRelaId,
            examScore,
            itmDtl,
            remk,
          });
        }
        message.success(type === '1' ? '保存成功' : '提交成功');
        this.fetchMxTotalData();
      } catch (e) {
        message.error(!e.success ? e.message : e.note);
      }
      this.setState({ spinning: false });
    });
  }

  handleSubmitLeft = (type) => {
    this.setState({ spinning: true }, async () => {
      const { examParams: { yr = '', pgmId = '' }, examData: {}} = this.state;
      const arrayleft = Object.values(this.state.examData.records.reduce((res, item) => {
        res[item.examPgmId] ? res[item.examPgmId].push(item) : res[item.examPgmId] = [item];
        return res;
      }, {}));
      try {
        // console.log("arrayleft",arrayleft);
        for (let data of arrayleft[0]) {
          await FetchOperateHrPrfmScorePsrvSpecial({
            yr: yr,
            examPgmId: pgmId,
            oprType: type, // 1|保存草稿;2|提交
            ceoTotal:data.ceoTotal,
            secTotal:data.secTotal,
            chairTotal:data.chairTotal,
            orgId:data.orgId,
          });
        }
        // message.success(type === '1' ? '保存成功' : '提交成功');
        // this.fetchMxTotalData();
      } catch (e) {
        message.error(!e.success ? e.message : e.note);
      }
      this.setState({ spinning: false });
    });
  }

  handleExport = () => {
    const { pageState, examParams: { yr = '', pgmId = '' }, selectedRow: { orgId = '', roleId = '', orgName = '', examType = '', target = '', effTotal = '', qltyTotal = '', scorTotal = '' } } = this.state;
    const params = {
      ...pageState,
      yr,
      orgId,
      roleId,
      examType: '',
      examPgmId: pgmId,
    }

    const payload = {
      title: `${yr}${orgName}年度考核`,
      explain: examType === '2' ? '核心目标' : '打分说明',
      target: examType === '2' ? target : '达成目标值得100分，达成挑战值得120分，低于门槛值最高80分。',
      paramsInfo: JSON.stringify(params),
      effTotal,
      qltyTotal,
      scorTotal
    };
    const form1 = document.createElement('form');
    form1.id = 'form1';
    form1.name = 'form1';
    // 添加到 body 中
    document.getElementById('m_iframe').appendChild(form1);
    // 创建一个输入
    const input = document.createElement('input');
    // 设置相应参数
    input.type = 'text';
    input.name = 'exportPayload';
    input.value = JSON.stringify(payload);

    // 将该输入框插入到 form 中
    form1.appendChild(input);

    // form 的提交方式
    form1.method = 'POST';
    // form 提交路径
    form1.action = operateExamResultExport;

    // 对该 form 执行提交
    form1.submit();
    // 删除该 form
    document.getElementById('m_iframe').removeChild(form1);
  }

  render() {
    const { id = '', shuji = false } = this.props;
    const { disabled, height = 0, examParams, columnsMinStatus, selectedRow, examData, examMxData, falb, xmlb, xmsm, spinning, pgmList, initialization } = this.state;
    const leftCol = initialization ? columnsMinStatus ? 3 : 18 : 24;
    const rightCol = columnsMinStatus ? 21 : 6;
    return (
      <Spin spinning={spinning}>
        <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
        <Card
          className='esa-evaluate-lender-card'
          title={id === '' && "考评汇总"}
          headStyle={{ fontWeight: "600" }}
          extra={id === '' && (<Row>
            {selectedRow.orgId && <Button className="m-btn-radius m-btn-headColor" onClick={() => this.handleExport()} >导出</Button>}
            <Button className="m-btn-radius m-btn-headColor" disabled={disabled} onClick={(e) => this.handleClick(e, '2')}>提交</Button>
            <Button className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" disabled={disabled} onClick={(e) => this.handleClick(e, '1')}>保存草稿</Button>
          </Row>)}
          style={{ width: "100%" }}
        >
          {/* 搜索 */}
          <SearchItem examParams={examParams} pgmList={pgmList} id={id} zzjgChange={this.zzjgChange} yearChange={this.yearChange} khfaChange={this.khfaChange}></SearchItem>
          <Row className="bg-white" style={{ width: "100%", height: "100%" }}>
            <Col xs={leftCol} sm={leftCol} lg={leftCol} xl={leftCol} style={{ height: height, boxShadow: '6px 0 6px -3px rgba(0,0,0,.15)' }}>
              <LeftTable
                height={height}
                data={examData}
                changeLeftColumnsStatus={this.changeLeftColumnsStatus}
                columnsMinStatus={columnsMinStatus}
                changeSelectedRow={this.changeSelectedRow}
                selectedRow={selectedRow}
                initialization={initialization}
                handleSubmitLeft={this.handleSubmitLeft}
                wrappedComponentRef={(a) => { this.leftValue = a; }}
              ></LeftTable>
            </Col>
            {initialization && <Col xs={rightCol} sm={rightCol} lg={rightCol} xl={rightCol} style={{ paddingLeft: 3, borderTop: '1px solid #E7E9F0' }}>
              <RightTable
                height={height}
              	disabled={disabled}
              	data={examMxData}
              	falb={falb}
              	xmlb={xmlb}
              	xmsm={xmsm}
              	selectedRow={selectedRow}
              	shuji={shuji}
              	yr={examParams.yr}
              	columnsMinStatus={columnsMinStatus}
              	handleSubmit={this.handleSubmit}
                wrappedComponentRef={(a) => { this.rightValue = a; }}
              ></RightTable>
            </Col>}
          </Row>
        </Card>
      </Spin>
    );
  }
}

export default LeaderEvaluate;
// export default Form.create()(BusEvaluate);
