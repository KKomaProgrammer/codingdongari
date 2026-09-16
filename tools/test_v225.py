from pathlib import Path
import json, re, sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else '/tmp/pkg')
manifest = json.loads((root / 'manifest.json').read_text())
build = json.loads((root / 'build-info.json').read_text())
bg = (root / 'background.js').read_text()
chat = (root / 'content/chat.js').read_text()

assert manifest['version'] == '2.2.5', manifest['version']
assert build['version'] == '2.2.5' and build.get('buildId')
assert 'CHANGELOG-v2.2.5.md' in build.get('managedFiles', [])

# Room membership must survive disconnects; only explicit bye/leave removes a member.
assert 'members: [..._0x0085.users.values()]' in bg
assert 'online: false' in bg
assert 'online: true' in bg
assert '상대방이 현재 접속 중이지 않습니다.' in bg
assert re.search(r"lastSeen\s*<\s*_0x016e[^{}]*\{[^{}]*\.online\s*=\s*false", bg, re.S), 'stale user must become offline'
assert not re.search(r"lastSeen\s*<\s*_0x016e[^{}]*\{[^{}]*users\.delete", bg, re.S), 'stale user must not be deleted'

# Room recommendation notifications.
for marker in [
    'entryChatNotificationsV1',
    'realtime:els-chat-notify-',
    "case 'SEND_ROOM_RECOMMENDATION'",
    "case 'MARK_NOTIFICATIONS_READ'",
    'room-recommendation',
]:
    assert marker in bg, marker
assert 'notificationButton' in chat
assert 'notificationDot' in chat
assert 'notify-unread-dot' in chat
assert 'data-room-tool="recommend"' in chat
assert '방에 참가하길 추천합니다' in chat
assert '<svg' in chat and 'notificationButton' in chat

# Persist scroll for conversations and main navigation through the service worker.
for marker in ["case 'GET_SCROLL_STATE'", "case 'SAVE_SCROLL_STATE'", 'entryChatScrollStateV2']:
    assert marker in bg, marker
for marker in ['GET_SCROLL_STATE', 'SAVE_SCROLL_STATE', 'nav:rooms', 'nav:room:']:
    assert marker in chat, marker
assert 'scrollPositions.set' in chat

print('v2.2.5 feature validation OK')
