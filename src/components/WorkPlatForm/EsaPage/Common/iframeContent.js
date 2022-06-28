/* eslint-disable jsx-a11y/iframe-has-title */
import React from 'react';

class IframeContent extends React.Component {
  state = {

  }
  render() {
    const { url = '' } = this.props;

    return (
      <iframe width="100%" height="100%" frameBorder="0" src={url} />
    );
  }
}
export default IframeContent;
