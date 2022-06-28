import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';

class SearchForm extends Component {
  state={
  }

  render() {
    const { handleSearch } = this.props;
    return (
      <Form>
        <Row>
          <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Input.Search
              placeholder="搜索公式名称"
              onSearch={(value) => { handleSearch(value); }}
            />
          </Col>
        </Row>
      </Form>
    );
  }
}

export default SearchForm;
