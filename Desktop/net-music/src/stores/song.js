import { defineStore } from "pinia"
import { ref } from "vue"

export const useSongStore = defineStore('currentSong', () => {
  const name = ref('')
  const songList = ref([])
  const singer = ref('')
  const urlList = ref([])
  const pic = ref('')
  const id = ref(0)
  const lyric = ref('')
  const favorite = ref(false)
  const playMode = ref('order')
  const index = ref(0)
  const fullScreen = ref(false)
  const playingState = ref(false)
  const miniPlayerBtm = ref('60px')
  const listBtm = ref('110px')
  return { name, songList, singer, pic, id, lyric, fullScreen, urlList, playingState, index, playMode, favorite, miniPlayerBtm, listBtm }
})