//index.js
//获取应用实例
const app = getApp()

Page({
/**
   * 页面绑定的数据
   */
  data: {
      latitude:0,
      longitude:0,
      controlls:[],
      markers:[]
  },

  onLoad: function (options) {
      console.log(   "生命周期: -> onload");
      //1. 获取当前对象的拷贝，
      var that=this;
      //2. 创建一个地图的上下,对地图中的控件进行事件操作
      that.mapCtx=wx.createMapContext('map');
      //3。获取当前手机所在的位置，（真机是手机真实位置，模拟器则是在sensor面板中设置的位置)
      wx.getLocation({
        type: "wgs84",
        isHighAccuracy: true,
        success: function(res){
             console.log(  res );
             that.setData({
               latitude:res.latitude,
               longitude:res.longitude
             });
        }
      });

      //4. 在地图页中加入按钮
      // 获取当前设备信息，窗口的宽高
      wx.getSystemInfo({
          success:function(res){
              //获取宽高
              var height=res.windowHeight;
              var width=res.windowWidth;
              //添加控件( 即图片)
              that.setData({
                controlls:[
                  {
                    id:1,
                    position:{ 
                      left: width/2-10,
                      top:height/2-20,
                      width:20,
                      height:35
                     },
                    iconPath:"../images/location.png",
                    clickable:true
                  },
                  {
                    id:2,
                    position:{ 
                      left: 20,
                      top:height-60,
                      width:40,
                      height:40
                     },
                    iconPath:"../images/img1.png",
                    clickable:true
                  },
                  {
                    id:3,
                    position:{ 
                      left: 100,
                      top:height-60,
                      width:100,
                      height:40
                     },
                    iconPath:"../images/qrcode.png",
                    clickable:true
                  },
                  {
                    id:4,
                    position:{ 
                      left: width-45,
                      top:height-60,
                      width:40,
                      height:40
                     },
                    iconPath:"../images/pay.png",
                    clickable:true
                  }
                ]
              })
          }
      });

      //加载所有的可用的附近的前10台车
      //获取附近的车，并显示
     wx.request({
      url:"http://localhost:8080/yc74ibike/findNearAll",
      method:"POST",
      data:{
        latitude:that.data.latitude,
        longitude:that.data.longitude,
        status:1
      },
      success:function(res){
        console.log( res );
         const bikes=res.data.obj.map( item=>{
           return {
             bid: item.bid,
             iconPath:"../images/bike.png",
             width:35,
             height:35,
             latitude:item.latitude,
             longitude:item.longitude
           }
         });
         console.log(    bikes );
         that.setData({
          markers:bikes
        });
      }
   });

  },

  controltap( e ){
    var that =this;
    //console.log(    e.controlId );
    if(   e.controlId==2){
      //地图复位
      that.mapCtx.moveToLocation();
    }else if(  e.controlId==3  ){
      //获取全局变量status,根据它的值进行页面跳转
       var status=getApp().globalData.status;
       if( status==0){
        //跳到注册页面
        wx.navigateTo({
          url: '../register/register',
        });
      }else if (status == 1) {
        wx.navigateTo({
          url: '../deposit/deposit',
        });
      } else if (status == 2) {
        wx.navigateTo({
          url: '../identity/identity',
        });
      } else if (status == 3) {
        that.scanCode()
      } 
    }
  },

  scanCode:function(){     // 这样写，则scanCode是当前 vm的一个成员方法
   // function scanCode(){
    var that=this;
     //扫码
     wx.scanCode({
      success:function(  res ){
         //console.log(  res );
         //得到 车的编号
         var bid=res.result;  
         // that.data.latitude   that.data.longitude
         //异步请求
         wx.request({
           url:"http://localhost:8080/yc74ibike/open",
           method:"POST",
           //data: "bid="+bid+"&latitude="+that.data.latitude+"&longitude="+that.data.longitude,
           data:{
             bid:bid,
             latitude:that.data.latitude,
             longitude:that.data.longitude
           },
           dataType: "json",
           header:{
             "content-type":"application/json"
           },
           success:function(  res ){
              console.log(  res );
           }
          });
      }
    });
  },


  /**
   * Lifecycle function--Called when page is initially rendered
   * 页面初始渲染
   */
  onReady: function () {
    console.log(   "生命周期: -> onReady");
     //数据埋点:用于获取用户openid,当前地理位置，发出请求到后台,并保存到mongo的logs表中,用于后期日志分析
     //获取位置
     wx.getLocation({
       success:function(  res ){
         //获取经纬度
        var latitude=res.latitude;
        var longitude=res.longitude;
        //取用户标识
        var openid=wx.getStorageSync('openid');
        wx.request({
          url:"http://localhost:8080/yc74ibike/log/savelog",
          data:{
            time:new Date(),   //客户端的时间
            openid:openid,
            latitude:latitude,
            longitutde:longitude,
            url: 'index'
          },
          method:"POST"
        })

       }
     })

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    console.log(   "生命周期: -> onShow");
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    console.log(   "生命周期: -> onHide");
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {
    console.log(   "生命周期: -> onUnload");
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    console.log(   "生命周期: -> onPullDownRefresh");
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {
    console.log(   "生命周期: -> onReachBottom");
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {
    console.log(   "生命周期: -> onShareAppMessage");
  }

})
