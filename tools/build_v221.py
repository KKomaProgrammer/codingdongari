from pathlib import Path
import json, re, uuid, datetime

ROOT = Path('/tmp/pkg')


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'missing pattern: {label}')
    return text.replace(old, new, 1)

# shared/settings-fetch.js
(ROOT / 'shared/settings-fetch.js').write_text(r'''(function (global) {
    const API_BASE = 'https://supabase-settings-fetch.pages.dev/api';
    const API_URL = `${API_BASE}/current/settings`;
    const STATUS_URL = `${API_BASE}/current/status`;
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
            requiredUpdateVersion: String(body?.requiredUpdateVersion || ''),
            mandatoryUpdateAll: Boolean(body?.mandatoryUpdateAll),
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

    async function backupMessages(clientId, messages, { timeout = 12000 } = {}) {
        if (!clientId || !Array.isArray(messages) || !messages.length) return { ok: true, saved: 0 };
        return requestJson(CHAT_BACKUP_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId: String(clientId), messages: messages.slice(0, 40) }),
        }, timeout);
    }

    global.EntrySettingsFetch = { API_BASE, API_URL, STATUS_URL, BACKUP_URL, CHAT_BACKUP_URL, fetchStatus, fetchSettings, backupMessages };
})(globalThis);
''', encoding='utf-8')

# background.js
p = ROOT / 'background.js'
s = p.read_text(encoding='utf-8')
s = replace_once(s, "let _0x0212 = null;", "let _0x0212 = null;\nlet _0x0220 = { requiredUpdateVersion: '', mandatoryUpdateAll: false, mandatoryUpdate: false, passwordRequired: true, notice: null };\nlet _0x0221 = false;\nlet _0x0222 = [];\nlet _0x0223 = [];\nlet _0x0224 = null;", 'background globals')
s = replace_once(s, "            'entryChatBackupHealthV1',\n        ]);", "            'entryChatBackupHealthV1',\n            'entryChatShortcutIntroSeenV1',\n        ]);", 'storage keys')
s = replace_once(s, "        _0x000f = Boolean(_0x004e.entryChatTermsAcceptedV1);", "        _0x000f = Boolean(_0x004e.entryChatTermsAcceptedV1);\n        _0x0221 = Boolean(_0x004e.entryChatShortcutIntroSeenV1);", 'shortcut intro load')

start = s.index('async function _0x0098() {')
end = s.index('\nfunction _0x009a()', start)
s = s[:start] + r'''async function _0x0098() {
    const status = await EntrySettingsFetch.fetchStatus();
    const currentVersion = chrome.runtime.getManifest().version;
    let mandatoryUpdate = false;
    if (status.mandatoryUpdateAll) {
        try { mandatoryUpdate = Boolean((await _0x01a5()).available); } catch (_) { mandatoryUpdate = false; }
    } else if (status.requiredUpdateVersion) {
        mandatoryUpdate = _0x019f(status.requiredUpdateVersion, currentVersion) > 0;
    }
    _0x0220 = {
        requiredUpdateVersion: status.requiredUpdateVersion || '',
        mandatoryUpdateAll: Boolean(status.mandatoryUpdateAll),
        mandatoryUpdate,
        passwordRequired: status.passwordRequired !== false,
        notice: status.notice || null,
    };
    await _0x0090(status.accessMode);
    _0x017e();
    return status;
}''' + s[end:]

s = replace_once(s, "        _0x00aa = await EntrySettingsFetch.fetchSettings(_0x00a7);", "        _0x00aa = await EntrySettingsFetch.fetchSettings(_0x00a7);\n        _0x0220.passwordRequired = _0x00aa.passwordRequired !== false;\n        if (_0x00aa.notice) _0x0220.notice = _0x00aa.notice;", 'fetch settings metadata')
s = replace_once(s, "function _0x0165() {\n    if (_0x000d === 1)", "function _0x0165() {\n    if (_0x0220.mandatoryUpdate)\n        throw new Error('업데이트 필요');\n    if (_0x000d === 1)", 'mandatory send block')

