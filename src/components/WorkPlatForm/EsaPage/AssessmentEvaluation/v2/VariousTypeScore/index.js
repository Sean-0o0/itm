/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { Row, Col, message, Button, Spin } from 'antd';
import { FetchQueryHrPrfmScoreRslt, FetchOperateHrPrfmScorePsrv } from "../../../../../../services/EsaServices/assessmentEvaluation"
import ScoreDescribe from './ScoreDescribe';
import AssessmentTable from './AssessmentTable';
import ExcelImport from './Common/ExcelImport';

class VariousTypeScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      data: {
        records: [],
        total: 0,
      },
      xmlb: [], // 表格按考核项目类别划分
      xmgz: [], // 表格按考核规则合并
      spinning: false,
    };
  }
  componentWillMount() {
    this.updateDimensions();
    this.fetchData();
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  updateDimensions = () => {
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    this.setState({ height });
  }

  fetchData = () => {
    const { params: { adpatScoreType = '', examPgmId = '', year = '', orgNo = '' } } = this.props;
    FetchQueryHrPrfmScoreRslt({
      adpatScoreType, //考核的类型 25|自评   26|互评  27|督办  28|专评
      examPgmId,
      year,
      orgNo,
    }).then((ret = {}) => {
      const { records = [], code = 0, total = 0, } = ret || {};
      if (code > 0) {
        const arrayTwo = Object.values(records.reduce((res, item) => {
          res[item.examPgmName] ? res[item.examPgmName].push(item) : res[item.examPgmName] = [item];
          return res;
        }, {}));
        const arrayXmsm = Object.values(records.reduce((res, item) => {
          item.examPgmName === '重点事项' ? res[item.examStd] ? res[item.examStd].push(item) : res[item.examStd] = [item] : res[item.examItmName] = [item];
          return res;
        }, {}));
        const xmlb = [0];
        const xmgz = [0];
        arrayTwo.map((item, index) => {
          xmlb.push(item.length + xmlb[index]);
        });
        arrayXmsm.map((item, index) => {
          xmgz.push(item.length + xmgz[index]);
        });
        this.setState({
          data: {
            records: [
              ...records,
            ],
            total: total,
          },
          xmlb,
          xmgz,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  onImportChange = (fj) => {
    const fjarr = JSON.parse(fj);
    if (fjarr.length > 0) {
      const { data: { records = [] } } = this.state;
      let newArray = [];
      for (let i = 0; i < fjarr.length; i++) {
        let newObj = Object.assign(records[fjarr[i].number - 1], fjarr[i]);
        newArray.push(newObj);
      }
      this.setState({
        data: {
          records: [
            ...newArray,
          ],
        },
      });
    }
  }
  download = () => { // 下载模板
    window.open(`${localStorage.getItem('livebos') || ''}/OperateProcessor?Column=MBFJ&PopupWin=false&Table=TTYMBWH&operate=Download&&Type=Attachment&ID=22`);
  }
  handleSubmit = (type) => {
    this.setState({ spinning: true }, async () => {
      const { data: { records = [] } } = this.state;
      const { params: { year = '', examPgmId = '' } } = this.props;
      let array = Object.values(records.reduce((res, item) => {
        res[item.prfmRelaId] ? res[item.prfmRelaId].push(item) : res[item.prfmRelaId] = [item];
        return res;
      }, {}));
      try {
        for (let data of array) {
          let examScore = 0;
          // eslint-disable-next-line array-callback-return
          data.map((item) => {
            let examItemScore = 0;
            if (isNaN(item.itmWt)) {
              examScore = Number(item.examScore);
            } else {
              examScore = Number(Number(item.examScore) * Number(item.itmWt));
            }
            examScore = examScore + examItemScore;
          });
          const itmDtl = data.map((item) => {
            return `${item.examItmId};${item.examScore}`;
          }).join("|");
          const remk = data.map((item) => {
            return `${item.examItmId};${item.remk}`;
          }).join("|");
          await FetchOperateHrPrfmScorePsrv({
            year,
            examPgmId,
            oprType: type, // 1|保存草稿;2|提交
            prfmRelaId: data[0].prfmRelaId,
            examScore,
            itmDtl,
            remk,
          });
        }
        message.success(type === '1' ? '保存成功' : '提交成功');
        setTimeout(() => window.history.back());
      } catch (e) {
        message.error(!e.success ? e.message : e.note);
      }
      this.setState({ spinning: false });
    });
  }
  render() {
    const { params } = this.props;
    const { height, data, xmlb, xmgz, spinning } = this.state;
    const importProps = {
      // className: 'fr',
      headName: '序号,打分,打分说明',
      headField: 'number,examScore,remk',
      datalength: data.records.length,
      onChange: this.onImportChange,
      disabled: params.disabled,
      dataRecords: data.records,
      style: { marginRight: '10px' },
    };
    let title = '';
    if (params.adpatScoreType === '25') {
      title = `${params.orgName}效率自评`
    } else if (params.adpatScoreType === '26') {
      title = '协同互评'
    } else if (params.adpatScoreType === '27') {
      title = `${params.examType === '1' ? '业务条线' :'职能部门'}${params.examPgmName}质量系数专评`
    } else if (params.adpatScoreType === '28') {
      title = '督办'
    }
    return (
      <Spin spinning={spinning}>
        <div className="bg-white" style={{ padding: '2rem', height, overflow: 'hidden' }}>
          <Row className="m-row">
            <Col xs={24} sm={24} lg={24} xl={24}>
              <Row>
                <Col xs={12} sm={12} lg={12} xl={12}>
                  <h2 style={{ fontWeight: 'bolder' }}>{title}</h2>
                </Col>
                <Col xs={12} sm={12} lg={12} xl={12}>
                  <div style={{ display: 'inline-block', float: 'right' }}>
                    <Button onClick={() => { this.download(); }} className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" style={{ marginRight: '10px' }}>模板下载</Button>
                    <ExcelImport {...importProps} />
                    <Button onClick={() => { window.history.back(); }} className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c">返回</Button>
                  </div>
                </Col>
              </Row>
              {
                //自评没有打分说明
                params.adpatScoreType !== '25' && <ScoreDescribe data={data} />
              }
              <AssessmentTable params={params} data={data} xmlb={xmlb} xmgz={xmgz} height={height} handleSubmit={this.handleSubmit} />
            </Col>
          </Row>
        </div>
      </Spin>
    );
  }
}

export default VariousTypeScore;