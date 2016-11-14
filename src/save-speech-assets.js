'use strict';
const fs = require('fs');
const path = require('path');

module.exports = (assets, directory) => {
  saveToFile(assets.intentSchema, 'json', 'intentSchema', directory);
  saveToFile(assets.utterances, 'txt', 'utterances', directory);

  const customSlotsDir = path.join(directory, 'customSlots');
  Object.keys(assets.customSlots).forEach((key) => {
    const newLineFormat = assets.customSlots[key].join('\n');
    saveToFile(newLineFormat, 'txt', `${key}`, customSlotsDir);
  });
};

/**
 * Saves data to file with given type into given filename and directory, firstly checks if directory exists
 * @param {object|string} data
 * @param {string} type
 * @param {string} filename
 * @param {string} directory
 */
const saveToFile = (data, type, filename, directory) => {
  const pathname = path.join(directory, `${filename}.${type}`);
  checkDirectory(directory);
  fs.writeFileSync(pathname, data);
};

/**
 * Checks if given directory exists, if not it will be created
 * @param {string} directory
 */
const checkDirectory = (directory) => {
  try {
    fs.statSync(directory);
  } catch (e) {
    fs.mkdirSync(directory);
  }
};