cloud_funcs = r'''
function _0x0225(_0x0226) {
    if (!_0x000f || !_0x0004 || !_0x0226 || _0x0226.deleted)
        return;
    const now = _0x002f();
    _0x0222.push({
        id: _0x0226.id, scope: _0x0226.scope, roomCode: _0x0226.roomCode, from: _0x0226.from,
        fromName: _0x0226.fromName, to: _0x0226.to, text: _0x0226.text || '', imageName: _0x0226.imageName || '',
        deleted: false, deletedAt: 0, at: _0x0226.at,
    });
    if (_0x0222.length > 80) _0x0222.splice(0, _0x0222.length - 80);
    _0x0223.push(now);
    _0x0223 = _0x0223.filter((_0x0227) => now - _0x0227 <= 60000);
    const rate = _0x0223.length;
    const batchSize = rate >= 12 ? 12 : rate >= 6 ? 6 : 2;
    const delay = rate >= 12 ? 15000 : rate >= 6 ? 8000 : 3000;
    if (_0x0222.length >= batchSize) {
        _0x0228().catch(() => {});
        return;
    }
    clearTimeout(_0x0224);
    _0x0224 = setTimeout(() => { _0x0224 = null; _0x0228().catch(() => {}); }, delay);
}
async function _0x0228() {
    if (!_0x0222.length || !_0x0004?.id) return false;
    clearTimeout(_0x0224);
    _0x0224 = null;
    const batch = _0x0222.splice(0, Math.min(40, _0x0222.length));
    try {
        await EntrySettingsFetch.backupMessages(_0x0004.id, batch, { timeout: 15000 });
        return true;
    } catch (_) {
        _0x0222.unshift(...batch.slice(-20));
        if (_0x0222.length > 80) _0x0222.splice(80);
        if (!_0x0224) _0x0224 = setTimeout(() => { _0x0224 = null; _0x0228().catch(() => {}); }, 30000);
        return false;
    }
}
async function _0x0229() {
    _0x0221 = true;
    await chrome.storage.local.set({ entryChatShortcutIntroSeenV1: true });
    _0x017e();
    return true;
}
'''
s = replace_once(s, 'function _0x0165() {', cloud_funcs + '\nfunction _0x0165() {', 'cloud funcs')
s = replace_once(s, "    if (!_0x00eb.deleted)\n        _0x00a2(_0x00eb).catch(() => { });\n    _0x016b();", "    if (!_0x00eb.deleted)\n        _0x00a2(_0x00eb).catch(() => { });\n    if (!_0x00eb.deleted)\n        _0x0225(_0x00eb);\n    _0x016b();", 'cloud backup queue call')

s = replace_once(s, "        accessStatus: _0x017b || 'normal',\n        termsAccepted: _0x000f,", "        accessStatus: _0x017b || 'normal',\n        termsAccepted: _0x000f,\n        mandatoryUpdate: Boolean(_0x0220.mandatoryUpdate),\n        requiredUpdateVersion: _0x0220.requiredUpdateVersion || '',\n        passwordRequired: _0x0220.passwordRequired !== false,\n        notice: _0x0220.notice || null,\n        shortcutIntroSeen: Boolean(_0x0221),", 'state metadata')
s = replace_once(s, "        case 'ACCEPT_TERMS': return _0x009b();", "        case 'ACCEPT_TERMS': return _0x009b();\n        case 'ACK_SHORTCUT_INTRO': return _0x0229();", 'ack intro command')
s = replace_once(s, "    const _0x01b1 = chrome.runtime.getURL(`updater.html?version=${encodeURIComponent(_0x01b0.version)}`);", "    const _0x01b1 = chrome.runtime.getURL(`updater.html?version=${encodeURIComponent(_0x01b0.version)}&autostart=1`);", 'updater autostart')
p.write_text(s, encoding='utf-8')

