from pathlib import Path
import json, re, uuid, datetime

ROOT = Path('/tmp/pkg')


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'missing pattern: {label}')
    return text.replace(old, new, 1)


def replace_regex(text, pattern, replacement, label):
    out, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f'missing regex pattern: {label} ({count})')
    return out


# Version metadata
manifest_path = ROOT / 'manifest.json'
manifest = json.loads(manifest_path.read_text())
manifest['version'] = '2.2.5'
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')

build_path = ROOT / 'build-info.json'
build = json.loads(build_path.read_text())
build['version'] = '2.2.5'
build['buildId'] = str(uuid.uuid4())
build['createdAt'] = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')
if 'CHANGELOG-v2.2.5.md' not in build['managedFiles']:
    build['managedFiles'].append('CHANGELOG-v2.2.5.md')
build_path.write_text(json.dumps(build, ensure_ascii=False, indent=2) + '\n')

(ROOT / 'CHANGELOG-v2.2.5.md').write_text('''# Entry Live Studio v2.2.5\n\n- 방 멤버십과 접속 상태를 분리했습니다. 일정 시간 연결이 없으면 `접속 중이지 않음`으로 바뀌며, 명시적으로 `방 나가기`를 한 경우에만 방 멤버 목록에서 제거됩니다.\n- 방 멤버 목록을 로컬에 보존하여 재연결/브라우저 재시작 뒤에도 오프라인 멤버를 방을 나간 사용자로 오인하지 않습니다.\n- 방 상세 화면에서 이름으로 `방 추천`을 보낼 수 있습니다. 같은 이름의 사용자가 여러 명이면 현재 접속 중이며 해당 방에 아직 참가하지 않은 사용자에게 전송합니다.\n- 모든 채팅 박스 페이지의 우측 상단에 SVG 알림(종) 아이콘을 추가했습니다. 새 추천이 오면 점이 표시되고, 알림에는 `보낸사용자님이 방이름 방에 참가하길 추천합니다` 형식으로 실제 이름과 방 이름이 표시됩니다.\n- 채팅 및 메인/방 상세 화면 스크롤 위치를 서비스 워커의 `chrome.storage.session`에 저장하여 패널을 닫았다 다시 열거나 콘텐츠 스크립트가 복원되어도 위치를 유지합니다. 처음 여는 채팅은 기존처럼 최신 메시지(맨 아래)에서 시작합니다.\n''')

# ---------------- background.js ----------------
p = ROOT / 'background.js'
s = p.read_text()

s = replace_once(s,
    "const _0x001a = 'realtime:els-chat-dm-';",
    "const _0x001a = 'realtime:els-chat-dm-';\nconst _0x0300 = 'realtime:els-chat-notify-';\nconst _0x0301 = 'entryChatNotificationsV1';\nconst _0x0302 = 'entryChatScrollStateV2';\nlet _0x0303 = [];",
    'background globals')

s = replace_once(s,
    "            'entryChatShortcutIntroSeenV1',\n        ]);",
    "            'entryChatShortcutIntroSeenV1',\n            'entryChatNotificationsV1',\n        ]);",
    'notification storage key')

s = replace_once(s,
    "        _0x0221 = Boolean(_0x004e.entryChatShortcutIntroSeenV1);",
    "        _0x0221 = Boolean(_0x004e.entryChatShortcutIntroSeenV1);\n        _0x0303 = (Array.isArray(_0x004e[_0x0301]) ? _0x004e[_0x0301] : []).map((_0x0304) => ({\n            id: String(_0x0304?.id || ''),\n            type: 'room-recommendation',\n            senderId: String(_0x0304?.senderId || ''),\n            senderName: _0x0031(_0x0304?.senderName || '사용자'),\n            roomCode: String(_0x0304?.roomCode || ''),\n            roomName: _0x0034(_0x0304?.roomName || '채팅방'),\n            at: Number(_0x0304?.at) || 0,\n            read: Boolean(_0x0304?.read),\n        })).filter((_0x0305) => _0x0305.id && _0x0305.senderId && _0x0044(_0x0305.roomCode)).slice(-80);",
    'notification restore')

s = replace_once(s,
    "                isLeader: Boolean(_0x005d.isLeader),\n                status: 'locked',",
    "                isLeader: Boolean(_0x005d.isLeader),\n                members: Array.isArray(_0x005d.members) ? _0x005d.members : [],\n                status: 'locked',",
    'member restore')

