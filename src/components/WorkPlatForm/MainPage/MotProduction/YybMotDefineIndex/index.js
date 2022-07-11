/* eslint-disable react/no-unused-state */
import React, { Fragment } from 'react';
import { Card, Tabs } from 'antd';


import { getDictKey } from '../../../../../utils/dictUtils';

import EventTabs from './eventTabs';

const { TabPane } = Tabs;

class YybMotDefineIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      tgtTp: '', // 选中的面板  即 目标类型


    };
  }

  componentWillMount() {


  }

  componentDidMount() {
    this.getTabsDicts(this.props.dictionary);
  }

  componentWillReceiveProps(nextPreps) {
    if (nextPreps.dictionary !== this.props.dictionary) {
      this.getTabsDicts(nextPreps.dictionary);
    }
  }


    // 获取tab栏分类字典数据  目标类型
    getTabsDicts = (dictionary = {}) => {
      // 目标类型
      const { [getDictKey('MOT_TGT_TP')]: tgtTpDicts = [] } = dictionary;
      if (tgtTpDicts.length > 0) {
        this.setState({
          tgtTp: tgtTpDicts[0].ibm,
          tgtTpNote: tgtTpDicts[0].note,
          tgtTpDicts,
        });
      }
    }

    // tabs 切换
    onChange = (Key) => {
      this.setState({ tgtTp: Key });
    }

    render() {
      const { tgtTp, tgtTpDicts = [] } = this.state;
      const { dictionary = {} } = this.props;

      return (
        <Fragment>
          <Card className="m-card ant-card-padding-transition" style={{ margin: '1rem 0', height: '100%' }}>
            <Tabs className="mot-tabbs" defaultActiveKey={tgtTp} onChange={this.onChange}>
              {
                            tgtTpDicts.map((item) => {
                              if (item.ibm === '3') {
                                return '';
                              }
                              return (
                                <TabPane tab={item.note} key={item.ibm}>{item.ibm === tgtTp ? <EventTabs tgtTp={item.ibm} dictionary={dictionary} /> : ''}</TabPane>
                              );
                            })
                        }
            </Tabs>
          </Card>
        </Fragment >
      );
    }
}

export default YybMotDefineIndex;
// export default connect(({ global }) => ({
//     dictionary: global.dictionary,
// }))(YybMotDefineIndex);
