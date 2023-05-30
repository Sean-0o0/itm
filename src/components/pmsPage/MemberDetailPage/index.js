import React, {Component} from 'react';
import TopConsole from './TopConsole'
import InfoTable from './InfoTable'
import {message, Spin} from 'antd'
import {FetchQueryOutsourceMemberDetail, QueryMemberDetailInfo} from '../../../services/pmsServices'
import BasicInfo from "./BasicInfo";
import AttendanceInfo from "./AttendanceInfo";

class MemberDetailPage extends Component {
  state = {
    ryid: -1,
    ryxxData: [],
    basicData: [],
    kqxxData: [],
    ydkhData: [],
    tableLoading: false,
    pageParams: {
      pageSize: 10,
      current: 1,
      total: 20
    }
  }

  componentDidMount() {
    const {ryid} = this.props;
    this.setState({
      ryid
    })
    this.handleSearch(ryid)
  }

  componentWillReceiveProps(nextProps) {
    const {ryid} = nextProps
    this.setState({
      ryid
    })
  }

  handleSearch = (ryid) => {
    const {} = this.state
    this.setState({
      tableLoading: true,
    })
    let param = {}
    if (ryid) {
      param = {
        ryid
      }
    }
    FetchQueryOutsourceMemberDetail(param)
      .then((res = {}) => {
        const {
          code = 0,
          ryxx,
          kqxx,
          ydkh,
          jldata
        } = res;
        if (code > 0) {
          let ryxxdata = JSON.parse(ryxx)
          let kqxxdata = JSON.parse(kqxx)
          let ryxxData = {
            XB: ryxxdata[0]?.XB,
            GYSMC: ryxxdata[0]?.GYSMC,
            GYSID: ryxxdata[0]?.GYSID,
            RYMC: ryxxdata[0]?.RYMC,
            RYGW: ryxxdata[0]?.RYGW,
            GWID: ryxxdata[0]?.GWID,
            DJ: ryxxdata[0]?.RYDJ,
            DJID: ryxxdata[0]?.DJID,
            XMMC: ryxxdata[0]?.XMMC,
            XMID: ryxxdata[0]?.XMID,
            SYKH: ryxxdata[0]?.SYKH,
            SYKHID: ryxxdata[0]?.SYKHID,
            jldata: JSON.parse(jldata)
          }
          let basicData = {
            JL: ryxxdata[0]?.JL,
            XTZH: ryxxdata[0]?.XTZH,
            SYKH: ryxxdata[0]?.SYKH,
          }
          let kqxxData = {
            zc: kqxxdata.filter(item => item.LX === "正常").length,
            zcrq: kqxxdata.filter(item => item.LX === "正常"),
            qj: kqxxdata.filter(item => item.LX === "请假").length,
            qjrq: kqxxdata.filter(item => item.LX === "请假"),
            jb: kqxxdata.filter(item => item.LX === "加班").length,
            jbrq: kqxxdata.filter(item => item.LX === "加班"),
            yc: kqxxdata.filter(item => item.LX === "考勤异常").length,
            ycrq: kqxxdata.filter(item => item.LX === "考勤异常"),
          }
          console.log("kqxxDatakqxxData,", kqxxData)
          this.setState({
            ryxxData,
            basicData,
            kqxxData,
            ydkhData: [...JSON.parse(ydkh)],
            tableLoading: false,
          })
        } else {
          this.setState({
            tableLoading: false,
          })
        }
      }).catch((e) => {
      this.setState({
        tableLoading: false,
      })
      message.error(!e.success ? e.message : e.note);
    });
  }

  refreshPages = () => {
    const {ryid} = this.state;
    this.handleSearch(ryid)
  }

  render() {
    const {
      ryxxData = [],
      basicData = [],
      kqxxData = [],
      ydkhData = [],
      tableLoading = false,
      pageParams = {},
    } = this.state
    const {routes, ryid} = this.props
    let xmid = '-1'
    return (
      <Spin spinning={tableLoading}>
        <div className="member-detail-box">
          <TopConsole
            routes={routes}
            data={ryxxData}
            ryid={ryid}
            refreshPages={this.refreshPages}
          />
          <AttendanceInfo data={kqxxData}/>
          {
            ydkhData.length > 0 && <InfoTable ryid={ryid} pageParams={pageParams} tableData={ydkhData} routes={routes}/>
          }
          <BasicInfo ryid={ryid} data={basicData}/>
        </div>
      </Spin>
    );
  }
}

export default MemberDetailPage;
