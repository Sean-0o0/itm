import React, { useEffect, useState, useContext, useRef, forwardRef } from 'react';
import {
  Button, Col, Form, message, Modal, Row, Spin, Select, DatePicker, Input, InputNumber,
  Radio, Upload, Tooltip, Icon, Popconfirm, Checkbox, Dropdown, Menu
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { QueryProjectPayments } from '../../../../services/pmsServices';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import Lodash from 'lodash';
import Decimal from 'decimal.js'


/**
 * 付款情况
 * @param {*} props
 */
const PaymentStatus = (props) => {
  const location = useLocation()
  const history = useHistory();

  const { xmid: projectID, prjData } = props

  const {
    prjBasic = {}, //项目基本信息
    contrast = {},      // 关联合同列表  obj
    contrastArr = [],    //关联合同列表    arr
  } = prjData //项目数据

  const {
    CJRQ = '',  //项目时间,
    XMLX: projectType, //项目类型
    XMBQ: projectTag,  //项目标签
  } = prjBasic


  /** 调用接口次数 */
  const [queryApiNum, setQueryApiNum] = useState(0)

  /** 年份 */
  const [year, setYear] = useState(moment().format('YYYY'))

  /** 年份数组 */
  const [yearDatasource, setYearDatasource] = useState([])

  /** 付款率 */
  const [payRate, setPayRate] = useState(0)

  const [moneyObj, setMoneyObj] = useState({})

  /** 未确认合同的数量 */
  const [unconfirmedContractNum, setUnconfirmedContract] = useState(0)

  /** 判断未确认合同的数量   CLZT：1未处理    CLZT：2 已处理   */
  const judgeUnconfirmedContractNumHandle = () => {
    const num = contrastArr.reduce((count, item) => {
      if (String(item.CLZT) === '1') {
        return count + 1;
      }
      return count;
    }, 0);
    setUnconfirmedContract(num)
  }

  /** 点击 合同未确认链接 跳转 */
  const forwardHandle = () => {
    if (unconfirmedContractNum > 0) {
      const unCheckedArr = contrastArr.filter(item => String(item.CLZT) === '1')

      //  根据 QSRQ  来排序，越旧的时间放越前面---不确定后端排了没，前端加个排序
      const sortedArr = unCheckedArr.sort((a, b) => {
        const dateA = new Date(
          a.QSRQ.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
        )
        const dateB = new Date(
          b.QSRQ.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
        )
        return dateA - dateB
      })

      const { GLOAHTXX, //关联OA合同信息的ID
      } = sortedArr[0]

      history.push({
        pathname:
          '/pms/manage/InnovationContractEdit/' +
          EncryptBase64(
            JSON.stringify({
              id: Number(GLOAHTXX), //可能跳转后数据都是“-”（因为接口返回空）   id=2有值
              routes: [{ name: '项目详情', pathname: location.pathname }],
              timeStamp: new Date().getTime(),
            }),
          ),
      })
    }
  }


  const menuItemClickHanlde = (obj) => {
    setYear(obj.key)
  }

  const firstQueryHandle = async () => {
    const queryParams = {
      projectID,
      year: String(year), //创建日期
    }
    try {
      const res = await QueryProjectPayments(queryParams);
      if (res.code === 1) {
        setQueryApiNum(queryApiNum + 1)
        if (!Lodash.isEmpty(res.year)) {
          const yearData = JSON.parse(res.year)
          if (!Lodash.isEmpty(yearData)) {
            setYearDatasource(yearData)
            setYear(yearData[0].YEAR)
          }
        }
      }
    } catch (err) {
      console.log('查付款情况失败，', err)
      message.error(`查付款情况失败，${!err.success ? err.message : err.note}`, 3)
    }
  }


  const queryHandle = async () => {
    const queryParams = {
      projectID,
      year: String(year), //创建日期
    };
    try {
      const res = await QueryProjectPayments(queryParams);
      if (res.code === 1) {
        const { result } = res
        if (!Lodash.isEmpty(result)) {
          const resultObj = JSON.parse(result)
          const { paymentAmount, contractAmount } = resultObj
          setMoneyObj(resultObj)
          setPayRate(Math.floor(parseInt(paymentAmount) / parseInt(contractAmount) * 100))
        }
      }
    } catch (err) {
      console.log('查付款情况失败，', err)
      message.error(`查付款情况失败，${!err.success ? err.message : err.note}`, 3)
    }
  }

  useEffect(() => {
    judgeUnconfirmedContractNumHandle()
  }, [contrastArr, year])

  useEffect(() => {
    if (queryApiNum > 0) {
      queryHandle()
    }
  }, [year, queryApiNum])

  useEffect(() => {
    firstQueryHandle()
  }, [])

  const yearDropdownMenu = (
    <Menu
      style={{ maxHeight: '200px', overflow: 'auto' }}
    >
      {yearDatasource?.map((item) => {
        return <Menu.Item key={item.YEAR} onClick={menuItemClickHanlde}>
          {item.YEAR}
        </Menu.Item>
      })
      }
    </Menu>
  )


  return (
    <div className="ProjectDetail_PaymentStatus">

      {!Lodash.isEmpty(String(yearDatasource)) && !Lodash.isEmpty(moneyObj) &&
        projectType !== '硬件入围项目' && !projectTag?.includes('迭代项目') &&
        <div className='group'>
          <div className='groupTop'>
            <div className='groupTop_Title'>付款情况</div>

            <Dropdown
              trigger={['click']}
              overlay={yearDropdownMenu}
            >
              <div className='groupTop_Year'>
                <span className='txt'>{year}</span>
                <Icon className='img' type="caret-down" />
              </div>
            </Dropdown>
          </div>

          <div className='groupMiddle Component_ExecutionProgress'>
            <div className="Component_ExecutionProgress_TopBar">

              {/* 若无合同信息录入时，付款情况仅展示已付款金额*/}
              {!Lodash.isEmpty(contrastArr)
                && !Lodash.isEmpty(moneyObj.contractAmount) &&
                String(moneyObj.contractAmount) !== '0' &&
                <>
                  <div className="Component_ExecutionProgress_TopBar_left">
                    <div className="title grayText">付款率</div>
                    <div className="payRate" >
                      <span className='statisticalFont'>{payRate}</span>
                      <span className='statisticalGreyFont' style={{ fontSize: 12 }}>%</span>
                    </div>
                  </div>


                  <div className="Component_ExecutionProgress_TopBar_middle">
                    <div className="title grayText">合同金额</div>

                    <div className="money blackText" title={`${moneyObj.contractAmount}元`}>
                      <span className='statisticalFont'>{moneyObj.contractAmount}</span>
                      <span className='statisticalGreyFont'>元</span>
                    </div>
                  </div>
                </>
              }

              <div
                className={Lodash.isEmpty(contrastArr)
                  ? 'Component_ExecutionProgress_TopBar_right_style20'
                  : 'Component_ExecutionProgress_TopBar_right_style14'}
              >
                <div className="title grayText">已付款金额</div>

                <div className="money blackText" title={`${moneyObj.paymentAmount}元`}>
                  <span className='statisticalFont'>{moneyObj.paymentAmount}</span>
                  <span className='statisticalGreyFont'>元</span>
                </div>
              </div>
            </div>


            {!Lodash.isEmpty(contrastArr) &&
              !Lodash.isEmpty(moneyObj.contractAmount) &&
              String(moneyObj.contractAmount) !== '0' &&
              <div className="Component_ExecutionProgress_ProcessBar">
                <div
                  className="Component_ExecutionProgress_ProcessBar_partProcess"
                  style={{ width: `${payRate}%` }}
                ></div>
                <div className="Component_ExecutionProgress_ProcessBar_allProcess" ></div>
              </div>
            }
          </div>

          {unconfirmedContractNum !== 0 &&
            !Lodash.isEmpty(moneyObj.contractAmount) &&
            String(moneyObj.contractAmount) !== '0' &&
            <div className='groupBottom'
              onClick={forwardHandle}
            >
              {`合同未确认 >`}
            </div>
          }

        </div>
      }
    </div >
  )
}

export default PaymentStatus
