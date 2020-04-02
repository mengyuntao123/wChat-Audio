
Page({
  data: {
    hidden:true,
  },
  onLoad: function () {

    setTimeout(function () {
      wx.reLaunch({
        url: '../index/index',
      })
    }, 2000) 

    // var that = this;
    // wx.getSetting({
    //   success: function (res) {

    //     if (res.authSetting['scope.userInfo']) {
    //       that.setData({
    //         hidden: true
    //       })
    //     } else {
    //       console.log("当前用户没有授权")
    //       that.setData({
    //         hidden:false
    //       })

    //     }

    //   }

    // });
  },

  loginbtn:function(e){
    wx.reLaunch({
      url: '../index/index',
    })
  },

  //授权弹窗操作		情况3：用户未授权，需点击button授权
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {    //用户按了允许授权按钮
      // 登录操作
      wx.reLaunch({
        url: '../index/index',
      })
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
})
//用户登陆
function userLogin() {
  wx.login({
    success: function (res) {
      if (res.code) {
        wx.getUserInfo({
          success: function (userdata) {
            wx.request({
              url: 'https://elt.systekcn.com/appsrv/api/wechatUser/get_openId_byCode',
              data: {
                code: res.code,
                encryptedData: userdata.encryptedData,
                iv: userdata.iv
              },
              success: function (res) {
                console.log(res.data.data)
                wx.setStorage({
                  key: "userInfo",
                  data: res.data.data
                })
                console.log("登录成功！")
              }
            })
          }
        });
      } else {
        //获取用户授权登录失败
        console.log("获取用户登录授权失败..........")
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    },
    fail: function (res) {
      //获取用户授权登录失败
      console.log("获取用户登录授权失败")
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  });

}
