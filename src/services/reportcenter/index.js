import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { reportcenter: {
 reportTemplateInfo, reportTemplateSetting } } = api;

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
