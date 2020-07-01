// pages/repair/repair.js

var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Page({
  data: {
    bikeNo:'',
    types:[]
  },
  onLoad:function(e){
    qqmapsdk = new QQMapWX({

     key: wx.getStorageSync('QQMapWX_key')

     });
  },

   // 提交到服务器
   formSubmit: function (e) {   //表单事件对象
    var that=this;
    var bikeNo = e.detail.value.bikeNo;
    //也可以
    var bikeNo=this.data.bikeNo;
    var types = this.data.types;
    //var globalData = getApp().globalData;
    var phoneNum = wx.getStorageSync('phoneNum');
    var openid=wx.getStorageSync('openId');
    wx.getLocation({
      success:function(res){
        var latitude=res.latitude;
        var longitude=res.longitude;
        //1.向业务系统发生请求，将车辆状态置位报修
        report(  that,bikeNo,types ,phoneNum, openid,latitude, longitude   );
        //TODO: 2.向日志系统记录log
      }
    });
  },
  // 勾选故障类型，获取类型值存入checkboxValue
  checkboxChange: function (e) {
    var values = e.detail.value;   //当前选的那个值
    console.log("选择的故障:"+values);
    this.setData({
      types: values
    })
  },
  //扫码
  scanCode:function(e){
    var that=this;
 //扫码功能
     //用软件生成一个测试二维码: www.liantu.com
     // 比如:  http://localhost:8080/00000001
     //请注意:上线后，微信要求访问的协议必须是 https
     //且不能有端口号( 即https 443)
     wx.scanCode({
      success:function(r){
        var code=r.result;
        console.log( "要报修的单车码:"+code );
        that.setData({
          bikeNo:code
        })
      }
    });
  }
 
})



function report(  that,bikeNo,types,phoneNum,openid, latitude,longitude   ){
  qqmapsdk.reverseGeocoder({
    location: {
      latitude: latitude,
      longitude: longitude
    },
    success: function (res) {
      var address = res.result.address_component;
      var province = address.province;
      var city = address.city;
      var district = address.district;
      var street=address.street;
      var street_number=address.street_number;
      console.log("充值日志:"+province + " , " + city + " ," + district+","+province+","+city+","+district);
      var dt = new Date();
      var payTime=Date.parse(dt);
      wx.request({
        url: "http://localhost:8080/yc74ibike/repair",
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          phoneNum: phoneNum,
          bid: bikeNo,
          types: types,
          openid:openid,
          latitude:latitude,
          longitude:longitude,
          loc:[latitude,longitude],
          province:province,
          city:city,
          district:district,
          street:street,
          street_number:street_number,
          repairTime:payTime
        },
        method: 'POST',
        success: function (res) {
          console.log( res );
          if( res.data.code==0){
            wx.showToast({
              title: res.data.msg,
              duration:5000
            });
            return;
          }
          if( res.data.code==1){
            wx.showToast({
              title: '报修成功...谢谢',
              duration:5000
            });
            wx.navigateTo({
                url: '../index/index',
          });
          }
        }
      });
    }
})
}
