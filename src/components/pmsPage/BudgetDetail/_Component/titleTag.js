import React, { useState, useEffect, useRef, useContext, forwardRef } from 'react';
import { message, Spin, Tabs } from 'antd';


/**
 * 左上角项目标题和标签   
 */
const TitleTag = (props) => {

  const { projectName, projectTagArr } = props

  /** 跳转到标签详情 */
  const forwardHandle = (item) => {
    // message.success('todo跳转到标签详情')
  }

  return (
    <div className="Component_TitleTag">

      <div className="Component_TitleTag_Top">
        <img className="Component_TitleTag_Top_Img"
          src={require('../../../../assets/projectDetail/icon_budgetDeital.png')}>
        </img>

        <span className='Component_TitleTag_Top_Txt'
          title={projectName}
        >{projectName}
        </span>
      </div>


      <div className="Component_TitleTag_Bottom">
        {projectTagArr?.map((item, index) => {
          return (
            <div
              className="Component_TitleTag_Bottom_tagBox"
              key={item + index}
              onClick={() => {
                forwardHandle(item)
              }}
            >
              <span>{item}</span>
            </div>
          )
        })
        }
      </div>
    </div>
  )

}

export default TitleTag
