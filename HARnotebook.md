

# “Indoor HIIT”运动姿态识别计数算法+小程序

[TOC]

**此小程序能够识别以下四个“Indoor HIIT”动作，动作名称及动作要领：**

+ 深蹲 (squat)：双臂平举，两手掌心相对
+ 开合跳 (jumpingJack)：双臂在体侧画弧线，掌心朝前
+ 高抬腿 (highStep)：双臂在体侧前后摆动，类似原地跑步
+ 滑雪跳 (skiJump)：双臂在体侧随步伐前后摆动，向前的手掌摆至与下颚齐平

**姿态识别小程序使用方法：**

+ 点击“姿态识别”，进入“个人信息填写”页面，测试者可以填写姓名、年龄、身高、体重、测试环境等信息，以便于更好地在数据库中进行记录。

+ 信息填写完毕后，进入“姿态识别”界面。

+ 点击“开始识别”按钮后，开始进行姿态识别。

  > 说明：
  >
  > 点击“开始识别”按钮后，会听到一段提示音——“3,12,1开始”
  >
  > 提示音结束后开始做动作，一直做到听到语音播报，之后再进行下一个动作。

+ 30s 时间到后，会响起“时间到，识别结束”提示音，此时识别结束。界面显示每个动作的个数。

+ 点击“存储数据”，会将个人填写的信息以及识别的动作及个数存入数据库“accelerometer”中。



## 一、数据收集

利用微信小程序，使用手机自带的加速度传感器，采集10s 动作数据，每个动作重复采集50次。

小程序的数据采集页面：squat、jumpingJack、highStep、skiJump

### 1.小程序使用方法

+ 点击“开始读取”，程序开始计时，进度条进入10s 进程。使用者开始重复做对应的动作。
+ 10s 时间到时，手机会发出“滴滴——”声进行提示。
+ 点击“存储数据”，对应动作10s 内采集的数据会被存入对应名称的collection里面。

### 2.JS页面代码讲解

四个采集页面的代码类似，下面以 squat 页面为例进行介绍。

#### 1）调用手机的加速度传感器

```javascript
//在 onload 函数里 打开加速度传感器监听
wx.startAccelerometer({
      interval: 'normal',   //200ms/次
      success: res => { console.log("调用成功"); },
      fail: res => { console.log(res) }
    });
  },
```

```javascript
startAccelerometer: function (e) {  
    this.setData({ startTime: new Date().getTime()})    //获取当前时间
    let _this = this;
    _this.setData({ isReading: true })                  //显示存储数据按钮和进度条
    let accXs = [];
    let accYs = [];
    let accZs = [];
    let timeSs = [];

    // 监听加速度数据
    wx.onAccelerometerChange(function (res) {           
      let mid_time = new Date().getTime();              //获取当前时间（监听时间）
      console.log("mid-time: ", mid_time, "startTime: ", _this.data.startTime)
      console.log(res.x, res.y, res.z, mid_time )

      let timeStep = (mid_time - _this.data.startTime) / 1000     //监听时间与打开时间的差值（时间间隔）   
      _this.setData({ value: parseInt(timeStep * 10), displayValue: parseInt(timeStep)});
      if (timeStep < 10) {            //间隔不到10s 时，持续将监听数据存储
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
      if (timeStep >= 10) {            //间隔到10s 
        _this.setData({ value: 100, displayValue: 10});     //进度条满进程
        _this.stopAccelerometer();   // 停止监听
        innerAudioContext.play()     //播放停止音乐（在 3中会解释如何进行配置）
        _this.setData({ accXs: accXs, accYs: accYs, accZs: accZs, timeSs: timeSs })
        return;
      }
    })
  }
```

```javascript
stopAccelerometer: function () {
    let _this = this
    this.setData({ isReading: false })
    wx.stopAccelerometer({
      success: res => {
        console.log("停止读取")
        _this.setData({ accelerometerX: null, accelerometerY: null, accelerometerZ: null, activity: null })    //加速度数据清空
      }
    })
    wx.offAccelerometerChange()  // 取消监听加速度数据事件
  },
```

#### 2）存储采集的数据到云数据库

```javascript
//配置云数据库以及存储到的collection
const db = wx.cloud.database({ env: 'second-917' });
const accelerometerDB = db.collection('squat')
```

```javascript
//存储采集的数据到云数据库
saveAcc() {
    console.log("save...")
    let accXs = this.data.accXs, accYs = this.data.accYs, accZs = this.data.accZs, timeSs = this.data.timeSs;
    
    //写入云数据库
    accelerometerDB.add({
      data: { accXs: accXs, accYs: accYs, accZs: accZs, timeSs: timeSs}
    })
      .then(res => { console.log("保存成功") ;
        //显示“保存成功”的对话框
        wx.showToast({
          title: '保存成功',
        })
      })
      .catch(res => { console.log("保存失败") })
  },
```

#### 3）“时间到”声音的配置

```javascript
//配置音频
const innerAudioContext = wx.createInnerAudioContext()
```

```javascript
//在onload 函数里
innerAudioContext.autoplay = false   //设置音频为“不自动播放
innerAudioContext.src = 'cloud://second-917.7365-second-917-1302086118/alarm.mp3'   //选取音频所在位置（对应音频提前存储入云数据库中）
```

```javascript
 innerAudioContext.play()     //播放音频
```

## 二、数据处理与模型训练

将存储进云数据库的四个动作的数据导出为“csv”格式文件。使用python进行数据处理和模型训练。

### 1.数据处理

