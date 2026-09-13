from pathlib import Path
import json, uuid, datetime

ROOT = Path('/tmp/pkg')

# version metadata
manifest_path = ROOT / 'manifest.json'
manifest = json.loads(manifest_path.read_text())
manifest['version'] = '2.2.2'
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')

build_path = ROOT / 'build-info.json'
build = json.loads(build_path.read_text())
build['version'] = '2.2.2'
build['buildId'] = str(uuid.uuid4())
build['createdAt'] = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')
if 'CHANGELOG-v2.2.2.md' not in build['managedFiles']:
    build['managedFiles'].append('CHANGELOG-v2.2.2.md')
build_path.write_text(json.dumps(build, ensure_ascii=False, indent=2) + '\n')

(ROOT / 'CHANGELOG-v2.2.2.md').write_text('''# Entry Live Studio v2.2.2\n\n- 업데이트 필요 여부는 페이지 새로고침 시 확장 프로그램이 GitHub 버전 목록만 확인합니다.\n- 실제 업데이트 패키지는 업데이트를 시작할 때 Cloudflare Pages `/api/current/update-package`에서 받습니다.\n- Pages는 `UPDATE_PACKAGE_KV`에 버전별 ZIP을 캐시하므로 같은 버전은 GitHub에서 다시 가져오지 않습니다.\n- 확장 프로그램도 받은 ZIP을 `chrome.storage.local`에 버전/SHA-256과 함께 캐시해 updater를 다시 열어도 재요청하지 않습니다.\n- 필수 업데이트 정책은 `MANDATORY_UPDATE=1`이면 발견된 최신 버전을 필수, `0`/미설정이면 선택 업데이트로 처리합니다.\n''')

