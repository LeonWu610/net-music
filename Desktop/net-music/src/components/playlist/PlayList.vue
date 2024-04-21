<script setup>
import { fetchRateDetail, fetchSongUrl, fetchLyric } from '@/api/api'
import { onMounted } from 'vue'
import { watchEffect } from 'vue'
import { useSongStore } from '@/stores/song.js'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PlayerView from '@/components/player/PlayerView.vue'
import BScroll from 'better-scroll'
const route = useRoute()
const router = useRouter()
const id = route.params.id
const currentSong = useSongStore()
const loading = ref(true)
const songs = ref([])
const Urls = ref([])
const name = ref()
const picUrl = ref()
const playlist = ref()

const goBack = () => {
  router.back()
  currentSong.miniPlayerBtm = '60px'
  currentSong.listBtm = '110px'
}

const PlayAll = () => {  
  currentSong.miniPlayerBtm = '0'
  currentSong.listBtm = '50px'
  currentSong.fullScreen = true
  currentSong.playMode = 'shuffle'
  currentSong.urlList = []
  currentSong.songList = []
  songs.value.forEach((song) => {
    currentSong.songList.push(song.al.name)
    song.ar.forEach((ar) => (currentSong.singer = ar.name))
    currentSong.pic = song.al.picUrl
  })
  Urls.value.forEach((url) => currentSong.urlList.push(url))
  currentSong.playingState = true
}

const handleSongClick = async (song, index) => {
  song.ar.forEach((ar) => (currentSong.singer = ar.name))
  currentSong.miniPlayerBtm = '0'
  currentSong.listBtm = '50px'
  currentSong.id = song.al.id
  currentSong.pic = song.al.picUrl
  currentSong.index = index
  currentSong.fullScreen = true
  currentSong.name = song.name
  Urls.value.forEach((url) => currentSong.urlList.push(url))
  songs.value.forEach((song) => {
    currentSong.songList.push(song.name)
  })
  currentSong.playingState = true
  await fetchLyric(currentSong).then((res) => {
    currentSong.lyric = res.data.lrc.lyric
  })
}

watchEffect(() => {
  if (songs.value.length > 0) {
    loading.value = false
  }
})

onMounted(async () => {
  await fetchRateDetail(id).then((res) => {
    playlist.value = res.data.playlist
    songs.value = res.data.playlist.tracks
    name.value = res.data.playlist.name
    picUrl.value = res.data.playlist.coverImgUrl
    res.data.playlist.tracks.forEach((song) => {
      fetchSongUrl(song.id).then((res) => {
        Urls.value.push(res.data.data[0].url)
      })
    })
    setTimeout(() => {
      loading.value = false
    }, 4000)
  })
  new BScroll('.wrapper', {
    scrollY: true,
    click: true,
    bounce: true
  })
})
</script>

