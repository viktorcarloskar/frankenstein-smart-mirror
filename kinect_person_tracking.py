#!/usr/bin/env python
# -*- coding: utf-8 -*-
#import the necessary modules for face detection
import freenect
import cv2
import numpy as np
import sys

from json_tricks.np import dump, dumps, load, loads, strip_comments
#Prepping to threading hello
import threading
import Queue

face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_alt_tree.xml')

#function to get RGB image from kinect
def get_video():
    array,_ = freenect.sync_get_video()
    array = cv2.cvtColor(array,cv2.COLOR_RGB2BGR)
    return array

#function to get depth image from kinect
def get_depth():
    array,_ = freenect.sync_get_depth()
    #array = array.astype(np.uint8)
    return array

def getDepthMedian(x,y,w,h,depthMap):
    d = []
    for i in range(1,5):
        for j in range(1,5):
            d = np.append(d, depthMap[min(round(x+i*w/5),round(y+j*h/5), 480)])
    return round(np.median(d))

def kinect_thread():

    depthMedian = 0;
    i = 0
    while 1:
        #get a frame from RGB camera
        frame = get_video()
        #get a frame from depth sensor
        depth = get_depth()

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        if i==0:
            faces = face_cascade.detectMultiScale(gray, 1.3, 5)


        for (x,y,w,h) in faces:
            cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
            depthMedian = getDepthMedian(x,y,w,h,depth)


        cv2.imshow('RGB image',frame)
        #display depth image
        cv2.imshow('Depth image',depth.astype(np.uint8))

        i = i+1

        if i == 2:
            i = 0

        # quit program when 'esc' key is pressed
        k = cv2.waitKey(5) & 0xFF

        if len(faces) > 0:
            face_x = float(faces[0][0]) / float(np.shape(frame)[1])
            face_y = float(faces[0][1]) / float(np.shape(frame)[0])
            print "[[ %.3f %.3f %d %d %d ]]" % (face_x, face_y, faces[0][2], faces[0][3], depthMedian)
            sys.stdout.flush()

        if k == 27:
            break
    cv2.destroyAllWindows()

if __name__ == "__main__":

    print("Time to start einen serveren!")

    #q = Queue.Queue()
    #t1 = threading.Thread(target=rpc_thread, args=(q,))
    #t2 = threading.Thread(target=kinect_thread, args=(q,))
    #t1.start()
    #t2.start()

    kinect_thread()