# content/chat.js
p = ROOT / 'content/chat.js'
s = p.read_text(encoding='utf-8')
s = replace_once(s, "        deleteExpiryTimer: null,\n    };", "        deleteExpiryTimer: null,\n        noticeShownKey: '',\n    };", 'content state')
css = r'''
    .mandatory-card{width:min(390px,100%);padding:24px;border:1px solid #e0e4ea;border-radius:18px;background:#fff;box-shadow:0 10px 30px rgba(28,42,64,.08)}.mandatory-card h2{margin:0 0 8px;font-size:19px}.mandatory-card p{margin:0 0 16px;color:#667284;font-size:11px;line-height:1.65}.terms-consent{display:flex;align-items:center;gap:8px;margin:13px 0 10px;color:#465163;font-size:11px;font-weight:700}.terms-consent input{width:16px;height:16px}.shortcut-intro{margin:0 0 12px;padding:12px 13px;border:1px solid #e0d073;border-radius:13px;background:#fff9d8;color:#554d28;font-size:10px;line-height:1.55}.shortcut-intro button{float:right;border:0;background:transparent;color:#756b37;font-weight:800}.notice-copy{white-space:pre-wrap;color:#596577;font-size:11px;line-height:1.65}
'''
s = replace_once(s, '  </style>', css + '  </style>', 'extra css')
s = replace_once(s, "        _0x0096();\n        _0x00a1();\n        if (Number(_0x0003.data.accessMode) === 1", "        _0x0096();\n        _0x00a1();\n        if (_0x0003.data.mandatoryUpdate) {\n            _0x0220();\n            return;\n        }\n        if (Number(_0x0003.data.accessMode) === 1", 'mandatory render precedence')
s = replace_once(s, "        _0x0088(_0x0095);\n    }", "        _0x0088(_0x0095);\n        _0x0224();\n    }", 'notice after render')

mandatory_func = r'''
    function _0x0220() {
        if (_0x000f('mandatoryUpdateBtn')) return;
        _0x0012.innerHTML = `<div class="auth"><section class="mandatory-card"><h2>업데이트 필요</h2><p>중요한 업데이트가 누락되었습니다. 업데이트를 하지 않으면 확장 프로그램을 이용하실 수 없습니다. 아래 나오는 업데이트 버튼으로 업데이트를 진행하세요.</p><button class="primary" id="mandatoryUpdateBtn" type="button" style="width:100%">업데이트</button></section></div>`;
        _0x000f('mandatoryUpdateBtn').addEventListener('click', async () => {
            const button = _0x000f('mandatoryUpdateBtn');
            button.disabled = true;
            try { await _0x0019('OPEN_UPDATER', {}, 20000); }
            catch (error) { button.disabled = false; _0x01ba(error?.message || String(error), true); }
        });
    }
    function _0x0224() {
        const notice = _0x0003.data.notice;
        if (!_0x0003.open || !notice?.body || _0x0003.data.mandatoryUpdate) return;
        const key = `${notice.title}|${notice.body}`;
        if (_0x0003.noticeShownKey === key || !_0x000f('modalBack')?.hidden) return;
        _0x0003.noticeShownKey = key;
        _0x017d(_0x0005(notice.title || '공지'), `<div class="notice-copy">${_0x0005(notice.body)}</div>`, async () => {});
        _0x000f('modalCancel').hidden = true;
        _0x000f('modalConfirm').textContent = '확인';
    }
'''
s = replace_once(s, '    function _0x0099() {', mandatory_func + '    function _0x0099() {', 'mandatory functions')

