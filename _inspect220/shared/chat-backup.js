(function (_0x0001) {
    const _0x0002 = 'https://supabase-settings-fetch.pages.dev/api/backup';
    const _0x0003 = 'entryChatSyncEvidenceV1:';
    const _0x0004 = 'entryChatSyncEvidenceMetaV1';
    const _0x0005 = 88000;
    const _0x0006 = 72000;
    const _0x0007 = 380;
    const _0x0008 = 2400;
    const _0x0009 = new TextEncoder();
    const _0x000a = new TextDecoder();
    function _0x000b(_0x000c) {
        let _0x000d = '';
        const _0x000e = 0x8000;
        for (let _0x000f = 0; _0x000f < _0x000c.length; _0x000f += _0x000e) {
            _0x000d += String.fromCharCode(..._0x000c.subarray(_0x000f, _0x000f + _0x000e));
        }
        return btoa(_0x000d);
    }
    function _0x0010(_0x0011) {
        const _0x0012 = atob(String(_0x0011 || ''));
        const _0x0013 = new Uint8Array(_0x0012.length);
        for (let _0x0014 = 0; _0x0014 < _0x0012.length; _0x0014 += 1)
            _0x0013[_0x0014] = _0x0012.charCodeAt(_0x0014);
        return _0x0013;
    }
    function _0x0015(_0x0016) {
        return [..._0x0016].map((_0x0017) => _0x0017.toString(16).padStart(2, '0')).join('');
    }
    function _0x0018(_0x0019) {
        const _0x001a = new Uint8Array(_0x0019);
        crypto.getRandomValues(_0x001a);
        return _0x001a;
    }
    function _0x001b(_0x001c) {
        return String(_0x001c || '').trim().replace(/\s+/g, '').replace(/[^A-Za-z0-9_-]/g, '');
    }
    function _0x001d() {
        const _0x001e = _0x000b(_0x0018(24)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
        return _0x001e.match(/.{1,8}/g).join('-');
    }
    async function _0x001f(_0x0020) {
        const _0x0021 = _0x0020 instanceof Uint8Array ? _0x0020 : _0x0009.encode(String(_0x0020));
        return new Uint8Array(await crypto.subtle.digest('SHA-256', _0x0021));
    }
    async function _0x0022(_0x0023) {
        return _0x0015(await _0x001f(_0x0023));
    }
    async function _0x0024(_0x0025) {
        const _0x0026 = _0x001b(_0x0025);
        if (_0x0026.length < 24 || _0x0026.length > 160)
            throw new Error('복구 코드 형식이 올바르지 않습니다.');
        const _0x0027 = await _0x0022(`entry-live-studio:backup-id:${_0x0026}`);
        const _0x0028 = await _0x0022(`entry-live-studio:backup-token:${_0x0026}`);
        const _0x0029 = await _0x001f(`entry-live-studio:backup-key:${_0x0026}`);
        const _0x002a = await crypto.subtle.importKey('raw', _0x0029, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
        return { code: _0x0026, backupId: _0x0027, token: _0x0028, key: _0x002a };
    }
    async function _0x002b(_0x002c, _0x002d) {
        const _0x002e = _0x0018(12);
        const _0x002f = _0x0009.encode(JSON.stringify(_0x002d));
        const _0x0030 = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: _0x002e }, _0x002c, _0x002f));
        return { v: 1, iv: _0x000b(_0x002e), data: _0x000b(_0x0030) };
    }
    async function _0x0031(_0x0032, _0x0033) {
        if (!_0x0033 || Number(_0x0033.v) !== 1 || !_0x0033.iv || !_0x0033.data)
            throw new Error('암호화 백업 형식이 올바르지 않습니다.');
        const _0x0034 = _0x0010(_0x0033.iv);
        const _0x0035 = _0x0010(_0x0033.data);
        const _0x0036 = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: _0x0034 }, _0x0032, _0x0035);
        return JSON.parse(_0x000a.decode(_0x0036));
    }
    async function _0x0037(_0x0038, _0x0039 = {}, _0x003a = 15000) {
        const _0x003b = new AbortController();
        const _0x003c = setTimeout(() => _0x003b.abort(), _0x003a);
        let _0x003d;
        try {
            _0x003d = await fetch(_0x0038, { ..._0x0039, cache: 'no-store', credentials: 'omit', signal: _0x003b.signal });
        }
        catch (_0x003e) {
            if (_0x003e?.name === 'AbortError')
                throw new Error('백업 서버 응답 시간이 초과되었습니다.');
            throw new Error('백업 서버에 연결할 수 없습니다.');
        }
        finally {
            clearTimeout(_0x003c);
        }
        let _0x003f = null;
        try {
            _0x003f = await _0x003d.json();
        }
        catch (_0x0040) { }
        if (!_0x003d.ok || !_0x003f?.ok)
            throw new Error(_0x003f?.error || `백업 서버 오류(HTTP ${_0x003d.status})`);
        return _0x003f;
    }
    class _0x0041 {
        constructor(_0x0042) {
            this.recoveryCode = _0x0042;
            this.materialsPromise = null;
        }
        materials() {
            if (!this.materialsPromise)
                this.materialsPromise = _0x0024(this.recoveryCode);
            return this.materialsPromise;
        }
        async request(_0x0043, _0x0044) {
            const _0x0045 = await this.materials();
            return _0x0037(_0x0002, {
                method: _0x0043,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Backup-Token': _0x0045.token,
                },
                body: JSON.stringify({ backupId: _0x0045.backupId, ..._0x0044 }),
            }, _0x0043 === 'POST' ? 30000 : 18000);
        }
        async saveMeta(_0x0046) {
            const { key: _0x0047 } = await this.materials();
            const _0x0048 = await _0x002b(_0x0047, _0x0046);
            await this.request('PUT', { action: 'meta', payload: _0x0048 });
            return true;
        }
        async saveRecord(_0x0049) {
            if (!_0x0049?.id)
                throw new Error('백업할 메시지 ID가 없습니다.');
            const { key: _0x004a } = await this.materials();
            const _0x004b = await _0x002b(_0x004a, _0x0049);
            await this.request('PUT', { action: 'record', recordId: String(_0x0049.id), payload: _0x004b });
            return true;
        }
        async readAll() {
            const { key: _0x004c } = await this.materials();
            const _0x004d = await this.request('POST', { action: 'read' });
            const _0x004e = await _0x0031(_0x004c, _0x004d.meta);
            const _0x004f = [];
            for (const _0x0050 of _0x004d.records || []) {
                try {
                    const _0x0051 = await _0x0031(_0x004c, _0x0050.payload);
                    if (_0x0051?.id)
                        _0x004f.push(_0x0051);
                }
                catch (_0x0052) { }
            }
            _0x004f.sort((_0x0053, _0x0054) => Number(_0x0053.at || 0) - Number(_0x0054.at || 0));
            return { meta: _0x004e, records: _0x004f };
        }
        async deleteAll() {
            return this.request('DELETE', {});
        }
    }
    function _0x0055(_0x0056, _0x0057 = '') {
        return {
            scope: _0x0056.scope === 'self' ? 'self' : 'room',
            id: String(_0x0056.id || ''),
            roomCode: String(_0x0056.roomCode || ''),
            from: String(_0x0056.from || ''),
            fromName: String(_0x0056.fromName || '').slice(0, 80),
            to: _0x0056.to ? String(_0x0056.to) : null,
            text: String(_0x0056.text || '').slice(0, _0x0008),
            imageName: String(_0x0056.imageName || '').slice(0, 160),
            imageGroupId: String(_0x0056.imageGroupId || '').slice(0, 120),
            imageGroupIndex: Number(_0x0056.imageGroupIndex || 0),
            imageGroupCount: Number(_0x0056.imageGroupCount || 0),
            expectedReaderIds: [...new Set((Array.isArray(_0x0056.expectedReaderIds) ? _0x0056.expectedReaderIds : []).map((_0x0061) => String(_0x0061 || '')).filter(Boolean))].slice(0, 200),
            readBy: [...new Set((Array.isArray(_0x0056.readBy) ? _0x0056.readBy : []).map((_0x0062) => String(_0x0062 || '')).filter(Boolean))].slice(0, 200),
            hasImage: Boolean(_0x0056.imageDataUrl),
            imageSha256: _0x0057,
            at: Number(_0x0056.at || Date.now()),
            savedAt: Number(_0x0056.savedAt || Date.now()),
        };
    }
    class _0x0058 {
        constructor(_0x0059) {
            this.recoveryCode = _0x0059;
            this.materialsPromise = null;
            this.queue = Promise.resolve();
            this.pruneScheduled = false;
        }
        materials() {
            if (!this.materialsPromise)
                this.materialsPromise = _0x0024(this.recoveryCode);
            return this.materialsPromise;
        }
        async putRecord(_0x005a) {
            this.queue = this.queue.catch(() => { }).then(async () => {
                const { key: _0x005b, backupId: _0x005c } = await this.materials();
                const _0x005d = _0x005a?.imageDataUrl ? await _0x0022(_0x005a.imageDataUrl) : '';
                const _0x005e = _0x0055(_0x005a, _0x005d);
                const _0x005f = await _0x002b(_0x005b, _0x005e);
                const _0x0060 = `${_0x0003}${_0x005e.id}`;
                const _0x0061 = { v: 1, at: _0x005e.at, payload: _0x005f };
                const _0x0062 = _0x0060.length + JSON.stringify(_0x0061).length;
                if (_0x0062 > 7900)
                    throw new Error('동기화 백업 항목이 Chrome 항목 제한을 초과했습니다.');
                try {
                    await chrome.storage.sync.set({
                        [_0x0060]: _0x0061,
                        [_0x0004]: { v: 1, backupId: _0x005c, updatedAt: Date.now() },
                    });
                }
                catch (_0x0063) {
                    await this.prune(true);
                    await chrome.storage.sync.set({
                        [_0x0060]: _0x0061,
                        [_0x0004]: { v: 1, backupId: _0x005c, updatedAt: Date.now() },
                    });
                }
                this.schedulePrune();
                return true;
            });
            return this.queue;
        }
        schedulePrune() {
            if (this.pruneScheduled)
                return;
            this.pruneScheduled = true;
            setTimeout(() => {
                this.pruneScheduled = false;
                this.prune(false).catch(() => { });
            }, 1500);
        }
        async prune(_0x0064 = false) {
            const _0x0065 = await chrome.storage.sync.get(null);
            const _0x0066 = Object.entries(_0x0065)
                .filter(([_0x0067, _0x0068]) => _0x0067.startsWith(_0x0003) && _0x0068?.payload)
                .sort((_0x0069, _0x006a) => Number(_0x0069[1]?.at || 0) - Number(_0x006a[1]?.at || 0));
            const _0x006b = await chrome.storage.sync.getBytesInUse(null);
            if (!_0x0064 && _0x006b <= _0x0005 && _0x0066.length <= _0x0007)
                return 0;
            const _0x006c = [];
            let _0x006d = _0x006b;
            let _0x006e = _0x0066.length;
            for (const [_0x006f, _0x0070] of _0x0066) {
                if (_0x006e <= Math.min(_0x0007, 300) && _0x006d <= _0x0006)
                    break;
                _0x006c.push(_0x006f);
                _0x006d -= _0x006f.length + JSON.stringify(_0x0070).length;
                _0x006e -= 1;
            }
            if (_0x006c.length)
                await chrome.storage.sync.remove(_0x006c);
            return _0x006c.length;
        }
        async loadAllRecords() {
            const { key: _0x0071 } = await this.materials();
            const _0x0072 = await chrome.storage.sync.get(null);
            const _0x0073 = [];
            for (const [_0x0074, _0x0075] of Object.entries(_0x0072)) {
                if (!_0x0074.startsWith(_0x0003) || !_0x0075?.payload)
                    continue;
                try {
                    const _0x0076 = await _0x0031(_0x0071, _0x0075.payload);
                    if (_0x0076?.id)
                        _0x0073.push(_0x0076);
                }
                catch (_0x0077) { }
            }
            _0x0073.sort((_0x0078, _0x0079) => Number(_0x0078.at || 0) - Number(_0x0079.at || 0));
            return _0x0073;
        }
        async count() {
            const _0x007a = await chrome.storage.sync.get(null);
            return Object.entries(_0x007a).filter(([_0x007b, _0x007c]) => _0x007b.startsWith(_0x0003) && _0x007c?.payload).length;
        }
    }
    _0x0001.EntryChatBackup = {
        BACKUP_API_URL: _0x0002,
        generateRecoveryCode: _0x001d,
        normalizeRecoveryCode: _0x001b,
        deriveMaterials: _0x0024,
        EntryChatCloudBackupClient: _0x0041,
        EntryChatSyncEvidenceStore: _0x0058,
    };
})(globalThis);