#### 1）数据预处理思路

参考文献：[WISDM:Cell Phone-Based Biometric Identification][http://www.cis.fordham.edu/wisdm/includes/files/btas10.pdf]

基于原始加速度计读数，总共生成了40个维度的feature。下面介绍这40个要素，并在方括号中注明了每种要素类型生成的要素数量：

+ 平均值[3]：平均加速度值（每个轴）
+ 标准偏差[3]：标准偏差（每个轴）
+ 平均绝对差[3]：在200个读数中，每个绝对值之间的平均绝对差 ED和这200个值的平均值（每个轴）
+ 平均结果加速度[1]：ED的每个轴上值的平方和的平方根为√（xi2 + yi2 + zi2 ）
+ Bined Distribution [30]：我们确定每个轴的值范围（最大-最小），除以将该范围分为10个大小相等的容器，然后记录落入每个容器中的200个值的分数。

#### 2）数据预处理部分的python代码讲解

##### ①导入必要的包

```python
#导入必要的包
import csv
from csv import reader
import numpy as np
```

##### ②加载csv数据，并将每行的数据转化为一个数组

```python
# Load a CSV file
def load_csv(filename):
    dataset = list()
    with open(filename, 'r') as file:
        csv_reader = reader(file)
        for row in csv_reader:
            if not row:
                continue
            dataset.append(row)
    return dataset

def write_csv(filename,text):
    with open(filename, 'a',newline='') as f:
        writer = csv.writer(f)
        writer.writerow(text)

# 删除每行数据首尾的 [ ] ,并按照 , 分隔将转化为浮点数的数据存入数组
def dealdata_every(data):
    data = data.replace('[','')
    data = data.replace(']','')
    data = data.split(",")

    df = list()
    for i in range(len(data)):
        df.append(float(data[i]))
    return df
```

##### ③将数据转化为40个feature

```python
#平均值
def average(dataset):
    sum = 0
    for i in range(len(dataset)):
        sum = sum + dataset[i]
    average = sum/(len(dataset))
    return average

#标准偏差
def standardDeviation(dataset,ans,tag):
    sum = 0
    for i in range(len(dataset)):
        sum = sum + (dataset[i] - ans[tag])**2     #tag：0-x  1-y  2-z
    standardDeviation = (sum/(len(dataset)))**0.5
    return standardDeviation

#平均绝对差
def averageAbsoluteDifference(dataset,ans,tag):
    sum = 0
    for i in range(len(dataset)):
        diff = dataset[i] - ans[tag]    #0-x  1-y  2-z
        if(diff >= 0):
            sum = sum + diff
        else:
            sum = sum - diff
    averageAbsoluteDifference = sum/(len(dataset))
    return averageAbsoluteDifference

#平均结果加速度
def averageResultantAcceleration(dataset,total):
    for i in range(len(dataset)):
        total = total + dataset[i] ** 2
    return total

#binned Distribution
def binnedDistribution(dataset):
    value_min = min(dataset)
    value_max = max(dataset)
    minmax = [value_min, value_max]
    print('minmax',minmax)

    flag = [0,0,0,0,0,0,0,0,0,0]
    for i in range(len(dataset)):
        dataset[i] = (dataset[i] - minmax[0]) / (minmax[1] - minmax[0])
        if 0 <= dataset[i] <= 0.1:
            flag[0] = flag[0] + 1
            print("++++++++++++",i,dataset[i])
        elif 0.1 < dataset[i] <= 0.2:
            flag[1] = flag[1] + 1
        elif 0.2 < dataset[i] <= 0.3:
            flag[2] = flag[2] + 1
        elif 0.3 < dataset[i] <= 0.4:
            flag[3] = flag[3] + 1
        elif 0.4 < dataset[i] <= 0.5:
            flag[4] = flag[4] + 1
        elif 0.5 < dataset[i] <= 0.6:
            flag[5] = flag[5] + 1
        elif 0.6 < dataset[i] <= 0.7:
            flag[6] = flag[6] + 1
        elif 0.7 < dataset[i] <= 0.8:
            flag[7] = flag[7] + 1
        elif 0.8 < dataset[i] <= 0.9:
            flag[8] = flag[8] + 1
        else:
            flag[9] = flag[9] + 1
    for i in range(10):
        flag[i] = flag[i]/len(dataset)
    return flag
```

##### ③将数据进行处理，转化为40个feature，并存储为一个新的csv文件

```python
output = list()
dataset = load_csv("squat.csv")
print('dataset',dataset)

for line in range(len(dataset)):
    s=[0,1,2]                #前三列，对应x轴、y轴、z轴
    ans = list()

    for i in s:             #对每一列都进行处理
        data = dataset[line][i]
        df = dealdata_every(data)
        mean = average(df)
        ans.append(mean)
    # print('ans',ans)
    for i in s:
        data = dataset[line][i]
        df = dealdata_every(data)
        sd = standardDeviation(df, ans,i)
        ans.append(sd)
    # print('ans',ans)
    for i in s:
        data = dataset[line][i]
        df = dealdata_every(data)
        aad = averageAbsoluteDifference(df,ans,i)
        ans.append(aad)
    # print('ans',ans)
    total = 0
    for i in s:
        data = dataset[line][i]
        df = dealdata_every(data)
        # print('total', total)
        total = averageResultantAcceleration(df,total)
    ara = total ** 0.5
    ans.append(ara)
    # print('ans',ans)
    for i in s:
        data = dataset[line][i]
        df = dealdata_every(data)
        bd = binnedDistribution(df)
        print('bd',bd)
        ans = ans + bd
    # print('ans',ans)
 
    write_csv('squat_new.csv',ans)    #生成一个新的csv文件
```

### 2.模型训练

使用BP神经网络对模型进行训练，目的是：

输出训练好的神经网络，可以直接用在小程序“姿态识别”界面的的JS页面中，当做一个参数来做离线识别。

#### 1）数据标准化

##### ①导入必要的包

```python
import csv
from random import seed
from csv import reader
```

##### ②加载CSV文件，并将数据转化成浮点数，标签值转化为整数

```python
# Load a CSV file
def load_csv(filename):
    dataset = list()
    with open(filename, 'r') as file:
        csv_reader = reader(file)
        for row in csv_reader:
            if not row:
                continue
            dataset.append(row)
    return dataset

# Convert string column to float
def str_column_to_float(dataset, column):
    for row in dataset:
        row[column] = float(row[column].strip())

# Convert string column to integer
def str_column_to_int(dataset):
    for row in dataset:
        row[-1] = int(row[-1])
```

##### ③获取每一维数据的最大最小值，进行数据的标准化处理，将标准化后的数据存储为一个新的CSV文件

> 注：每一维数据的最大最小值需要存储下来，以便于后期可以直接用在小程序“姿态识别”界面的的JS页面中，当做一个参数来对实时收集的三轴加速度进行标准化处理。

```python
# Find the min and max values for each column
def dataset_minmax(dataset):
    return [[min(column), max(column)] for column in zip(*dataset)]


# Rescale dataset columns to the range 0-1
def normalize_dataset(dataset, minmax):
    for row in dataset:
        for i in range(len(row) - 1):
            row[i] = (row[i] - minmax[i][0]) / (minmax[i][1] - minmax[i][0])

def write_csv(filename, text):
    with open(filename, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(text)
```

##### ④运行程序

```python
# Test Backprop on Seeds dataset
seed(1)

# load and prepare data
filename = 'output.csv'
dataset = load_csv(filename)
for i in range(len(dataset[0]) - 1):
    str_column_to_float(dataset, i)
    
# convert class column to integers
str_column_to_int(dataset)

# normalize input variables
minmax = dataset_minmax(dataset)

print('minmax',minmax)
normalize_dataset(dataset, minmax)

for i in range(len(dataset)):
    write_csv("normalize_data.csv",dataset[i])
print("end")
```

**得到的最大最小值集合（minmax_set)为： **

