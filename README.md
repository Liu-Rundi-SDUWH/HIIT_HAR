# HIIT_HAR
HIIT人类活动识别
##文件夹说明
+  数据
  +原始数据：通过微信小程序利用手机三轴传感器采集到的原始数据
  +数据处理代码
    + DealDataFromWXto43.py：将原始数据转化为包含40个特征的数据样本
    + normalizeData.py：将包含40个特征的数据样本进行标准化处
  +模型创建与训练
    + trainBPtoGetNetwork.py：通过BP神经网络训练得到神经网络参数
    + trainBPandGetCorrection.py：验证该神经网络的测试准确率
    + predictDataFromWX.py：预测
  + 小程序源码：微信小程序源代码
