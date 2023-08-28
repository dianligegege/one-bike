<template>
  <div class="video-wrap">
    <video ref="videoRef" playsinline class="video-box"></video>
    <div class="line-wrap">
      <div class="line"></div>
    </div>
    <button @click="openCamera">开启摄像头</button>
  </div>
</template>

<script setup>
import jsQR from "jsqr";
import {
  nextTick,
  reactive,
  onMounted,
  ref,
} from 'vue';

const linkMap = {
  'didi': 'blackhorse://qrscan',
  'hello': 'hellobike://hellobike.com/scan_qr',
  'mobike': 'imeituan://www.meituan.com/scanQRCode'
};

const videoRef = ref(null);

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

  if (code && code.data) {
    getData(code.data);
    return;
  }

  requestAnimationFrame(handleVideo);
};

const getData = (data) => {
  Object.entries(linkMap).forEach(([key, value]) => {
    if (data.includes(key)) {
      window.location = value;
    }
  })

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
    z-index: 1;
    background-color: #1110;
  }

  .line-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(194, 190, 190, 0.8);
    z-index: 2;
    display: flex;
    justify-content: center;
    pointer-events: none;

    .line {
      height: calc(100% - 2px);
      width: 100%;
      background: linear-gradient(179deg, rgba(0, 255, 51, 0) 43%, #a4ebb2a6 211%);
      border-bottom: 1px solid #a4ebb2a6;
      transform: translateY(-100%);
      animation: radar-beam 2s infinite alternate;
      animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
      animation-delay: 1.4s;
    }

    @keyframes radar-beam {
      0% {
        transform: translateY(-100%);
      }

      100% {
        transform: translateY(0);
      }
    }
  }
  button {
    position: absolute;
    top: 50px;
    left: 50px;
  }
}
</style>