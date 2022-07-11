import React, { Fragment } from 'react';
import { Empty,Button,Radio,Icon,message,Tooltip} from 'antd';
import BasicModal from '../../../../../Common/BasicModal';
import { FetchQueryStaffSuperviseTaskList } from '../../../../../../services/motProduction';
import MonthTaskListDetail from  '../MonthTaskListDetail'


class MonthTaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      visible: false,
    };
  }
  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps);
  }
  fetchData(nextProps) {
    const { ddyf='',ddsj='',zycd='',type } = nextProps;
    FetchQueryStaffSuperviseTaskList({
      spvsMo: ddyf == null ? '' : ddyf,
      evntId: type === 1 ? '' : ddsj,
      impt: type === 1 ? '' : zycd,
    }).then((res) => {
      if (res.code === 1) {
        const { records = [] } = res;
        this.setState({
          records,
          impt: null,
          page: 1,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });  
  }
  changeImpt=(e)=>{
    const { ddyf='',ddsj='',type } = this.props;
    FetchQueryStaffSuperviseTaskList({
      spvsMo: ddyf,
      evntId: type===1?'':ddsj,
      impt: e.target.value,
    }).then((res) => {
      if (res.code === 1) {
        const { records = [] } = res;
        this.setState({
          records,
          page: 1,
          impt: e.target.value,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });  
  }
  prevPage=()=>{
    const {  page } = this.state;
    if(page > 1){
      this.setState({
        page:page-1,
      });
    }
  }
  nextPage=()=>{
    const { records = [], page } = this.state;
    let pageCount = 1;
    if(records.length%3 !== 0){                                                       
      pageCount = parseInt(records.length/3) + 1;
    }else{
      pageCount = parseInt(records.length/3);
    }
    if(page < pageCount){
      this.setState({
        page:page+1,
      });
    }
  }
  finish=(evntId)=>{
    this.setState({
      visible:true,
      evntId,
    });
  }
  handleCancel=()=>{
    const { refreshData }= this.props;
    this.setState({
      visible:false,
    },()=>{
      refreshData();
    });
  }
  
  render() {
    const { records = [], page, impt, visible, evntId = '' } = this.state;
    const { ddyf = '', zycdDict = [] }= this.props;
    const currentRecords = [];

    for(let i=0;i<records.length;i++){
      if(i===((page-1)*3)){
        currentRecords[0]=records[i];
      }
      if(i===((page-1)*3)+1){
        currentRecords[1]=records[i];
      }
      if(i===((page-1)*3)+2){
        currentRecords[2]=records[i];
      }
    }

    const modalProps = {
      width: '80%',
      title: '详情',
      style: { top: '2rem' },
      visible,
      onCancel: this.handleCancel,
      footer: null,
    };
    return (
      <Fragment>
        <div className="mot-empexc-list-main">
            <div style={{padding:'0rem 2rem 2rem 2rem'}}>
              <Radio.Group onChange={this.changeImpt} className="mot-empexc-list-radio-group" value={impt}>
                {
                  zycdDict.map(item =>(
                  <Radio.Button value={ item.ibm }>{ item.note }</Radio.Button>
                  ))
                }
              </Radio.Group>
            </div>
            <Button onClick={this.prevPage} className="mot-empexc-prev-button">
              <Icon type="left" style={{color:'white',fontSize:'30px',marginLeft:'-5px'}}></Icon>
            </Button>
            <div className="mot-empexc-list-content">
              <div className="mot-empexc-list">
                {
                  currentRecords[0]==null
                  ?
                  (<Empty style={{marginTop:'20%'}}></Empty>)
                  :
                  (
                    <Fragment>
                      {
                            currentRecords[0]['impt']==='3'?(
                              <div style={{width:'100%',float:'left'}}>
                                <div className="mot-empexc-tag">
                                  {currentRecords[0]['imptNm']}
                                </div>
                              </div>
                            ):(
                              <div style={{width:'100%',float: 'left'}}>
                                <div className="mot-empexc-tag-blue">
                                {currentRecords[0]['imptNm']}
                                </div>
                              </div>
                            )
                      }
                      <Tooltip placement="bottom" title={currentRecords[0]['evntNm']}>
                      <div className="mot-empexc-list-title">
                        {currentRecords[0]['evntNm']}
                      </div>
                      </Tooltip>
                      <div className="mot-empexc-list-count">
                        {currentRecords[0]['taskNm']}
                      </div>
                      <div className="mot-empexc-list-rws">
                        任务数
                      </div>
                      <div className="mot-empexc-list-button">
                        <Button type="primary" className="mot-empexc-button" style={{width:'100%'}} onClick={this.finish.bind(this,currentRecords[0]['evntId'])}>办结</Button>
                      </div>
                    </Fragment>
                )
                } 
              </div>
              <div className="mot-empexc-list" style={{marginLeft:'5%'}}>
                {
                  currentRecords[1]==null
                  ?
                  (<Empty style={{marginTop:'20%'}}></Empty>)
                  :
                  (
                    <Fragment>
                      {
                            currentRecords[1]['impt']==='3'?(
                              <div style={{width:'100%',float: 'left'}}>
                              <div className="mot-empexc-tag">
                                {currentRecords[1]['imptNm']}
                              </div>
                              </div>
                            ):(
                              <div style={{width:'100%',float: 'left'}}>
                              <div className="mot-empexc-tag-blue">
                                {currentRecords[1]['imptNm']}
                              </div>
                              </div>
                            )
                      }
                      <Tooltip placement="bottom" title={currentRecords[1]['evntNm']}>
                      <div className="mot-empexc-list-title">
                        {currentRecords[1]['evntNm']}
                      </div>
                      </Tooltip>
                      <div className="mot-empexc-list-count">
                        {currentRecords[1]['taskNm']}
                      </div>
                      <div className="mot-empexc-list-rws">
                        任务数
                      </div>
                      <div className="mot-empexc-list-button">
                        <Button type="primary" className="mot-empexc-button" style={{width:'100%'}} onClick={this.finish.bind(this,currentRecords[1]['evntId'])}>办结</Button>
                      </div>
                    </Fragment>
                )
                } 
              </div>
              <div className="mot-empexc-list" style={{marginLeft:'5%'}}>
                {
                  currentRecords[2]==null
                  ?
                  (<Empty style={{marginTop:'20%'}}></Empty>)
                  :
                  (
                    <Fragment>
                      {
                            currentRecords[2]['impt']==='3'?(
                              <div style={{width:'100%',float: 'left'}}>
                              <div className="mot-empexc-tag">
                                {currentRecords[2]['imptNm']}
                              </div>
                              </div>
                            ):(
                              <div style={{width:'100%',float: 'left'}}>
                              <div className="mot-empexc-tag-blue">
                                {currentRecords[2]['imptNm']}
                              </div>
                              </div>
                            )
                      }
                      <Tooltip placement="bottom" title={currentRecords[2]['evntNm']}>
                      <div className="mot-empexc-list-title">
                        {currentRecords[2]['evntNm']}
                      </div>
                      </Tooltip>
                      <div className="mot-empexc-list-count">
                        {currentRecords[2]['taskNm']}
                      </div>
                      <div className="mot-empexc-list-rws">
                        任务数
                      </div>
                      <div className="mot-empexc-list-button">
                        <Button type="primary" className="mot-empexc-button" style={{width:'100%'}} onClick={this.finish.bind(this,currentRecords[2]['evntId'])}>办结</Button>
                      </div>
                    </Fragment>
                )
                } 
              </div>
            </div>
            <Button onClick={this.nextPage} className="mot-empexc-next-button">
              <Icon type="right" style={{color:'white',fontSize:'30px',marginLeft:'-5px'}}></Icon>
            </Button>
          </div>
          <BasicModal {...modalProps}>
            <MonthTaskListDetail evntId={evntId} ddyf={ddyf} handleCancel={this.handleCancel}></MonthTaskListDetail>
          </BasicModal>
      </Fragment>
    );
  }
}

export default MonthTaskList;