```javascript
 minmax_set:[[-2.743077273, -0.518352963], [-0.404787994, 3.555968892], [-0.94638473, 0.465235975], [0.219799284, 3.140370576], [0.077494063, 2.192600274], [0.071618402, 2.378020167], [0.187300666, 2.242155118], [0.064827377, 1.75513429], [0.056584696, 1.647934474], [13.02097723, 94.23384748], [0.003703704, 0.091603053], [0.0, 0.255060729], [0.0, 0.534482759], [0.029268293, 0.526119403], [0.016194332, 0.633064516], [0.012, 0.689243028], [0.007968127, 0.37254902], [0.0, 0.341317365], [0.0, 0.418699187], [0.004504505, 0.320987654], [0.003921569, 0.233480176], [0.0, 0.661290323], [0.0, 0.737051793], [0.0, 0.436], [0.023923445, 0.482213439], [0.0, 0.507177033], [0.0, 0.415322581], [0.0, 0.22], [0.0, 0.184466019], [0.003891051, 0.112403101], [0.003496503, 0.059701493], [0.0, 0.151639344], [0.0, 0.290983607], [0.0, 0.463114754], [0.0, 0.709163347], [0.0, 0.450757576], [0.008196721, 0.758064516], [0.011363636, 0.699186992], [0.0, 0.687747036], [0.003984064, 0.164233577]]
```

#### 2）BP神经网络 模型训练

##### ①导入必要的包

```python
import csv
from csv import reader
from math import exp
from random import seed
from random import random
```

##### ②模型训练

```python
# Initialize a network
def initialize_network(n_inputs, n_hidden, n_outputs):
    network = list()
    hidden_layer = [{'weights': [random() for i in range(n_inputs + 1)]} for i in range(n_hidden)]
    network.append(hidden_layer)
    output_layer = [{'weights': [random() for i in range(n_hidden + 1)]} for i in range(n_outputs)]
    network.append(output_layer)
    return network

# forward_propogate
def forward_propagate(network, row):
    inputs = row
    for layer in network:
        new_inputs = []
        for neuron in layer:
            #activation
            weights = neuron['weights']
            activation = weights[-1]
            for i in range(len(weights)-1):
                activation += weights[i] * inputs[i]
            #transfer
            neuron['output'] = 1.0/(1.0 + exp(-activation))

            new_inputs.append(neuron['output'])
        inputs = new_inputs
    return inputs

# Backpropagate error and store in neurons
def backward_propagate_error(network, expected):
    for i in reversed(range(len(network))):
        layer = network[i]
        errors = list()
        if i != len(network) - 1:
            for j in range(len(layer)):
                error = 0.0
                for neuron in network[i + 1]:
                    error += (neuron['weights'][j] * neuron['delta'])
                errors.append(error)
        else:
            for j in range(len(layer)):
                neuron = layer[j]
                errors.append(expected[j] - neuron['output'])
        for j in range(len(layer)):
            neuron = layer[j]

            #transfer_derivation
            output = neuron['output']
            output = output * (1.0 - output)

            neuron['delta'] = errors[j] * output

# Update network weights with error
def update_weights(network, row, l_rate):
    for i in range(len(network)):
        inputs = row[:-1]
        if i != 0:
            inputs = [neuron['output'] for neuron in network[i - 1]]
        for neuron in network[i]:
            for j in range(len(inputs)):
                neuron['weights'][j] += l_rate * neuron['delta'] * inputs[j]
                neuron['weights'][-1] += l_rate * neuron['delta']

# Train a network for a fixed number of epochs
def train_network(network, train, l_rate, n_epoch, n_outputs):
    for epoch in range(n_epoch):
        sum_error = 0
        for row in train:
            outputs = forward_propagate(network, row)
            expected = [0 for i in range(n_outputs)]
            expected[row[-1]-1] = 1
            sum_error += sum([(expected[i]-outputs[i])**2 for i in range(len(expected))])
            backward_propagate_error(network, expected)
            update_weights(network, row, l_rate)
        print('>epoch=%d, lrate=%.3f, error=%.3f' % (epoch,l_rate,sum_error))
```

