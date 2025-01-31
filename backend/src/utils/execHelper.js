const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const executeExe = async (exePath, pdfPath) => {
  try {
    const { stdout } = await execPromise(`"${exePath}" "${pdfPath}"`);
    return JSON.parse(stdout); // Assuming EXE outputs JSON
  } catch (error) {
    throw new Error(`EXE execution failed: ${error.message}`);
  }
};

const transformResponseData = (data) => {
  const transformedData = {};
  
  // Loop through each key in the data object
  Object.keys(data).forEach(key => {
    // Convert key to camelCase
    const camelKey = key.replace(/\s(.)/g, (match) => match[1].toUpperCase())
                       .replace(/\s/g, '')
                       .replace(/^(.)/, (match) => match.toLowerCase());
    
    // Get first value from array
    transformedData[camelKey] = data[key][0];
  });
  
  return transformedData;
};

module.exports = { executeExe, transformResponseData };