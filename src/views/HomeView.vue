<script setup></script>

<template>
  <GetQrcode />
  <div class="btn-wrap">
    <a class="btn-hello" href="hellobike://hellobike.com/scan_qr">
      <img src="@/assets/hello_icon.png" />
      哈啰
    </a>
    <a class="btn-meituan" href="imeituan://www.meituan.com/scanQRCode">
      <img src="@/assets/meituan_icon.png" />
      美团
    </a>
    <a class="btn-dd" href="blackhorse://qrscan">
      <img src="@/assets/dd_icon.ico" />
      青桔
    </a>
  </div>
</template>

<script setup>
import GetQrcode from '@/components/GetQrcode.vue'
</script>

<style lang="scss" scoped>
.btn-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  position: fixed;
  bottom: 100px;
  width: 100vw;
  margin: 0 auto;
  z-index: 3;

  a {
    white-space: nowrap;
    position: relative;
    display: flex;
    align-items: center;
    margin: 6px;
    padding: 10px 14px;
    text-align: center;
    font-size: 18px;
    letter-spacing: 1px;
    text-decoration: none;
    background: transparent;
    cursor: pointer;
    transition: ease-out 0.5s;
    border: 2px solid;
    border-radius: 10px;
    user-select: none;

    img {
      width: 22px;
      margin-right: 6px;
    }

    &.btn-hello {
      color: #0096ff;
      border-color: #0096ff;
      box-shadow: inset 0 0 0 0 #725ac1;

      img {
        width: 26px;
      }
    }

    &.btn-meituan {
      color: #ffc300;
      border-color: #ffc300;
      box-shadow: inset 0 0 0 0 #ffc300;
    }

    &.btn-dd {
      color: #33c6b1;
      border-color: #33c6b1;
      box-shadow: inset 0 0 0 0 #33c6b1;
    }
  }
}
</style>
