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
  const version = process.env.HOSPITALRUN_STABLE_VERSION;
  response.redirect(`${assetDownloadUrl}/v${version}/${asset}`);
});

app.get('/updates', (request, response) => {
  const version = request.query.version;
  const latestRelease = process.env.HOSPITALRUN_STABLE_VERSION;
  if (version === latestRelease) {
    response.status(204).end();
  } else {
    response.json({
      name: `HospitalRun v${latestRelease}`,
      notes: 'The latest release of HospitalRun.',
      pub_date: new Date().toISOString(),
      url: ''
      // url: `${url}:${port}/updates/HospitalRun-${latestRelease}.dmg`
    });
  }
});
