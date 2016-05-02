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

HAAR_CASCADE_PATH = "haarcascade_frontalface_default.xml"
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

#function to get RGB image from kinect
def get_video():
    array,_ = freenect.sync_get_video()
    array = cv2.cvtColor(array,cv2.COLOR_RGB2BGR)
    return array

#function to get depth image from kinect
def get_depth():
    array,_ = freenect.sync_get_depth()
    array = array.astype(np.uint8)
    return array

# function that detects faces in an image
def detect_faces(image):
    faces = []
    detected = cv2.HaarDetectObjects(image, face_cascade, storage, 1.2, 2, cv2.CV_HAAR_DO_CANNY_PRUNING, (100,100))
    if detected:
        for (x,y,w,h),n in detected:
            faces.append((x,y,w,h))
    return faces

def kinect_thread():

    i = 0
    while 1:
        #get a frame from RGB camera
        frame = get_video()
        #get a frame from depth sensor
        #depth = get_depth()

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        if i%4==0:
            faces = face_cascade.detectMultiScale(gray, 1.3, 5)


        for (x,y,w,h) in faces:
            cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)


        cv2.imshow('RGB image',frame)
        #display depth image
        #cv2.imshow('Depth image',depth)

        i = i+1
        # quit program when 'esc' key is pressed
        k = cv2.waitKey(5) & 0xFF

        print faces
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
