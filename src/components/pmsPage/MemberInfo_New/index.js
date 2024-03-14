import React, { useEffect, useState, useRef, useContext, createContext } from 'react';
import { message, Tabs } from 'antd'
import { QueryProjectListPara } from '../../../services/pmsServices';
import OutsourcingPeople from './OutsourcingPeople'
import ProjectSite from './ProjectSite'
import OtherExternalPeople from './OtherExternalPeople'
import AllPeople from './AllPeople'
import Lodash from 'lodash'
import './index.less'

const { TabPane } = Tabs

export const MemberInfoContext = createContext()

/**
 * 外包项目————外包人员列表
 * @param {*} props
 * @returns
 */
const MemberInfo = (props) => {

  const { params = {}, dictionary = {}, roleData = {} } = props

  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'))

  const [curTab, setCurTab] = useState('1')

  //下拉框数据
  const [prjNameData, setPrjNameData] = useState([]); //项目名称
  const [gysData, setGysData] = useState([]); //所属供应商
  const [rymcData, setRymcData] = useState([]); //人员名称
  const [rydjData, setRydjData] = useState([]); //人员等级
  const [responsiblePeopleData, setResponsiblePeopleData] = useState([]) //负责人

  /** 获取负责人（项目经理）数据 */
  const getResponsiblePeopleData = async () => {
    const queryPamras = {
      current: 1,
      czr: 0,
      paging: 0,
      total: -1,
      cxlx: 'XMLB',
    }
    try {
      const res = await QueryProjectListPara(queryPamras)
      if (res.code === 1) {
        const data = JSON.parse(res.projectManagerRecord) || []
        setResponsiblePeopleData(data)
      }
    }
    catch (err) {
      message.error(`查询负责人数据失败,${!err.success ? err.message : err.note}`, 3)
    }
  }

  /** 20240306 转 2024-03-06 */
  const dateFormater = (val) => {
    if (val === undefined || val === '' || val === null || String(val) === '0') return ''
    else {
      let date = String(val)
      return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
    }
  }

  /** 人员状态 1：正常 2：离场 */
  const peopleStateFormater = (val) => {
    if (String(val) === '1') return '正常'
    else if (String(val) === '2') return '离场'
    else return '暂无'
  }

  useEffect(() => {
    getResponsiblePeopleData()
  }, [])

  return (
    <MemberInfoContext.Provider
      value={{
        dictionary,
        roleData,   //登陆人角色
        LOGIN_USER_INFO, params,
        dateFormater, peopleStateFormater,
        prjNameData, setPrjNameData, gysData, setGysData, rymcData, setRymcData, rydjData, setRydjData,
        responsiblePeopleData, setResponsiblePeopleData,
      }}
    >
      <div className='MemberInfo'>

        <div className="MemberInfo_tabBar">
          <Tabs
            size='large'
            activeKey={curTab}
            onChange={val => setCurTab(val)}
          >
            <TabPane tab="外包人员" key="1" />
            <TabPane tab="项目驻场" key="2" />
            <TabPane tab="其他外部人员" key="3" />
            <TabPane tab="全部" key="4" />
          </Tabs>
        </div>

        {curTab === '1' && <OutsourcingPeople />}

        {curTab === '2' && <ProjectSite />}

        {curTab === '3' && <OtherExternalPeople />}

        {curTab === '4' && <AllPeople />}


      </div>
    </MemberInfoContext.Provider>
  );
}

export default MemberInfo