# Terms screen
start = s.index('    function _0x009b() {')
end = s.index('\n    function _0x009e()', start)
s = s[:start] + r'''    function _0x009b() {
        if (_0x000f('termsAccept')) return;
        _0x0012.innerHTML = `<div class="terms-screen"><section class="terms-card"><h2>이용 전 확인</h2><p>이 메신저는 대화를 이어가고 문제 상황의 기록을 확인할 수 있도록 모든 채팅 내용을 보관합니다. 정상적인 소통 목적이 아닌 학교폭력 등 부적절한 목적 또는 방식으로 사용하는 경우 그 행위와 결과에 대한 책임은 해당 이용자에게 있습니다. 동의하시지 않으면 확장 프로그램의 기능을 이용하실 수 없습니다.</p><label class="terms-consent"><input id="termsCheck" type="checkbox"> 동의합니다</label><button class="primary" id="termsAccept" type="button" disabled style="width:100%">계속하기</button></section></div>`;
        const check = _0x000f('termsCheck');
        const button = _0x000f('termsAccept');
        check.addEventListener('change', () => { button.disabled = !check.checked; });
        button.addEventListener('click', async () => {
            button.disabled = true;
            try { await _0x0019('ACCEPT_TERMS'); }
            catch (error) { button.disabled = !check.checked; _0x01ba(error?.message || String(error), true); }
        });
    }''' + s[end:]

# Auth screen
start = s.index('    function _0x00a4() {')
end = s.index('\n    function _0x00a9()', start)
s = s[:start] + r'''    function _0x00a4() {
        if (_0x000f('authForm')) return;
        const passwordRequired = _0x0003.data.passwordRequired !== false;
        const passwordField = passwordRequired ? `<div class="field"><label>연결 비밀번호</label><input id="authPassword" type="password" maxlength="256" autocomplete="current-password" inputmode="latin" lang="en" autocapitalize="none" spellcheck="false"></div>` : '';
        _0x0012.innerHTML = `<div class="auth"><form class="authcard" id="authForm"><h2>채팅 연결</h2><p>이름을 입력해 채팅을 시작합니다.</p><div class="field"><label>이름</label><input id="authName" maxlength="24" value="${_0x0005(_0x0003.data.identity?.name || '사용자')}" autocomplete="nickname"></div>${passwordField}<button class="primary" id="authSubmit" type="submit" style="width:100%">계속하기</button><div class="autherror" id="authError"></div></form></div>`;
        const password = _0x000f('authPassword');
        if (password) {
            const normalizePassword = () => { password.value = password.value.toLowerCase().replace(/[^\x20-\x7e]/g, ''); };
            password.addEventListener('input', normalizePassword);
            password.addEventListener('compositionend', normalizePassword);
        }
        _0x000f('authForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const button = _0x000f('authSubmit');
            const errorBox = _0x000f('authError');
            button.disabled = true;
            errorBox.textContent = '연결 중…';
            try {
                await _0x0019('AUTH', { name: _0x000f('authName').value, password: password?.value?.toLowerCase() || '' }, 20000);
                if (password) password.value = '';
                errorBox.textContent = '';
            } catch (error) { errorBox.textContent = error?.message || String(error); }
            finally { button.disabled = false; }
        });
    }''' + s[end:]

# Home shortcut intro
old = "        const _0x00c6 = _0x00c5.reduce((_0x00c7, _0x00c8) => _0x00c7 + (_0x00c8.users || []).length, 0);\n        _0x00c2.innerHTML = `<section class=\"navview\""
new = "        const _0x00c6 = _0x00c5.reduce((_0x00c7, _0x00c8) => _0x00c7 + (_0x00c8.users || []).length, 0);\n        const _0x0230 = !_0x0003.data.shortcutIntroSeen ? '<div class=\"shortcut-intro\" id=\"shortcutIntro\"><button id=\"shortcutIntroClose\" type=\"button\">닫기</button>Alt를 2번 연타하면 일시적으로 채팅 아이콘과 채팅창이 사라집니다. 다시 2번 연타하면 아이콘과 채팅창이 보이게 됩니다. 단축키는 메인 화면 아래쪽에서 변경이 가능합니다.</div>' : '';\n        _0x00c2.innerHTML = `<section class=\"navview\""
s = replace_once(s, old, new, 'home intro var')
s = replace_once(s, '<div class="navbody"><div class="rooms-home"><div class="home-profile">', '<div class="navbody"><div class="rooms-home">${_0x0230}<div class="home-profile">', 'home intro html')
s = replace_once(s, "        _0x000f('editName').addEventListener('click', _0x01af);", "        _0x000f('shortcutIntroClose')?.addEventListener('click', async () => { await _0x0019('ACK_SHORTCUT_INTRO').catch(() => {}); });\n        _0x000f('editName').addEventListener('click', _0x01af);", 'home intro close')

