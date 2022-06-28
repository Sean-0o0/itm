/*
 * @Description: 考核评分首页列表
 * @Autor: 
 * @Date: 2020-11-11 11:07:27
 */
import React, { Component } from 'react';
import AssessmentListItem from './AssessmentListItem';
import evaluateIndexScoreType_1 from '../../../../../../assets/esa/evaluate_index_score_type_1@2x.png';
import evaluateIndexScoreType_2 from '../../../../../../assets/esa/evaluate_index_score_type_2@2x.png';
import evaluateIndexScoreType_3 from '../../../../../../assets/esa/evaluate_index_score_type_3@2x.png';
import evaluateIndexScoreType_4 from '../../../../../../assets/esa/evaluate_index_score_type_4@2x.png';
import { FetchQueryHrPrfmStsSchd } from '../../../../../../services/EsaServices/assessmentEvaluation';
import { message, Row } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

class AssessmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      cardList: [],
      noteList: [],
    };
  }

  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    this.fetchQueryHrPrfmStsSchd();
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  updateDimensions = () => {
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    height -= 107;
    this.setState({ height });
  }

  fetchQueryHrPrfmStsSchd = (yr = moment().add(-1, 'y').year()) => {
    FetchQueryHrPrfmStsSchd({ yr }).then(res => {
      const { code, note, records } = res;
      if (code > 0) {
        const noteList = [];
        records.forEach(item => {
          const cf = noteList.filter((ele) => ele.adpatScoreType === item.adpatScoreType)
          if (cf.length === 0) {
            noteList.push(item);
          }
        });
        this.setState({ cardList: records || [], noteList });
      } else {
        message.error(note);
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    })
  }

  render() {
    const { cardList = [], noteList = [], height } = this.state;
    const images = [evaluateIndexScoreType_1, evaluateIndexScoreType_2, evaluateIndexScoreType_3, evaluateIndexScoreType_4];
    return (
      <Row className="bg-white h100">
        <Row style={{ width: "960px", margin: "0 auto", minHeight: height, paddingTop: cardList.length <= 4 && '4%' }}>
          <Row className="esa-evaluate-list-v2 dis-fx">
            {
              cardList.map((item, index) => (
                <AssessmentListItem
                  key={item.examPgmId}
                  image={images[index % images.length]}
                  data={item}
                // description={item.examPgmName} 
                // assessed={item.status === '2'}
                />
              ))
            }
          </Row>
          <div className="esa-evaluate-index-note">
            {
              noteList.map(item => {
                return (
                  <div>{item.notes}</div>
                )
              })
            }

          </div>
        </Row>
      </Row>
    );
  }
}

export default AssessmentList;