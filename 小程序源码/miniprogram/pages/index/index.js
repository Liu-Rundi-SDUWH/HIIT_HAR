// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
  _BLE: function() {
    wx.navigateTo({
      url: '../recog/recog',
    })
  },
  _ACC: function() {
    wx.navigateTo({
      url: '../choose/choose',
    })
  }
})