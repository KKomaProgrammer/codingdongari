importScripts('shared/settings-fetch.js', 'shared/chat-realtime.js', 'shared/chat-store.js', 'shared/chat-backup.js');
const _0x0001 = new Set();
const _0x0002 = new Map();
const _0x0003 = new Map();
let _0x0004 = null;
let _0x0005 = null;
let _0x0006 = null;
let _0x0007 = null;
let _0x0008 = null;
let _0x0009 = null;
let _0x000a = null;
let _0x000b = false;
let _0x000c = 'locked';
let _0x000d = 0;
let _0x000e = null;
let _0x000f = false;
let _0x0010 = '';
let _0x0011 = null;
let _0x0012 = null;
let _0x0013 = null;
let _0x0014 = null;
let _0x0015 = { syncLastSuccessAt: 0, syncLastError: '', cloudLastSuccessAt: 0, cloudLastError: '' };
const _0x0016 = new EntryChatDurableStore();
let _0x0017 = [];
let _0x0018 = [];
const _0x0019 = 'realtime:els-chat-room-';
const _0x001a = 'realtime:els-chat-dm-';
const _0x001b = 26000;
const _0x001c = 8000;
const _0x001d = 60000;
const _0x001e = 2500;
const _0x001f = 30000;
const _0x0020 = 1200;
const _0x0021 = 80;
const _0x0022 = '__self__';
const _0x0023 = 450000;
const _0x0024 = 65000;
const _0x0025 = 25 * 1024 * 1024;
const _0x0026 = 'https://img.bloupla.net/api/upload';
const _0x0027 = 48 * 60 * 60 * 1000;
const _0x0028 = 'entryChatTempImageBackupsV1';
const _0x0029 = 'https://api.github.com/repos/KKomaProgrammer/codingdongari/contents?ref=main';
const _0x002a = 'https://raw.githubusercontent.com/KKomaProgrammer/codingdongari/main/';
const _0x002b = /^message_V(\d+)\.(\d+)\.(\d+)\.zip$/i;
let _0x0210 = null;
let _0x0211 = 0;
let _0x0212 = null;
let _0x0220 = { requiredUpdateVersion: '', mandatoryUpdateAll: false, mandatoryUpdate: false, passwordRequired: true, notice: null };
let _0x0221 = false;
let _0x0222 = [];
let _0x0223 = [];
let _0x0224 = null;
const _0x002c = (_0x002d) => new Promise((_0x002e) => setTimeout(_0x002e, _0x002d));
const _0x002f = () => Date.now();
const _0x0030 = () => crypto.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
const _0x0031 = (_0x0032, _0x0033 = '사용자') => String(_0x0032 || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 24) || _0x0033;
const _0x0034 = (_0x0035) => String(_0x0035 || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 32) || '새 채팅방';
const _0x0036 = (_0x0037) => String(_0x0037 || '').replace(/\u0000/g, '').trim().slice(0, 2000);
const _0x0038 = (_0x0039) => String(_0x0039 || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 120);
const _0x003a = (_0x003b) => /^[A-Za-z0-9._:-]{1,120}$/.test(String(_0x003b || '')) ? String(_0x003b) : '';
const _0x003c = (_0x003d) => Math.max(0, Math.min(99, Number(_0x003d) || 0));
const _0x003e = (_0x003f) => Math.max(0, Math.min(99, Number(_0x003f) || 0));
const _0x0040 = (_0x0041, _0x0042 = _0x0023) => {
    const _0x0043 = typeof _0x0041 === 'string' ? _0x0041.trim() : '';
    if (!_0x0043)
        return '';
    if (_0x0043.length > _0x0042)
        throw new Error('이미지 용량이 너무 큽니다.');
    if (!/^data:image\/(?:png|jpe?g|webp|gif);base64,[a-z0-9+/=\r\n]+$/i.test(_0x0043))
        throw new Error('지원하지 않는 이미지 형식입니다.');
    return _0x0043;
};
const _0x0044 = (_0x0045) => /^\d{4}$/.test(String(_0x0045 || ''));
const _0x0046 = (_0x0047) => `${_0x0019}${_0x0047}`;
const _0x0048 = (_0x0049, _0x004a, _0x004b) => `${_0x001a}${_0x0049}-${[_0x004a, _0x004b].sort().join('-')}`;
async function _0x004c() {
    if (_0x0007)
        return _0x0007;
    _0x0007 = (async () => {
        try {
            await chrome.storage.sync.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' });
        }
        catch (_0x004d) { }
        const _0x004e = await chrome.storage.local.get([
            'entryChatIdentity',
            'entryChatRooms',
            'entryChatTermsAcceptedV1',
            'entryChatRecoveryCodeV1',
            'entryChatBackupHealthV1',
            'entryChatShortcutIntroSeenV1',
        ]);
        _0x000f = Boolean(_0x004e.entryChatTermsAcceptedV1);
        _0x0221 = Boolean(_0x004e.entryChatShortcutIntroSeenV1);
        if (_0x004e.entryChatBackupHealthV1 && typeof _0x004e.entryChatBackupHealthV1 === 'object') {
            _0x0015 = { ..._0x0015, ..._0x004e.entryChatBackupHealthV1 };
        }
        _0x0010 = EntryChatBackup.normalizeRecoveryCode(_0x004e.entryChatRecoveryCodeV1 || '');
        if (!_0x0010) {
            _0x0010 = EntryChatBackup.generateRecoveryCode();
            await chrome.storage.local.set({ entryChatRecoveryCodeV1: _0x0010 });
        }
        _0x0011 = new EntryChatBackup.EntryChatSyncEvidenceStore(_0x0010);
        _0x0012 = null; // v2.1.6: 서버 /api/backup 의존성 제거, chrome.storage.sync 증거 백업만 사용
        let _0x004f = null;
        try {
            _0x004f = await _0x0016.getKv('automaticBackupLatest');
        }
        catch (_0x0050) { }
        _0x0004 = _0x004e.entryChatIdentity || _0x004f?.identity || { id: _0x0030(), name: '사용자', avatarDataUrl: '' };
        _0x0004.id ||= _0x0030();
        _0x0004.name = _0x0031(_0x0004.name);
        try {
            _0x0004.avatarDataUrl = _0x0040(_0x0004.avatarDataUrl || '', _0x0024);
        }
        catch (_0x0051) {
            _0x0004.avatarDataUrl = '';
        }
        if (!_0x0004.avatarDataUrl) {
            try {
                const _0x0052 = await _0x0016.getKv('profileImage');
                _0x0004.avatarDataUrl = _0x0040(_0x0052 || '', _0x0024);
            }
            catch (_0x0053) { }
        }
        await chrome.storage.local.set({ entryChatIdentity: _0x0004 });
        await _0x0016.setKv('profileImage', _0x0004.avatarDataUrl || '').catch(() => { });
        try {
            _0x0017 = await _0x0016.loadAllRecords();
        }
        catch (_0x0054) {
            _0x0017 = [];
        }
        if (!_0x0017.length && Array.isArray(_0x004f?.records) && _0x004f.records.length) {
            try {
                await _0x0016.importRecords(_0x004f.records);
                _0x0017 = await _0x0016.loadAllRecords();
            }
            catch (_0x0055) { }
        }
        if (!_0x0017.length && _0x0011) {
            try {
                const _0x0056 = await _0x0011.loadAllRecords();
                if (_0x0056.length) {
                    await _0x0016.importRecords(_0x0056);
                    _0x0017 = await _0x0016.loadAllRecords();
                }
            }
            catch (_0x0057) { }
        }
        _0x0018 = _0x0017.filter((_0x0058) => _0x0058.scope === 'self')
            .map((_0x0059) => _0x0061(_0x0059, _0x0022))
            .sort((_0x005a, _0x005b) => _0x005a.at - _0x005b.at)
            .slice(-_0x0021);
        const _0x005c = Array.isArray(_0x004e.entryChatRooms) ? _0x004e.entryChatRooms : (Array.isArray(_0x004f?.rooms) ? _0x004f.rooms : []);
        for (const _0x005d of _0x005c) {
            if (!_0x0044(_0x005d.code))
                continue;
            const _0x005e = _0x0079({
                code: _0x005d.code,
                name: _0x0034(_0x005d.name || `방 ${_0x005d.code}`),
                leaderId: _0x005d.leaderId || (_0x005d.isLeader ? _0x0004.id : null),
                leaderName: _0x0031(_0x005d.leaderName || (_0x005d.isLeader ? _0x0004.name : '대표')),
                isLeader: Boolean(_0x005d.isLeader),
                status: 'locked',
            });
            _0x0069(_0x005e);
            _0x0002.set(_0x005d.code, _0x005e);
        }
        _0x0017 = [];
        const _0x005f = await chrome.storage.session.get('entryChatServerConfig');
        if (_0x005f.entryChatServerConfig?.serverUrl && _0x005f.entryChatServerConfig?.anonKey) {
            _0x0006 = _0x005f.entryChatServerConfig;
        }
        try {
            await _0x0098();
        }
        catch (_0x0060) { }
        if (_0x000d === 0 && _0x0006) {
            await _0x0086();
            await _0x008b();
        }
        _0x016d();
        _0x009a();
        _0x016c();
        _0x016b();
        _0x00a1();
    })();
    return _0x0007;
}
function _0x0061(_0x0062, _0x0063) {
    let _0x0064 = '';
    try {
        _0x0064 = _0x0040(_0x0062?.imageDataUrl || '');
    }
    catch (_0x0065) { }
    const _0x0066 = _0x003a(_0x0062?.imageGroupId || '');
    const _0x0067 = _0x0066 ? _0x003e(_0x0062?.imageGroupCount || 0) : 0;
    const _0x0068 = _0x0066 ? Math.min(Math.max(0, _0x0067 - 1), _0x003c(_0x0062?.imageGroupIndex || 0)) : 0;
    return {
        id: String(_0x0062?.id || _0x0030()),
        roomCode: _0x0063 || String(_0x0062?.roomCode || ''),
        from: String(_0x0062?.from || _0x0004?.id || ''),
        fromName: _0x0031(_0x0062?.fromName || _0x0004?.name || '사용자'),
        to: _0x0062?.to || null,
        text: _0x0062?.deleted ? '' : String(_0x0062?.text || '').slice(0, 2000),
        imageDataUrl: _0x0062?.deleted ? '' : _0x0064,
        imageName: _0x0062?.deleted ? '' : _0x0038(_0x0062?.imageName || ''),
        deleted: Boolean(_0x0062?.deleted),
        deletedAt: Number(_0x0062?.deletedAt) || 0,
        imageGroupId: _0x0066,
        imageGroupIndex: _0x0068,
        imageGroupCount: _0x0067,
        expectedReaderIds: [...new Set((Array.isArray(_0x0062?.expectedReaderIds) ? _0x0062.expectedReaderIds : []).map((_0x01bf) => String(_0x01bf || '')).filter(Boolean))].slice(0, 200),
        readBy: [...new Set((Array.isArray(_0x0062?.readBy) ? _0x0062.readBy : []).map((_0x01c0) => String(_0x01c0 || '')).filter(Boolean))].slice(0, 200),
        at: Number(_0x0062?.at) || _0x002f(),
    };
}
function _0x0069(_0x006a) {
    const _0x006b = _0x0017.filter((_0x006c) => _0x006c.scope === 'room' && _0x006c.roomCode === _0x006a.code)
        .map((_0x006d) => _0x0061(_0x006d, _0x006a.code))
        .sort((_0x006e, _0x006f) => _0x006e.at - _0x006f.at);
    _0x006a.messages = _0x006b.slice(-_0x0021);
}
async function _0x0070(_0x0071) {
    try {
        const _0x0072 = await _0x0016.loadAllRecords();
        const _0x0073 = _0x0072.filter((_0x0074) => _0x0074.scope === 'room' && _0x0074.roomCode === _0x0071.code)
            .map((_0x0075) => _0x0061(_0x0075, _0x0071.code))
            .sort((_0x0076, _0x0077) => _0x0076.at - _0x0077.at);
        _0x0071.messages = _0x0073.slice(-_0x0021);
    }
    catch (_0x0078) { }
}
function _0x0079({ code: _0x007a, name: _0x007b, leaderId: _0x007c, leaderName: _0x007d, isLeader: _0x007e, status: _0x007f = 'connecting' }) {
    const _0x0080 = {
        code: _0x007a,
        name: _0x0034(_0x007b || `방 ${_0x007a}`),
        leaderId: _0x007c || null,
        leaderName: _0x0031(_0x007d || '대표'),
        isLeader: Boolean(_0x007e),
        status: _0x007f,
        users: new Map(),
        messages: [],
        joinedAt: _0x002f(),
    };
    _0x0080.users.set(_0x0004.id, _0x0081(_0x0080));
    return _0x0080;
}
function _0x0081(_0x0082) {
    return {
        id: _0x0004.id,
        name: _0x0004.name,
        isLeader: _0x0082.leaderId === _0x0004.id || _0x0082.isLeader,
        lastSeen: _0x002f(),
        self: true,
        avatarDataUrl: _0x0004.avatarDataUrl || '',
    };
}
async function _0x0083() {
    const _0x0084 = [..._0x0002.values()].map((_0x0085) => ({
        code: _0x0085.code,
        name: _0x0085.name,
        leaderId: _0x0085.leaderId,
        leaderName: _0x0085.leaderName,
        isLeader: _0x0085.isLeader,
    }));
    await chrome.storage.local.set({ entryChatRooms: _0x0084 });
    _0x016b();
}
async function _0x0086() {
    if (!_0x0006?.serverUrl || !_0x0006?.anonKey)
        throw new Error('연결 비밀번호를 먼저 확인하세요.');
    if (_0x0005)
        _0x0005.close();
    _0x0005 = new EntryChatRealtimeHub({
        url: _0x0006.serverUrl,
        key: _0x0006.anonKey,
        onBroadcast: _0x0149,
        onStatus: (_0x0087) => {
            if (_0x000d !== 0) {
                _0x000c = _0x008e(_0x000d);
                for (const _0x0088 of _0x0002.values())
                    _0x0088.status = _0x008e(_0x000d);
                _0x017e();
                return;
            }
            _0x000c = _0x0087;
            if (_0x0087 === 'online') {
                for (const _0x0089 of _0x0002.values())
                    if (_0x0089.status !== 'locked')
                        _0x0089.status = 'online';
            }
            else if (_0x0087 === 'offline') {
                for (const _0x008a of _0x0002.values())
                    if (_0x008a.status !== 'locked')
                        _0x008a.status = 'reconnecting';
            }
            _0x017e();
        },
    });
    await _0x0005.connect();
}
async function _0x008b() {
    if (!_0x0005)
        return;
    for (const _0x008c of _0x0002.values()) {
        _0x008c.status = 'connecting';
        _0x008c.users.clear();
        _0x008c.users.set(_0x0004.id, _0x0081(_0x008c));
        try {
            await _0x0005.ensureChannel(_0x0046(_0x008c.code));
            _0x008c.status = 'online';
            await _0x0138(_0x008c);
            if (_0x008c.isLeader)
                await _0x013b(_0x008c);
        }
        catch (_0x008d) {
            _0x008c.status = 'reconnecting';
        }
    }
    _0x017e();
}
function _0x008e(_0x008f = _0x000d) {
    return _0x008f === 1 ? 'maintenance' : _0x008f === 2 ? 'disabled' : '';
}
async function _0x0090(_0x0091) {
    _0x0091 = Number(_0x0091);
    if (_0x0091 !== 1 && _0x0091 !== 2)
        _0x0091 = 0;
    const _0x0092 = _0x000d;
    _0x000d = _0x0091;
    if (_0x000d !== 0) {
        _0x000c = _0x008e(_0x000d);
        if (_0x0005) {
            const _0x0093 = _0x0005;
            _0x0005 = null;
            try {
                _0x0093.close();
            }
            catch (_0x0094) { }
        }
        for (const _0x0095 of _0x0002.values())
            _0x0095.status = _0x008e(_0x000d);
    }
    else if (_0x0092 !== 0 && _0x0006 && !_0x0005) {
        _0x000c = 'connecting';
        try {
            await _0x0086();
            await _0x008b();
        }
        catch (_0x0096) {
            _0x000c = 'offline';
        }
    }
    else if (!_0x0006) {
        _0x000c = 'locked';
        for (const _0x0097 of _0x0002.values())
            _0x0097.status = 'locked';
    }
    _0x017e();
}
async function _0x0098() {
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
}
function _0x009a() {
    if (_0x000e)
        return;
    _0x000e = setInterval(() => {
        _0x0098().catch(() => { });
    }, _0x001f);
}
async function _0x009b() {
    _0x000f = true;
    await chrome.storage.local.set({ entryChatTermsAcceptedV1: true });
    _0x00a1();
    _0x017e();
    return true;
}
function _0x009c() {
    return {
        format: 'entry-live-studio-encrypted-cloud-backup',
        version: 1,
        identity: { ..._0x0004 },
        rooms: _0x0166(),
        savedAt: _0x002f(),
    };
}
async function _0x009d() {
    try {
        await chrome.storage.local.set({ entryChatBackupHealthV1: { ..._0x0015 } });
    }
    catch (_0x009e) { }
}
async function _0x009f() {
    if (!_0x0012 || !_0x0004)
        return false;
    if (_0x0013)
        return _0x0013;
    _0x0013 = (async () => {
        try {
            await _0x0012.saveMeta(_0x009c());
            _0x0015.cloudLastSuccessAt = _0x002f();
            _0x0015.cloudLastError = '';
            await _0x009d();
            return true;
        }
        catch (_0x00a0) {
            _0x0015.cloudLastError = _0x00a0?.message || String(_0x00a0);
            await _0x009d();
            return false;
        }
        finally {
            _0x0013 = null;
        }
    })();
    return _0x0013;
}
function _0x00a1() {
    if (!_0x000f || !_0x0012 || !_0x0004)
        return;
    if (_0x0014)
        clearTimeout(_0x0014);
    _0x0014 = setTimeout(() => {
        _0x0014 = null;
        _0x009f().catch(() => { });
    }, _0x0020);
}
async function _0x00a2(_0x00a3) {
    if (!_0x000f || !_0x0012)
        return false;
    try {
        const _0x00a4 = await _0x009f();
        if (!_0x00a4)
            return false;
        await _0x0012.saveRecord(_0x00a3);
        _0x0015.cloudLastSuccessAt = _0x002f();
        _0x0015.cloudLastError = '';
        await _0x009d();
        return true;
    }
    catch (_0x00a5) {
        _0x0015.cloudLastError = _0x00a5?.message || String(_0x00a5);
        await _0x009d();
        return false;
    }
}
async function _0x00a6(_0x00a7, _0x00a8) {
    await _0x004c();
    try {
        await _0x0098();
    }
    catch (_0x00a9) { }
    if (_0x000d === 1)
        throw new Error('점검중');
    if (_0x000d === 2)
        throw new Error('사용 불가');
    let _0x00aa;
    try {
        _0x00aa = await EntrySettingsFetch.fetchSettings(_0x00a7);
        _0x0220.passwordRequired = _0x00aa.passwordRequired !== false;
        if (_0x00aa.notice) _0x0220.notice = _0x00aa.notice;
    }
    catch (_0x00ab) {
        if (_0x00ab?.accessMode === 1 || _0x00ab?.accessMode === 2)
            await _0x0090(_0x00ab.accessMode);
        throw _0x00ab;
    }
    if (_0x00a8)
        await _0x00ac(_0x00a8, false);
    _0x0006 = _0x00aa;
    await chrome.storage.session.set({ entryChatServerConfig: _0x00aa });
    await _0x0086();
    await _0x008b();
    _0x00a1();
    return _0x017a();
}
async function _0x00ac(_0x00ad, _0x00ae = true) {
    _0x0004.name = _0x0031(_0x00ad);
    await chrome.storage.local.set({ entryChatIdentity: _0x0004 });
    await _0x0016.setKv('identity', _0x0004).catch(() => { });
    _0x016b();
    for (const _0x00af of _0x0002.values()) {
        const _0x00b0 = _0x00af.users.get(_0x0004.id) || _0x0081(_0x00af);
        _0x00b0.name = _0x0004.name;
        _0x00b0.avatarDataUrl = _0x0004.avatarDataUrl || '';
        _0x00b0.lastSeen = _0x002f();
        _0x00af.users.set(_0x0004.id, _0x00b0);
        if (_0x00af.isLeader)
            _0x00af.leaderName = _0x0004.name;
    }
    await _0x0083();
    if (_0x00ae && _0x0005) {
        for (const _0x00b1 of _0x0002.values()) {
            await _0x0138(_0x00b1);
            if (_0x00b1.isLeader)
                await _0x013b(_0x00b1);
        }
    }
    _0x017e();
}
async function _0x00b2(_0x00b3) {
    const _0x00b4 = _0x00b3 ? _0x0040(_0x00b3, _0x0024) : '';
    _0x0004.avatarDataUrl = _0x00b4;
    await chrome.storage.local.set({ entryChatIdentity: _0x0004 });
    await Promise.all([
        _0x0016.setKv('profileImage', _0x00b4).catch(() => { }),
        _0x0016.setKv('identity', _0x0004).catch(() => { }),
    ]);
    _0x016b();
    for (const _0x00b5 of _0x0002.values()) {
        const _0x00b6 = _0x00b5.users.get(_0x0004.id) || _0x0081(_0x00b5);
        _0x00b6.name = _0x0004.name;
        _0x00b6.avatarDataUrl = _0x00b4;
        _0x00b6.lastSeen = _0x002f();
        _0x00b5.users.set(_0x0004.id, _0x00b6);
    }
    if (_0x0005) {
        for (const _0x00b7 of _0x0002.values()) {
            if (_0x00b7.status === 'locked')
                continue;
            await _0x0138(_0x00b7);
            if (_0x00b7.isLeader)
                await _0x013b(_0x00b7);
        }
    }
    _0x017e();
    return _0x017a();
}
async function _0x00b8(_0x00b9) {
    _0x0165();
    const _0x00ba = _0x0034(_0x00b9);
    for (let _0x00bb = 0; _0x00bb < 25; _0x00bb++) {
        const _0x00bc = String(1000 + Math.floor(Math.random() * 9000));
        if (_0x0002.has(_0x00bc))
            continue;
        const _0x00bd = _0x0046(_0x00bc);
        await _0x0005.ensureChannel(_0x00bd);
        const _0x00be = { kind: 'create', found: null };
        _0x0003.set(_0x00bc, _0x00be);
        await _0x0005.send(_0x00bd, 'room-probe', { requestId: _0x0030(), from: _0x0004.id, at: _0x002f() });
        await _0x002c(750);
        _0x0003.delete(_0x00bc);
        if (_0x00be.found) {
            _0x0005.leave(_0x00bd);
            continue;
        }
        const _0x00bf = _0x0079({
            code: _0x00bc,
            name: _0x00ba,
            leaderId: _0x0004.id,
            leaderName: _0x0004.name,
            isLeader: true,
            status: 'online',
        });
        _0x0002.set(_0x00bc, _0x00bf);
        await _0x0083();
        await _0x013b(_0x00bf);
        await _0x0138(_0x00bf);
        _0x017e();
        return _0x0175(_0x00bf);
    }
    throw new Error('사용 가능한 4자리 방 번호를 만들지 못했습니다. 다시 시도하세요.');
}
async function _0x00c0(_0x00c1) {
    _0x0165();
    _0x00c1 = String(_0x00c1 || '').trim();
    if (!_0x0044(_0x00c1))
        throw new Error('방 번호는 4자리 숫자여야 합니다.');
    if (_0x0002.has(_0x00c1))
        return _0x0175(_0x0002.get(_0x00c1));
    const _0x00c2 = _0x0046(_0x00c1);
    await _0x0005.ensureChannel(_0x00c2);
    const _0x00c3 = { kind: 'join', found: null };
    _0x0003.set(_0x00c1, _0x00c3);
    await _0x0005.send(_0x00c2, 'room-probe', { requestId: _0x0030(), from: _0x0004.id, at: _0x002f() });
    await _0x002c(1500);
    _0x0003.delete(_0x00c1);
    if (!_0x00c3.found) {
        _0x0005.leave(_0x00c2);
        throw new Error('현재 연결된 사용자가 없어 이 방을 확인할 수 없습니다. 방 번호를 다시 확인하세요.');
    }
    const _0x00c4 = _0x00c3.found;
    const _0x00c5 = _0x0079({
        code: _0x00c1,
        name: _0x0034(_0x00c4.name || `방 ${_0x00c1}`),
        leaderId: _0x00c4.leaderId || null,
        leaderName: _0x0031(_0x00c4.leaderName || '대표'),
        isLeader: _0x00c4.leaderId === _0x0004.id,
        status: 'online',
    });
    await _0x0070(_0x00c5);
    _0x0002.set(_0x00c1, _0x00c5);
    if (Array.isArray(_0x00c4.users)) {
        for (const _0x00c6 of _0x00c4.users)
            _0x0143(_0x00c5, _0x00c6);
    }
    await _0x0083();
    await _0x0138(_0x00c5);
    _0x017e();
    return _0x0175(_0x00c5);
}
async function _0x00c7(_0x00c8) {
    const _0x00c9 = _0x0002.get(String(_0x00c8));
    if (!_0x00c9)
        return;
    if (_0x0005 && _0x00c9.status !== 'locked') {
        try {
            await _0x0005.send(_0x0046(_0x00c9.code), 'bye', { userId: _0x0004.id, at: _0x002f() });
        }
        catch (_0x00ca) { }
        for (const _0x00cb of _0x00c9.users.values()) {
            if (_0x00cb.id !== _0x0004.id)
                _0x0005.leave(_0x0048(_0x00c9.code, _0x0004.id, _0x00cb.id));
        }
        _0x0005.leave(_0x0046(_0x00c9.code));
    }
    _0x0002.delete(_0x00c9.code);
    await _0x0083();
    _0x017e();
}
async function _0x00cc(_0x00cd, _0x00ce) {
    const _0x00cf = _0x0002.get(String(_0x00cd));
    if (!_0x00cf)
        throw new Error('채팅방을 찾을 수 없습니다.');
    if (!_0x00cf.isLeader || _0x00cf.leaderId !== _0x0004.id)
        throw new Error('방 이름은 대표만 수정할 수 있습니다.');
    _0x00cf.name = _0x0034(_0x00ce);
    _0x00cf.leaderName = _0x0004.name;
    await _0x0083();
    await _0x013b(_0x00cf);
    _0x017e();
    return _0x0175(_0x00cf);
}
async function _0x00d0({ code: _0x00d1, targetUserId: _0x00d2, text: _0x00d3, imageDataUrl: _0x00d4, imageName: _0x00d5, imageGroupId: _0x00d6, imageGroupIndex: _0x00d7, imageGroupCount: _0x00d8 }) {
    _0x0165();
    const _0x00d9 = _0x0002.get(String(_0x00d1));
    if (!_0x00d9)
        throw new Error('채팅방을 찾을 수 없습니다.');
    _0x00d3 = _0x0036(_0x00d3);
    const _0x00da = _0x00d4 ? _0x0040(_0x00d4) : '';
    if (!_0x00d3 && !_0x00da)
        throw new Error('메시지나 사진을 입력하세요.');
    const _0x00db = {
        id: _0x0030(),
        roomCode: _0x00d9.code,
        from: _0x0004.id,
        fromName: _0x0004.name,
        to: _0x00d2 || null,
        text: _0x00d3,
        imageDataUrl: _0x00da,
        imageName: _0x0038(_0x00d5 || ''),
        imageGroupId: _0x003a(_0x00d6 || ''),
        imageGroupIndex: _0x003c(_0x00d7 || 0),
        imageGroupCount: _0x003e(_0x00d8 || 0),
        expectedReaderIds: _0x00d2 ? [String(_0x00d2)] : [..._0x00d9.users.keys()].filter((_0x01c1) => _0x01c1 !== _0x0004.id),
        readBy: [],
        at: _0x002f(),
    };
    if (_0x00d2) {
        if (_0x00d2 === _0x0004.id)
            throw new Error('나와의 채팅을 이용해 주세요.');
        const _0x00dc = _0x00d9.users.get(_0x00d2);
        if (!_0x00dc)
            throw new Error('상대방이 현재 방에 연결되어 있지 않습니다.');
        const _0x00dd = _0x0048(_0x00d9.code, _0x0004.id, _0x00d2);
        await _0x0005.ensureChannel(_0x00dd);
        await _0x0005.send(_0x00dd, 'chat', _0x00db);
    }
    else {
        await _0x0005.send(_0x0046(_0x00d9.code), 'chat', _0x00db);
    }
    _0x0158(_0x00d9, _0x00db);
    await _0x00e8('room', _0x00db);
    _0x0182({ type: 'message', message: _0x00db });
    _0x017e();
    return _0x00db;
}
async function _0x00de({ text: _0x00df, imageDataUrl: _0x00e0, imageName: _0x00e1, imageGroupId: _0x00e2, imageGroupIndex: _0x00e3, imageGroupCount: _0x00e4 }) {
    _0x00df = _0x0036(_0x00df);
    const _0x00e5 = _0x00e0 ? _0x0040(_0x00e0) : '';
    if (!_0x00df && !_0x00e5)
        throw new Error('메모나 사진을 입력하세요.');
    const _0x00e6 = {
        id: _0x0030(),
        roomCode: _0x0022,
        from: _0x0004.id,
        fromName: _0x0004.name,
        to: _0x0004.id,
        text: _0x00df,
        imageDataUrl: _0x00e5,
        imageName: _0x0038(_0x00e1 || ''),
        imageGroupId: _0x003a(_0x00e2 || ''),
        imageGroupIndex: _0x003c(_0x00e3 || 0),
        imageGroupCount: _0x003e(_0x00e4 || 0),
        expectedReaderIds: [],
        readBy: [],
        at: _0x002f(),
    };
    if (!_0x0018.some((_0x00e7) => _0x00e7.id === _0x00e6.id))
        _0x0018.push(_0x00e6);
    if (_0x0018.length > _0x0021)
        _0x0018.splice(0, _0x0018.length - _0x0021);
    await _0x00e8('self', _0x00e6);
    _0x017e();
    return _0x00e6;
}
async function _0x00e8(_0x00e9, _0x00ea) {
    const _0x00eb = {
        scope: _0x00e9,
        id: _0x00ea.id,
        roomCode: _0x00e9 === 'self' ? _0x0022 : _0x00ea.roomCode,
        from: _0x00ea.from,
        fromName: _0x00ea.fromName,
        to: _0x00ea.to || null,
        text: _0x00ea.deleted ? '' : (_0x00ea.text || ''),
        imageDataUrl: _0x00ea.deleted ? '' : (_0x00ea.imageDataUrl || ''),
        imageName: _0x00ea.deleted ? '' : (_0x00ea.imageName || ''),
        deleted: Boolean(_0x00ea.deleted),
        deletedAt: Number(_0x00ea.deletedAt) || 0,
        imageGroupId: _0x00ea.imageGroupId || '',
        imageGroupIndex: Number(_0x00ea.imageGroupIndex || 0),
        imageGroupCount: Number(_0x00ea.imageGroupCount || 0),
        expectedReaderIds: [...new Set((Array.isArray(_0x00ea.expectedReaderIds) ? _0x00ea.expectedReaderIds : []).map((_0x01c2) => String(_0x01c2 || '')).filter(Boolean))].slice(0, 200),
        readBy: [...new Set((Array.isArray(_0x00ea.readBy) ? _0x00ea.readBy : []).map((_0x01c3) => String(_0x01c3 || '')).filter(Boolean))].slice(0, 200),
        at: _0x00ea.at,
        savedAt: _0x002f(),
    };
    await _0x0016.putRecord(_0x00eb);
    if (_0x0011 && !_0x00eb.deleted) {
        try {
            await _0x0011.putRecord(_0x00eb);
            _0x0015.syncLastSuccessAt = _0x002f();
            _0x0015.syncLastError = '';
            _0x009d().catch(() => { });
        }
        catch (_0x00ec) {
            _0x0015.syncLastError = _0x00ec?.message || String(_0x00ec);
            _0x009d().catch(() => { });
        }
    }
    if (!_0x00eb.deleted)
        _0x00a2(_0x00eb).catch(() => { });
    if (!_0x00eb.deleted)
        _0x0225(_0x00eb);
    _0x016b();
}
function _0x00ed(_0x00ee) {
    const _0x00ef = atob(String(_0x00ee || ''));
    const _0x00f0 = new Uint8Array(_0x00ef.length);
    for (let _0x00f1 = 0; _0x00f1 < _0x00ef.length; _0x00f1 += 1)
        _0x00f0[_0x00f1] = _0x00ef.charCodeAt(_0x00f1);
    return _0x00f0;
}
function _0x00f2(_0x00f3) {
    let _0x00f4 = '';
    const _0x00f5 = 0x8000;
    for (let _0x00f6 = 0; _0x00f6 < _0x00f3.length; _0x00f6 += _0x00f5)
        _0x00f4 += String.fromCharCode(..._0x00f3.subarray(_0x00f6, _0x00f6 + _0x00f5));
    return btoa(_0x00f4);
}
function _0x00f7(_0x00f8) {
    const _0x00f9 = String(_0x00f8 || '');
    const _0x00fa = _0x00f9.match(/^data:(image\/(?:png|jpe?g|webp|gif));base64,([A-Za-z0-9+/=\r\n]+)$/i);
    if (!_0x00fa)
        throw new Error('지원하지 않는 원본 이미지 형식입니다.');
    const _0x00fb = _0x00ed(_0x00fa[2].replace(/[\r\n]/g, ''));
    if (!_0x00fb.length || _0x00fb.length > _0x0025)
        throw new Error('원본 이미지는 최대 25MB까지 임시 보관할 수 있습니다.');
    return { mime: _0x00fa[1].toLowerCase(), bytes: _0x00fb };
}
async function _0x00fc(_0x00fd) {
    const _0x00fe = new Uint8Array(await crypto.subtle.digest('SHA-256', _0x00fd));
    return [..._0x00fe].map((_0x00ff) => _0x00ff.toString(16).padStart(2, '0')).join('');
}
async function _0x0100() {
    const _0x0101 = new TextEncoder().encode(`entry-live-studio:temp-image-backup:${_0x0010}`);
    const _0x0102 = await crypto.subtle.digest('SHA-256', _0x0101);
    return crypto.subtle.importKey('raw', _0x0102, { name: 'AES-GCM' }, false, ['encrypt']);
}
function _0x0103(_0x0104) {
    let _0x0105 = 0xffffffff;
    for (const _0x0106 of _0x0104) {
        _0x0105 ^= _0x0106;
        for (let _0x0107 = 0; _0x0107 < 8; _0x0107 += 1)
            _0x0105 = (_0x0105 >>> 1) ^ (0xedb88320 & -(_0x0105 & 1));
    }
    return (_0x0105 ^ 0xffffffff) >>> 0;
}
function _0x0108(_0x0109) {
    return new Uint8Array([(_0x0109 >>> 24) & 255, (_0x0109 >>> 16) & 255, (_0x0109 >>> 8) & 255, _0x0109 & 255]);
}
function _0x010a(..._0x010b) {
    const _0x010c = _0x010b.reduce((_0x010d, _0x010e) => _0x010d + _0x010e.length, 0);
    const _0x010f = new Uint8Array(_0x010c);
    let _0x0110 = 0;
    for (const _0x0111 of _0x010b) {
        _0x010f.set(_0x0111, _0x0110);
        _0x0110 += _0x0111.length;
    }
    return _0x010f;
}
function _0x0112(_0x0113, _0x0114) {
    const _0x0115 = new TextEncoder().encode(_0x0113);
    const _0x0116 = _0x0103(_0x010a(_0x0115, _0x0114));
    return _0x010a(_0x0108(_0x0114.length), _0x0115, _0x0114, _0x0108(_0x0116));
}
function _0x0117(_0x0118) {
    const _0x0119 = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    const _0x011a = _0x0112('IHDR', new Uint8Array([0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0]));
    const _0x011b = _0x0112('IDAT', _0x00ed('eJxjYAACAAAFAAE='));
    const _0x011c = new TextEncoder().encode(`ELSBackup\0${JSON.stringify(_0x0118)}`);
    const _0x011d = _0x0112('tEXt', _0x011c);
    const _0x011e = _0x0112('IEND', new Uint8Array());
    return _0x010a(_0x0119, _0x011a, _0x011b, _0x011d, _0x011e);
}
async function _0x011f() {
    try {
        const _0x0120 = await chrome.storage.local.get(_0x0028);
        const _0x0121 = Array.isArray(_0x0120?.[_0x0028]) ? _0x0120[_0x0028] : [];
        const _0x0122 = _0x0121.filter((_0x0123) => Number(_0x0123?.expiresAt || 0) > _0x002f()).slice(-120);
        if (_0x0122.length !== _0x0121.length)
            await chrome.storage.local.set({ [_0x0028]: _0x0122 });
        return _0x0122;
    }
    catch (_0x0124) {
        return [];
    }
}
async function _0x0125({ dataUrl: _0x0126, imageName: _0x0127 = '' }) {
    if (!_0x000f)
        throw new Error('이용 안내 확인 후 사용할 수 있습니다.');
    const { mime: _0x0128, bytes: _0x0129 } = _0x00f7(_0x0126);
    const _0x012a = await _0x0100();
    const _0x012b = crypto.getRandomValues(new Uint8Array(12));
    const _0x012c = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: _0x012b }, _0x012a, _0x0129));
    const _0x012d = _0x002f();
    const _0x012e = _0x012d + _0x0027;
    const _0x012f = {
        v: 1,
        alg: 'AES-GCM-256',
        iv: _0x00f2(_0x012b),
        data: _0x00f2(_0x012c),
        mime: _0x0128,
        originalName: _0x0038(_0x0127 || ''),
        originalSize: _0x0129.length,
        sha256: await _0x00fc(_0x0129),
        createdAt: _0x012d,
        expiresAt: _0x012e,
    };
    const _0x0130 = _0x0117(_0x012f);
    const _0x0131 = new FormData();
    _0x0131.append('file', new Blob([_0x0130], { type: 'image/png' }), `els-encrypted-${_0x0030()}.png`);
    const _0x0132 = new AbortController();
    const _0x0133 = setTimeout(() => _0x0132.abort(), 30000);
    let _0x0134;
    try {
        _0x0134 = await fetch(_0x0026, { method: 'POST', body: _0x0131, cache: 'no-store', credentials: 'omit', signal: _0x0132.signal });
    }
    finally {
        clearTimeout(_0x0133);
    }
    let _0x0135 = null;
    try {
        _0x0135 = await _0x0134.json();
    }
    catch (_0x0136) { }
    if (!_0x0134.ok || !_0x0135?.success || !_0x0135?.url)
        throw new Error(_0x0135?.error || `이미지 임시 보관 서버 오류(HTTP ${_0x0134.status})`);
    const _0x0137 = await _0x011f();
    _0x0137.push({ url: String(_0x0135.url), createdAt: _0x012d, expiresAt: _0x012e, sha256: _0x012f.sha256, originalSize: _0x0129.length });
    await chrome.storage.local.set({ [_0x0028]: _0x0137.slice(-120) });
    return { ok: true, expiresAt: _0x012e };
}
async function _0x0138(_0x0139) {
    if (!_0x0005 || _0x0139.status === 'locked')
        return;
    const _0x013a = {
        user: { id: _0x0004.id, name: _0x0004.name, avatarDataUrl: _0x0004.avatarDataUrl || '', isLeader: _0x0139.leaderId === _0x0004.id || _0x0139.isLeader },
        room: { code: _0x0139.code, name: _0x0139.name, leaderId: _0x0139.leaderId, leaderName: _0x0139.leaderName },
        deletedMessages: _0x0139.messages.filter((_0x01e3) => _0x01e3.from === _0x0004.id && _0x01e3.deleted && _0x01e3.deletedAt).slice(-80).map((_0x01e4) => ({ id: _0x01e4.id, deletedAt: _0x01e4.deletedAt })),
        at: _0x002f(),
    };
    await _0x0005.send(_0x0046(_0x0139.code), 'hello', _0x013a);
}
async function _0x013b(_0x013c, _0x013d = null) {
    if (!_0x0005 || _0x013c.status === 'locked')
        return;
    await _0x0005.send(_0x0046(_0x013c.code), 'room-meta', {
        requestId: _0x013d,
        code: _0x013c.code,
        name: _0x013c.name,
        leaderId: _0x013c.leaderId,
        leaderName: _0x013c.leaderName,
        users: [..._0x013c.users.values()].map((_0x013e) => ({ id: _0x013e.id, name: _0x013e.name, avatarDataUrl: _0x013e.avatarDataUrl || '', isLeader: _0x013e.isLeader })),
        at: _0x002f(),
    });
}
async function _0x013f(_0x0140, _0x0141) {
    if (!_0x0005 || !_0x0141 || _0x0141 === _0x0004.id)
        return;
    try {
        await _0x0005.ensureChannel(_0x0048(_0x0140.code, _0x0004.id, _0x0141));
    }
    catch (_0x0142) { }
}
function _0x0143(_0x0144, _0x0145) {
    if (!_0x0145?.id)
        return;
    const _0x0146 = _0x0144.users.get(_0x0145.id) || {};
    const _0x0147 = {
        id: _0x0145.id,
        name: _0x0031(_0x0145.name || _0x0146.name || '사용자'),
        isLeader: Boolean(_0x0145.isLeader || _0x0145.id === _0x0144.leaderId),
        lastSeen: _0x002f(),
        self: _0x0145.id === _0x0004.id,
        avatarDataUrl: (() => { try {
            return _0x0040(_0x0145.avatarDataUrl || _0x0146.avatarDataUrl || '', _0x0024);
        }
        catch (_0x0148) {
            return _0x0146.avatarDataUrl || '';
        } })(),
    };
    _0x0144.users.set(_0x0147.id, _0x0147);
    if (_0x0147.id !== _0x0004.id)
        _0x013f(_0x0144, _0x0147.id);
}
function _0x0149(_0x014a, _0x014b, _0x014c) {
    const _0x014d = _0x015f(_0x014a);
    if (!_0x014d) {
        const _0x014e = _0x0162(_0x014a);
        if (_0x014e && _0x014b === 'chat')
            _0x0152(_0x014e, _0x014c);
        else if (_0x014e && _0x014b === 'read')
            _0x01c4(_0x014e, _0x014c);
        else if (_0x014e && _0x014b === 'delete')
            _0x01e6(_0x014e, _0x014c).catch(() => { });
        return;
    }
    const _0x014f = _0x0002.get(_0x014d);
    const _0x0150 = _0x0003.get(_0x014d);
    if (_0x014b === 'room-probe') {
        if (_0x014f)
            _0x013b(_0x014f, _0x014c?.requestId);
        return;
    }
    if (_0x014b === 'room-meta') {
        if (_0x0150)
            _0x0150.found = _0x014c;
        if (!_0x014f)
            return;
        if (_0x014c?.leaderId) {
            _0x014f.leaderId = _0x014c.leaderId;
            _0x014f.leaderName = _0x0031(_0x014c.leaderName || _0x014f.leaderName || '대표');
            _0x014f.isLeader = _0x014f.leaderId === _0x0004.id;
            if (_0x014c.name)
                _0x014f.name = _0x0034(_0x014c.name);
            for (const _0x0151 of _0x014c.users || [])
                _0x0143(_0x014f, _0x0151);
            _0x0083();
            _0x017e();
        }
        return;
    }
    if (!_0x014f)
        return;
    if (_0x014b === 'hello') {
        if (_0x014c.room?.leaderId) {
            _0x014f.leaderId = _0x014c.room.leaderId;
            _0x014f.leaderName = _0x0031(_0x014c.room.leaderName || _0x014f.leaderName || '대표');
            _0x014f.isLeader = _0x014f.leaderId === _0x0004.id;
            if (_0x014c.room.name)
                _0x014f.name = _0x0034(_0x014c.room.name);
        }
        _0x0143(_0x014f, _0x014c.user);
        if (_0x014c?.user?.id && Array.isArray(_0x014c.deletedMessages) && _0x014c.deletedMessages.length)
            _0x01e6(_0x014f.code, { deleterId: _0x014c.user.id, items: _0x014c.deletedMessages }).catch(() => { });
        _0x0083();
        _0x017e();
        return;
    }
    if (_0x014b === 'bye') {
        if (_0x014c?.userId && _0x014c.userId !== _0x0004.id)
            _0x014f.users.delete(_0x014c.userId);
        _0x017e();
        return;
    }
    if (_0x014b === 'chat')
        _0x0152(_0x014d, _0x014c);
    else if (_0x014b === 'read')
        _0x01c4(_0x014d, _0x014c);
    else if (_0x014b === 'delete')
        _0x01e6(_0x014d, _0x014c).catch(() => { });
}
function _0x0152(_0x0153, _0x0154) {
    const _0x0155 = _0x0002.get(_0x0153);
    if (!_0x0155 || !_0x0154?.id || _0x0154.from === _0x0004.id)
        return;
    if (_0x0154.to && _0x0154.to !== _0x0004.id)
        return;
    const _0x0156 = _0x0158(_0x0155, _0x0154);
    if (_0x0156)
        _0x00e8('room', _0x0061(_0x0154, _0x0155.code)).catch(() => { });
    const _0x0157 = _0x0155.users.get(_0x0154.from);
    if (_0x0157)
        _0x0157.lastSeen = _0x002f();
    _0x0182({ type: 'message', message: _0x0154 });
    _0x017e();
}
function _0x0158(_0x0159, _0x015a) {
    if (_0x0159.messages.some((_0x015b) => _0x015b.id === _0x015a.id))
        return false;
    const _0x015c = _0x0061(_0x015a, _0x0159.code);
    _0x0159.messages.push(_0x015c);
    _0x0159.messages.sort((_0x015d, _0x015e) => _0x015d.at - _0x015e.at);
    if (_0x0159.messages.length > _0x0021)
        _0x0159.messages.splice(0, _0x0159.messages.length - _0x0021);
    return true;
}
function _0x015f(_0x0160) {
    const _0x0161 = String(_0x0160 || '').match(/^realtime:els-chat-room-(\d{4})$/);
    return _0x0161?.[1] || null;
}
function _0x0162(_0x0163) {
    const _0x0164 = String(_0x0163 || '').match(/^realtime:els-chat-dm-(\d{4})-/);
    return _0x0164?.[1] || null;
}
async function _0x01c4(_0x01c5, _0x01c6) {
    const _0x01c7 = _0x0002.get(String(_0x01c5 || ''));
    const _0x01c8 = String(_0x01c6?.readerId || '');
    const _0x01c9 = new Set(Array.isArray(_0x01c6?.messageIds) ? _0x01c6.messageIds.map((_0x01ca) => String(_0x01ca || '')).filter(Boolean).slice(0, 200) : []);
    if (!_0x01c7 || !_0x01c8 || _0x01c8 === _0x0004.id || !_0x01c9.size)
        return false;
    let _0x01cb = false;
    const _0x01cc = [];
    for (const _0x01cd of _0x01c7.messages) {
        if (_0x01cd.from !== _0x0004.id || !_0x01c9.has(_0x01cd.id))
            continue;
        const _0x01ce = Array.isArray(_0x01cd.expectedReaderIds) ? _0x01cd.expectedReaderIds : [];
        if (!_0x01ce.includes(_0x01c8))
            continue;
        const _0x01cf = new Set(Array.isArray(_0x01cd.readBy) ? _0x01cd.readBy : []);
        if (_0x01cf.has(_0x01c8))
            continue;
        _0x01cf.add(_0x01c8);
        _0x01cd.readBy = [..._0x01cf];
        _0x01cb = true;
        _0x01cc.push(_0x00e8('room', _0x01cd).catch(() => { }));
    }
    if (_0x01cc.length)
        await Promise.all(_0x01cc);
    if (_0x01cb) {
        _0x0182({ type: 'read-receipt', roomCode: _0x01c7.code, readerId: _0x01c8, messageIds: [..._0x01c9] });
        _0x017e();
    }
    return _0x01cb;
}
async function _0x01d0({ code: _0x01d1, targetUserId: _0x01d2 = null }) {
    _0x0165();
    const _0x01d3 = _0x0002.get(String(_0x01d1 || ''));
    if (!_0x01d3)
        throw new Error('채팅방을 찾을 수 없습니다.');
    const _0x01d4 = _0x01d2 ? String(_0x01d2) : null;
    if (_0x01d4 && _0x01d4 === _0x0004.id)
        return { marked: 0 };
    const _0x01d5 = [];
    const _0x01db = new Map();
    for (const _0x01dc of _0x01d3.messages) {
        if (!_0x01dc.imageGroupId || Number(_0x01dc.imageGroupCount || 0) <= 1)
            continue;
        const _0x01dd = _0x01db.get(_0x01dc.imageGroupId) || { count: 0, expected: Number(_0x01dc.imageGroupCount || 0) };
        _0x01dd.count += 1;
        _0x01dd.expected = Math.max(_0x01dd.expected, Number(_0x01dc.imageGroupCount || 0));
        _0x01db.set(_0x01dc.imageGroupId, _0x01dd);
    }
    for (const _0x01d6 of _0x01d3.messages) {
        if (_0x01d6.from === _0x0004.id)
            continue;
        const _0x01d7 = _0x01d4
            ? (_0x01d6.from === _0x01d4 && _0x01d6.to === _0x0004.id)
            : !_0x01d6.to;
        if (!_0x01d7)
            continue;
        if (_0x01d6.imageGroupId && Number(_0x01d6.imageGroupCount || 0) > 1) {
            const _0x01de = _0x01db.get(_0x01d6.imageGroupId);
            if (!_0x01de || _0x01de.count < _0x01de.expected)
                continue;
        }
        _0x01d5.push(_0x01d6.id);
    }
    if (!_0x01d5.length)
        return { marked: 0 };
    const _0x01d8 = { roomCode: _0x01d3.code, readerId: _0x0004.id, messageIds: _0x01d5.slice(0, 200), at: _0x002f() };
    if (_0x01d4) {
        const _0x01d9 = _0x0048(_0x01d3.code, _0x0004.id, _0x01d4);
        await _0x0005.ensureChannel(_0x01d9);
        await _0x0005.send(_0x01d9, 'read', _0x01d8);
    }
    else {
        await _0x0005.send(_0x0046(_0x01d3.code), 'read', _0x01d8);
    }
    return { marked: _0x01d8.messageIds.length };
}
async function _0x01e6(_0x01e7, _0x01e8) {
    const _0x01e9 = _0x0002.get(String(_0x01e7 || ''));
    const _0x01ea = String(_0x01e8?.deleterId || '');
    const _0x01eb = new Map((Array.isArray(_0x01e8?.items) ? _0x01e8.items : []).slice(0, 200).map((_0x01ec) => [String(_0x01ec?.id || ''), Number(_0x01ec?.deletedAt || 0)]).filter((_0x01ed) => _0x01ed[0] && _0x01ed[1]));
    if (!_0x01e9 || !_0x01ea || !_0x01eb.size)
        return false;
    const _0x01ee = [];
    let _0x01ef = false;
    for (const _0x01f0 of _0x01e9.messages) {
        const _0x01f1 = _0x01eb.get(_0x01f0.id);
        if (!_0x01f1 || _0x01f0.from !== _0x01ea || _0x01f0.deleted)
            continue;
        if (_0x01f1 < Number(_0x01f0.at || 0) || _0x01f1 - Number(_0x01f0.at || 0) > 5 * 60 * 1000)
            continue;
        _0x01f0.deleted = true;
        _0x01f0.deletedAt = _0x01f1;
        _0x01f0.text = '';
        _0x01f0.imageDataUrl = '';
        _0x01f0.imageName = '';
        _0x01ef = true;
        _0x01ee.push(_0x00e8('room', _0x01f0).catch(() => { }));
    }
    if (_0x01ee.length)
        await Promise.all(_0x01ee);
    if (_0x01ef) {
        _0x0182({ type: 'message-deleted', roomCode: _0x01e9.code, deleterId: _0x01ea, items: [..._0x01eb].map(([_0x01f2, _0x01f3]) => ({ id: _0x01f2, deletedAt: _0x01f3 })) });
        _0x017e();
    }
    return _0x01ef;
}
async function _0x01f4({ code: _0x01f5, targetUserId: _0x01f6 = null, messageIds: _0x01f7 = [], selfMode: _0x01f8 = false }) {
    const _0x01f9 = new Set((Array.isArray(_0x01f7) ? _0x01f7 : []).map((_0x01fa) => String(_0x01fa || '')).filter(Boolean).slice(0, 120));
    if (!_0x01f9.size)
        throw new Error('삭제할 메시지를 찾을 수 없습니다.');
    const _0x01fb = _0x002f();
    if (_0x01f8) {
        let _0x01fc = _0x0018.filter((_0x01fd) => _0x01f9.has(_0x01fd.id));
        if (!_0x01fc.length)
            throw new Error('삭제할 메시지를 찾을 수 없습니다.');
        const _0x01fe = new Set(_0x01fc.map((_0x01ff) => _0x01ff.imageGroupId).filter(Boolean));
        if (_0x01fe.size)
            _0x01fc = _0x0018.filter((_0x0200) => _0x01f9.has(_0x0200.id) || (_0x0200.imageGroupId && _0x01fe.has(_0x0200.imageGroupId)));
        for (const _0x0201 of _0x01fc) {
            if (_0x0201.from !== _0x0004.id)
                throw new Error('내가 보낸 메시지만 삭제할 수 있습니다.');
            if (_0x0201.deleted)
                continue;
            if (_0x01fb - Number(_0x0201.at || 0) > 5 * 60 * 1000)
                throw new Error('메시지는 전송 후 5분 이내에만 삭제할 수 있습니다.');
        }
        for (const _0x0202 of _0x01fc) {
            if (_0x0202.deleted)
                continue;
            _0x0202.deleted = true;
            _0x0202.deletedAt = _0x01fb;
            _0x0202.text = '';
            _0x0202.imageDataUrl = '';
            _0x0202.imageName = '';
            await _0x00e8('self', _0x0202);
        }
        _0x017e();
        return { deleted: _0x01fc.length };
    }
    _0x0165();
    const _0x0203 = _0x0002.get(String(_0x01f5 || ''));
    if (!_0x0203)
        throw new Error('채팅방을 찾을 수 없습니다.');
    const _0x0204 = _0x01f6 ? String(_0x01f6) : null;
    let _0x0205 = _0x0203.messages.filter((_0x0206) => _0x01f9.has(_0x0206.id));
    if (!_0x0205.length)
        throw new Error('삭제할 메시지를 찾을 수 없습니다.');
    const _0x0207 = new Set(_0x0205.map((_0x0208) => _0x0208.imageGroupId).filter(Boolean));
    if (_0x0207.size)
        _0x0205 = _0x0203.messages.filter((_0x0209) => _0x01f9.has(_0x0209.id) || (_0x0209.imageGroupId && _0x0207.has(_0x0209.imageGroupId)));
    for (const _0x020a of _0x0205) {
        if (_0x020a.from !== _0x0004.id)
            throw new Error('내가 보낸 메시지만 삭제할 수 있습니다.');
        if ((_0x020a.to || null) !== _0x0204)
            throw new Error('현재 대화의 메시지만 삭제할 수 있습니다.');
        if (_0x020a.deleted)
            continue;
        if (_0x01fb - Number(_0x020a.at || 0) > 5 * 60 * 1000)
            throw new Error('메시지는 전송 후 5분 이내에만 삭제할 수 있습니다.');
    }
    const _0x020b = [];
    for (const _0x020c of _0x0205) {
        if (_0x020c.deleted)
            continue;
        _0x020c.deleted = true;
        _0x020c.deletedAt = _0x01fb;
        _0x020c.text = '';
        _0x020c.imageDataUrl = '';
        _0x020c.imageName = '';
        _0x020b.push({ id: _0x020c.id, deletedAt: _0x01fb });
        await _0x00e8('room', _0x020c);
    }
    if (!_0x020b.length)
        return { deleted: 0 };
    const _0x020d = { roomCode: _0x0203.code, deleterId: _0x0004.id, items: _0x020b, targetUserId: _0x0204, at: _0x01fb };
    try {
        if (_0x0204) {
            const _0x020e = _0x0048(_0x0203.code, _0x0004.id, _0x0204);
            await _0x0005.ensureChannel(_0x020e);
            await _0x0005.send(_0x020e, 'delete', _0x020d);
        }
        else {
            await _0x0005.send(_0x0046(_0x0203.code), 'delete', _0x020d);
        }
    }
    catch (_0x020f) { }
    _0x0182({ type: 'message-deleted', ..._0x020d });
    _0x017e();
    return { deleted: _0x020b.length };
}

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

