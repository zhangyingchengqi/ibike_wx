// pages/deposit/deposit.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  deposit: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否要充值押金？',
      confirmText: '确认',
      success: function (res) {
        //模拟加载的动画
        wx.showLoading({
          title: '充值中...',
        })
        var phoneNum = getApp().globalData.phoneNum;    //电话
        wx.request({
          url: "http://localhost:8080/yc74ibike/deposit",
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            phoneNum: phoneNum
          },
          method: 'POST',
          success: function (res) {
            if(  res.data.code==1){
              getApp().globalData.status=2;    //修改用户的状态
              wx.setStorageSync('status', 2);
              wx.hideLoading();   //隐藏加载条
              wx.navigateTo({
                url: '../identity/identity',
              });
              
            }else{
              wx.showModal({
                title: '提示',
                content: '押金充值失败失败',
                showCancel: false
              })
            }
          }
        })
      }
    });
  }

  


})