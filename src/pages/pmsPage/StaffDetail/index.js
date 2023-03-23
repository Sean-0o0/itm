import React, { Component } from 'react'
import { connect } from 'dva'
import StaffDetail from '../../../components/pmsPage/StaffDetail'

class StaffDetailPage extends Component {
    state = {  } 
    render() { 
        const { dictionary, location = {} } = this.props;
        const {
            pathname = {},
            state = { }
        } = location;
        const {routes = []} = state
        console.log('routes',routes)
        routes.push({name: '人员详情', pathname: pathname});

        return (<StaffDetail dictionary={dictionary} routes={routes}/>);
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(StaffDetailPage);
