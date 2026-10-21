const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('examDesktop',Object.freeze({minimize:()=>ipcRenderer.invoke('desktop:minimize'),restore:()=>ipcRenderer.invoke('desktop:restore'),move:(dx,dy)=>ipcRenderer.send('desktop:move',dx,dy),menu:()=>ipcRenderer.send('desktop:menu')}));
