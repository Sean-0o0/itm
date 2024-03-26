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


  /** 是否有数据 */
  const [hasData, setHasData] = useState(false)

  /** 年份 */
  const [year, setYear] = useState(moment().format('YYYY'))

  /** 付款率 */
  const [payRate, setPayRate] = useState(0)

  const [moneyObj, setMoneyObj] = useState({
    contractAmount: '0', //合同金额
    paymentAmount: '0'   //已付款金额
  })

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
      const { GLOAHTXX, //关联OA合同信息的ID
      } = unCheckedArr[0]

      history.push({
        pathname:
          '/pms/manage/InnovationContractEdit/' +
          EncryptBase64(
            JSON.stringify({
              id: Number(GLOAHTXX), //可能跳转后数据都是“-”（因为接口返回空）   id=2有值
              routes: [{ name: '合同列表', pathname: location.pathname }],
              timeStamp: new Date().getTime(),
            }),
          ),
      })
    }
  }

  /** 生成前后interval年 */
  const yearArrGenerator = (interval) => {
    const curYear = moment().format('YYYY');
    const yearData = [];
    for (let i = +curYear - interval; i <= +curYear + interval; i++) {
      const yearObj = {
        key: String(i),
        value: String(i),
      }
      yearData.push(yearObj)
    }
    return yearData.reverse()
  }
  /** 年份数组 */
  const yearArr = yearArrGenerator(30)

  const menuItemClickHanlde = (obj) => {
    setYear(obj.key)
  }

  const queryHandle = async () => {
    const queryParams = {
      projectID,
      year, //创建日期
    };
    try {
      const res = await QueryProjectPayments(queryParams);
      if (res.code === 1) {
        if (!Lodash.isEmpty(res.result)) {
          const obj = JSON.parse(res.result)
          const { paymentAmount, contractAmount } = obj
          setMoneyObj(obj)
          //合同金额为0，按无数据处理
          if (String(contractAmount) === '0') {
            setHasData(false)
          }
          else {
            setPayRate(Math.floor(parseInt(paymentAmount) / parseInt(contractAmount) * 100))
            setHasData(true)
          }
        }
        else setHasData(false)
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
    queryHandle()
  }, [year])


  const yearDropdownMenu = (
    <Menu
      style={{ height: '200px', overflow: 'auto' }}
    >
      {yearArr.map((item) => {
        return <Menu.Item key={item.value} onClick={menuItemClickHanlde}>
          {item.value}
        </Menu.Item>
      })}
    </Menu>
  )


  return (
    <div className="ProjectDetail_PaymentStatus">

      {projectType !== '硬件入围项目' && !projectTag?.includes('迭代项目') &&
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

          {hasData &&
            <div className='groupMiddle Component_ExecutionProgress'>
              <div className="Component_ExecutionProgress_TopBar">

                {/* 若无合同信息录入时，付款情况仅展示已付款金额*/}
                {!Lodash.isEmpty(contrastArr) &&
                  <>
                    <div className="Component_ExecutionProgress_TopBar_left">
                      <div className="title grayText">付款率</div>
                      <div className="payRate" >
                        {payRate}%
                      </div>
                    </div>


                    <div className="Component_ExecutionProgress_TopBar_middle">
                      <div className="title grayText">合同金额</div>

                      <div className="money blackText" title={`${moneyObj.contractAmount}元`}>
                        {moneyObj.contractAmount}元
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
                    {moneyObj.paymentAmount}元
                  </div>
                </div>
              </div>


              {!Lodash.isEmpty(contrastArr) &&
                <div className="Component_ExecutionProgress_ProcessBar">
                  <div
                    className="Component_ExecutionProgress_ProcessBar_partProcess"
                    style={{ width: `${payRate}%` }}
                  ></div>
                  <div className="Component_ExecutionProgress_ProcessBar_allProcess" ></div>
                </div>
              }
            </div>
          }

          {hasData && unconfirmedContractNum !== 0 &&
            <div className='groupBottom'
              onClick={forwardHandle}
            >
              {`合同未确认 >`}
            </div>
          }

          {!hasData &&
            <div>暂无数据</div>
          }

        </div>
      }
    </div >
  )
}

export default PaymentStatus
