// pages/scenic_list/scenic_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 800,
    circular: true,
    pt: true,
    scenicList:[],
    adList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'e导览博物馆列表',
    })
    this.getScenicList();


  },
  /**
* 用户点击右上角分享
*/
  onShareAppMessage: function () {

  },

  /**
   * 博物馆点击事件
   */

  scenicClick: function (e){

    let scenicCode = e.currentTarget.dataset.sceniccode; 


    wx.reLaunch({
      url: '../index/index?scenicCode=' + scenicCode +"&retrunImg=1",
    })
  
   
  },

  /**
   * 获取所有博物馆
   */
 getScenicList:function(){

   var that = this;
   wx.request({
    // url: 'http://localhost:8081/appsrv/api/Scenic/getAllScenic',
     url: 'https://elt.systekcn.com/appsrv/api/Scenic/getAllScenic',
     data: {},
     success: function (res) {
       that.setData({
        scenicList:res.data.data,
         adList:res.data.data
       })
       wx.setStorage({
         key: 'scenicList',
         data: res.data.data,
       })
       
     }
   })
  },

  /**
    * 搜索
    */

  //键盘输入调用的方法
  input: function (e) {
    this.search(e.detail.value)
    // console.log(e.detail.value);//获取输入的值
  },
  search: function (key) {
    var that = this;
    //从本地中取出存储的数据
    var exhibitList = wx.getStorage({
      key: "scenicList",
      success: function (res) {
        // console.log(key)
        // console.log(res);
        if (key == "") { //用户没有输入时全部显示
          that.setData({
            scenicList: res.data
          })
          return;
        }
        var arr = [];//用于存储用户搜索到的值
        for (let i in res.data) {
          if (res.data[i].name.indexOf(key) >= 0) {
            arr.push(res.data[i]);
          }
        }
        if (arr.length == 0) {
          wx.showToast({
            title: '无相关数据',
            icon: "none",
            duration: 2000,
          })
        } else {
          that.setData({
            scenicList: arr
          })
        }
      }
    })
  },
})