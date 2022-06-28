import React, { Fragment } from 'react';
import { Row, Col, message } from 'antd';
import { connect } from 'dva';
import TreeUtils from '../../../../../utils/treeUtils';
import SearchAndListComponent from '../../../../../components/WorkPlatForm/PlanningPage/BudgetManage/BudgetProjectManage/SearchAndListComponent';
import BudgetProductDetail from '../../../../../components/WorkPlatForm/PlanningPage/BudgetManage/BudgetProjectManage/BudgetProductDetail';
import { FetchQueryListBudgetCode } from '../../../../../services/planning/budgetManagement';
import { FetchQueryOrgList } from '../../../../../services/planning/planning';
import { fetchObject } from '../../../../../services/sysCommon';
import { DecryptBase64 } from '../../../../../components/Common/Encrypt';

/*
 * 预算项目管理
 */

class BudgetProjectManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rightData: [], // 右侧预算代码详情
      leftList: [], // 左侧预算代码列表
      gxyybDatas: [], // 营业部数据
      initialOrgid: '', // 登陆用户初始营业部
      ryDatas: [], // 人员
      searchValue: '' // 搜索的值
    };
  }

  componentWillMount() {
    this.getinitialOrgid()
    this.fetchLeftList('', true);
    this.fetchYyb();
    this.fetchRyData();
  }

  // 获取右侧预算详情内容数据
  getRightData = (data) => {
    this.setState({
      rightData: data,
    });

    this.getinitialOrgid();
  }


  // 获取登陆用户的基本信息  设置初始营业部
  getinitialOrgid = () => {
    const { orgid } = this.props.userBasicInfo;
    this.setState({
      initialOrgid: orgid,
    });
  }

  // 查询营业部
  fetchYyb = () => {
    const payload = {
      current: 1,
      pageSize: 10,
      paging: 0,
      sort: '',
      total: -1,
      planType:2,
    };
    FetchQueryOrgList(payload).then((res) => {
      const { code = 0, records = [] } = res;
      if (code > 0) {
        const datas = TreeUtils.toTreeData(records, { keyName: 'orgId', pKeyName: 'fid', titleName: 'orgName', normalizeTitleName: 'title', normalizeKeyName: 'value' }, true);
        const tmpl = [];
        if (datas !== null && datas.length > 0) {
          datas.forEach((item) => {
            const { children } = item;
            tmpl.push(...children);
          });
          this.setState({ gxyybDatas: tmpl });
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 搜索预算名称
  updateXCMC = (value) => {
    this.fetchLeftList(value, true);
  }

  // 更新搜索值
  updateSearchValue = (searchValue) => {
    this.setState({ searchValue });
  }
  // 查询左侧预算列表

  fetchLeftList = (value, isFirst) => { // type:是否第一次加载
    const { match: { params: { versionData = '' } } } = this.props;
    const versionDataJson = versionData ? JSON.parse(DecryptBase64(versionData)) : {};
    const payload = {
      current: 1,
      pageSize: 10,
      paging: 0,
      payName: this.state.searchValue,
      sort: '',
      total: -1,
      version: versionDataJson.VersionId || versionDataJson.parentVersionId || '',
      st: versionDataJson.st || '',
    };
    FetchQueryListBudgetCode(payload).then((res) => {
      const { records = [], code = 0 } = res;
      if (code > 0 && isFirst) {
        this.setState({
          leftList: records,
        }, () => {
          if (isFirst) {
            let tempRightData = this.state.leftList.length > 0 ? this.state.leftList[0] : []; ;
            if(value){
              if(this.state.leftList.length > 0){
                for(const item of this.state.leftList){
                  if (value.payCodeId === item.id){
                    tempRightData = item;
                    break;
                  }
                }
              }
            }else{
              tempRightData = this.state.leftList.length > 0 ? this.state.leftList[0] : [];
            }
            this.getRightData(tempRightData);
            this.setState({
              rightData: tempRightData,
            });
          }
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 获取人员信息  livebos
  fetchRyData = () => {
    const { orgid } = this.props.userBasicInfo;
    const condition = {};
    if (orgid !== '1') {
      condition.org_id = orgid;
    }
    fetchObject('KHRY', { condition }).then((res) => {
      const { code = 0, records = [] } = res;
      if (code > 0 && records !== null && records.length > 0) {
        const tmpl = [];
        records.forEach((item) => {
          tmpl.push({
            value: item.ID,
            label: item.EMP_NAME,
            ...item,
          });
        });
        this.setState({
          ryDatas: tmpl,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { leftList = [], rightData = [], gxyybDatas = [], initialOrgid = '', ryDatas = [] } = this.state;
    const { dictionary, match: { params: { versionData = '' } } } = this.props;
    const versionDataJson = versionData ? JSON.parse(DecryptBase64(versionData)) : {};
    const version = versionDataJson.VersionId || versionDataJson.parentVersionId || '';
    const st = versionDataJson.st || '';
    return (
      <Fragment>
        <Row className="m-row-pay-cont esa-scrollbar " style={{ height: 'calc(100% - 1rem)', margin: '0.833rem 0 0' }} >
          <Col xs={24} sm={8} lg={6} className="h100" style={{ padding: "0 0 0 1.5rem" }} >
            {/* 左侧搜索以及预算项目列表 */}
            <SearchAndListComponent version={version} st={st} updateXCMC={this.updateXCMC} fetchLeftList={this.fetchLeftList} dictionary={dictionary} leftList={leftList} rightData={rightData} getRightData={this.getRightData} updateSearchValue={this.updateSearchValue} />
          </Col>
          <Col xs={24} sm={16} lg={18} className="h100">
            {/* 预算信息 */}
            <BudgetProductDetail version={version} st={st} ryDatas={ryDatas} dictionary={dictionary} fetchLeftList={this.fetchLeftList} rightData={rightData} gxyybDatas={gxyybDatas} initialOrgid={initialOrgid} />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
// export default BudgetProjectManage;
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(BudgetProjectManage);
