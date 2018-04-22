//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    inputValue: "",
    mesArray: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  // onLoad: function () {
  //   // wx.setNavigationBarTitle({
  //   //   title: '在线聊天'
  //   // })
  //   var that = this
  //   //调用应用实例的方法获取全局数据
  //   app.getUserInfo(function (userInfo) {
  //     //更新数据
  //     that.setData({
  //       userInfo: userInfo
  //     })
  //   })
  // },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value,
      inputSign: true
    });

  },

  sendMes: function () {
    var oriMesArr = this.data.mesArray;
    var newMes = this.data.inputValue;
    if (newMes != "") {
      var myNewMes = {
        mesType: "myItem",
        mesitem: {
          userInfo: this.data.userInfo,
          mes: newMes
        }
      };
      oriMesArr.push(myNewMes);
      this.setData({ mesArray: oriMesArr });
      this.setData({ inputValue: "" });

    }
  }


})