# settings-fetch.js: Pages package proxy + simple mandatory flag
settings = r'''(function (global) {
    const API_BASE = 'https://supabase-settings-fetch.pages.dev/api';
    const API_URL = `${API_BASE}/current/settings`;
    const STATUS_URL = `${API_BASE}/current/status`;
    const UPDATE_PACKAGE_URL = `${API_BASE}/current/update-package`;
    const CHAT_BACKUP_URL = `${API_BASE}/current/chat-backup`;
    const BACKUP_URL = `${API_BASE}/backup`;

    async function requestJson(url, options = {}, timeout = 12000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);
        let response;
        try {
            response = await fetch(url, { cache: 'no-store', credentials: 'omit', ...options, signal: controller.signal });
        } catch (error) {
            if (error?.name === 'AbortError') throw new Error('설정 서버 응답 시간이 초과되었습니다.');
            throw new Error('설정 서버에 연결할 수 없습니다.');
        } finally { clearTimeout(timer); }
        let body = null;
        try { body = await response.json(); } catch (_) {}
        if (!response.ok || !body?.ok) {
            const error = new Error(body?.error || `설정 서버 오류(HTTP ${response.status})`);
            error.accessMode = Number(body?.accessMode || 0);
            error.status = body?.status || '';
            throw error;
        }
        return body;
    }

    function normalizeMeta(body) {
        const mode = Number(body?.accessMode || 0);
        return {
            accessMode: mode === 1 || mode === 2 ? mode : 0,
            status: mode === 1 ? 'maintenance' : mode === 2 ? 'disabled' : 'normal',
            mandatoryUpdate: Boolean(body?.mandatoryUpdate),
            passwordRequired: body?.passwordRequired !== false,
            notice: body?.notice && typeof body.notice === 'object' ? {
                title: String(body.notice.title || '공지').slice(0, 80),
                body: String(body.notice.body || '').slice(0, 2000),
            } : null,
        };
    }

    async function fetchStatus({ timeout = 8000 } = {}) {
        return normalizeMeta(await requestJson(STATUS_URL, { method: 'GET' }, timeout));
    }

    async function fetchSettings(password = '', { timeout = 12000 } = {}) {
        password = String(password || '').toLowerCase();
        if (password.length > 256) throw new Error('연결 비밀번호가 너무 깁니다.');
        const body = await requestJson(API_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
        }, timeout);
        const serverUrl = String(body.serverUrl || '').trim().replace(/\/$/, '');
        const anonKey = String(body.anonKey || '').trim();
        if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(serverUrl)) throw new Error('설정 서버의 Supabase URL이 올바르지 않습니다.');
        if (!anonKey || anonKey.startsWith('sb_secret_')) throw new Error('브라우저용 Supabase 키가 아닙니다.');
        return { serverUrl, anonKey, ...normalizeMeta(body) };
    }

    async function fetchUpdatePackage(version, { timeout = 45000 } = {}) {
        version = String(version || '').trim();
        if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('업데이트 버전 정보가 올바르지 않습니다.');
        const body = await requestJson(`${UPDATE_PACKAGE_URL}?version=${encodeURIComponent(version)}`, { method: 'GET' }, timeout);
        if (String(body.version || '') !== version || String(body.filename || '') !== `message_V${version}.zip`)
            throw new Error('업데이트 서버의 버전 정보가 일치하지 않습니다.');
        if (!/^[a-f0-9]{64}$/i.test(String(body.sha256 || '')) || typeof body.packageBase64 !== 'string' || !body.packageBase64.length)
            throw new Error('업데이트 서버의 패키지 정보가 올바르지 않습니다.');
        if (body.packageBase64.length > 12 * 1024 * 1024) throw new Error('업데이트 패키지가 너무 큽니다.');
        return {
            version,
            filename: body.filename,
            sha256: String(body.sha256).toLowerCase(),
            size: Number(body.size || 0),
            packageBase64: body.packageBase64,
            serverCached: Boolean(body.cached),
            fetchedAt: Number(body.fetchedAt || Date.now()),
        };
    }

    async function backupMessages(clientId, messages, { timeout = 12000 } = {}) {
        if (!clientId || !Array.isArray(messages) || !messages.length) return { ok: true, saved: 0 };
        return requestJson(CHAT_BACKUP_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId: String(clientId), messages: messages.slice(0, 40) }),
        }, timeout);
    }

    global.EntrySettingsFetch = { API_BASE, API_URL, STATUS_URL, UPDATE_PACKAGE_URL, BACKUP_URL, CHAT_BACKUP_URL, fetchStatus, fetchSettings, fetchUpdatePackage, backupMessages };
})(globalThis);
'''
(ROOT / 'shared/settings-fetch.js').write_text(settings)

# updater page loads settings client; no direct GitHub package fetch.
html_path = ROOT / 'updater.html'
html = html_path.read_text()
old_scripts = '<script src="shared/update-zip.js"></script><script src="updater.js"></script>'
new_scripts = '<script src="shared/settings-fetch.js"></script><script src="shared/update-zip.js"></script><script src="updater.js"></script>'
assert old_scripts in html
html_path.write_text(html.replace(old_scripts, new_scripts))

