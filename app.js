//app.js


App({
  onLaunch: function () {
    wx.setStorageSync('QQMapWX_key', '');
    checkLogin();  
 
  },
    //全局的状态: 相当于   application
   globalData: {
    status:0,      //当前用户的状态
    userInfo: null
  }
})

function checkLogin(){
   // 微信用户是第一次登录
   wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      //根据微信小程序的密钥到后台获取ID
      console.log( "checkLogin -> res code:"+ res.code);
      if( res.code ){
        wx.request({
          url:'http://localhost:8080/yc74ibike/onLogin',
          data:{
            jscode:res.code
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method:'post',
          success:function( res ){
            if(  res.data.code==1 ){
              var uuid=res.data.obj.uuid;  //  3rd_session
              var openid=res.data.obj.openid;
              var status=res.data.obj.status;
              var phoneNum=res.data.obj.phoneNum;
              wx.setStorageSync('uuid', uuid);
              wx.setStorageSync('status', status);
              wx.setStorageSync('phoneNum', phoneNum);
              wx.setStorageSync('openId', openid);
              console.log(  uuid+" "+openid+" "+status+" "+phoneNum );
            }
          }
        });
       
      }else{
        console.log("获取用户登录状态失败!"+ res.errMsg);
      }
    }
  });
}