s = replace_regex(s,
    r"function _0x0079\(\{ code: _0x007a, name: _0x007b, leaderId: _0x007c, leaderName: _0x007d, isLeader: _0x007e, status: _0x007f = 'connecting' \}\) \{.*?\n\}\nfunction _0x0081",
    r'''function _0x0079({ code: _0x007a, name: _0x007b, leaderId: _0x007c, leaderName: _0x007d, isLeader: _0x007e, status: _0x007f = 'connecting', members: _0x0306 = [] }) {
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
    for (const _0x0307 of Array.isArray(_0x0306) ? _0x0306 : []) {
        const _0x0308 = String(_0x0307?.id || '');
        if (!_0x0308 || _0x0308 === _0x0004.id)
            continue;
        let _0x0309 = '';
        try { _0x0309 = _0x0040(_0x0307?.avatarDataUrl || '', _0x0024); } catch (_) { }
        _0x0080.users.set(_0x0308, {
            id: _0x0308,
            name: _0x0031(_0x0307?.name || '사용자'),
            isLeader: Boolean(_0x0307?.isLeader || _0x0308 === _0x0080.leaderId),
            lastSeen: 0,
            self: false,
            avatarDataUrl: _0x0309,
            online: false,
        });
    }
    _0x0080.users.set(_0x0004.id, _0x0081(_0x0080));
    return _0x0080;
}
function _0x0081''',
    'room constructor')

s = replace_once(s,
    "        avatarDataUrl: _0x0004.avatarDataUrl || '',\n    };",
    "        avatarDataUrl: _0x0004.avatarDataUrl || '',\n        online: true,\n    };",
    'self online')

s = replace_once(s,
    "        isLeader: _0x0085.isLeader,\n    }));",
    "        isLeader: _0x0085.isLeader,\n        members: [..._0x0085.users.values()].map((_0x030a) => ({ id: _0x030a.id, name: _0x030a.name, avatarDataUrl: _0x030a.avatarDataUrl || '', isLeader: Boolean(_0x030a.isLeader) })).filter((_0x030b) => _0x030b.id),\n    }));",
    'persist members')

s = replace_once(s,
    "    await _0x0005.connect();",
    "    await _0x0005.connect();\n    try { await _0x0005.ensureChannel(`${_0x0300}${_0x0004.id}`); } catch (_) { }",
    'own notification channel')

s = replace_once(s,
    "        _0x008c.users.clear();\n        _0x008c.users.set(_0x0004.id, _0x0081(_0x008c));",
    "        for (const _0x030c of _0x008c.users.values())\n            if (_0x030c.id !== _0x0004.id)\n                _0x030c.online = false;\n        const _0x030d = _0x008c.users.get(_0x0004.id) || _0x0081(_0x008c);\n        _0x030d.online = true;\n        _0x030d.lastSeen = _0x002f();\n        _0x008c.users.set(_0x0004.id, _0x030d);",
    'reconnect membership preservation')

s = replace_once(s,
    "        users: [..._0x013c.users.values()].map((_0x013e) => ({ id: _0x013e.id, name: _0x013e.name, avatarDataUrl: _0x013e.avatarDataUrl || '', isLeader: _0x013e.isLeader })),",
    "        users: [..._0x013c.users.values()].map((_0x013e) => ({ id: _0x013e.id, name: _0x013e.name, avatarDataUrl: _0x013e.avatarDataUrl || '', isLeader: _0x013e.isLeader, online: Boolean(_0x013e.self || (_0x013e.online !== false && _0x002f() - Number(_0x013e.lastSeen || 0) <= _0x001b)) })),",
    'room meta online')

s = replace_regex(s,
    r"function _0x0143\(_0x0144, _0x0145\) \{.*?\n\}\nfunction _0x0149",
    r'''function _0x0143(_0x0144, _0x0145) {
    if (!_0x0145?.id)
        return;
    const _0x0146 = _0x0144.users.get(_0x0145.id) || {};
    const _0x030e = _0x0145.id === _0x0004.id || _0x0145.online !== false;
    const _0x0147 = {
        id: _0x0145.id,
        name: _0x0031(_0x0145.name || _0x0146.name || '사용자'),
        isLeader: Boolean(_0x0145.isLeader || _0x0145.id === _0x0144.leaderId),
        lastSeen: _0x030e ? _0x002f() : Number(_0x0146.lastSeen || 0),
        self: _0x0145.id === _0x0004.id,
        avatarDataUrl: (() => { try {
            return _0x0040(_0x0145.avatarDataUrl || _0x0146.avatarDataUrl || '', _0x0024);
        }
        catch (_0x0148) {
            return _0x0146.avatarDataUrl || '';
        } })(),
        online: _0x030e,
    };
    _0x0144.users.set(_0x0147.id, _0x0147);
    if (_0x0147.id !== _0x0004.id && _0x0147.online)
        _0x013f(_0x0144, _0x0147.id);
}
function _0x0149''',
    'member merge')

