from pathlib import Path
import json, uuid, datetime

ROOT = Path('/tmp/pkg')

manifest_path = ROOT / 'manifest.json'
manifest = json.loads(manifest_path.read_text())
manifest['version'] = '2.2.4'
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')

build_path = ROOT / 'build-info.json'
build = json.loads(build_path.read_text())
build['version'] = '2.2.4'
build['buildId'] = str(uuid.uuid4())
build['createdAt'] = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')
if 'CHANGELOG-v2.2.4.md' not in build['managedFiles']:
    build['managedFiles'].append('CHANGELOG-v2.2.4.md')
build_path.write_text(json.dumps(build, ensure_ascii=False, indent=2) + '\n')

(ROOT / 'CHANGELOG-v2.2.4.md').write_text('''# Entry Live Studio v2.2.4\n\n- 공지 카드를 확장 프로그램 채팅 박스의 정중앙에 표시합니다.\n- 공지 제목은 계속 `공지`로 고정하고, 확인한 동일 공지는 다시 표시하지 않습니다.\n- 원격에서 받은 JavaScript를 실행하는 방식은 Manifest V3 정책상 사용하지 않습니다.\n''')

chat_path = ROOT / 'content/chat.js'
chat = chat_path.read_text()
old = "position:absolute;z-index:80;left:14px;right:14px;top:14px;padding:16px;background:#fff;border:1px solid #dfe5ec;border-radius:16px;box-shadow:0 14px 36px rgba(24,36,52,.18);display:grid;gap:11px"
new = "position:absolute;z-index:80;left:50%;top:50%;transform:translate(-50%,-50%);width:min(360px,calc(100% - 28px));max-height:calc(100% - 28px);overflow:auto;padding:16px;background:#fff;border:1px solid #dfe5ec;border-radius:16px;box-shadow:0 14px 36px rgba(24,36,52,.18);display:grid;gap:11px"
if old not in chat:
    raise SystemExit('notice card style not found')
chat = chat.replace(old, new, 1)
chat_path.write_text(chat)

print('buildId', build['buildId'])
