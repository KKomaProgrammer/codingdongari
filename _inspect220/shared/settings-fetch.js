(function (_0x0001) {
    const _0x0002 = 'https://supabase-settings-fetch.pages.dev/api';
    const _0x0003 = `${_0x0002}/current/settings`;
    const _0x0004 = `${_0x0002}/current/status`;
    const _0x0005 = `${_0x0002}/backup`;
    async function _0x0006(_0x0007, _0x0008 = {}, _0x0009 = 12000) {
        const _0x000a = new AbortController();
        const _0x000b = setTimeout(() => _0x000a.abort(), _0x0009);
        let _0x000c;
        try {
            _0x000c = await fetch(_0x0007, {
                cache: 'no-store',
                credentials: 'omit',
                ..._0x0008,
                signal: _0x000a.signal,
            });
        }
        catch (_0x000d) {
            if (_0x000d?.name === 'AbortError')
                throw new Error('설정 서버 응답 시간이 초과되었습니다.');
            throw new Error('설정 서버에 연결할 수 없습니다.');
        }
        finally {
            clearTimeout(_0x000b);
        }
        let _0x000e = null;
        try {
            _0x000e = await _0x000c.json();
        }
        catch (_0x000f) { }
        if (!_0x000c.ok || !_0x000e?.ok) {
            const _0x0010 = new Error(_0x000e?.error || `설정 서버 오류(HTTP ${_0x000c.status})`);
            _0x0010.accessMode = Number(_0x000e?.accessMode || 0);
            _0x0010.status = _0x000e?.status || '';
            throw _0x0010;
        }
        return _0x000e;
    }
    async function _0x0011({ timeout: _0x0012 = 8000 } = {}) {
        const _0x0013 = await _0x0006(_0x0004, { method: 'GET' }, _0x0012);
        const _0x0014 = Number(_0x0013.accessMode || 0);
        return {
            accessMode: _0x0014 === 1 || _0x0014 === 2 ? _0x0014 : 0,
            status: _0x0014 === 1 ? 'maintenance' : _0x0014 === 2 ? 'disabled' : 'normal',
        };
    }
    async function _0x0015(_0x0016, { timeout: _0x0017 = 12000 } = {}) {
        if (typeof _0x0016 !== 'string' || !_0x0016.length)
            throw new Error('연결 비밀번호를 입력하세요.');
        if (_0x0016.length > 256)
            throw new Error('연결 비밀번호가 너무 깁니다.');
        const _0x0018 = await _0x0006(_0x0003, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: _0x0016 }),
        }, _0x0017);
        const _0x0019 = String(_0x0018.serverUrl || '').trim().replace(/\/$/, '');
        const _0x001a = String(_0x0018.anonKey || '').trim();
        if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(_0x0019))
            throw new Error('설정 서버의 Supabase URL이 올바르지 않습니다.');
        if (!_0x001a || _0x001a.startsWith('sb_secret_'))
            throw new Error('브라우저용 Supabase 키가 아닙니다.');
        return { serverUrl: _0x0019, anonKey: _0x001a, accessMode: 0 };
    }
    _0x0001.EntrySettingsFetch = { API_BASE: _0x0002, API_URL: _0x0003, STATUS_URL: _0x0004, BACKUP_URL: _0x0005, fetchStatus: _0x0011, fetchSettings: _0x0015 };
})(globalThis);
