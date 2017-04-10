require('dotenv-safe').load();

const express = require('express');
const url = 'https://releases.hospitalrun.io';
const port = Number(process.env.PORT) || 5006;
// https://releases.hospitalrun.io/downloads/releases/latest/macos/HospitalRun.zip
const assetDownloadUrl = '/downloads/releases';
const homepageUrl = 'http://hospitalrun.io';

const app = express();
app.set('port', port);

app.listen(app.get('port'), () => {
  console.log('Server is running on port', app.get('port'));
});

app.get('/', (request, response) => {
  response.redirect(homepageUrl);
});

app.get('/updates/:asset', (request, response) => {
  const asset = request.params.asset;
  const platform = 'macos';
  const version = process.env.HOSPITALRUN_STABLE_VERSION;
  // console.log(`${url}${assetDownloadUrl}/${version}/${platform}/${asset}`);
  response.redirect(`${url}${assetDownloadUrl}/${version}/${platform}/${asset}`);
});

app.get('/updates/:platform/:asset', (request, response) => {
  const asset = request.params.asset;
  const platform = request.params.platform;
  const version = process.env.HOSPITALRUN_STABLE_VERSION;
  // console.log(`${url}${assetDownloadUrl}/${version}/${platform}/${asset}`);
  response.redirect(`${url}${assetDownloadUrl}/${version}/${platform}/${asset}`);
});

app.get('/updates', (request, response) => {
  const latestRelease = process.env.HOSPITALRUN_STABLE_VERSION;
  const version = request.query.version;
  if (version === latestRelease) {
    response.status(204).end();
  } else {
    let platform = request.query.platform;
    if (!platform) {
      platform = 'macos';
    }
    let fullurl = `${url}:${port}/updates/`;
    switch (platform) {
      case 'macos':
        fullurl += 'macos/HospitalRun.dmg';
        break;
      case 'win32':
        fullurl += 'win32/HospitalRun.exe';
        break;
      case 'win32x64':
        fullurl += 'win32x64/HospitalRun.exe';
        break;
    }
    response.json({
      name: `HospitalRun v${latestRelease}`,
      notes: 'The latest release of HospitalRun.',
      pub_date: new Date().toISOString(),
      url: fullurl
    });
  }
});
