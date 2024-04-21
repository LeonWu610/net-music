<template>
  <div class="playlist" :style="{ bottom: btm }">
    <div class="title">
      <div>播放列表</div>
      <div class="clear" @click="clear">清空</div>
    </div>
    <ul>
      <li v-for="(song, index) in playlist" :key="index" @click="selectSong(index)">
        {{ song }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useSongStore } from '@/stores/song.js'
import { computed } from 'vue'

const currentSong = useSongStore()
const playlist = computed(() => currentSong.songList)
const btm = computed(() => currentSong.listBtm)

const clear = () => {
  currentSong.songList = []
  currentSong.playingState = false
}

const selectSong = (index) => {
  currentSong.index = index
  currentSong.playingState = true
}
</script>

<style scoped>
.playlist {
  position: fixed;
  height: 300px;
  right: 0;
  width: 100%;
  background-color: #e3e3e3;
  z-index: 999;
  padding: 15px;
  overflow-y: auto;
  border-radius: 20px 20px 0 0;
}

.title {
  display: flex;
  align-items: center;
  position: relative;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  .clear {
    font-size: 14px;
    position: absolute;
    right: 5px;
  }
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 5px 0;
  background-color: rgb(206, 206, 206);
  border-radius: 5px;
  margin-bottom: 3px;
  padding-left: 5px;
  cursor: pointer;
  font-size: 16px;
}

.close-btn {
  margin-top: 20px;
  text-align: center;
  cursor: pointer;
  color: #333;
}
</style>
