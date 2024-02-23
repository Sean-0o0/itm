import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, message, Col, Form, Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { FetchQueryOwnerProjectList, QueryProjectListInfo } from '../../../../../services/pmsServices';


/**
 * 科技荣誉——弹窗
 * @param {*} props 
 * @returns 
 */
export default function ScienceHoner(props) {

  //——————————————————————————————属性解析————————————————————————
  const { components = {}, dataProps = {}, funcProps = {} } = props;

  // 使用到的封装的组件
  const { getInput, getSingleSelector, getSingleTreeSelector, getDatePicker, getMultipleUpload } = components;

  // 使用到的数据  
  const { rowData = {}, upldData = [], isTurnRed, userBasicInfo,
    sltData,  //  项目数据  联系人树形数据
    isGLY, // 是否管理员
  } = dataProps;

  // 使用到的函数
  const { setUpldData, setIsTurnRed, setIsSpinning, getContactData, getFieldDecorator } = funcProps;

  //固定常量
  const labelCol = 6;
  const wrapperCol = 18;
  const labelStyle = { display: 'inline-block', lineHeight: '17px' };

  //———————————————————————————自定义变量————————————————————————
  // 关联项目数据源
  const [associatedProjectDataSource, setAssociatedProjectDataSource] = useState([])

  //// 关联项目数据源
  const [associatedProjectDataSource_search, setAssociatedProjectDataSource_search] = useState([])

  /**  关联项目数据源懒加载页码 */
  const [lazyLoadPageNum, setLazyLoadPageNum] = useState(1)

  /** 关联项目数据源数据是否加载完毕 */
  const islazyDataLoadedRef = useRef(false)

  // ——————————————————————————获取数据——————————————————————————
  /**
   * 获取关联项目数据源
   */
  const getAssociatedProjectDataSource = async (extraParamas) => {
    setIsSpinning(true)

    const queryParams = {
      // current: lazyLoadPageNum,
      // pageSize: 5000,
      // paging: 1,
      paging: -1,
      total: -1,
      sort: '',
      cxlx: isGLY ? 'ALL' : 'GR',
      ...extraParamas,


      // queryType: 'XLK',
      // projectManager: Number(userBasicInfo.id),  //项目经理ID
    }

    try {
      const res = await FetchQueryOwnerProjectList(queryParams)
      // const res = await QueryProjectListInfo(queryParams)
      if (res.code === 1) {
        // console.log('res.recordres.recordres.record', res.record)
        // console.log('res.recordres.recordres.record', JSON.parse(res.record))
        const data = res.record.map((item) => {
          return {
            // ...item,
            XMMC: item.xmmc,
            XMID: item.xmid,
            label: item.xmmc,
            value: item.xmid,
          }
        })
        if (data.length === 0) {
          islazyDataLoadedRef.current = true
        }
        setAssociatedProjectDataSource(val => {
          return [...val, ...data]
        })
        setIsSpinning(false)
      }
    }
    catch (err) {
      message.error('项目名称下拉框信息查询失败', 3);
      setIsSpinning(false);
    }
  }
  //—————————————————————————————处理数据————————————————————
  /** 滚动到底部，执行加载更多选项的操作 */
  const handlePopupScroll = (e) => {
    const { target } = e;
    if ((target.scrollTop + target.offsetHeight > target.scrollHeight - 50) && islazyDataLoadedRef.current === false) {
      setLazyLoadPageNum((val) => {
        return ++val
      })
    }
  };

  // ————————————————————————————依赖项——————————————————————
  useEffect(() => {
    getContactData()
  }, [])

  useEffect(() => {
    getAssociatedProjectDataSource()
  }, [lazyLoadPageNum])


  return (
    <>
      <Row>
        {getInput('荣誉名称', 'sbxm', rowData.RYMC, labelCol, wrapperCol, 50)}

        <Col span={12}>
          <Form.Item label='关联项目' labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
            {getFieldDecorator('xmmc', {
              initialValue: rowData.RYMC,
              rules: [
                {
                  required: true,
                  message: '关联项目不允许空值',
                },
              ],
            })(
              <Select
                placeholder="请选择"
                optionFilterProp="children"
                showSearch
                allowClear
              // listHeight={300}
              // onPopupScroll={handlePopupScroll}  
              >
                {associatedProjectDataSource.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>

        {/* unit:fqdw   */}
        {getInput('颁发单位', 'fqdw', rowData.BFDW, labelCol, wrapperCol, 50)}

        {/* 管理员 */}
        {isGLY &&
          getSingleTreeSelector({
            label: '联系人',
            dataIndex: 'lxr',
            // initialValue: rowData.LXRID || userBasicInfo.id,
            initialValue: rowData.LXRID,
            labelCol,
            wrapperCol,
            sltArr: sltData.contact,
            onChange: () => { },
            treeDefaultExpandedKeys: ['357', '11168'],
          })}


        {getDatePicker({
          label: '获奖日期',
          dataIndex: 'hjrq',
          initialValue: rowData.HJSJ,
          labelCol,
          wrapperCol,
        })}

        {getMultipleUpload({
          label: '附件',
          labelCol: labelCol,
          wrapperCol: wrapperCol,
          fileList: upldData,
          setFileList: setUpldData,
          isTurnRed,
          setIsTurnRed,
        })}

      </Row>

    </>
  );
}
