const fs = require('fs');

const directoryPath = './videos/ipcam';

// Delete all files in the directory
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  // Iterate through the files and delete them
  files.forEach((file) => {
    fs.unlink(`${directoryPath}/${file}`, (error) => {
      if (error) {
        console.error('Error deleting file:', error);
      } else {
        console.log(`Deleted file: ${file}`);
      }
    });
  });
});

// Create a file called index.m3u8 in the directory
const filePath = `${directoryPath}/index.m3u8`;
fs.writeFile(filePath, '', (err) => {
  if (err) {
    console.error('Error creating file:', err);
    return;
  }
  console.log(`Created file: ${filePath}`);
});
