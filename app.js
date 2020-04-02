//app.js
App({
  globalData:{    
    userInfo:null,    
    test:"test"    
},



  onLaunch: function () {
    //查看是否授权

    // wx.getSetting({

    //   success: function (res) {

    //     if (res.authSetting['scope.userInfo']) {
    //       userLogin();
    //     } else {
    //       console.log("当前用户没有授权")  
    //     }

    //   }

    // });

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
      }else{
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