<template>
  <div class="wrapper">
    <div class="music-list">
      <div class="top">
        <div class="iconfont" @click="goBack">&#xe60d;</div>
        <div class="title">歌单</div>
      </div>
      <div class="rest">
        <div class="detail">
          <div class="playlist-pic">
            <div class="iconfont play">
              &#xe64f;
              <span class="count">{{
                (playlist?.subscribedCount / 10000).toFixed(1) + ' 万'
              }}</span>
            </div>
            <v-img
              class="rounded-lg"
              width="120"
              height="120"
              lazy-src="../assets/netmusic.png"
              :src="playlist?.coverImgUrl"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                </div>
              </template>
            </v-img>
          </div>
          <div class="info">
            <div class="name">{{ playlist?.name }}</div>
            <div class="author">
              <img :src="playlist?.creator.avatarUrl" />
              <span>{{ playlist?.creator.nickname }}</span>
              <span class="text">+关注</span>
            </div>
          </div>
        </div>
        <span class="desc">{{ playlist?.description }}</span>
        <div class="icon">
          <div class="icon__wrap">
            <span class="iconfont">&#xe628;</span>
            {{ playlist?.shareCount }}
          </div>
          <div class="icon__wrap">
            <span class="iconfont">&#xe60a;</span>
            {{ playlist?.commentCount }}
          </div>
          <div class="icon__wrap">
            <span class="iconfont">&#xe66e;</span>
            {{ playlist?.subscribedCount }}
          </div>
        </div>
        <div class="bottom">
          <div class="play">
            <div class="iconfont">&#xe64f;</div>
            <div class="text" @click="PlayAll">播放全部</div>
            <div class="count">({{ songs.length }})</div>
          </div>
          <div class="songs" v-for="(song, i) in songs" :key="i" @click="handleSongClick(song, i)">
            <div class="index">{{ i + 1 }}</div>
            <div class="right">
              <div class="name">{{ song.al.name }}</div>
              <div class="artists">
                <div class="ar" v-for="artist in song.ar" :key="artist">
                  {{ artist.name }}&nbsp;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>
    <PlayerView></PlayerView>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  background-image: linear-gradient(to bottom, #384592, #ffffff);
}
.music-list {
  position: relative;
  height: 100%;
  .top {
    position: fixed;
    display: flex;
    width: 100%;
    height: 40px;
    justify-content: center;
    align-items: center;
    z-index: 20;
    padding: 5px;
    font-size: 30px;
    color: white;
    background: linear-gradient(to bottom, #313f91, rgb(61, 76, 162));
    .title {
      flex: 1;
      margin-left: 35vw;
      font-size: 22px;
      font-weight: 500;
    }
  }
  .rest {
    position: absolute;
    top: 50px;
    height: 100%;
    .detail {
      display: flex;
      padding: 5px 10px;
      .playlist-pic {
        border-radius: 10px;
        position: relative;
        margin-right: 10px;
        .play {
          display: flex;
          position: absolute;
          top: 2px;
          left: 5px;
          width: 60px;
          font-size: 12px;
          color: white;
          z-index: 50;
          .count {
            font-size: 12px;
            font-weight: 800;
            margin: 0 0 0 3px;
          }
        }
      }
      .info {
        color: white;
        .name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .author {
          display: flex;
          align-items: center;
          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 5px;
          }
          span {
            font-size: 15px;
          }
          .text {
            margin: 2px 0 0 6px;
            font-size: 10px;
            background-color: #80808044;
            padding: 2px 5px;
            border-radius: 20px;
          }
        }
      }
    }
    .desc {
      margin: 5px 10px;
      font-size: 15px;
      color: rgb(227, 227, 227);
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
    .icon {
      display: flex;
      justify-content: space-between;
      margin: 10px;
      color: rgb(249, 249, 249);
      font-size: 14px;
      font-weight: 700;
      &__wrap {
        width: 128px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ffffff34;
        border-radius: 20px;
        padding: 3px 0;
        .iconfont {
          width: 26px;
          font-size: 22px;
        }
      }
      &__wrap:last-child {
        background-color: rgb(242, 63, 63);
      }
    }
    .bottom {
      margin: 20px 10px;
      .play {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 30px;
          color: white;
          height: 30px;
          width: 30px;
          line-height: 30px;
          border-radius: 50%;
          background-color: rgb(242, 63, 63);
        }
        .text {
          margin: 0 5px 0 10px;
        }
        .count {
          font-size: 14px;
          color: #252525;
        }
      }
      .songs {
        display: flex;
        align-items: center;
        margin: 10px 10px 10px 0;
        color: #383838;
        .index {
          width: 30px;
          margin-right: 12px;
          display: flex;
          justify-content: center;
        }
        .right {
          flex: 1;
          .name {
            font-size: 18px;
            color: black;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            display: -webkit-box;
            -webkit-box-orient: vertical;
          }
          .artists {
            display: flex;
            font-size: 14px;
            .ar {
            }
          }
        }
      }
    }
  }
}
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  top: 600px;
  left: 50%;
  transform: translate(-50%, -50%);

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: rgb(75, 75, 75);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    margin-top: 10px;
    font-size: 16px;
    color: #555;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
