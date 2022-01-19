const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
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
    const distanceEyeRight = distancePoints(landmarks[159]["x"], landmarks[159]["y"], landmarks[145]["x"], landmarks[145]["y"]);
    const distanceEyeLeft = distancePoints(landmarks[386]["x"], landmarks[386]["y"], landmarks[374]["x"], landmarks[374]["y"]);
    var eyeRight = "", eyeLeft = "";
    var colorLeft = "", colorRight = "";
    if (distanceEyeLeft < 10) {
        eyeLeft = "cerrado";
        colorLeft = '#FF3030';
    }
    else {
        eyeLeft = "abierto";
        colorLeft = '#30FF30';
    }
    drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: colorLeft });

    if (distanceEyeRight < 10) {
        eyeRight = "cerrado";
        colorRight = '#FF3030';
    }
    else {
        eyeRight = "abierto";
        colorRight = '#30FF30';
    }
    drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: colorRight });

    // drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, { color: '#FF3030' });
    // drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, { color: '#FF3030' });

    // drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, { color: '#30FF30' });
    // drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, { color: '#30FF30' });
    // drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0' });
    // drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: '#E0E0E0' });
    document.querySelector('#data').textContent = "Ojos: derecho {" + eyeRight + "} izquierdo {" + eyeLeft + "}     ";
    console.log("Distance: " + distanceEyeLeft);
}
function distancePoints(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1) * 1000;
}