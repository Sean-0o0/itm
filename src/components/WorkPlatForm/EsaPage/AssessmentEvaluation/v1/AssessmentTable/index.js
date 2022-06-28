/* eslint-disable jsx-a11y/anchor-is-valid */
/*
 * @Description: 考核表
 * @Autor: 
 * @Date: 2020-11-11 11:07:27
 */
import React, { Component } from 'react';
import { Table, Button, message, InputNumber, Input, Spin } from 'antd';
import { FetchQueryHrPrfmScoreRslt, FetchOperateHrPrfmScorePsrv } from '../../../../../../services/EsaServices/assessmentEvaluation';
import BasicModal from '../../../../../Common/BasicModal';
import AssessmentNotice from '../AssessmentNotice';

class AssessmentTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnList: [],
      dataSource: [],
      visible: false,
      spinning: false,
    };
  }

  componentDidMount() {
    const { payload = {} } = this.props;
    this.fetchQueryHrPrfmScoreRslt(payload);
  }

  onInput = (value, index, dataIndex, weight) => {
    const { dataSource } = this.state;
    Reflect.set(dataSource[index], dataIndex, value);
    const scoreColumnList = this.getScoreColumnList();
    let totalScore = 0;
    scoreColumnList.forEach(column => {
      totalScore += ((dataSource[index][column] || 0) * (dataSource[index][`${column}_WT`] || 1) * 100);
    });
    Reflect.set(dataSource[index], 'EXAM_SCORE', totalScore / 100);
    this.setState({ dataSource });
  }

  onVisibleChange = (visible) => {
    this.setState({ visible });
  }

  onSubmit = (oprType) => {
    if (!this.validateTable()) {
      return;
    }
    this.setState({ spinning: true }, async () => {
      const { dataSource } = this.state;
      const { payload: { year, examPgmId } } = this.props;
      const scoreColumnList = this.getScoreColumnList();
      try {
        for (let data of dataSource) {
          await FetchOperateHrPrfmScorePsrv({
            examPgmId,
            examScore: data.EXAM_SCORE,
            itmDtl: scoreColumnList.map((sc, index) => `${sc.split('_')[1]};${data[sc]}`).join('|'),
            oprType,
            prfmRelaId: data.PRFM_RELA_ID,
            remk: data.REMK,
            year,
          });
        }
        this.setState({ spinning: false });
        message.success(oprType === '1' ? '保存成功' : '提交成功');
        setTimeout(() => window.location.href = `/#/esa/evaluation/v1/assessmentList`, 1000);
      } catch (e) {
        this.setState({ spinning: false });
        message.error(!e.success ? e.message : e.note);
      }
      // Promise.all(dataSource.map(data => {
      //   return FetchOperateHrPrfmScorePsrv({
      //     examPgmId,
      //     examScore: data.EXAM_SCORE,
      //     itmDtl: scoreColumnList.map((sc, index) => `${sc.split('_')[1]};${data[sc]}`).join('|'),
      //     oprType,
      //     prfmRelaId: data.PRFM_RELA_ID,
      //     remk: data.REMK,
      //     year,
      //   })
      // })).then(res => {
      //   this.setState({ spinning: false });
      //   message.success(oprType === '1' ? '保存成功' : '提交成功');
      //   setTimeout(() => window.location.href = `/#/esa/evaluation/assessmentList`, 1000);
      // }).catch(e => {
      //   this.setState({ spinning: false });
      //   message.error(!e.success ? e.message : e.note);
      // });
    });
  }

  getScoreColumnList = () => {
    const { columnList } = this.state;
    const scoreColumnList = columnList.filter(c => c.startsWith('3;')).map(column => {
      const [, dataIndex,] = column.split(';');
      return dataIndex;
    });
    return scoreColumnList;
  }

  fetchQueryHrPrfmScoreRslt = (payload) => {
    FetchQueryHrPrfmScoreRslt({ ...payload }).then(res => {
      const { note, records, code } = res;
      if (code > 0) {
        this.setState({ columnList: note.split('|') }, () => {
          this.renderDataSource(records);
        });
      } else {
        message.error(note);
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    });
  }

  fetchOperateHrPrfmScorePsrv = () => {
    FetchOperateHrPrfmScorePsrv().then(res => {
      const { note, code } = res;
      if (code > 0) {
        message.success(note);
      } else {
        message.error(note);
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    });
  }

  validateTable = () => {
    const scoreColumnList = this.getScoreColumnList();
    const { dataSource } = this.state;
    for (let i = 0; i < dataSource.length; i++) {
      const data = dataSource[i];
      for (let j = 0; j < scoreColumnList.length; j++) {
        if (data.EXAM_SCORE === '' || !data[scoreColumnList[j]]) {
          message.error('请将分数填写完整！');
          return false;
        }
      }
    }
    return true;
  }

  renderDataSource = (records = []) => {
    const dataSource = records.map((record, index) => {
      const propList = JSON.parse(record.mapFiled);
      const data = {};
      for (let prop of propList) {
        const { name = '', value = '' } = prop;
        Reflect.set(data, name, value);
      }
      return data;
    });
    const scoreColumnList = this.getScoreColumnList();
    dataSource.forEach((data, index) => {
      let totalScore = 0;
      scoreColumnList.forEach(column => {
        totalScore += ((dataSource[index][column] || 0) * (dataSource[index][`${column}_WT`] || 1) * 100);
      });
      Reflect.set(dataSource[index], 'EXAM_SCORE', totalScore / 100);
    })
    this.setState({ dataSource });
  }

  renderColumns = (columnList, status) => {
    return columnList.map(column => {
      const [type, dataIndex, title] = column.split(';');
      return {
        title,
        dataIndex,
        render: (text, record, index) => {
          switch (type) {
            case '2':
              return <InputNumber disabled style={{ width: '100%' }} value={text} onChange={value => this.onInput(value, index, dataIndex)} />;
            case '3':
              return <InputNumber readOnly={status === '2'} style={{ width: '100%' }} value={text} onChange={value => this.onInput(value, index, dataIndex, record[`${dataIndex}_WT`])} />;
            case '4':
              return <Input readOnly={status === '2'} value={text} onInput={e => this.onInput(e.target.value, index, dataIndex)} />
            default:
              return text;
          }
        }
      }
    })
  }
  render() {
    const { columnList, dataSource, visible, spinning } = this.state;
    const { payload: { year, adpatScoreType, status }, params } = this.props;
    return (
      <Spin spinning={spinning}>
        <div className="esa-evaluate-table">
          <div className="dis-fx alc">
            <div className="flex table-title">{year}年度分公司主要负责人能力素质及履职情况考核表</div>
            <div>
              <a className="table-link-btn" onClick={() => this.onVisibleChange(true)}><i className="iconfont icon-warning-circle" />&nbsp;考评说明与考评标准</a>
            </div>
          </div>
          <Table
            className="esa-evaluate-notice-table"
            rowKey="SEQ"
            size="middle"
            bordered
            columns={this.renderColumns(columnList, status)}
            dataSource={dataSource}
            pagination={false}
          />
          <div className="tc">
            <Button disabled={dataSource.length === 0 || status === '2'} className="m-btn-radius m-btn-gray" onClick={() => this.onSubmit('1')} >保存草稿</Button>
            <Button disabled={dataSource.length === 0 || status === '2'} className="m-btn-radius m-btn-headColor" onClick={() => this.onSubmit('2')} >提交生效</Button>
          </div>
          <BasicModal
            title="考评说明与考评标准"
            visible={visible}
            footer={null}
            onCancel={() => this.onVisibleChange(false)}
            width="85rem"
            bodyStyle={{ maxHeight: '50rem', overflow: 'hidden auto' }}
          >
            <AssessmentNotice id={adpatScoreType} buttonHidden params={params} noMargin />
          </BasicModal>
        </div>
      </Spin>
    );
  }
}

export default AssessmentTable;