/*
 * @Description: 考核须知
 * @Autor:
 * @Date: 2020-11-11 11:07:27
 */

import React, { Component,Fragment } from 'react';
import { ExclamationCircleOutlined } from 'antd';
import { Table,Tabs, Card } from 'antd';
class AssessmentNoticeBottom extends Component {





  render() {
    const { khList=[] } = this.props;
    const dataSource=[];
    const columns =[];
    var a ={key: '1',}

    for (var i=0;i<khList.length;i++){
      columns.push({title: '评价维度',
                    dataIndex: 'name'+i,
                    key: 'name'+i,
                    className:'tablehead'})
      columns.push({title: '考核评价内容',
                    dataIndex: 'content'+i,
                    key: 'content'+i,
                    className:'tablehead'
                  })


          a['name'+i]=khList[i].evalDis
          a['content'+i]=khList[i].evaCntnt

    }
    dataSource.push(a);
    //console.log(dataSource)
    return (
      <Fragment>
      <Card style={{ height: '100%', overflow: 'hidden auto' }} className="m-card">
      <div >
     <i class="iconfont icon-similarProduct" />   <span style={{color:'#333',fontSize:'1.166rem',fontWeight:'bold'}}>&nbsp;考核标准 </span>

      </div>
      <br>
      </br>

      <Table dataSource={dataSource} columns={columns} pagination={false} />
     </Card>
     </Fragment>
    );
  }
}

export default AssessmentNoticeBottom;
