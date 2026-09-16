from pathlib import Path
import json, re, sys
r=Path(sys.argv[1] if len(sys.argv)>1 else '/tmp/pkg')
m=json.loads((r/'manifest.json').read_text()); b=json.loads((r/'build-info.json').read_text())
bg=(r/'background.js').read_text(); chat=(r/'content/chat.js').read_text()
assert m['version']=='2.2.6' and b['version']=='2.2.6' and b.get('buildId')
assert 'realtime:els-chat-notify-name-' in bg and 'crypto.subtle.digest' in bg
assert 'membersComplete: Boolean(_0x013c.isLeader)' in bg
assert 'new Set((_0x014c.users || []).map' in bg
assert '같은 채팅방에서 한 번 이상 확인된 사용자만 추천할 수 있습니다.' not in bg
assert re.search(r"lastSeen\s*<\s*_0x016e[^{}]*\{[^{}]*\.online\s*=\s*false", bg, re.S)
for x in ['entryChatNotificationsV1',"case 'SEND_ROOM_RECOMMENDATION'",'entryChatScrollStateV2',"case 'GET_SCROLL_STATE'","case 'SAVE_SCROLL_STATE'",'DELETE_MESSAGE','MARK_READ','OPEN_UPDATER']:
    assert x in bg, x
for x in ['notificationButton','notify-unread-dot','data-room-tool="recommend"','방에 참가하길 추천합니다','nav:rooms','nav:room:','scrollToBottom','read-count','data-delete-message']:
    assert x in chat, x
print('v2.2.6 validation OK')
