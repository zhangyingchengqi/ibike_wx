// pages/identity/identity.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  formSubmit: function (e) {
    //获取全局变量的数据
    var globalData = getApp().globalData;
    var phoneNum = globalData.phoneNum;
    var name = e.detail.value.name
    var idNum = e.detail.value.idNum
    wx.request({
      url: "http://localhost:8080/yc74ibike/identity",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        phoneNum: phoneNum,
        name: name,
        idNum: idNum
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        if(  res.data.code==1){
          //更新全局变量中的status属性
          getApp().globalData.status = 3
          wx.navigateTo({
            url: '../index/index',
          });
        }
      }
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})