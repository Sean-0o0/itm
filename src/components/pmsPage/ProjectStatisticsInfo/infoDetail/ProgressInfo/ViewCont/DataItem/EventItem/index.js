import React, {Component} from 'react'

class EventItem extends Component {
  state = {}

  render() {
    const {label = '', value = ''} = this.props;
    return (<div className='data-sx'>
      <div className='flex-r'>
        <div className='data-label'>{label}:</div>
        <div className='data-value flex1'>{value}</div>
      </div>
    </div>);
  }
}

export default EventItem;
