/* eslint-disable react/sort-comp */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Fragment } from 'react';
import { Row, Input, Tree, Switch, Button, message, Icon } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';
import AssessProject from './AssessProject';
import TreeUtils from '../../../../../../../utils/treeUtils';
import { FetchoperateExamineItem, FetchqueryListExamineItems } from '../../../../../../../services/EsaServices/commissionManagement';
/**
 * 左侧查询搜索组件
 */
class LeftSearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      operateAssessProjectTitle: '考核项管理', // 弹窗标题
      operateAssessProjectVisible: false, //  弹窗显示
      opTp: '', // 操作类型
      showType: false, // 是否显示简称
      assessmentList: [], // 考核项管理-考核项 原始数据列表
      assessmentTreeData: [], // 考核项管理-考核项 数据树
      selectedKeys: [], // 选中的节点
      selectItem: {}, // 选中的管理项

      expandedKeys: [], // 展开节点
      searchValue: '', // 搜索关键字
      autoExpandParent: true, // 搜索时自动展开父节点
    };
  }
  componentDidMount() {
    this.queryAllAssessmentProjectList();
  }

  queryAllAssessmentProjectList = () => {
    const payload = {
      "current": "",
      "itemClass": "",
      "itemNo": "",
      "keyWord": '',
      "pageSize": "",
      "paging": 0,
      "sort": "",
      "total": -1
    }
    FetchqueryListExamineItems({ ...payload }).then((response) => {
      const { records } = response;
      this.setState({
        assessmentList: records,
      }, () => { this.queryAssessmentProjectList(); });
    })
  }

  // 查询考核项数据
  queryAssessmentProjectList = () => {
    const { searchValue } = this.state;
    const payload = {
      "current": "",
      "itemClass": "",
      "itemNo": "",
      "keyWord": searchValue || '',
      "pageSize": "",
      "paging": 0,
      "sort": "",
      "total": -1
    }
    FetchqueryListExamineItems({ ...payload }).then((response) => {
      const { records } = response;
      let assessmentTreeData=[];
      const treeData = TreeUtils.toTreeData(records, { keyName: 'itemNo', pKeyName: 'prntItemNo', titleName: 'itemFullName' }, false);
      if([...treeData] !== undefined)
      {
        treeData.forEach((temp) => {
          const { children } = temp;
          assessmentTreeData.push(...children);
        });
      }
            // 默认选中第一项
      if (assessmentTreeData.length > 0) {
        this.handleNodeClick([assessmentTreeData[0].itemNo]);
      }
      // 默认展示前四级的树
      const expandedKeys = [];
      assessmentTreeData.forEach((item1) => {
        if (typeof (item1.children) !== 'undefined' && item1.children.length > 0) {
          expandedKeys.push(item1.itemNo);
          item1.children.forEach((item2) => {
            if (typeof (item2.children) !== 'undefined' && item2.children.length > 0) {
              expandedKeys.push(item2.itemNo);
              item2.children.forEach((item3) => {
                expandedKeys.push(item3.itemNo);
              });
            }
          });
        }
      });
      this.setState({
        assessmentTreeData,
        expandedKeys,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    // const records = [
    //   { itemAbbar: '考核项', itemClass: '1', itemClassName: '财务指标', itemFullname: '考核项', itemNo: '0001', prdType: '年', prdTypeId: '3', prntitemNo: '-1', remk: '测试', wthrFmla: '0' },
    //   { itemAbbar: '代买卖收入市占率得分', itemClass: '3', itemClassName: '市场排名及业务管理指标', itemFullname: '代买卖收入市占率得分', itemNo: 'DMMSRSZLDF', prdType: '年', prdTypeId: '3', prntitemNo: '0001', wthrFmla: '1' },
    //   { itemAbbar: '目标打折系数', itemClass: '3', itemClassName: '市场排名及业务管理指标', itemFullname: '代买卖收入市占率_目标打折系数', itemNo: 'DMMSR_MBDZXS', prdType: '年', prdTypeId: '3', prntitemNo: 'DMMSRSZLDF', wthrFmla: '0' },
    //   { itemAbbar: '代买卖收入市占率_目标值终值', itemClass: '3', itemClassName: '市场排名及业务管理指标', itemFullname: '代买卖收入市占率_目标值终值', itemNo: 'DMMSR_MBZZZ', prdType: '年', prdTypeId: '3', prntitemNo: 'DMMSRSZLDF', wthrFmla: '1' },
    //   { itemAbbar: '代买卖收入市占率得分2', itemClass: '32', itemClassName: '市场排名及业务管理指标2', itemFullname: '代买卖收入市占率得分2', itemNo: 'DMMSRSZLDF2', prdType: '年', prdTypeId: '3', prntitemNo: '0001', wthrFmla: '1' },
    // ];
  }

  /* ---------------------- 树形列表 ---------------------- */
  // 渲染树节点
  renderTree=(data) => {
    const { showType } = this.state;
    return data.map((item) => {
      if (!item.children) {
        return (
          <Tree.TreeNode
            className="esa-tree-list-node"
            title={showType ? item.itemFullName : item.itemAbbr}
            key={item.itemNo}
            icon={item.wthrFmla === '1' ? <i className="iconfont m-color icon-tip" style={{ fontSize: '1.5rem' }} /> : ''}
          />
        );
      }
      return (
        <Tree.TreeNode
          className="esa-tree-list-node esa-tree-havechild-node"
          title={showType ? item.itemFullName : item.itemAbbr}
          key={item.itemNo}
          icon={item.wthrFmla === '1' ? <i className="iconfont m-color icon-tip" style={{ fontSize: '1.5rem' }} /> : ''}
        >
          {this.renderTree(item.children)}
        </Tree.TreeNode>
      );
    });
  }

  // 选中节点
  handleNodeClick = (selectedKeys) => {
    const { assessmentList } = this.state;
    if (selectedKeys.length !== 0) {
      let selectItem = assessmentList.find(item => item.itemNo === selectedKeys[0]);
      selectItem.prntItmName= assessmentList.find(item => item.itemNo === selectItem.prntItemNo) !== undefined ? assessmentList.find(item => item.itemNo === selectItem.prntItemNo).itemFullName : '';
      this.setState({
        selectedKeys,
        selectItem,
      });
      if (this.props.handleSelectItem !== undefined) {
        this.props.handleSelectItem(selectedKeys[0]);
      }
    }
    else{
      this.setState({
        selectedKeys,
        selectItem:[]
      });
    }
  }

  // 改变搜索框的值
  ChangeKeyWord =(e) => {
    const { value } = e.target;
    // 重新获取数据构建树
    this.setState({
      searchValue: value,
      autoExpandParent: true,
    });
  }

  onSearch = () =>{
    this.queryAssessmentProjectList();
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  /* ----------------------操作按钮---------------------- */
  // 操作按钮渲染
  renderBtnGroup = () => {
    const btnGroup = [{ title: '新增', key: '1' }, { title: '修改', key: '2' }, { title: '删除', key: '3' }];
    return btnGroup.map((item) => {
      return (
        <Button className="m-btn-radius esa-btn-opacity-bg" onClick={() => this.operateBtnClick(item.key)} key={item.key}>{item.title} </Button>
      );
    });
  }
  // 点击操作按钮
  operateBtnClick = (opTp) => {
    const { selectedKeys } = this.state;
    if (selectedKeys.length === 0 && opTp !== '1') {
      message.warning('请选择要操作的节点');
    } else if (opTp === '1') {
      this.setState({
        operateAssessProjectTitle: '考核项 - 新增',
        operateAssessProjectVisible: true,
        opTp: '1',
      });
    } else if (opTp === '2') {
      this.setState({
        operateAssessProjectTitle: '考核项 - 修改',
        operateAssessProjectVisible: true,
        opTp: '2',
      });
    } else if (opTp === '3') {
      this.setState({
        operateAssessProjectTitle: '考核项 - 删除',
        operateAssessProjectVisible: true,
        opTp: '3',
      });
    }
  }

  /* ----------------------配置弹窗---------------------- */
  assembleModalProps = () => {
    const { operateAssessProjectTitle, operateAssessProjectVisible } = this.state;
    const modalProps = {
      width: '80%',
      title: operateAssessProjectTitle,
      style: { top: '2rem' },
      visible: operateAssessProjectVisible,
      destroyOnClose: true,
      onCancel: this.handleCancel,
      onOk: this.handleOk,
      footer: (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" onClick={this.handleOk} className="m-btn-radius m-btn-headColor ant-btn"><span>确定</span></button>
          <button type="button" onClick={this.handleCancel} className="m-btn-radius m-btn-headColor ant-btn"><span>取消</span></button>
        </div>
      ),
    };
    return modalProps;
  }

  // 弹窗确定
  handleOk = () => {
    const { validateFieldsAndScroll } = this.assessProject.props.form;
    const {opTp, selectItem={}} = this.state;
    let payload = {};
    validateFieldsAndScroll(null, { scroll: { offsetTop: 80 } }, (err, values) => {
      if (!err) {
        this.setState({
          operateAssessProjectVisible: false,
        });
        // 调用新增 接口 刷新列表数据
        let prntItem;
        if(opTp === 1){
          prntItem = selectItem.itemNo;
        }else{
          prntItem = selectItem.prntitemNo;
        }
        payload = {
          prdType: 3,
          oprType: opTp, // 1|新增;2|修改;3|删除
          itemAbbar: values.itemAbbar || selectItem.itemAbbr,
          itemClass: values.itemClass || selectItem.itemClass,
          itemFullname: values.itemFullName || selectItem.itemFullName,
          itemNo: values.itemNo || selectItem.itemNo,
          prntItemNo: opTp === "1"? selectItem.itemNo : selectItem.prntItemNo,
          remk: values.remk
        };
        this.submit(payload);

      }
    })
  }

  submit = async(payload) =>{
    await FetchoperateExamineItem({
      ...payload
    }).then((response) => {
      const { code, note } = response;
      if (code > 0) {
        message.success(note);
      }
      this.queryAssessmentProjectList();
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 关闭弹窗
  handleCancel =() => {
    this.setState({
      operateAssessProjectVisible: false,
    });
  }

  render() {
    const { showType, assessmentTreeData, selectItem, opTp, selectedKeys, expandedKeys, autoExpandParent } = this.state;
    return (
      <Fragment>
        {/* 搜索组件 */}
        <Row style={{ padding: '0 1.25rem', height: '3.5rem', lineHeight: '3.5rem', borderBottom: '1px solid #FAFAFA' }}>
          <div style={{ float: 'left', fontWeight: 'bold', fontSize: '1.333rem' }}>考核项</div>
          <div style={{ float: 'right' }}>
            {this.renderBtnGroup()}
          </div>
        </Row>
        <div style={{ padding: '1rem 2rem' }}>
          <Row style={{ paddingBottom: '1rem' }}>
            <Input.Search onChange={this.ChangeKeyWord} onSearch={this.onSearch} />
          </Row>
          <Row>
            <div >
              <Switch
                className="esa-switch-headColor"
                checkedChildren="显示全称"
                unCheckedChildren="显示简称"
                checked={showType}
                onChange={checked => this.setState({ showType: checked })}
              />
            </div>
          </Row>
          <Row>
            <Tree
              className="esa-tree-list"
              switcherIcon={<Icon className="m-color" style={{ fontSize: '15px' }} type="down-square" />}
              selectedKeys={selectedKeys}
              onSelect={this.handleNodeClick}
              onExpand={this.onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              showIcon
              checkStrictly
            >
              {this.renderTree(assessmentTreeData)}
            </Tree>
          </Row>
        </div>
        <BasicModal {...this.assembleModalProps()}>
          {/* eslint-disable-next-line no-return-assign */}
          <AssessProject handleCancel={this.handleCancel} wrappedComponentRef={ref => this.assessProject = ref} selectItem={selectItem} opTp={opTp} />
        </BasicModal>
      </Fragment>
    );
  }
}
export default LeftSearchComponent;
