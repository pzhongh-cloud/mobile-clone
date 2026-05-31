const MAX_SIZE = 20 * 1024 * 1024
const MAX_WIDTH = 1024
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export function validateImage(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return '仅支持 PNG、JPG、WebP 格式'
  }
  if (file.size > MAX_SIZE) {
    return '图片大小不能超过 20MB'
  }
  return null
}

export function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      if (img.width <= MAX_WIDTH) {
        resolve(file)
        return
      }
      const ratio = MAX_WIDTH / img.width
      const canvas = document.createElement('canvas')
      canvas.width = MAX_WIDTH
      canvas.height = img.height * ratio
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else resolve(file)
      }, file.type, 0.85)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片加载失败'))
    }
    img.src = url
  })
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Base64 转换失败'))
    reader.readAsDataURL(blob)
  })
}

export async function fileToBase64(file: File): Promise<string> {
  const compressed = await compressImage(file)
  return blobToBase64(compressed)
}
