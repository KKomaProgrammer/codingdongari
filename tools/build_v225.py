from pathlib import Path
import json, re, uuid, datetime

ROOT = Path('/tmp/pkg')


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'missing pattern: {label}')
    return text.replace(old, new, 1)


def sub_once(text, pattern, replacement, label, flags=re.S):
    new, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f'pattern count {count}: {label}')
    return new

# version metadata
manifest_path = ROOT / 'manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
manifest['version'] = '2.2.5'
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

build_path = ROOT / 'build-info.json'
build = json.loads(build_path.read_text(encoding='utf-8'))
build['version'] = '2.2.5'
build['buildId'] = str(uuid.uuid4())
build['createdAt'] = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')
if 'CHANGELOG-v2.2.5.md' not in build['managedFiles']:
    build['managedFiles'].append('CHANGELOG-v2.2.5.md')
build_path.write_text(json.dumps(build, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

(ROOT / 'CHANGELOG-v2.2.5.md').write_text('''# Entry Live Studio v2.2.5\n\n- 방 멤버십과 접속 상태를 분리했습니다. 연결이 끊겨도 방에서 나간 것으로 처리하지 않고 오프라인으로 표시합니다.\n- 명시적인 방 나가기 이벤트를 받은 경우에만 멤버 목록에서 제거합니다.\n- 방 멤버 목록을 로컬에 보존하여 확장 재연결/재시작 후에도 오프라인 멤버를 유지합니다.\n- 이름으로 방 추천을 보낼 수 있으며, 모든 화면 상단의 SVG 알림 아이콘에서 추천 알림을 확인할 수 있습니다.\n- 채팅/메인 화면 스크롤 위치를 로컬에 저장하여 닫았다 다시 열거나 상태 갱신 후에도 위치를 복원합니다.\n''', encoding='utf-8')

# background.js
p = ROOT / 'background.js'
s = p.read_text(encoding='utf-8')

s = replace_once(
    s,
    "const _0x002b = /^message_V(\\d+)\\.(\\d+)\\.(\\d+)\\.zip$/i;",
    "const _0x002b = /^message_V(\\d+)\\.(\\d+)\\.(\\d+)\\.zip$/i;\nconst _0x0230 = 'realtime:els-chat-global-notify';\nconst _0x0231 = 'entryChatNotificationsV1';\nlet _0x0232 = [];",
    'notification globals',
)

s = replace_once(
    s,
    "            'entryChatBackupHealthV1',",
    "            'entryChatBackupHealthV1',\n            'entryChatNotificationsV1',",
    'notification storage key',
)

s = replace_once(
    s,
    "        _0x000f = Boolean(_0x004e.entryChatTermsAcceptedV1);",
    "        _0x000f = Boolean(_0x004e.entryChatTermsAcceptedV1);\n        _0x0232 = (Array.isArray(_0x004e.entryChatNotificationsV1) ? _0x004e.entryChatNotificationsV1 : []).map((_0x0233) => ({\n            id: String(_0x0233?.id || _0x0030()),\n            type: 'room-recommend',\n            fromName: _0x0031(_0x0233?.fromName || '사용자'),\n            roomName: _0x0034(_0x0233?.roomName || '채팅방'),\n            roomCode: _0x0044(_0x0233?.roomCode) ? String(_0x0233.roomCode) : '',\n            at: Number(_0x0233?.at) || _0x002f(),\n            read: Boolean(_0x0233?.read),\n        })).filter((_0x0234) => _0x0234.roomCode).slice(-100);",
    'load notifications',
)

s = replace_once(
    s,
    "            _0x0069(_0x005e);\n            _0x0002.set(_0x005d.code, _0x005e);",
    "            for (const _0x0235 of (Array.isArray(_0x005d.users) ? _0x005d.users : [])) {\n                const _0x0236 = String(_0x0235?.id || '');\n                if (!_0x0236 || _0x0236 === _0x0004.id) continue;\n                let _0x0237 = '';\n                try { _0x0237 = _0x0040(_0x0235.avatarDataUrl || '', _0x0024); } catch (_) {}\n                _0x005e.users.set(_0x0236, {\n                    id: _0x0236, name: _0x0031(_0x0235.name || '사용자'), avatarDataUrl: _0x0237,\n                    isLeader: Boolean(_0x0235.isLeader || _0x0236 === _0x005e.leaderId), self: false,\n                    lastSeen: Number(_0x0235.lastSeen) || 0, online: false,\n                });\n            }\n            _0x0069(_0x005e);\n            _0x0002.set(_0x005d.code, _0x005e);",
    'restore known members',
)

s = replace_once(
    s,
    "        self: true,\n        avatarDataUrl: _0x0004.avatarDataUrl || '',",
    "        self: true,\n        online: true,\n        avatarDataUrl: _0x0004.avatarDataUrl || '',",
    'self online',
)

s = replace_once(
    s,
    "        isLeader: _0x0085.isLeader,\n    }));",
    "        isLeader: _0x0085.isLeader,\n        users: [..._0x0085.users.values()].map((_0x0238) => ({\n            id: _0x0238.id, name: _0x0238.name, avatarDataUrl: _0x0238.avatarDataUrl || '',\n            isLeader: Boolean(_0x0238.isLeader), lastSeen: Number(_0x0238.lastSeen) || 0,\n        })),\n    }));",
    'persist known members',
)

s = replace_once(
    s,
    "    for (const _0x008c of _0x0002.values()) {\n        _0x008c.status = 'connecting';\n        _0x008c.users.clear();\n        _0x008c.users.set(_0x0004.id, _0x0081(_0x008c));",
    "    try { await _0x0005.ensureChannel(_0x0230); } catch (_) {}\n    for (const _0x008c of _0x0002.values()) {\n        _0x008c.status = 'connecting';\n        for (const [_0x0239, _0x023a] of _0x008c.users) {\n            if (_0x0239 !== _0x0004.id) _0x023a.online = false;\n        }\n        _0x008c.users.set(_0x0004.id, _0x0081(_0x008c));",
    'reconnect keeps members',
)

s = replace_once(
    s,
    "        leaderName: _0x0139.leaderName,\n        users: [..._0x013c.users.values()].map((_0x013e) => ({ id: _0x013e.id, name: _0x013e.name, avatarDataUrl: _0x013e.avatarDataUrl || '', isLeader: _0x013e.isLeader })),",
    "        leaderName: _0x0139.leaderName,\n        senderId: _0x0004.id,\n        authoritative: Boolean(_0x0139.isLeader),\n        users: [..._0x013c.users.values()].map((_0x013e) => ({ id: _0x013e.id, name: _0x013e.name, avatarDataUrl: _0x013e.avatarDataUrl || '', isLeader: _0x013e.isLeader, online: Boolean(_0x013e.online), lastSeen: Number(_0x013e.lastSeen) || 0 })),",
    'authoritative room meta',
)

s = sub_once(
    s,
    r"function _0x0143\(_0x0144, _0x0145\) \{.*?\n\}\nfunction _0x0149",
    r'''function _0x0143(_0x0144, _0x0145) {
    if (!_0x0145?.id)
        return;
    const _0x0146 = _0x0144.users.get(_0x0145.id) || {};
    const _0x023b = Object.prototype.hasOwnProperty.call(_0x0145, 'online') ? Boolean(_0x0145.online) : true;
    const _0x0147 = {
        id: _0x0145.id,
        name: _0x0031(_0x0145.name || _0x0146.name || '사용자'),
        isLeader: Boolean(_0x0145.isLeader || _0x0145.id === _0x0144.leaderId),
        lastSeen: _0x023b ? _0x002f() : (Number(_0x0145.lastSeen) || Number(_0x0146.lastSeen) || 0),
        self: _0x0145.id === _0x0004.id,
        online: _0x0145.id === _0x0004.id ? true : _0x023b,
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
function _0x0149''',
    'member merge online state',
)

s = replace_once(
    s,
    "function _0x0149(_0x014a, _0x014b, _0x014c) {\n    const _0x014d = _0x015f(_0x014a);",
    "function _0x0149(_0x014a, _0x014b, _0x014c) {\n    if (_0x014a === _0x0230 && _0x014b === 'room-recommend') {\n        _0x0240(_0x014c).catch(() => {});\n        return;\n    }\n    const _0x014d = _0x015f(_0x014a);",
    'global recommendation receive',
)

s = replace_once(
    s,
    "            for (const _0x0151 of _0x014c.users || [])\n                _0x0143(_0x014f, _0x0151);\n            _0x0083();",
    "            const _0x023c = new Set();\n            for (const _0x0151 of _0x014c.users || []) {\n                if (_0x0151?.id) _0x023c.add(String(_0x0151.id));\n                _0x0143(_0x014f, _0x0151);\n            }\n            if (_0x014c.authoritative) {\n                for (const [_0x023d] of [..._0x014f.users]) {\n                    if (_0x023d !== _0x0004.id && !_0x023c.has(_0x023d)) _0x014f.users.delete(_0x023d);\n                }\n            }\n            _0x0083();",
    'leader roster reconciliation',
)

s = replace_once(
    s,
    "    if (_0x014b === 'bye') {\n        if (_0x014c?.userId && _0x014c.userId !== _0x0004.id)\n            _0x014f.users.delete(_0x014c.userId);\n        _0x017e();",
    "    if (_0x014b === 'bye') {\n        if (_0x014c?.userId && _0x014c.userId !== _0x0004.id)\n            _0x014f.users.delete(_0x014c.userId);\n        _0x0083();\n        _0x017e();",
    'persist explicit leave',
)

s = replace_once(
    s,
    "    const _0x0157 = _0x0155.users.get(_0x0154.from);\n    if (_0x0157)\n        _0x0157.lastSeen = _0x002f();",
    "    const _0x0157 = _0x0155.users.get(_0x0154.from);\n    if (_0x0157) {\n        _0x0157.lastSeen = _0x002f();\n        _0x0157.online = true;\n    }",
    'message marks online',
)

s = replace_once(
    s,
    "                if (_0x0171 !== _0x0004.id && _0x0172.lastSeen < _0x016e) {\n                    _0x0170.users.delete(_0x0171);\n                    _0x016f = true;\n                }",
    "                if (_0x0171 !== _0x0004.id && _0x0172.lastSeen < _0x016e && _0x0172.online !== false) {\n                    _0x0172.online = false;\n                    _0x016f = true;\n                }",
    'stale member becomes offline',
)

s = replace_once(
    s,
    "            _0x0173.avatarDataUrl = _0x0004.avatarDataUrl || '';\n            _0x0170.users.set(_0x0004.id, _0x0173);",
    "            _0x0173.avatarDataUrl = _0x0004.avatarDataUrl || '';\n            _0x0173.online = true;\n            _0x0170.users.set(_0x0004.id, _0x0173);",
    'self heartbeat online',
)

s = replace_once(
    s,
    ".map((_0x0177) => ({ id: _0x0177.id, name: _0x0177.name, avatarDataUrl: _0x0177.avatarDataUrl || '', isLeader: Boolean(_0x0177.isLeader), self: Boolean(_0x0177.self), lastSeen: _0x0177.lastSeen }))",
    ".map((_0x0177) => ({ id: _0x0177.id, name: _0x0177.name, avatarDataUrl: _0x0177.avatarDataUrl || '', isLeader: Boolean(_0x0177.isLeader), self: Boolean(_0x0177.self), lastSeen: _0x0177.lastSeen, online: Boolean(_0x0177.self ? _0x000c === 'online' : (_0x0177.online !== false && Number(_0x0177.lastSeen) >= _0x002f() - _0x001b)) }))",
    'serialize online field',
)

s = replace_once(
    s,
    "        expectedReaderIds: _0x00d2 ? [String(_0x00d2)] : [..._0x00d9.users.keys()].filter((_0x01c1) => _0x01c1 !== _0x0004.id),",
    "        expectedReaderIds: _0x00d2 ? [String(_0x00d2)] : [..._0x00d9.users.values()].filter((_0x01c1) => _0x01c1.id !== _0x0004.id && _0x01c1.online !== false).map((_0x01c1) => _0x01c1.id),",
    'reader count only connected',
)

s = replace_once(
    s,
    "        if (!_0x00dc)\n            throw new Error('상대방이 현재 방에 연결되어 있지 않습니다.');",
    "        if (!_0x00dc)\n            throw new Error('상대방이 현재 방에 참가하고 있지 않습니다.');\n        if (_0x00dc.online === false)\n            throw new Error('상대방이 현재 오프라인입니다.');",
    'dm offline guard',
)

notification_functions = r'''
async function _0x023e() {
    await chrome.storage.local.set({ [_0x0231]: _0x0232.slice(-100) });
}
async function _0x023f({ code: _0x0241, targetName: _0x0242 }) {
    _0x0165();
    const _0x0243 = _0x0002.get(String(_0x0241 || ''));
    if (!_0x0243)
        throw new Error('채팅방을 찾을 수 없습니다.');
    _0x0242 = _0x0031(_0x0242, '');
    if (!_0x0242)
        throw new Error('추천을 보낼 사용자 이름을 입력하세요.');
    if (_0x0242 === _0x0004.name)
        throw new Error('자신에게는 방 추천을 보낼 수 없습니다.');
    await _0x0005.ensureChannel(_0x0230);
    const _0x0244 = {
        id: _0x0030(), type: 'room-recommend', targetName: _0x0242,
        fromId: _0x0004.id, fromName: _0x0004.name,
        roomCode: _0x0243.code, roomName: _0x0243.name, at: _0x002f(),
    };
    await _0x0005.send(_0x0230, 'room-recommend', _0x0244);
    return { ok: true };
}
async function _0x0240(_0x0245) {
    if (!_0x0245 || _0x0245.type !== 'room-recommend')
        return false;
    if (String(_0x0245.targetName || '') !== String(_0x0004?.name || ''))
        return false;
    if (String(_0x0245.fromId || '') === String(_0x0004?.id || ''))
        return false;
    const _0x0246 = String(_0x0245.id || '');
    if (!_0x0246 || _0x0232.some((_0x0247) => _0x0247.id === _0x0246))
        return false;
    const _0x0248 = {
        id: _0x0246, type: 'room-recommend', fromName: _0x0031(_0x0245.fromName || '사용자'),
        roomName: _0x0034(_0x0245.roomName || '채팅방'),
        roomCode: _0x0044(_0x0245.roomCode) ? String(_0x0245.roomCode) : '',
        at: Number(_0x0245.at) || _0x002f(), read: false,
    };
    if (!_0x0248.roomCode)
        return false;
    _0x0232.push(_0x0248);
    if (_0x0232.length > 100) _0x0232.splice(0, _0x0232.length - 100);
    await _0x023e();
    _0x0182({ type: 'notification', notification: _0x0248 });
    _0x017e();
    return true;
}
async function _0x0249() {
    let _0x024a = false;
    for (const _0x024b of _0x0232) {
        if (!_0x024b.read) { _0x024b.read = true; _0x024a = true; }
    }
    if (_0x024a) await _0x023e();
    _0x017e();
    return true;
}
'''
s = replace_once(s, "function _0x0165() {", notification_functions + "\nfunction _0x0165() {", 'notification functions')

s = replace_once(
    s,
    "        identity: { ..._0x0004 },",
    "        notifications: _0x0232.slice(-100),\n        unreadNotificationCount: _0x0232.filter((_0x024c) => !_0x024c.read).length,\n        identity: { ..._0x0004 },",
    'state notifications',
)

s = replace_once(
    s,
    "        case 'MARK_READ': return _0x01d0(_0x01b4);",
    "        case 'MARK_READ': return _0x01d0(_0x01b4);\n        case 'RECOMMEND_ROOM': return _0x023f(_0x01b4);\n        case 'MARK_NOTIFICATIONS_READ': return _0x0249();",
    'notification commands',
)

p.write_text(s, encoding='utf-8')

# content/chat.js
p = ROOT / 'content/chat.js'
s = p.read_text(encoding='utf-8')

s = replace_once(
    s,
    "        scrollPositions: new Map(),\n        activeScrollKey: null,",
    "        scrollPositions: new Map(),\n        activeScrollKey: null,\n        scrollSaveTimer: null,",
    'scroll state timer',
)

# CSS
s = replace_once(
    s,
    "    .scroll-bottom-btn[hidden]{display:none!important}\n",
    "    .scroll-bottom-btn[hidden]{display:none!important}\n    .notification-btn{position:relative;display:grid;place-items:center}.notification-btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.notification-dot{position:absolute;right:5px;top:4px;width:7px;height:7px;border-radius:50%;background:#e7485f;border:1.5px solid #fff}.notification-dot[hidden]{display:none!important}.notification-list{display:grid;gap:8px;max-height:320px;overflow:auto}.notification-item{padding:11px 12px;border:1px solid #e0e5eb;border-radius:12px;background:#f8fafc;color:#4d5868;font-size:11px;line-height:1.55}.notification-item small{display:block;margin-top:4px;color:#8b95a3;font-size:8px}.member-row.offline{opacity:.72}.member-row.offline .member-copy small{color:#8e97a4}\n",
    'notification css',
)

s = replace_once(
    s,
    "<div class=\"topright\"><span class=\"status\"><i class=\"dot\" id=\"statusDot\"></i><span id=\"statusText\">연결 필요</span></span><button class=\"iconbtn\" id=\"closePanel\" aria-label=\"닫기\">×</button></div>",
    "<div class=\"topright\"><span class=\"status\"><i class=\"dot\" id=\"statusDot\"></i><span id=\"statusText\">연결 필요</span></span><button class=\"iconbtn notification-btn\" id=\"notificationBell\" type=\"button\" aria-label=\"알림\" title=\"알림\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9\"></path><path d=\"M10 21h4\"></path></svg><i class=\"notification-dot\" id=\"notificationDot\" hidden></i></button><button class=\"iconbtn\" id=\"closePanel\" aria-label=\"닫기\">×</button></div>",
    'bell button',
)

# save before panel closes, restore render after opening
s = replace_once(
    s,
    "    function _0x007a(_0x007b) {\n        _0x0003.open = Boolean(_0x007b);",
    "    function _0x007a(_0x007b) {\n        if (!_0x007b) { _0x01e0(); _0x0250(); _0x0252(true); }\n        _0x0003.open = Boolean(_0x007b);",
    'save scroll before close',
)

s = replace_once(
    s,
    "        _0x0096();\n        _0x00a1();",
    "        _0x0096();\n        _0x00a1();\n        _0x024d();",
    'notification dot render',
)

s = replace_once(
    s,
    "    function _0x00ad(_0x00ae = null) {\n        _0x01e0();",
    "    function _0x00ad(_0x00ae = null) {\n        _0x01e0();\n        _0x0250();",
    'save main scroll before rerender',
)

s = replace_once(
    s,
    "        else\n            _0x0141(_0x00af, _0x00ae);\n    }",
    "        else\n            _0x0141(_0x00af, _0x00ae);\n        _0x0251();\n    }",
    'restore main scroll after rerender',
)

# room recommendation action
s = replace_once(
    s,
    "${_0x00d3.isLeader ? '<button data-room-tool=\"rename\">방 이름 수정</button>' : ''}<button class=\"danger\" data-room-tool=\"leave\">방 나가기</button>",
    "${_0x00d3.isLeader ? '<button data-room-tool=\"rename\">방 이름 수정</button>' : ''}<button data-room-tool=\"recommend\">방 추천</button><button class=\"danger\" data-room-tool=\"leave\">방 나가기</button>",
    'room recommend button',
)

s = replace_once(
    s,
    "        _0x00d2.querySelector('[data-room-tool=\"rename\"]')?.addEventListener('click', () => _0x01b6(_0x00d3));\n        _0x00d2.querySelector('[data-room-tool=\"leave\"]')?.addEventListener('click', () => _0x01b8(_0x00d3));",
    "        _0x00d2.querySelector('[data-room-tool=\"rename\"]')?.addEventListener('click', () => _0x01b6(_0x00d3));\n        _0x00d2.querySelector('[data-room-tool=\"recommend\"]')?.addEventListener('click', () => _0x024f(_0x00d3));\n        _0x00d2.querySelector('[data-room-tool=\"leave\"]')?.addEventListener('click', () => _0x01b8(_0x00d3));",
    'recommend click',
)

# member row now distinguishes offline from left; offline remains visible but DM disabled
s = sub_once(
    s,
    r"    function _0x00d9\(_0x00da, _0x00db, _0x00dc\) \{.*?\n    \}\n    function _0x00df",
    r'''    function _0x00d9(_0x00da, _0x00db, _0x00dc) {
        const _0x00dd = _0x00db.id === _0x00dc;
        const _0x00de = _0x00dd ? 0 : (_0x0003.unread.get(_0x000b(_0x00da.code, _0x00db.id)) || 0);
        const _0x024c = _0x00dd || _0x00db.online !== false;
        const _0x024e = _0x00dd ? '내 계정 · 나와의 채팅은 방 목록에서 사용' : (_0x024c ? '온라인 · 개인 채팅' : '오프라인 · 방에는 참가 중');
        return `<button class="member-row ${_0x024c ? '' : 'offline'}" data-open-chat="${_0x0005(_0x00db.id)}" ${_0x00dd || !_0x024c ? 'disabled' : ''}>${_0x00b0(_0x00db.name, _0x00db.avatarDataUrl || '', 'member-avatar')}<span class="member-copy"><b>${_0x0005(_0x00db.name)} ${_0x00db.isLeader ? '<span class="role">대표</span>' : ''}${_0x00dd ? ' <span class="selftag">나</span>' : ''}</b><small>${_0x024e}</small></span>${_0x00de ? `<span class="treebadge">${_0x00de > 99 ? '99+' : _0x00de}</span>` : ''}${_0x00dd || !_0x024c ? '' : '<span class="member-arrow">›</span>'}</button>`;
    }
    function _0x00df''',
    'offline member row',
)

# Replace message scroll save/restore functions with persistent version
s = sub_once(
    s,
    r"    function _0x01e0\(\) \{.*?\n    \}\n    function _0x01e4\(_0x01e5, _0x01e6\) \{.*?\n    \}\n    function _0x0120",
    r'''    const _0x024a = 'entryChatScrollPositionsV2';
    function _0x0252(_0x0253 = false) {
        clearTimeout(_0x0003.scrollSaveTimer);
        const _0x0254 = () => {
            const _0x0255 = {};
            for (const [_0x0256, _0x0257] of [..._0x0003.scrollPositions].slice(-120))
                _0x0255[_0x0256] = { top: Math.max(0, Number(_0x0257?.top) || 0), atBottom: Boolean(_0x0257?.atBottom) };
            chrome.storage.local.set({ [_0x024a]: _0x0255 }).catch(() => {});
        };
        if (_0x0253) _0x0254();
        else _0x0003.scrollSaveTimer = setTimeout(_0x0254, 120);
    }
    function _0x0258(_0x0259, _0x025a) {
        if (!_0x0259) return;
        _0x0003.scrollPositions.set(_0x0259, _0x025a);
        _0x0252(false);
    }
    async function _0x025b() {
        try {
            const _0x025c = await chrome.storage.local.get(_0x024a);
            const _0x025d = _0x025c?.[_0x024a] || {};
            for (const [_0x025e, _0x025f] of Object.entries(_0x025d)) {
                if (!_0x025e || !_0x025f || typeof _0x025f !== 'object') continue;
                _0x0003.scrollPositions.set(_0x025e, { top: Math.max(0, Number(_0x025f.top) || 0), atBottom: Boolean(_0x025f.atBottom) });
            }
            if (_0x0003.open) _0x0092(_0x007f());
        } catch (_) {}
    }
    function _0x0250() {
        if (!_0x0003.open || _0x0011.hidden) return;
        const _0x0260 = _0x0002.querySelector('#mainView .navbody');
        if (!_0x0260) return;
        const _0x0261 = _0x0003.view === 'rooms' ? 'nav:rooms' : (_0x0003.view === 'room' && _0x0003.selectedRoomCode ? `nav:room:${_0x0003.selectedRoomCode}` : '');
        if (_0x0261) _0x0258(_0x0261, { top: _0x0260.scrollTop, atBottom: false });
    }
    function _0x0251() {
        if (!_0x0003.open) return;
        const _0x0262 = _0x0002.querySelector('#mainView .navbody');
        if (!_0x0262) return;
        const _0x0263 = _0x0003.view === 'rooms' ? 'nav:rooms' : (_0x0003.view === 'room' && _0x0003.selectedRoomCode ? `nav:room:${_0x0003.selectedRoomCode}` : '');
        if (!_0x0263) return;
        const _0x0264 = _0x0003.scrollPositions.get(_0x0263);
        const _0x0265 = () => {
            if (_0x0264) _0x0262.scrollTop = Math.max(0, Math.min(Number(_0x0264.top || 0), Math.max(0, _0x0262.scrollHeight - _0x0262.clientHeight)));
        };
        _0x0265();
        requestAnimationFrame(() => requestAnimationFrame(_0x0265));
        _0x0262.addEventListener('scroll', () => {
            if (_0x0003.open && !_0x0011.hidden) _0x0258(_0x0263, { top: _0x0262.scrollTop, atBottom: false });
        }, { passive: true });
    }
    function _0x01e0() {
        const _0x01e1 = _0x000f('messages');
        if (!_0x01e1 || !_0x0003.open || _0x0011.hidden)
            return;
        const _0x01e2 = String(_0x01e1.dataset.scrollKey || '');
        if (!_0x01e2)
            return;
        const _0x01e3 = Math.max(0, _0x01e1.scrollHeight - _0x01e1.clientHeight - _0x01e1.scrollTop);
        _0x0258(_0x01e2, { top: _0x01e1.scrollTop, atBottom: _0x01e3 <= 36 });
    }
    function _0x01e4(_0x01e5, _0x01e6) {
        if (!_0x01e5 || !_0x01e6)
            return;
        _0x01e5.dataset.scrollKey = _0x01e6;
        const _0x01e7 = _0x000f('scrollToBottom');
        const _0x01eb = _0x0003.scrollPositions.get(_0x01e6);
        _0x0003.activeScrollKey = _0x01e6;
        let _0x01ef = true;
        const _0x01f0 = () => { _0x01e5.scrollTop = _0x01e5.scrollHeight; };
        const _0x01e8 = () => {
            const _0x01e9 = Math.max(0, _0x01e5.scrollHeight - _0x01e5.clientHeight - _0x01e5.scrollTop);
            const _0x01ea = _0x01e9 <= 36;
            if (!_0x01ef && _0x0003.open && !_0x0011.hidden)
                _0x0258(_0x01e6, { top: _0x01e5.scrollTop, atBottom: _0x01ea });
            if (_0x01e7) _0x01e7.hidden = _0x01ea;
        };
        if (_0x01eb) {
            if (_0x01eb.atBottom) _0x01f0();
            else _0x01e5.scrollTop = Math.max(0, Math.min(Number(_0x01eb.top || 0), Math.max(0, _0x01e5.scrollHeight - _0x01e5.clientHeight)));
        } else {
            _0x01f0();
        }
        _0x01e5.addEventListener('scroll', _0x01e8, { passive: true });
        _0x01e7?.addEventListener('click', () => { _0x01e5.scrollTo({ top: _0x01e5.scrollHeight, behavior: 'smooth' }); });
        const _0x01f1 = !_0x01eb || _0x01eb.atBottom;
        for (const _0x01ec of _0x01e5.querySelectorAll('img')) {
            const _0x01f2 = () => { if (_0x01f1) _0x01f0(); _0x01e8(); };
            if (!_0x01ec.complete) _0x01ec.addEventListener('load', _0x01f2, { once: true });
            else if (typeof _0x01ec.decode === 'function') _0x01ec.decode().then(_0x01f2).catch(() => {});
        }
        requestAnimationFrame(() => requestAnimationFrame(() => {
            if (_0x01f1) _0x01f0();
            else if (_0x01eb) _0x01e5.scrollTop = Math.max(0, Math.min(Number(_0x01eb.top || 0), Math.max(0, _0x01e5.scrollHeight - _0x01e5.clientHeight)));
            _0x01ef = false;
            _0x01e8();
        }));
    }
    function _0x0120''',
    'persistent scroll implementation',
)

ui_functions = r'''
    function _0x024d() {
        const _0x024e = _0x000f('notificationDot');
        if (_0x024e) _0x024e.hidden = !(Number(_0x0003.data.unreadNotificationCount) > 0);
    }
    function _0x024f(_0x0266) {
        _0x017d('방 추천', `<div class="field"><label>추천을 보낼 사용자 이름</label><input id="recommendTargetName" maxlength="24" autocomplete="off" placeholder="사용자 이름"></div><p style="margin:0;color:#7b8594;font-size:9px;line-height:1.55">현재 연결 중인 같은 이름의 사용자에게 ${_0x0005(_0x0266.name)} 방 추천 알림을 보냅니다.</p>`, async () => {
            const _0x0267 = String(_0x000f('recommendTargetName')?.value || '').trim();
            if (!_0x0267) throw new Error('사용자 이름을 입력하세요.');
            await _0x0019('RECOMMEND_ROOM', { code: _0x0266.code, targetName: _0x0267 }, 15000);
            _0x01ba(`${_0x0267}님에게 방 추천을 보냈습니다.`);
        });
    }
    function _0x0268() {
        const _0x0269 = Array.isArray(_0x0003.data.notifications) ? [..._0x0003.data.notifications].sort((_0x026a, _0x026b) => Number(_0x026b.at || 0) - Number(_0x026a.at || 0)) : [];
        const _0x026c = _0x0269.length ? `<div class="notification-list">${_0x0269.map((_0x026d) => `<div class="notification-item"><b>${_0x0005(_0x026d.fromName || '사용자')}님이 ${_0x0005(_0x026d.roomName || '채팅방')} 방에 참가하길 추천합니다</b><small>#${_0x0005(_0x026d.roomCode || '')} · ${_0x0008(_0x026d.at)}</small></div>`).join('')}</div>` : '<div style="padding:18px 4px;text-align:center;color:#87919f;font-size:10px">알림이 없습니다.</div>';
        _0x017d('알림', _0x026c, async () => {});
        _0x000f('modalCancel').hidden = true;
        _0x000f('modalConfirm').textContent = '닫기';
        _0x0019('MARK_NOTIFICATIONS_READ', {}, 10000).catch(() => {});
        _0x0003.data.unreadNotificationCount = 0;
        _0x024d();
    }
'''
s = replace_once(s, "    function _0x0099() {", ui_functions + "\n    function _0x0099() {", 'notification UI functions')

# Bell click and scroll-state load/pagehide persistence
s = replace_once(
    s,
    "    window.addEventListener('pagehide', () => _0x021d(), true);",
    "    window.addEventListener('pagehide', () => { _0x01e0(); _0x0250(); _0x0252(true); _0x021d(); }, true);",
    'pagehide scroll save',
)

s = replace_once(
    s,
    "    _0x0036();\n    _0x017a();",
    "    _0x0036();\n    _0x025b();\n    _0x017a();",
    'load persisted scroll',
)

s = replace_once(
    s,
    "    _0x000f('closePanel').addEventListener('click', () => _0x007a(false));",
    "    _0x000f('closePanel').addEventListener('click', () => _0x007a(false));\n    _0x000f('notificationBell').addEventListener('click', _0x0268);",
    'bell click',
)

p.write_text(s, encoding='utf-8')

print('buildId', build['buildId'])
