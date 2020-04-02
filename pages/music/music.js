var audioCxt;
//动画
var audioAnimation;
audioCxt = wx.createInnerAudioContext();

// audioCxt.src = 'http://elt.systekcn.com:8081/appsrv/SystekGuiderData/ScenicSpotData/exhibit_audio_path/A_1.mp3';

Page({
  data: {
    audioAnimation : null,
    //显示的时间
    musicTime : '00:00',
    sliderValue : 0,
    shop:[
      {src:"http://elt.systekcn.com:8081/appsrv/SystekGuiderData/ScenicSpotData/exhibit_audio_path/A_1.mp3"},
      {src:"http://elt.systekcn.com:8081/appsrv/SystekGuiderData/ScenicSpotData/exhibit_audio_path/A_2.mp3"}
    ]
  },
 onLoad:function(){
  for(var i=0;i<this.data.shop.length;i++){
  // console.log(i)
  audioCxt.src=this.data.shop[i].src
  }
 },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //音乐播放结束触发
    audioCxt.onEnded((res) =>{
      //修改属性。去除css状态
      this.data.music_on = false;
      this.setData({
        music_on: this.data.music_on
      })
      //重新播放
      audioCxt.seek(0);
      this.setData({
        musicTime: '00:00',
        sliderValue: 0
      })
    }),
    //在播放状态，绑定播放进度更新事件。然后控制进度条和时间显示
    audioCxt.onPlay((res) =>{ 
      audioCxt.onTimeUpdate(this.timeUpdate)
    })
  },
 
  //播放按钮事件
  playMusic : function(){
    audioCxt.play();
    //图片添加css样式，旋转样式
  },
 
  //暂停按钮事件
  pauseMusic : function(){
    audioCxt.pause();
  },
 
  //停止按钮事件
  stopMusic : function(){
    audioCxt.stop();
    this.data.music_on = false;
    this.setData({
      music_on: this.data.music_on
    })
  },
 
  //进度条改变后触发事件
  audioChange : function(e){
    var length = audioCxt.duration;
    var percent = e.detail.value;
    //用进度条百分比 *　整个音乐长度
    var musicTime = Math.round(length/100*percent);
    audioCxt.seek(musicTime);
 
    //因为在拖动进度条时，去除了时间绑定，所以进度改变后重新绑定
    audioCxt.onTimeUpdate(this.timeUpdate);
 
    this.setData({
      musicTime: this.musicTimeFormat(musicTime)
    })
  },
  //进度条拖动过程中触发事件
  audioChanging : function(e){
    //因为在进度条拖动的时候，还会在timeUpdate里面修改进度条的value，倒置拖动受影响，所以当拖动的时候需要取消绑定
    audioCxt.offTimeUpdate();
 
    //拖动时修改时间显示
    var length = audioCxt.duration;
    var percent = e.detail.value;
    var musicTime = Math.round(length / 100 * percent);
    this.setData({
      musicTime: this.musicTimeFormat(musicTime)
    })
  },
 
  //将秒钟转化为mm：ss的时间格式
  musicTimeFormat : function(time){
    var second = Math.floor(time % 60);
    if(second<10){
      second = '0' + second;
    }
    var minute = Math.floor(time / 60);
    if (minute < 10) {
      minute = '0' + minute;
    }
    return minute + ':' + second;
  },
 
  //播放的时候，更新进度条和时间显示
  timeUpdate : function(){
    var time = audioCxt.currentTime;
    var percent = Math.round(time / audioCxt.duration * 100);
    this.setData({
      musicTime: this.musicTimeFormat(time),
      sliderValue: percent
    })
  }
  


 











  
//   funplay: function(){
//     console.log("audio play");
// },
// funpause: function(){
//     console.log("audio pause");
// },
// funtimeupdate: function(u){
//     this.setData({
//       current:u.detail.currentTime,
//       duration:u.detail.duration
//     })
//     console.log(this.data.current);
//     console.log();
// },
// funended: function(){
//     console.log("audio end");
// },
// funerror: function(u){
//     console.log(u.detail.errMsg);
// }
})