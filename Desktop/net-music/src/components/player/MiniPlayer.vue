<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" :style="{ bottom: btm }">
      <div class="cd-wrapper">
        <div ref="cdRef" class="cd">
          <img ref="cdImageRef" :src="currentSong.pic" :class="cdCls" @click="showNormalPlayer" />
        </div>
      </div>
      <div class="name">{{ currentSong.name }}</div>
      <div class="control">
        <progress-circle class="circle" :radius="27" :progress="progress">
          <div class="iconfont icon-mini" @click.stop="togglePlay" v-html="playIcon"></div>
        </progress-circle>
        <div class="iconfont icon-playlist" @click="showPlaylist">&#xe77d;</div>
      </div>
      <transition name="mini"> <playlist v-show="playlistRef"></playlist></transition>
    </div>
  </transition>
</template>

<script setup>
import { useSongStore } from '@/stores/song.js'
import { computed, ref } from 'vue'
import useCd from './use-cd'
import ProgressCircle from './ProgressCircle.vue'
import Playlist from './PlaylistView.vue'

const playlistRef = ref(false)
const { progress, togglePlay } = defineProps({
  progress: Number,
  togglePlay: Function
})

const currentSong = computed(() => useSongStore())
const fullScreen = computed(() => currentSong.value.fullScreen)
const playingState = computed(() => currentSong.value.playingState)
const btm = computed(() => currentSong.value.miniPlayerBtm)

const { cdCls, cdRef, cdImageRef } = useCd()

const playIcon = computed(() => {
  return playingState.value ? '&#xe67e;' : '&#xe64f;'
})

function showNormalPlayer() {
  currentSong.value.fullScreen = true
}

function showPlaylist() {
  playlistRef.value = !playlistRef.value
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  z-index: 180;
  width: 100%;
  height: 50px;
  background: white;
  border-top: 1px solid rgb(231, 231, 231);
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    margin-right: 20px;
    .cd {
      width: 40px;
      height: 40px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .name {
    color: rgb(33, 33, 33);
    flex: 1;
    margin-left: 10px;
    font-size: 17px;
    font-weight: 500;
  }
  .control {
    margin-top: 10px;
    margin-right: 10px;
    color: rgb(50, 50, 50);
    .circle {
      margin-right: 55px;
    }
    .icon-playlist {
      position: absolute;
      font-size: 22px;
      font-weight: 900;
      top: 9px;
      right: 8px;
    }
    .icon-mini {
      position: absolute;
      left: 1px;
      top: -5px;
    }
  }
  .mini-enter-active,
  .mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  .mini-enter-from,
  .mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 80%, 0);
  }
}
</style>
