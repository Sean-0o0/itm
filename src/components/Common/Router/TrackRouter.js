/* eslint-disable react/require-default-props */
import React, { Component } from 'react';
import { Router } from 'dva/router';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

class TrackRouter extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    children: PropTypes.node,
    onEnter: PropTypes.func,
    /**
     * onEnter触发等待时间，用于解决重定向会被触发多次的问题
     */
    wait: PropTypes.number,
  }

  static defaultProps = {
    wait: 100,
  };

  constructor(props) {
    super(props);
    this.onChangeHistory = debounce(this.onChangeHistory, props.wait);
  }

  state = {
    location: null,
  }

  componentWillMount() {
    this.unlisten = this.props.history.listen(this.onChangeHistory);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  onChangeHistory = () => {
    this.setState((prevState, props) => {
      const { location } = props.history;

      if (props.onEnter) {
        props.onEnter(location, prevState.location);
      }

      return { location };
    });
  }

  render() {
    return <Router {...this.props} />;
  }
}

export default TrackRouter;
