<!-- eslint-disable no-unused-vars -->
<script setup>
import { fetchBanner, fetchRecommends, fetchNewSong, fetchSongUrl, fetchLyric } from '@/api/api'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import { useSongStore } from '@/stores/song.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import 'swiper/css/pagination'
import 'swiper/css'
import BScroll from 'better-scroll'
import { onMounted } from 'vue'
import ErrorView from '@/components/basic/ErrorView.vue'

const modules = [Pagination, Autoplay]
const sliders = ref()
const playlistInfo = ref()
const albumInfo = ref()
const showAlert = ref(false)
const router = useRouter()
const currentSong = useSongStore()
const topBackgroundColor = ref('transparent')
const inputBackgroundColor = ref('linear-gradient(to right, #e4e7ff, #ffe6f4)')

onMounted(() => {
  const playlistScroll = new BScroll('.playlist-wrap', {
    scrollX: true,
    click: true,
    bounce: true
  })
  const scroll = new BScroll('.wrapper', {
    scrollY: true,
    click: true,
    bounce: true,
    probeType: 3
  })
  scroll.on('scroll', (pos) => {
    if (pos.y > -40) {
      topBackgroundColor.value = 'transparent'
      inputBackgroundColor.value = 'white'
    } else {
      topBackgroundColor.value = 'white'
      inputBackgroundColor.value = 'linear-gradient(to right, #e4e7ff, #ffe6f4)'
    }
  })
})

const closeError = () => {
  showAlert.value = !showAlert.value
}
const handlePlaylistClick = (id) => {
  router.push({ path: `/playlist/${id}` })
  currentSong.miniPlayerBtm = '0'
}
const handleSongClick = async (album) => {
  currentSong.songList.push(album.name)
  currentSong.name = album.name
  currentSong.pic = album.al.picUrl
  album.ar.forEach((artist) => {
    currentSong.singer = artist.name + ',' + currentSong.singer
  })
  await fetchSongUrl(album.id).then((res) => {
    console.log(res);
    if (res.data.data[0].url === null) {
      showAlert.value = true
    } else {
    currentSong.urlList.push(res.data.data[0].url)
    currentSong.fullScreen = true
    currentSong.playingState = true
    }
  })
  await fetchLyric(currentSong).then((res) => {
    console.log(res);
    currentSong.lyric = ''
    // currentSong.lyric = res.data.lrc.lyric
    console.log(currentSong.lyric)
  })
}

fetchBanner().then(async (res) => {
  sliders.value = await res.data.banners
})
fetchRecommends().then(async (res) => {
  playlistInfo.value = await res.data.playlists
  console.log(res);
})
fetchNewSong().then(async (res) => {
  albumInfo.value = await res.data.albums.slice(0, 20)
})
</script>

