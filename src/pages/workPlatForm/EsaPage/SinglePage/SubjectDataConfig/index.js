import React, { Fragment } from 'react';
// import { connect } from 'dva';
import { Tabs, message } from 'antd';
// import StepProgress from '../../../../../components/WorkPlatForm/EsaPage/SinglePage/SubjectDataConfig/StepProgress';
import MainContent from '../../../../../components/WorkPlatForm/EsaPage/SinglePage/SubjectDataConfig/MainContent';
import {FetchqueryIndicators} from '../../../../../services/EsaServices/commissionManagement';
// import PageFooter from '../../../../../components/WorkPlatForm/EsaPage/SinglePage/SubjectDataConfig/PageFooter';

/**
 * 主题数据配置
 */
const { TabPane } = Tabs;
class SubjectDataConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0, // 从0开始计数
      sbjDataId: '',//主题数据ID
      height: 0,
      indicators:[]//指标数据
    };
  }

  //查询指标
  queryIndicators =async(confPrjType) => {
    const payload = {
      "status": 1,
    }
    let datas=[];
    await FetchqueryIndicators({ ...payload }).then((response) => {
      const { records } = response;
      records.map((item) => {
        datas.push({value: item.indiNo, title:item.indiName, key:item.indiNo});
        return datas;
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    this.setState({
      indicators:datas
    })
  }


  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    const { match } = this.props;
    const { id } = match.params;
    if (id !== '') {
      this.setState({ sbjDataId: id })
    }
    this.queryIndicators();
  }

  componentWillMount() {
    this.updateDimensions();
  }

  toPreStep = () => {
    const { current } = this.state;
    this.setState({
      current: current - 1,
    });
  }

  toNextStep = () => {
    const { current } = this.state;
    this.setState({
      current: current + 1,
    });
  }
  onChange = async (current) => {
    if (current === '1') {
      const result = await this.mainContent.selectBasicData.handleSubmit(0);
      if (result) {
        this.setState({ current: Number(current), sbjDataId: result });
      };
    } else {
      this.setState({ current: Number(current) });
    }
  }
  sbjDataIdChange = (sbjDataId) => {
    this.setState({
      sbjDataId,
    });
  }
  updateDimensions = () => {
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    this.setState({ height });
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  render() {
    const { current = 0, height, indicators } = this.state;
    return (
      <Fragment>
        <div className="bg-white" style={{ height, padding: '20px' }}>
          <Tabs
            className="m-tabs-underline-thrid m-tabs-underline-small esa-salaryNavigation-salaryTabs"
            onChange={this.onChange}
            activeKey={`${current}`}
          >
            <TabPane tab="第一步：选择基础数据" key="0" >
              {current === 0 && <MainContent
                current={current}
                sbjDataId={this.state.sbjDataId}
                ref={(c) => { this.mainContent = c; }}
                toPreStep={this.toPreStep}
                toNextStep={this.toNextStep}
                sbjDataIdChange={this.sbjDataIdChange}
              />}
            </TabPane>
            <TabPane tab="第二步：计算基期数据" key="1">
              {current === 1 && <MainContent
                current={current}
                indicators={indicators}
                sbjDataId={this.state.sbjDataId}
                ref={(c) => { this.mainContent = c; }}
                toPreStep={this.toPreStep}
                toNextStep={this.toNextStep}
                sbjDataIdChange={this.sbjDataIdChange}
              />}
            </TabPane>
          </Tabs>

        </div>
      </Fragment>
    );
  }
}
export default SubjectDataConfig;
