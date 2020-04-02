const innerAudioContext = wx.createInnerAudioContext();

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
    curt: false,
    freet: false,
    imgUrls: [],
    rt: true,

    exhibitList: [],  //资源列表

    audioSrc: null, //需要播放的音频资源
    iconUrl:null, //需要播放的音频的图片资源
    audioName:null, //需要播放音频的名称

    isPlayAudio: false,
    audioSeek: 0, //音频当前时间
    audioDuration: 0, //音频总时间
    showTime1: '00:00',
    showTime2: '00:00',
    durationIntval: 0,
    audioTime: 0, //进度条变化的值


    showView: false,   //下方播放控件是否显示

    vipType:0, //用户的VipType

    
    outTradeNo:null, // 用户下订单的订单号

    hiddenLogin: true,
    scenicCode:null,  //博物馆code

    payImg:null //支付时的弹出广告地址

  },

  /**
   * 生命周期函数 -- 监听页面隐藏
   */
  onHide:function(){
    innerAudioContext.pause();
  },
  /**
   * 用户点击右上角分享
   */
    onShareAppMessage: function () {

    },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //初始化音频播放参数
    this.setData({
      showTime1: '00:00',
      showTime2: '00:00',
      durationIntval: 0,
      audioTime: 0, //进度条变化的值
      isPlayAudio: false,
      audioSeek: 0, //音频当前时间
      isPlayAudio: false,
    })
    //音频播放停止
    innerAudioContext.stop()
    //卸载页面，清除计步器
    clearInterval(this.data.durationIntval);
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    //加载上图广告
    wx.getStorage({
      key: 'adList',
      success: function (res) {
        that.setData({
          imgUrls :res.data
        })
      }
    });
    
    //获取当前用户的vip类型
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          vipType: res.data.vipType,
        })
      }
    });

    //获取购买页面g广告地址
    wx.getStorage({
      key: 'scenicData',
      success: function(res) {
          that.setData({
            payImg: "https://elt.systekcn.com/appsrv/SystekGuiderData/ScenicSpotData/" + res.data.scenicCode +"/pay_introduction.png"
          })

      },
    })




    //加载该类别下的播放资源
    let classifyId = options.classifyId;
    this.getExhibitList(classifyId)
    //初始化音频控件
    this.initAudio();
    this.loadaudio();
  },

  /**
   * 点击单个资源事件
   */
  exhibitClick:function(e){

    var that = this;
    //获取音频资源链接
    let audiourl = e.currentTarget.dataset.audiourl;
    let iconUrl = e.currentTarget.dataset.iconurl;
    let audioName = e.currentTarget.dataset.audioname;

    //判断当前音频是否为免费音频
    let isFree = e.currentTarget.dataset.isfree;
    let audioVipType = e.currentTarget.dataset.viptype;
    if (isFree == 1 || audioVipType <= this.data.vipType){
       //初始化播放参数
      this.setData({
        audioSrc: audiourl,
        iconUrl:iconUrl,
        audioName: audioName,
        showTime1: '00:00',
        showTime2: '00:00',
        durationIntval: 0,
        audioTime: 0, //进度条变化的值
        isPlayAudio: false,
        audioSeek: 0, //音频当前时间
        isPlayAudio: false,
      })

     this.playAudio();
     this.setData({
       showView:true
     })
    }else{
      //查询用户是否登录
      wx.getStorage({
        key: 'userInfo',
        success: function (res) {
          console.log(res.data)
          //不是免费音频跳转购买vip页面
          that.showUp()
        },
        fail:function(res){
          //获取用户失败
          console.log("获取用户失败，请重新登录！")
          //去往我的页面进行登录
          that.popConfirm()
        }
      });


     
      





    }
  },

  popConfirm: function () {
    wx.showModal({
      title: '提示',
      content: '您还没有登录，是否跳转到登录页面进行登录？',
      success: function (res) {
        if (res.confirm) {
          wx.reLaunch({
            url: '../my/my',
          })
        } else {
         
        }
      }
    })
  },

  /**
   * 购买vip3 10元vip
   */
  byVip3Click:function(){
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (user) {
        //获取当前用户的VIP等级
        if (user.data.vipType > 3 || user.data.vipType == 3 ){
          wx.showToast({
            title: '您已经购买过，不需要重复订购~',
            icon: "none" ,
            duration: 2000
          })
        }else{
          that.takeOrder(3)
        }
      }
    })   
  },

  /**
   * 购买vip4 20元vip
   */
  byVip4Click: function () {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (user) {
        //获取当前用户的VIP等级
        if (user.data.vipType > 4 || user.data.vipType == 4) {
          wx.showToast({
            title: '您已经购买过，不需要重复订购~',
            icon: "none",
            duration: 2000
          })
        } else {
          that.takeOrder(4)
        }
      }
    });

  },


  takeOrder:function(vipType){
    var that = this;
      wx.getStorage({
        key: 'scenicData',
        success: function (data) {
          that.setData({
            scenicCode:data.data.scenicCode
          })
        }
      });  
    wx.getStorage({
      key: 'userInfo',
      success: function (user) {
        console.log(user.data)
        wx.request({
          // url: 'https://systek.imdo.co/appsrv/api/PayOrder/takeOrder',
          url: 'https://elt.systekcn.com/appsrv/api/PayOrder/takeOrder',
          data:
          {
            weChatOpenId: user.data.weChatOpenId,
            body: "Systek EGuide VIP",
            vipType: vipType
          },
          method: 'GET',
          success: function (res) {
            console.log(res.data.data)
            wx.requestPayment({
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': 'MD5',
              'paySign': res.data.data.paySign,
              'success': function (pay) {
                console.log("============支付成功==============")
                //将用户订单插入到
                wx.request({
                   //url: 'https://systek.imdo.co/appsrv/api/PayOrder/addOrder',
                  url: 'https://elt.systekcn.com/appsrv/api/PayOrder/addOrder',
                  data:
                  {
                    scenicCode:that.data.scenicCode,
                    tradeNo: res.data.data.outTradeNo,
                    vipType: vipType,
                    appUserid: user.data.id
                  },
                  success(res) {
                    wx.setStorage({
                      key: "userInfo",
                      data: res.data.data
                    })                
                        that.setData({
                          vipType: res.data.data.vipType,
                        })
                      
                   
                    that.hiden();
                    wx.showToast({
                      title: '支付成功,请重新点击音频资源收听！',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                })


              },
              'fail': function (res) {
                console.log("============失败==============")
                console.log(res)
              },
              'complete': function (res) {
              }
            })

          },
        })
      }
    });
  },

  initAudio: function(){
    var t = this;
    //设置src
    innerAudioContext.src = this.data.audiosrc;
    innerAudioContext.onCanplay(() => {
      //初始化duration
      innerAudioContext.duration
      setTimeout(function () {
        //延时获取音频真正的duration
        var duration = innerAudioContext.duration;
        var min = parseInt(duration / 60);
        var sec = parseInt(duration % 60);
        if (min.toString().length == 1) {
          min = `0${min}`;
        }
        if (sec.toString().length == 1) {
          sec = `0${sec}`;
        }
        t.setData({ audioDuration: innerAudioContext.duration, showTime2: `${min}:${sec}` });
      }, 1000)
    })
  },

  /**
   * 拖动进度条事件
   */
  sliderChange:function (e) {
    var that = this;
    innerAudioContext.src = this.data.audioSrc;
    //获取进度条百分比
    var value = e.detail.value;
    this.setData({ audioTime: value });
    var duration = this.data.audioDuration;
    //根据进度条百分比及歌曲总时间，计算拖动位置的时间
    value = parseInt(value * duration / 100);
    //更改状态
    this.setData({ audioSeek: value, isPlayAudio: true });
    // console.log(value)//拖动的时间
    //调用seek方法跳转歌曲时间
    innerAudioContext.seek(value);
    //播放歌曲
    innerAudioContext.play();
  },

  /**
   *播放、暂停按钮
   */
  playAudio:function() {
    //获取播放状态和当前播放时间
    var isPlayAudio = this.data.isPlayAudio;
    // console.log(isPlayAudio)
    var seek = this.data.audioSeek;
    innerAudioContext.pause();
    //更改播放状态
    this.setData({ isPlayAudio: !isPlayAudio })
    if (isPlayAudio) {
      //如果在播放则记录播放的时间seek，暂停
      this.setData({ audioSeek: innerAudioContext.currentTime });
      // console.log(innerAudioContext.currentTime)
    } else {
      //如果在暂停，获取播放时间并继续播放
      innerAudioContext.src = this.data.audioSrc;
      if (innerAudioContext.duration != 0) {
        this.setData({ audioDuration: innerAudioContext.duration });
      }
      //跳转到指定时间播放
      innerAudioContext.seek(seek);
      innerAudioContext.play();
    }
  },

  loadaudio:function() {
    var that = this;
    //设置一个计步器
    this.data.durationIntval = setInterval(function () {
      //当歌曲在播放时执行
      if (that.data.isPlayAudio == true) {
        //获取歌曲的播放时间，进度百分比
        var seek = that.data.audioSeek;
    

        var duration = innerAudioContext.duration;
        var time = that.data.audioTime;
        time = parseInt(100 * seek / duration);

        // console.log(time) //总时间为100
        //当歌曲在播放时，每隔一秒歌曲播放时间+1，并计算分钟数与秒数
        var min = parseInt((seek + 1) / 60);
        var sec = parseInt((seek + 1) % 60);
        //填充字符串，使3:1这种呈现出 03：01 的样式
        if (min.toString().length == 1) {
          min = `0${min}`;
        }
        if (sec.toString().length == 1) {
          sec = `0${sec}`;
        }
        var min1 = parseInt(duration / 60);
        var sec1 = parseInt(duration % 60);
        // console.log(sec, min)
        if (min1.toString().length == 1) {
          min1 = `0${min1}`;
        }
        if (sec1.toString().length == 1) {
          sec1 = `0${sec1}`;
        }
        //当进度条完成，停止播放，并重设播放时间和进度条
        if (time >= 100) {
          innerAudioContext.stop();
          that.setData({ audioSeek: 0, audioTime: 0, audioDuration: duration, isPlayAudio: false, showTime1: `00:00` });
          return false;
        }
        //正常播放，更改进度信息，更改播放时间信息
        that.setData({ audioSeek: seek + 1, audioTime: time, audioDuration: duration, showTime1: `${min}:${sec}`, showTime2: `${min1}:${sec1}` });
      }
    }, 1000);
  },

  /**
   * 加载资源
   */
  getExhibitList: function (classifyId){
    var self = this ;
    wx.request({
      //url: 'http://localhost:8081/appsrv/api/ExhibitVo/get_exhibit_res',
      url: 'https://elt.systekcn.com/appsrv/api/ExhibitVo/get_exhibit_res',
      data: { classifyId: classifyId },
      method: 'GET',
      success: function (res) {
        self.setData({
          exhibitList: res.data.data
        })
        wx.setStorage({
          key: 'exhibitList',
          data: res.data.data,
        })
      },
    })
  },

/**
 * 点击红心收藏按钮
 */
  hled: function () {
    // var rt = this.data.rt;
    // this.setData({
    //   rt: !rt
    // })
    wx.showToast({
      title: '该功能目前尚未上线，敬请期待~',
      icon: "none",
      duration: 2000
    })

  },

  /**、
   * 隐藏支付广告
   */
  hiden: function () {
    // console.log(123)
    this.setData({
      curt: false
    })
  },
  /**
   * 显示支付广告
   */
  showUp: function (index) {

    this.setData({
      curt: true
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
      key: "exhibitList",
      success: function (res) {
        // console.log(key)
        // console.log(res);
        if (key == "") { //用户没有输入时全部显示
          that.setData({
            exhibitList: res.data
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
            exhibitList: arr
          })
        }
      }
    })
  },

})



