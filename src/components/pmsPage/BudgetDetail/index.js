import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { message, Spin, Tabs } from 'antd';
import { } from '../../../services/pmsServices';
import CapitalBudget from './CapitalBudget'
import NonCapitalBudget from './NonCapitalBudget'
import ScientificBudget from './ScientificBudget'
import { useLocation } from 'react-router-dom';
import { DecryptBase64 } from '../../Common/Encrypt';


export const BudgetDetailContext = createContext()

/**
 * 预算详情（跳转过来的页面，不可直接访问）
 */
const BudgetDetail = (props) => {

  const { dictionary, userBasicInfo } = props

  const location = useLocation()
  const { pathname } = location

  /** 预算类型 */
  const [budgetType, setBudgetType] = useState('')

  /** 预算项目的ID */
  const budgetIdRef = useRef('')

  /** 项目所有其他信息 */
  const [projectData, setProjectData] = useState({})

  /** 整个页面的加载动画 */
  const [isGlobalLoading, setIsGlobalLoading] = useState(false)

  useEffect(() => {
    //浏览器回退/刷新会触发pathname变化，刷新：budgetType有值，回退：budgetType无值 state:自定义的从哪个页面跳过来的路由信息
    if (location.state === undefined && budgetType !== '') return;
    const startIndex = pathname.lastIndexOf('/') + 1;
    const extractedJSONString = DecryptBase64(pathname.substring(startIndex));
    const urlInfo = JSON.parse(extractedJSONString)
    const { fromKey, budgetID } = urlInfo
    budgetIdRef.current = budgetID
    setBudgetType(fromKey)
  }, [pathname])


  return (
    <BudgetDetailContext.Provider
      value={{
        isGlobalLoading, setIsGlobalLoading, budgetType, budgetIdRef, projectData, setProjectData,
        dictionary,
      }}
    >
      <Spin spinning={isGlobalLoading} tip='加载中'>
        <div className="BudgetDetail">
          {budgetType === 'ZB' && <CapitalBudget />}

          {budgetType === 'FZB' && <NonCapitalBudget />}

          {budgetType === 'KY' && <ScientificBudget />}

        </div>
      </Spin>
    </BudgetDetailContext.Provider>
  )
}

export default BudgetDetail
