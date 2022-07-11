/* eslint-disable no-param-reassign */
import React, { Fragment } from 'react';
import { Row, Col, message } from 'antd';
import { FetchProAnalysis } from '../../../../services/processCenter';
import DetailContent from '../DetailContent';
import ListContent from '../ListContent';

class ProcessTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Data:[],
      listData: [],
      elaAnalysis: [],
      maxElaAnalysis: [],
      lastUserAnalysis :[],
      showElaAnalysis: [],
      showMaxElaAnalysis: [],
      showLastUserAnalysis :[],
      showProcess : false,
      openKeys :['00'],
      searchValue:'',
      subMenu:[],
      rootSubmenuKeys:[],
    };
  }

  componentDidMount() {
    this.fetchAnalysisData(1,'');
    this.fetchAnalysisData(2,'');
    this.fetchAnalysisData(3,'');
    this.fetchAnalysisData(4,'');
  }

  fetchAnalysisData = (type,wid) => {
    const condition = {
      type: type,
      wId:wid
    }

    FetchProAnalysis(condition).then(res => {
      let { code = 0, records = [] } = res
      if (code === 1) {
        let data = []
        if (Array.isArray(records) && records.length > 0) {
          data = records;
        }
        if(type === 1){ 
          //let subMenuKeys = [];         
          data.map(item =>{
            
            let wid = item.id;
            //subMenuKeys.push(wid);
            const cond = {
              type: 8,
              wId:wid
            }
            FetchProAnalysis(cond).then(res => {
              let { code = 0, records = [] } = res
              if (code === 1) {
                if (Array.isArray(records) && records.length > 0) {
                  item.subMenu = records;
                }
              }
            }).catch(((error) => {
              message.error(!error.success ? error.message : error.note);
            }));            
          })
          this.setState({
            listData:data,
            //rootSubmenuKeys :subMenuKeys,
          });
          this.handleMenu();
        }else if(type === 2 || type === 5){
          this.setState({
            elaAnalysis:data,
            showElaAnalysis:data,
          });
        }else if(type === 3 || type === 6){
          this.setState({
            maxElaAnalysis:data,
            showMaxElaAnalysis:data,
          });
        }else if(type === 4 || type === 7){
          this.setState({
            lastUserAnalysis:data,
            showLastUserAnalysis:data,
          });
        }
        if(type === 5 || type === 6 || type === 7){
          this.setState({
            showProcess:true,
          });
        }else{
          this.setState({
            showProcess:false,
          });
        }
      }
    }).catch(((error) => {
      message.error(!error.success ? error.message : error.note);
    }));

  }

  handleMenu = () =>{
    const { listData } = this.state;
    let map = {} , dest = [] ,subMenuKeys = []; ;
    for(let i = 0; i<listData.length; i++){
      let ai = listData[i];
      if(!map[ai.category]){
        dest.push({
          category:ai.category,
          data:[ai]
        });
        subMenuKeys.push(ai.category);
        map[ai.category] = ai;
      }else{
        for(let j = 0; j<dest.length;j++){
          var dj = dest[j];
          if(dj.category === ai.category){
            dj.data.push(ai);
            break;
          }
        }
      }
    }
    this.setState({
      listData:dest,
      Data:dest,
      rootSubmenuKeys :subMenuKeys,
    });
  }

  setData = (field, value) => {
    this.setState({
      [field]: value,
    });
  };
  handleOnkeyWord = (keyWord) => {
    
    // 筛选数据
    const { listData } = this.state;
    const newTreeList = listData.filter((item) => {
      if (item.wfName.indexOf(keyWord) !== -1) {
        return true;
      }
      return false;
    });
    this.setState({
      Data:newTreeList,
      searchValue: keyWord,
    });
  };

  clickStep = (stepId) =>{
    let selectEla = [],selectMax = [],selectLast = []; 
    const { elaAnalysis = [], maxElaAnalysis = [], lastUserAnalysis = []} = this.state;
    elaAnalysis.forEach(item =>{
      if(item.stepId === stepId){
        selectEla.push(item);
      }
    });
    maxElaAnalysis.forEach(item =>{
      if(item.stepId === stepId){
        selectMax.push(item);
      }
    });
    lastUserAnalysis.forEach(item =>{
      if(item.stepId === stepId){
        selectLast.push(item);
      }
    });
    this.setState({
      showElaAnalysis : selectEla,
      showMaxElaAnalysis : selectMax,
      showLastUserAnalysis : selectLast,
    });

  }
  
  render() {
    const { Data, showElaAnalysis, showMaxElaAnalysis, showLastUserAnalysis, showProcess, clickKeys, openKeys, searchValue, rootSubmenuKeys} = this.state;
    return (
      <Fragment>
        <Row style={{ height: '100%', backgroundColor: '#FFF' }}>
          <Col xs={ 6} sm={6} lg={6} xl={6} style={{ height: 'calc(100% - 2rem)', borderRight: '1px solid #E3E3E3' }}>
            {/* 左侧搜索组件 */}
            <ListContent  Data={Data} handleOnkeyWord={this.handleOnkeyWord} fetchAnalysisData={this.fetchAnalysisData} clickKeys={clickKeys} setData = {this.setData} clickStep = {this.clickStep} openKeys = {openKeys} searchValue={searchValue} rootSubmenuKeys = {rootSubmenuKeys}/>
          </Col>
          <Col xs={18} sm={18} lg={18} xl={18} style={{ height: 'calc(100% - 2rem)'}}>
            {/* 右侧主要内容 */}
            <DetailContent elaAnalysis={showElaAnalysis} maxElaAnalysis={showMaxElaAnalysis} lastUserAnalysis={showLastUserAnalysis} showProcess = {showProcess}/>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
export default ProcessTabs;
