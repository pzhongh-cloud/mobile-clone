const AVATAR_FILES = [
  'image_013451785914540.jpg',
  'image_027033475145044.jpg',
  'image_077793916263989.jpg',
  'image_082762672470890.jpg',
  'image_096214733477423.jpg',
  'image_096931621064059.jpg',
  'image_138029673841690.jpg',
  'image_177929089090915.png',
  'image_177929089222454.png',
  'image_177929089388601.png',
  'image_177929089618711.png',
  'image_177929089868528.png',
  'image_177929089983837.png',
  'image_177929090193797.png',
  'image_177929090406037.png',
  'image_177929090716272.png',
  'image_177929090901521.png',
  'image_177929091061329.png',
  'image_180907543474646.jpg',
  'image_189075590360483.jpg',
  'image_195686582988362.jpg',
  'image_207916203597470.jpg',
  'image_215973185687412.jpg',
  'image_265794638978002.jpg',
  'image_287497735650042.jpg',
  'image_352345882662470.jpg',
  'image_384857654482672.jpg',
  'image_475015482933445.jpg',
  'image_497580274824186.jpg',
  'image_503586868980610.jpg',
  'image_506499756060221.jpg',
  'image_595428027213053.jpg',
  'image_596829396176641.jpg',
  'image_619099170231752.jpg',
  'image_717462270609787.jpg',
  'image_725910602908633.jpg',
  'image_737030393887657.jpg',
  'image_760634691636201.jpg',
  'image_770822748059143.jpg',
  'image_999043202236628.jpg',
]

function hashString(s: string): number {
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

let generation = 0

/** 每次生成前调用，重新随机头像分配 */
export function nextGeneration(): void {
  generation++
}

/** 根据 speaker 名返回头像路径（同次生成内同一 speaker 始终相同，每次生成重新随机） */
export function getAvatarForName(name: string): string {
  const seed = generation * 10000 + hashString(name)
  const index = seed % AVATAR_FILES.length
  return `/avatars/${AVATAR_FILES[index]}`
}

/** 返回我的头像（固定使用一张） */
export function getMyAvatar(): string {
  return `/avatars/${AVATAR_FILES[16]}`
}
