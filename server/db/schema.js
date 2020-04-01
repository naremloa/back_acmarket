/**
 * loginSchema
 * @param {String}  account  帳號(key)
 * @param {String}  accountAlias  帳號名稱
 * @param {String}  password  密碼
 * @param {Number}  status  帳號狀態(0)
 * @param {Number}  registerTime  註冊時間
 * @param {Number}  modifyTime  修改時間
 * @param {Number}  lastLoginTime  最後登入時間
 */
export const login = {
  id: { type: Number, index: true },
  account: String,
  accountAlias: String,
  password: String,
  status: Number,
  registerTime: Number,
  modifyTime: Number,
  lastLoginTime: Number,
};

/**
 * orderSchema
 * @apiParam {String} name 姓名
 * @apiParam {String} phone 電話
 * @apiParam {String} email 電子郵件
 * @apiParam {String} nationality 國籍
 * @apiParam {String} gender性別
 * @apiParam {String} breakfast 早餐
 * @apiParam {Number} numberAdult 成人人數
 * @apiParam {Number} numberChild 幼兒人數
 * @apiParam {String} demand 其他需求 (Array.join)
 * @apiParam {Array<Object>} roomInfo 訂房信息
 * @apiParam {String} arriveTime 預計到達時間
 * @apiParam {String} note  備註
 * @apiParam {Array<Object>} roomInfo 房間明細
 * {
 *    '20190311': [
 *      { roomName: 'a', roomPrice: 200, roomCount: 2, subTotal: 400 },
 *      { roomName: 'b', roomPrice: 100, roomCount: 1, subTotal: 100 },
 *    ],
 *    '20190312': [
 *      { roomName: 'a', roomPrice: 120, roomCount: 2, subTotal: 240 },
 *    ],
 *  }
 * @apiParam {Number} createTime  訂房時間
 * @apiParam {String} orderId  訂單編號(key)
 * @apiParam {Number} totalDeposit  應收總訂金(單位: 分)
 * @apiParam {Number} totalValidDeposit  實收總訂金(單位: 分)
 * @apiParam {Number} totalPrice  應收總價(單位: 分)
 * @apiParam {Number} totalValidPrice  實收總價(單位: 分)
 * @apiParam {Number} totalRefund  應退總價(單位: 分)
 * @apiParam {Number} totalValidRefund  實退總價(單位: 分)
 * @apiParam {Number} status  訂單狀態
 * 1: 下訂單, 2: 已付訂金, 3: 已付全額, 4: 已入住, 5: 結單, 6: 已退訂, 7: 退訂結單, 8: 無效
 * @apiParam {String} latestModifyAccount  最近操作訂單帳號
 * @apiParam {Number} latestModifyTime  最近操作訂單時間
 */
// export const order = {
//   // 訂單人資訊
//   name: String,
//   phone: String,
//   email: String,
//   nationality: String,
//   gender: String,
//   breakfast: String,
//   numberAdult: Number,
//   numberChild: Number,
//   demand: String,
//   arriveTime: String,
//   note: String,
//   // 房間資訊
//   roomInfo: Object,
//   // 訂單附加資訊
//   createTime: Number,
//   orderId: String,
//   totalDeposit: Number,
//   totalValidDeposit: Number,
//   totalPrice: Number,
//   totalValidPrice: Number,
//   totalRefund: Number,
//   totalValidRefund: Number,
//   status: Number,
//   latestModifyAccount: String,
//   latestModifyTime: Number,
// };

/**
 * cashSchema
 * @param {String}  cashId 訂單號
 * @param {String}  certificateNumber 憑證號
 * @param {String}  content 摘要
 * @param {Number}  income 收入金額
 * @param {Number}  outcome 支出金額
 * @param {Number}  balance 餘額
 * @param {Number}  type 帳單類型 (1: 現金 2: 銀行)
 * @param {Number}  createTime 創建日期
 * @param {String}  createAccount 創建用戶
 * @param {Number}  modifyTime 修改日期
 * @param {String}  modifyAccount 修改帳號
 */
export const cash = {
  cashId: String,
  certificateNumber: String,
  content: String,
  income: Number,
  outcome: Number,
  balance: Number,
  type: Number,
  createTime: Number,
  createAccount: String,
  modifyTime: Number,
  modifyAccount: String,
};

/**
 * routerSchema
 * @param {Number}  id 路由id
 * @param {String}  dataKey 路由key
 * @param {String}  name 路由名稱
 * @param {String}  apiRoot 路由相關接口前綴
 * @param {Number}  rootId 根路由id
 * @param {Array}   childNode 子節點
 */
