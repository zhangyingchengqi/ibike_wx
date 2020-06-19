// pages/register/register.js
Page({

  /**
   * 页面初始化数据
   */
  data: {
    countryCodes: ["86", "80", "84", "87"], //手机号码的国家编码
    countryCodeIndex: 0,
    phoneNum: ""     //手机号
  },

  bindCountryCodeChange:function(  e  ){
       // console.log( "hello ");
       this.setData(  {
        countryCodeIndex: e.detail.value
       });
  },
  inputPhoneNum:function(e){
     this.setData({
       phoneNum:  e.detail.value
     });
  },
  genVerifyCode:function( e ){
    //国家编码
    var index=this.data.countryCodeIndex;
    var countryCode = this.data.countryCodes[index];
    //电话号码
    var phoneNum = this.data.phoneNum;
    //请求后台，发送一个验证码短信
    wx.request({
      //小程序访问的网络请求协议必须是https，url里面不能有端口号
      url: "http://localhost:8080/yc74ibike/genCode",
      //以表单方式(POST)来传参数到后台
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        nationCode: countryCode,
        phoneNum: phoneNum
      },
      method: 'POST',
      success: function ( e    ) {
        if(   e.data.code==1 ){
          wx.showToast({
            title: '验证码已发送',
            icon: 'success'
          });
      }
    }
    });

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