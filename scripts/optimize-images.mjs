import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Define directories
const inputDir = 'images';
const outputDir = 'public/optimized-images';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

// Read files from input directory
const imageFiles = fs.readdirSync(inputDir).filter(file => 
  /\.(jpe?g|png)$/i.test(file)
);

console.log(`Found ${imageFiles.length} images to optimize.`);

// Process each image
const processImages = async () => {
  let successCount = 0;
  let failCount = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const outputFileName = `${path.parse(file).name}.webp`;
    const outputPath = path.join(outputDir, outputFileName);

    try {
      await sharp(inputPath)
        .resize({ width: 1920, withoutEnlargement: true }) // Resize to max 1920px width
        .webp({ quality: 80 }) // Convert to WebP with 80% quality
        .toFile(outputPath);
      
      console.log(`✅ Successfully optimized ${file} -> ${outputFileName}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to optimize ${file}:`, error);
      failCount++;
    }
  }

  console.log('\n--- Optimization Summary ---');
  console.log(`Total images processed: ${imageFiles.length}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log('--------------------------');
};

processImages();
