import React, { Component, Fragment } from 'react';
import { Row, Button } from 'antd';
import EditContent from './EditContent';
import DetailContent from './DetailContent';


class RigntContent extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.props.wrappedComponentRef(this);
  }

  onEdit = () => {
    const { changeEditMode } = this.props;
    if (typeof changeEditMode === 'function') {
      changeEditMode();
    }
  }

  onSave = () => {
    this.editContent.handleSubmit();
    this.onEdit();
  }

  onCancel = () => {
    const { cancelEdit } = this.props;
    if (typeof cancelEdit === 'function') {
      cancelEdit();
    }
  }

  render() {
    const { editMode, data = {}, basicDataCol = [],indicators, sbjDataId, fetchData } = this.props;
    const isBasicColType = data.colType === '1';
    return (
      <Fragment>
        <Row className="tr" style={{ borderBottom: '1px solid #E3E3E3', padding: '1rem' }}>
          {!editMode ? (
            <Button className={`m-btn-radius ${isBasicColType ? '' : 'm-btn-headColor'}`} disabled={isBasicColType} onClick={() => this.onEdit()}>编辑</Button>
          )
          : (null
          )}
        </Row>
        <Row style={{ padding: '1rem 2rem' }}>
          {!editMode ? (
            <DetailContent data={data} />
          ) :
            <EditContent data={data} fetchData={fetchData} sbjDataId={sbjDataId} basicDataCol={basicDataCol} indicators={indicators} onRef={(c) => { this.editContent = c; }} />
          }
        </Row>

      </Fragment>
    );
  }
}
export default RigntContent;
