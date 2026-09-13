from pathlib import Path
import json, uuid, datetime, re

ROOT = Path('/tmp/pkg')

# Version metadata
manifest_path = ROOT / 'manifest.json'
manifest = json.loads(manifest_path.read_text())
manifest['version'] = '2.2.3'
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')

build_path = ROOT / 'build-info.json'
build = json.loads(build_path.read_text())
build['version'] = '2.2.3'
build['buildId'] = str(uuid.uuid4())
build['createdAt'] = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')
if 'CHANGELOG-v2.2.3.md' not in build['managedFiles']:
    build['managedFiles'].append('CHANGELOG-v2.2.3.md')
build_path.write_text(json.dumps(build, ensure_ascii=False, indent=2) + '\n')

(ROOT / 'CHANGELOG-v2.2.3.md').write_text('''# Entry Live Studio v2.2.3\n\n- 공지는 브라우저 전체 모달이 아니라 확장 프로그램 채팅 박스 내부 카드로 표시합니다.\n- 공지 카드의 화면 제목은 항상 `공지`로 표시합니다.\n- 사용자가 `확인`을 누르면 해당 공지 키를 `chrome.storage.local`에 저장하여 같은 공지는 새로고침/재시작 후에도 다시 표시하지 않습니다.\n- `CHAT_NOTICE` 값이 변경되면 새로운 공지로 판단하여 다시 표시합니다.\n''')

chat_path = ROOT / 'content/chat.js'
chat = chat_path.read_text()
pattern = re.compile(r"\n    function _0x0224\(\) \{.*?\n    \}\n    function _0x0099\(\) \{", re.S)
replacement = r'''
    function _0x0224() {
        const notice = _0x0003.data.notice;
        if (!_0x0003.open || !notice?.body || _0x0003.data.mandatoryUpdate)
            return;
        const key = `${notice.title || ''}|${notice.body}`;
        if (_0x000f('entryChatNoticeCard') || _0x0003.noticeShownKey === `pending:${key}`)
            return;
        _0x0003.noticeShownKey = `pending:${key}`;
        chrome.storage.local.get('entryChatNoticeAckV1').then((_0x0231) => {
            if (_0x0231.entryChatNoticeAckV1 === key) {
                _0x0003.noticeShownKey = key;
                return;
            }
            if (!_0x0003.open || _0x0003.data.mandatoryUpdate || _0x0003.data.notice?.body !== notice.body) {
                _0x0003.noticeShownKey = '';
                return;
            }
            const host = _0x0012;
            if (!host || _0x000f('entryChatNoticeCard'))
                return;
            if (!host.style.position)
                host.style.position = 'relative';
            const card = document.createElement('section');
            card.id = 'entryChatNoticeCard';
            card.setAttribute('role', 'dialog');
            card.setAttribute('aria-label', '공지');
            card.style.cssText = 'position:absolute;z-index:80;left:14px;right:14px;top:14px;padding:16px;background:#fff;border:1px solid #dfe5ec;border-radius:16px;box-shadow:0 14px 36px rgba(24,36,52,.18);display:grid;gap:11px';
            card.innerHTML = `<div style="font-size:15px;font-weight:900;color:#263140">공지</div><div style="font-size:12px;line-height:1.65;color:#5f6b7b;white-space:pre-wrap;word-break:break-word">${_0x0005(notice.body)}</div><button id="entryChatNoticeConfirm" type="button" class="primary" style="width:100%">확인</button>`;
            host.appendChild(card);
            _0x0003.noticeShownKey = key;
            _0x000f('entryChatNoticeConfirm').addEventListener('click', async () => {
                const button = _0x000f('entryChatNoticeConfirm');
                if (button)
                    button.disabled = true;
                try {
                    await chrome.storage.local.set({ entryChatNoticeAckV1: key });
                    card.remove();
                }
                catch (error) {
                    if (button)
                        button.disabled = false;
                    _0x01ba(error?.message || String(error), true);
                }
            });
        }).catch(() => {
            _0x0003.noticeShownKey = '';
        });
    }
    function _0x0099() {'''
new_chat, count = pattern.subn(replacement, chat, count=1)
if count != 1:
    raise SystemExit(f'notice function patch failed: {count}')
chat_path.write_text(new_chat)

print('buildId', build['buildId'])
