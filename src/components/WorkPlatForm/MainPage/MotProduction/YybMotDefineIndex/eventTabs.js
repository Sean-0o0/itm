import React, { Fragment } from 'react';
import { Row, Col, message } from 'antd';

// 引入请求路径的示例
// import { FetchMotSameBatchList } from '../../../../../services/motProduction';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
import TreeUtils from '../../../../../utils/treeUtils';

import { FetchuserAuthorityDepartment, FetchqueryMotEventTree } from '../../../../../services/motProduction';
import { FetchSysCommonTable } from '../../../../../services/sysCommon';


class EventTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yybId: '1', // 营业部ID
      keyWord: '', // 关键字搜索
      // tgtTp: '',//选中的面板  即 目标类型
      leftListData: [], // 左侧事件列表
      leftPanelList: [], // 左侧阶段列表数据
      selectedMotId: '', // 选择的MOT事件的ID

    };
  }

  componentWillMount() {


  }

  componentDidMount() {
    if (this.props.dictionary.length !== 0) {
      new Promise((resolve) => {
      // this.getTabsDicts(this.props.dictionary);
        this.fetchYybData();
        resolve(true);
      }).then(() => {
        this.fetLeftListData();
        this.fetchPanelList();
      });
    }
  }

  componentWillReceiveProps(nextPreps) {
    if (nextPreps.dictionary !== this.props.dictionary) {
      new Promise((resolve) => {
        // this.getTabsDicts(nextPreps.dictionary);
        this.fetchYybData();
        resolve(true);
      }).then(() => {
        this.fetLeftListData();
        this.fetchPanelList();
      });
    }
  }


    // 获取营业部 构造树形数据
    fetchYybData = () => {
      FetchuserAuthorityDepartment().then((res) => {
        const { records = [], code = 0 } = res;
        if (code > 0) {
          const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'value' }, true);
          const tmpl = [];
          datas.forEach((item) => {
            const { children } = item;
            tmpl.push(...children);
          });

          this.setState({
            yybData: tmpl, // 树形结构
            yybId: records[0].yybid,
            yybList: records, // list
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }


    // 获取列表的阶段数据
    fetchPanelList = () => {
      const { tgtTp = '1' } = this.state;
      const condition = {
        dic_cl: 'MOT_SBRD_STG',
        tgt_tp: tgtTp,
      };
      const payload = {
        condition: condition,
        objectName: 'TMOT_DIC',
      };
      console.log(payload)
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
      const { tgtTp } = this.props;
      const { yybId, keyWord } = this.state;
      const payload = {
        keyword: keyWord,
        orgId: yybId,
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

    // 营业部改变
    onYybChange = (yyb) => {
      this.setState({
        yybId: Number(yyb),
      }, () => {
        this.fetLeftListData();
      });
    }


    // 点击选择mot事件
    onMotClick = (motId) => {
      this.setState({
        selectedMotId: motId,
      });
    }

    // 获取tab栏分类字典数据  目标类型
    // getTabsDicts = (dictionary = {}) => {
    //     // 目标类型

    //     const { [getDictKey('MOT_TGT_TP')]: tgtTpDicts = [] } = dictionary;
    //     if (tgtTpDicts.length > 0) {
    //         this.setState({
    //             tgtTp: tgtTpDicts[0].ibm,
    //             tgtTpNote: tgtTpDicts[0].note,
    //             tgtTpDicts,
    //         })
    //     }

    // }

    render() {
      const { leftListData = [], yybData = [], leftPanelList = [], selectedMotId = '', yybId = '', yybList = [] } = this.state;
      const { dictionary = {}, tgtTp } = this.props;

      return (
        <Fragment>
          <Row className="mot-prod-scrollbar" style={{ height: '100%', overflow: 'auto' }}>
            <Col xs={6} sm={6} md={6} lg={6} xl={6} style={{ height: '700px', borderRight: '1px solid #E3E3E3', overflowY: 'auto', backgroundColor: '#FFF' }}>
              <LeftContent selectedMotId={selectedMotId} leftListData={leftListData} leftPanelList={leftPanelList} dictionary={dictionary} onMotClick={this.onMotClick} onTabsChange={this.onTabsChange} yybData={yybData} onkeyWordSearch={this.onkeyWordSearch} onYybChange={this.onYybChange} />
            </Col>
            <Col xs={18} sm={18} md={18} lg={18} xl={18} style={{ height: '700px' }}>
              <RightContent yybList={yybList} selectedMotId={selectedMotId} yybId={yybId} leftListData={leftListData} leftPanelList={leftPanelList} tgtTp={tgtTp} dictionary={dictionary} fetLeftListData={this.fetLeftListData} />
            </Col>
          </Row>

        </Fragment >
      );
    }
}

export default EventTabs;
// export default connect(({ global }) => ({
//     dictionary: global.dictionary,
// }))(YybMotDefineIndex);