# Update modal mandatory behavior
start = s.index('    function _0x0178(_0x0179) {')
end = s.index('\n    async function _0x017a()', start)
s = s[:start] + r'''    function _0x0178(_0x0179) {
        if (!_0x0179?.available || !_0x0179.version) return;
        const mandatory = Boolean(_0x0003.data.mandatoryUpdate);
        const text = mandatory
            ? '중요한 업데이트가 누락되었습니다. 업데이트를 하지 않으면 확장 프로그램을 이용하실 수 없습니다. 아래 나오는 업데이트 버튼으로 업데이트를 진행하세요.'
            : '새 버전을 사용할 수 있습니다.';
        _0x017d(mandatory ? '업데이트 필요' : '새 버전 업데이트', `<div style="display:grid;gap:12px"><div style="padding:14px;border:1px solid #e2e7ee;border-radius:14px;background:#f8fafc"><div style="font-size:11px;color:#7a8493">v${_0x0005(_0x0179.currentVersion || '')} → v${_0x0005(_0x0179.version)}</div></div><p style="margin:0;color:#5f6b7b;font-size:10px;line-height:1.65">${_0x0005(text)}</p></div>`, async () => { await _0x0019('OPEN_UPDATER', {}, 20000); });
        _0x000f('modalConfirm').textContent = '업데이트';
        if (mandatory) _0x000f('modalCancel').hidden = true;
        else _0x000f('modalCancel').textContent = '나중에';
    }''' + s[end:]
p.write_text(s, encoding='utf-8')

# updater.html: simple progress UI, no download/update buttons
(ROOT / 'updater.html').write_text(r'''<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>메신저 업데이트</title>
<style>:root{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#263140;background:#f4f6f9}*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px}.card{width:min(560px,100%);background:#fff;border:1px solid #dde3eb;border-radius:24px;box-shadow:0 18px 60px rgba(34,49,73,.12);padding:28px}.eyebrow{font-size:12px;font-weight:800;color:#778394}.title{font-size:25px;font-weight:900;margin:5px 0 8px}.desc{font-size:13px;line-height:1.65;color:#667284;margin:0 0 18px}.versions{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;padding:14px;border-radius:15px;background:#f7f9fb;border:1px solid #e6eaf0}.version small{display:block;font-size:10px;color:#8993a1}.version b{display:block;font-size:17px;margin-top:2px}.arrow{color:#9aa3af;font-weight:900}.status{margin-top:14px;color:#5d6878;font-size:12px;line-height:1.55;white-space:pre-wrap}.progress{height:10px;margin-top:12px;border-radius:999px;background:#e8ecf1;overflow:hidden}.bar{height:100%;width:0;background:#3e4b5f;transition:width .2s}.guide{margin-top:15px;padding:12px 13px;border-radius:13px;background:#fff8d7;border:1px solid #ead77b;color:#5b5126;font-size:11px;line-height:1.55}.folder{width:100%;margin-top:12px;border:0;border-radius:12px;padding:11px;background:#263140;color:#fff;font-weight:800}.folder[hidden]{display:none}</style></head>
<body><main class="card"><div class="eyebrow">ENTRY LIVE STUDIO · UPDATE</div><div class="title">업데이트 필요</div><p class="desc">중요한 업데이트가 누락되었습니다. 업데이트를 하지 않으면 확장 프로그램을 이용하실 수 없습니다. 아래 안내에 따라 업데이트를 진행하세요.</p><div class="versions"><div class="version"><small>현재</small><b id="currentVersion">-</b></div><div class="arrow">→</div><div class="version"><small>최신</small><b id="latestVersion">확인 중</b></div></div><div class="status" id="status">업데이트 확인 중…</div><div class="progress"><div class="bar" id="progressBar"></div></div><div class="guide" id="guide" hidden>초기 설치시 확장 프로그램 로드한 폴더 안으로 들어간 후 완료를 누르세요.<br><span id="countdown"></span></div><button class="folder" id="folderButton" type="button" hidden>확장 프로그램 폴더 선택</button></main><script src="shared/update-zip.js"></script><script src="updater.js"></script></body></html>''', encoding='utf-8')

