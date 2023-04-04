import React, { Component } from 'react';
import { connect } from 'dva';
import { DecryptBase64 } from '../../../components/Common/Encrypt';
import StaffDetail from '../../../components/pmsPage/StaffDetail';

class StaffDetailPage extends Component {
  state = {
    routes: [],
    ryid: '',
  };

  render() {
    const { dictionary, location = {} } = this.props;
    const {
      match: {
        params: { params: encryptParams = '' },
      },
    } = this.props;
    let params = {};
    if (encryptParams) {
      params = JSON.parse(DecryptBase64(encryptParams));
    }
    const { pathname = '', state = {} } = location;
    const { routes = [] } = state;
    const { ryid
      // , routes = []
     } = params;
    const item = routes.length?routes[routes.length-1]:'';
    let result = [];
    if(JSON.stringify(item)!==JSON.stringify({ name: '人员详情', pathname: pathname })){
      result = routes.concat({ name: '人员详情', pathname: pathname });
    }else{
      result = routes
    }
    

    return <StaffDetail dictionary={dictionary} routes={result} ryid={ryid} />;
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(StaffDetailPage);
