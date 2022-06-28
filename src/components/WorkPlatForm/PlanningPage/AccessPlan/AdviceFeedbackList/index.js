import React from 'react';
import AssessMethodItem from './AssessMethodItem';
import evaluateIndexScoreType_1 from '../../../../../assets/esa/evaluate_index_score_type_1@2x.png';
import evaluateIndexScoreType_2 from '../../../../../assets/esa/evaluate_index_score_type_2@2x.png';
import { message, Row, Select } from 'antd';
import nodata from '../../../../../assets/no-data.png';
import { FetchQueryOptionRela } from '../../../../../services/planning/planning.js'

class AssessmentList extends React.Component {
  state = {
    year: 2022,
    type: 2,
    height: 0,
    cardList: [],
    noteList: [],
  };

  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    this.fetchQueryOptionRela();
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  updateDimensions = () => {
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    height -= 60;
    this.setState({ height });
  }

  fetchQueryOptionRela = () => {
    const { year, type } = this.state
    FetchQueryOptionRela({
      year: year,
      //1|高管考核方案;2|业务条线;3|职能部门;4|总裁助理
      type: type,
    }).then(res => {
      const { code = 0, records = [] } = res;
      if (code > 0) {
        this.setState({ cardList: records });
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    })
  }

  handleYearChange = (e) => {
    this.setState({
      year: e,
    }, () => {
      this.fetchQueryOptionRela();
    })
  }


  handleTypeChange = (e) => {
    this.setState({
      type: e
    }, () => {
      this.fetchQueryOptionRela();
    })
  }

  render() {
    const { cardList = [], height, year, type } = this.state;
    const images = [evaluateIndexScoreType_1, evaluateIndexScoreType_2];
    const curYear = new Date().getFullYear();
    let yearArray = [];
    //1|高管考核方案;2|业务条线;3|职能部门;4|总裁助理
    let typeArray = [{ typeId: 1, typeName: '高管考核方案' }, { typeId: 2, typeName: '业务条线' }, { typeId: 3, typeName: '职能部门' }, { typeId: 4, typeName: '总裁助理' }];
    // let typeArray = ["高管考核方案", "业务条线","职能部门", "总裁助理"];
    for (let i = -5; i < 5; i++) {
      yearArray.push(curYear + i);
    }
    return (
      <Row className="bg-white h100">
        <div className='clearfix' style={{ display: 'flex' }}>
          <div style={{ flexShrink: 0, fontSize: '1.1rem', fontWeight: '500', flex: 'no-warp', margin: '0 2rem 0 6rem', paddingTop: '2%' }} >年度：
            <Select style={{ width: '8rem' }} onChange={(e) => { this.handleYearChange(e) }}
              defaultValue={year ? year : curYear} id='year'>
              {
                yearArray.map((item, index) => {
                  return <Select.Option key={item} value={item} >{item}</Select.Option>;
                })
              }
            </Select>
          </div>
          <div style={{ flexShrink: 0, fontSize: '1.1rem', fontWeight: '500', flex: 'no-warp', paddingTop: '2%' }} >方案类型：
            <Select style={{ width: '12rem' }} onChange={(e) => { this.handleTypeChange(e) }}
              defaultValue={type} id='type'>
              {
                typeArray.map((item, index) => {
                  return <Select.Option key={item.typeId} value={item.typeId} >{item.typeName}</Select.Option>;
                })
              }
            </Select>
          </div>
        </div>
        <Row style={{ margin: "0 4rem", minHeight: height, paddingTop: cardList.length <= 4 && '4%' }}>
          <Row className="esa-evaluate-list-v3 dis-fx" style={{ position: 'relative', height: cardList.length === 0 ? '50rem' : '' }}>
            {cardList.length === 0 ?
              <div style={{ position: 'absolute', top: 'calc(50% - 120px)', left: 'calc(50% - 120px)' }}>
                <img src={nodata} alt="" width="240" /><div style={{ textAlign: 'center', color: '#b0b0b0', fontSize: '1.5rem', marginTop: '1.5rem' }}> 暂无可展示内容!</div>
              </div>
              :
              cardList.map((item, index) => (
                <AssessMethodItem
                  key={item.planId}
                  image={images[index % images.length]}
                  data={item}
                />
              ))
            }
          </Row>
        </Row>
      </Row>
    );
  }
}

export default AssessmentList;
