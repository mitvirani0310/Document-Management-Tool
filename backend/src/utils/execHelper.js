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
  const result = {};
  
  data.forEach(obj => {
    Object.entries(obj).forEach(([key, valueArray]) => {
      if (!result[key]) {
        result[key] = valueArray[0];
      }
    });
  });
  
  return result;
};

module.exports = { executeExe, transformResponseData };