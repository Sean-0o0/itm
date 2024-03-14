import React, { Fragment, useEffect, useState } from 'react';
import {
  Button, Col, Form, message, Modal, Row, Spin, Select, DatePicker, Input, InputNumber,
  Radio, Upload, Tooltip, Icon, Popconfirm, Checkbox, Table
} from 'antd';
import moment from 'moment';
import { QueryProjectApplicationFlow, OperateVoidProjectApplication } from '../../../../../../services/pmsServices';
import { EncryptBase64 } from '../../../../../Common/Encrypt';
import { useLocation } from 'react-router-dom';

/**
 * 再次发起立项流程时，若出现 历史立项金额 超出项目金额的情况，会弹窗提示，
 * 作废之后可再发起立项流程，作废的时候需要进行二次确认。
 * @param {*} props 
 * @returns 
 */
const ConfirmBox = (props) => {

  const location = useLocation();

  const { dataObj, form,
    isConfirmBoxShow, setIsConfirmBoxShow,             //弹窗显隐
    historyBudget, setHistoryBudget,                   //历史预算
    historyBudgetTableData, setHistoryBudgetTableData, //历史预算表格数据
  } = props

  const { prjBasic, currentXmid } = dataObj

  /** 总预算(预算金额) */
  const allBudget = Number(prjBasic.YSJE)

  /** 用户填写的预算 */
  const filledBudget = form.getFieldValue('xmysje')

  const [isLoading, setIsLoading] = useState(false) //弹窗内部旋转动画

  /**
 * 查历史项目总预算（计算得出）和 历史项目预算数据
 */
  const queryHistoryBudget = async () => {
    const params = {
      projectID: currentXmid,
    }
    try {
      setIsLoading(true)
      const res = await QueryProjectApplicationFlow(params)
      if (res.code === 1) {
        const data = JSON.parse(res.result) || []
        setHistoryBudgetTableData(data)
        let temp = 0
        for (const item of data) {
          temp += Number(item.amount || 0)
        }
        setHistoryBudget(temp)
        setIsLoading(false)
      }
    }
    catch (err) {
      message.error(`查询历史预算信息失败${!err.success ? err.message : err.note}`, 3)
      setIsLoading(false)
    }

  }

  /** 作废 操作 */
  const deleteHandle = async (record) => {

    const params = {
      flowID: record.id, //流程id，作废的时候传这个id
    }
    try {
      setIsLoading(true)
      const res = await OperateVoidProjectApplication(params)
      if (res.code === 1) {
        message.success('操作成功')
        setIsLoading(false)
        queryHistoryBudget() //刷新数据
      }
      else message.error(`操作失败${!err.success ? err.message : err.note}`, 3)

    }
    catch (err) {
      message.error(`操作失败${!err.success ? err.message : err.note}`, 3)
      setIsLoading(false)
    }
  }

  const closeHandle = () => {
    setIsConfirmBoxShow(false)
  }

  const timeFormater = (dateStr) => {
    if (dateStr === undefined || dateStr === null || dateStr === '' || dateStr === 'null') {
      return ''
    }
    else return dateStr.substring(0, 4) + "-" + dateStr.substring(4, 6) + "-" + dateStr.substring(6, 8)
  }

  /** 表格配置 */
  const tableColumns = [
    {
      title: '流程名称',
      width: '50%',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text, record, index) => {
        return (
          <Tooltip title={text} placement="topLeft">
            <a
              className="table-link-strong"
              style={{ color: '#3361ff' }}
              onClick={() => {
                window.open(record.url);
              }}
            >
              {text}
            </a>
          </Tooltip>
        );
      },
    },
    {
      title: '流程金额（元）',
      width: '20%',
      dataIndex: 'amount',
      key: 'amount',
      ellipsis: true,
      render: (text, record, index) => {
        return <Tooltip title={text} placement="topLeft">{text}</Tooltip>
      }
    },
    {
      title: '发起时间',
      width: '15%',
      dataIndex: 'date',
      key: 'date',
      ellipsis: true,
      render: (text, record, index) => {
        return <Tooltip title={timeFormater(text)} placement="topLeft">{timeFormater(text)}</Tooltip>
      }
    },
    {
      title: '操作',
      width: '15%',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      render: (text, record, index) => {
        return <div className="ProjectApprovalApplicate_opr-column">
          <Popconfirm
            title={`确定作废吗?`}
            onConfirm={() => deleteHandle(record)}>
            <span>作废</span>
          </Popconfirm>
        </div>
      }
    }
  ]


  return (
    <Modal
      wrapClassName="editMessage-modify associated-file-modal"
      width={'810px'}
      title={null}
      zIndex={200}
      bodyStyle={{
        padding: '0',
      }}
      footer={null}
      onCancel={closeHandle}
      visible={isConfirmBoxShow}
      destroyOnClose
    >
      <div
        style={{
          height: '42px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#3361FF',
          color: 'white',
          marginBottom: '16px',
          padding: '024px',
          borderRadius: '8px 8px 0 0',
          fontSize: '16px',
        }}
      >
        <strong>已发起流程</strong>
      </div>

      <Spin spinning={isLoading} tip="加载中">
        <div className='projectApprovalApplicate_confirmBox'>
          <div className='row1 row'>
            <span>历史立项流程总金额：{historyBudget} 元</span>
            <span>当前流程金额：{filledBudget} 元</span>
          </div>

          <div className='row2 row'>
            项目金额：{allBudget} 元
          </div>

          <div className='row3 row'>
            {historyBudget + filledBudget > allBudget
              ? <div className='textInfo redColor'>
                历史立项流程总金额加上当前流程金额，大于项目金额，无法再次发起流程。<br />
                若需要发起流程，需作废历史流程
              </div>
              : <div className='textInfo'>
                历史立项流程金额总和加上当前流程金额，小于项目金额，可关闭弹窗，再次发起流程。
              </div>
            }

          </div>

          <div className='row4 row'>
            <Table
              columns={tableColumns}
              rowKey={(record, index) => {
                // return record.id
                return index
              }}
              dataSource={historyBudgetTableData}
              pagination={false}
            >
            </Table>
          </div>

        </div>
      </Spin>
    </Modal>
  )
}

export default ConfirmBox