import React, { useState, useEffect, useRef, useContext } from 'react';
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
 * 资本预算详情
 */
const CapitalBudget = (props) => {

  const { projectData, dictionary } = useContext(BudgetDetailContext)


  return (
    <div className="CapitalBudget">
      <div className="TopInfo">
        <div className="TopInfo_LeftBox">
          <div className="TopInfo_LeftBox_titleTag">
            <TitleTag
              projectName={projectData.projectName}
              projectTagArr={
                tagGenerator(
                  [projectData.Tag_approvalTime],
                  [
                    [[], projectData.Tag_addOrCarryforward, 'Tag_addOrCarryforward'],
                    [[], projectData.isInitialApproval, 'isInitialApproval'],
                    [[], projectData.Tag_softwareDevelopmentOrSystemDocking, 'Tag_softwareDevelopmentOrSystemDocking'],
                  ]
                )
              }
            ></TitleTag>
          </div>

          <div className="TopInfo_LeftBox_projectInfo">
            <NormalItem title='负责人' value={projectData.responsiblePeople}></NormalItem>

            <NormalItem title='预算类别'
              value={dictionarySearchHandle(dictionary.YSFL, projectData.budgetCategory)}
            ></NormalItem>

            <NormalItem title='项目分类'
              value={dictionarySearchHandle(dictionary.YSLB, projectData.projectCategory)}></NormalItem>
          </div>

        </div>

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
      </div>

      <div className="MiddleInfo">
        <CustomTable></CustomTable>
      </div>

      <div className="BottomInfo">
        <div className="BottomInfoBox">
          <div className="BottomInfoBox_TitleBar">
            <span>预算信息(万元)</span>
          </div>

          <div className="BottomInfoBox_ContentBox">
            <div className="BottomInfoBox_ContentBox_groupItem">
              <div className='header'>
                <div className='header_lineBlock'></div>
                <div className="header_title">
                  基本信息
                </div>
              </div>

              <div className="content">
                <div className="content_item">
                  <NormalItem title='系统名称' value={projectData.systemName ?? '--'}></NormalItem>
                </div>

                <div className="content_item">
                  <NormalItem title='项目分类说明' value={projectData.projectCategoryDescription ?? '--'}></NormalItem>
                </div>

                <div className="content_item">
                  <NormalItem title='项目必要性' value={projectData.projectNecessity ?? '--'}></NormalItem>
                </div>

                <div className="content_item">
                  <TooltipItem title='项目内容' data={projectData.projectContent} ></TooltipItem>
                </div>

              </div>
            </div>

            <div className="BottomInfoBox_ContentBox_groupItem" style={{ marginTop: 24 }}>
              <div className='header'>
                <div className='header_lineBlock'></div>
                <div className="header_title">
                  预算信息
                </div>
              </div>

              <div className="content">
                <div className="content_item">
                  <NormalItem
                    title='软件投资'
                    value={`${projectData.softwareInvestment} (计划支付 ${projectData.softwareInvestmentCurYear})`}
                  ></NormalItem>
                </div>

                <div className="content_item">
                  <NormalItem
                    title='其中信创-软件投资'
                    value={`${projectData.xinChuang_SoftwareInvestment} (计划支付 ${projectData.xinChuang_SoftwareInvestmentCurYear})`}
                  >
                  </NormalItem>
                </div>

                <div className="content_item">
                  <NormalItem
                    title='硬件服务器'
                    value={`${projectData.hardwareServer} (计划支付 ${projectData.hardwareServerCurYear})`}
                  ></NormalItem>
                </div>

                <div className="content_item">
                  <NormalItem
                    title='硬件网络设备'
                    value={`${projectData.hardwareNetworkEquipment} (计划支付 ${projectData.hardwareNetworkEquipmentCurYear})`}
                  ></NormalItem>
                </div>



                <div className="content_item">
                  <NormalItem
                    title='硬件其他'
                    value={`${projectData.hardwareOther} (计划支付 ${projectData.hardwareOtherCurYear})`}
                  ></NormalItem>
                </div>

                <div className="content_item">
                  <NormalItem
                    title='硬件投资总金额'
                    value={`${projectData.totalHardwareInvestment} (计划支付 ${projectData.totalHardwareInvestmentCurYear})`}
                  ></NormalItem>
                </div>

                <div className="content_item">
                  <NormalItem
                    title='其中信创-硬件投资'
                    value={`${projectData.xinChuang_HardwareInvestment} (计划支付 ${projectData.xinChuang_HardwareInvestmentCurYear})`}
                  ></NormalItem>
                </div>

                <div className="content_item">
                  <NormalItem
                    title='总投资'
                    value={`${projectData.totalInvestment} (计划支付 ${projectData.totalInvestmentCurYear})`}
                  ></NormalItem>
                </div>


                <div className="content_item">
                  <TooltipItem title='硬件云资源配置' data={projectData.hardwareCloudResourcesConfigure} ></TooltipItem>
                </div>

                <div className="content_item">
                  <TooltipItem title='硬件存储配置' data={projectData.hardwareStorageConfiguration} ></TooltipItem>
                </div>

              </div>
            </div>


          </div>
        </div>
      </div>


    </div>
  )

}

export default CapitalBudget
