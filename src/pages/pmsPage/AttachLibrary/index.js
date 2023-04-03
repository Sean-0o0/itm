import React, { Component } from 'react'
import { connect } from 'dva'
import AttachLibrary from '../../../components/pmsPage/AttachLibrary'

class AttachLibraryPage extends Component {
    state = {  } 
    render() { 
        const { dictionary, location: { query: { xmid } } } = this.props;
        return (<AttachLibrary dictionary={dictionary} xmid={xmid}/>);
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(AttachLibraryPage);
