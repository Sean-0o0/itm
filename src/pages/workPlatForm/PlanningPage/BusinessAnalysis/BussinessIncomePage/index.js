import React, { Component } from 'react';
import BussinessIncome from '../../../../../components/WorkPlatForm/PlanningPage/BusinessAnalysis/BusinessIncomePage/BussinessIncome'
//import BussinessIncomeStructureChart from '../../../../../components/WorkPlatForm/PlanningPage/BusinessAnalysis/BusinessIncomePage/BussinessIncomeStructureChart'
import BussinessIncomeSelected from '../../../../../components/WorkPlatForm/PlanningPage/BusinessAnalysis/BusinessIncomePage/BussinessIncomeSelected'
//import BussinessIncomeChainComparison from "../../../../../components/WorkPlatForm/PlanningPage/BusinessAnalysis/BusinessIncomePage/BussinessIncomeChainComparison";
import { DecryptBase64 } from '../../../../../components/Common/Encrypt';
class BusinessIncomePage extends Component {

    render() {
        const { params: { params } } = this.props.match
        let showExpenseArray = '', cardData = '', incomeOption = {}, chartData = '', indiId = '', indexOptionArr = []
        if (params.length > 1) {
            const temArr = params.split("&&")
            showExpenseArray = JSON.parse(DecryptBase64(temArr[0]))//记录折叠状态
            cardData = JSON.parse(DecryptBase64(temArr[1]))//营业收入左侧卡片信息
            incomeOption = JSON.parse(DecryptBase64(temArr[2]))//营业收入Echart图表数据
            chartData = JSON.parse(DecryptBase64(temArr[3]))//右侧表格数据
            indiId = DecryptBase64(temArr[4])//指标ID
            indexOptionArr = JSON.parse(DecryptBase64(temArr[5]))//财务类页面折叠数组
        }
        //const { state: { showExpenseArray, cardData, incomeOption, chartData, indiId, indexOptionArr } } = this.props.location
        return (
            < >
                <BussinessIncome showExpenseArray={showExpenseArray} chartData={chartData}
                    cardData={cardData} incomeOption={incomeOption} indiId={indiId} indexOptionArr={indexOptionArr} />
                <BussinessIncomeSelected indiId={indiId} />
                {/* 参数来源于同一个接口 将以下两个组件移动到BussinessIncomeSelected中调用 */}
                {/* <BussinessIncomeStructureChart /> */}
                {/* <BussinessIncomeChainComparison /> */}
            </>
        );
    }
}

export default BusinessIncomePage;