# Notification helpers and persistent scroll helpers in service worker.
helpers = r'''
function _0x030f(_0x0310) {
    const _0x0311 = String(_0x0310 || '');
    return _0x0311.startsWith(_0x0300) ? _0x0311.slice(_0x0300.length) : '';
}
async function _0x0312() {
    await chrome.storage.local.set({ [_0x0301]: _0x0303.slice(-80) });
}
async function _0x0313(_0x0314) {
    if (!_0x0314 || String(_0x0314.targetId || '') !== _0x0004.id || !_0x0044(_0x0314.roomCode))
        return false;
    const _0x0315 = String(_0x0314.id || '');
    if (!_0x0315 || _0x0303.some((_0x0316) => _0x0316.id === _0x0315))
        return false;
    _0x0303.push({
        id: _0x0315,
        type: 'room-recommendation',
        senderId: String(_0x0314.senderId || ''),
        senderName: _0x0031(_0x0314.senderName || '사용자'),
        roomCode: String(_0x0314.roomCode),
        roomName: _0x0034(_0x0314.roomName || `방 ${_0x0314.roomCode}`),
        at: Number(_0x0314.at) || _0x002f(),
        read: false,
    });
    if (_0x0303.length > 80) _0x0303.splice(0, _0x0303.length - 80);
    await _0x0312();
    _0x017e();
    return true;
}
async function _0x0317({ code: _0x0318, targetName: _0x0319 }) {
    _0x0165();
    const _0x031a = _0x0002.get(String(_0x0318 || ''));
    if (!_0x031a)
        throw new Error('채팅방을 찾을 수 없습니다.');
    const _0x031b = _0x0031(_0x0319 || '', '');
    if (!_0x031b)
        throw new Error('추천을 받을 사용자 이름을 입력하세요.');
    const _0x031c = new Map();
    for (const _0x031d of _0x0002.values()) {
        for (const _0x031e of _0x031d.users.values()) {
            if (_0x031e.id === _0x0004.id || _0x031e.name !== _0x031b)
                continue;
            const _0x031f = Boolean(_0x031e.online !== false && _0x002f() - Number(_0x031e.lastSeen || 0) <= _0x001b);
            const _0x0320 = _0x031c.get(_0x031e.id);
            if (!_0x0320 || (_0x031f && !_0x0320.online))
                _0x031c.set(_0x031e.id, { id: _0x031e.id, name: _0x031e.name, online: _0x031f });
        }
    }
    if (!_0x031c.size)
        throw new Error('해당 이름의 사용자를 찾을 수 없습니다. 같은 채팅방에서 한 번 이상 확인된 사용자만 추천할 수 있습니다.');
    const _0x0321 = [..._0x031c.values()].filter((_0x0322) => _0x0322.online && !_0x031a.users.has(_0x0322.id));
    if (!_0x0321.length) {
        if ([..._0x031c.values()].some((_0x0323) => !_0x0323.online))
            throw new Error('해당 사용자는 현재 접속 중이지 않습니다. 접속 중일 때 방 추천을 보낼 수 있습니다.');
        throw new Error('해당 사용자는 이미 이 방에 참가 중입니다.');
    }
    let _0x0324 = 0;
    for (const _0x0325 of _0x0321) {
        const _0x0326 = `${_0x0300}${_0x0325.id}`;
        const _0x0327 = {
            id: _0x0030(),
            type: 'room-recommendation',
            senderId: _0x0004.id,
            senderName: _0x0004.name,
            targetId: _0x0325.id,
            targetName: _0x0325.name,
            roomCode: _0x031a.code,
            roomName: _0x031a.name,
            at: _0x002f(),
        };
        try {
            await _0x0005.ensureChannel(_0x0326);
            await _0x0005.send(_0x0326, 'room-recommendation', _0x0327);
            _0x0324 += 1;
        }
        finally {
            try { _0x0005.leave(_0x0326); } catch (_) { }
        }
    }
    return { sent: _0x0324, name: _0x031b };
}
async function _0x0328() {
    let _0x0329 = false;
    for (const _0x032a of _0x0303) {
        if (!_0x032a.read) {
            _0x032a.read = true;
            _0x0329 = true;
        }
    }
    if (_0x0329) await _0x0312();
    _0x017e();
    return true;
}
async function _0x032b() {
    const _0x032c = await chrome.storage.session.get(_0x0302);
    const _0x032d = _0x032c?.[_0x0302];
    return _0x032d && typeof _0x032d === 'object' ? _0x032d : {};
}
async function _0x032e({ positions: _0x032f }) {
    const _0x0330 = {};
    const _0x0331 = Object.entries(_0x032f && typeof _0x032f === 'object' ? _0x032f : {}).slice(-120);
    for (const [_0x0332, _0x0333] of _0x0331) {
        const _0x0334 = String(_0x0332 || '').slice(0, 180);
        if (!_0x0334 || !_0x0333 || typeof _0x0333 !== 'object') continue;
        _0x0330[_0x0334] = {
            top: Math.max(0, Math.min(10000000, Number(_0x0333.top) || 0)),
            atBottom: Boolean(_0x0333.atBottom),
            nav: Boolean(_0x0333.nav),
            at: _0x002f(),
        };
    }
    await chrome.storage.session.set({ [_0x0302]: _0x0330 });
    return true;
}
'''
s = replace_once(s, 'function _0x0149(_0x014a, _0x014b, _0x014c) {', helpers + '\nfunction _0x0149(_0x014a, _0x014b, _0x014c) {', 'notification helpers')

