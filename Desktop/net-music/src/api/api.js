import axios from 'axios'
import pinyin from 'pinyin'

const instance = axios.create({
  baseURL: 'https://netease-cloud-music-api-drab-eight.vercel.app/'
})

export async function fetchBanner () {
  return await instance.get('/banner')
}

export async function fetchRecommends () {
  return await instance.get('/top/playlist?limit=6')
}

export async function fetchNewSong () {
  return await instance.get('/recommend/songs')
}

async function fetchSinger () {
  return await instance.get('/artist/list?type=-1&area=-1&limit=100')
}
export const fetchArtistList = async () => {
  const HOT_NAME = '热'
  const artistList = []
  const hot = []
  const letter = []
  let singerMap = {}
  await fetchSinger().then((res) => {
    for (const artist of res.data.artists) {
      artistList.push({
        name: artist.name,
        picUrl: artist.picUrl,
        id: artist.id
      })
    }
    singerMap = {
      hot: {
        title: HOT_NAME,
        list: artistList.slice(0, 10)
      }
    }
    artistList.forEach((item) => {
      // 把歌手名转成拼音
      const p = pinyin(item.name)
      if (!p || !p.length) {
        return
      }
      // 获取歌手名拼音的首字母
      const key = p[0][0].slice(0, 1).toUpperCase()
      if (key) {
        if (!singerMap[key]) {
          singerMap[key] = {
            title: key,
            list: []
          }
        }
        // 每个字母下面会有多名歌手
        singerMap[key].list.push([item][0])
      }
    })

    // 遍历处理 singerMap，让结果有序
    for (const key in singerMap) {
      const item = singerMap[key]
      if (item.title.match(/[a-zA-Z]/)) {
        letter.push(item)
      } else if (item.title === HOT_NAME) {
        hot.push(item)
      }
    }
    // 按字母顺序排序
    letter.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
  })

  return { hot, letter }
}

export async function fetchSingerDetail (id) {
  return await instance.get(`/artist/songs?id=${id}`)
}
export async function fetchSongUrl (id) {
  return await instance.get(`/song/url?id=${id}`)
}

export const fetchSongs = async (id) => {
  const songDetail = []
  await fetchSingerDetail(id).then((res) => {
    console.log(res);
    let songurl = ''
    for (const song of res.data.songs) {
      fetchSongUrl(song.id).then((res) => {
        songurl = res.data.data[0].url
        songDetail.push({
          name: song.name,
          id: song.id,
          duration: song.dt,
          url: songurl
        })
      })
    }
  })

  return songDetail
}

export async function fetchLyric (song) {
  return await instance.get(`/lyric?id=${song.id}`)
}

export async function fetchRateList () {
  return await instance.get('/toplist')
}

export async function fetchRateDetail (id) {
  return await instance.get(`/playlist/detail?id=${id}`)
}

export async function fetchSearchResult (keyword) {
  return await instance.get(`/search?keywords=${keyword}`)
}

export async function fetchHotKeys () {
  return await instance.get('/search/hot')
}

export async function Login () {
  return await instance.get('/register/anonimous')
}

export async function getCaptcha (phone) {
  return await instance.get(`/captcha/sent?phone=${phone}`)
}