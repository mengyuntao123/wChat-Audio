Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollindex: 0, // 当前页面的索引值
    totalnum: 4, // 总共页面数
    starty: 0, // 开始的位置x
    startTime: 0,  // 开始的时间戳
    endy: 0, // 结束的位置y
    endTime: 0,  // 结束的时间戳
    critical: 80, // 触发翻页的临界值
    maxTimeCritical: 300,  // 滑动的时间戳临界值上限
    minTimeCritical: 100,  // 滑动的时间戳临界值下限
    margintop: 0, // 滑动下拉距离
    currentTarget: null,  // 当前点击的元素的id
  },
  scrollTouchStart: function (e) {
    let py = e.touches[0].pageY,
      stamp = e.timeStamp,
      currentTarget = e.currentTarget.id;
    console.log(py);
    this.setData({
      starty: py,
      startTime: stamp,
      currentTarget: currentTarget
    })
  },
  scrollTouchMove(e) {
    // console.log(e);
  },
  scrollTouchEnd: function (e) {
    let py = e.changedTouches[0].pageY,
      stamp = e.timeStamp,
      d = this.data,
      timeStampdiffer = stamp - d.startTime;
    this.setData({
      endy: py,
      endTime: stamp
    })
    console.log('开始：' + d.starty, '结束：' + e.changedTouches[0].pageY);
    console.log('时间戳之差: ' + timeStampdiffer);
    if (timeStampdiffer <= d.maxTimeCritical && timeStampdiffer > d.minTimeCritical && (d.starty > e.changedTouches[0].pageY)) {
      let currentTarget = parseInt(d.currentTarget.slice(4)),
        nextTarget = currentTarget + 1;
      const query = wx.createSelectorQuery();
      query.select(`#hook${nextTarget}`).boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(function (res) {
        // console.log(res);
        if (res[0] != null) {
          wx.pageScrollTo({
            scrollTop: res[0].height * currentTarget,
          })
        }
      })
    } else if (timeStampdiffer <= d.maxTimeCritical && timeStampdiffer > d.minTimeCritical && (d.starty < e.changedTouches[0].pageY)) {  // 下拉
      let currentTarget = parseInt(d.currentTarget.slice(4)),
        preTarget = currentTarget - 2 == -1 ? 0 : currentTarget - 2;
      const query = wx.createSelectorQuery();
      query.select(`#hook1`).boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(function (res) {
        console.log(res);
        wx.pageScrollTo({
          scrollTop: res[0].height * preTarget
        })
      })
    }
  },
})