import csv
from random import seed
from csv import reader

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
print(len(minmax))
normalize_dataset(dataset, minmax)

for i in range(len(dataset)):
    write_csv("4000.csv",dataset[i])
print("end")