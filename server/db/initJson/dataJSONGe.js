/* eslint-disable */
// orderSchema
[
  {
    'repeat(100)': {
      orderId: '{{index(1)}}',
      name: '{{firstName()}} {{surname()}}',
      phone: '+886 {{phone("(xxx) xxx-xxx")}}',
      email(tags) {
        var nameList = this.name.split(' ');
        return `${nameList.toString().replace(/,/g,'.')}@${nameList[0]}${tags.domainZone()}`.toLowerCase();
      },
      nationality: '{{country()}}',
      checkInTime: '{{moment(this.date(new Date(2014, 0, 1), new Date())).startOf("day").valueOf()}}',
      checkOutTime: function (currentObj) {
        return this.checkInTime + currentObj.integer(1, 7) * 24 * 60 * 60 * 1000;
      },
      createTime: function (currentObj) {
        return this.checkInTime - currentObj.integer(1, 30) * 24 * 60 * 60 * 1000;
      },
      roomType: '{{integer(1, 17)}}',
      price: '{{integer(100000, 500000)}}',
      totalPrice: function (currentObj) {
        return this.price * (currentObj.moment(this.checkOutTime-this.checkInTime).date() - 1);
      },
      totalValidPrice: function (currentObj) {
        return Math.round(this.totalPrice / 100) * 100;
      },
      status: '{{integer(1, 5)}}',
      latestModifyAccount: '{{firstName()}}',
      latestModifyTime: '{{moment(this.date(new Date(2018, 0, 1), new Date())).startOf("day").valueOf()}}',
      note: '{{lorem(3, "words")}}',
    }
  }
]
// loginSchema
[
  {
    'repeat(50)': {
      account: '{{surname().toLowerCase()}}',
      accountAlias: function (currentObj) {
        return `${this.account.slice(0,1).toUpperCase()}${this.account.slice(1)}`;
      },
      password: '$2b$10$gVwTvONpvPZ/N17YjTh4auQRqUnK9cIQwjehqwndo5EYoX7QD2l1u',
      role: '{{random("5c3ff2a7497ea3946f9a9ebd", "5c3ff2a7497ea3946f9a9ebc")}}',
      level: 0,
      status: '{{integer(0, 3)}}',
      softDelete: '{{bool()}}',
      modifyUser: '{{surname()}}',
      registerTime: '{{moment(this.date(new Date(2014, 0, 1), new Date())).startOf("day").valueOf()}}',
      modifyTime: function (currentObj) {
        return this.registerTime + ( currentObj.integer(1, 4) * currentObj.integer(1, 365) ) * 24 * 60 * 60 * 1000;
      },
      lastLoginTime: function (currentObj) {
        return this.registerTime + ( currentObj.integer(1, 4) * currentObj.integer(1, 365) ) * 24 * 60 * 60 * 1000;
      },
    }
  }
]
// roomSchema
[
  {
    'repeat(50)': {
      id: '{{index(1)}}',
      position: '{{random("盥洗室", "房間", "陽台", "走廊", "花圃", "大廳", "茶水間", "儲物間")}}',
      content: '{{random("水龍頭壞掉", "木板凹陷", "鐵桿生鏽", "網路有問題", "磁磚破裂", "木板突出", "磁磚掉落")}}',
      internalCost: '{{integer(100000, 500000)}}',
      outsourcedCost: '{{integer(100000, 500000)}}',
      note: '{{random("已委外維修", "待處理", "已修復", "同仁修復中")}}',
      createTime: '{{moment(this.date(new Date(2014, 0, 1), new Date())).startOf("day").valueOf()}}',
      createAccount: '{{surname().toLowerCase()}}',
      modifyTime: function (currentObj) {
        return this.createTime + currentObj.integer(1, 14) * 24 * 60 * 60 * 1000;
      },
      modifyAccount: '{{surname().toLowerCase()}}',
    }
  }
]
/* eslint-enable */
