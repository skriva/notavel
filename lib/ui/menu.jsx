import ipc from 'ipc';
import remote from 'remote';


export default class AppMenu {
  constructor ({ handleAdd, handleDelete, handleChangeEditorMode }) {
    this._handleAdd = handleAdd;
    this._handleDelete = handleDelete;
    this._handleChangeEditorMode = handleChangeEditorMode;
  }

  build ({ openedNote }) {
    const Menu = remote.require('menu');
    var template = [
      {
        label: 'Notavel',
        submenu: [
          {
            label: 'About Notavel',
            selector: 'orderFrontStandardAboutPanel:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Services',
            submenu: []
          },
          {
            type: 'separator'
          },
          {
            label: 'Hide Notavel',
            accelerator: 'CmdOrCtrl+H',
            selector: 'hide:'
          },
          {
            label: 'Hide Others',
            accelerator: 'CmdOrCtrl+Shift+H',
            selector: 'hideOtherApplications:'
          },
          {
            label: 'Show All',
            selector: 'unhideAllApplications:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: function() { ipc.sendSync('quit-app'); }
          }
        ]
      },
      {
        label: 'Notes',
        submenu: [
          {
            label: 'New',
            accelerator: 'CmdOrCtrl+N',
            click: this._handleAdd
          },
          {
            label: 'Change Editor Mode',
            accelerator: 'CmdOrCtrl+E',
            enabled: !!openedNote,
            click: this._handleChangeEditorMode
          },
          {
            label: 'Delete',
            accelerator: 'CmdOrCtrl+D',
            enabled: !!openedNote,
            click: this._handleDelete
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            selector: 'undo:'
          },
          {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            selector: 'redo:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            selector: 'cut:'
          },
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            selector: 'copy:'
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            selector: 'paste:'
          },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            selector: 'selectAll:'
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: function() { remote.getCurrentWindow().reloadIgnoringCache(); }
          },
          {
            label: 'Toggle DevTools',
            accelerator: 'Alt+CmdOrCtrl+I',
            click: function() { remote.getCurrentWindow().toggleDevTools(); }
          }
        ]
      },
      {
        label: 'Window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            selector: 'performMiniaturize:'
          },
          {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            selector: 'performClose:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Bring All to Front',
            selector: 'arrangeInFront:'
          }
        ]
      },
      {
        label: 'Help',
        submenu: []
      }
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }
}
