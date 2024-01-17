import React, { useState, useEffect, useRef, useContext } from 'react';
import { message, Spin, Tabs, Tooltip, Popover } from 'antd';
import { BudgetDetailContext } from '../index'


/**
 * 
 * 输出格式 （灰色）项目类型： （蓝色）前端项目，悬浮显示详情
 * @param {*} title 标题：
 * @param {*} data 值
 */
const TooltipItem = (props) => {

  const { title, data } = props



  return (
    <div className="Component_TooltipItem">
      <span className="Component_TooltipItem_title">
        {title}：
      </span>
      {data
        ? <Popover
          title={null}
          content={
            <div className="popoverBox">{data}</div>
          }
        // placement="topRight"
        // overlayClassName="lxr-info-popover"
        >
          <span className="Component_TooltipItem_value" >
            查看详情
          </span>
        </Popover>
        : <span>--</span>
      }


      {/* <Tooltip
        // placement='topRight'
        color='#bcbc16'
        title={
          <div style={{ color: 'pink' }}>这是Tooltip具体的内容22</div>
        }
      >
        <span className="Component_TooltipItem_value" >
          查看详情
        </span>
      </Tooltip> */}

    </div>
  )
}

export default TooltipItem