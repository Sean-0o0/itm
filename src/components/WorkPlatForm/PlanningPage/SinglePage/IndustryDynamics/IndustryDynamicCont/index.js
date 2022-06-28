import React from 'react';
import IndustryDynamicNews from './IndustryDynamicNews';
import { FetchQueryIndustryNews } from '../../../../../../services/planning/planning';
import { Empty } from 'antd';

class IndustryDynamicCont extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      id:'',
    };
  }

  componentWillMount() {
    this.FetchQueryIndustryNews();
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }

  componentWillReceiveProps(nextProps) {
    const { keyword, type = 1 } = nextProps;
    if (JSON.stringify(keyword) !== '' && nextProps !== this.props) {
      const { refMethod } = this.props;
      FetchQueryIndustryNews({
        category: Number(type),
        keyword: keyword,
      }).then(
        res => {
          const { records, code } = res;
          if (code > 0) {
            this.setState({
              datas: records,
            });
            refMethod(this.state.datas[0]?.notcId);
          }
        },
      );
    }
  }


  FetchQueryIndustryNews = () => {
    const { refMethod, keyword, type = 1 } = this.props;
    FetchQueryIndustryNews({
      category: Number(type),
      keyword: keyword,
    }).then(
      res => {
        const { records, code } = res;
        if (code > 0) {
          this.setState({
            datas: records,
          });
          refMethod(this.state.datas[0]?.notcId);
        }

      },
    ).catch();
  };

  handleComments = (id) => {
    this.setState({
      id:id,
    })
    const { refMethod } = this.props;
    // console.log("回传的id----1111",id)
    refMethod(id);
  }



  render() {
    const { datas = [],id='' } = this.state;
    return (
      datas.length>0?
      (<div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
        {
          datas.map((item) => {
            return (
              <IndustryDynamicNews id={id===''?datas[0].notcId:id} data={item} handleComments={this.handleComments} />
            );
          })
        }
      </div>): <Empty style={{height:'12rem',paddingTop:'calc((100vh - 27.5rem)/2)'}}/>

    );
  }
}

export default IndustryDynamicCont;
