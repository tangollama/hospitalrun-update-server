require('dotenv-safe').load();

const express = require('express');
const url = 'https://releases.hospitalrun.io';
var newrelic = require('newrelic');
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
  newrelic.addCustomParameters({
    'hr_version': version,
    'hr_platform': platform,
    'hr_asset': asset,
    'hr_update_action': 'download'
  });
  // console.log(`${url}${assetDownloadUrl}/${version}/${platform}/${asset}`);
  response.redirect(`${url}${assetDownloadUrl}/${version}/${platform}/${asset}`);
});

app.get('/updates/:platform/:asset', (request, response) => {
  const asset = request.params.asset;
  const platform = request.params.platform;
  const version = process.env.HOSPITALRUN_STABLE_VERSION;
  // log the update inquiry in insights
  newrelic.addCustomParameters({
    'hr_version': version,
    'hr_platform': platform,
    'hr_asset': asset,
    'hr_update_action': 'download'
  });
  // console.log(`${url}${assetDownloadUrl}/${version}/${platform}/${asset}`);
  response.redirect(`${url}${assetDownloadUrl}/${version}/${platform}/${asset}`);
});

app.get('/updates', (request, response) => {
  const latestRelease = process.env.HOSPITALRUN_STABLE_VERSION;
  const version = request.query.version;

  // log the update inquiry in insights
  newrelic.addCustomParameters({
    'hr_version': request.query.version,
    'hr_platform': request.query.platform,
    'hr_update_action': (request.query.version === latestRelease),
    'hr_update_action': 'inquiry'
  });

  if (version === latestRelease) {
    response.status(204).end();
  } else {
    let platform = request.query.platform;
    if (!platform) {
      platform = 'macos';
    }
    let fullurl = `${url}/updates/`;
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
