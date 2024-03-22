import React, { useEffect, useState, useRef, useContext, createContext } from 'react';
import { message, Form, Row, Col, DatePicker, Input, Select, Button, TreeSelect, Icon } from 'antd'
import { QueryProjectProgressList, QueryProjectListPara, QueryMilestoneStageInfo } from '../../../../services/pmsServices'
import TreeUtils from '../../../../utils/treeUtils';
import TableBox from './tableBox'
import moment from 'moment';
import Lodash from 'lodash'


/**
 * 项目动态看板————项目列表
 * @param {*} props
 * @returns
 */
const ProjectQueryTable = (props) => {

  const { form, dictionary = {}, curStage, roleData = {} } = props

  const { XMJZ = [], //事项名称
  } = dictionary

  const { getFieldDecorator, getFieldsValue, validateFields, resetFields, setFieldsValue } = form;

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

  /** 项目经理下拉框数据源 */
  const [projectManagerData, setProjectManagerData] = useState([])

  /** 当前里程碑下拉框数据源 */
  const [mileStoneData, setMileStoneData] = useState([])

  /** 项目标签 */
  const [label, setLabel] = useState([]);

  /** 项目标签下拉框数据源 */
  const [labelData, setLabelData] = useState([]); //项目标签
  const [labelOpen, setLabelOpen] = useState(false); //标签——下拉框——是否展开


  /** row布局配置 */
  const gridProps = {
    horizontalGutter: 8,
    verticalGutter: 0,
    colSpan: 7,
  }

  /** formItem配置 */
  const formItemProps = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    colon: false
  }

  const rowStyle = {
    // paddingInline: '8px'
  }

  /** 获取当前月份第一天和最后一天 */
  const getMonthStartEndDates = () => {
    const firstDayOfMonth = moment().startOf('month');
    const lastDayOfMonth = moment().endOf('month');
    return [firstDayOfMonth, lastDayOfMonth]
  };


  /** 查询数据 */
  const queryHandle = async (resetCurpageBool, extraParams) => {

    const values = getFieldsValue()

    const { finishTime } = values

    setIsTableLoading(true)

    const queryParams = {
      pageNo: curPageNum,
      current: curPageNum,
      pageSize: pageSize,
      paging: 1,
      role: roleData.role,
      ...values,
      startTime: !Lodash.isEmpty(finishTime) ? Number(finishTime[0].format('YYYYMMDD')) : '',   //开始日期
      endTime: !Lodash.isEmpty(finishTime) ? Number(finishTime[1].format('YYYYMMDD')) : '',     //结束日期
      tag: label.join(';'),
      ...extraParams
    }
    delete queryParams.finishTime
    try {
      const res = await QueryProjectProgressList(queryParams)
      if (res.code === 1) {
        const arr = JSON.parse(res.result)
        setTableData(arr)
        setTotal(res.totalrows)
        resetCurpageBool && setCurPageNum(1)
        setIsTableLoading(false)
      }
    }
    catch (err) {
      message.error(`查询项目进展列表数据失败,${!err.success ? err.message : err.note}`, 3)
      setIsTableLoading(false)
    }
  }

  /** 获取项目经理下拉框数据 */
  const getprojectManagerData = async () => {
    const queryPamras = {
      current: 1,
      czr: 0,
      paging: 0,
      total: -1,
      cxlx: 'XMLB',
    }
    try {
      const res = await QueryProjectListPara(queryPamras)
      if (res.code === 1) {
        const data = JSON.parse(res.projectManagerRecord) || []
        setProjectManagerData(data)
      }
    }
    catch (err) {
      message.error(`查询项目经理数据失败,${!err.success ? err.message : err.note}`, 3)
    }
  }

  /** 获取当前里程碑下拉框数据 */
  const getMileStoneData = async () => {
    const queryPamras = {
      czr: 0,
      paging: 0,
      total: -1,
      type: 'ALL',
    }
    try {
      const res = await QueryMilestoneStageInfo(queryPamras)
      if (res.code === 1) {
        setMileStoneData(res.record)
      }
    }
    catch (err) {
      message.error(`查询里程碑数据失败,${!err.success ? err.message : err.note}`, 3)
    }
  }

  /** 获取项目标签下拉框数据 */
  const getLabelData = async () => {
    try {
      const res = await QueryProjectListPara({
        current: 1,
        czr: 0,
        pageSize: 10,
        paging: 1,
        sort: 'string',
        total: -1,
        cxlx: 'XMLB',
      });
      if (res?.success) {
        let labelTree = TreeUtils.toTreeData(JSON.parse(res.labelRecord), {
          keyName: 'ID',
          pKeyName: 'FID',
          titleName: 'BQMC',
          normalizeTitleName: 'title',
          normalizeKeyName: 'value',
        })[0].children[0];
        setLabelData(p => [...[labelTree]]);
      }
    }
    catch (err) {
      message.error(`查询项目标签数据失败,${!err.success ? err.message : err.note}`, 3)
    }
  };


  useEffect(() => {
    // getprojectManagerData()
    getMileStoneData()
    getLabelData()
  }, [])

  useEffect(() => {
    setFieldsValue({
      matter: curStage
    });
    queryHandle()
  }, [curPageNum, pageSize, curStage, JSON.stringify(roleData)])


  return (
    <Form>
      <div className='ProjectBuilding_ProjectQueryTable'>

        <div className='filterBar'>
          <Row className='row1' style={rowStyle} gutter={[gridProps.horizontalGutter, gridProps.verticalGutter]}>
            <Col span={gridProps.colSpan}>
              <Form.Item label="完成时间" {...formItemProps}>
                {getFieldDecorator(`finishTime`, {
                  initialValue: getMonthStartEndDates()
                })(
                  <DatePicker.RangePicker
                    placeholder={['开始日期', '结束日期']}
                    allowClear
                  />
                )}
              </Form.Item>
            </Col>

            <Col span={gridProps.colSpan}>
              <Form.Item label="项目经理" {...formItemProps}>
                {getFieldDecorator(`projectManager`, {
                  initialValue: undefined
                })(
                  <Input
                    placeholder='请输入'
                    allowClear
                  />
                  // <Select
                  //   filterOption={(input, option) =>
                  //     option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  //   }
                  //   showSearch
                  //   allowClear
                  //   placeholder="请选择"
                  // >
                  //   {projectManagerData.map((item, index) => (
                  //     <Select.Option key={item.ID} value={item.ID}>
                  //       {item.USERNAME}
                  //     </Select.Option>
                  //   ))}
                  // </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={gridProps.colSpan}>
              <Form.Item label="项目名称" {...formItemProps}>
                {getFieldDecorator(`projectName`, {
                  initialValue: undefined
                })(
                  <Input
                    placeholder='请输入'
                    allowClear
                  ></Input>
                )}
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item label={null} {...formItemProps}>
                {getFieldDecorator(`btnGroup`, {
                  initialValue: undefined
                })(
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
                      setLabel([])
                    }}>
                      重置
                    </Button>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row className='row2' style={rowStyle} gutter={[gridProps.horizontalGutter, gridProps.verticalGutter]}>
            <Col span={gridProps.colSpan}>
              <Form.Item label="完成事项" {...formItemProps}>
                {getFieldDecorator(`matter`, {
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
                    {XMJZ.sort((a, b) => Number(a.ibm) - Number(b.ibm)).map((item, index) => (
                      <Select.Option key={item.ibm} value={item.note}>
                        {item.note}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={gridProps.colSpan}>
              <Form.Item label="当前里程碑" {...formItemProps}>
                {getFieldDecorator(`milestone`, {
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
                    {mileStoneData.map((item, index) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.lcbmc}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={gridProps.colSpan}>
              <Form.Item label="项目标签" {...formItemProps}>
                {getFieldDecorator(`tag`, {
                  initialValue: undefined
                })(
                  <>
                    <TreeSelect
                      allowClear
                      showArrow
                      className="item-selector"
                      showSearch
                      treeCheckable
                      maxTagCount={2}
                      maxTagTextLength={42}
                      maxTagPlaceholder={extraArr => {
                        return `等${extraArr.length + 2}个`;
                      }}
                      showCheckedStrategy={TreeSelect.SHOW_CHILD}
                      treeNodeFilterProp="title"
                      dropdownClassName="newproject-treeselect"
                      dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                      treeData={labelData}
                      placeholder="请选择"
                      onChange={(v) => {
                        setLabel([...v]);
                      }}
                      value={label}
                      treeDefaultExpandedKeys={['1']}
                      open={labelOpen}
                      onDropdownVisibleChange={v => setLabelOpen(v)}
                    />
                    <Icon
                      type="down"
                      className={'label-selector-arrow' + (labelOpen ? ' selector-rotate' : '')}
                      onClick={() => {
                        setLabelOpen(p => !p);
                      }}
                    />
                  </>
                )}
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className='common_project-info-table-box'>
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

export default Form.create()(ProjectQueryTable)
