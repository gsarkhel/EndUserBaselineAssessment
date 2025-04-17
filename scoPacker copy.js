var scopackager = require('simple-scorm-packager');
var path = require('path');
const fs = require('fs');

let files = fs.readdirSync('./build/', { withFileTypes: false });
files.forEach((_f) => {
  const config = {
    version: '2004 4th Edition',
    organization: '',
    title: 'End User Baseline Assessment',
    language: 'en-US',
    masteryScore: undefined,
    startingPage: 'index.html',
    source: path.join(__dirname, 'build/' + _f),
    package: {
      version: process.env.npm_package_version,
      zip: true,
      author: 'Sushant Ipte',
      outputFolder: path.join(__dirname, 'scorm_packages'),
      description: 'End User Baseline Assessment',
      keywords: [],
      typicalDuration: 'PT0H5M0S',
      vcard: {
        author: 'Sushant Ipte',
        org: '',
      },
    },
  };

  scopackager(config, function (msg) {
    console.log(msg);
    process.exit(0);
  });
});

