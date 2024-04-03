import { getInput, setFailed, setOutput } from '@actions/core';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';

async function getLatestVersion(): Promise<string> {
  const r = await fetch('https://keepass.info/download.html');
  if (r.ok) {
    const t = await r.text();
    const re = new RegExp(
      /https:\/\/sourceforge\.net\/projects\/keepass\/files\/KeePass%202\.x\/[\d.]+?\/KeePass-([\d.]+?)\.zip\/download/i,
    );
    const arr = re.exec(t);
    if (arr.length == 2) return arr[1];
  }
  return undefined;
}

async function run(): Promise<void> {
  let version: string = getInput('version');

  if (version === 'latest') {
    version = await getLatestVersion();

    if (version == undefined) {
      return setFailed('Unable to determine latest keepass version');
    }
  }

  const filename: string = `KeePass-${version}.zip`;
  const url: string = `https://sourceforge.net/projects/keepass/files/KeePass%202.x/${version}/${filename}/download`;

  try {
    await new Promise(resolve => {
      fetch(url).then(r => {
        if (!r.ok) {
          throw new Error('download failed');
        }
        const file = createWriteStream(filename, {
          encoding: 'binary',
        });
        file.on('error', () => {
          throw new Error();
        });
        file.on('finish', resolve);
        Readable.fromWeb(r.body).pipe(file);
      });
    });
  } catch {
    return setFailed('error downloading file');
  }

  setOutput('filename', filename);
  setOutput('version', version);
}

void run();
