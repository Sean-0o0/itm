import React, { useState, useEffect, useRef, useContext } from 'react';
import { message, Spin, Tabs } from 'antd';


/**
 * 
 * 输出格式 （灰色）项目类型： （黑色）前端项目
 * @param {*} title 标题：
 * @param {*} value 值
 */
const NormalItem = (props) => {

  const { title, value, statisticalFont = false } = props

  return (
    <div className="Component_NormalItem">
      <span className="Component_NormalItem_title">
        {title}：
      </span>
      <span className={`Component_NormalItem_value ${statisticalFont ? 'statisticalFont' : ''}`}>
        {value}
      </span>
    </div>
  )
}

export default NormalItem