<template>
  <div class="video-wrap">
    <video ref="videoRef" playsinline class="video-box"></video>
    <canvas ref="canvasLneRef" class="canvas-box"></canvas>
    <div class="focus-box"></div>
    <button @click="openCamera">开启摄像头</button>
  </div>
</template>

<script setup>
import jsQR from "jsqr";
import {
  computed, nextTick, reactive,
  onMounted, onUnmounted, ref, watch,
} from 'vue';

const linkMap = {
  'didi': 'blackhorse://qrscan',
  'hello': 'hellobike://hellobike.com/scan_qr',
  'mobike': 'imeituan://www.meituan.com/scanQRCode'
};

const videoRef = ref(null);
const canvasLneRef= ref(null);

const state = reactive({
  video: null,
  canvasHeight: 0,
  canvasWidth: 0,
  c: null,
  canvas2d: null,
  cline2d: null,
});

const handleVideo = () => {
  if (videoRef.value.readyState !== videoRef.value.HAVE_ENOUGH_DATA) {
    return requestAnimationFrame(handleVideo);
  };
  if (!state.canvas2d) {
    state.canvas2d = state.c.getContext("2d");
  }
  state.canvas2d.drawImage(
    videoRef.value,
    0,
    0,
    state.canvasWidth,
    state.canvasHeight
  );

  const imageData = state.canvas2d.getImageData(
    0,
    0,
    state.canvasWidth,
    state.canvasHeight
  );

  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "dontInvert",
  });

  // if (code) {
  //   drawLine(
  //     code.location.topLeftCorner,
  //     code.location.topRightCorner,
  //     "#FF3B58"
  //   );
  //   drawLine(
  //     code.location.topRightCorner,
  //     code.location.bottomRightCorner,
  //     "#FF3B58"
  //   );
  //   drawLine(
  //     code.location.bottomRightCorner,
  //     code.location.bottomLeftCorner,
  //     "#FF3B58"
  //   );
  //   drawLine(
  //     code.location.bottomLeftCorner,
  //     code.location.topLeftCorner,
  //     "#FF3B58"
  //   );
  //   if (code.data) {
  //     getData(code.data);
  //   }
  // }

  if (code && code.data) {
    getData(code.data);
    // return;
  }

  requestAnimationFrame(handleVideo);
};

const getData = (data) => {
  // alert(data);
  // const host = 
  console.log(data);
  // if (Object.keys(linkMap).includes())
  Object.entries(linkMap).forEach(([key, value]) => {
    if (data.includes(key)) {
      window.location = value;
    }
  })

}

const drawLine = (begin, end, color) => {
  if (!state.cline2d) {
    state.cline2d = canvasLneRef.value.getContext('2d');
  }
  state.cline2d.beginPath();
  state.cline2d.moveTo(begin.x, begin.y);
  state.cline2d.lineTo(end.x, end.y);
  state.cline2d.lineWidth = 4;
  state.cline2d.strokeStyle = color;
  state.cline2d.stroke();
}

const openCamera = () => {
  const videoParam = {
    audio: false,
    video: {
      facingMode: { exact: 'environment' },
      width: state.canvasHeight,
      height: state.canvasWidth,
    },
  };
  navigator.mediaDevices
    .getUserMedia(videoParam)
    .then((stream) => {
      videoRef.value.srcObject = stream;
      videoRef.value.setAttribute("playsinline", true);
      videoRef.value.play();
      window.requestAnimationFrame(handleVideo);
    })
};

onMounted(() => {
  state.canvasWidth = window.screen.availWidth;
  state.canvasHeight = window.screen.availHeight;

  nextTick(() => {
    state.c = document.createElement("canvas");
    state.c.id = "c";
    state.c.width = state.canvasWidth;
    state.c.height = state.canvasHeight;
    state.c.style.width = "100%";
    // document.querySelector(".video-wrap").append(state.c);
  });
});

</script>

<style lang="scss" scoped>
.video-wrap {
  width: 100vw;
  height: 100vh;
  position: relative;

  .video-box {
    background-color: rgb(87, 82, 82);
    display: block;
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(0deg,
        transparent 24%,
        rgba(32, 255, 77, 0.1) 25%,
        rgba(32, 255, 77, 0.1) 26%,
        transparent 27%,
        transparent 74%,
        rgba(32, 255, 77, 0.1) 75%,
        rgba(32, 255, 77, 0.1) 76%,
        transparent 77%,
        transparent),
      linear-gradient(90deg,
        transparent 24%,
        rgba(32, 255, 77, 0.1) 25%,
        rgba(32, 255, 77, 0.1) 26%,
        transparent 27%,
        transparent 74%,
        rgba(32, 255, 77, 0.1) 75%,
        rgba(32, 255, 77, 0.1) 76%,
        transparent 77%,
        transparent);
    background-size: 3rem 3rem;
    background-position: -1rem -1rem;
    z-index: 10;
    background-color: #1110;
  }

  .focus-box {
    position: absolute;
    width: 60vw;
    height: 60vw;
    top: 110px;
    left: 50%;
    transform: translate(-50%, 0);
    border: 0.1rem solid rgba(0, 255, 51, 0.2);
    z-index: 11;
    overflow: hidden;

    .box:after,
    .box:before {
      content: "";
      display: block;
      position: absolute;
      width: 3vw;
      height: 3vw;
      z-index: 12;
      border: 0.2rem solid transparent;
    }

    .box:after,
    .box:before {
      top: 0;
      border-top-color: #baffc8;
    }

    .box:before {
      left: 0;
      border-left-color: #baffc8;
    }

    .box:after {
      right: 0;
      border-right-color: #baffc8;
    }
  }

  button {
    position: absolute;
    top: 50px;
    left: 50px;
  }

  .canvas-box {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 11;
    background: transparent;
    height: 100vh;
    width: 100vw;
    pointer-events: none;
  }
}
</style>