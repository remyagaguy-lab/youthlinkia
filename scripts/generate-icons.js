import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const inputPath = path.join(process.cwd(), 'public', 'brand', 'logo-color.png')
const outputDir = path.join(process.cwd(), 'public')

async function generateIcons() {
  try {
    if (!fs.existsSync(inputPath)) {
      console.log('No logo-color.png found to resize.')
      return
    }

    // Resize to 192x192
    await sharp(inputPath)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toFile(path.join(outputDir, 'icon-192x192.png'))
    console.log('Created icon-192x192.png')

    // Resize to 512x512
    await sharp(inputPath)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toFile(path.join(outputDir, 'icon-512x512.png'))
    console.log('Created icon-512x512.png')

    // Also copy as favicon.ico or apple-icon if needed, but manifest covers PWA.
  } catch (error) {
    console.error('Error generating icons:', error)
  }
}

generateIcons()