s = replace_once(s,
    "function _0x0149(_0x014a, _0x014b, _0x014c) {\n    const _0x014d = _0x015f(_0x014a);",
    "function _0x0149(_0x014a, _0x014b, _0x014c) {\n    const _0x0335 = _0x030f(_0x014a);\n    if (_0x0335) {\n        if (_0x0335 === _0x0004.id && _0x014b === 'room-recommendation')\n            _0x0313(_0x014c).catch(() => { });\n        return;\n    }\n    const _0x014d = _0x015f(_0x014a);",
    'notification broadcast')

s = replace_once(s,
    "    if (_0x014b === 'bye') {\n        if (_0x014c?.userId && _0x014c.userId !== _0x0004.id)\n            _0x014f.users.delete(_0x014c.userId);\n        _0x017e();",
    "    if (_0x014b === 'bye') {\n        if (_0x014c?.userId && _0x014c.userId !== _0x0004.id) {\n            _0x014f.users.delete(_0x014c.userId);\n            _0x0083().catch(() => { });\n        }\n        _0x017e();",
    'explicit leave persistence')

s = replace_once(s,
    "    const _0x0157 = _0x0155.users.get(_0x0154.from);\n    if (_0x0157)\n        _0x0157.lastSeen = _0x002f();",
    "    const _0x0157 = _0x0155.users.get(_0x0154.from);\n    if (_0x0157) {\n        _0x0157.lastSeen = _0x002f();\n        _0x0157.online = true;\n    }",
    'message marks online')

s = replace_once(s,
    "        if (!_0x00dc)\n            throw new Error('상대방이 현재 방에 연결되어 있지 않습니다.');",
    "        if (!_0x00dc)\n            throw new Error('상대방이 이 방을 나갔습니다.');\n        if (_0x00dc.online === false || _0x002f() - Number(_0x00dc.lastSeen || 0) > _0x001b)\n            throw new Error('상대방이 현재 접속 중이지 않습니다.');",
    'dm offline distinction')

s = replace_once(s,
    "                if (_0x0171 !== _0x0004.id && _0x0172.lastSeen < _0x016e) {\n                    _0x0170.users.delete(_0x0171);\n                    _0x016f = true;\n                }",
    "                if (_0x0171 !== _0x0004.id && _0x0172.lastSeen < _0x016e && _0x0172.online !== false) {\n                    _0x0172.online = false;\n                    _0x016f = true;\n                }",
    'stale user offline')

s = replace_once(s,
    "            _0x0173.avatarDataUrl = _0x0004.avatarDataUrl || '';\n            _0x0170.users.set(_0x0004.id, _0x0173);",
    "            _0x0173.avatarDataUrl = _0x0004.avatarDataUrl || '';\n            _0x0173.online = true;\n            _0x0170.users.set(_0x0004.id, _0x0173);",
    'self heartbeat online')

s = replace_once(s,
    "            .map((_0x0177) => ({ id: _0x0177.id, name: _0x0177.name, avatarDataUrl: _0x0177.avatarDataUrl || '', isLeader: Boolean(_0x0177.isLeader), self: Boolean(_0x0177.self), lastSeen: _0x0177.lastSeen }))",
    "            .map((_0x0177) => ({ id: _0x0177.id, name: _0x0177.name, avatarDataUrl: _0x0177.avatarDataUrl || '', isLeader: Boolean(_0x0177.isLeader), self: Boolean(_0x0177.self), lastSeen: _0x0177.lastSeen, online: Boolean(_0x0177.self || (_0x0177.online !== false && _0x002f() - Number(_0x0177.lastSeen || 0) <= _0x001b)) }))",
    'snapshot online')

s = replace_once(s,
    "        backupHealth: { ..._0x0015 },",
    "        backupHealth: { ..._0x0015 },\n        notifications: _0x0303.slice(-50).map((_0x0336) => ({ ..._0x0336 })),\n        notificationUnread: _0x0303.filter((_0x0337) => !_0x0337.read).length,",
    'notification state')

# Preserve membership in automatic/export backups too.
s = replace_once(s,
    "        isLeader: _0x0167.isLeader,\n    }));",
    "        isLeader: _0x0167.isLeader,\n        members: [..._0x0167.users.values()].map((_0x0338) => ({ id: _0x0338.id, name: _0x0338.name, avatarDataUrl: _0x0338.avatarDataUrl || '', isLeader: Boolean(_0x0338.isLeader) })),\n    }));",
    'automatic backup members')

