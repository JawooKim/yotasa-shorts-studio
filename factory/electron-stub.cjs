// 헤드리스 렌더링용 가짜 electron 모듈. 창·대화상자 없이 electron/main.ts의 제작 엔진만 쓰기 위해 쓴다.
const os = require('os');
const path = require('path');
const userData = process.env.KSHORTS_USER_DATA || path.join(os.homedir(), '.kshorts-factory');
const noop = () => {};
const app = {
  isPackaged: false,
  getPath: (name) => (name === 'temp' ? os.tmpdir() : userData),
  whenReady: () => new Promise(noop), // 창을 띄우지 않는다
  on: noop, once: noop, quit: noop, exit: noop, relaunch: noop,
  requestSingleInstanceLock: () => true,
  getVersion: () => require('../package.json').version,
};
class BrowserWindow { static getAllWindows() { return []; } }
module.exports = {
  app,
  BrowserWindow,
  ipcMain: { handle: noop, on: noop, removeHandler: noop },
  dialog: { showOpenDialog: async () => ({ canceled: true, filePaths: [] }), showMessageBoxSync: () => 0 },
  shell: { openExternal: async () => {}, openPath: async () => '', showItemInFolder: noop },
  safeStorage: { isEncryptionAvailable: () => false },
};