**学习率为0.05，循环500次，选取隐藏层14个进行训练**：

error下降至：0.060

<img src="C:\Users\Dell\Desktop\image-20200613201045051.png" alt="image-20200613201045051" style="zoom:50%;" />

network为：

```javascript
network:[[
    {'weights': [1.8645375773413766, 2.787694713312568, 1.0946291557646037, 1.2785953885942172, 1.1617485272396402, 0.9400903643131504, 1.6870386102178958, 1.2438753338550776, 0.4738524080275085, 0.47115954119171766, 0.9259771357014642, 0.7480583559049567, 1.0676312480204306, -0.19283847765155918, 0.38745238168895274, 0.8844239540296313, -0.1883139292061524, 0.6259522904638418, 0.3248132037975169, 0.3021512683884548, 0.3043170486214988, 0.5561977105168295, 1.961150232929744, 0.008630833142606362, -0.14745459211829415, -0.17516394597693155, 0.0037328672004576843, -0.9319866251327958, -0.2005393835872349, 0.41752249496943045, 0.17136823163388523, -0.13246192533377374, 0.12230164677704143, 1.012994768112834, 1.5851571828331372, 0.32854095276517997, 0.6388290745172488, -0.19230526390574285, -0.3666380050058219, -0.22237183582248102, -7.0933747477265605], 'output': 0.9617052948568922, 'delta': -1.7163175261953703e-06} ,
    {'weights': [0.8364553822314821, 0.11661598765340099, 0.3231536404269374, 0.7222964565426973, 0.7144619099574853, 0.9376851851611024, 0.4237539646097634, 0.8346748105971913, 0.6729305005233885, 0.30576249688063856, 0.5822975428553404, 0.8783377518524261, 0.8425237817803181, 0.5027402492719124, 0.5880598955458218, 0.02716812564224694, 0.23792675255333504, 0.793092898011446, 0.414131625630775, 0.17077246988742864, 0.547627531299954, 0.7007929385146585, 0.6650679431568811, 0.36832431648190805, 0.43186351429023584, 0.5048517911994729, 0.778639252476735, 0.5256727396395579, 0.39603997799701096, 0.489112178169397, 0.03049763625034244, 0.044991329881279706, 0.7045797314175147, 0.9832589943820704, 0.5860184900978974, 0.395446583053058, 0.1713372790678277, 0.4936297027134814, 0.974225942030995, 0.7650595933805107, -0.07881156752404243], 'output': 0.9992506012669167, 'delta': -1.1897947840738784e-08},
    {'weights': [0.8798102748866726, 0.23206032904316126, 0.5251293579980219, 0.9503230313181739, 0.5736526974308704, 0.4580251606979069, 0.26691178354031125, 0.5433859378245495, 0.9554820864181681, 0.004133307110018205, 0.7903990988488413, 0.8251901374847651, 0.8906818487600637, 0.7450236612355325, 0.8125153692531183, 0.5217082320686218, 0.571629664382442, 0.4344920321838856, 0.06064258539397928, 0.871539495885359, 0.57447050273657, 0.20504719048302164, 0.5097738574297207, 0.4965577690066619, 0.3665188780005567, 0.35162883795394956, 0.5393579740564137, 0.6215849263256282, 0.6120748662926204, 0.45847672573138804, 0.02981016903983021, 0.23066445396165106, 0.177324606836045, 0.5846302561314382, 0.8620084337296884, 0.803780137580382, 0.8039968146367383, 0.8258656622046143, 0.26204029028484077, 0.8465012629974394, 1.5180462785764086], 'output': 0.9998802988825186, 'delta': -1.1951124562054688e-09},
    {'weights': [3.6655074517786845, -1.2673493704946113, 0.6894381714738602, 0.016403237802592147, 2.16645240456644, -1.8989601099444684, 0.07432592580736676, 2.4031804222010122, -2.0124902376255096, -1.1851967573074575, -1.174481040171925, -0.30525136569094763, -1.7985440246853943, -1.7041195804259774, -2.157275592321211, -1.0503961078275998, 2.2251096445650127, 4.168328357572717, 5.370709010077209, 2.8510560502692326, 1.5689459239750025, 0.35721975583646853, -0.5786935839584177, 0.9680816239088013, -0.05553908706829988, 0.9824533530141533, 1.2334518149900442, 0.5448863861869281, -1.1311492833696388, 0.5506319372463387, -0.6048600524511417, -0.44097484367965284, 1.0555345669459866, 0.23496356708787924, 2.5497654470133138, 2.3022080866868486, 0.30375378139095616, -0.6335631015053902, -0.47225725784021244, -0.6688862667695459, -8.390018359673185], 'output': 0.9972890907744049, 'delta': 1.3950191019762825e-06},
    {'weights': [0.3849825906460093, 0.5662396208687357, 0.31998558230495544, 0.6265718432574475, 0.056794282910012955, 0.29599962862983004, 0.9659289914539063, 0.8755697297904826, 0.30529436499497453, 0.8572262276825628, 0.3147500153987107, 0.9433742042975464, 0.7446406005931824, 0.4165759151097122, 0.25381604920098266, -0.00978222567097721, 0.8856809646310503, 0.04431921432158362, 0.825747945422992, 0.9616557833949665, 0.5800992334088185, 0.17750547943993147, 0.8534609724336265, 0.982939190531056, 0.7077587466816344, 0.5050240401139187, 0.37390331510332525, 0.34667060623205775, 0.2076601441004754, 0.671119130161824, 0.4355381725157142, 0.19603785158491976, 0.10577434865883333, 0.6662286330619946, 0.27940983580447987, 0.5162752412295383, 0.33894035940515255, 0.8681560413077363, 0.8914295227058354, 0.011704267986136095, 0.10540685291979812], 'output': 0.9988756531805986, 'delta': -2.7851647366261196e-08},
    {'weights': [0.3407282681737614, 0.986292376066543, 0.7924026574570825, 0.33865953228003354, 0.21213994703942232, 0.6744861294248792, 0.8374142586897095, 0.9312788512479665, 0.3437820286896327, 0.8824481932693442, 0.691651378294742, 0.48767786353148446, 0.9884957398294172, 0.2378505616911366, 0.7284015426861343, 0.08667852466951553, 0.1790185437534905, 0.9185669853900468, 0.21723927729568326, 0.7605762763628934, 0.604171440380462, 0.8449901204299218, 0.3705379713006865, 0.34931350720127324, 0.29844148887934496, 0.8722646694488224, 0.6062281256902657, 0.9557289578114251, 0.8883744029772697, 0.13636893159340754, 0.5531387488620985, 0.10536558262973662, 0.03961672531261698, 0.07348251656496027, 0.8657313726637972, 0.7923090053275192, 0.8344057196690384, 0.34954107373260856, 0.6203021158441049, 0.7855300513764968, 1.0604196728325832], 'output': 0.9998310651272875, 'delta': -4.679460343788873e-10},
    {'weights': [0.6169629593956132, 0.2267029999411472, 0.10818264124122087, 0.2637510863739997, 0.8830433105389213, 0.5626587454295159, 0.9213266683953921, 0.44881622447867475, 0.27427959391136186, 0.7846335322048084, 0.8488932646166415, 0.026964533359279414, 0.6805889248212754, 0.09869380956305573, 0.1213314608666795, 0.8943304670256654, 0.05914848284558201, 0.2601652461970609, 0.9997568460751612, 0.4243430725772013, 0.13053794979448785, 0.18222345424921543, 0.2588321162687485, 0.7687660297768955, 0.11887006430298841, 0.9186474457794211, 0.3785486602369958, 0.9642794986759792, 0.9065552769458206, 0.2939465851583129, 0.25530278945270274, 0.4794047495261436, 0.100362319509891, 0.6539521865913337, 0.04893934625284654, 0.03356361672875893, 1.0006811243661309, 0.30898599789569003, 0.6033456669745106, 0.45519353242534016, 2.2352281054229], 'output': 0.9996172120291867, 'delta': -2.3960274958930847e-09}, 
    {'weights': [0.08869164020240894, 0.9122382391557335, 0.9898259938643592, 0.9688979763815376, 0.10954792278583797, 0.21553984680177166, 0.6172612731011402, 0.9781380366772321, 0.543006438730936, 0.6886868494538905, 0.6723631684685714, 0.2666724575236421, 0.548776537443223, 0.3145527655549157, 0.2526002993978504, 0.08449520573189914, 0.3006422050052341, 0.9960108801030858, 0.45485685433219625, 0.6539440021003665, 0.6519226603220237, 0.9493415242718876, 0.3954572874736073, 0.3257603599970827, 0.34370268248753755, 0.3250177882993728, 0.8490354987197409, 0.8941255565955434, 0.3046176197259641, 0.33573281507683944, 0.5467627274563922, 0.5809992060711305, 0.5967385733652527, 0.2456628987987726, 0.019117450236965223, 0.2549268147792123, 0.08654255820657124, 0.5646930660668743, 0.0807256831277157, 0.08218550736502464, 1.9876317872152236], 'output': 0.9998230094513814, 'delta': -8.280552478761085e-09}, 
    {'weights': [0.2683503377778334, 0.7859804854721218, 0.4788481081388988, 0.8601818562973473, 0.15461672853556668, 0.4986580009501584, 0.7944224744084789, 0.07899503883588985, 0.9476999803660637, 0.1715717183409648, 0.772209787146477, 0.9831217669998097, 0.8175685512703126, 0.31586407617822454, 0.10337879397661749, 0.49715100541098095, 0.9140652789784932, 0.2905254307303068, 0.8939348892485404, 0.14043912312757492, 0.9108507171427984, 0.02804247340247369, 0.29884008624978486, 0.8976848319470393, 0.7987092832306798, 0.9027796294890691, 0.8389817550227462, 0.7462671505908914, 0.6897464684221458, 0.17571984681168062, 0.43232935624397717, 0.15709671803865752, 0.7147827791183717, 0.6669602651744292, 0.2384251281616755, 0.06568568501826719, 0.9620666006867142, 0.7993278681256549, 0.5418869263656889, 0.5360672903981183, -0.09657707009998434], 'output': 0.9987684057327934, 'delta': -3.778545017188815e-11}, 
    {'weights': [0.6459446434643217, 1.6478226175706094, 0.07511479733948635, 0.7733336018610069, -0.45367575835039825, 1.187755014139173, 0.8266036403136456, -0.04133536290420544, 0.5220371702552661, 0.7608402064794051, 0.3841101893712747, 0.2736576080813597, 0.995968782325583, 1.3968310151864105, 0.792212676252092, 0.4537390907712364, -0.28252133632241866, -0.8249456105544041, -0.7444186535936776, 0.06357010679002165, 0.31063110814980815, 0.757871358243289, 1.0640725931294062, 0.6091484012533092, 0.4600912022501963, -0.121506348142175, 0.32086014034769317, -0.336898299261226, 0.09734877770200591, 0.2748360455710702, 0.44801410586968216, 0.7319013649746786, 0.6026476510318803, 0.38686053317049157, 0.9010172365470941, -0.30407871512846807, 0.3999357310958147, 0.3372786212565479, 0.5621266303024033, 0.15763577986911015, -5.069057524332739], 'output': 0.14386107544366233, 'delta': -1.2206284867577335e-05}, 
    {'weights': [0.8779088163273008, 0.31251498309372816, 0.6882946028360024, 0.8487710771868906, 0.37089998893733944, 0.701187405659334, 0.7360366156652715, 0.5938121615635498, 0.8562254479500705, 0.8964762850572684, 0.9596908332466907, 0.5709941839186664, 0.17555613717867294, 0.249424710139664, 0.21732759608038685, 0.5680848720452534, 0.7523087755095241, 0.04913922301371774, 0.6802106029894525, 0.7162858651809046, 0.3470731353972611, 0.5145067698884153, 0.16419461296033275, 0.7268512902199438, 0.03725475251074454, 0.9786477107292351, 0.8065845647488826, 0.6269016112123585, 0.26676375027926663, 0.912069220192969, 0.9589320755141472, 0.1389365446149362, 0.7755813130418558, 0.842174507362265, 0.6600476806765021, 0.701398719155556, 0.44514907808770715, 0.9188737228592918, 0.9669156339185717, 0.37949434516022357, 0.5398233975603471], 'output': 0.999792915058962, 'delta': -4.600583676941311e-09},
    {'weights': [-1.147484231711527, 0.6184942113399973, 0.7981803482035462, 1.793726221540367, 3.5276462479028137, 1.7663650030638378, 1.912072518385698, 3.347151669889573, 1.3567468083083574, 1.529132797637487, -0.23327567943995314, -0.29803197889465716, 0.14752938897481527, -0.5793271630295689, -0.22683119031629245, 1.009977892321143, 0.6821791397647343, 0.9108285510582987, 0.8878350730479972, 0.9368030799912724, 0.6704745986039641, 0.4530911723715337, 0.5584444697708373, -0.5627583442724672, -0.21347376276443583, 0.09130343327171005, 1.1849294207045475, 1.449372283568006, 0.8629395320099268, 1.2615073280201237, -0.385658073042065, 0.27424636432549526, 0.7972046578038368, 0.6243186692584836, 1.1632971844488607, 0.8209914051517154, 0.33265985897232997, -0.24683517052934564, 0.30635712045772817, -0.41032695472229236, -7.007592142764414], 'output': 0.9913549516024047, 'delta': -1.6255775143945735e-06},
    {'weights': [6.295528365711721, 6.891016543293002, -0.11269092505030265, 2.457844008552254, -0.07111048908816026, 0.35611633338076765, 2.0459348237649486, -0.5563173143320873, -0.1375079906681559, 0.7619684734202637, 1.333761691820315, 2.1578921190814944, 2.5740674343061296, 1.1456744302807529, -0.6615507942165914, -1.544148842230633, -1.3625361187645126, 0.8185997609491229, 0.2895038465651119, 1.8991023598878858, 0.9368385084710371, 0.16515734336159982, 1.7521536740613075, 0.7209581635594429, 0.4921499722563414, 0.01949705151368081, -0.12129296228674696, -2.8483334959076787, -0.5610322396442764, 1.1907934728849652, 0.29772190219075034, -1.2758239396638649, 0.003899133780176619, 1.6409312669323062, 2.3954526207434967, 0.3962006591429902, 0.7798484143674541, -0.392061620647222, -1.2477283842816977, -0.045268821126290264, -9.590081001964467], 'output': 0.9861585286234671, 'delta': 3.786652780824028e-06}, 
    {'weights': [0.4175832264601115, 0.40029865248675756, 0.8573999670603757, 0.5820554140613682, 0.7323871641576704, 0.896389525305611, 0.7471904584490681, 0.4920882174366117, 0.7449318051968279, 0.6391580887450785, 0.6475195645146017, 0.6288080588688904, 0.4058600418415306, 0.628578009763634, 0.6326962899787637, 0.9302909803060415, 0.7839534054197311, 0.8475995567844858, 0.7691494678656835, 0.8150357459964297, 0.6063055341280289, 0.348782674900888, 0.25760464261963506, 0.7086334558497397, 0.8739201799705891, 0.5437572806715234, 0.15182152407880004, 0.8344636931426601, 0.4851176271395414, 0.4660034965633302, 0.04612167983113967, 0.5105556207726059, 0.7448784784165188, 0.42177746847040354, 0.3480284121557501, 0.6587643076561287, 0.02189511856238291, 0.5059845534762419, 0.944250960797845, 0.688905208565854, 0.18829376246365684], 'output': 0.9996502730305478, 'delta': -3.4163955873171752e-09}],
         [
             {'weights': [0.1553265185837218, 0.2641190679521454, -0.18994336995441002, -0.2758035278191041, 0.54356285504539, -0.09734490322800408, -0.29785048682366566, 0.4531182305035609, 0.18400750245499642, -0.5300558315105316, 0.1309838883675853, 8.613476234827735, -9.810280303155317, 0.2835594143287649, -5.056393895207247], 'output': 0.0059392793089575275, 'delta': -3.506553040227915e-05}, 
             {'weights': [3.2012320996585975, -0.20495324286237593, 0.128634604574975, -8.476731367592052, 0.07635351289526879, -0.3082342380071054, 0.317212312988691, 0.38333054483800816, -0.16889833968321374, 2.5504771230199856, 0.4784638890388762, -0.7582206400549927, 6.4119198178583865, -0.45744238557172845, -5.930074412433932], 'output': 0.005930813091181533, 'delta': -3.496593027695817e-05},
             {'weights': [3.061423536716262, -0.5976158899478359, -0.5252374241621082, 9.099507239989903, -0.1318137877381025, -0.734709271856215, -0.24230437259915036, -0.757320706904249, 0.022927321571784717, -1.238120450796173, -0.03818273684184614, 3.7069084402582444, 6.827827458724332, -0.6854371682265077, -13.229138388500715], 'output': 0.9951849306089982, 'delta': 2.3073256370388546e-05}, 
             {'weights': [-3.871521394724361, 0.08289066197906149, 0.7520890206810302, 0.7759410914481532, 0.7190524697702855, 0.2175746825061811, 0.6070230373967397, 0.7066443220598753, 0.3168525850161182, -1.5214752975853334, 0.41184485361474577, -8.734198186209264, -1.9147571239707426, 0.19516164529204405, 1.146933188023189], 'output': 0.00019137536369093092, 'delta': -3.6617520795120267e-08}
         ]]
```

