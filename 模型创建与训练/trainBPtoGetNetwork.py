import csv
from csv import reader
from math import exp
from random import seed
from random import random

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

def write_csv(filename, text):
    with open(filename, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(text)

# Convert string column to float
def str_column_to_float(dataset, column):
    for row in dataset:
        row[column] = float(row[column].strip())

# Convert string column to integer
def str_column_to_int(dataset):
    for row in dataset:
        row[-1] = int(row[-1])

# Initialize a network
def initialize_network(n_inputs, n_hidden, n_outputs):
    network = list()
    hidden_layer = [{'weights': [random() for i in range(n_inputs + 1)]} for i in range(n_hidden)]
    network.append(hidden_layer)
    output_layer = [{'weights': [random() for i in range(n_hidden + 1)]} for i in range(n_outputs)]
    network.append(output_layer)
    return network


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

seed(1)

# load and prepare data
filename = '40normalizedatacorrect.csv'
dataset = load_csv(filename)
print(dataset)
for i in range(len(dataset[0]) - 1):
    str_column_to_float(dataset, i)
# convert class column to integers
str_column_to_int(dataset)
###################################################################
train_set = list(dataset)
print(train_set)
n_inputs = len(train_set[0])-1
n_outputs = len(set([row[-1] for row in dataset]))
network = initialize_network(n_inputs,14,n_outputs)
train_network(network,train_set,0.5,500,n_outputs)

for layer in network:
    print(layer)   #打印出这个训练好的network
