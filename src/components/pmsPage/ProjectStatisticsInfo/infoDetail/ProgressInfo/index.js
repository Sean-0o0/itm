import React, {Component} from 'react'
import ViewCont from './ViewCont';

class ProgressInfo extends Component {
  state = {}


  render() {
    const {xmid, type, biddingMethod, budget} = this.props;
    return (<div className='progress-info'>
      <ViewCont xmid={xmid} type={type} biddingMethod={biddingMethod} budget={budget}/>
    </div>);
  }
}

export default ProgressInfo;
