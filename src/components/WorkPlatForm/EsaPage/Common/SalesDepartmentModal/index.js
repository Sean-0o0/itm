import React, { Component, Fragment } from 'react';
import { Row, Col, message } from 'antd';
import BasicModal from '../../../../Common/BasicModal';
import DepartmentTree from './DepartmentTree';
import { fetchUserAuthorityDepartment } from '../../../../../services/commonbase/userAuthorityDepartment';

/**
 * 营业部modal
 */
class SalesDepartmentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deptList: [], // 营业部
      selectItem: {
        key: '',
        title: '',
      },
    };
  }
  componentDidMount() {
    this.fetchDeptList();
  }
  handleOk = () => {
    const { handleOk } = this.props;
    if (typeof handleOk === 'function') {
      const { selectItem, deptList } = this.state;
      const { handledeptList } = this.props;
      handleOk(selectItem);
      if (handledeptList) {
        for (let i = 0; i < deptList.length; i++) {
          if (deptList[i].yybid === selectItem.key) {
            handledeptList(deptList[i]);
            break;
          }
        }
      }
    }
  }
  handleCancel = () => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  }
  handleSelect=(selectedKeys, e) => {
    if (e.selected) {
      this.setState({ selectItem: { key: selectedKeys[0], title: e.nativeEvent.target.innerText } });
    } else {
      this.setState({ selectItem: { key: '', title: '' } });
    }
  }
  fetchDeptList=() => {
    fetchUserAuthorityDepartment({}).then((res) => {
      const { handledeptList } = this.props;
      const { note, code, records = [] } = res;
      if (code > 0) {
        this.setState({ deptList: records });
        if (handledeptList) {
          for (let i = 0; i < records.length; i++) {
            if (records[i].fid === '0') {
              handledeptList(records[i]);
              break;
            }
          }
        }
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  render() {
    const { deptList } = this.state;
    const { visible = false, modalProps = {} } = this.props;
    const currentModalProps = {
      title: '选择记录',
      width: '75rem',
      className: 'esa-scrollbar',
      bodyStyle: { height: '55rem', overflow: 'auto' },
      visible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
      destroyOnClose: false,
      ...modalProps,
    };
    return (
      <Fragment>
        <BasicModal {...currentModalProps}>
          <Row className="m-row-form mt10">
            <Col sm={24} md={24} lg={24} xl={24} xxl={24} className="m-form ant-form" style={{ margin: '0', padding: '1rem' }}>
              <DepartmentTree deptList={deptList} handleSelect={this.handleSelect} />
            </Col>
          </Row>
        </BasicModal>
      </Fragment>
    );
  }
}

export default SalesDepartmentModal;
