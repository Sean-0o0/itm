import React, {Component} from 'react'
import {connect} from 'dva'
import {DecryptBase64, EncryptBase64} from '../../../components/Common/Encrypt';
import LabelDetail from "../../../components/pmsPage/LabelDetail";

class LabelDetailPage extends Component {
  state = {
    routes: [],
    bqid: '',
  }

  render() {
    const {dictionary, location = {}} = this.props;
    const {match: {params: {params: encryptParams = ''}}} = this.props;
    let params = {}
    if (encryptParams) {
      params = JSON.parse(DecryptBase64(encryptParams));
    }

    const {
      pathname = {},
      state = {}
    } = location;
    const {routes = []} = state
    const {
      // routes= [],
      bqid
    } = params;
    console.log('routes', params)
    routes.push({name: '标签详情', pathname: pathname});

    return (<LabelDetail dictionary={dictionary} routes={routes} bqid={bqid}/>);
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(LabelDetailPage);
