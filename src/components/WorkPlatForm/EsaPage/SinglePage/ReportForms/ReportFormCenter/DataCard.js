import React from 'react';
import { Col, Card, Tag, message, Modal } from 'antd';
import { Link } from 'dva/router';
import { EncryptBase64 } from '../../../../../components/Common/Encrypt';
import { FetchCreateUpdateReports } from '../../../../../services/reportcenter';

class DataCard extends React.Component {
  // 删除报表返回成功后，再次查询报表列表
  handleDelete = (id) => {
    const { fetchDatas } = this.props;
    Modal.confirm({
      content: '是否确认删除?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        FetchCreateUpdateReports({
          bbid: id,
          czfs: '3',
        }).then(() => { message.success('删除成功'); fetchDatas(); }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
      },
      onCancel() {
      },
    });
  }

  render() {
    /*
    repoNM--报表名称
    idxNum--指标数
    idxName--指标名称
    id--报表id
    */
    const { repoNm, idxNum, idxName, id, dataGran } = this.props;
    const nameArray = idxName.split(',');
    return (
      <Col sm={24} md={12} lg={6} xl={6}>
        <Card className="m-card-report" >
          <Card.Meta
            title={
              <div className="dis-fx">
                <div className="flex m-report-title">{ repoNm.length > 12 ? `${repoNm.slice(0, 12)}...` : repoNm }</div>
                <Link to={`/report/reportFormsDetail/${EncryptBase64(id)}`} className="m-blue-link m-report-link" target="_blank"><i className="iconfont icon-yuedu" />预览</Link>
                <span>&nbsp;</span>
                <span className="red iconfont icon-del1" style={{ fontSize: '1.086rem', marginLeft: '.2rem' }} onClick={() => { this.handleDelete(id); }} />
              </div>
             }
            description={
              <div>
                <div className="m-report-info">
                  <div className="m-report-info">
                    <span>类型</span>
                    <span style={{ float: 'right' }}>报表指标（个）</span>
                  </div>
                  <div >
                    <span style={{ height: '36.8px', display: 'inline-block' }}>
                      {
                        (() => {
                          let dataGranNm;
                          if (dataGran === '1') {
                            dataGranNm = '客户指标统计';
                          } else if (dataGran === '2') {
                            dataGranNm = '客户月度交易统计';
                          } else if (dataGran === '3') {
                            dataGranNm = '人员薪酬表单';
                          } else {
                            dataGranNm = '--';
                          }
                          return (<span >{dataGranNm}</span>);
                         })()
                      }
                    </span>
                    <span style={{ float: 'right' }} className="m-num red">{ idxNum }</span>
                  </div>
                </div>
                <div className="m-report-bottom">
                  <ul className="m-report-list">
                    {
                        nameArray.map((item, index) => {
                            if (index === 14) {
                              return (<li><span>.....</span></li>);
                            }
                            if (index > 14) {
                              return null;
                            }
                            return (<li key={index} ><Tag className="m-report-tag ant-tag" >{item}</Tag></li>);
                        })
                    }
                  </ul>
                </div>
              </div>
            }
          />
        </Card>
      </Col>
    );
  }
}
export default DataCard;
