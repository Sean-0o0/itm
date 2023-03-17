import React, { Component } from 'react'
import { connect } from 'dva'
import AttachLibrary from '../../../components/pmsPage/AttachLibrary'

class AttachLibraryPage extends Component {
    state = {  } 
    render() { 
        const { dictionary } = this.props;
        return (<AttachLibrary dictionary={dictionary}/>);
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(AttachLibraryPage);
