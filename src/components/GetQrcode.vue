<template>
  <div class="video-wrap">
    <video ref="videoRef" playsinline class="video-box"></video>
    <div class="line-wrap">
      <div class="line"></div>
    </div>
    <div
      v-if="state.isUseTorch"
      class="track"
      :class="{
        'is-open': state.trackStatus
      }"
      @click="openTrack"
    >
      <img v-if="state.trackStatus" src="@/assets/light_open.svg" />
      <img v-else src="@/assets/light_close.svg" />
    </div>
  </div>
</template>

<script setup>
import jsQR from 'jsqr'
import { nextTick, reactive, onMounted, ref } from 'vue'

const linkMap = {
  didi: 'blackhorse://qrscan',
  hello: 'hellobike://hellobike.com/scan_qr',
  c3x: 'hellobike://hellobike.com/scan_qr',
  mobike: 'imeituan://www.meituan.com/scanQRCode'
}

const videoRef = ref(null)

const state = reactive({
  video: null,
  canvasHeight: 0,
  canvasWidth: 0,
  c: null,
  canvas2d: null,
  cline2d: null,
  trackStatus: true,
  track: null,
  isUseTorch: true
})

const handleVideo = () => {
  if (videoRef.value.readyState !== videoRef.value.HAVE_ENOUGH_DATA) {
    return requestAnimationFrame(handleVideo)
  }
  if (!state.canvas2d) {
    state.canvas2d = state.c.getContext('2d')
  }
  state.canvas2d.drawImage(videoRef.value, 0, 0, state.canvasWidth, state.canvasHeight)

  const imageData = state.canvas2d.getImageData(0, 0, state.canvasWidth, state.canvasHeight)

  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'dontInvert'
  })

  if (code && code.data) {
    getData(code.data)
    return
  }

  requestAnimationFrame(handleVideo)
}

const getData = (data) => {
  let isEnd = false
  Object.entries(linkMap).forEach(([key, value]) => {
    if (data.includes(key)) {
      window.location = value
      isEnd = true
    }
  })
  if (!isEnd && /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(data)) {
    window.location.href = data
  }
}

const openCamera = () => {
  const videoParam = {
    audio: false,
    video: {
      facingMode: { exact: 'environment' },
      width: state.canvasHeight,
      height: state.canvasWidth * 1.5
    }
  }
  navigator.mediaDevices.getUserMedia(videoParam).then((stream) => {
    videoRef.value.srcObject = stream
    videoRef.value.setAttribute('playsinline', true)
    videoRef.value.play()
    window.requestAnimationFrame(handleVideo)
    state.track = stream.getVideoTracks()[0]

    setTimeout(() => {
      state.isUseTorch = state.track.getCapabilities().torch || null
    }, 500)
  }).catch((err) => {
    console.log(err);
  })
}

const openTrack = () => {
  state.track
    .applyConstraints({
      advanced: [{ torch: state.trackStatus }]
    })
    .then(() => {
      state.trackStatus = !state.trackStatus
    })
    .catch((err) => {
      alert(err)
    })
}

onMounted(() => {
  state.canvasWidth = window.screen.availWidth
  state.canvasHeight = window.screen.availHeight

  nextTick(() => {
    state.c = document.createElement('canvas')
    state.c.id = 'c'
    state.c.width = state.canvasWidth
    state.c.height = state.canvasHeight
    state.c.style.width = '100%'
    openCamera()
  })
})
</script>

<style lang="scss" scoped>
.video-wrap {
  width: 100vw;
  height: 100%;
  position: relative;

  .video-box {
    display: block;
    width: 100%;
    height: 100%;
    z-index: 1;
    object-fit: cover;
  }

  .line-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    display: flex;
    justify-content: center;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;

    .line {
      height: calc(100% - 2px);
      width: 100%;
      background: linear-gradient(179deg, rgba(0, 255, 51, 0) 43%, #a4ebb2a6 211%);
      border-bottom: 1px solid #a4ebb2a6;
      transform: translateY(-100%);
      animation: radar-beam 4s infinite normal;
      animation-timing-function: linear;
      animation-delay: 1s;
    }

    @keyframes radar-beam {
      0% {
        transform: translateY(-100%);
      }

      100% {
        transform: translateY(120%);
      }
    }
  }

  .track {
    position: absolute;
    bottom: 300px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 50px;
    background-color: #c8c7c7;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    &.is-open {
      background-color: #e4e3e3;
    }

    img {
      width: 28px;
      height: 28px;
    }
  }

  button {
    position: absolute;
    top: 50px;
    left: 50px;
  }
}
</style>
