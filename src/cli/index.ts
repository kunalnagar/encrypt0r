#!/usr/bin/env node

import { existsSync, lstatSync } from 'fs';
import yargs from 'yargs';

import Crypto from '../business-logic/Crypto';

const options = yargs
  .option('m', {
    alias: 'mode',
    describe: 'Mode',
    choices: ['encrypt', 'decrypt'],
    demandOption: true,
  })
  .option('i', {
    alias: 'input',
    describe: 'Input file',
    demandOption: true,
  })
  .option('o', {
    alias: 'output',
    describe: 'Output folder',
  })
  .option('p', {
    alias: 'passphrase',
    describe: 'Passphrase',
    demandOption: true,
  })
  .parseSync();

const oMode = `${options.m}`;
const oInput = `${options.i}`;
const oOutput = options.o;
const oPassphrase = `${options.p}`;

if (!existsSync(oInput)) {
  console.error('ERROR: Input file does not exist');
  process.exit();
} else if (!lstatSync(oInput).isFile()) {
  console.error('ERROR: Input is not a file');
  process.exit();
}

if (oOutput && !existsSync(oOutput as string)) {
  console.error('ERROR: Output directory does not exist');
  process.exit();
} else if (!lstatSync(oOutput as string).isDirectory()) {
  console.error('ERROR: Output is not a directory');
  process.exit();
}

const sourceArray = oInput.split('/');
const filename = sourceArray[sourceArray.length - 1];

let outputFile = '';
if (oOutput) {
  if (oMode === 'encrypt') {
    outputFile = `${oOutput}/${filename}.enc`;
  } else if (oMode === 'decrypt') {
    outputFile = `${oOutput}/${filename.replace('.enc', '')}`;
  }
} else if (oMode === 'encrypt') {
  outputFile = `${oInput}.enc`;
} else if (oMode === 'decrypt') {
  outputFile = `${oInput.replace('.enc', '')}`;
}

const crypto = new Crypto(oInput, outputFile, oPassphrase);

if (oMode === 'encrypt') {
  crypto.encrypt();
} else if (oMode === 'decrypt') {
  crypto.decrypt();
}