s = replace_once(s,
    "        case 'MARK_READ': return _0x01d0(_0x01b4);",
    "        case 'MARK_READ': return _0x01d0(_0x01b4);\n        case 'SEND_ROOM_RECOMMENDATION': return _0x0317(_0x01b4);\n        case 'MARK_NOTIFICATIONS_READ': return _0x0328();\n        case 'GET_SCROLL_STATE': return _0x032b();\n        case 'SAVE_SCROLL_STATE': return _0x032e(_0x01b4);",
    'new commands')

p.write_text(s)

# ---------------- content/chat.js ----------------
p = ROOT / 'content/chat.js'
chat = p.read_text()

chat = replace_once(chat,
    "        noticeShownKey: '',\n    };",
    "        noticeShownKey: '',\n        scrollSaveTimer: null,\n        scrollLoadPromise: null,\n    };",
    'content scroll state')

extra_css = r'''
    .notifybtn{position:relative;display:grid;place-items:center}.notifybtn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}.notify-unread-dot{position:absolute;right:4px;top:4px;width:8px;height:8px;border-radius:50%;background:#e83f59;border:2px solid #f9dc4b}.notification-list{display:grid;gap:8px;max-height:330px;overflow:auto}.notification-item{padding:11px 12px;border:1px solid #e0e5eb;border-radius:12px;background:#f8fafc;color:#4b5666;font-size:10px;line-height:1.6}.notification-item.unread{background:#fffbea;border-color:#ead46b}.notification-item small{display:block;margin-top:4px;color:#929baa;font-size:8px}.member-presence{width:8px;height:8px;flex:0 0 auto;border-radius:50%;background:#2bc07c;box-shadow:0 0 0 2px #fff}.member-presence.offline{background:#aeb6c2}.room-recommend-note{margin:0 0 10px;color:#707b8b;font-size:10px;line-height:1.55}
'''
chat = replace_once(chat, '  </style>', extra_css + '  </style>', 'notification css')

old_top = '<div class="topright"><span class="status"><i class="dot" id="statusDot"></i><span id="statusText">연결 필요</span></span><button class="iconbtn" id="closePanel" aria-label="닫기">×</button></div>'
new_top = '<div class="topright"><span class="status"><i class="dot" id="statusDot"></i><span id="statusText">연결 필요</span></span><button class="iconbtn notifybtn" id="notificationButton" type="button" aria-label="알림" title="알림"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path></svg><i class="notify-unread-dot" id="notificationDot" hidden></i></button><button class="iconbtn" id="closePanel" aria-label="닫기">×</button></div>'
chat = replace_once(chat, old_top, new_top, 'notification bell')

chat = replace_once(chat,
    "    _0x000f('closePanel').addEventListener('click', () => _0x007a(false));",
    "    _0x000f('closePanel').addEventListener('click', () => { _0x01e0(); _0x0342(); _0x0340(true); _0x007a(false); });\n    _0x000f('notificationButton').addEventListener('click', () => _0x0339());",
    'notification click')

chat = replace_once(chat,
    "    window.addEventListener('pagehide', () => _0x021d(), true);",
    "    window.addEventListener('pagehide', () => { _0x01e0(); _0x0342(); _0x0340(true); _0x021d(); }, true);",
    'pagehide scroll save')

chat = replace_once(chat,
    "        _0x00a3.textContent = _0x00a2 > 99 ? '99+' : String(_0x00a2);\n    }",
    "        _0x00a3.textContent = _0x00a2 > 99 ? '99+' : String(_0x00a2);\n        const _0x0338 = _0x000f('notificationDot');\n        if (_0x0338) _0x0338.hidden = !(Number(_0x0003.data.notificationUnread) > 0);\n    }",
    'notification dot')

