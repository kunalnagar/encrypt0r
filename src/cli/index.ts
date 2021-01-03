#!/usr/bin/env node

import yargs from 'yargs';

import Crypto from '../Crypto';

const options = yargs
  .option('m', {
    alias: 'mode',
    describe: 'encrypt | decrypt',
    demandOption: true,
  })
  .option('f', {
    alias: 'filepath',
    describe: 'Path to file',
    demandOption: true,
  })
  .option('p', {
    alias: 'passphrase',
    describe: 'Passphrase',
    demandOption: true,
  }).argv;

const mode = options.m;
const filepath = `${options.f}`;
const passphrase = `${options.p}`;

console.log(options, mode, filepath, passphrase);

const crypto = new Crypto(filepath, `${filepath}.enc`, passphrase);

if (mode === 'encrypt') {
  crypto.encrypt();
} else if (mode === 'decrypt') {
  crypto.decrypt();
}
