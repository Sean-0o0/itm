import React, { useState, useEffect, useRef, useContext, Fragment } from 'react';
import { message, Spin, Tabs } from 'antd';
import { } from '../../../../services/pmsServices';
import TitleTag from '../_Component/titleTag'
import NormalItem from '../_Component/normalItem'
import ExecutionProgress from '../_Component/executionProgress'
import CustomTable from '../_Component/customTable'
import TooltipItem from '../_Component/tooltipItem'
import { BudgetDetailContext } from '../index'
import { dictionarySearchHandle, tagGenerator } from '../budgetUtils'



/**
 * 非资本预算详情
 */
const NonCapitalBudget = (props) => {

  const { projectData = {}, dictionary, isLeader, userBasicInfo = {}, } = useContext(BudgetDetailContext)
  //是否显示金额
  const isShowMoney = (fzrId) =>  isLeader || String(userBasicInfo.id) === String(fzrId)




  return (
    <div className="NonCapitalBudget">
      <div className="TopInfo">
        <div className="TopInfo_LeftBox">
          <div className="TopInfo_LeftBox_titleTag">
            <TitleTag
              projectName={projectData.projectName}
              projectTagArr={
                tagGenerator(
                  [projectData.Tag_approvalTime],
                  []
                )
              }
            ></TitleTag>
          </div>

          <div className="TopInfo_LeftBox_projectInfo">
            <div className="TopInfo_LeftBox_projectInfo_Item">
              <NormalItem title='负责人' value={projectData.responsiblePeople ?? '-' }></NormalItem>
            </div>

            {/* <div className="TopInfo_LeftBox_projectInfo_Item">
              <NormalItem title='预算类别' value={''}></NormalItem>
            </div> */}

            <div className="TopInfo_LeftBox_projectInfo_Item">
              <NormalItem title='维护费用类别'
                value={dictionarySearchHandle(dictionary.YSLB, projectData.maintainCostCategory) ?? '-' }
              ></NormalItem>
            </div>

            <div className="TopInfo_LeftBox_projectInfo_Item">
              <NormalItem title='维护年费' value={(projectData.maintenanceAnnualFee ?? '-')  + '万元'}></NormalItem>
            </div>

            {/* <div className="TopInfo_LeftBox_projectInfo_Item">
              <TooltipItem title='基本描述' data={''}></TooltipItem>
            </div> */}

            <div className="TopInfo_LeftBox_projectInfo_Item">
              <NormalItem title='可执行金额' value={projectData.canExecuteMoney ?? '-'  + '万元'}></NormalItem>
            </div>

          </div>

        </div>

        {isShowMoney(projectData.presponsiblePeopleId) && (
          <Fragment>
            <div className="TopInfo_MiddleBox">
              <ExecutionProgress
                partObj={{ '已执行金额': projectData.executedMoney ?? '-' }}
                remainingObj={{ '可执行金额': projectData.canExecuteMoney ?? '-'  }}
                totalObj={{ '总金额': projectData.totalMoney ?? '-'  }}
                rate={projectData.executeRate!==undefined?Number(projectData.executeRate)*100:'-'}
              ></ExecutionProgress>
            </div>

            <div className="TopInfo_RightBox">
              <ExecutionProgress
                partObj={{ '已立项金额': projectData.approvalMoney ?? '-'  }}
                remainingObj={{ '可立项金额': projectData.canApprovalMoney ?? '-'  }}
                totalObj={{ '总金额': projectData.totalMoney ?? '-'  }}
                rate={projectData.approvalRate!==undefined?Number(projectData.approvalRate)*100:'-'}
              >
              </ExecutionProgress>
            </div>
          </Fragment>
        )}
      </div>

      <div className="MiddleInfo">
        <CustomTable></CustomTable>
      </div>

    </div>
  )

}

export default NonCapitalBudget
