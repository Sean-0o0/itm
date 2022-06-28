/* eslint-disable react/sort-comp */
/* eslint-disable react/jsx-indent */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Radio, DatePicker, message, Button } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import SalesDepartmentModal from '../../../../../components/WorkPlatForm/EsaPage/Common/SalesDepartmentModal';
import AssessmentProgramModal from '../../../../../components/WorkPlatForm/EsaPage/SinglePage/GradeAssessmentPlanConfig/AssessmentProgramModal';
import AssessmentLevelModal from '../../../../../components/WorkPlatForm/EsaPage/SinglePage/GradeAssessmentPlanConfig/AssessmentLevelModal';
import AssessmentCriteria from '../../../../../components/WorkPlatForm/EsaPage/SinglePage/GradeAssessmentPlanConfig/AssessmentCriteria';
import CommonSelect from '../../../../../components/Common/Form/Select';
import { getDictKey } from '../../../../../utils/dictUtils';
import { FetchQueryListLevelProgram, FetchQueryInfoProgramSeqGet, FetchQueryInfoLevelProgramFmla, FetchOperateLevelAssessmentPlan } from '../../../../../services/EsaServices/gradeAssessment';
import { fetchUserAuthorityDepartment } from '../../../../../services/commonbase/userAuthorityDepartment';

/**
 * 级别
 */

