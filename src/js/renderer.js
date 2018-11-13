function renderImg() {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    let renderedImg = context.createImageData(canvasWidth, canvasHeight);
    let r, g, b;
    let byteMaxValueFilter = 255;
    let renderedImgDataIdx = 0;
    let modifier = makeModifierFromInput();
    let mode = document.forms.modeForm.mode.value;

    for (let i = 0; i < canvasWidth; i++) {
        r = i & byteMaxValueFilter;
        for (let j = 0; j < canvasHeight; j++) {
            g = j & byteMaxValueFilter;
            if (modifier == 0) {
                b = ((i ^ j) ^ modifier) & byteMaxValueFilter;
            }else if (blueControlPredicate(i, j, modifier, mode)) {
                b = 0;
            } else {
                b = byteMaxValueFilter;
            }

            renderedImg.data[renderedImgDataIdx++] = r;
            renderedImg.data[renderedImgDataIdx++] = g;
            renderedImg.data[renderedImgDataIdx++] = b;
            renderedImg.data[renderedImgDataIdx++] = 255;
        }
    }

    context.putImageData(renderedImg, 0, 0);
}

function makeModifierFromInput() {
    let inputStr = document.getElementById('modifier').value;
    let result = 0;
    for (let i = 0; i < inputStr.length; i++) {
        result ^= inputStr.charCodeAt(i);
    }
    return result;
}

function blueControlPredicate(width, height, modifier, mode) {
    switch (mode) {
        case 'modeMultiply':
            return Math.cos((width * height) * modifier) < Math.sin((width * height) * modifier);
        case 'modeDivide':
            return Math.cos((width * height) / modifier) < Math.sin((width * height) / modifier);
        case 'modeRemainder':
            return Math.cos((width * height) % modifier) < Math.sin((width * height) % modifier);
        case 'modeXOR':
            return Math.cos((width * height) ^ modifier) < Math.sin((width * height) ^ modifier);
    }
}

renderImg();
