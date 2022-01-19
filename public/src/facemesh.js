const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
canvasCtx.translate(1280, 0);
canvasCtx.scale(-1, 1);

document.querySelector('#inputVid').style.display = 'none';
function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION,
                { color: '#C0C0C070', lineWidth: 1 });
            analysisFacial(landmarks);
        }
    }
    canvasCtx.restore();
}

const faceMesh = new FaceMesh({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }
});
faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await faceMesh.send({ image: videoElement });
    },
    width: 1280,
    height: 720
});
document.getElementById("botonStreaming").onclick = () => {
    document.getElementById("video").style.display = "block";
    camera.start();
};
document.getElementById("botonStreamingStop").onclick = () => {
    camera.stop();
    document.getElementById("video").style.display = "none";
};
function analysisFacial(landmarks) {
    var percentage = (Math.hypot(landmarks[323]["x"] - landmarks[93]["x"], landmarks[323]["y"] - landmarks[93]["y"]) * 1000) / 240;
    const distanceEyeRight = distancePoints(landmarks, percentage, 159, 145);
    const distanceEyeLeft = distancePoints(landmarks, percentage, 386, 374);
    const distanceMouth = distancePoints(landmarks, percentage, 13, 14);
    const distanceEyeBrowLeft = distancePoints(landmarks, percentage, 386, 282);
    const distanceEyeBrowRight = distancePoints(landmarks, percentage, 159, 52);
    const distanceMouthHorizontal=distancePoints(landmarks, percentage, 61, 291);
    var rotation = "null";
    if (landmarks[9]["x"] - landmarks[152]["x"]) {
        const earring = (landmarks[9]["y"] - landmarks[152]["y"]) / (landmarks[9]["x"] - landmarks[152]["x"]);
        if (earring < -0.1 && earring > -4) {
            rotation = "right";
        }
        else if (earring > 0.1 && earring < 4) {
            rotation = "left";
        }
    }
    var eyeRight = "", eyeLeft = "", mouth = "", eyeBrowLeft = "", eyeBrowRight = "";
    var color = "";
    if (distanceEyeLeft < 12) {
        eyeLeft = "close";
        color = '#FF3030';
    }
    else {
        eyeLeft = "open";
        color = '#30FF30';
    }
    drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: color });

    if (distanceEyeRight < 12) {
        eyeRight = "close";
        color = '#FF3030';
    }
    else {
        eyeRight = "open";
        color = '#30FF30';
    }
    drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: color });

    if (distanceMouth < 5) {
        mouth = "close";
        color = '#FF3030';
    }
    else {
        mouth = "open";
        color = '#30FF30';
    }
    drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: color });

    if (distanceEyeBrowLeft < 65) {
        eyeBrowLeft = "down";
        color = '#FF3030';
    } else {
        eyeBrowLeft = "up";
        color = '#30FF30';
    }
    drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, { color: color });

    if (distanceEyeBrowRight < 65) {
        eyeBrowRight = "down";
        color = '#FF3030';
    } else {
        eyeBrowRight = "up";
        color = '#30FF30';
    }
    drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, { color: color });


    // drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, { color: '#FF3030' });

    // drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, { color: '#30FF30' });
    // drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0' });
    const facialData="Eyes: right {" + eyeRight + "} left {" + eyeLeft + "} EyeBrow: right {" + eyeBrowRight + "} left {" + eyeBrowLeft + "} Mouth {" + mouth + "} Rotation {"+rotation+"}";
    const emotion="Emotion: "+ getEmotion(distanceEyeBrowLeft,distanceEyeBrowRight,distanceMouthHorizontal,distanceMouth);
    document.querySelector('#data').textContent = facialData;
    document.querySelector('#dataEmotion').textContent = emotion;
}
function getEmotion(distanceEyeBrowLeft,distanceEyeBrowRight,distanceMouthHorizontal,distanceMouth){
    var emotion="null";
    console.log(distanceMouthHorizontal);
    if((distanceEyeBrowRight>65 || distanceEyeBrowLeft<65) && (distanceMouthHorizontal>120)){
        emotion="happy";
    } else
    if((distanceEyeBrowLeft<=37 || distanceEyeBrowRight<=37)){
        emotion="angry";
    } else 
    if((distanceEyeBrowLeft>65 || distanceEyeBrowRight>65) && (distanceMouth>10)){
        emotion="amazed";
    }
    return emotion;
    
}
function distancePoints(landmarks, percentage, point1, point2) {
    return Math.abs(parseInt((Math.hypot(landmarks[point2]["x"] - landmarks[point1]["x"], landmarks[point2]["y"] - landmarks[point1]["y"]) * 1000) / percentage));
}