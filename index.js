#!/usr/bin/env node

import AutoComplete from '@8columns/prompt-autocompletion';
import { exec } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let urls = JSON.parse(fs.readFileSync(__dirname + '/urls.json', {encoding:'utf8'}));

function searchURLs(answers, input) {
  return new Promise(function(resolve) {
    resolve(urls.filter(filter(input)));
  })
}

function filter(input) {
  return function(selection) {
    return new RegExp(input, 'i').exec(selection) !== null;
  }
}

let autoComplete = new AutoComplete({
    type: 'autocomplete',
    name: 'url',
    message: 'Select Application',
    source: searchURLs

})

autoComplete.run().then(selection => {
  let url = 'https://' + selection;

  if (process.argv && process.argv.length >= 3) {
      url = process.argv[2];
  }

  exec('chrome.exe --start-maximized --app=' + url);
})
