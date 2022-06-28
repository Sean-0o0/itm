import React, { Component, Fragment } from 'react';
import { Row, Form, Col } from 'antd';
import IndexTable from './IndexTable';
/**
 * 必选指标
 */
class MandatorySelectedIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  onIndexTableRef = (ref) => {
    this.indexTableRef = ref;
  }

  handleSubmit = () => {
    return this.indexTableRef.handleSubmit()
  }

  // handleSubmit=() => {
  //   const { indexDetail = [] } = this.props;
  //   const dataSource = [...indexDetail].filter(item => item.isMust === '1');
  //   const indexList = [];
  //   for (let i = 0; i < dataSource.length; i++) {
  //     const obj = dataSource[i];
  //     const indexObj = {
  //       ID: Number(obj.id) || '',
  //       SNO: Number(obj.sno) || '',
  //       EXAM_INDI: Number(obj.examIndi) || '',
  //       EMP_CLASS_ID: Number(obj.empClassId) || '',
  //       EMP_LEVEL_ID: Number(obj.empLevelId) || '',
  //       // INDI_NAME: obj.indiName || '',
  //       // INDI_CODE: obj.indiCode || '',
  //       EXAM_WEIGHT: Number(obj.examWeight) || '',
  //       IS_MUST: Number(obj.isMust) || '',
  //       EXAM_STD1: Number(obj.examStd1) || '',
  //       EXAM_STD2: Number(obj.examStd2) || '',
  //       EXAM_STD3: Number(obj.examStd3) || '',
  //       EXAM_STD4: Number(obj.examStd4) || '',
  //       EXAM_STD5: Number(obj.examStd5) || '',
  //       EXAM_STD6: Number(obj.examStd6) || '',
  //       EXAM_STD7: Number(obj.examStd7) || '',
  //       EXAM_STD8: Number(obj.examStd8) || '',
  //       EXAM_STD9: Number(obj.examStd9) || '',
  //       EXAM_STD10: Number(obj.examStd10) || '',
  //       SCORE_BTM: Number(obj.scoreBtm) || '',
  //       SCORE_TOP: Number(obj.scoreTop) || '',
  //       SCORE_MODE_ID: Number(obj.scoreModeId) || '',
  //       WEIGHT_BTM: Number(obj.WeightBtm) || '',
  //       WEIGHT_TOP: Number(obj.WeightTop) || '',
  //       ZERO_THLD: Number(obj.zeroThld) || '',
  //       PCT_THLD: Number(obj.pctThld) || '',
  //       BIZ_QTY_UNIT: obj.bizQtyUnit || '',
  //       PCT_THLD_UNIT: obj.pctThldUnit || '',
  //       CVRT_RATIO: Number(obj.cvrtRatio) || '',
  //       STD1_SCORE: Number(obj.std1Score) || '',
  //       STD2_SCORE: Number(obj.std2Score) || '',
  //       STD3_SCORE: Number(obj.std3Score) || '',
  //       STD4_SCORE: Number(obj.std4Score) || '',
  //       STD5_SCORE: Number(obj.std5Score) || '',
  //       STD6_SCORE: Number(obj.std6Score) || '',
  //       STD7_SCORE: Number(obj.std7Score) || '',
  //       STD8_SCORE: Number(obj.std8Score) || '',
  //       STD9_SCORE: Number(obj.std9Score) || '',
  //       STD10_SCORE: Number(obj.std10Score) || '',
  //     };
  //     indexList.push(indexObj);
  //   }
  //   return indexList;
  // }
  // fetchColumns=() => {
  //   const columns = [
  //     {
  //       title: '考核指标',
  //       dataIndex: 'indiName',
  //     },
  //     {
  //       title: '业务数量',
  //       dataIndex: 'ywsl',
  //       align: 'center',
  //       render: (value, record) => {
  //         const html = [];
  //         for (let i = 1; i <= 10; i++) {
  //           if (record[`examStd${i}`]) {
  //             html.push(<div key={i} className="tc" style={{ padding: '2px 0' }}>{record[`examStd${i}`]}</div>);
  //           } else {
  //             return html;
  //           }
  //         }
  //       },
  //     },
  //     {
  //       title: '折算得分',
  //       dataIndex: 'zldf',
  //       align: 'center',
  //       render: (value, record) => {
  //         const html = [];
  //         for (let i = 1; i <= 10; i++) {
  //           if (record[`std${i}Score`]) {
  //             html.push(<div key={i} className="tc" style={{ padding: '2px 0' }}>{record[`std${i}Score`]}</div>);
  //           } else {
  //             return html;
  //           }
  //         }
  //       },
  //     },
  //     {
  //       title: '折算比例',
  //       dataIndex: 'cvrtRatio',
  //       align: 'center',
  //     },
  //     {
  //       title: '总分下限',
  //       dataIndex: 'scoreBtm',
  //       align: 'center',
  //     },
  //     {
  //       title: '总分上限',
  //       dataIndex: 'scoreTop',
  //       align: 'center',
  //     },
  //     {
  //       title: '百分阈值(%)',
  //       dataIndex: 'pctThld',
  //       align: 'center',
  //     },
  //     {
  //       title: '权重',
  //       dataIndex: 'examWeight',
  //       align: 'center',
  //     },
  //   ];
  //   return columns;
  // }
  render() {
    const { indexDetail = [], scoreMode2, scoreMode1, digit } = this.props;
    return (
      <Fragment>
        <Row>
          <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item label={<span className="fwb">必选指标</span>} required colon={false} />
          </Col>
          <Col sm={24} md={24} lg={24} xl={24} xxl={24} style={{ padding: '0 2rem' }}>
            <IndexTable
              onRef={this.onIndexTableRef}
              indexDetail={indexDetail}
              scoreMode2={scoreMode2}
              scoreMode1={scoreMode1}
              digit={digit}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default MandatorySelectedIndex;