updater = r'''(function(){
const manifest=chrome.runtime.getManifest(),current=manifest.version,DB='entry-live-studio-updater-v2',STORE='handles',KEY='extensionSourceDirectory',CACHE='entryChatUpdatePackageCacheV2';
const $=id=>document.getElementById(id);let info=null,pkg=null,busy=false;
$('currentVersion').textContent=`v${current}`;
function progress(value,text){$('progressBar').style.width=`${Math.max(0,Math.min(100,value))}%`;if(text)$('status').textContent=text;}
function compare(a,b){const x=String(a||'').split('.').map(Number),y=String(b||'').split('.').map(Number);if(x.length!==3||y.length!==3||x.some(Number.isNaN)||y.some(Number.isNaN))return 0;for(let i=0;i<3;i++)if(x[i]!==y[i])return x[i]>y[i]?1:-1;return 0;}
function base64Bytes(value){const s=atob(String(value||'')),out=new Uint8Array(s.length);for(let i=0;i<s.length;i++)out[i]=s.charCodeAt(i);return out;}
async function sha256(bytes){const d=await crypto.subtle.digest('SHA-256',bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));return [...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,'0')).join('');}
function openDb(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function loadHandle(){try{const db=await openDb();return await new Promise((resolve,reject)=>{const r=db.transaction(STORE,'readonly').objectStore(STORE).get(KEY);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error);});}catch(_){return null}}
async function saveHandle(handle){const db=await openDb();await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(handle,KEY);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
async function permission(handle,ask=false){if(!handle)return false;const o={mode:'readwrite'};try{if(await handle.queryPermission(o)==='granted')return true;if(ask&&await handle.requestPermission(o)==='granted')return true}catch(_){}return false;}
async function readJson(handle,name){const fh=await handle.getFileHandle(name);return JSON.parse(await(await fh.getFile()).text());}
async function getPackageRecord(version){
    const stored=(await chrome.storage.local.get(CACHE))[CACHE];
    if(stored?.version===version&&stored?.packageBase64&&/^[a-f0-9]{64}$/i.test(String(stored.sha256||''))){
        try{const bytes=base64Bytes(stored.packageBase64);if((await sha256(bytes))===String(stored.sha256).toLowerCase()){progress(18,'저장된 업데이트 사용 중…');return stored;}}catch(_){}
        await chrome.storage.local.remove(CACHE);
    }
    progress(12,'업데이트 받는 중…');
    const fresh=await EntrySettingsFetch.fetchUpdatePackage(version,{timeout:45000});
    await chrome.storage.local.set({[CACHE]:fresh});
    return fresh;
}
async function loadPackage(){
    const version=String(new URLSearchParams(location.search).get('version')||'').trim();
    if(!/^\d+\.\d+\.\d+$/.test(version)||compare(version,current)<=0)throw new Error('업데이트 정보를 다시 확인하려면 페이지를 새로고침하세요.');
    info={available:true,currentVersion:current,version,filename:`message_V${version}.zip`};
    $('latestVersion').textContent=`v${version}`;
    const record=await getPackageRecord(version),bytes=base64Bytes(record.packageBase64);
    const digest=await sha256(bytes);if(digest!==String(record.sha256).toLowerCase())throw new Error('저장된 업데이트 파일 검증에 실패했습니다.');
    progress(28,'업데이트 확인 중…');
    const entries=await EntryChatZipUpdate.readZip(bytes.buffer);const md=new TextDecoder();const me=entries.find(e=>e.path==='manifest.json'),be=entries.find(e=>e.path==='build-info.json');
    if(!me||!be)throw new Error('업데이트 파일을 확인할 수 없습니다.');
    const m=JSON.parse(md.decode(me.data)),b=JSON.parse(md.decode(be.data));
    if(m.name!==manifest.name||Number(m.manifest_version)!==3||String(m.version)!==version||String(b.version)!==version||!String(b.buildId||'').trim())throw new Error('업데이트 파일 정보가 올바르지 않습니다.');
    pkg={entries,manifest:m,build:b};progress(35,'업데이트 준비 완료');
}
async function dirFor(root,parts){let d=root;for(const p of parts)d=await d.getDirectoryHandle(p,{create:true});return d;}
async function writeEntry(root,e){const parts=e.path.split('/').filter(Boolean),name=parts.pop();if(!name)return;const d=await dirFor(root,parts),fh=await d.getFileHandle(name,{create:true}),w=await fh.createWritable();try{await w.write(e.data)}finally{await w.close()}}
async function validateTarget(handle){const m=await readJson(handle,'manifest.json'),b=await readJson(handle,'build-info.json');if(m.name!==manifest.name||Number(m.manifest_version)!==3)throw new Error('현재 확장 프로그램을 로드한 폴더를 선택하세요.');if(!String(b.buildId||'').trim())throw new Error('선택한 폴더를 확인할 수 없습니다.');return{manifest:m,build:b};}
async function apply(handle){if(busy)return;busy=true;try{await validateTarget(handle);progress(45,'파일 적용 중…');const list=pkg.entries.filter(e=>e.path!=='manifest.json');let n=0;for(const e of list){await writeEntry(handle,e);n++;progress(45+Math.round((n/Math.max(1,list.length))*45),'파일 적용 중…');}await writeEntry(handle,pkg.entries.find(e=>e.path==='manifest.json'));const m=await readJson(handle,'manifest.json'),b=await readJson(handle,'build-info.json');if(String(m.version)!==info.version||String(b.version)!==info.version||String(b.buildId)!==String(pkg.build.buildId))throw new Error('업데이트 적용을 확인하지 못했습니다.');progress(100,'업데이트 완료');setTimeout(()=>chrome.runtime.reload(),500);}catch(e){busy=false;progress(35,e?.message||String(e));$('folderButton').hidden=false;}}
async function choose(){try{const h=await window.showDirectoryPicker({mode:'readwrite',id:'entry-live-studio-source'});await validateTarget(h);await saveHandle(h);await apply(h);}catch(e){if(e?.name!=='AbortError')progress(35,e?.message||String(e));$('folderButton').hidden=false;}}
async function startFolderFlow(){const g=$('guide');g.hidden=false;for(let i=3;i>0;i--){$('countdown').textContent=`${i}초 후 폴더 선택을 시작합니다.`;await new Promise(r=>setTimeout(r,1000));}const h=await loadHandle();if(h&&await permission(h,false)){await apply(h);return;}try{await choose();}catch(_){$('folderButton').hidden=false;}}
$('folderButton').addEventListener('click',choose);
(async()=>{try{await loadPackage();await startFolderFlow();}catch(e){progress(0,e?.message||String(e));}})();
})();
'''
(ROOT / 'updater.js').write_text(updater)

