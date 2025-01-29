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

module.exports = { executeExe };