ui_helpers = r'''
    function _0x0339() {
        const _0x033a = Array.isArray(_0x0003.data.notifications) ? [..._0x0003.data.notifications].reverse() : [];
        const _0x033b = _0x033a.length ? `<div class="notification-list">${_0x033a.map((_0x033c) => `<div class="notification-item ${_0x033c.read ? '' : 'unread'}"><div><b>${_0x0005(_0x033c.senderName || '사용자')}</b>님이 <b>${_0x0005(_0x033c.roomName || '채팅방')}</b> 방에 참가하길 추천합니다</div><small>#${_0x0005(_0x033c.roomCode || '')} · ${_0x0008(_0x033c.at)}</small></div>`).join('')}</div>` : '<div class="notification-item">알림이 없습니다.</div>';
        for (const _0x033d of _0x033a) _0x033d.read = true;
        _0x0003.data.notificationUnread = 0;
        _0x00a1();
        _0x0019('MARK_NOTIFICATIONS_READ', {}, 10000).catch(() => { });
        _0x017d('알림', _0x033b, async () => {});
        _0x000f('modalCancel').hidden = true;
        _0x000f('modalConfirm').textContent = '확인';
    }
    function _0x033e(_0x033f) {
        _0x017d('방 추천', `<p class="room-recommend-note">추천을 받을 사용자의 이름을 정확히 입력하세요. 현재 접속 중이며 이 방에 아직 참가하지 않은 사용자에게 추천 알림을 보냅니다.</p><div class="field"><label>사용자 이름</label><input id="recommendUserName" maxlength="24" autocomplete="off" placeholder="사용자 이름"></div>`, async () => {
            const _0x0340 = String(_0x000f('recommendUserName')?.value || '').trim();
            if (!_0x0340) throw new Error('사용자 이름을 입력하세요.');
            const _0x0341 = await _0x0019('SEND_ROOM_RECOMMENDATION', { code: _0x033f.code, targetName: _0x0340 }, 20000);
            _0x01ba(`${_0x0340}님에게 ${_0x033f.name} 방 추천을 보냈습니다.`);
            return _0x0341;
        });
    }
    function _0x033f() {
        if (_0x0003.scrollLoadPromise) return _0x0003.scrollLoadPromise;
        _0x0003.scrollLoadPromise = _0x0019('GET_SCROLL_STATE', {}, 10000).then((_0x0340) => {
            if (_0x0340 && typeof _0x0340 === 'object') {
                for (const [_0x0341, _0x0342] of Object.entries(_0x0340)) {
                    if (!_0x0003.scrollPositions.has(_0x0341) && _0x0342 && typeof _0x0342 === 'object')
                        _0x0003.scrollPositions.set(_0x0341, { top: Number(_0x0342.top) || 0, atBottom: Boolean(_0x0342.atBottom), nav: Boolean(_0x0342.nav) });
                }
            }
            return true;
        }).catch(() => false);
        return _0x0003.scrollLoadPromise;
    }
    function _0x0340(_0x0341 = false) {
        const _0x0342 = () => {
            _0x0003.scrollSaveTimer = null;
            const _0x0343 = {};
            for (const [_0x0344, _0x0345] of [..._0x0003.scrollPositions].slice(-120))
                _0x0343[_0x0344] = { top: Math.max(0, Number(_0x0345?.top) || 0), atBottom: Boolean(_0x0345?.atBottom), nav: Boolean(_0x0345?.nav) };
            _0x0019('SAVE_SCROLL_STATE', { positions: _0x0343 }, 10000).catch(() => { });
        };
        clearTimeout(_0x0003.scrollSaveTimer);
        if (_0x0341) _0x0342();
        else _0x0003.scrollSaveTimer = setTimeout(_0x0342, 280);
    }
    function _0x0341(_0x0342, _0x0343) {
        if (!_0x0342 || !_0x0343) return;
        _0x0342.dataset.navScrollKey = _0x0343;
        const _0x0344 = () => {
            _0x0003.scrollPositions.set(_0x0343, { top: _0x0342.scrollTop, atBottom: false, nav: true });
            _0x0340();
        };
        _0x0342.addEventListener('scroll', _0x0344, { passive: true });
        _0x033f().finally(() => requestAnimationFrame(() => {
            const _0x0345 = _0x0003.scrollPositions.get(_0x0343);
            if (_0x0345) _0x0342.scrollTop = Math.max(0, Math.min(Number(_0x0345.top || 0), Math.max(0, _0x0342.scrollHeight - _0x0342.clientHeight)));
        }));
    }
    function _0x0342() {
        const _0x0343 = _0x0002.querySelector('[data-nav-scroll-key]');
        const _0x0344 = String(_0x0343?.dataset?.navScrollKey || '');
        if (!_0x0343 || !_0x0344) return;
        _0x0003.scrollPositions.set(_0x0344, { top: _0x0343.scrollTop, atBottom: false, nav: true });
        _0x0340();
    }
'''
chat = replace_once(chat, '    function _0x0099() {', ui_helpers + '    function _0x0099() {', 'ui helpers')

chat = replace_once(chat,
    "    function _0x00ad(_0x00ae = null) {\n        _0x01e0();\n        if (_0x0003.view === 'rooms' || _0x0003.view === 'room')\n            _0x0003.activeScrollKey = null;",
    "    function _0x00ad(_0x00ae = null) {\n        _0x01e0();\n        _0x0342();",
    'render scroll capture')

