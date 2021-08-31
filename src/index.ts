import { getInput, setFailed, setOutput } from '@actions/core';
import { createWriteStream, WriteStream } from 'fs';
import { get } from 'https';

async function run(): Promise<void> {
  let version: string = getInput('version');

  if (version === 'latest') {
    version = '2.48.1';
  }

  const filename: string = `KeePass-${version}.zip`;
  const url: string = `https://sourceforge.net/projects/keepass/files/KeePass%202.x/${version}/${filename}/download`;

  try {
    await new Promise(resolve => {
      get(url, r => {
        r.setEncoding('binary');
        const file: WriteStream = createWriteStream(filename, {
          encoding: 'binary',
        });
        file.on('error', () => {
          throw new Error();
        });
        file.on('finish', resolve);
        r.pipe(file);
      });
    });
  } catch {
    return setFailed('error downloading file');
  }

  setOutput('filename', filename);
  setOutput('version', version);
}

void run();
