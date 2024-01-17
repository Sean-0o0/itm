import React, { useState, useEffect, useRef, useContext } from 'react';
import { message, Spin, Tabs } from 'antd';
import NormalItem from './normalItem'
import { calculatePercentage } from '../budgetUtils'


/***
 * 百分比进度盒子
 */
const ExecutionProgress = (props) => {

  const { partObj, remainingObj, totalObj } = props

  return (
    <div className="Component_ExecutionProgress">

      <div className="Component_ExecutionProgress_TopBar">
        <div className="Component_ExecutionProgress_TopBar_left">
          <div className="title">{Object.keys(partObj)}</div>
          <div className="money" >
            <span className="money_value">{Object.values(partObj)}</span>
            <span className="money_units">万</span>
          </div>
        </div>

        <div className="Component_ExecutionProgress_TopBar_middle">
          <div className="verticaLine"></div>
          <div className="title">{Object.keys(remainingObj)}</div>

          <div className="money" >

            <span className="money_value">{Object.values(remainingObj)}</span>
            <span className="money_units">万元</span>
          </div>
        </div>

        <div className="Component_ExecutionProgress_TopBar_right">
          <div className="verticaLine"></div>
          <div className="title">{Object.keys(totalObj)}</div>

          <div className="money" >

            <span className="money_value">{Object.values(totalObj)}</span>
            <span className="money_units">万元</span>
          </div>
        </div>
      </div>

      <div className="Component_ExecutionProgress_ProcessBar">
        <div
          className="Component_ExecutionProgress_ProcessBar_partProcess"
          style={{ width: '100%' }}
        ></div>
        <div className="Component_ExecutionProgress_ProcessBar_allProcess" ></div>
      </div>



      <div className="Component_ExecutionProgress_BottomBar">
        <NormalItem
          title='执行率'
          value={calculatePercentage(Object.values(partObj), Object.values(totalObj))}
          statisticalFont={true}
        >
        </NormalItem>
      </div>

    </div>
  )
}

export default ExecutionProgress