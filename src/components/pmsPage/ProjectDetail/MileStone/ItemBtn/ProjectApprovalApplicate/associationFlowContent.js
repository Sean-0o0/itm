import React, { Fragment, useEffect, useState } from 'react';
import {
  Button, Col, Form, message, Modal, Row, Spin, Select, DatePicker, Input, InputNumber,
  Radio, Upload, Tooltip, Icon, Popconfirm, Checkbox
} from 'antd';
import moment from 'moment';
import { } from '../../../../../../services/pmsServices';
import AssociatedFile from '../../../../LifeCycleManagement/AssociatedFile';


/**
 * 关联流程
 * @param {*} props 
 * @returns 
 */
const AssociationFlowContent = (props) => {

  const { componentsObj, stateObj, dataObj, form, onSuccess, xmbh } = props

  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;

  const { isUnfold, setIsUnfold } = stateObj

  const { userBasicInfo, dictionary, gllcData, setGllcData } = dataObj

  const { getTitle, getInputDisabled, getDatePicker, getRadio, getInput } = componentsObj


  //关联文件 - 确认
  const handleAssociateFileConfirm = (data = []) => {
    setGllcData(p => ({ ...p, modalVisible: false, list: data }));
  };

  //关联流程
  const getGllc = () => {
    //关联文件 - 打开
    const handleAssociateFileOpen = () => {
      setGllcData(p => ({ ...p, modalVisible: true }));
    };

    //关联流程 - 点击
    const handleProcessItemClick = id => {
      window.open(
        'http://10.52.130.12/ZSZQOA/getURLSyncBPM.do?_BPM_FUNCCODE=C_FormSetFormData&_mode=4&_form_control_design=LABEL&_tf_file_id=' +
        id,
      );
    };
    //关联流程 - 删除
    const handleProcessItemDelete = id => {
      setGllcData(p => ({ ...p, modalVisible: false, list: p.list.filter(x => x.id !== id) }));
    };
    return (
      <Fragment>
        <div className="title" style={{ borderBottom: '1px solid #F1F1F1' }}>
          <Icon
            type={isUnfold.gllc ? 'caret-down' : 'caret-right'}
            onClick={() => {
              setIsUnfold((p) => {
                return { ...p, gllc: gllcData.list?.length > 0 ? !p.gllc : p.gllc }
              })
            }}
            style={{
              fontSize: '14px',
              cursor: gllcData.list?.length > 0 ? 'pointer' : 'default',
            }}
          />
          <span style={{ paddingLeft: '10px', fontSize: '20px', color: '#3461FF' }}>
            关联流程
          </span>
          <Icon
            type="plus-circle"
            theme="filled"
            onClick={() => handleAssociateFileOpen()}
            style={{ color: '#3461FF', paddingLeft: '7px', fontSize: '20px' }}
          />
        </div>
        <div style={{ overflow: 'hidden', overflowY: 'auto', maxHeight: '350px' }}>
          {!isUnfold.gllc &&
            gllcData.list?.map((item, index) => (
              <div style={{ margin: '14px 47px' }} key={index}>
                <Row gutter={24}>
                  <Col
                    span={24}
                    className="contract-signing-process-item"
                    style={{ display: 'flex' }}
                  >
                    <a
                      style={{ color: '#3361ff', marginRight: '1.14px' }}
                      F
                      onClick={() => handleProcessItemClick(item.id)}
                    >
                      {item?.title}
                    </a>
                    <Popconfirm
                      title="确定要删除吗?"
                      onConfirm={() => handleProcessItemDelete(item.id)}
                    >
                      <a>
                        <Icon style={{ color: 'red' }} type="close" />
                      </a>
                    </Popconfirm>
                  </Col>
                </Row>
              </div>
            ))}
        </div>
      </Fragment>
    );
  };


  return (
    <>
      {getGllc()}

      {gllcData.modalVisible && (
        <AssociatedFile
          associatedFileVisible={gllcData.modalVisible}
          onConfirm={data => handleAssociateFileConfirm(data)}
          closeAssociatedFileModal={() => setGllcData(p => ({ ...p, modalVisible: false }))}
          onSuccess={() => onSuccess('关联文件')}
          xmbh={xmbh}
          list={gllcData.list}
        />
      )}

    </>
  )
}

export default AssociationFlowContent