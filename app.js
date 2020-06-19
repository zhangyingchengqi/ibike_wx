//app.js
App({




  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(  res.code){
          var appid="wx56d05b16436e1eeb";
          var secret="456bdd7b86217e5609906f09590f18d2";
          var code=res.code;
          //要发请求到微信服务器中取当前用户的openid
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
            success:function(  res){
              console.log(  res.data.openid+"\tunionid: "+ res.data.unionid);
              //保存这个 openid 到本地
              wx.setStorageSync('openid', res.data.openid);
            }
          });
        }else{
          console.log("用户登录失败"+   res.errMsg);
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
    //全局的状态: 相当于   application
   globalData: {
    status:0,      //当前用户的状态
    userInfo: null
  }
})