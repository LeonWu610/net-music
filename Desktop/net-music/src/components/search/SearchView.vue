<template>
  <div class="wrapper">
    <div class="search">
      <div class="search-input-wrapper">
        <div class="iconfont back" @click="goBack()">&#xe60d;</div>
        <div class="search-input">
          <svg-icon type="mdi" :path="mdiMagnify" class="icon-search"></svg-icon>
          <input
            class="input-inner"
            v-model="searchText"
            :placeholder="text"
            @keydown.enter="handleEnter"
          />
          <svg-icon
            v-show="songs.length > 0"
            type="mdi"
            :path="mdiClose"
            class="icon-dismiss"
            @click="clear"
          ></svg-icon>
        </div>
        <div class="text" @click="search(searchText)">搜索</div>
      </div>
      <div class="search-content" v-show="!show">
        <div>
          <div class="hot-keys">
            <h1 class="title">猜你喜欢</h1>
            <ul>
              <li class="item" v-for="item in hotKeys" :key="item" @click="search(item.first)">
                <span>{{ item.first }}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory?.length">
            <div class="title">
              <span>搜索历史</span>
              <svg-icon type="mdi" :path="mdiClose" class="clear" @click="clearHistory"></svg-icon>
            </div>
            <div v-for="txt in searchHistory" :key="txt" class="text">
              <span>{{ txt }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="search-result" v-show="songs.length > 0 && show">
        <div class="songs">
          <div
            class="song-item"
            v-for="(song, index) in songs"
            :key="song.id"
            @click="handleSongClick(song, index)"
          >
            <div class="name">{{ song.name }}</div>
            <div class="btm">
              <div class="info">
                <div class="artists">
                  <div class="artist" v-for="artist in song.artists.slice(0, 3)" :key="artist">
                    {{ artist.name }}&nbsp;
                  </div>
                </div>
                <span class="album" v-if="song.album.name">{{ song.album.name }}</span>
              </div>
              <div class="iconfont">&#xe6d0;</div>
            </div>
          </div>
        </div>
        <div class="iconfont back" @click="hide()">&#xe60d;</div>
      </div>
    </div>
    <PlayerView></PlayerView>
  </div>
</template>

<script setup>
import SvgIcon from '@jamescoyle/vue-icon'
import PlayerView from '@/components/player/PlayerView.vue'
import { mdiMagnify, mdiClose } from '@mdi/js'
import { ref, computed } from 'vue'
import { fetchHotKeys, fetchSearchResult, fetchSongUrl, fetchLyric } from '@/api/api'
import { useSearchStore } from '@/stores/search'
import { useSongStore } from '@/stores/song.js'
import router from '@/router'
import BScroll from 'better-scroll'
import { onMounted } from 'vue'

onMounted(() => {
  new BScroll('.search-result', {
    scrollY: true,
    click: true,
    bounce: true
  })
  currentSong.miniPlayerBtm = '0'
  currentSong.listBtm = '50px'
})

const hotKeys = ref([])
const songs = ref([])
const Urls = ref([])
const searchText = ref('')
const show = ref(false)

const searchStore = useSearchStore()
const currentSong = useSongStore()
const searchHistory = computed(() => searchStore.searchHistory)
const text = computed(() => searchText.value !== '' ? searchText.value : '搜索歌曲，歌手')

fetchHotKeys().then((res) => {
  hotKeys.value = res.data.result.hots
})

const goBack = () => {
  router.back()
  currentSong.miniPlayerBtm = '60px'
  currentSong.listBtm = '110px'
}

const hide = () => {
  show.value = !show.value
}

const clear = () => {
  searchText.value = ''
  show.value = false
}

const handleEnter = (event) => {
  if (event.key === 'Enter') {
    search(searchText.value)
  }
}

const search = async (key) => {
  searchText.value = key
  await fetchSearchResult(key).then((res) => {
    songs.value = res.data.result.songs
    res.data.result.songs.forEach(async (song) => {
      await fetchSongUrl(song.id).then((res) => {
        console.log(res)
        Urls.value.push(res.data.data[0].url)
      })
    })
  })
  show.value = true

  if (searchHistory.value.length === 0) {
    searchStore.searchHistory.push(key)
  } else {
    const found = searchHistory.value.some((history) => {
      return history === key
    })

    if (!found) {
      searchStore.searchHistory.push(key)
    }
  }
}

const handleSongClick = async (song, index) => {
  currentSong.id = song.id
  currentSong.pic = song.artists[0].img1v1Url
  currentSong.index = index
  currentSong.fullScreen = true
  currentSong.playingState = true
  songs.value.forEach((song) => {
    currentSong.songList.push(song.name)
  })
  song.artists.forEach((ar) => {
    currentSong.singer += ar.name
  })
  Urls.value.forEach((url) => currentSong.urlList.push(url))
  await fetchLyric(currentSong).then((res) => {
    currentSong.lyric = res.data.lrc.lyric
  })
}

const clearHistory = () => {
  searchStore.searchHistory = []
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
}
.search {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  display: flex;
  background-color: #f0f0f0c8;
  flex-direction: column;
  .search-input-wrapper {
    display: flex;
    align-items: center;
    margin: 20px 20px 20px 10px;
    .back {
      font-size: 22px;
      width: 22px;
      margin-right: 5px;
    }
    .search-input {
      display: flex;
      flex: 1;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      padding: 0 6px;
      height: 38px;
      background: rgb(255, 255, 255);
      border-radius: 20px;
      .icon-search {
        font-size: 24px;
        margin: 2px 0 0 5px;
        color: rgb(111, 111, 111);
      }
      .input-inner {
        flex: 1;
        margin: 0 5px;
        line-height: 18px;
        background: rgb(255, 255, 255);
        font-size: 16px;
        outline: 0;
        &::placeholder {
          color: rgb(91, 91, 91);
        }
      }
      .icon-dismiss {
        font-size: 14px;
        margin-right: 5px;
        color: gray;
      }
    }
    .text {
      font-size: 18px;
      margin-left: 10px;
      color: rgb(41, 41, 41);
    }
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: 500;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 10px 10px 0;
        border-radius: 20px;
        color: #1c1c1c;
        background: rgb(255, 255, 255);
        font-size: 15px;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 10px;
        .clear {
          width: 18px;
          height: 18px;
        }
      }
      .text {
        font-size: 14px;
        border-radius: 10px;
        color: #1c1c1c;
        background: rgb(255, 255, 255);
        padding: 2px 10px;
        margin-bottom: 5px;
      }
    }
  }
  .search-result {
    flex: 1;
    height: 100%;
    .back {
      position: absolute;
      top: 22px;
      left: 10px;
      font-size: 22px;
    }
    .song-item {
      position: relative;
      margin: 10px 5px 15px 15px;
      margin-bottom: 5px;
      background-color: #f2f2f2b1;
      border-radius: 5px;
      font-size: 18px;
      cursor: pointer;
      .btm {
        display: flex;
        align-items: center;
        .info {
          .artists {
            display: flex;
            font-size: 12px;
            color: #626262;
          }
          .album {
            font-size: 10px;
            width: 100%;
            color: rgb(219, 190, 0);
            border: 1px solid rgb(219, 190, 0);
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            padding: 0 2px;
            border-radius: 5px;
          }
        }
        .iconfont {
          position: absolute;
          right: 0;
          top: 5px;
          font-size: 20px;
          color: rgb(53, 53, 53);
        }
      }
    }
  }
}
</style>