class GradeAssessmentPlanConfig extends React.Component {
    state = {
      isModify:false,//是否是修改 新增：false 修改：true
      formData: {}, // 表单数据
      orgModalVisible: false, // 营业部弹框
      assessPlanModalVisible: false, // 考核方案弹框
      assessLvModalVisible: false, // 考核级别弹框
      deptList:[],
    }
    componentWillMount = () => {
    }
    componentDidMount = () => {
      const { match = {} } = this.props;
      const { params } = match.params;
      const paramJson = JSON.parse(decodeURIComponent(params));
      const { czlx, id } = paramJson;
      if (czlx === 2 && typeof (id) !== 'undefined') {
        this.queryListLevelProgram(id);
        this.setState({ isModify: true });
      } else {
        this.fetchDeptList();
      }
    }
    fetchDeptList=() => {
      fetchUserAuthorityDepartment({}).then((res) => {
        const { note, code, records = [] } = res;
        if (code > 0) {
          this.setState({ deptList: records });
          const { match = {}, form:{setFieldsValue } } = this.props;
          const { params } = match.params;
          const paramJson = JSON.parse(decodeURIComponent(params));
          const { czlx, orgid } = paramJson;
          let orgname = '';
          if (czlx === 1 && records) {
            const newdeptList = records.filter(item => Number(item.yybid) === orgid)
            if (newdeptList.length > 0) {
              orgname = newdeptList[0].yybmc;
              setFieldsValue({ orgName: orgname });
              const orgId = orgid;
              const orgName = orgname;
              const { formData = {} } = this.state;
              const tmplFormData = { ...formData, orgId, orgName };
              this.setState({
                formData: tmplFormData,
              });
            }
          }
        } else {
          message.error(note);
        }
      }).catch((e) => {
        message.error(!e.success ? e.message : e.note);
      });
    }
    // 查询考核级别方案数据
    queryListLevelProgram = (id) => {
      const params = {
        current: 1,
        examClass: '',
        id,
        orgNo: '',
        pageSize: 10,
        paging: 1,
        rankType: 0,
        sort: '',
        total: -1,
      };
      FetchQueryListLevelProgram(params).then((res) => {
        const { code = 0, records = [] } = res;
        if (code > 0) {
          if (records !== '') {
            const formData = records[0];
            for (let i = 1; i <= 6; i++) {
              if (typeof (formData[`examStd${i}`]) === 'undefined' || formData[`examStd${i}`] === '') {
                formData[`examStd${i}`] = '';
              }
            }
            this.queryInfoLevelProgramFmla(formData);
            const { setFieldsValue } = this.props.form;
            // 未使用getFieldDecorator包裹的表单值在modal弹出之后丢失
            setFieldsValue({ orgName: records[0].orgName, className: records[0].className, levelName: records[0].levelName, area: records[0].area });
          }
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    // 查询考核方案顺序
    queryInfoProgramSeq = () => {
      const { formData } = this.state;
      const params = {
        area: formData.area,
        examLevel: formData.examLevel,
        orgNo: formData.orgId,
        rankType: formData.rankType,
      };
      FetchQueryInfoProgramSeqGet(params).then((res) => {
        const { code = 0, records = [] } = res;
        if (code > 0) {
          if (records !== '') {
            const { examSeq = '' } = records[0];
            this.setState({
              formData: { ...formData, examSeq },
            });
          }
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    // 考核级别公式查询
    queryInfoLevelProgramFmla = (formData) => {
      FetchQueryInfoLevelProgramFmla(formData).then((res) => {
        const { code = 0, records = [] } = res;
        if (code > 0) {
          if (records !== []) {
            const { examFmla = '', fmlaDesc = '' } = records[0];
            this.setState({
              // 微服务接口出参名写错了待更改
              formData: { ...formData, examFmla, fmlaDesc },
            });
          }
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
    onCancelBtn = () => {
      const { onCancelOperate } = this.props;
      if (onCancelOperate) {
        onCancelOperate();
      }
    }
    // 表单提交
    submit = () => {
      const { match = {} } = this.props;
      const { params: params1 } = match.params;
      const paramJson = JSON.parse(decodeURIComponent(params1));
      const { czlx, id } = paramJson;
      const { formData = {}, isModify } = this.state;
      const { getFieldsValue, getFieldValue, setFieldsValue } = this.props.form;
      const { examPeroid: examPeroidMoment = '' } = getFieldsValue(['examPeroid']);
      const examPeroid = moment(examPeroidMoment).format('MM');
      const oprType = czlx;
      if(getFieldValue('area') != null && isModify){
        setFieldsValue({ area: formData.area });
      }
      const params = {
        ...formData,
        oprType,
        orgNo: formData.orgId,
        area: getFieldValue('area') ? Number(getFieldValue('area')) : null,
        examPeroid,
        versionId : czlx === 1 ? id : ''
      };
      FetchOperateLevelAssessmentPlan(params).then((res) => {
        const { code = 0, note } = res;
        if (code > 0) {
          message.success(note);
          const { onSubmitOperate } = this.props;
          if (onSubmitOperate) {
            onSubmitOperate();
          }
        } else {
          message.error(note);
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    // 表单校验
    validateForm=() => {
      const { validateFieldsAndScroll } = this.props.form;
      validateFieldsAndScroll(null, { scroll: { offsetTop: 80 } }, (err) => {
        if (!err) {
          this.submit();
        }
      });
    }

    //  打开营业部弹出框
    openOrgModal = () => {
      this.setState({ orgModalVisible: true });
    }
    // 营业部弹框取消
    onOrgCancel = () => {
      this.setState({ orgModalVisible: false });
    }
    // 营业部弹框确认
    onOrgOk = (selectOrg) => {
      if (typeof (selectOrg) !== 'undefined') {
        const { title: orgName = '', key: orgId = '' } = selectOrg;
        const { setFieldsValue } = this.props.form;
        // 未使用getFieldDecorator包裹的表单值在modal弹出之后丢失
        setFieldsValue({ orgName, className: '', levelName: '' });
        const { formData = {} } = this.state;
        const tmplFormData = { ...formData, orgId, orgName };
        this.setState({
          formData: tmplFormData,
        });
        this.onOrgCancel();
      } else {
        message.error('请选择营业部');
      }
    }

    //营业部初始化
  handledeptList = (item) => {
    const {  match = {}  } = this.props;
      const { params } = match.params;
    const paramJson = JSON.parse(decodeURIComponent(params));
    const { czlx } = paramJson;
    if (!this.state.isModify && czlx !== 1) {
      const { setFieldsValue } = this.props.form;
      // 未使用getFieldDecorator包裹的表单值在modal弹出之后丢失
      setFieldsValue({ orgName: item.yybmc });
      const orgId = item.yybid;
      const orgName = item.yybmc;
      const { formData = {} } = this.state;
      const tmplFormData = { ...formData, orgId, orgName };
      this.setState({
        formData: tmplFormData,
      });
    }
  }

    //  打开考核方案弹框
    openAssessPlanModal = () => {
      this.setState({ assessPlanModalVisible: true });
    }
    // 考核方案弹框取消
    onAssessPlanCancel = () => {
      this.setState({ assessPlanModalVisible: false });
    }
    // 考核方案弹框确认
    onAssessPlanOk = (tmplSelectPlan) => {
      const selectPlan = tmplSelectPlan;
      if (typeof (selectPlan) !== 'undefined') {
        delete selectPlan.id; // 删除返回的方案id
        const { setFieldsValue } = this.props.form;
        const { className = '' } = selectPlan;
        setFieldsValue({ className, levelName: '' });
        const { formData = {} } = this.state;
        const tmplFormData = { ...formData, ...selectPlan };
        // 清空考核标准值
        for (let i = 1; i <= 6; i++) {
          if(tmplFormData[`indi${i}`]) {
            tmplFormData[`examStd${i}`] = '0';
          } else {
            tmplFormData[`examStd${i}`] = '';
          }
        }
        this.setState({
          formData: tmplFormData,
        }, () => { this.queryInfoLevelProgramFmla(tmplFormData); });
        this.onAssessPlanCancel();
      } else {
        message.error('请选择考核方案');
      }
    }


    // 打开考核级别弹框
    openAssessLvModal = () => {
      this.setState({ assessLvModalVisible: true });
    }
    // 考核级别弹框取消
    onAssessLvCancel = () => {
      this.setState({ assessLvModalVisible: false });
    }
    // 考核级别弹框确认
    onAssessLvOk = (selectLevel) => {
      if (typeof (selectLevel) !== 'undefined') {
        const { setFieldsValue } = this.props.form;
        const { LEVEL_NAME: levelName = '', ID: examLevel = '' } = selectLevel;
        const { formData = {} } = this.state;
        const tmplFormData = { ...formData, levelName, examLevel };
        this.setState({
          formData: tmplFormData,
        }, () => { this.queryInfoProgramSeq(); });
        // this.queryInfoProgramSeq();
        setFieldsValue({ levelName });
        this.onAssessLvCancel();
      } else {
        message.error('请选择考核级别');
      }
    }

    // 设置考核标准值
    handleExamStd = (value = '', index = '') => {
      const { formData = {} } = this.state;
      if (value !== '' && index !== '' && formData[`examStd${index}`] !== value) {
        // 规范'0.'这样的数字
        formData[`examStd${index}`] = value;
        this.setState({
          formData,
        }, () => { this.queryInfoLevelProgramFmla(formData); });
      }
    }

    // 渲染考核标准（考核标准最多为6个，数据结构固定6个,为空不渲染
    renderIndix = () => {
      const { dictionary = {} } = this.props;
      const logiTypeDic = dictionary.LOGI_TYPEID || []; // 逻辑运算符字典
      const relaTypeDic = dictionary.RELA_TYPEID || []; // 关系运算符字典
      const { formData = {} } = this.state;
      const Indixhtml = [];
      for (let i = 1; i <= 6; i++) {
        if (typeof (formData[`indi${i}`]) !== 'undefined' && formData[`indi${i}`] !== '') {
          Indixhtml.push(<AssessmentCriteria
            logiTypeDic={logiTypeDic}
            relaTypeDic={relaTypeDic}
            formData={formData}
            handleExamStd={this.handleExamStd}
            index={i}
            key={i}
          />);
        } else {
          break;
        }
      }
      return Indixhtml;
    }

    // 适用地区改变重新获取考核顺序
    onAreaChange = (value) => {
      const { formData = {} } = this.state;
      const area = value;
      const { levelName, className, examLevel } = formData;
      if (levelName && className) {
        const tmplFormData = { ...formData, levelName, examLevel, area };
        this.setState({
          formData: tmplFormData,
        }, () => { this.queryInfoProgramSeq(); });
      } else {
        const tmplFormData = { ...formData, area };
        this.setState({
          formData: tmplFormData,
        })
      }
    }

    render() {
      const { formData, orgModalVisible, assessPlanModalVisible, assessLvModalVisible, deptList = [] } = this.state;
      const { dictionary = {}, match = {}  } = this.props;
      const { params } = match.params;
      const paramJson = JSON.parse(decodeURIComponent(params));
      const { czlx, id } = paramJson;
      const { getFieldDecorator, getFieldsValue } = this.props.form;
      const { examClass = '' } = formData;
      const { className = '', levelName = '' } = getFieldsValue(['className', 'levelName']);
      const areaDic = dictionary[getDictKey('AREA_CLASS')] || [];
      const areaData = [];
      areaDic.forEach((item) => {
        areaData.push({
          value: item.ibm,
          label: item.note,
        });
      });
      return (
        <Fragment>
          <div style={{ width: '100%', height: '100%', overflowX: 'hidden', backgroundColor: '#fff', overflowY: 'auto', padding: '2rem 0' }}>
            <Form labelCol={{ span: 4 }} >
                <Form.Item label="营业部：" wrapperCol={{ span: 10 }}>
                  {
                    getFieldDecorator('orgName', {
                      initialValue: formData.orgName,
                        rules: [{
                        required: true,
                        message: '营业部不能为空',
                    }] })(<Input.Search
                      readOnly
                      disabled={czlx === 1 || this.state.isModify}
                      onSearch={this.openOrgModal}
                      onClick={this.openOrgModal}
                    />)
                  }
                </Form.Item>
               {/*  营业部选择弹框组件 */}
              <SalesDepartmentModal
                visible={orgModalVisible}
                handleOk={this.onOrgOk}
                onCancel={this.onOrgCancel}
                modalProps={{ bodyStyle: { height: '30rem', overflow: 'auto' } }}
                handledeptList={this.handledeptList}
              />

              {/* 适用地区，营业部为总部时出现 */}
              {
                this.state.formData.orgId === "1"?
                <Form.Item  wrapperCol={{ span: 10 }} label="适用地区"  >
                {
                  (getFieldDecorator('area', {
                    initialValue:formData.areaName
                  })(<CommonSelect style={{ width: '100%' }} datas={areaData} disabled={this.state.isModify} dropdownMatchSelectWidth allowClear showSearch optionFilterProp="children" onChange={this.onAreaChange} />)
                  )
                }
              </Form.Item> : ''
              }

              <Form.Item label="考核方案：" wrapperCol={{ span: 10 }}>
              {
                getFieldDecorator('className', {
                    initialValue: formData.className,
                    rules: [{
                        required: true,
                        message: '考核方案不能为空',
                }] })(<Input.Search
                  readOnly
                  disabled={this.state.isModify}
                  onSearch={this.openAssessPlanModal}
                  onClick={this.openAssessPlanModal}
                />)
              }
              </Form.Item>
                {/* 考核方案弹框组件 */}
               <AssessmentProgramModal
                 versionId={czlx === 1 ? id : ''}
                 visible={assessPlanModalVisible}
                 handleOk={this.onAssessPlanOk}
                 handleCancel={this.onAssessPlanCancel}
                 modalProps={{ bodyStyle: { height: '30rem', overflow: 'auto' } }}
                 orgId={formData.orgId}
               />
              {typeof (className) !== 'undefined' && className !== '' ? (
                  <Form.Item label="定级类型">
                    <Radio.Group disabled value={Number(formData.rankType) || 0}>
                      <Radio value={0}>维持</Radio>
                      <Radio value={1}>升级</Radio>
                    </Radio.Group>
                  </Form.Item>
              ) : ''}
              <Form.Item label="考核级别：" wrapperCol={{ span: 10 }}>
              {
                getFieldDecorator('levelName', {
                initialValue: formData.levelName,
                rules: [{
                    required: true,
                    message: '考核级别不能为空',
                }] })(<Input.Search
                  readOnly
                  disabled={this.state.isModify}
                  onClick={this.openAssessLvModal}
                  onSearch={this.openAssessLvModal}
                />)
              }
              </Form.Item>
              {/* 考核级别弹框组件 */}
              <AssessmentLevelModal
                visible={assessLvModalVisible}
                handleOk={this.onAssessLvOk}
                handleCancel={this.onAssessLvCancel}
                modalProps={{ bodyStyle: { height: '30rem', overflow: 'auto' } }}
                classId={examClass}
                className={className}
              />
              {typeof (levelName) !== 'undefined' && levelName !== '' ? (
              <Form.Item label="考核顺序：" >
                {formData.examSeq}
              </Form.Item>
              ) : ''}
              <Form.Item label="考核周期：" wrapperCol={{ span: 5 }}>
              {
                getFieldDecorator('examPeroid', {
                initialValue: formData.examPeroid ? moment(new Date(2020, Number(formData.examPeroid) - 1, 1)) : undefined,
                rules: [{
                  required: true,
                  message: '考核周期不能为空',
                }] })(<DatePicker.MonthPicker
                  disabled={this.state.isModify}
                  className="esa-monthpick-no-head"
                  format="MM"
                  getCalendarContainer={triggerNode => triggerNode.parentNode}
                  placeholder="选择月"
                />)
              }
              </Form.Item>
              {/* 指标渲染 */}
              { typeof (className) !== 'undefined' && className !== '' ? this.renderIndix() : ''}
              <Form.Item label="考核公式：" wrapperCol={{ span: 19 }}>
                <Input.TextArea rows={4} disabled value={typeof (className) !== 'undefined' && className !== '' ? formData.examFmla : ''} />
              </Form.Item>
              <Form.Item label="公式描述：" wrapperCol={{ span: 19 }} >
                <Input.TextArea rows={4} disabled value={typeof (className) !== 'undefined' && className !== '' ? formData.fmlaDesc : ''} />
              </Form.Item>
            </Form>
            <div className="tc">
              <Button type="primary" className="m-btn-radius m-btn-headColor" onClick={this.validateForm}>确 定</Button>
              <Button className="m-btn-radius m-btn-gray" onClick={this.onCancelBtn}>取 消</Button>
            </div>
          </div>
        </Fragment>
      );
    }
}
export default Form.create()(connect(({ global }) => ({
  dictionary: global.dictionary,
}))(GradeAssessmentPlanConfig));
