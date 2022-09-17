const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
// Set dynamic character size in the custom canvas
const customCanvas = document.getElementById("customCanvas");

// Getting the image
let ctx, data;

// Dimensions
let width = 150;
let height = 150;
// Changing dimensions
const setDimensions = (w, h) => {
    customCanvas.style.width = w;
    customCanvas.style.height = h;
}

// Handle resizing when in small viewports
const handleWindowResize = () => {
    var clientWidth = document.body.clientWidth;
    if (clientWidth < 768) {
        width = 75;
        height = 75;
    } else {
        width = 150;
        height = 150;
    }
    setDimensions(`${width}ch`, `${height}ch`);
}
handleWindowResize();

window.onresize = handleWindowResize;

// Processing speed
// Delay is in millis, so 24fps would be a delay of 1000/24 ~= 40
const delay = 60;
let isProcessing = false;
let isColor = false;
let interval;

const startStreaming = () => {
    navigator.mediaDevices.getUserMedia({ audio: false, video: { width: width, height: height } })
        .then(stream => {
            // Store the stream
            video.srcObject = stream;
            // Get the context
            ctx = canvas.getContext('2d');
            // Start processing
            startProcessing();
            isProcessing = true;
        })
        .catch(error => console.error(error));
}

const startProcessing = () => {
    // Set an interval to take frames
    interval = setInterval(processFrame, delay);
};
const stopProcessing = () => {
    clearInterval(interval);
};

const processFrame = () => {
    // Not process initial frames
    if (video.videoWidth > 0) {
        // Draw the frame to the canvas
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        // Take the data from the canvas and transform it
        // Comes in width * height * 4 (RGBA)
        transformFrame(ctx.getImageData(0, 0, video.videoWidth, video.videoHeight).data);
    }
};

const hiddenInput = document.getElementById('hidden-input');
const copyFrame = () => {
    if (isProcessing) {
        hiddenInput.innerHTML = customCanvas.innerHTML.replace(/\&nbsp;/gi, " ").replace(/<i class=\"c[0-9]*\">/gi, "").replace(/<\/i>/gi, "").replace(/<br\s*[\/]?>/gi, "\r\n");
        // Select the text field
        hiddenInput.select();
        hiddenInput.setSelectionRange(0, 999999999999); // For mobile devices
        // Copy the text inside the text field
        navigator.clipboard.writeText(hiddenInput.value);
    } else {
        console.log("Cannot copy frame if not processing first.");
    }
}

// Actual processing of the frame

let thresholdFactor = 0.35;
// Character map
let __baseAlpha = "Ñ@#W$9876543210?!abc;:+=-,._ ";
const alphaColorMap = {
    'Ñ': 'c1',
    '@': 'c2',
    '#': 'c3',
    'W': 'c4',
    '$': 'c5',
    '9': 'c6',
    '8': 'c7',
    '7': 'c8',
    '6': 'c9',
    '5': 'c10',
    '4': 'c12',
    '3': 'c13',
    '2': 'c14',
    '1': 'c15',
    '0': 'c16',
    '?': 'c17',
    '!': 'c18',
    'a': 'c19',
    'b': 'c20',
    'c': 'c21',
    ';': 'c22',
    ':': 'c23',
    '+': 'c24',
    '=': 'c25',
    '-': 'c26',
    ',': 'c27',
    '.': 'c28',
    '_': 'c29',
    ' ': 'c30',
    '': 'c30',
}
let __alpha, alpha, alphaLen;

// Changing factor
const factorLabel = document.getElementById("factor-label");
const changeFactor = (val) => {
    // Compute thresholding factor
    thresholdFactor = val / 100;
    // Keep initial copy
    __alpha = __baseAlpha;
    // Apply thresholding factor
    for (let i = 0; i < Math.floor(__baseAlpha.length * thresholdFactor); i++) {
        __alpha += " ";
    }
    // Reverse to have in increasing brightness
    alpha = __alpha.split().reverse().join();
    // Precompute the length of the string
    alphaLen = alpha.length;
    // Update the label
    factorLabel.innerHTML = Math.round(thresholdFactor * 100) / 100;
}
changeFactor(50);

// Changing colorize
const toggleColorize = () => {
    isColor = !isColor;
    setDimensions(isColor ? 'unset' : `${width}ch`, isColor ? 'unset' : `${height}ch`);
}

// Some variables
let targetChar, result, item, value, char;

// Gets the char, expect a value between 1 and 0 for HSV
const getChar = (val) => {
    targetChar = alpha.charAt(Math.floor(val * alphaLen));
    if (isColor) {
        console.log(alphaColorMap[targetChar], targetChar)
        return targetChar === ' ' ? '&nbsp;' : ("<i class=\"" + alphaColorMap[targetChar] + "\">" + targetChar + "</i>");
    }
    return targetChar === ' ' ? '&nbsp;' : targetChar;
}

// Converts the RGB to simply HSV, but only working with the V for B&W
const getPixelValue = (r, g, b) => {
    return Math.max(r, g, b) / 255;
}

const transformFrame = (frame) => {
    result = "";
    // Iterate all pixels and build the result
    for (let i = 0; i < height; i++) {
        // Process width inversely to avoid image mirroring
        for (let j = width - 1; j >= 0; j--) {
            item = i * height + j;
            value = getPixelValue(frame[4 * item], frame[4 * item + 1], frame[4 * item + 2]);
            char = getChar(value);
            // result += `<i class=\"${char}\">${char}</i>`;
            result += char;
        }
        result += "<br/>";
    }
    // Change the content of the div
    customCanvas.innerHTML = result;
}