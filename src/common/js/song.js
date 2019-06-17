export default class Song {
  /**
   * 一个构造歌手详情数据的构造器
   * @param {*} param0 歌手详情数据 
   */
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export const createSong = (musicData) => {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

/**
 * 一个改造歌手名称的方法
 * @param {*} singer 歌手数据
 */
const filterSinger = (singer) => {
  let ret = []
  if (!singer) return ''
  singer.forEach((s) => {
    ret.push(s.name)
  })

  return ret.join('/')
}