##### ③模型准确率验证

采用十倍交叉验证法对该模型的准确率进行验证，得到：

![image-20200613201645623](C:\Users\Dell\Desktop\image-20200613201645623.png)

## 三、小程序实现动作识别与计数

利用微信小程序，使用手机自带的加速度传感器，在30s 内随机做上述四个动作，小程序会自动进行识别并进行识别动作的语音播报；30s 结束后，小程序页面显示每个动作的个数，并可以将数据存入云数据库。

小程序的姿态识别页面：recog

### 1.小程序使用方法

+ 点击“姿态识别”，进入“个人信息填写”页面，测试者可以填写姓名、年龄、身高、体重、测试环境等信息，以便于更好地在数据库中进行记录。

+ 信息填写完毕后，进入“姿态识别”界面。

+ 点击“开始识别”按钮后，开始进行姿态识别。

  > 说明：
  >
  > 点击“开始识别”按钮后，会听到一段提示音——“3,12,1开始”
  >
  > 提示音结束后开始做动作，一直做到听到语音播报，之后再进行下一个动作。

+ 30s 时间到后，会响起“时间到，识别结束”提示音，此时识别结束。界面显示每个动作的个数。

+ 点击“存储数据”，会将个人填写的信息以及识别的动作及个数存入数据库“accelerometer”中。