# Home stats: only online members count as currently connected.
chat = replace_once(chat,
    "        const _0x00c6 = _0x00c5.reduce((_0x00c7, _0x00c8) => _0x00c7 + (_0x00c8.users || []).length, 0);",
    "        const _0x00c6 = _0x00c5.reduce((_0x00c7, _0x00c8) => _0x00c7 + (_0x00c8.users || []).filter((_0x0346) => _0x0346.online).length, 0);",
    'online home count')

chat = replace_once(chat,
    "        _0x000f('roomList')?.addEventListener('click', (_0x00ca) => {\n            const _0x00cb = _0x00ca.target.closest('[data-open-room]');\n            if (!_0x00cb)\n                return;\n            _0x00cf(_0x00cb.dataset.openRoom);\n        });\n    }",
    "        _0x000f('roomList')?.addEventListener('click', (_0x00ca) => {\n            const _0x00cb = _0x00ca.target.closest('[data-open-room]');\n            if (!_0x00cb)\n                return;\n            _0x00cf(_0x00cb.dataset.openRoom);\n        });\n        _0x0341(_0x00c2.querySelector('.navbody'), 'nav:rooms');\n    }",
    'rooms nav scroll')

chat = replace_regex(chat,
    r"    function _0x00cc\(_0x00cd\) \{.*?\n    \}\n    function _0x00cf",
    r'''    function _0x00cc(_0x00cd) {
        const _0x00ce = _0x0159(_0x00cd.code);
        const _0x0347 = (_0x00cd.users || []).filter((_0x0348) => _0x0348.online).length;
        return `<button class="room-card" data-open-room="${_0x0005(_0x00cd.code)}"><span class="roomicon">${_0x0005(_0x00cd.code)}</span><span class="roomcopy"><b>${_0x0005(_0x00cd.name)} ${_0x00cd.isLeader ? '<span class="role">대표</span>' : ''}</b><small>#${_0x0005(_0x00cd.code)} · ${(_0x00cd.users || []).length}명 참가 · ${_0x0347}명 접속</small></span>${_0x00ce ? `<span class="treebadge">${_0x00ce > 99 ? '99+' : _0x00ce}</span>` : ''}<span class="room-enter">들어가기 ›</span></button>`;
    }
    function _0x00cf''',
    'room card counts')

chat = replace_once(chat,
    "<div class=\"room-detail-actions\">${_0x00d3.isLeader ? '<button data-room-tool=\"rename\">방 이름 수정</button>' : ''}<button class=\"danger\" data-room-tool=\"leave\">방 나가기</button></div>",
    "<div class=\"room-detail-actions\">${_0x00d3.isLeader ? '<button data-room-tool=\"rename\">방 이름 수정</button>' : ''}<button data-room-tool=\"recommend\">방 추천</button><button class=\"danger\" data-room-tool=\"leave\">방 나가기</button></div>",
    'room recommend button')

chat = replace_once(chat,
    "#${_0x0005(_0x00d3.code)} · ${(_0x00d3.users || []).length}명${_0x00d3.isLeader ? ' · 내가 대표' : _0x00d3.leaderName ? ` · 대표 ${_0x0005(_0x00d3.leaderName)}` : ''}",
    "#${_0x0005(_0x00d3.code)} · ${(_0x00d3.users || []).length}명 참가 · ${(_0x00d3.users || []).filter((_0x0349) => _0x0349.online).length}명 접속${_0x00d3.isLeader ? ' · 내가 대표' : _0x00d3.leaderName ? ` · 대표 ${_0x0005(_0x00d3.leaderName)}` : ''}",
    'room detail counts')

chat = replace_once(chat,
    "        _0x00d2.querySelector('[data-room-tool=\"rename\"]')?.addEventListener('click', () => _0x01b6(_0x00d3));\n        _0x00d2.querySelector('[data-room-tool=\"leave\"]')?.addEventListener('click', () => _0x01b8(_0x00d3));",
    "        _0x00d2.querySelector('[data-room-tool=\"rename\"]')?.addEventListener('click', () => _0x01b6(_0x00d3));\n        _0x00d2.querySelector('[data-room-tool=\"recommend\"]')?.addEventListener('click', () => _0x033e(_0x00d3));\n        _0x00d2.querySelector('[data-room-tool=\"leave\"]')?.addEventListener('click', () => _0x01b8(_0x00d3));",
    'room recommend listener')

chat = replace_once(chat,
    "        _0x000f('memberList').addEventListener('click', (_0x00d7) => {\n            const _0x00d8 = _0x00d7.target.closest('[data-open-chat]');\n            if (!_0x00d8 || _0x00d8.disabled)\n                return;\n            _0x00df(_0x00d8.dataset.openChat || null);\n        });\n    }",
    "        _0x000f('memberList').addEventListener('click', (_0x00d7) => {\n            const _0x00d8 = _0x00d7.target.closest('[data-open-chat]');\n            if (!_0x00d8 || _0x00d8.disabled)\n                return;\n            _0x00df(_0x00d8.dataset.openChat || null);\n        });\n        _0x0341(_0x00d2.querySelector('.navbody'), `nav:room:${_0x00d3.code}`);\n    }",
    'room nav scroll')

