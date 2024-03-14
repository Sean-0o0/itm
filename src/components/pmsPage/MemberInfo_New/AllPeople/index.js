import React, { useEffect, useState, useRef, useContext } from 'react';
import { message, Button, Modal, Form, Row, Col, Select, Tabs, Input, DatePicker } from 'antd';
import { QueryOutsourceMemberList } from '../../../../services/pmsServices';
import TableBox from './tableBox'
import moment from "moment";
import * as Lodash from "lodash";

import { MemberInfoContext } from '../index'

/**
 * 4.全部人员
 * @param {*} props 
 * @returns 
 */
const AllPeople = (props) => {

  const { getFieldDecorator, getFieldsValue, resetFields } = props.form

  const { rymcData, rydjData, dictionary, prjNameData, gysData, roleData } = useContext(MemberInfoContext)

  const { WBRYGW = [] } = dictionary

  const [filterFold, setFilterFold] = useState(true); //收起 true、展开 false

  /** 表格数据 */
  const [tableData, setTableData] = useState([])

  /**当前页 */
  const [curPageNum, setCurPageNum] = useState(1)

  /** 分页大小 */
  const [pageSize, setPageSize] = useState(20)

  /** 表格数据总量 */
  const [total, setTotal] = useState(0)

  /** 表格内部加载图案 */
  const [isTableLoading, setIsTableLoading] = useState(false)

  /** row布局配置 */
  const gridProps = {
    horizontalGutter: 20,
    verticalGutter: 0,
    colSpan: 7,
  }

  /** formItem配置 */
  const formItemProps = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
    colon: false
  }

  const rowStyle = {
    // paddingInline: '8px'
  }

  /** 查询数据 */
  const queryHandle = async (resetCurpageBool, extraParams) => {

    const values = getFieldsValue()

    const { RCRQ, LCRQ } = values

    setIsTableLoading(true)

    const { zyrole = '', role = '' } = roleData

    const queryParams = {
      pageNo: curPageNum,
      current: curPageNum,
      pageSize: pageSize,
      paging: 1,
      ...values,
      cxlx: 'WBRY_ALL',
      js: zyrole === "暂无" ? role : zyrole,   //登录人角色
      rckssj: !Lodash.isEmpty(RCRQ) ? RCRQ[0].format('YYYYMMDD') : '',     //入场开始时间
      rcjssj: !Lodash.isEmpty(RCRQ) ? RCRQ[1].format('YYYYMMDD') : '',     //入场结束时间
      lckssj: !Lodash.isEmpty(LCRQ) ? LCRQ[0].format('YYYYMMDD') : '', //离场开始时间
      lcjssj: !Lodash.isEmpty(LCRQ) ? LCRQ[1].format('YYYYMMDD') : '',   //离场结束时间
      ...extraParams
    }
    delete queryParams.RCRQ
    delete queryParams.LCRQ
    try {
      const res = await QueryOutsourceMemberList(queryParams)
      if (res.code === 1) {
        const arr = JSON.parse(res.result)
        // console.log('全部人员的数据', arr)
        setTableData(arr)
        setTotal(res.totalrows)
        resetCurpageBool && setCurPageNum(1)
        setIsTableLoading(false)
      }
    }
    catch (err) {
      message.error(`查询全部人员数据失败,${!err.success ? err.message : err.note}`, 3)
      setIsTableLoading(false)
    }
  }

  useEffect(() => {
    queryHandle()
  }, [curPageNum, pageSize])

  return (
    <Form>
      <div className='MemberInfo_AllPeople Tab234Pages'>

        <div className='filterBar'>
          <Row className='row1' style={rowStyle} gutter={[gridProps.horizontalGutter, gridProps.verticalGutter]}>
            <Col span={gridProps.colSpan}>
              <Form.Item label="人员名称" {...formItemProps}>
                {getFieldDecorator(`ryxm`, {
                  initialValue: undefined
                })(
                  <Input
                    allowClear
                    placeholder="请输入"
                  />
                  // <Select
                  //   filterOption={(input, option) =>
                  //     option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  //   }
                  //   showSearch
                  //   allowClear
                  //   placeholder="请选择"
                  // >
                  //   {rymcData.map((item, index) => (
                  //     <Select.Option key={item.RYID} value={item.RYID}>
                  //       {item.RYMC}
                  //     </Select.Option>
                  //   ))}
                  // </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={gridProps.colSpan}>
              <Form.Item label="人员等级" {...formItemProps}>
                {getFieldDecorator(`rydj`, {
                  initialValue: undefined
                })(
                  <Select
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    showSearch
                    showArrow
                    allowClear
                    placeholder="请选择"
                  >
                    {rydjData.map((item, index) => (
                      <Select.Option key={item.DJID} value={item.DJID}>
                        {item.DJMC}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={gridProps.colSpan}>
              <Form.Item label="岗位" {...formItemProps}>
                {getFieldDecorator(`rygw`, {
                  initialValue: undefined
                })(
                  <Select
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    showSearch
                    showArrow
                    allowClear
                    placeholder="请选择"
                  >
                    {WBRYGW.map((item, index) => (
                      <Select.Option key={item.ibm} value={item.ibm}>
                        {item.note}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={3}>

              {filterFold && (
                <div className="filter-unfold" onClick={() => setFilterFold(false)}>
                  更多
                  <i className="iconfont icon-down" />
                </div>
              )}

              <div className='btnGroup'>
                <Button
                  className="btn-search"
                  type="primary"
                  onClick={() => {
                    queryHandle()
                  }}
                >
                  查询
                </Button>

                <Button className="btn-reset" onClick={() => {
                  resetFields()
                }}>
                  重置
                </Button>
              </div>
            </Col>
          </Row>


          {!filterFold &&
            <Row className='row2' style={rowStyle} gutter={[gridProps.horizontalGutter, gridProps.verticalGutter]}>
              <Col span={gridProps.colSpan}>
                <Form.Item label="项目名称" {...formItemProps}>
                  {getFieldDecorator(`xmmc`, {
                    initialValue: undefined
                  })(
                    <Select
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      showSearch
                      allowClear
                      placeholder="请选择"
                    >
                      {prjNameData.map((item, index) => (
                        <Select.Option key={item.ID} value={item.ID}>
                          {item.XMMC}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>

              <Col span={gridProps.colSpan}>
                <Form.Item
                  label="所属供应商"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  colon={false}
                >
                  {getFieldDecorator(`gys`, {
                    initialValue: undefined
                  })(
                    <Select
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      showSearch
                      allowClear
                      placeholder="请选择"
                    >
                      {gysData.map((item, index) => (
                        <Select.Option key={item.GYSID} value={item.GYSID}>
                          {item.GYSMC}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>


              <Col span={gridProps.colSpan}>
                <Form.Item label="入场日期" {...formItemProps}>
                  {getFieldDecorator(`RCRQ`, {
                    initialValue: undefined
                  })(
                    <DatePicker.RangePicker
                      placeholder={['开始日期', '结束日期']}
                      allowClear
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={gridProps.colSpan}>
                <Form.Item label="离场日期" {...formItemProps}>
                  {getFieldDecorator(`LCRQ`, {
                    initialValue: undefined
                  })(
                    <DatePicker.RangePicker
                      placeholder={['开始日期', '结束日期']}
                      allowClear
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={gridProps.colSpan}>
                <div className="filter-unfold" onClick={() => setFilterFold(true)}>
                  收起
                  <i className="iconfont icon-up" />
                </div>

              </Col>
            </Row>
          }
        </div>

        <div className='project-info-table-box'>
          <TableBox
            isTableLoading={isTableLoading}
            tableData={tableData}
            curPageNum={curPageNum}
            setCurPageNum={setCurPageNum}
            pageSize={pageSize}
            setPageSize={setPageSize}
            total={total}
          />
        </div>
      </div >
    </Form>
  )

}

export default Form.create()(AllPeople)
