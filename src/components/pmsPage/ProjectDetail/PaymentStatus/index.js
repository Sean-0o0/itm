import React, { useEffect, useState, useContext, useRef, forwardRef } from 'react';
import {
  Button, Col, Form, message, Modal, Row, Spin, Select, DatePicker, Input, InputNumber,
  Radio, Upload, Tooltip, Icon, Popconfirm, Checkbox
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { QueryProjectPayments } from '../../../../services/pmsServices';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import Lodash from 'lodash';


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
    contrast,      // 关联合同列表  obj
    contrastArr,    //关联合同列表    arr
  } = prjData //项目数据

  const {
    CJRQ = '',  //项目时间,
    XMLX: projectType, //项目类型
    XMBQ: projectTag,  //项目标签
  } = prjBasic


  /** 是否有数据 */
  const [hasData, setHasData] = useState(false)

  /** 用于性能优化 */
  const hasQueryed = useRef(false)

  /** 项目年份 */
  const [year, setYear] = useState('')

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
    // 只有一个未确认合同的情况    跳转到 该合同编辑页面
    if (unconfirmedContractNum === 1) {
      const { GLOAHTXX, //关联OA合同信息的ID
      } = contrastArr[0]

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
    //有多个未确认合同的情况      跳转到 合同列表页面
    else {
      history.push({
        pathname:
          '/pms/manage/InnovationContract/' +
          EncryptBase64(
            JSON.stringify({
              timeStamp: new Date().getTime(),
              tab: 'PTHT',
            }),
          ),
      });
    }
  }


  const queryHandle = async () => {
    const queryParams = {
      projectID,
      year: prjData.prjBasic.CJRQ.slice(0, 4), //创建日期（年份）
    };
    try {
      const res = await QueryProjectPayments(queryParams);
      if (res.code === 1) {
        hasQueryed.current = true
        if (!Lodash.isEmpty(res.result)) {
          const obj = JSON.parse(res.result)
          const { paymentAmount, contractAmount } = obj
          setMoneyObj(obj)
          setPayRate(Math.floor(parseInt(paymentAmount) / parseInt(contractAmount) * 100))
          setHasData(true)
        }
      }
    } catch (err) {
      console.log('查付款情况失败，', err)
      message.error(`查付款情况失败，${!err.success ? err.message : err.note}`, 3)
    }
  }

  useEffect(() => {
    !Lodash.isEmpty(contrastArr) && judgeUnconfirmedContractNumHandle()
  }, [contrastArr])

  useEffect(() => {
    if (!Lodash.isEmpty(CJRQ) && hasQueryed.current === false) {
      setYear(prjData.prjBasic.CJRQ.slice(0, 4))
      queryHandle()
    }
  }, [prjBasic])


  return (
    <div className="ProjectDetail_PaymentStatus">

      {hasData && projectType !== '硬件入围项目' && !projectTag.includes('迭代项目') &&
        <div className='group'>
          <div className='groupTop'>
            <div className='groupTop_Title'>付款情况</div>

            {year &&
              <div className='groupTop_Year'>
                <span className='txt'>{year}</span>
                <Icon className='img' type="caret-down" />
              </div>
            }
          </div>

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


          {unconfirmedContractNum !== 0 &&
            <div className='groupBottom'
              onClick={forwardHandle}
            >
              {`合同未确认 >`}
            </div>
          }

        </div>
      }
    </div>
  )
}

export default PaymentStatus