### 2.JS页面代码讲解

#### 1）数据准备

放入预先在python中训练得到的 minmax_set 和 network 

#### 2）手机三轴加速度计的调用

打开和停止加速度传感器监听代码 同上。

```javascript
//设置一个定时器，每6s打开一次加速度计的监听
let _this = this
_this.data.setInterId = setInterval(_this.startAccelerometer,"6000");
```

```javascript
wx.onAccelerometerChange(function (res) {
      let mid_time = new Date().getTime();
      console.log("mid-time: ", mid_time, "startTime: ", _this.data.startTime)

      let timeStep = (mid_time - _this.data.startTime) / 1000
      _this.setData({ value: parseInt(timeStep * 10 / 3), displayValue: parseInt(timeStep)})
    
    //设置一个读取标志 time_index,time_index每到 100 进行一次动作识别
      if(time_index != 100 ){
        let accXs = _this.data.accXs
        let accYs = _this.data.accYs
        let accZs = _this.data.accZs
        let timeSs = _this.data.timeSs

        console.log("搜集中...")

        accXs.push(res.x)
        accYs.push(res.y)
        accZs.push(res.z)
        timeSs.push(mid_time)
        time_index = time_index + 1
        
        _this.setData({ accXs: accXs, accYs: accYs, accZs: accZs, timeSs: timeSs })
        _this.setData({
          accelerometerX: parseFloat(res.x.toFixed(5)),
          accelerometerY: parseFloat(res.y.toFixed(5)),
          accelerometerZ: parseFloat(res.z.toFixed(5))
        })
        console.log(res.x, res.y, res.z, mid_time,timeStep,time_index )

      }
    
    //设置一个定时器开启次数start_num，start_num 为5时，标明30s 时间到
        if(start_num > 5) {
          _this.stopAccelerometer();    //停止加速度计监听

          clearInterval(_this.data.setInterId)  //清除定时器
          innerAudioContext4.play()     //结束因响起
          _this.setData({ isReading: false })
          console.log("识别结束")

          let peak_total = _this.data.peak_total
          console.log('峰值点',peak_total)

          start_num = 0
          _this.setData({start_num: start_num})
        } else if(time_index == 100){
        var prediction = 0
        console.log("即将识别该组...")
            
        //调用judgement函数，进行姿态识别
        prediction = _this.Judgement();

        console.log("X",accXs)
        console.log("Y",accYs)
        console.log("Z",accZs)

        if(prediction == 0) {
          innerAudioContext0.play()
          var flag = []
          var num = 0
          
          //调用count函数，进行动作计数（下同理）
          flag.push(_this.count(accXs))
          flag.push(_this.count(accYs))
          flag.push(_this.count(accZs))\
        }
         ... 

        _this.stopAccelerometer();
        _this.setData({ accXs: [], accYs: [], accZs: [], timeSs: [] })  //数据清零
      }     
    })

```



