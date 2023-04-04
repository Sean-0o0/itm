import React, { Component } from 'react'
import { connect } from 'dva'
import AttachLibrary from '../../../components/pmsPage/AttachLibrary'

class AttachLibraryPage extends Component {
    state = {  } 
    render() { 
        const { dictionary, location: { query: { xmid }, pathname = '' } } = this.props;
        return (<AttachLibrary dictionary={dictionary} xmid={xmid} pathname={pathname}/>);
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(AttachLibraryPage);
