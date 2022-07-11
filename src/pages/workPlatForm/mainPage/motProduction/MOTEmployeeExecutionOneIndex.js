import React, { Fragment } from 'react';
import { connect } from 'dva';
import { getDictKey } from '../../../../utils/dictUtils';
import { fetchObject } from '../../../../services/sysCommon';
import EmployeeExecutionOneIndex from '../../../../components/WorkPlatForm/MainPage/MotProduction/EmployeeExecutionOneIndex';

class MOTEmployeeExecutionOneIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ddsjList: [],
    };
  }
  componentDidMount() {
    fetchObject('TMOT_EVNT', {"condition": "TGT_TP = 3"
    }).then((ret = {}) => {
      const { code = 0, records = [] } = ret;
      if (code > 0) {
        this.setState({ ddsjList: records });
      }
    });
  }
  render() {
    const { ddsjList = [] } = this.state;
    const { dictionary } = this.props;
    const { [getDictKey('ddzt')]: ddztDict = [], [getDictKey('zycd')]: zycdDict = [] } = dictionary;
    return (
      <Fragment>
        <EmployeeExecutionOneIndex dictionary={dictionary} ddztDict={ddztDict} zycdDict={zycdDict} ddsjList={ddsjList}/>
      
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(MOTEmployeeExecutionOneIndex);