function _0x0165() {
    if (_0x0220.mandatoryUpdate)
        throw new Error('업데이트 필요');
    if (_0x000d === 1)
        throw new Error('점검중');
    if (_0x000d === 2)
        throw new Error('사용 불가');
    if (!_0x0005 || !_0x0006)
        throw new Error('먼저 연결 비밀번호를 확인하세요.');
}
function _0x0166() {
    return [..._0x0002.values()].map((_0x0167) => ({
        code: _0x0167.code,
        name: _0x0167.name,
        leaderId: _0x0167.leaderId,
        leaderName: _0x0167.leaderName,
        isLeader: _0x0167.isLeader,
    }));
}
async function _0x0168() {
    if (!_0x0004 || !_0x000b)
        return false;
    _0x000b = false;
    try {
        const _0x0169 = await _0x0016.exportSnapshot({
            identity: { ..._0x0004 },
            rooms: _0x0166(),
            automatic: true,
            savedAt: _0x002f(),
        });
        await _0x0016.setKv('automaticBackupLatest', _0x0169);
        await chrome.storage.local.set({ entryChatAutomaticBackupAt: _0x0169.savedAt });
        return true;
    }
    catch (_0x016a) {
        _0x000b = true;
        throw _0x016a;
    }
}
function _0x016b() {
    _0x000b = true;
    _0x00a1();
    if (_0x000a)
        clearTimeout(_0x000a);
    _0x000a = setTimeout(() => {
        _0x000a = null;
        _0x0168().catch(() => { });
    }, _0x001e);
}
function _0x016c() {
    if (_0x0009)
        return;
    _0x0009 = setInterval(() => {
        if (_0x000b)
            _0x0168().catch(() => { });
    }, _0x001d);
}
function _0x016d() {
    if (_0x0008)
        return;
    _0x0008 = setInterval(async () => {
        const _0x016e = _0x002f() - _0x001b;
        let _0x016f = false;
        for (const _0x0170 of _0x0002.values()) {
            for (const [_0x0171, _0x0172] of [..._0x0170.users]) {
                if (_0x0171 !== _0x0004.id && _0x0172.lastSeen < _0x016e) {
                    _0x0170.users.delete(_0x0171);
                    _0x016f = true;
                }
            }
            const _0x0173 = _0x0170.users.get(_0x0004.id) || _0x0081(_0x0170);
            _0x0173.lastSeen = _0x002f();
            _0x0173.name = _0x0004.name;
            _0x0173.avatarDataUrl = _0x0004.avatarDataUrl || '';
            _0x0170.users.set(_0x0004.id, _0x0173);
            if (_0x000d === 0 && _0x0005 && _0x0170.status !== 'locked') {
                try {
                    await _0x0138(_0x0170);
                    if (_0x0170.isLeader)
                        await _0x013b(_0x0170);
                }
                catch (_0x0174) { }
            }
        }
        if (_0x016f)
            _0x017e();
    }, _0x001c);
}
function _0x0175(_0x0176) {
    return {
        code: _0x0176.code,
        name: _0x0176.name,
        leaderId: _0x0176.leaderId,
        leaderName: _0x0176.leaderName,
        isLeader: _0x0176.isLeader,
        status: _0x0176.status,
        users: [..._0x0176.users.values()]
            .map((_0x0177) => ({ id: _0x0177.id, name: _0x0177.name, avatarDataUrl: _0x0177.avatarDataUrl || '', isLeader: Boolean(_0x0177.isLeader), self: Boolean(_0x0177.self), lastSeen: _0x0177.lastSeen }))
            .sort((_0x0178, _0x0179) => Number(_0x0179.isLeader) - Number(_0x0178.isLeader) || _0x0178.name.localeCompare(_0x0179.name, 'ko')),
        messages: _0x0176.messages.slice(-_0x0021),
    };
}
function _0x017a() {
    const _0x017b = _0x008e(_0x000d);
    return {
        authenticated: Boolean(_0x000d === 0 && _0x0006 && _0x0005),
        connectionStatus: _0x017b || (_0x0006 ? _0x000c : 'locked'),
        accessMode: _0x000d,
        accessStatus: _0x017b || 'normal',
        termsAccepted: _0x000f,
        mandatoryUpdate: Boolean(_0x0220.mandatoryUpdate),
        requiredUpdateVersion: _0x0220.requiredUpdateVersion || '',
        passwordRequired: _0x0220.passwordRequired !== false,
        notice: _0x0220.notice || null,
        shortcutIntroSeen: Boolean(_0x0221),
        identity: { ..._0x0004 },
        selfMessages: _0x0018.slice(-_0x0021),
        backupHealth: { ..._0x0015 },
        rooms: [..._0x0002.values()].map(_0x0175).sort((_0x017c, _0x017d) => _0x017c.name.localeCompare(_0x017d.name, 'ko') || _0x017c.code.localeCompare(_0x017d.code)),
    };
}
function _0x017e() {
    if (!_0x0004)
        return;
    const _0x017f = { type: 'CHAT_STATE', state: _0x017a() };
    for (const _0x0180 of [..._0x0001]) {
        try {
            _0x0180.postMessage(_0x017f);
        }
        catch (_0x0181) {
            _0x0001.delete(_0x0180);
        }
    }
}
function _0x0182(_0x0183) {
    for (const _0x0184 of [..._0x0001]) {
        try {
            _0x0184.postMessage({ type: 'CHAT_EVENT', event: _0x0183 });
        }
        catch (_0x0185) {
            _0x0001.delete(_0x0184);
        }
    }
}
async function _0x0186() {
    const _0x0187 = [..._0x0002.values()].map((_0x0188) => ({
        code: _0x0188.code,
        name: _0x0188.name,
        leaderId: _0x0188.leaderId,
        leaderName: _0x0188.leaderName,
        isLeader: _0x0188.isLeader,
    }));
    return _0x0016.exportSnapshot({
        identity: { ..._0x0004 },
        rooms: _0x0187,
    });
}
async function _0x0189(_0x018a) {
    if (!_0x018a || _0x018a.format !== 'junwoo-comprehensive-chat-backup' || Number(_0x018a.version) !== 1) {
        throw new Error('지원하지 않는 채팅 백업 파일입니다.');
    }
    const _0x018b = await _0x0016.importRecords(_0x018a.records || []);
    if (_0x018a.identity && typeof _0x018a.identity === 'object') {
        const _0x018c = String(_0x018a.identity.id || '').trim();
        if (_0x018c && _0x018c.length <= 160)
            _0x0004.id = _0x018c;
        _0x0004.name = _0x0031(_0x018a.identity.name || _0x0004.name);
        try {
            _0x0004.avatarDataUrl = _0x0040(_0x018a.identity.avatarDataUrl || '', _0x0024);
        }
        catch (_0x018d) {
            _0x0004.avatarDataUrl = '';
        }
        await chrome.storage.local.set({ entryChatIdentity: _0x0004 });
        await Promise.all([
            _0x0016.setKv('identity', _0x0004).catch(() => { }),
            _0x0016.setKv('profileImage', _0x0004.avatarDataUrl || '').catch(() => { }),
        ]);
    }
    try {
        _0x0017 = await _0x0016.loadAllRecords();
    }
    catch (_0x018e) {
        _0x0017 = [];
    }
    _0x0018 = _0x0017.filter((_0x018f) => _0x018f.scope === 'self')
        .map((_0x0190) => _0x0061(_0x0190, _0x0022))
        .sort((_0x0191, _0x0192) => _0x0191.at - _0x0192.at)
        .slice(-_0x0021);
    const _0x0193 = [..._0x0002.values()].map((_0x0194) => ({
        code: _0x0194.code, name: _0x0194.name, leaderId: _0x0194.leaderId, leaderName: _0x0194.leaderName, isLeader: _0x0194.isLeader,
    }));
    const _0x0195 = Array.isArray(_0x018a.rooms) ? _0x018a.rooms : [];
    const _0x0196 = new Map();
    for (const _0x0197 of [..._0x0193, ..._0x0195]) {
        if (!_0x0044(_0x0197?.code))
            continue;
        _0x0196.set(_0x0197.code, _0x0197);
    }
    if (_0x0005)
        _0x0005.close();
    _0x0005 = null;
    _0x0002.clear();
    for (const _0x0198 of _0x0196.values()) {
        const _0x0199 = _0x0198.leaderId || (_0x0198.isLeader ? _0x0004.id : null);
        const _0x019a = _0x0079({
            code: _0x0198.code,
            name: _0x0034(_0x0198.name || `방 ${_0x0198.code}`),
            leaderId: _0x0199,
            leaderName: _0x0031(_0x0198.leaderName || (_0x0199 === _0x0004.id ? _0x0004.name : '대표')),
            isLeader: _0x0199 === _0x0004.id || Boolean(_0x0198.isLeader),
            status: _0x0006 ? 'connecting' : 'locked',
        });
        _0x0069(_0x019a);
        _0x0002.set(_0x019a.code, _0x019a);
    }
    _0x0017 = [];
    await _0x0083();
    if (_0x0006) {
        await _0x0086();
        await _0x008b();
    }
    _0x016b();
    _0x017e();
    return { imported: _0x018b, rooms: _0x0002.size, selfMessages: _0x0018.length };
}
function _0x019b(_0x019c) {
    const _0x019d = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(_0x019c || '').trim());
    return _0x019d ? _0x019d.slice(1).map((_0x019e) => Number(_0x019e)) : null;
}
function _0x019f(_0x01a0, _0x01a1) {
    const _0x01a2 = _0x019b(_0x01a0);
    const _0x01a3 = _0x019b(_0x01a1);
    if (!_0x01a2 || !_0x01a3)
        return 0;
    for (let _0x01a4 = 0; _0x01a4 < 3; _0x01a4 += 1) {
        if (_0x01a2[_0x01a4] !== _0x01a3[_0x01a4])
            return _0x01a2[_0x01a4] > _0x01a3[_0x01a4] ? 1 : -1;
    }
    return 0;
}
async function _0x01a5() {
    const _0x01a6 = chrome.runtime.getManifest().version;
    const _0x0213 = _0x002f();
    if (_0x0210 && _0x0210.currentVersion === _0x01a6 && _0x0213 - _0x0211 < 5000)
        return { ..._0x0210 };
    if (_0x0212)
        return _0x0212;
    _0x0212 = (async () => {
        const _0x0214 = [];
        let _0x0215 = '';
        try {
            const _0x01a7 = await fetch(`${_0x0029}&_=${Date.now()}`, {
                method: 'GET', cache: 'no-store',
                headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
            });
            if (_0x01a7.ok) {
                const _0x01a9 = await _0x01a7.json();
                if (Array.isArray(_0x01a9)) {
                    for (const _0x01ac of _0x01a9) {
                        if (_0x01ac?.type === 'file')
                            _0x0214.push(String(_0x01ac.name || ''));
                    }
                }
            } else {
                _0x0215 = `api-http-${_0x01a7.status}`;
            }
        } catch (_0x01a8) {
            _0x0215 = 'api-network';
        }
        if (!_0x0214.length) {
            try {
                const _0x0216 = await fetch(`https://github.com/KKomaProgrammer/codingdongari/tree/main?_=${Date.now()}`, { method: 'GET', cache: 'no-store' });
                if (_0x0216.ok) {
                    const _0x0217 = await _0x0216.text();
                    const _0x0218 = /message_V(\d+)\.(\d+)\.(\d+)\.zip/ig;
                    let _0x0219;
                    while ((_0x0219 = _0x0218.exec(_0x0217)))
                        _0x0214.push(`message_V${Number(_0x0219[1])}.${Number(_0x0219[2])}.${Number(_0x0219[3])}.zip`);
                } else if (!_0x0215) {
                    _0x0215 = `html-http-${_0x0216.status}`;
                }
            } catch (_) {
                if (!_0x0215) _0x0215 = 'html-network';
            }
        }
        let _0x01ab = null;
        for (const _0x021a of new Set(_0x0214)) {
            const _0x01ad = _0x002b.exec(_0x021a);
            if (!_0x01ad) continue;
            const _0x01ae = `${Number(_0x01ad[1])}.${Number(_0x01ad[2])}.${Number(_0x01ad[3])}`;
            if (_0x019f(_0x01ae, _0x01a6) <= 0) continue;
            if (!_0x01ab || _0x019f(_0x01ae, _0x01ab.version) > 0)
                _0x01ab = { version: _0x01ae, filename: _0x021a };
        }
        const _0x021b = _0x01ab ? {
            available: true, currentVersion: _0x01a6, version: _0x01ab.version,
            filename: _0x01ab.filename, downloadUrl: `${_0x002a}${encodeURIComponent(_0x01ab.filename)}`,
        } : { available: false, currentVersion: _0x01a6, reason: _0x0215 || '' };
        _0x0210 = _0x021b;
        _0x0211 = _0x002f();
        return { ..._0x021b };
    })();
    try { return await _0x0212; }
    finally { _0x0212 = null; }
}
async function _0x01af() {
    const _0x01b0 = await _0x01a5();
    if (!_0x01b0.available)
        throw new Error('현재 설치된 버전보다 새로운 업데이트가 없습니다.');
    const _0x01b1 = chrome.runtime.getURL(`updater.html?version=${encodeURIComponent(_0x01b0.version)}&autostart=1`);
    await chrome.tabs.create({ url: _0x01b1 });
    return _0x01b0;
}
async function _0x01b2(_0x01b3, _0x01b4 = {}) {
    await _0x004c();
    switch (_0x01b3) {
        case 'GET_STATE': return _0x017a();
        case 'ACCEPT_TERMS': return _0x009b();
        case 'ACK_SHORTCUT_INTRO': return _0x0229();
        case 'AUTH': return _0x00a6(_0x01b4.password, _0x01b4.name);
        case 'SET_NAME':
            await _0x00ac(_0x01b4.name);
            return _0x017a();
        case 'SET_PROFILE_IMAGE': return _0x00b2(_0x01b4.imageDataUrl || '');
        case 'BACKUP_ORIGINAL_IMAGE_TEMP': return _0x0125(_0x01b4);
        case 'CREATE_ROOM': return _0x00b8(_0x01b4.name);
        case 'JOIN_ROOM': return _0x00c0(_0x01b4.code);
        case 'LEAVE_ROOM':
            await _0x00c7(_0x01b4.code);
            return true;
        case 'RENAME_ROOM': return _0x00cc(_0x01b4.code, _0x01b4.name);
        case 'SEND_CHAT': return _0x00d0(_0x01b4);
        case 'SEND_SELF_CHAT': return _0x00de(_0x01b4);
        case 'MARK_READ': return _0x01d0(_0x01b4);
        case 'DELETE_MESSAGE': return _0x01f4(_0x01b4);
        case 'EXPORT_BACKUP': return _0x0186();
        case 'IMPORT_BACKUP': return _0x0189(_0x01b4.backup);
        case 'CHECK_UPDATE': return _0x01a5();
        case 'OPEN_UPDATER': return _0x01af();
        case 'RELOAD_EXTENSION':
            chrome.runtime.reload();
            return true;
        default: throw new Error(`지원하지 않는 명령입니다: ${_0x01b3}`);
    }
}
(async () => {
    const _0x01e0 = 'entryChatPendingUpdateV2';
    try {
        const _0x01e1 = await chrome.storage.local.get(_0x01e0);
        const _0x01e2 = _0x01e1?.[_0x01e0];
        if (_0x01e2?.toVersion && String(_0x01e2.toVersion) === String(chrome.runtime.getManifest().version))
            await chrome.storage.local.remove(_0x01e0);
    }
    catch (_) { }
})();
chrome.runtime.onConnect.addListener((_0x01b5) => {
    if (_0x01b5.name !== 'entry-live-chat')
        return;
    _0x0001.add(_0x01b5);
    _0x004c().then(() => _0x01b5.postMessage({ type: 'CHAT_STATE', state: _0x017a() })).catch(() => { });
    _0x01b5.onDisconnect.addListener(() => { try { void chrome.runtime.lastError; } catch (_) { } _0x0001.delete(_0x01b5); });
    _0x01b5.onMessage.addListener(async (_0x01b6) => {
        if (_0x01b6?.type !== 'CHAT_COMMAND')
            return;
        try {
            const _0x01b7 = await _0x01b2(_0x01b6.command, _0x01b6.payload || {});
            _0x01b5.postMessage({ type: 'CHAT_RESPONSE', requestId: _0x01b6.requestId, ok: true, result: _0x01b7 });
            _0x017e();
        }
        catch (_0x01b8) {
            _0x01b5.postMessage({ type: 'CHAT_RESPONSE', requestId: _0x01b6.requestId, ok: false, error: _0x01b8?.message || String(_0x01b8) });
        }
    });
});
chrome.runtime.onMessage.addListener((_0x01b9, _0x01ba, _0x01bb) => {
    if (_0x01b9?.type !== 'ENTRY_CHAT_COMMAND')
        return;
    _0x01b2(_0x01b9.command, _0x01b9.payload || {}).then((_0x01bc) => _0x01bb({ ok: true, result: _0x01bc })).catch((_0x01bd) => _0x01bb({ ok: false, error: _0x01bd?.message || String(_0x01bd) }));
    return true;
});
chrome.action.onClicked.addListener((_0x01be) => {
    if (!_0x01be?.id)
        return;
    chrome.tabs.sendMessage(_0x01be.id, { type: 'ENTRY_CHAT_TOGGLE' }).catch(() => { });
});
_0x004c().catch(() => { });
