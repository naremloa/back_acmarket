/**
 * loginSchema
 * @param {String}  account  帳號(key)
 * @param {String}  accountAlias  帳號名稱
 * @param {String}  password  密碼
 * @param {Number}  role  角色(0: 遊客 ... 100: admin)
 * @param {Number}  level  權限(暫時廢棄，固定為0)
 * @param {Number}  status  帳號狀態(0: 無審核通過, 1: 正常啟用, 2: 停用, 3: 刪除)
 * @param {Boolean} softDelete  軟刪除(false: 未刪, true: 已刪)
 * @param {String}  modifyUser  修改人
 * @param {Number}  registerTime  註冊時間
 * @param {Number}  modifyTime  修改時間
 * @param {Number}  lastLoginTime  最後登入時間
 */
export const login = {
  id: { type: Number, index: true },
  account: String,
  accountAlias: String,
  password: String,
  role: { type: 'ObjectId', ref: 'Role' },
  level: Number,
  status: Number,
  softDelete: Boolean,
  modifyUser: String,
  registerTime: Number,
  modifyTime: Number,
  lastLoginTime: Number,
};

/**
 * orderSchema
 * @param {Number}   orderId  訂單編號(key)
 * @param {String}   name  姓名
 * @param {String}   phone  電話
 * @param {String}   email  電子郵件
 * @param {String}   nationality  國籍
 * @param {String}   gender 性別
 * @param {String}   breakfast 早餐
 * @param {String}   number 人數
 * @param {Array<String>}   demand 其他需求
 * @param {Number}   createTime  訂房時間
 * @param {Array<Object>}   roomInfo 訂房信息
 *    @param {ObjectId} roomCid  房型cid
 *    @param {Number}   price  房型單價
 *    @param {Number}   num  入住天數
 * @param {Number}   totalPrice  應收總價(單位: 分)
 * @param {Number}   totalValidPrice  實收總價(單位: 分)
 * @param {Number}   status  訂單狀態(1: 下訂單, 2: 已付款, 3: 已入住, 4: 已退房, 5: 已取消 )
 * @param {String}   latestModifyAccount  最近操作訂單帳號
 * @param {Number}   latestModifyTime  最近操作訂單時間
 * @param {String}   note  備註
 */
export const order = {
  orderId: Number,
  name: String,
  phone: String,
  email: String,
  nationality: String,
  gender: String,
  breakfast: String,
  number: String,
  demand: [String],
  createTime: Number,
  roomInfo: [
    {
      roomCid: { type: 'ObjectId' },
      price: Number,
      num: Number,
    },
  ],
  totalPrice: Number,
  totalValidPrice: Number,
  status: Number,
  latestModifyAccount: String,
  latestModifyTime: Number,
  note: String,
};

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
 */
export const occ = {
  date: Number,
  orderCid: { type: 'ObjectId' },
  roomCid: { type: 'ObjectId' },
  subRoomCid: { type: 'ObjectId' },
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
