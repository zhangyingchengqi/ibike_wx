// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: 0, //余额
    currentTab: 3, //默认选中标签
    payMoney: 10
  },

  //tab的切换,   因为界面   bindtap="switchNav"    switchNav事件是  Page的一个成员
  switchNav: function (e) {
    var that = this;
    //  e.target.dataset.current   ->  dataset:  事件源组件上由data-开头的自定义属性组成的集合
    // 界面:   data-current="0"
    if (that.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        //tab
        currentTab: e.target.dataset.current,
        payMoney: e.target.dataset.money
      });
    }
  },

  recharge: function () { 
    var phoneNum=wx.getStorageSync('phoneNum')
    if(  phoneNum==null|| phoneNum==''){
      wx.showToast({
        title: '您还没有登录',
        icon:'loading'
      })
      return;
    }
    var that = this;
    //充值提示框:模式对话框
    wx.showModal({
      title: '充值',
      content: '您是否进行充值' + that.data.payMoney + '元?',
      success: function (res) {    //   res有两个属性:  confirm   cancel
        console.log(res)
        //确认充值
        if (res.confirm) {
          //发送充值请求    
          var phoneNum = wx.getStorageSync('phoneNum');
          var openid = wx.getStorageSync('openId');   //在  app.js中存的
          var amount =  that.data.payMoney;
          wx.request({
            url: 'http://localhost:8080/yc74ibike/recharge',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              balance: amount,
              phoneNum: phoneNum
            },
            success: function (res) {
              if(res.data.code==1) {
                wx.showModal({
                  title: '提示',
                  content: '充值成功！',
                  success: function(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../index/index',
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  }
})