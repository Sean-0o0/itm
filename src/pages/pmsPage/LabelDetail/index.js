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
    const { dictionary, location = {} } = this.props;
    const {
      match: {
        params: { params: encryptParams = '' },
      },
    } = this.props;
    let params = {}
    if (encryptParams) {
      params = JSON.parse(DecryptBase64(encryptParams));
    }
    const {pathname = {}, state = {}} = location;
    const {routes = []} = state
    const {
      // routes= [],
      bqid
    } = params;
    // console.log('routes', routes)
    // console.log('bqid', bqid)
    const result = routes.concat({name: '标签详情', pathname: pathname});
    // const newArr = []
    // let name = [];
    // for (let i = 0; i < result.length; i++) {
    //   //判断在id这个数组中有没有找到id
    //   if (name.indexOf(result[i].name) === -1) {
    //     //把id用push存进id这个数组中
    //     name.push(result[i].name);
    //     newArr.push(result[i]);
    //   }
    // }

    return (<LabelDetail dictionary={dictionary} routes={result} bqid={bqid}/>);
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(LabelDetailPage);
