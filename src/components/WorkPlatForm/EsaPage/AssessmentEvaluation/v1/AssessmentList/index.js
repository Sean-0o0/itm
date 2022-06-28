/*
 * @Description: 考核评分首页列表
 * @Autor: 
 * @Date: 2020-11-11 11:07:27
 */
import React, { Component } from 'react';
import AssessmentListItem from './AssessmentListItem';
import img_1 from '../../../../../../assets/esa/img_1.png';
import img_2 from '../../../../../../assets/esa/img_2.png';
import img_3 from '../../../../../../assets/esa/img_3.png';
import img_4 from '../../../../../../assets/esa/img_4.png';
import img_5 from '../../../../../../assets/esa/img_5.png';
import { FetchQueryHrPrfmStsSchd } from '../../../../../../services/EsaServices/assessmentEvaluation';
import { message } from 'antd';

class AssessmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardList: [],
    };
  }

  componentDidMount() {
    this.fetchQueryHrPrfmStsSchd();
  }

  fetchQueryHrPrfmStsSchd = (yr = new Date().getFullYear()) => {
    FetchQueryHrPrfmStsSchd({ yr }).then(res => {
      const { code, note, records } = res;
      if (code > 0) {
        this.setState({ cardList: records || [] });
      } else {
        message.error(note);
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    })
  }

  render() {
    const { cardList } = this.state;
    const images = [img_1, img_2, img_3, img_4, img_5];
    return (
      <div className="esa-evaluate-list dis-fx">
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
      </div>
    );
  }
}

export default AssessmentList;