# background: status polling only reads policy; GitHub version check happens on CHECK_UPDATE.
bg_path = ROOT / 'background.js'
bg = bg_path.read_text()
bg = bg.replace(
"let _0x0220 = { requiredUpdateVersion: '', mandatoryUpdateAll: false, mandatoryUpdate: false, passwordRequired: true, notice: null };",
"let _0x0220 = { mandatoryUpdatePolicy: false, mandatoryUpdate: false, passwordRequired: true, notice: null };"
)
old_status = '''async function _0x0098() {\n    const status = await EntrySettingsFetch.fetchStatus();\n    const currentVersion = chrome.runtime.getManifest().version;\n    let mandatoryUpdate = false;\n    if (status.mandatoryUpdateAll) {\n        try { mandatoryUpdate = Boolean((await _0x01a5()).available); } catch (_) { mandatoryUpdate = false; }\n    } else if (status.requiredUpdateVersion) {\n        mandatoryUpdate = _0x019f(status.requiredUpdateVersion, currentVersion) > 0;\n    }\n    _0x0220 = {\n        requiredUpdateVersion: status.requiredUpdateVersion || '',\n        mandatoryUpdateAll: Boolean(status.mandatoryUpdateAll),\n        mandatoryUpdate,\n        passwordRequired: status.passwordRequired !== false,\n        notice: status.notice || null,\n    };\n    await _0x0090(status.accessMode);\n    _0x017e();\n    return status;\n}'''
new_status = '''async function _0x0098() {\n    const status = await EntrySettingsFetch.fetchStatus();\n    const policy = Boolean(status.mandatoryUpdate);\n    _0x0220 = {\n        mandatoryUpdatePolicy: policy,\n        mandatoryUpdate: policy ? Boolean(_0x0220.mandatoryUpdate) : false,\n        passwordRequired: status.passwordRequired !== false,\n        notice: status.notice || null,\n    };\n    await _0x0090(status.accessMode);\n    _0x017e();\n    return status;\n}'''
assert old_status in bg
bg = bg.replace(old_status, new_status)

