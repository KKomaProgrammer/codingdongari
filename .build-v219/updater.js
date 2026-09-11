(function () {
    const _0x0001 = chrome.runtime.getManifest();
    const _0x0002 = _0x0001.version;
    const _0x0003 = _0x0001.name;
    const _0x0004 = 'entry-live-studio-updater-v2';
    const _0x0005 = 'handles';
    const _0x0006 = 'extensionSourceDirectory';
    const _0x0007 = 'junwoo-comprehensive-chat-extension';
    const _0x0008 = 'entryChatPendingUpdateV2';
    const _0x0009 = 'entry-live-runtime.json';
    let _0x000a = null;
    let _0x000b = null;
    let _0x000c = null;
    let _0x000d = false;
    const _0x000e = (_0x000f) => document.getElementById(_0x000f);
    const _0x0010 = _0x000e('currentVersion');
    const _0x0011 = _0x000e('latestVersion');
    const _0x0012 = _0x000e('status');
    const _0x0013 = _0x000e('updateNow');
    const _0x0014 = _0x000e('manualDownload');
    const _0x0096 = _0x000e('loadZip');
    const _0x0097 = _0x000e('zipFile');
    _0x0010.textContent = `v${_0x0002}`;

    function _0x0015(_0x0016, _0x0017 = '') {
        _0x0012.textContent = _0x0016;
        _0x0012.className = `status${_0x0017 ? ` ${_0x0017}` : ''}`;
    }
    function _0x0080(_0x0081, _0x0082) {
        const _0x0083 = String(_0x0081 || '').split('.').map(Number);
        const _0x0084 = String(_0x0082 || '').split('.').map(Number);
        if (_0x0083.length !== 3 || _0x0084.length !== 3 || _0x0083.some(Number.isNaN) || _0x0084.some(Number.isNaN)) return 0;
        for (let _0x0085 = 0; _0x0085 < 3; _0x0085 += 1) if (_0x0083[_0x0085] !== _0x0084[_0x0085]) return _0x0083[_0x0085] > _0x0084[_0x0085] ? 1 : -1;
        return 0;
    }
    async function _0x0086(_0x0087) {
        try { return await _0x0032(_0x0087, _0x0009); } catch (_) { return null; }
    }
    function _0x0018(_0x0019, _0x001a = {}) {
        return new Promise((_0x001b, _0x001c) => {
            chrome.runtime.sendMessage({ type: 'ENTRY_CHAT_COMMAND', command: _0x0019, payload: _0x001a }, (_0x001d) => {
                const _0x001e = chrome.runtime.lastError;
                if (_0x001e) return _0x001c(new Error(_0x001e.message));
                if (!_0x001d?.ok) return _0x001c(new Error(_0x001d?.error || '확장 프로그램 명령에 실패했습니다.'));
                _0x001b(_0x001d.result);
            });
        });
    }
    function _0x001f() {
        return new Promise((_0x0020, _0x0021) => {
            const _0x0022 = indexedDB.open(_0x0004, 1);
            _0x0022.onupgradeneeded = () => {
                if (!_0x0022.result.objectStoreNames.contains(_0x0005)) _0x0022.result.createObjectStore(_0x0005);
            };
            _0x0022.onsuccess = () => _0x0020(_0x0022.result);
            _0x0022.onerror = () => _0x0021(_0x0022.error || new Error('업데이트 설정 저장소를 열 수 없습니다.'));
        });
    }
    async function _0x0023() {
        try {
            const _0x0024 = await _0x001f();
            return await new Promise((_0x0025, _0x0026) => {
                const _0x0027 = _0x0024.transaction(_0x0005, 'readonly').objectStore(_0x0005).get(_0x0006);
                _0x0027.onsuccess = () => _0x0025(_0x0027.result || null);
                _0x0027.onerror = () => _0x0026(_0x0027.error);
            });
        } catch (_) { return null; }
    }
    async function _0x0028(_0x0029) {
        const _0x002a = await _0x001f();
        await new Promise((_0x002b, _0x002c) => {
            const _0x002d = _0x002a.transaction(_0x0005, 'readwrite');
            _0x002d.objectStore(_0x0005).put(_0x0029, _0x0006);
            _0x002d.oncomplete = _0x002b;
            _0x002d.onerror = () => _0x002c(_0x002d.error || new Error('폴더 권한 정보를 저장하지 못했습니다.'));
        });
    }
    async function _0x002e(_0x002f, _0x0030) {
        if (!_0x002f) return false;
        const _0x0031 = { mode: 'readwrite' };
        try {
            if (await _0x002f.queryPermission(_0x0031) === 'granted') return true;
            if (_0x0030 && await _0x002f.requestPermission(_0x0031) === 'granted') return true;
        } catch (_) {}
        return false;
    }
    async function _0x0032(_0x0033, _0x0034) {
        const _0x0035 = await _0x0033.getFileHandle(_0x0034);
        return JSON.parse(await (await _0x0035.getFile()).text());
    }
    async function _0x0036() {
        if (_0x000c) return _0x000c;
        const _0x0037 = await fetch(chrome.runtime.getURL('build-info.json'), { cache: 'no-store' });
        if (!_0x0037.ok) throw new Error('현재 빌드 정보를 읽을 수 없습니다.');
        _0x000c = await _0x0037.json();
        return _0x000c;
    }
    async function _0x0038(_0x0039) {
        let _0x003a, _0x003b;
        try {
            _0x003a = await _0x0032(_0x0039, 'manifest.json');
            _0x003b = await _0x0032(_0x0039, 'build-info.json');
        } catch (_) {
            throw new Error('선택한 폴더가 확장 프로그램 원본 폴더가 아닙니다. manifest.json과 build-info.json이 필요합니다.');
        }
        const _0x003c = await _0x0036();
        if (_0x003a?.name !== _0x0003 || Number(_0x003a?.manifest_version) !== 3)
            throw new Error('선택한 폴더의 확장 프로그램 정보가 현재 설치본과 다릅니다.');
        const _0x0090 = String(_0x003b?.version || '').trim();
        const _0x0091 = String(_0x003a?.version || '').trim();
        const _0x0092 = String(_0x003b?.buildId || '').trim();
        if (!_0x0090 || _0x0080(_0x0090, _0x0091) !== 0 || !_0x0092)
            throw new Error(`선택한 폴더의 빌드 정보가 올바르지 않습니다. manifest=${_0x0091 || '?'}, build=${_0x0090 || '?'}, buildId=${_0x0092 ? '있음' : '없음'}`);
        const _0x0088 = String(_0x003a?.version || '');
        const _0x0089 = await _0x0086(_0x0039);
        const _0x008a = _0x0088 === _0x0002 && _0x003b?.buildId === _0x003c?.buildId;
        const _0x008b = _0x0089?.extensionId === chrome.runtime.id && _0x0089?.productId === _0x0007;
        if (!_0x008a && !_0x008b)
            throw new Error(`선택한 폴더가 현재 Chrome에 로드된 확장 폴더인지 확인할 수 없습니다. 현재 실행 v${_0x0002}, 폴더 v${_0x0088 || '?'}.`);
        if (_0x0088 !== _0x0002 && _0x008b && _0x0080(_0x0088, _0x0002) > 0)
            _0x0015(`폴더에는 이미 v${_0x0088} 파일이 적용되어 있지만 Chrome 런타임은 v${_0x0002}입니다. 업데이트를 계속하면 런타임을 정상 재로드합니다.`);
        return { manifest: _0x003a, build: _0x003b, marker: _0x0089, diskVersion: _0x0088, runtimeMatches: _0x008a };
    }
    function _0x003d(_0x003e) {
        const _0x003f = new URL(String(_0x003e || ''));
        if (_0x003f.protocol !== 'https:' || _0x003f.hostname !== 'raw.githubusercontent.com') throw new Error('업데이트 주소가 허용된 GitHub 주소가 아닙니다.');
        if (!_0x003f.pathname.startsWith('/KKomaProgrammer/codingdongari/')) throw new Error('허용되지 않은 업데이트 저장소입니다.');
        return _0x003f.href;
    }
    async function _0x0040(_0x0041, _0x0098 = null) {
        let _0x0044;
        if (_0x0098) {
            _0x0015(`${_0x0098.name || `message_V${_0x0041.version}.zip`}을 불러오고 검증하는 중…`);
            _0x0044 = await _0x0098.arrayBuffer();
        } else {
            const _0x0042 = _0x003d(_0x0041.downloadUrl);
            _0x0015(`v${_0x0041.version} 업데이트 ZIP을 가져오는 중…`);
            const _0x0043 = await fetch(`${_0x0042}?t=${Date.now()}`, { cache: 'no-store' });
            if (!_0x0043.ok) throw new Error(`업데이트 ZIP 다운로드 실패 (${_0x0043.status})`);
            _0x0044 = await _0x0043.arrayBuffer();
        }
        if (!_0x0044.byteLength || _0x0044.byteLength > 200 * 1024 * 1024) throw new Error('업데이트 ZIP 크기가 올바르지 않습니다.');
        const _0x0045 = await globalThis.EntryChatZipUpdate.readZip(_0x0044);
        const _0x0046 = _0x0045.find((_0x0047) => _0x0047.path === 'manifest.json');
        const _0x0048 = _0x0045.find((_0x0047) => _0x0047.path === 'build-info.json');
        if (!_0x0046 || !_0x0048) throw new Error('업데이트 패키지에 필수 빌드 정보가 없습니다.');
        const _0x0049 = JSON.parse(new TextDecoder().decode(_0x0046.data));
        const _0x004a = JSON.parse(new TextDecoder().decode(_0x0048.data));
        if (_0x0049?.name !== _0x0003 || Number(_0x0049?.manifest_version) !== 3) throw new Error('업데이트 ZIP이 현재 메신저 확장과 일치하지 않습니다.');
        if (String(_0x0049?.version || '') !== String(_0x0041.version || '')) throw new Error('ZIP 파일명과 manifest.json 버전이 일치하지 않습니다.');
        const _0x0093 = String(_0x0041?.version || '').trim();
        const _0x0094 = String(_0x004a?.version || '').trim();
        const _0x0095 = String(_0x004a?.buildId || '').trim();
        if (!_0x0094 || _0x0080(_0x0094, _0x0093) !== 0 || !_0x0095)
            throw new Error(`업데이트 빌드 정보가 올바르지 않습니다. target=${_0x0093 || '?'}, build=${_0x0094 || '?'}, buildId=${_0x0095 ? '있음' : '없음'}`);
        if (_0x004a?.productId && String(_0x004a.productId).trim() !== _0x0007)
            console.warn('[Entry Chat] legacy/alternate productId in update package:', _0x004a.productId);
        return { entries: _0x0045, manifest: _0x0049, build: { ..._0x004a, productId: _0x0007, version: _0x0093, buildId: _0x0095 } };
    }
    async function _0x0099(_0x009a) {
        if (!_0x009a?.downloadUrl || !_0x009a?.filename) throw new Error('다운로드할 업데이트 ZIP 정보가 없습니다.');
        const _0x009b = _0x003d(_0x009a.downloadUrl);
        const _0x009c = await chrome.downloads.download({
            url: `${_0x009b}?t=${Date.now()}`,
            filename: _0x009a.filename,
            saveAs: false,
            conflictAction: 'uniquify',
        });
        if (typeof _0x009c !== 'number') throw new Error('업데이트 ZIP 다운로드를 시작하지 못했습니다.');
        return _0x009c;
    }
    async function _0x009d(_0x009e) {
        if (!_0x009e) return;
        const _0x009f = /^message_V(\d+)\.(\d+)\.(\d+)\.zip$/i.exec(String(_0x009e.name || ''));
        if (!_0x009f) throw new Error('파일 이름이 message_Vx.x.x.zip 형식이 아닙니다.');
        const _0x00a0 = `${Number(_0x009f[1])}.${Number(_0x009f[2])}.${Number(_0x009f[3])}`;
        if (_0x0080(_0x00a0, _0x0002) <= 0) throw new Error(`현재 버전(v${_0x0002})보다 높은 ZIP을 선택하세요.`);
        const _0x00a1 = { available: true, currentVersion: _0x0002, version: _0x00a0, filename: _0x009e.name, downloadUrl: _0x000a?.version === _0x00a0 ? _0x000a.downloadUrl : '' };
        const _0x00a2 = await _0x0040(_0x00a1, _0x009e);
        _0x000a = _0x00a1;
        _0x000b = _0x00a2;
        _0x0011.textContent = `v${_0x00a0}`;
        _0x0013.disabled = false;
        _0x0015(`${_0x009e.name} 검증 완료.\n이제 ‘불러온 ZIP 적용’을 누르면 ZIP을 자동 압축 해제하여 확장 폴더 전체를 v${_0x00a0}으로 갱신합니다.`, 'success');
    }
    async function _0x004b(_0x004c, _0x004d) {
        let _0x004e = _0x004c;
        for (const _0x004f of _0x004d) _0x004e = await _0x004e.getDirectoryHandle(_0x004f, { create: true });
        return _0x004e;
    }
    async function _0x0050(_0x0051, _0x0052) {
        const _0x0053 = _0x0052.path.split('/').filter(Boolean);
        const _0x0054 = _0x0053.pop();
        if (!_0x0054) return;
        const _0x0055 = await _0x004b(_0x0051, _0x0053);
        const _0x0056 = await _0x0055.getFileHandle(_0x0054, { create: true });
        const _0x0057 = await _0x0056.createWritable();
        try { await _0x0057.write(_0x0052.data); } finally { await _0x0057.close(); }
    }
    async function _0x0058(_0x0059, _0x005a) {
        const _0x005b = _0x005a.entries.filter((_0x005c) => _0x005c.path !== 'manifest.json');
        let _0x005d = 0;
        for (const _0x005e of _0x005b) {
            await _0x0050(_0x0059, _0x005e);
            _0x005d += 1;
            if (_0x005d === 1 || _0x005d === _0x005b.length || _0x005d % 8 === 0) _0x0015(`확장 프로그램 파일 갱신 중… ${_0x005d}/${_0x005a.entries.length}`);
        }
        await _0x0050(_0x0059, _0x005a.entries.find((_0x005f) => _0x005f.path === 'manifest.json'));
    }
    async function _0x0060(_0x0061, _0x0062, _0x0063) {
        const _0x0064 = new Set((_0x0063.managedFiles || []).map(String));
        const _0x0065 = new Set((_0x0062.managedFiles || []).map(String));
        for (const _0x0066 of _0x0064) {
            if (!_0x0066 || _0x0065.has(_0x0066) || _0x0066 === _0x0009) continue;
            const _0x0067 = _0x0066.split('/').filter(Boolean);
            const _0x0068 = _0x0067.pop();
            if (!_0x0068) continue;
            try {
                let _0x0069 = _0x0061;
                for (const _0x006a of _0x0067) _0x0069 = await _0x0069.getDirectoryHandle(_0x006a);
                await _0x0069.removeEntry(_0x0068, { recursive: true });
            } catch (_) {}
        }
    }
    async function _0x006b(_0x006c, _0x008c = _0x0002, _0x008d = '') {
        const _0x006d = await _0x006c.getFileHandle(_0x0009, { create: true });
        const _0x006e = await _0x006d.createWritable();
        try {
            await _0x006e.write(JSON.stringify({ extensionId: chrome.runtime.id, productId: _0x0007, lastVerifiedVersion: _0x008c, buildId: _0x008d || '', verifiedAt: Date.now() }, null, 2));
        } finally { await _0x006e.close(); }
    }
    async function _0x006f(_0x0070) {
        if (_0x000d || !_0x000a?.available || !_0x000b) return;
        _0x000d = true;
        _0x0013.disabled = true;
        try {
            const _0x0071 = await _0x0038(_0x0070);
            if (_0x0071.diskVersion === _0x000a.version && _0x0071.build?.buildId === _0x000b.build.buildId) {
                await chrome.storage.local.set({ [_0x0008]: { fromVersion: _0x0002, toVersion: _0x000a.version, targetBuildId: _0x000b.build.buildId, writtenAt: Date.now(), recoveryReload: true } });
                await _0x006b(_0x0070, _0x000a.version, _0x000b.build.buildId);
                _0x0015(`v${_0x000a.version} 파일은 이미 폴더에 적용되어 있습니다. Chrome이 이전 런타임을 잡고 있어 지금 다시 로드합니다…`, 'success');
                await new Promise((_0x008e) => setTimeout(_0x008e, 180));
                chrome.runtime.reload();
                return;
            }
            await _0x006b(_0x0070, _0x0002, _0x0071.build?.buildId || '');
            _0x0015(`v${_0x000a.version}의 압축 해제된 파일을 현재 확장 폴더에 적용하고 있습니다…`);
            await _0x0058(_0x0070, _0x000b);
            await _0x0060(_0x0070, _0x000b.build, _0x0071.build);
            const _0x0072 = await _0x0032(_0x0070, 'manifest.json');
            const _0x0073 = await _0x0032(_0x0070, 'build-info.json');
            if (String(_0x0072?.version || '') !== _0x000a.version || _0x0073?.buildId !== _0x000b.build.buildId || _0x0073?.version !== _0x000a.version)
                throw new Error('파일 적용 후 버전/빌드 검증에 실패했습니다.');
            await _0x006b(_0x0070, _0x000a.version, _0x000b.build.buildId);
            await chrome.storage.local.set({ [_0x0008]: { fromVersion: _0x0002, toVersion: _0x000a.version, targetBuildId: _0x000b.build.buildId, writtenAt: Date.now() } });
            _0x0015(`v${_0x000a.version} 적용 완료. manifest.json과 build-info.json을 다시 확인했습니다.\n확장 프로그램을 새 버전으로 다시 로드합니다…`, 'success');
            await new Promise((_0x008f) => setTimeout(_0x008f, 180));
            chrome.runtime.reload();
        } catch (_0x0074) {
            _0x0015(_0x0074?.message || String(_0x0074), 'error');
            _0x0013.disabled = false;
            _0x000d = false;
        }
    }
    async function _0x0075(_0x0076) {
        if (!_0x0076) return false;
        if (!(await _0x002e(_0x0076, false))) return false;
        try {
            await _0x0038(_0x0076);
            await _0x006f(_0x0076);
            return true;
        } catch (_0x0077) {
            _0x0015(_0x0077?.message || String(_0x0077), 'error');
            return false;
        }
    }
    async function _0x0078() {
        if (_0x000d) return;
        let _0x0079 = await _0x0023();
        if (_0x0079) {
            if (await _0x002e(_0x0079, true)) {
                try {
                    await _0x0038(_0x0079);
                    await _0x006f(_0x0079);
                    return;
                } catch (_0x007a) {
                    _0x0015(`${_0x007a?.message || String(_0x007a)}\n현재 확장 폴더를 다시 선택해 주세요.`, 'error');
                }
            }
        }
        if (typeof window.showDirectoryPicker !== 'function') {
            _0x0015('이 환경에서는 확장 폴더 자동 갱신을 사용할 수 없습니다. 아래 수동 ZIP 다운로드를 사용하세요.', 'error');
            return;
        }
        try {
            _0x0079 = await window.showDirectoryPicker({ mode: 'readwrite', id: 'entry-live-studio-source' });
            await _0x0038(_0x0079);
            await _0x0028(_0x0079);
            await _0x006f(_0x0079);
        } catch (_0x007b) {
            if (_0x007b?.name === 'AbortError') return;
            _0x0015(_0x007b?.message || String(_0x007b), 'error');
        }
    }
    async function _0x007c() {
        try {
            await _0x0036();
            _0x000a = await _0x0018('CHECK_UPDATE');
            if (!_0x000a?.available) {
                _0x0011.textContent = '최신 버전';
                _0x0015(`현재 v${_0x0002}이 최신 버전입니다.`, 'success');
                return;
            }
            _0x0011.textContent = `v${_0x000a.version}`;
            _0x0014.disabled = false;
            _0x0096.disabled = false;
            _0x0015(`message_V${_0x000a.version}.zip을 기본 다운로드하는 중…`);
            try {
                await _0x0099(_0x000a);
                _0x0015(`message_V${_0x000a.version}.zip 다운로드를 시작했습니다.\n다운로드가 끝나면 ‘ZIP 불러오기’를 눌러 받은 ZIP을 그대로 선택하세요. 압축을 직접 풀 필요가 없습니다.`);
            } catch (_0x00a3) {
                _0x0015(`자동 ZIP 다운로드를 시작하지 못했습니다: ${_0x00a3?.message || String(_0x00a3)}\n‘ZIP 다시 다운로드’를 누르거나 이미 받은 ZIP이 있으면 ‘ZIP 불러오기’를 사용하세요.`, 'error');
            }
        } catch (_0x007e) {
            _0x0011.textContent = '확인 실패';
            _0x0015(_0x007e?.message || String(_0x007e), 'error');
        }
    }
    _0x0013.addEventListener('click', _0x0078);
    _0x0014.addEventListener('click', async () => {
        try {
            if (!_0x000a?.downloadUrl) throw new Error('다운로드할 최신 ZIP 정보가 없습니다.');
            await _0x0099(_0x000a);
            _0x0015(`${_0x000a.filename || `message_V${_0x000a.version}.zip`} 다운로드를 다시 시작했습니다.\n완료 후 ‘ZIP 불러오기’를 눌러 해당 파일을 선택하세요.`);
        } catch (_0x007f) { _0x0015(_0x007f?.message || String(_0x007f), 'error'); }
    });
    _0x0096.addEventListener('click', () => { _0x0097.value = ''; _0x0097.click(); });
    _0x0097.addEventListener('change', async () => {
        const _0x00a4 = _0x0097.files?.[0];
        if (!_0x00a4) return;
        _0x0013.disabled = true;
        try { await _0x009d(_0x00a4); }
        catch (_0x00a5) { _0x000b = null; _0x0015(_0x00a5?.message || String(_0x00a5), 'error'); }
    });
    _0x007c();
})();
