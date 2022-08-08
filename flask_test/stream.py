from flask import Flask, render_template, Response
import cv2
from edgetpu.classification.engine import ClassificationEngine
from PIL import Image
import os

app = Flask(__name__)
# 모델 파일 경로 설정
modelPath = os.path.join(os.getcwd(), "models", "model_edgetpu.tflite")
labelPath = os.path.join(os.getcwd(), "models", "labels.txt")

@app.route("/")
def index() :
    return render_template('index.html')

# 라벨 텍스트 dict 형식으로 변환하기
def getLabels(labelPath) :
    with open(labelPath) as f :
        lines = [line.strip().split() for line in f.readlines()]
        return {int(key) : value for key, value in lines}

def get_frame() :
    cap = cv2.VideoCapture(1)
    engine = ClassificationEngine(modelPath) # 인식 엔진 설정하기
    labelDict = getLabels(labelPath) # 라벨 목록 가져오기
    while True :
        _, frame = cap.read()
        frame_pil = Image.fromarray(frame) # PIL 이미지로 변환
        classify = engine.classify_with_image(frame_pil) # 이미지 분류하기

        text = labelDict[classify[0][0]] # 분류 결과로 텍스트 가져오기
        acc = round(classify[0][1] * 100, 1) # 분류 결과로 정확도 가져오기
        print(text, acc)

        imgencode = cv2.imencode('.jpg', frame)[1]
        stringData = imgencode.tostring()
        yield (b'--frame\r\n'
                b'Content-Type: text/plain\r\n\r\n' + stringData + b'\r\n')

    del(cap)

@app.route('/calc')
def calc() :
    return Response(get_frame(),
            mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__" :
    app.run(host="0.0.0.0", debug=True, threaded=True)