chat = replace_regex(chat,
    r"    function _0x00d9\(_0x00da, _0x00db, _0x00dc\) \{.*?\n    \}\n    function _0x00df",
    r'''    function _0x00d9(_0x00da, _0x00db, _0x00dc) {
        const _0x00dd = _0x00db.id === _0x00dc;
        const _0x00de = _0x00dd ? 0 : (_0x0003.unread.get(_0x000b(_0x00da.code, _0x00db.id)) || 0);
        const _0x034a = Boolean(_0x00dd || _0x00db.online);
        return `<button class="member-row" data-open-chat="${_0x0005(_0x00db.id)}" ${_0x00dd ? 'disabled' : ''}>${_0x00b0(_0x00db.name, _0x00db.avatarDataUrl || '', 'member-avatar')}<span class="member-copy"><b>${_0x0005(_0x00db.name)} ${_0x00db.isLeader ? '<span class="role">대표</span>' : ''}${_0x00dd ? ' <span class="selftag">나</span>' : ''}</b><small>${_0x00dd ? '내 계정 · 나와의 채팅은 방 목록에서 사용' : _0x034a ? '접속 중 · 개인 채팅' : '접속 중이지 않음 · 개인 채팅'}</small></span>${_0x00de ? `<span class="treebadge">${_0x00de > 99 ? '99+' : _0x00de}</span>` : ''}${_0x00dd ? '' : `<span class="member-presence ${_0x034a ? '' : 'offline'}" title="${_0x034a ? '접속 중' : '접속 중이지 않음'}"></span><span class="member-arrow">›</span>`}</button>`;
    }
    function _0x00df''',
    'member presence UI')

# Persistent scroll helpers replace old in-memory-only functions.
chat = replace_once(chat,
    "        _0x0003.scrollPositions.set(_0x01e2, { top: _0x01e1.scrollTop, atBottom: _0x01e3 <= 36 });\n    }",
    "        _0x0003.scrollPositions.set(_0x01e2, { top: _0x01e1.scrollTop, atBottom: _0x01e3 <= 36, nav: false });\n        _0x0340();\n    }",
    'message scroll persistence')

chat = replace_regex(chat,
    r"    function _0x01e4\(_0x01e5, _0x01e6\) \{.*?\n    \}\n    function _0x0120",
    r'''    function _0x01e4(_0x01e5, _0x01e6) {
        if (!_0x01e5 || !_0x01e6)
            return;
        _0x01e5.dataset.scrollKey = _0x01e6;
        const _0x01e7 = _0x000f('scrollToBottom');
        let _0x01ef = true;
        const _0x01f0 = () => { _0x01e5.scrollTop = _0x01e5.scrollHeight; };
        const _0x01e8 = () => {
            const _0x01e9 = Math.max(0, _0x01e5.scrollHeight - _0x01e5.clientHeight - _0x01e5.scrollTop);
            const _0x01ea = _0x01e9 <= 36;
            if (!_0x01ef) {
                _0x0003.scrollPositions.set(_0x01e6, { top: _0x01e5.scrollTop, atBottom: _0x01ea, nav: false });
                _0x0340();
            }
            if (_0x01e7) _0x01e7.hidden = _0x01ea;
        };
        _0x01e5.addEventListener('scroll', _0x01e8, { passive: true });
        _0x01e7?.addEventListener('click', () => _0x01e5.scrollTo({ top: _0x01e5.scrollHeight, behavior: 'smooth' }));
        _0x033f().finally(() => {
            const _0x01eb = _0x0003.scrollPositions.get(_0x01e6);
            const _0x01f1 = !_0x01eb || _0x01eb.atBottom;
            const _0x034b = () => {
                if (_0x01f1) _0x01f0();
                else _0x01e5.scrollTop = Math.max(0, Math.min(Number(_0x01eb.top || 0), Math.max(0, _0x01e5.scrollHeight - _0x01e5.clientHeight)));
            };
            _0x034b();
            for (const _0x01ec of _0x01e5.querySelectorAll('img')) {
                if (!_0x01ec.complete) _0x01ec.addEventListener('load', () => { _0x034b(); _0x01e8(); }, { once: true });
                else if (typeof _0x01ec.decode === 'function') _0x01ec.decode().then(() => { _0x034b(); _0x01e8(); }).catch(() => {});
            }
            requestAnimationFrame(() => requestAnimationFrame(() => {
                _0x034b();
                _0x01ef = false;
                _0x01e8();
            }));
        });
    }
    function _0x0120''',
    'persistent chat scroll')

p.write_text(chat)

print('v2.2.5 buildId', build['buildId'])
