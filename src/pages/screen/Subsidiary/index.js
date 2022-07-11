import React from 'react';
import { message } from 'antd';
import { FetchQueryBranUserSettings, FetchQueryBranSetting } from '../../../services/largescreen';
import { FetchObjectQuery } from '../../../services/sysCommon/index';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import Subsidiary from '../../../components/LargeScreen/Subsidiary';

class SubsidiaryPage extends React.Component {
  state = {
    data: [],
    subId: '',
    subsidiary: [],
    display: []
  };

  componentDidMount() {
    this.fetchSubsidiary();
  }

  fetchSubsidiary = async () => {
    const res = await FetchObjectQuery({
      cols: "ID,Name",
      current: 1,
      cxtj: "orgcgy=1",
      pageSize: 1000,
      paging: 1,
      serviceid: "lborganization",
      sort: "",
      total: -1
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    }) || {};
    const { data = [] } = res;
    const [first = { ID: '', NAME: '-' },] = data;
    this.fetchOrder(first.ID);
    this.fetchDisplay(first.ID);
    this.setState({
      subsidiary: data,
      subId: first.ID
    })
  }

  fetchOrder = (value, type = 1, reset, showPosition) => {
    if(type === 3){
      this.fetchDisplay(value)
    }
    FetchQueryBranSetting({
      bran: value,
    })
      .then((ret = {}) => {
        const { code = 0, records = [] } = ret;
        if (code > 0) {
          if (type === 1) {
            this.setState({
              data: records,
              subId: value,
            })
          } else if (type === 2) {
            this.setState({
              data: records,
              subId: value,
            }, () => {
              reset();
            })
          } else if (type === 3) {
            this.setState({
              data: records,
              subId: value,
            }, () => {
              reset();
              showPosition()
            })
          }

        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  }

  fetchDisplay = (value) => {
    FetchQueryBranUserSettings({
      bran: value,
    })
      .then((res = {}) => {
        const { code = 0, data = [] } = res;
        if (code > 0) {
          const [first = { SETTINGS: '-' },] = data;
          
          this.setState({
            display: first.SETTINGS.split(';'),
          })
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  }

  render() {
    const { data,
      subId,
      subsidiary,
      display } = this.state;
    const title = '福州分公司运营业务监控';

    return (
      <div className="xy-body">
        <div className="flex-c page-wrap">
          <PageHeader fetchOrder={this.fetchOrder} data={data} subId={subId} subsidiary={subsidiary} title={title} isPosition={true} />
          <Subsidiary display={display}/>
          <PageFooter />
        </div>
      </div>
    );
  }
}

export default SubsidiaryPage;