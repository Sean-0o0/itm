// 字典别名的map(别名: 对应字典名称)
const dictionaryMap = {
  sf: 'SF', // 是否
  fwfs: 'FWFS', // 服务方式
  zhlx: 'ZHLX', // 账户类型
  khlx: 'PUB_KHLX', // 客户类型
  khzt: 'KHZT', // 客户状态
  customer_status: 'ECIF_KHZT', // 客户状态
  xb: 'XB', // 性别
  mz: 'MZ', // 民族
  xldm: 'XLDM', // 学历
  zzmm: 'ZZMM', // 政治面貌
  zjxy: 'ZJXY', // 宗教信仰
  gznx: 'ECIF_GZNX', // 工作年限
  hyfl: 'HYFL', // 行业分类
  zydm: 'ZYDM', // 职业代码
  qyxz: 'ECIF_QYXZ', // 企业性质
  zjlb: 'ZJLB', // 证件类别
  id_type: 'ZJLB', // 证件类别
  gjsx_zjlb: 'GJSX_ZJLB', // 高级筛选-证件类别
  khfs: 'KHFS', // 开户方式
  account_open_mode: 'KHFS', // 开户方式
  fxcsnl: 'FXCSNL', // 风险承受能力
  zhfxtz: 'FXCSNL', // 综合风险特征
  risk_tolerance_name: 'FXCSNL', // 风险承受能力
  risk_preference_name: 'FXCSNL', // 风险承受能力
  risk_characteristics_name: 'FXCSNL', // 风险承受能力
  mmfx: 'MMFX', // 买卖方向
  gjsx_mmfx: 'GJSX_MMFX',
  tjzq: 'TJZQ', // 统计周期
  mdrxx: 'MDRXX', // 免打扰信息
  no_disturb: 'MDRXX', // 免打扰信息
  zjlxfs: 'ZJLXFS', // 最近联系方式
  contact_preference: 'ZJLXFS', // 最近联系方式
  lxsj: 'LXSJ', // 联系时间
  contact_time_preference: 'LXSJ', // 联系时间
  hyzk: 'HYZK', // 婚姻状况
  khktywqx: 'ECIF_KTYWQX', // 客户开通业务权限
  open_business: 'ECIF_KTYWQX', // 客户开通业务权限
  available_open_business: 'ECIF_KTYWQX', // 客户开通业务权限
  lxzq: 'LXZQ', // 联系周期
  lxfs: 'LXFS', // 联系方式
  fxfl: 'FXFL', // 风险分类
  jsjb: 'JSJB', // 警示级别
  srtxlx: 'SRTXLX', // 生日提醒类型
  sfkt: 'SFKT', // 是否开通
  xydj: 'XY_XYDJ', // 信用等级
  credit_level: 'XY_XYDJ', // 信用等级
  xz: 'ECIF_XZ', // 星座
  srly: 'ECIF_SRLY', // 收入来源
  jrlzc: 'ECIF_JRLZC', // 金融类资产
  zqtzjy: 'ECIF_ZQTZJY', // 证券投资经验
  kskcscd: 'ECIF_KSKCSCD', // 亏损可容忍度
  cczq: 'ECIF_CCZQ', // 持仓周期
  fzqk: 'ECIF_FZQK', // 负责情况
  cpfxdj: 'PIF_FXDJ', // 产品风险等级
  cpxmlx: 'XMLX', // 项目类型
  cply: 'PIF_CPLY', // 产品来源
  cpsflb: 'CPCLLB', // 产品收费类别
  zffs: 'PIF_ZFFS', // 支付方式
  yhzkfs: 'PIF_YHZKFS', // 优惠折扣方式
  jhfwfs: 'CIS_JHFWFS', // 服务方式
  cpyqsyl: 'PIF_YQSYL', // 产品预期收益率
  rgqd: 'PIF_RGQD', // 认购起点
  cpsjlx: 'PIF_SJLX', // 产品事件类型
  gzsc: 'CIS_GZSC', // 工作时长
  rzlx: 'CIS_RZLX', // 日志类型
  jrcpzt: 'PIF_JRCPZT', // 金融产品状态
  motrwzt: 'CIS_MOTRWZT', // MOT任务状态
  motrwyq: 'RWYQ', // MOT任务要求
  sjdj: 'SJDJ', // 事件等级
  tzzsdxfl: 'SDX_TZZFL', // 投资者适当性分类
  investor_type_name: 'SDX_TZZFL', // 投资者适当性分类
  sdxtzpz: 'SDX_TZPZ', // 适当性投资品种
  pubsf: 'PUB_SF', // PUB_是否
  is_open_financial_account: 'PUB_SF', // 是否开通理财账户
  mdrxm: 'PUB_SF', // 免打扰
  wtfs: 'WTFS', // 委托方式
  qzkhly: 'ECIF_QZKHLY', // 客户来源字典(潜在客户)
  qzkhzt: 'ECIF_QZKHZT', // 开户状态字典(潜在客户)
  // zjjb: 'ECIF_ZJLB', // 证件类别(潜在客户,客户录入)
  ywqx: 'ECIF_YWQX', // 开通业务(二次开发)
  khgzkhlx: 'ECIF_KHGZ_KHLX', // 开户类型(开户跟踪)
  khgzkhzt: 'ECIF_KHGZ_KHZT', // 开户状态(开户跟踪)
  khgzhfzt: 'ECIF_KHGZ_HFZT', // 回访状态(开户跟踪)
  khgzgjzt: 'ECIF_KHGZ_GJZT', // 挂接状态(开户跟踪)
  fsqd: 'CIS_PSQD', // 发送渠道
  zhsx: 'ZHSX', // 账户属性
  zhzt: 'JJRZHZT', // 经纪人账户状态
  cykskm: 'CYKSKM', // 从业考试科目
  xxlb: 'CIS_XXLB', // 消息模板-信息类别
  gjsxfxqfxdj: 'GJSX_FXQFXDJ', // 高级筛选反洗钱风险等级
  gjsxsf: 'GJSX_SF', // 高级筛选-是否
  gjsx_khzt: 'GJSX_KHZT', // 高级筛选-客户状态
  gjsx_tjzq: 'GJSX_TJZQ', // 高级筛选-统计周期
  gjsx_tdlb: 'GJSX_TDLB', // 高级筛选-团队类型
  gjsx_cpfl: 'GJSX_CPFL', // 高级筛选-产品分类
  gjsx_sdx_tzzf: 'GJSX_SDX_TZZFL', // 高级筛选-投资者分类
  gjsx_fxcsnl: 'GJSX_FXCSNL', // 高级少选-风险承受能力
  gjsx_khlx: 'GJSX_KHLX', // 高级筛选-客户类型
  gjsx_khfs: 'GJSX_KHFS', // 高级筛选-开户方式
  gjsx_tzcp: 'GJSX_TZCP', // 高级筛选-投资产品
  gjsx_lxzq: 'GJSX_LXZQ', // 高级筛选-联系周期
  gjsx_zhlx: 'GJSX_ZHLX', // 高级筛选-账户类型
  gjsx_lxfs: 'GJSX_LXFS', // 高级筛选-联系方式
  gjsx_yxlxfs: 'GJSX_YXLXFS', // 高级筛选-联系方式
  gjsx_mdrxx: 'GJSX_MDRXX', // 高级筛选-免打扰
  gjsx_phlxfs: 'GJSX_PHLXFS', // 高级筛选-偏好联系方式
  gjsx_phlxsj: 'GJSX_LXSJ', // 高级筛选-偏好联系时间
  gjsx_sfkt: 'GJSX_SFKT', // 高级筛选选-是否开通
  gjsx_sxedlx: 'GJSX_SXEDLX', // 高级筛选选-受信额度类型
  gjsx_lryelx: 'GJSX_LRYELX', // 高级筛选选-两融余额类型
  hdlx: 'HDLX', // 填写服务记录,活动类型
  grnsr: 'ECIF_NSRZK', // 个人年收入
  grfzbl: 'GRFZBL', // 个人负债比例
  zjjypz: 'ZJJYPZ', // 最近三年的交易品牌
  xzcpyy: 'XZCPYY', // 选择产品的主要原因
  jtnsr: 'ECIF_JTNSR', // 家庭年收入
  jcgc: 'JTZCZC', // 资产构成
  fwzc: 'FWZC', // 房屋资产
  bz: 'BZ', // 币种
  zjfx: 'ZJFX', // 资金方向
  xsdq: 'CPXSDQ', // 产品销售地区
  hdywzt: 'ACM_HDYWZT', // 数字营销-活动运维状态
  hddyzt: 'HDDYZT', // 数字营销-活动运维状态
  hdfxzb: 'ACM_HDFXZB', // 数字营销-活动指标

  // HT整合 ---------------------------------------------
  tc_impt: 'TC_IMPT', // 任务中心-重要程度
  tc_task_st: 'TC_TASK_ST', // 任务中心-任务状态
  tc_cust_add_mode: 'TC_CUST_ADD_MODE', // 任务中心-客户添加方式
  tc_srvc_st: 'TC_SRVC_ST', // 任务中心-服务状态
  tc_rtn_st: 'TC_RTN_ST', // 数据填报任务-填报状态
  tc_rd_flg: 'TC_RD_FLG', // 任务中心标志
  jglx: 'CIS_XXFSJGLX', // 消息发送 结果类型
  // HT整合 ---------------------------------------------

  // MOT预警(督导) ---------------------------------------------
  tgtTp: 'MOT_TGT_TP', // 因子维护-目标类型
  jsms: 'MOT_CMPT_MODE', // 因子维护-计算模式
  sjlx: 'MOT_DATA_TP', // 因子维护-数据类型
  kjlx: 'MOT_CTL_TP', // 因子维护-控件类型
  zycd: 'MOT_IMPT', // 事件定义-重要程度
  blx: 'MOT_TBL_TP', // 因子维护-表类型
  sfzdy: 'MOT_WTHR', // 因子维护-是否自定义
  fffw: 'MOT_DSTR_RNG', // 事件定义-分发范围

  gxlx: 'CIS_GXLX', // 关系类型
  rwfpgz: 'MOT_ALOT_RULE_TP', // 任务分配规则
  sjyq: 'MOT_EXEC_TM_RQMT', // 事件定义-发布规则-时间要求
  rwyq: 'MOT_TASK_RQMT', // 事件定义-发布规则-任务要求
  fwlb: 'FWLB', // 服务类别

  // MOT预警(督导) ---------------------------------------------

};

// livebos对象别名的map(别名: 对应对象名称)
const objectMap = {
  motlxObj: 'TMOT_LX', // mot类型
  khjbObj: 'TKHJBDY', // 客户级别
  fwcpObj: 'TFWCP', // 服务产品
  zqlb: 'TZQLB', // 证券类别
  jylb: 'TJYLB', // 交易类别
  jgdm: 'tJGDM', // 机构代码
  hdlxObj: 'TMKT_ACTV_TP', // 数字营销-活动类型
  // BBB: 'RWYQ', // AAA
  // HT整合 ---------------------------------------------
  tccxfwlxObj: 'TC_CXFW_LX', // mot分析执行-服务类型
  // MOT预警 ---------------------------------------------
  yzfl: 'TMOT_DIC', // 因子维护-因子分类
};

export function getDictKey(name) {
  return dictionaryMap[name] || name;
}

export function getObjKey(name) {
  return objectMap[name] || name;
}