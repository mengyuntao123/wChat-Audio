//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 800,
    circular:true,
    pt:true,
    imgUrls: [],
    texF:[],
    scenicCode:null ,
    retrunImg:true,
  },

   onLoad:function(options){
     //获取传送的参数
     var scenicCode = options.scenicCode;
     var retrunImg = options.retrunImg;
    if (retrunImg == 1){
      this.setData({
        retrunImg:false
      })
    }

    //根据scenicCode 获取博物馆信息  并且放入缓存中
      wx.request({
       // url: 'http://localhost:8081/appsrv/api/Scenic/getScenicByCode',
        url: 'https://elt.systekcn.com/appsrv/api/Scenic/getScenicByCode',
        data: { scenicCode: scenicCode },
        method: 'GET',
        success: function (res) {
          console.log(res)
          wx.setStorage({
            key: 'scenicData',
            data: res.data.data,
          })
          wx.setNavigationBarTitle({
            title: res.data.data.name,
          })


        },
      })
    this.setData({
      scenicCode: scenicCode
    })
       var that = this
        wx.request({

          url:"https://elt.systekcn.com/appsrv/api/ExhibitClassify/get_exhibit_classify",
          //url: 'http://localhost:8081/appsrv/api/ExhibitClassify/get_exhibit_classify',
          data: { scenicCode: scenicCode},
          method: 'GET',
          success: function(res){
            console.log(res)
            that.setData({
              texF:res.data.data
            })
          },
        })
     userLogin(scenicCode);
     this.getIndexAd()


   },
  retrunBtn:function(){
    wx.reLaunch({
       url: '../scenic_list/scenic_list',
     })
   },
   sec:function(){
     setTimeout(() => {
       this.setData({
         pt:false
       })
     }, 3000);
   },
   
   goTovr:function(){
           
     wx.navigateTo({
       url: '../webView/webView',
     })
    },

    tickAppointment:function(){
      wx.navigateTo({
        url: '../eltWebview/eltWebview',
      })
    },

    guidAppion:function(){
      wx.navigateTo({
        url: '../guid/guid',
      })
    },
   getIndexAd:function(){
     var that = this;
     wx.request({
       url: 'https://elt.systekcn.com/appsrv/api/WechatAd/get_all_wechat_ad',
       //url: 'http://localhost:8081/appsrv/api/WechatAd/get_all_wechat_ad',
       data: {
        scenicCode:that.data.scenicCode
       },
       method: 'GET',
       success: function (res) {
         console.log(res)
         that.setData({
           imgUrls: res.data.data
         })
         wx.setStorage({
           key: 'adList',
           data: res.data.data,
         })


       },
     })
   },
     /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
//用户登陆
function userLogin(scenicCode) {
 
  wx.login({
    success: function (res) {
      if (res.code) {
        wx.getUserInfo({
          success: function (userdata) {
            wx.request({
               url: 'https://elt.systekcn.com/appsrv/api/wechatUser/get_openId_byCode',
                 //url: 'http://localhost:8081/appsrv/api/wechatUser/get_openId_byCode',
              data: {
                scenicCode: scenicCode,
                code: res.code,
                encryptedData: userdata.encryptedData,
                iv: userdata.iv
              },
              success: function (res) {
               console.log(res)
              }
            })
          }
        });
      }
    }
  });

}