import React, { Component } from 'react'
import { connect } from 'dva'
import {DecryptBase64, EncryptBase64} from '../../../components/Common/Encrypt';
import StaffDetail from '../../../components/pmsPage/StaffDetail'

class StaffDetailPage extends Component {
    state = {  } 
    render() { 
        const { dictionary, location = {} } = this.props;
        const {match: {params: {params: encryptParams = ''}}} = this.props;
        let params = {}
        // if(encryptParams){
        //     params = JSON.parse(DecryptBase64(encryptParams));
        // }
       
        const {
            pathname = {},
            // state = { }
        } = location;
        // const {routes = []} = state
        const { routes= [], ryid} = params;
        console.log('routes',params)
        routes.push({name: '人员详情', pathname: pathname});

        return (<StaffDetail dictionary={dictionary} routes={routes} ryid={ryid}/>);
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(StaffDetailPage);
