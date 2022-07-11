import React, { Fragment } from 'react';
import { Row, Col, message } from 'antd';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
import { FetchuserAuthorityDepartment, FetchqueryMotEventTree, FetchqueryStaffInfo } from '../../../../../services/motProduction';
import { FetchSysCommonTable } from '../../../../../services/sysCommon';


// 员工定义事件
class RyMotDefineIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyWord: '', // 关键字搜索
      leftListData: [], // 左侧事件列表
      leftPanelList: [], // 左侧阶段列表数据
      selectedMotId: '', // 选择的MOT事件的ID
      tgtTp: '1', // 目标类型  默认为1 写死
      userInfo: '', // 登陆用户基本信息  数据比globle完善
    };
  }


  componentDidMount() {
    this.fetchUserInfo();
    this.fetchYybData();
    // this.test()

    // this.fetLeftListData();
    // this.fetchPanelList();
  }

    // test = async () => {
    //     const result = await FetchqueryStaffInfo();
    //     const { code = 0, records = [] } = result;
    //     this.setState({
    //         userInfo: records[0] ? records[0] : ''
    //     }, () => {
    //         this.fetLeftListData();
    //         this.fetchPanelList();
    //         this.fetchYybData();

    //     })
    // }

    // 获取营业部
    fetchYybData = () => {
      FetchuserAuthorityDepartment().then((res) => {
        const { records = [], code = 0 } = res;
        if (code > 0) {
          this.setState({
            yybList: records, // list
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    // 获取登陆人员的基本信息
    fetchUserInfo = () => {
      FetchqueryStaffInfo({}).then((res) => {
        const { code = 0, records = [] } = res;
        if (code > 0) {
          this.setState({
            userInfo: records[0] ? records[0] : '',
          }, () => {
            this.fetLeftListData();
            this.fetchPanelList();
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    // 点击选择mot事件
    onMotClick = (motId) => {
      this.setState({
        selectedMotId: motId,
      });
    }

    // 获取列表的阶段数据
    fetchPanelList = () => {
      const condition = {
        dic_cl: 'MOT_SBRD_STG',
        tgt_tp: '1',
      };
      const payload = {
        condition: condition,
        objectName: 'TMOT_DIC',
      };
      FetchSysCommonTable(payload).then((res) => {
        const { code = 0, records = [] } = res;
        if (code > 0) {
          this.setState({
            leftPanelList: records,
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    // 获取左侧列表数据
    fetLeftListData = () => {
      const { keyWord, tgtTp, userInfo } = this.state;

      const payload = {
        keyword: keyWord,
        orgId: userInfo ? userInfo.orgid : '',
        tgtTp,
      };
      FetchqueryMotEventTree(payload).then((res) => {
        const { code = 0, records = [] } = res;
        if (code > 0) {
          this.setState({
            leftListData: records,
            // 默认选中下标为0的mot事件
            selectedMotId: records.length > 0 ? records[0].evntId : '',
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    // 输入框关键字搜索
    onkeyWordSearch = (keyWord) => {
      this.setState({
        keyWord,
      }, () => {
        this.fetLeftListData();
      });
    }


    render() {
      const { leftListData = [], leftPanelList = [], selectedMotId, tgtTp = '', yybList = [], userInfo } = this.state;
      const { dictionary = {} } = this.props;
      return (
        <Fragment>
          {/* 员工定义事件 */}
          <Row className="mot-prod-scrollbar" style={{ height: '100%', padding: '1rem' }}>
            <Col xs={6} sm={6} md={6} lg={6} xl={6} style={{ backgroundColor: '#FFF' }}>
              <LeftContent selectedMotId={selectedMotId} leftPanelList={leftPanelList} leftListData={leftListData} onMotClick={this.onMotClick} dictionary={dictionary} onkeyWordSearch={this.onkeyWordSearch} />
            </Col>
            <Col xs={18} sm={18} md={18} lg={18} xl={18} >
              <RightContent tgtTp={tgtTp} selectedMotId={selectedMotId} dictionary={dictionary} userInfo={userInfo} yybList={yybList} leftPanelList={leftPanelList} />
            </Col>
          </Row>

        </Fragment>
      );
    }
}

// export default connect(({ motEvent, global }) => ({
//     dictionary: global.dictionary,
//     authorities: global.authorities,
// }))(RyMotDefineIndex);
export default RyMotDefineIndex;