#### 3）提示音配置

同上。

#### 4）动作识别——Judgement、Try、Predict函数

主要思路为将python模型训练中的“数据标准化”部分代码进行JS重写，使其能在小程序中直接运行。

```javascript
Judgement(){
    console.log("识别中...")
    let _this = this
    let accXs = _this.data.accXs, accYs = _this.data.accYs, accZs = _this.data.accZs
    var prediction = 0

    prediction = _this.Try(accXs,accYs,accZs)   //调用Try函数
    //数据清零
    _this.setData({
      accXs:[],
      accYs:[],
      accZs:[],
      timeSs:[]
    })
    return prediction   //返回姿态动作对应的数字
  },
```

```javascript
//传入参数（三个轴的加速度数据 df_x df_y df_z）
Try(df_x,df_y,df_z){
	//计算均值
    this.average(df_x)
    this.average(df_y)
    this.average(df_z)
	//计算标准差
    this.standardDeviation(df_x,this.data.ans,0)
    this.standardDeviation(df_y,this.data.ans,1)
    this.standardDeviation(df_z,this.data.ans,2)
	//计算平均绝对差
    this.averageAbsoluteDifference(df_x,this.data.ans,0)
    this.averageAbsoluteDifference(df_y,this.data.ans,1)
    this.averageAbsoluteDifference(df_z,this.data.ans,2)
	//计算平均结果加速度
    var total = 0
    var ans = this.data.ans
    total = this.averageResultantAcceleration(df_x,total)
    total = this.averageResultantAcceleration(df_y,total)
    total = this.averageResultantAcceleration(df_z,total)
    total = total ** 0.5
    ans.push(total)
    this.setData({
      ans:ans
    })
	//计算binned Distribution
    var ans_bd = []
    ans_bd = this.binnedDistribution(df_x)
    ans = ans.concat(ans_bd)

    ans_bd = this.binnedDistribution(df_y)
    ans = ans.concat(ans_bd)
    ans_bd = this.binnedDistribution(df_z)
    ans = ans.concat(ans_bd)
    this.setData({
      ans:ans
    })
    
	//使用minmax_set 进行数据标准化处理
    ans = this.normalize_dataset(ans, this.data.minmax_set)
    this.setData({
      ans:ans
    })

    var predict_data = [ans]
    for(var i=0; i< predict_data.length; i++){
      var prediction = 0
      prediction = this.predict(this.data.network, predict_data[i])  //调用predict函数

    }
    console.log('prediction',prediction)
    this.setData({
      accXs:[],
      accYs:[],
      accZs:[],
      timeSs:[]
    })
    this.setData({
      ans:[]
    })
    return prediction
  }
```

