// pages/acc/acc.js
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()
//获取数据库引用
const db = wx.cloud.database({ env: 'second-917' });
const accelerometerDB = db.collection('highStep')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    capsuleInfo: app.globalData.capsuleInfo,
    value: 0,
    accelerometerX: null,
    accelerometerY: null,
    accelerometerZ: null,
    accXs: [],
    accYs: [],
    accZs: [],
    timeSs: [],
    startTime: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    innerAudioContext.autoplay = false
    innerAudioContext.src = 'cloud://second-917.7365-second-917-1302086118/alarm.mp3'

    console.log("获取加速度计数据"),
    wx.startAccelerometer({
      interval: 'normal',   //200ms/次
      success: res => { console.log("调用成功"); },
      fail: res => { console.log(res) }
    });
  },

  startAccelerometer: function (e) {
    
    this.setData({ startTime: new Date().getTime()})
    let _this = this;
    _this.setData({ isReading: true })
    let accXs = [];
    let accYs = [];
    let accZs = [];
    let timeSs = [];

    // 监听加速度数据
    wx.onAccelerometerChange(function (res) {
      let mid_time = new Date().getTime();
      console.log("mid-time: ", mid_time, "startTime: ", _this.data.startTime)
      console.log(res.x, res.y, res.z, mid_time )

      let timeStep = (mid_time - _this.data.startTime) / 1000
      _this.setData({ value: parseInt(timeStep * 10), displayValue: parseInt(timeStep)});
      if (timeStep < 10) {
        // console.log("timeStep < 10")
        accXs.push(res.x)
        accYs.push(res.y)
        accZs.push(res.z)
        timeSs.push(mid_time)
        _this.setData({
          accelerometerX: parseFloat(res.x.toFixed(5)),
          accelerometerY: parseFloat(res.y.toFixed(5)),
          accelerometerZ: parseFloat(res.z.toFixed(5))
        })
      } 
      if (timeStep >= 10) {
        // console.log("timeStep = 10")
        _this.setData({ value: 100, displayValue: 10});
        _this.stopAccelerometer();
        innerAudioContext.play()
        // console.log("end-time: ", Date.now())
        _this.setData({ accXs: accXs, accYs: accYs, accZs: accZs, timeSs: timeSs })
        return;
      }
    })
  },

  stopAccelerometer: function () {
    let _this = this
    this.setData({ isReading: false })
    wx.stopAccelerometer({
      success: res => {
        console.log("停止读取")
        _this.setData({ accelerometerX: null, accelerometerY: null, accelerometerZ: null, activity: null })
      }
    })
    wx.offAccelerometerChange()
  },

  saveAcc() {
    console.log("save...")
    let accXs = this.data.accXs, accYs = this.data.accYs, accZs = this.data.accZs, timeSs = this.data.timeSs;
    
    accelerometerDB.add({
      data: { accXs: accXs, accYs: accYs, accZs: accZs, timeSs: timeSs}
    })
      .then(res => { console.log("保存成功") ;
        wx.showToast({
          title: '保存成功',
        })
      })
      .catch(res => { console.log("保存失败") })
  },

  // startVoice: function () {
  //   innerAudioContext.play()
  // },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
})