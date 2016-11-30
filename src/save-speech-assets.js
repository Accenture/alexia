'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

module.exports = (assets, directory) => {

  fs.mkdirSync(directory);

  // Save intentSchema.json and utterances.txt
  saveToFile(assets.intentSchema, directory, 'intentSchema', 'json');
  saveToFile(assets.utterances, directory, 'utterances', 'txt');

  // Save customSlots
  const customSlotsDir = path.join(directory, 'customSlots');
  const customSlotNames = _.keys(assets.customSlots);

  if (customSlotNames && customSlotNames.length > 0) {
    fs.mkdirSync(customSlotsDir);
    customSlotNames.forEach((key) => {
      const newLineFormat = assets.customSlots[key].join('\n');
      saveToFile(newLineFormat, customSlotsDir, key, 'txt');
    });
  }
};

/**
 * Saves data to directory with specified filename and extension
 * @param {object|string} data
 * @param {string} directory
 * @param {string} filename
 * @param {string} extension
 */
const saveToFile = (data, directory, filename, extension) => {
  const pathname = path.join(directory, `${filename}.${extension}`);
  fs.writeFileSync(pathname, data);
};
