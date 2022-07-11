import React, { Fragment } from 'react';

import SuperviseProDtl from '../../../components/processCenter/SuperviseProDtl';

class SuperviseProDtlPage extends React.Component {
  constructor(props) {
    super(props);
    const { match: { params: { params = ''} } } = props;
    
    const instid = params ? eval('(' + params + ')') : {};
    this.state = {      
      instid: instid, 
    }
  }
  render() {
    const {instid} = this.state;
    return (
      <Fragment>
        <div className = "proAnalysis">
          <SuperviseProDtl instid = {instid}/>
        </div>
      </Fragment>
    );
  }
}

export default SuperviseProDtlPage;
