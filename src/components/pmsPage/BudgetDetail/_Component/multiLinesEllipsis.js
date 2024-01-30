import React, { useState, useEffect, useRef, useContext } from 'react';
import { message, Spin, Tabs, Tooltip } from 'antd';


/**
 * 多行文本省略
 * 输出格式 （灰色）项目类型： （黑色）前端项目
 * @param {*} title 标题：
 * @param {*} value 值
 */
const MultiLinesEllipsis = (props) => {

  const { title, value, statisticalFont = false, tooltip = false } = props

  return (
    <div className="Component_NormalItem" style={{ WebkitBoxOrient: 'vertical', display: '-webkit-box', WebkitLineClamp: 2 }}>
      <span className="Component_NormalItem_title">
        {title}：
      </span>
      <Tooltip title={tooltip ? value : ''} overlayClassName='iteration-content-tooltip'>
        <span className={`Component_NormalItem_value ${statisticalFont ? 'statisticalFont' : ''}`}>
          {value}
        </span>
      </Tooltip>
    </div>
  )
}

export default MultiLinesEllipsis