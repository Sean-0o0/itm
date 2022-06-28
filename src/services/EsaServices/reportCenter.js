import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { esa: {
  optionalIndicators, reportInformation, createUpdateReports, editableReportList, queryReportInfo, queryReportStats, reportNavigation, reportTemplateInfo, reportTemplateSetting } } = api;

// 报表中心 --  查询可选指标
export async function FetchOptionalIndicators(payload) {
  const option = {
    url: optionalIndicators,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 报表中心 --  查询报表信息
export async function FetchReportInformation(payload) {
  const option = {
    url: reportInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 报表中心 --  创建/修改报表
export async function FetchCreateUpdateReports(payload) {
  const option = {
    url: createUpdateReports,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 报表中心 --  可编辑报表列表
export async function FetchEditableReportList(payload) {
  const option = {
    url: editableReportList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 报表中心 --  查询报表详情-客户
export async function FetchqueryReportInfo(payload) {
  const option = {
    url: queryReportInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 报表中心 --  查询报表详情-聚合
export async function FetchqueryReportStats(payload) {
  const option = {
    url: queryReportStats,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// 报表中心 --  报表导航数据
export async function FetchReportNavigation(payload) {
  const option = {
    url: reportNavigation,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询自定义报表配置
export async function FetchReportTemplateInfo(payload) {
  const option = {
    url: reportTemplateInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 自定义报表增删改
export async function FetchReportTemplateSetting(payload) {
  const option = {
    url: reportTemplateSetting,
    method: 'post',
    data: payload,
  };
  return request(option);
}
