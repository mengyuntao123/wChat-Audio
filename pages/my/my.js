// pages/my.js
Page({
  /**
   * 页面的初始数据
   */
  data: {

    nickName:"****",
    avatar: "",
    vipType:"****",
    vipTime:"****",
    endTime:"****",
    userId:"****",
    vipDays:"***",
    isLogin:false,
    hiddenLogin: true,
    scenicCode:null,
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();


    wx.setNavigationBarTitle({
      title: '我的',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo();
  },

  loginBtn:function(){
    this.setData({
      hiddenLogin:false
    })
  },

  notLogin:function(){
    this.setData({
      hiddenLogin: true
    })
  },

  //授权弹窗操作		情况3：用户未授权，需点击button授权
  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {    //用户按了允许授权按钮
      // 登录操作
      that.userLogin();
    } else {      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入~',
        showCancel: false,
        confirmText: '我知道了',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“我知道了”')
            //返回前一页面
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  },

  getUserInfo:function(){
    let that = this;
    //获取用户登录信息
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res)
        that.setData({
          isLogin: true,
          userId: res.data.id,
          nickName: res.data.nickName,
          avatar: res.data.avatar,
          vipDays: res.data.vipDays,
        })
        if (res.data.vipType == 0) {
          that.setData({
            vipType: "游客",
            vipTime: "暂无",
            endTime: "暂无"
          })
        } else if (res.data.vipType == 3) {
          var s = res.data.vipTime;
          var days = res.data.vipDays;
          s = s + 60 * 60 * 24 * 1000 * days;
          var beganTime = new Date(res.data.vipTime);
          var eTime = new Date(s);
          var vipTime = format(beganTime, 'yyyy-MM-dd');
          var endTime = format(eTime, 'yyyy-MM-dd');
          that.setData({
            vipType: "10元VIP",
            vipTime: vipTime,
            endTime: endTime
          })
        } else if (res.data.vipType == 4) {
          var s = res.data.vipTime;
          var days = res.data.vipDays;
          s = s + 60 * 60 * 24 * 1000 * days;
          var beganTime = new Date(res.data.vipTime);
          var eTime = new Date(s);
          var vipTime = format(beganTime, 'yyyy-MM-dd');
          var endTime = format(eTime, 'yyyy-MM-dd');
          that.setData({
            vipType: "20元VIP",
            vipTime: vipTime,
            endTime: endTime
          })
        }
      },
      fail:function(res){
        console.log("您目前尚未登录！")
        that.setData({
          isLogin:false
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  userLogin:function(){
    wx.getStorage({
      key: 'scenicData',
      success: function (res) {
        console.log(res)
        that.setData({
          scenicCode: res.data.scenicCode
        })
      }
    });

    var that = this;
    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          wx.getUserInfo({
            success: function (userdata) {
              console.log(userdata)
              wx.request({
                 url: 'https://elt.systekcn.com/appsrv1/api/wechatUser/get_openId_byCode',
               // url: 'http://localhost:8081/appsrv/api/wechatUser/get_openId_byCode',
                data: {
                  scenicCode: that.data.scenicCode,
                  code: res.code,
                  encryptedData: userdata.encryptedData,
                  iv: userdata.iv
                },
                success: function (res) {
                  console.log(res)
                  wx.setStorage({
                    key: "userInfo",
                    data: res.data.data
                  })
                  console.log("登录成功！")
                  that.getUserInfo();
                  that.setData({
                    hiddenLogin: true,
                    isLogin: true

                  })
                }
              })


            }
          });
        }
      }
    });

  }

})
function format(time, format) {
  var t = new Date(time);
  var tf = function (i) {
    return (i < 10 ? '0' : '') + i
  };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  })
}