export const router = {
  id: Number,
  dataKey: String,
  name: String,
  apiRoot: String,
  rootId: Number,
  childNode: Array,
};

/**
 * roleSchema
 * @param {Number}  id 角色id
 * @param {String}  name 角色名稱
 * @param {Array}   routerGroup 可用路由id
 */
export const role = {
  id: Number,
  name: String,
  routerGroup: Array,
};

/**
 * maintSchema
 * @param {Number}  id  房間id (範圍 1-20)
 * @param {String}  position 維修位置
 * @param {String}  content 維修內容
 * @param {Number}  internalCost 自修配件費 (單位: 分)
 * @param {Number}  outsourceCost  委外維修費 (單位: 分)
 * @param {String}  note 備註
 * @param {Number}  createTime 創建時間
 * @param {String}  createAccount 創建帳號
 * @param {Number}  modifyTime 修改時間
 * @param {String}  modifyAccount 修改帳號
 */
export const maint = {
  id: Number,
  position: String,
  content: String,
  internalCost: Number,
  outsourceCost: Number,
  note: String,
  createTime: Number,
  createAccount: String,
  modifyTime: Number,
  modifyAccount: String,
};

/**
 * articleSchema
 * @param
 */
export const article = {
  title: String,
  content: String,
  img: String,
  status: Number,
  createTime: Number,
  createAccount: String,
  modifyTime: Number,
  modifyAccount: String,
};

export const location = {
  status: Number,
  address: String,
  distance: [{ name: String, time: Number }],
};

/**
 * occSchema
 * @param {Number}    date 房間佔用日期(YMMDD)
 * @param {ObjectId}  orderCid 訂單cid
 * @param {ObjectId}  roomCid 房型cid(非房間)
 * @param {Number}    subRoomCid 房間id
 * @param {Number}    price 訂房當天房型單價
 */
export const occ = {
  date: Number,
  orderCid: { type: 'ObjectId' },
  roomCid: { type: 'ObjectId' },
  subRoomCid: { type: 'ObjectId' },
  price: Number,
};

/**
 * roomSchema
 * 注:
 * weekday 週一～週五
 * weekend 週六～週日
 * lowSeason 11月～3月
 * peakSeason 4月~10月
 */
export const room = {
  name: String,
  allowing: Boolean,
  content: {
    intro: String,
    regulation: String,
    refund: String,
  },
  price: {
    lowSeasonWeekday: Number,
    lowSeasonWeekend: Number,
    peakSeasonWeekday: Number,
    peakSeasonWeekend: Number,
  },
  roomList: [
    {
      id: Number,
      name: String,
      picList: [{ pic: String, sort: Number }],
    },
  ],
};

/**
 * activitySchema
 * @param {String} name 活動名稱
 * @param {String} desc 活動描述
 * @param {String} label 活動前台描述
 * @param {Number} startDate 開始日期
 * @param {Number} endDate 結束日期
 * @param {Number} roomActivityPrice 房型活動價基數率(基於房型底價)
 * @param {Number} mag 倍率(根據活動指定有效時間內，逐天減半)
 * @param {Number} activityPrice 活動價基數率(基於房型底價)
 * @param {Number} extraActivityPrice 活動額外價格
 * @param {Number} remainDay 活動有效天數
 * @param {Number} status 活動狀態(1: 啟用, 2: 停用, 3: 逾期)
 * @param {Number} createTime 創建時間
 * @param {String} createAccount 創建帳號
 * @param {Number} modifyTime 修改時間
 * @param {String} modifyAccount 修改帳號
 */
export const activity = {
  name: String,
  code: String,
  desc: String,
  label: String,
  startDate: Number,
  endDate: Number,
  roomActivityPrice: Number,
  mag: Number,
  activityPrice: Number,
  extraActivityPrice: Number,
  remainDay: Number,
  status: Number,
  createTime: Number,
  createAccount: String,
  modifyTime: Number,
  modifyAccount: String,
};

/**
 * type
 * 0 未分類
 * 1 家具
 * 2 專輯
 * 3 壁紙
 * 4 柵欄
 */
export const furniture = {
  type: Number,
  name: String,
  img: String,
  price: Number,
  owner: Array,
  createTime: Number,
  updateTime: Number,
}

/**
 * status
 * 0 已下訂
 * 1 待發貨
 * 2 已發貨
 * 3 已付款
 * 4 完成
 * 9 刪除
 */
export const order = {
  fId: { type: 'ObjectId' },
  name: String,
  createUser: String,
  targetUser: String,
  createTime: Number,
  updateTime: Number,
  status: Number,
}

export const turnip = {
  price: Number,
  createUser: String,
  createTime: String,
  updateTime: String,
}