<template>
  <div class="wrapper">
    <div class="scroll-wrapper">
      <div class="header">
        <div class="header-mask"></div>
        <swiper
          :pagination="{
            clickable: true,
            dynamicBullets: true
          }"
          :modules="modules"
          :loop="true"
          :autoplay="{
            delay: 2500,
            disableOnInteraction: false
          }"
          class="slide"
        >
          <swiper-slide v-for="(slide, index) in sliders" :key="index">
            <img :src="slide.imageUrl" />
          </swiper-slide>
        </swiper>
      </div>
      <div class="middle">
        <div class="icon-wrapper">
          <img src="../assets/dicover-img/fm.png" />
          <span>私人漫游</span>
        </div>
        <div class="icon-wrapper">
          <img src="../assets/dicover-img/playlist.png" />
          <span>歌单</span>
        </div>
        <div class="icon-wrapper">
          <img src="../assets/dicover-img/rate.png" />
          <span>排行榜</span>
        </div>
        <div class="icon-wrapper">
          <img src="../assets/dicover-img/book.png" />
          <span>有声书</span>
        </div>
        <div class="icon-wrapper">
          <img src="../assets/dicover-img/album.png" />
          <span>数字专辑</span>
        </div>
      </div>
      <error-view :showAlert="showAlert" :closeError="closeError"></error-view>
      <div class="recommend">
        <div class="title">为你精选的云村歌单</div>
        <div class="playlist-wrap">
          <div class="playlists">
            <div
              class="playlist"
              v-for="(playlist, index) in playlistInfo"
              :key="index"
              @click="handlePlaylistClick(playlist.id)"
            >
              <div class="playlist-pic">
                <div class="iconfont ear">
                  &#xe66a;
                  <span class="count">{{ (playlist.playCount / 10000).toFixed(1) + ' 万' }}</span>
                </div>
                <v-img
                  class="rounded-lg"
                  width="120"
                  height="120"
                  lazy-src="../assets/netmusic.png"
                  :src="playlist.coverImgUrl"
                >
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular
                        color="grey-lighten-4"
                        indeterminate
                      ></v-progress-circular>
                    </div>
                  </template>
                </v-img>
                <div class="iconfont play">&#xe64f;</div>
              </div>
              <div class="playlist-text">
                {{ playlist.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="title">猜你喜欢的「今日」好歌</div>
        <div class="songs">
          <div
            v-for="(album, i) in albumInfo"
            :key="i"
            class="song"
            @click="handleSongClick(album)"
          >
            <div class="song__pic">
              <v-img
                class="rounded-lg"
                width="55"
                height="55"
                lazy-src="../assets/netmusic.png"
                :src="album.picUrl"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </div>
            <div class="song__detail">
                <div class="song__detail__name">{{ album.name }}</div>
                <div class="song__detail__info">
                  <span class="song__detail__info__reason" v-if="album.subType">{{
                    album.subType
                  }}</span>
                  <div class="song__detail__info__ar" v-for="artist in album.artists.slice(0, 3)" :key="artist">
                    {{ artist.name }}&nbsp;
                  </div>
                </div>
              <div class="iconfont">&#xe64f;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="top" :style="{ backgroundColor: topBackgroundColor }">
      <div class="tools iconfont">&#xe62b;</div>
      <div class="search" :style="{ backgroundColor: inputBackgroundColor }">
        <span class="iconfont">&#xe6bc;</span>
        <input type="text" placeholder="请输入搜索关键字..." />
      </div>
      <span class="free iconfont">&#xe62d;</span>
      <span class="reco iconfont">&#xe601;</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: rgba(237, 237, 237, 0.536);
  .top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 5px 10px 0 10px;
    z-index: 50;
    display: flex;
    align-items: center;
    text-align: center;
    margin-bottom: 5px;
    .tools {
      margin-right: 5px;
    }
    .search {
      flex: 1;
      display: flex;
      align-items: center;
      border-radius: 30px;
      font-size: 16px;
      height: 35px;
      border: 1px solid #ffffff;
      span {
        font-size: 20px;
        width: 20px;
        margin: 0 5px 0 10px;
      }
      input {
        outline: none;
      }
    }
    .free {
      margin-left: 5px;
      font-size: 25px;
    }
    .reco {
      font-size: 24px;
      margin-right: -3px;
    }
  }
  .scroll-wrapper {
    height: 2000px;
    .header {
      width: 100%;
      height: 224px;
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 10px;
      color: rgb(70, 70, 70);
      .header-mask {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(to right, #bec8ff, #ffcfec);
        -webkit-mask-image: linear-gradient(to bottom, #000000, transparent);
        z-index: -1;
      }
      .slide {
        display: flex;
        --swiper-pagination-color: #fff;
        height: 150px;
        width: 100%;
        border-radius: 10px;
        margin: 45px 5px 5px 5px;
        img {
          height: 150px;
          width: 400px;
          border-radius: 10px;
        }
      }
    }
    .middle {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: rgb(93, 93, 93);
      margin: 0 20px 20px 20px;
      .icon-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        img {
          width: 44px;
        }
      }
    }
    .recommend {
      color: rgb(19, 19, 19);
      .title {
        margin: 10px 0 5px 15px;
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 500;
        .iconfont {
          font-size: 13px;
          font-weight: 1000;
          margin-left: 2px;
        }
      }
      .playlist-wrap {
        width: 100%;
        height: 178px;
        overflow: hidden;
        margin-bottom: 20px;
        .playlists {
          display: flex;
          width: 850px;
          .playlist:first-child {
            margin-left: 15px;
          }
          .playlist {
            margin-right: 10px;
            font-size: 14px;
            color: rgb(32, 32, 32);
            .playlist-pic {
              border-radius: 10px;
              position: relative;
              .ear {
                display: flex;
                position: absolute;
                top: 2px;
                left: 5px;
                width: 100%;
                font-size: 12px;
                color: white;
                z-index: 50;
                .count {
                  font-size: 12px;
                  font-weight: 800;
                  margin: 0 0 0 3px;
                }
              }
              .play {
                position: absolute;
                bottom: -5px;
                right: -5px;
                font-size: 30px;
                color: white;
              }
            }
            .playlist-text {
              width: 120px;
              margin-top: 3px;
              overflow: hidden;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;
              display: -webkit-box;
              -webkit-box-orient: vertical;
            }
          }
        }
      }
      .songs {
        display: flex;
        flex-direction: column;
        margin: 0 15px 0 15px;
        .song {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          &__pic {
            margin-right: 10px;
          }
          &__detail {
            font-size: 18px;
            flex: 1;
            width: 200px;
            position: relative;
            &__info {
              display: flex;
              font-size: 12px;
              margin-top: 3px;
              &__reason {
                background-color: rgba(255, 114, 114, 0.293);
                color: rgb(238, 0, 0);
                padding: 0 3px 0 3px;
                margin-right: 5px;
                height: 15px;
                border-radius: 3px;
                font-size: 10px;
              }
            }
            .iconfont {
              position: absolute;
              right: 5px;
              top: 5px;
              font-size: 30px;
              color: rgb(53, 53, 53);
            }
          }
        }
      }
    }
  }
}
</style>
