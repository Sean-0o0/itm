import React from 'react';
import { Select, Button, Tooltip, Row, Col, } from 'antd'
import { connect } from 'dva';
import { getDictKey } from '../../../../../../../../utils/dictUtils';
import { FetchQueryAssessPlanList, FetchQueryOrgList } from '../../../../../../../../services/planning/planning';
class ListHead extends React.Component {
    state = {
        schemeType: [],
        schemeTypeStatus: [],
        asssessmentType: [],
        year: '',

        schemeTypeId: '',
        schemeTypeStatusId: '',
        objId: '',
    };


    componentDidMount() {
        this.fetchQueryOrgList("4")
    }

    fetchQueryOrgList = (planType) => {
        FetchQueryOrgList({
            planType
        }).then(
            res => {
                const { code, note, records } = res
                if (code > 0) {
                    this.setState({
                        asssessmentType: records
                    })
                }
            }
        )
    }
    handleYearChange = (year) => {
        this.setState({
          year: year,
        })
    }

    handleScheChange = (id) => {
        this.fetchQueryOrgList(id)
        this.setState({
            schemeTypeId: id,
        })
    }
    handleObjChange = (id) => {
        this.setState({
            objId: id,
        })
    }
    handleScheStatusChange = (id) => {
        this.setState({
            schemeTypeStatusId: id,
        })
    }

    // componentWillMount() {
    //   this.handleSearch()
    // }

  componentWillReceiveProps(nextProos) {
        const { reload = false } = nextProos
        if (reload) {
            this.handleSearch()
        }
    }

    handleSearch = (e) => {
        const { changeTableData,params,changeHeadData } = this.props
        //console.log("zheshaisdadias",params)
        const { year, schemeTypeStatusId, schemeTypeId, objId} = this.state
        //console.log("这是啥呀",year)
        //头部查询条件
        const headState = {
          year:year,
          schemeTypeStatusId:schemeTypeStatusId,
          schemeTypeId:"1",
          objId:objId,
        }
          //逻辑:从详情页面返回列表页面时,需要保留列表页面原有的筛选条件,手动选择筛选条件时,其他条件不能清空,需保留,
          // 手动点击筛选框的x时,其他条件也不能清空,头部筛选条件需要从ListHead->列表页面->ListTable->详情页面->列表页面->ListHead进行传递。
          FetchQueryAssessPlanList({
            "orgId": objId ? (objId==='' ? '':objId):(objId === undefined?'':(params.objId===''? '':params.objId)),
            "planType":"4",
            "status": schemeTypeStatusId ? (schemeTypeStatusId==='' ? 99:schemeTypeStatusId):(schemeTypeStatusId === undefined?99:(params.schemeTypeStatusId===''? 99:params.schemeTypeStatusId)),
            "yr": year ? (year ? year : new Date().getFullYear()):(params.year? params.year : new Date().getFullYear()),
          }).then((res) => {
            changeTableData(res.records)
          })
          if(e){
            changeHeadData(headState);
          }
        // }
    }

    render() {
      const { asssessmentType = [], year, schemeTypeStatusId, schemeTypeId, objId } = this.state
        const { [getDictKey('PLANTYPE')]: schemeType = [], [getDictKey('PLANSTATUS')]: schemeTypeStatus = [] } = this.props.dictionary;
        const {params} = this.props
        const curYear = new Date().getFullYear()
        let yearArray = []
        for (var i = -5; i < 5; i++) {
            yearArray.push(curYear + i)
        }
        return (
            <div className='clearfix' style={{ display: 'flex' }}>
                <div style={{ flexShrink: 0, fontSize: '1.1rem', fontWeight: '500' }} >年度：
                    <Select style={{ width: '8rem' }} onChange={e => this.handleYearChange(e)}
                        defaultValue={year ? (year ? year : new Date().getFullYear()):(params.year? params.year : new Date().getFullYear())} id='year'>
                        {
                            yearArray.map((item, index) => {
                                return <Select.Option key={item} value={item} >{item}</Select.Option>;
                            })
                        }
                    </Select>
                </div>
                <div style={{ flexShrink: 0, fontSize: '1.1rem', fontWeight: '500' }} className='fl header-dept'>考核对象：
                    <Select style={{ width: '17rem' }} id='obj' showSearch allowClear
                        defaultValue={objId ? (objId=== '' ? '':objId):(objId === undefined?'':(params.objId=== ''? '':params.objId))}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onChange={(e) => { this.handleObjChange(e) }}>
                        {asssessmentType.map((item, index) => {
                            return <Select.Option key={item.orgId} value={item.orgId} >
                                <Tooltip overlayClassName="selected-toolTip" placement="right" title={item.orgName}>
                                    {item.orgName}
                                </Tooltip>
                            </Select.Option>;
                        })}
                    </Select>
                </div>
                <div style={{ flexShrink: 0, fontSize: '1.1rem', fontWeight: '500' }} className='fl header-dept'>状态：
                    <Select style={{ width: '10rem' }} id='status' showSearch allowClear
                        defaultValue={schemeTypeStatusId ? (schemeTypeStatusId=== '' ? '':schemeTypeStatusId):(schemeTypeStatusId === undefined?'':(params.schemeTypeStatusId=== ''? '':params.schemeTypeStatusId))}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onChange={(e) => { this.handleScheStatusChange(e) }}>
                        {schemeTypeStatus.map((item, index) => {
                            return <Select.Option key={item.ibm} value={item.ibm} >{item.note}</Select.Option>;
                        })}
                    </Select>
                </div>
                <div>
                    <Button onClick={e => this.handleSearch(e)} className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" style={{ marginLeft: '10px' }} >查询</Button>
                </div>
            </div>
        );
    }
}
export default connect(({ global = {} }) => ({
    dictionary: global.dictionary,
}))(ListHead);
