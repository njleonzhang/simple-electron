const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

if (process.platform === "linux") app.commandLine.appendSwitch("no-sandbox");

// 移除工具栏
Menu.setApplicationMenu(null);

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.maximize();
  mainWindow.show();

  let url = app.commandLine.getSwitchValue('url');
  let debug = app.commandLine.getSwitchValue('debug') || null;

  // and load the index.html of the app.
  mainWindow.loadURL(url || "http://10.15.70.4:19090/applicationview/content/view?appid=31ccf863-5330-73d7-0504-2dee788b0244&type=view&menuId=279bea23-62ec-0625-1eaf-b7ac7b738a38&ssoType=test&token=admin");

  // Open the DevTools.
  if (debug) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.setWindowOpenHandler(() => {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: { show: false },
    }
  })

  mainWindow.webContents.on('did-create-window', win =>
    win.once('ready-to-show', () => win.maximize()),
  )
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
