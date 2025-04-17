var scopackager = require('simple-scorm-packager');
var path = require('path');
const fs = require('fs');
const folderZipSync = require('folder-zip-sync');

let files = fs.readdirSync('./build/', { withFileTypes: false });

fs.mkdirSync('./scorm_packages/');
files.forEach((_f) => {
  fs.mkdirSync(`./scorm_packages/${_f}/`);
  fs.cpSync(`./build/${_f}/`, `./scorm_packages/${_f}/`, { recursive: true });
  fs.cpSync(`./scorm_files/`, `./scorm_packages/${_f}/`, { recursive: true });
  folderZipSync(`./scorm_packages/${_f}/`, `./scorm_packages/${_f}.zip`);
  fs.rmSync(`./scorm_packages/${_f}/`, { recursive: true });
});

