import React, { Component } from 'react'
import { connect } from 'dva'
import { DecryptBase64, EncryptBase64 } from '../../../components/Common/Encrypt';
import StaffDetail from '../../../components/pmsPage/StaffDetail'
import { concat } from 'lodash';

class StaffDetailPage extends Component {
    state = {
        routes: [],
        ryid: ''
    }

    render() {
        const { dictionary, location = {} } = this.props;
        // const {match: {params: {params: encryptParams = ''}}} = this.props;
        // let params = {}
        // if(encryptParams){
        //     params = JSON.parse(DecryptBase64(encryptParams));
        // }
        const {
            pathname = {},
            state = {}
        } = location;
        const { routes = [], ryid } = state
        // const { routes= [], ryid} = params;
        const result = routes.concat({ name: '人员详情', pathname: pathname });

        return (<StaffDetail dictionary={dictionary} routes={result} ryid={ryid} />);
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(StaffDetailPage);