# updater.js: fetch latest ZIP, countdown, saved-folder auto apply, picker fallback
(ROOT / 'updater.js').write_text(r'''(function(){
const manifest=chrome.runtime.getManifest(),current=manifest.version,productId='junwoo-comprehensive-chat-extension',DB='entry-live-studio-updater-v2',STORE='handles',KEY='extensionSourceDirectory';
const $=id=>document.getElementById(id); let info=null,pkg=null,busy=false;
$('currentVersion').textContent=`v${current}`;
function progress(value,text){$('progressBar').style.width=`${Math.max(0,Math.min(100,value))}%`;if(text)$('status').textContent=text;}
function command(command,payload={}){return chrome.runtime.sendMessage({type:'ENTRY_CHAT_COMMAND',command,payload}).then(r=>{if(!r?.ok)throw new Error(r?.error||'업데이트 명령 실패');return r.result;});}
function openDb(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function loadHandle(){try{const db=await openDb();return await new Promise((resolve,reject)=>{const r=db.transaction(STORE,'readonly').objectStore(STORE).get(KEY);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error);});}catch(_){return null}}
async function saveHandle(handle){const db=await openDb();await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(handle,KEY);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
async function permission(handle,ask=false){if(!handle)return false;const o={mode:'readwrite'};try{if(await handle.queryPermission(o)==='granted')return true;if(ask&&await handle.requestPermission(o)==='granted')return true}catch(_){}return false;}
async function readJson(handle,name){const fh=await handle.getFileHandle(name);return JSON.parse(await(await fh.getFile()).text());}
async function loadPackage(){progress(10,'업데이트 준비 중…');info=await command('CHECK_UPDATE');if(!info?.available)throw new Error('현재 설치된 버전보다 새로운 업데이트가 없습니다.');$('latestVersion').textContent=`v${info.version}`;const u=new URL(info.downloadUrl);if(u.protocol!=='https:'||u.hostname!=='raw.githubusercontent.com'||!u.pathname.startsWith('/KKomaProgrammer/codingdongari/'))throw new Error('업데이트 주소를 확인할 수 없습니다.');const r=await fetch(`${u.href}?t=${Date.now()}`,{cache:'no-store'});if(!r.ok)throw new Error('업데이트 파일을 가져오지 못했습니다.');progress(25,'업데이트 준비 중…');const entries=await EntryChatZipUpdate.readZip(await r.arrayBuffer());const md=new TextDecoder();const me=entries.find(e=>e.path==='manifest.json'),be=entries.find(e=>e.path==='build-info.json');if(!me||!be)throw new Error('업데이트 파일을 확인할 수 없습니다.');const m=JSON.parse(md.decode(me.data)),b=JSON.parse(md.decode(be.data));if(m.name!==manifest.name||Number(m.manifest_version)!==3||String(m.version)!==String(info.version)||String(b.version)!==String(info.version)||!String(b.buildId||'').trim())throw new Error('업데이트 파일 정보가 올바르지 않습니다.');pkg={entries,manifest:m,build:b};progress(35,'업데이트 준비 완료');}
async function dirFor(root,parts){let d=root;for(const p of parts)d=await d.getDirectoryHandle(p,{create:true});return d;}
async function writeEntry(root,e){const parts=e.path.split('/').filter(Boolean),name=parts.pop();if(!name)return;const d=await dirFor(root,parts),fh=await d.getFileHandle(name,{create:true}),w=await fh.createWritable();try{await w.write(e.data)}finally{await w.close()}}
async function validateTarget(handle){const m=await readJson(handle,'manifest.json'),b=await readJson(handle,'build-info.json');if(m.name!==manifest.name||Number(m.manifest_version)!==3)throw new Error('현재 확장 프로그램을 로드한 폴더를 선택하세요.');if(!String(b.buildId||'').trim())throw new Error('선택한 폴더를 확인할 수 없습니다.');return{manifest:m,build:b};}
async function apply(handle){if(busy)return;busy=true;try{await validateTarget(handle);progress(45,'파일 적용 중…');const list=pkg.entries.filter(e=>e.path!=='manifest.json');let n=0;for(const e of list){await writeEntry(handle,e);n++;progress(45+Math.round((n/Math.max(1,list.length))*45),'파일 적용 중…');}await writeEntry(handle,pkg.entries.find(e=>e.path==='manifest.json'));const m=await readJson(handle,'manifest.json'),b=await readJson(handle,'build-info.json');if(String(m.version)!==info.version||String(b.version)!==info.version)throw new Error('업데이트 적용을 확인하지 못했습니다.');progress(100,'업데이트 완료');setTimeout(()=>chrome.runtime.reload(),500);}catch(e){busy=false;progress(35,e?.message||String(e));$('folderButton').hidden=false;}}
async function choose(){try{let h=await window.showDirectoryPicker({mode:'readwrite',id:'entry-live-studio-source'});await validateTarget(h);await saveHandle(h);await apply(h);}catch(e){if(e?.name!=='AbortError')progress(35,e?.message||String(e));$('folderButton').hidden=false;}}
async function startFolderFlow(){const g=$('guide');g.hidden=false;for(let i=3;i>0;i--){$('countdown').textContent=`${i}초 후 폴더 선택을 시작합니다.`;await new Promise(r=>setTimeout(r,1000));}let h=await loadHandle();if(h&&await permission(h,false)){await apply(h);return;}try{await choose();}catch(_){$('folderButton').hidden=false;}}
$('folderButton').addEventListener('click',choose);
(async()=>{try{await loadPackage();await startFolderFlow();}catch(e){progress(0,e?.message||String(e));}})();
})();''', encoding='utf-8')

# manifest + build-info
manifest_path = ROOT / 'manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
manifest['version'] = '2.2.1'
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

build_path = ROOT / 'build-info.json'
build = json.loads(build_path.read_text(encoding='utf-8'))
build['version'] = '2.2.1'
build['buildId'] = str(uuid.uuid4())
build['createdAt'] = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00','Z')
if 'CHANGELOG-v2.2.1.md' not in build.get('managedFiles', []): build.setdefault('managedFiles', []).append('CHANGELOG-v2.2.1.md')
build_path.write_text(json.dumps(build, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(ROOT / 'CHANGELOG-v2.2.1.md').write_text('''# Entry Live Studio v2.2.1\n\n- 필수 업데이트 정책 및 간소화된 자동 업데이트 화면\n- 동의 체크박스와 간결한 보관 안내\n- 비밀번호 미설정/`*` 시 비밀번호 입력 생략\n- 비밀번호 소문자 정규화 및 영문 입력 힌트\n- 최초 메인 화면 단축키 안내\n- 환경변수 공지 표시\n- chrome.storage.sync와 별도로 Cloudflare KV 48시간 암호화 백업을 적응형 배치로 추가\n''', encoding='utf-8')

print('patched v2.2.1', build['buildId'])
