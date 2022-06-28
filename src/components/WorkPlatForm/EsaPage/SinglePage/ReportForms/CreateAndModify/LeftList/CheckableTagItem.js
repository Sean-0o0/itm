import React from 'react';
import { Tag } from 'antd';

const { CheckableTag } = Tag;

class CheckableTagItem extends React.Component {
  state = {
    className: '',
  }
  componentDidMount = () => {
    const { item: { ibm: itemID = '' } } = this.props;
    const { wdID = '' } = this.props;
    if (wdID === itemID) {
      this.setState({ className: 'active' });
    }
  }
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    const { item: { ibm: itemID = '' } } = this.props;
    const { wdID: newitemID = '' } = nextProps;
    if (itemID === newitemID) {
      this.setState({ className: 'active' });
    } else {
      this.setState({ className: '' });
    }
  }
  onTagClick = (index) => {
    const { className = '' } = this.state;
    if (!className) {
      const { item: { ibm = '' } = {} } = this.props;
      this.props.getListDetail(ibm, index);
    } else {
      this.props.getListDetail('', index);
    }
  }

  render() {
    const { className = '' } = this.state;
    const { item = {}, index } = this.props;
    const { note = '' } = item;
    return (
      <CheckableTag className="m-tag-rpleft" checked={className === 'active'} onChange={() => this.onTagClick(index)}>
        <div className="dis-fx">
          <span className="flex">
            {note || '--'}
          </span>
        </div>
      </CheckableTag>
    );
  }
}
export default CheckableTagItem;