bg = bg.replace("        requiredUpdateVersion: _0x0220.requiredUpdateVersion || '',\n", "")

old_result = '''        const _0x021b = _0x01ab ? {\n            available: true, currentVersion: _0x01a6, version: _0x01ab.version,\n            filename: _0x01ab.filename, downloadUrl: `${_0x002a}${encodeURIComponent(_0x01ab.filename)}`,\n        } : { available: false, currentVersion: _0x01a6, reason: _0x0215 || '' };\n        _0x0210 = _0x021b;\n        _0x0211 = _0x002f();\n        return { ..._0x021b };'''
new_result = '''        const _0x021b = _0x01ab ? {\n            available: true, currentVersion: _0x01a6, version: _0x01ab.version,\n            filename: _0x01ab.filename, downloadUrl: `${_0x002a}${encodeURIComponent(_0x01ab.filename)}`,\n        } : { available: false, currentVersion: _0x01a6, reason: _0x0215 || '' };\n        _0x0220.mandatoryUpdate = Boolean(_0x0220.mandatoryUpdatePolicy && _0x021b.available);\n        const _0x021c = { ..._0x021b, mandatoryUpdate: Boolean(_0x0220.mandatoryUpdate) };\n        _0x0210 = _0x021c;\n        _0x0211 = _0x002f();\n        await chrome.storage.local.set({ entryChatLatestUpdateInfoV1: _0x021c }).catch(() => {});\n        _0x017e();\n        return { ..._0x021c };'''
assert old_result in bg
bg = bg.replace(old_result, new_result)

old_open = '''async function _0x01af() {\n    const _0x01b0 = await _0x01a5();\n    if (!_0x01b0.available)\n        throw new Error('현재 설치된 버전보다 새로운 업데이트가 없습니다.');\n    const _0x01b1 = chrome.runtime.getURL(`updater.html?version=${encodeURIComponent(_0x01b0.version)}&autostart=1`);\n    await chrome.tabs.create({ url: _0x01b1 });\n    return _0x01b0;\n}'''
new_open = '''async function _0x01af() {\n    const _0x01b0 = (await chrome.storage.local.get('entryChatLatestUpdateInfoV1')).entryChatLatestUpdateInfoV1;\n    if (!_0x01b0?.available || String(_0x01b0.currentVersion || '') !== String(chrome.runtime.getManifest().version))\n        throw new Error('업데이트 정보를 다시 확인하려면 페이지를 새로고침하세요.');\n    const _0x01b1 = chrome.runtime.getURL(`updater.html?version=${encodeURIComponent(_0x01b0.version)}&autostart=1`);\n    await chrome.tabs.create({ url: _0x01b1 });\n    return _0x01b0;\n}'''
assert old_open in bg
bg = bg.replace(old_open, new_open)
bg_path.write_text(bg)

# content modal uses CHECK_UPDATE result directly, so mandatory state is correct before pushed state arrives.
chat_path = ROOT / 'content/chat.js'
chat = chat_path.read_text()
old = "        const mandatory = Boolean(_0x0003.data.mandatoryUpdate);"
new = "        const mandatory = Boolean(_0x0179.mandatoryUpdate || _0x0003.data.mandatoryUpdate);"
assert old in chat
chat_path.write_text(chat.replace(old, new, 1))

# README note
readme = ROOT / 'README.md'
if readme.exists():
    text = readme.read_text()
    text += '''\n\n## v2.2.2 업데이트 전달\n\n페이지 새로고침 때는 최신 버전 존재 여부만 확인합니다. 실제 ZIP은 업데이트 시작 시 Cloudflare Pages가 가져오며, 서버의 `UPDATE_PACKAGE_KV`와 확장의 `chrome.storage.local`에 버전별로 캐시됩니다.\n'''
    readme.write_text(text)

print('v2.2.2 buildId', build['buildId'])
