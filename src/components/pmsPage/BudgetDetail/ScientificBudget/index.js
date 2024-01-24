import React, { useState, useEffect, useRef, useContext, Fragment } from 'react';
import { message, Spin, Tabs } from 'antd';
import { } from '../../../../services/pmsServices';
import TitleTag from '../_Component/titleTag'
import NormalItem from '../_Component/normalItem'
import ExecutionProgress from '../_Component/executionProgress'
import CustomTable from '../_Component/customTable'
import TooltipItem from '../_Component/tooltipItem'
import { BudgetDetailContext } from '../index'
import { approvalTimeFormater, tagGenerator } from '../budgetUtils'

/**
 * 科研预算详情
 */
const ScientificBudget = (props) => {

  const { projectData = {}, dictionary, isLeader, userBasicInfo = {}, } = useContext(BudgetDetailContext)

  //是否显示金额
  const isShowMoney = (fzrId) =>  isLeader || String(userBasicInfo.id) === String(fzrId)

  return (
    <div className="ScientificBudget">
      <div className="TopInfo">
        <div className="TopInfo_LeftBox">
          <div className="TopInfo_LeftBox_titleTag">
            <TitleTag
              projectName={projectData.projectName}
              projectTagArr={
                tagGenerator(
                  [projectData.Tag_approvalTime],
                  [
                    [dictionary.YSLB, projectData.Tag_addOrCarryforward, 'YSLB'],
                  ]
                )
              }
            ></TitleTag>
          </div>

          <div className="TopInfo_LeftBox_projectInfo">
            <NormalItem title='负责人' value={projectData.responsiblePeople}></NormalItem>
            <NormalItem title='项目立项时间' value={approvalTimeFormater(projectData.Tag_approvalTime)}></NormalItem>
            <NormalItem title='建设周期' value={projectData.constructionCycle ?? '--'}></NormalItem>
          </div>

        </div>

        {isShowMoney(projectData.presponsiblePeopleId) && (
          <Fragment>
            <div className="TopInfo_MiddleBox">
              <ExecutionProgress
                partObj={{ '已执行金额': projectData.executedMoney }}
                remainingObj={{ '可执行金额': projectData.canExecuteMoney }}
                totalObj={{ '总金额': projectData.totalMoney }}
              ></ExecutionProgress>
            </div>

            <div className="TopInfo_RightBox">
              <ExecutionProgress
                partObj={{ '已立项金额': projectData.approvalMoney }}
                remainingObj={{ '可立项金额': projectData.canApprovalMoney }}
                totalObj={{ '总金额': projectData.totalMoney }}
              >
              </ExecutionProgress>
            </div>
          </Fragment>
        )}
      </div>

      <div className="MiddleInfo">
        <CustomTable></CustomTable>
      </div>

      <div className="BottomInfo">
        <div className="BottomInfoBox">
          <div className="BottomInfoBox_TitleBar">
            预算信息
          </div>

          <div className="BottomInfoBox_ContentBox">
            <div className="BottomInfoBox_ContentBox_groupItem">
              <div className='header'>
                <div className='header_lineBlock'></div>
                <div className="header_title">
                  <span>预算信息(万元)</span>
                </div>
              </div>

              <div className="content">
                <div className="content_item">
                  <NormalItem title='资本性预算' value={projectData.capitalBudget}></NormalItem>
                </div>

                <div className="content_item">
                  <NormalItem title='非资本性预算' value={projectData.nonCapitalBudget}></NormalItem>
                </div>

                <div className="content_item">
                  <NormalItem title='人力成本' value={projectData.humanCost}></NormalItem>
                </div>

                <div className="content_item">
                  <NormalItem title='总投资' value={projectData.totalInvestment}></NormalItem>
                </div>

                <div className="content_item">
                  <NormalItem title='本年计划支付' value={projectData.currentYearScheduledPay}></NormalItem>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>


    </div>
  )

}

export default ScientificBudget
