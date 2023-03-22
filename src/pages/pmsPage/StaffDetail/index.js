import React, { Component } from 'react'
import { connect } from 'dva'
import StaffDetail from '../../../components/pmsPage/StaffDetail'

class StaffDetailPage extends Component {
    state = {  } 
    render() { 
        const { dictionary } = this.props;
        return (<StaffDetail dictionary={dictionary}/>);
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(StaffDetailPage);
