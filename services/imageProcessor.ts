
import { ProcessedImageResult } from '../types';

export const processImage = (file: File, maxDimension: number = 1024): Promise<ProcessedImageResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width: originalWidth, height: originalHeight } = img;
          let newWidth = originalWidth;
          let newHeight = originalHeight;

          if (newWidth > maxDimension || newHeight > maxDimension) {
            if (newWidth > newHeight) {
              newHeight = Math.round((newHeight * maxDimension) / newWidth);
              newWidth = maxDimension;
            } else {
              newWidth = Math.round((newWidth * maxDimension) / newHeight);
              newHeight = maxDimension;
            }
          }
          
          // Ensure width is an even number for proper 4-bit packing
          if (newWidth % 2 !== 0) {
            if (newWidth > 1) {
                newWidth -=1;
                 // Optional: slightly adjust height to maintain aspect ratio after width adjustment
                newHeight = Math.round(originalHeight * (newWidth / originalWidth));

            } else {
                newWidth = 2; // Minimum even width
                 newHeight = Math.round(originalHeight * (newWidth / originalWidth));
            }
          }
          // Ensure height is also an integer
          newHeight = Math.round(newHeight);


          const canvas = document.createElement('canvas');
          canvas.width = newWidth;
          canvas.height = newHeight;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Could not get canvas context.'));
            return;
          }

          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          const processedImageUrl = canvas.toDataURL('image/png');
          const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
          const { data } = imageData;
          const fourBitPixels: number[] = [];

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // const a = data[i + 3]; // Alpha not used

            const grayscale = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
            const fourBitValue = Math.round((grayscale / 255) * 15); // 0-15 (0x0 - 0xF)
            fourBitPixels.push(fourBitValue);
          }

          const byteArray: number[] = [];
          for (let i = 0; i < fourBitPixels.length; i += 2) {
            const pixel1 = fourBitPixels[i];
            // If there's an odd number of pixels, the last pixel1 will not have a pixel2.
            // The (width * height) / 2 array size implies total pixels is even.
            // With newWidth being even, newWidth * newHeight is always even.
            const pixel2 = fourBitPixels[i + 1]; 
            const byte = (pixel1 << 4) | pixel2;
            byteArray.push(byte);
          }
          
          const variableBaseName = "img_board"; // Will be replaced by actual image name in CodeDisplay
          const hexBytes = byteArray.map(byte => `0x${byte.toString(16).toUpperCase().padStart(2, '0')}`);
          
          let cCode = `const uint32_t ${variableBaseName}_width = ${newWidth};\n`;
          cCode += `const uint32_t ${variableBaseName}_height = ${newHeight};\n`;
          cCode += `const uint8_t ${variableBaseName}_data[(${newWidth} * ${newHeight}) / 2] = {\n    `;

          for (let i = 0; i < hexBytes.length; i++) {
            cCode += hexBytes[i];
            if (i < hexBytes.length - 1) {
              cCode += ", ";
            }
            if ((i + 1) % 16 === 0 && i < hexBytes.length - 1) {
              cCode += "\n    ";
            }
          }
          cCode += "\n};";

          resolve({ cCode, processedImageUrl, width: newWidth, height: newHeight });

        } catch (processErr) {
           reject(processErr instanceof Error ? processErr : new Error('Error processing image data.'));
        }
      };
      img.onerror = () => {
        reject(new Error('Could not load image.'));
      };
      if (event.target?.result) {
         img.src = event.target.result as string;
      } else {
         reject(new Error('Could not read image file.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };

    reader.readAsDataURL(file);
  });
};