```javascript
//传入参数(预先训练好的nerwork，需要预测的数据)
predict(network,row){
  var outputs = this.forward_propagate(network,row)
  var outputs_index = outputs.indexOf(Math.max.apply(null, outputs))
  return outputs_index
},
```

#### 5）动作计数——count函数

采用差分法选择峰值，利用峰值进行动作计数。

```javascript
//传入参数（原始的三轴加速度数据）
count(acc){
  let _this = this
  var acc_get=[]

  //每100个加速度数据中选取25个
  for(var i=0; i < acc.length; i = i+4){
    acc_get[i/4] = acc[i]
  }

  let acc_len = acc_get.length

  var diff_v = (new Array(acc_len -1)).fill(0)
  var peak = []
  
  //第一次差分
  for(var i=0; i != diff_v.length; i++){
    if(acc_get[i+1] - acc_get[i] >0){
      diff_v[i] = 1
    } else if(acc_get[i + 1] - acc_get[i] < 0) {
      diff_v[i] = -1
    } else {
      diff_v[i] = 0
    }
  }
  //第二次差分
  for(var i = diff_v.length -1; i>= 0; i-- ){
    if(diff_v[i] == 0 && i == diff_v.length - 1) {
      diff_v[i] = 1
    } else if (diff_v[i] == 0) {
      if (diff_v[i + 1] >= 0){
        diff_v[i] = 1;
      } else {
        diff_v[i] = -1;
      } 
    }
  }

  for(var i=0; i != diff_v.length -1 ;i++){
    if(diff_v[i+1] - diff_v[i] == -2){
      peak.push(i+1)
    }
  }
  console.log('peak峰值点',peak)
  console.log("个数",peak.length)

  // peak_total.push(peak.length)
  return peak.length
  // _this.setData({peak_total: peak_total})
}
```

























