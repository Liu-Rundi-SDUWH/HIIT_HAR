
import csv
from csv import reader
import numpy as np
from scipy import signal  # 滤波等

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

def dealdata_every(data):
    data = data.replace('[','')
    data = data.replace(']','')
    data = data.split(",")

    df = list()
    for i in range(len(data)):
        df.append(float(data[i]))
    # print('df',df)
    return df

def average(dataset):
    sum = 0
    for i in range(len(dataset)):
        sum = sum + dataset[i]
    average = sum/(len(dataset))
    return average

def standardDeviation(dataset,ans,tag):
    sum = 0
    for i in range(len(dataset)):
        sum = sum + (dataset[i] - ans[tag])**2     #0-x  1-y  2-z
    standardDeviation = (sum/(len(dataset)))**0.5
    return standardDeviation

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

def averageResultantAcceleration(dataset,total):
    for i in range(len(dataset)):
        total = total + dataset[i] ** 2
    return total

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

def timeBetweenpeaks(dataset,timeset):
    yyy = np.array(dataset)
    xxx = np.arange(0,len(yyy))
    time = np.array(timeset)

    z1 = np.polyfit(xxx, yyy, 100)  # 用100次多项式拟合
    p1 = np.poly1d(z1)  # 多项式系数
    yvals = p1(xxx)

    # 极值
    num_peak = signal.find_peaks(yvals, distance=10) #distance表极大值点的距离至少大于等于10个水平单位
    time_label = num_peak[0]        #峰值对应的索引

    time_peak = list()
    for i in range(len(time_label)):
        time_peak.append(time[time_label[i]])
    #print(time_peak)               #峰值对应的时间

    sum = 0
    for i in range(1,len(time_peak)):
        sum += time_peak[i] - time_peak[i-1]
    timeBetweenPeaks = sum/len(num_peak[0])
    return timeBetweenPeaks       #峰值平均时间

output = list()
dataset = load_csv("data.csv")
print('dataset',dataset)

for line in range(len(dataset)):
    s=[0,1,2]
    ans = list()

    for i in s:
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
    for i in s:
        data = dataset[line][i]
        t_mm = dataset[line][3]
        df = dealdata_every(data)
        tf = dealdata_every(t_mm)
        # print('df','tf',df,tf)
        tbp = timeBetweenpeaks(df,tf)
        ans.append(tbp)
    print('ans',ans)
    write_csv('一个开合跳.csv',ans)


