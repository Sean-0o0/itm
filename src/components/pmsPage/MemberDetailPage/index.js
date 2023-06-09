import React, {Component} from 'react';
import TopConsole from './TopConsole'
import InfoTable from './InfoTable'
import {message, Spin} from 'antd'
import {
  FetchQueryOutsourceMemberDetail,
  QueryMemberDetailInfo,
  QueryOutsourceMemberList,
  QueryUserRole
} from '../../../services/pmsServices'
import BasicInfo from "./BasicInfo";
import AttendanceInfo from "./AttendanceInfo";

class MemberDetailPage extends Component {
  state = {
    ryid: -1,
    zyrole: '',
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
    this.queryRole();
  }

  componentWillReceiveProps(nextProps) {
    const {ryid} = nextProps
    if (this.props.ryid !== ryid) {
      this.setState({
        ryid
      }, () => {
        this.handleSearch(ryid);
        this.queryRole();
      })
    }
  }

  queryRole = () => {
    //获取用户角色
    const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
    QueryUserRole({
      userId: String(LOGIN_USER_INFO.id),
    })
      .then(res => {
        if (res?.code === 1) {
          const {zyrole = ''} = res;
          this.setState({
            zyrole,
          })
        }
      })
      .catch(e => {
        message.error('用户信息查询失败', 1);
        console.error('QueryUserRole', e);
      });
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
            jldata: jldata !== "" ? JSON.parse(jldata) : "",
            RYZT: ryxxdata[0]?.RYZTID,
            XMJLID: ryxxdata[0]?.XMJLID,
            XMJL: ryxxdata[0]?.XMJL,
            XTZH: ryxxdata[0]?.XTZH,
          }
          let basicData = {
            JL: ryxxdata[0]?.JL,
            XTZH: ryxxdata[0]?.XTZH,
            SYKH: ryxxdata[0]?.SYKH,
            RYZT: ryxxdata[0]?.RYZT
          }
          let kqxxData = {
            ryid: ryxxdata[0]?.RYID,
            xmid: ryxxdata[0]?.XMID,
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
      zyrole = "",
    } = this.state
    const {routes, ryid} = this.props
    console.log("routes={routes}", routes)
    return (
      <Spin spinning={tableLoading}>
        <div className="member-detail-box">
          <TopConsole
            routes={this.props.routes}
            data={ryxxData}
            ryid={ryid}
            zyrole={zyrole}
            refreshPages={this.refreshPages}
          />
          <AttendanceInfo routes={this.props.routes} data={kqxxData}/>
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
