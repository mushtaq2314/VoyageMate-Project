import numpy as np
import joblib
model=joblib.load('C:/Users/DELL/Desktop/Indian Railways/model.pkl')
#[age,gender,loc,finance,occu,passengers,place]
#gender- F-0 M-1 O-2
#Finance- Moderate-0 unstable-1 stable-2
#location - any state 0-29
#occu- 0-629
#place- rural-0 urban-1
print((model.predict(np.array([72,1,26,2,89,2,1]).reshape(1,-1))[0]))