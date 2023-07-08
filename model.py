import numpy as np
import pandas as pd
import joblib
import sys
import ast
import json
model=joblib.load('C:/Users/DELL/Desktop/Indian Railways/model.pkl')
#[age,gender,loc,finance,occu,passengers,place]
#gender- F-0 M-1 O-2
#location - any state 0-29
#Finance- Moderate-0 unstable-1 stable-2
#occu- 0-629
#place- rural-0 urban-1
send=ast.literal_eval((model.predict(np.array([19,1,26,2,89,1,1]).reshape(1,-1))[0]))
# send=(model.predict((np.array(ast.literal_eval(sys.argv[1]))).reshape(1,-1))[0])
st = pd.read_csv('final.csv')
details = pd.read_csv('Train_details.csv')
# final = '{'
final = '['
for i in range(len(send)):
    for j in st['Station Name']:
        if(send[i].upper() in j):
            x=(st[st['Station Name']==j].values[0][1])
            # if(i!=len(send)-1):
            #     final+='"'+send[i]+'":"'+x+'",'
            # else:final+='"'+send[i]+'":"'+x+'"'
            if(i!=len(send)-1):
                final+='{"Name":"'+send[i]+'","Code":"'+x+'"},'
            else:final+='{"Name":"'+send[i]+'","Code":"'+x+'"}'
            break
# final+='}'
final+=']' 
print(final)