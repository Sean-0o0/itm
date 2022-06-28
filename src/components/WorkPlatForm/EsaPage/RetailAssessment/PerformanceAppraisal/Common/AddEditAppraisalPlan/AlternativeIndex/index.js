import React, { Component, Fragment } from 'react';
import { Row, Form, Col, Button } from 'antd';
import IndexTable from './IndexTable';
/**
 * 可选指标
 */
class AlternativeIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }
  onIndexTableRef = (ref) => {
    this.indexTableRef = ref;
  }
  handleIndexAdd = () => {
    const { handleIndexAdd } = this.props;
    if (typeof handleIndexAdd === 'function') {
      handleIndexAdd();
    }
  }

  render() {
    const { indexDetail, scoreMode2, scoreMode1, digit } = this.props;
    return (
      <Fragment>
        <Row>
          <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item label={<span className="fwb">可选指标</span>} colon={false} />
          </Col>
          <Col sm={24} md={24} lg={24} xl={24} xxl={24} style={{ padding: '0 2rem' }}>
            <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={() => this.handleIndexAdd()}>添加指标</Button>
            <IndexTable
              onRef={this.onIndexTableRef}
              digit={digit}
              scoreMode2={scoreMode2}
              scoreMode1={scoreMode1}
              indexDetail={indexDetail}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default AlternativeIndex;
