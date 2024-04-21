<template>
  <div class="error" v-show="showAlert" @click="closeError">
    <div class="error-message">网络不佳，请刷醒后重试哦～～</div>
    <span class="close">&times;</span>
  </div>
</template>

<script setup>
const { showAlert, closeError } = defineProps({ showAlert: Boolean, closeError: Function })

</script>

<style lang="scss" scoped>
.error {
  position: fixed;
  background-color: #ffcccc;
  color: #cc0000;
  top: 50%;
  left: 15%;
  padding: 10px;
  border: 1px solid #cc0000;
  border-radius: 5px;
  font-size: 16px;
  text-align: center;
  width: 300px;
  margin: 0 auto;
  .close {
    position: absolute;
    top: 0;
    right: 10px;
    cursor: pointer;
  }
}
</style>
