const {app,BrowserWindow,ipcMain,Menu,shell,screen,dialog}=require('electron');
const path=require('node:path');const {pathToFileURL}=require('node:url');
let workbench,pet,quitting=false,petReady,showing=false;
const entry=path.join(__dirname,'app','index.html');
const base=pathToFileURL(entry).href;
const preload=path.join(__dirname,'preload.cjs');
function own(event,kind){const w=kind==='pet'?pet:workbench;return w&&!w.isDestroyed()&&event.sender.id===w.webContents.id&&event.senderFrame===event.sender.mainFrame;}
function secure(win){win.webContents.setWindowOpenHandler(({url})=>{try{const u=new URL(url);if(u.protocol==='https:')shell.openExternal(url);}catch{}return {action:'deny'};});win.webContents.on('will-navigate',(e,url)=>{if(url!==base&&url!==base+'?pet=1')e.preventDefault();});win.webContents.on('will-attach-webview',e=>e.preventDefault());win.webContents.session.setPermissionRequestHandler((_wc,_permission,cb)=>cb(false));win.webContents.session.setPermissionCheckHandler(()=>false);}
async function showPet(){if(showing||quitting)return;showing=true;try{await petReady;if(quitting||!pet||pet.isDestroyed())return;pet.showInactive();workbench.hide();}catch{workbench.show();dialog.showErrorBox('橘子未能打开','请重新启动客户端后再试，学习记录仍保存在本机。');}finally{showing=false;}}
function restore(){if(quitting)return;pet?.hide();if(workbench?.isMinimized())workbench.restore();workbench?.show();workbench?.focus();}
function quit(){quitting=true;app.quit();}
if(!app.requestSingleInstanceLock())app.quit();else{
app.on('second-instance',restore);
app.whenReady().then(()=>{Menu.setApplicationMenu(null);const {workArea}=screen.getPrimaryDisplay();
workbench=new BrowserWindow({width:1200,height:850,minWidth:760,minHeight:580,show:false,title:'日日有进',icon:path.join(__dirname,'app','icon-orange-forest-192.png'),webPreferences:{preload,contextIsolation:true,nodeIntegration:false,sandbox:true}});
pet=new BrowserWindow({width:220,height:210,x:workArea.x+workArea.width-250,y:workArea.y+workArea.height-250,show:false,transparent:true,frame:false,hasShadow:false,alwaysOnTop:true,resizable:false,skipTaskbar:true,backgroundColor:'#00000000',title:'橘子',webPreferences:{preload,contextIsolation:true,nodeIntegration:false,sandbox:true}});
secure(workbench);secure(pet);petReady=pet.loadFile(entry,{query:{pet:'1'}});petReady.catch(()=>{});workbench.loadFile(entry).then(()=>workbench.show()).catch(()=>dialog.showErrorBox('启动失败','客户端资源未能加载，请重新下载完整程序。'));
workbench.on('minimize',showPet);workbench.on('close',()=>{if(!quitting){quitting=true;app.quit();}});pet.on('close',e=>{if(!quitting){e.preventDefault();restore();}});
workbench.webContents.on('render-process-gone',()=>restore());pet.webContents.on('render-process-gone',()=>{restore();petReady=pet.loadFile(entry,{query:{pet:'1'}});petReady.catch(()=>{});});
ipcMain.handle('desktop:minimize',async e=>{if(!own(e,'main'))return false;await showPet();return true;});
ipcMain.handle('desktop:restore',e=>{if(!own(e,'pet')&&!own(e,'main'))return false;restore();return true;});
ipcMain.on('desktop:menu',e=>{if(own(e,'pet'))Menu.buildFromTemplate([{label:'返回工作台',click:restore},{type:'separator'},{label:'退出日日有进',click:quit}]).popup({window:pet});});
ipcMain.on('desktop:move',(e,dx,dy)=>{if(!own(e,'pet')||!Number.isFinite(dx)||!Number.isFinite(dy)||Math.abs(dx)>500||Math.abs(dy)>500)return;const b=pet.getBounds(),area=screen.getDisplayMatching({x:Math.round(b.x+dx),y:Math.round(b.y+dy),width:b.width,height:b.height}).workArea;pet.setPosition(Math.round(Math.max(area.x,Math.min(area.x+area.width-b.width,b.x+dx))),Math.round(Math.max(area.y,Math.min(area.y+area.height-b.height,b.y+dy))));});
});app.on('activate',()=>workbench&&restore());app.on('before-quit',()=>{quitting=true;});app.on('window-all-closed',()=>app.quit());}
