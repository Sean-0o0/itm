import React from 'react';
import { Card, Button, Input, Form } from 'antd';
import BaseInfo from './BaseInfo';
import FieldDetail from './FieldDetail';

class RightDetailAndEditContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSrc: '',
      tblNm: undefined,
      validateStatus: 'success',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.addType !== this.props.addType || JSON.stringify(nextProps.tableDetail) !== JSON.stringify(this.props.tableDetail)) {
      this.setState({ tblNm: nextProps.tableDetail.tblNm, validateStatus: 'success' });
    }
  }

  onEdit=() => {
    const { handleEdit } = this.props;
    if (typeof handleEdit === 'function') {
      handleEdit();
    }
  }
  onCancel=() => {
    const { handleEditCancel } = this.props;
    if (typeof handleEditCancel === 'function') {
      handleEditCancel();
    }
  }
  onSave=() => {
    const { tblNm, validateStatus } = this.state;
    if (!tblNm || validateStatus === 'error') {
      this.setState({ validateStatus: 'error' });
      return;
    }
    const { tableDetail = {}, selectedId, addType, handleSave, selectedItem = {} } = this.props;
    const baseInfoValue = this.baseInfo.validateForm();
    if (baseInfoValue) {
      const fieldDetailValue = this.fieldDetail.validateForm();
      if (fieldDetailValue) {
        const params = {
          dataSrcTp: addType === '1' ? '3' : tableDetail.dataSrcTp,
          ...baseInfoValue,
          colDtl: fieldDetailValue,
          tblNm: tblNm || tableDetail.tblNm,
          oprTp: addType ? '1' : '2',
          tblId: addType ? '' : selectedId,
          ctcStrtTp: '2',
          // eslint-disable-next-line no-nested-ternary
          jsonTp: addType === '1' ? '2' : addType === '2' ? '1' : selectedItem.ctcTp === '2' ? '1' : selectedItem.ctcTp === '3' ? '2' : '',
        };
        if (typeof handleSave === 'function') {
          handleSave(params);
        }
      }
    }
    // console.log('params',params);
  }

  onPublish=() => {
    const { handlePublish } = this.props;
    if (typeof handlePublish === 'function') {
      handlePublish();
    }
  }

  onPublishCancel=() => {
    const { handlePublishCancel } = this.props;
    if (typeof handlePublishCancel === 'function') {
      handlePublishCancel();
    }
  }

  onUpdate=() => {
    const { handleUpdate } = this.props;
    if (typeof handleUpdate === 'function') {
      handleUpdate();
    }
  }

  onRestart=() => {
    const { handleRestart } = this.props;
    if (typeof handleRestart === 'function') {
      handleRestart();
    }
  }

  handleDataSrcChange=(dataSrc) => {
    const { fetchQueryStreamTableDataType } = this.props;
    if (typeof fetchQueryStreamTableDataType === 'function') {
      fetchQueryStreamTableDataType(dataSrc);
    }
    this.setState({ dataSrc });
  }

  handleInput=(e) => {
    this.setState({ tblNm: e.target.value, validateStatus: e.target.value ? 'success' : 'error' });
  }

  renderBtns=() => {
    const { tableDetail = {}, selectedItem = {}, isEdit } = this.props;
    if (isEdit) {
      return (
        <div>
          <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onSave}>保存</Button>
          <Button className="m-btn m-btn-gray m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onCancel}>取消</Button>
        </div>
      );
    } else if (selectedItem.ctcTp === '2') {
      switch (tableDetail.strtUseSt) {
        case '0':
          return (
            <div>
              <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onPublish}>发布</Button>
              <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onEdit}>编辑</Button>
            </div>
          );
        case '2':
          return (
            <div>
              <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onEdit}>编辑</Button>
              <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onUpdate}>更新</Button>
            </div>
          );
        case '-1':
          return (
            <div>
              <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onRestart}>重启</Button>
            </div>
          );
        case '-2':
          return (
            <div>
              <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onRestart}>重启</Button>
            </div>
          );
        default:
          return '';
      }
    } else if (selectedItem.ctcTp === '1') {
      switch (tableDetail.strtUseSt) {
        case '0':
          return (
            <div>
              <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onPublish}>发布</Button>
            </div>
          );
        case '-1':
          return (
            <div>
              <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onRestart}>重启</Button>
            </div>
          );
        case '-2':
          return (
            <div>
              <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onRestart}>重启</Button>
            </div>
          );
        default:
          return '';
      }
    } else if (selectedItem.ctcTp === '3') {
      switch (tableDetail.strtUseSt) {
        case '0':
          return (
            <div>
              <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onPublish}>发布</Button>
              <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onEdit}>编辑</Button>
            </div>
          );
        case '1':
          return (
            <div>
              <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onPublishCancel}>撤销发布</Button>
            </div>
          );
        default:
          return '';
      }
    }
  }

  render() {
    const { dataSrc, validateStatus } = this.state;
    const { tableDetail = {}, urlExample, isEdit, addType, motDataSrc, motCtcTblTp, tableDataType, selectedItem = {}, } = this.props;
    return (
      <React.Fragment>
        <Card
          className="m-card"
          style={{ height: '100%', overflow: 'hidden auto' }}
          title={isEdit ? <Form.Item style={{ marginBottom: 0 }} help={validateStatus === 'error' ? '请输入表名！' : ''} validateStatus={validateStatus}><Input defaultValue={tableDetail.tblNm} style={{ width: '50%' }} onInput={this.handleInput} /></Form.Item> : tableDetail.tblNm}
          extra={
            this.renderBtns()
            // <div>
            //   {
            //     tableDetail.strtUseSt !== '1' && !isEdit &&
            //     <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onEdit}>编辑</Button>
            //   }
            //   {
            //     tableDetail.strtUseSt === '0' && !isEdit &&
            //     <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onPublish}>发布</Button>
            //   }
            //   {
            //     tableDetail.strtUseSt === '1' && selectedItem.ctcTp === '3' && !isEdit &&
            //     <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onPublishCancel}>撤销发布</Button>
            //   }
            //   {
            //     (tableDetail.strtUseSt === '2' || tableDetail.strtUseSt === '-1') && !isEdit &&
            //     <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onPublish}>更新</Button>
            //   }
            //   {
            //     (tableDetail.strtUseSt === '-1' || tableDetail.strtUseSt === '-2') && !isEdit &&
            //     <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onRestart}>重启</Button>
            //   }
            //   {isEdit && <Button className="m-btn m-btn-headColor m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onSave}>保存</Button>}
            //   {isEdit && <Button className="m-btn m-btn-gray m-btn-radius" style={{ marginLeft: '10px' }} onClick={this.onCancel}>取消</Button>}
            // </div>
          }
        >
          <div className="mot-prod-content-title">基本信息</div>
          {/* eslint-disable-next-line no-return-assign */}
          <BaseInfo
            // eslint-disable-next-line no-return-assign
            wrappedComponentRef={ref => this.baseInfo = ref}
            tableDetail={tableDetail}
            urlExample={urlExample}
            isEdit={isEdit}
            addType={addType}
            motDataSrc={motDataSrc}
            motCtcTblTp={motCtcTblTp}
            handleDataSrcChange={this.handleDataSrcChange}
          />
          <div className="mot-prod-content-title">字段明细</div>
          {/* eslint-disable-next-line no-return-assign */}
          <div style={{ padding: '0 2rem' }}>
            <FieldDetail
              // eslint-disable-next-line no-return-assign
              wrappedComponentRef={ref => this.fieldDetail = ref}
              tableDetail={tableDetail}
              isEdit={isEdit}
              addType={addType}
              ctcTp={selectedItem.ctcTp}
              dataSrc={dataSrc}
              tableDataType={tableDataType}
            />
          </div>
        </Card>
      </React.Fragment>
    );
  }
}
export default RightDetailAndEditContent;

