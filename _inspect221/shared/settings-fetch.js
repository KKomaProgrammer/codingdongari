(function (global) {
    const API_BASE = 'https://supabase-settings-fetch.pages.dev/api';
    const API_URL = `${API_BASE}/current/settings`;
    const STATUS_URL = `${API_BASE}/current/status`;
    const CHAT_BACKUP_URL = `${API_BASE}/current/chat-backup`;
    const BACKUP_URL = `${API_BASE}/backup`;

    async function requestJson(url, options = {}, timeout = 12000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);
        let response;
        try {
            response = await fetch(url, { cache: 'no-store', credentials: 'omit', ...options, signal: controller.signal });
        } catch (error) {
            if (error?.name === 'AbortError') throw new Error('설정 서버 응답 시간이 초과되었습니다.');
            throw new Error('설정 서버에 연결할 수 없습니다.');
        } finally { clearTimeout(timer); }
        let body = null;
        try { body = await response.json(); } catch (_) {}
        if (!response.ok || !body?.ok) {
            const error = new Error(body?.error || `설정 서버 오류(HTTP ${response.status})`);
            error.accessMode = Number(body?.accessMode || 0);
            error.status = body?.status || '';
            throw error;
        }
        return body;
    }

    function normalizeMeta(body) {
        const mode = Number(body?.accessMode || 0);
        return {
            accessMode: mode === 1 || mode === 2 ? mode : 0,
            status: mode === 1 ? 'maintenance' : mode === 2 ? 'disabled' : 'normal',
            requiredUpdateVersion: String(body?.requiredUpdateVersion || ''),
            mandatoryUpdateAll: Boolean(body?.mandatoryUpdateAll),
            passwordRequired: body?.passwordRequired !== false,
            notice: body?.notice && typeof body.notice === 'object' ? {
                title: String(body.notice.title || '공지').slice(0, 80),
                body: String(body.notice.body || '').slice(0, 2000),
            } : null,
        };
    }

    async function fetchStatus({ timeout = 8000 } = {}) {
        return normalizeMeta(await requestJson(STATUS_URL, { method: 'GET' }, timeout));
    }

    async function fetchSettings(password = '', { timeout = 12000 } = {}) {
        password = String(password || '').toLowerCase();
        if (password.length > 256) throw new Error('연결 비밀번호가 너무 깁니다.');
        const body = await requestJson(API_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
        }, timeout);
        const serverUrl = String(body.serverUrl || '').trim().replace(/\/$/, '');
        const anonKey = String(body.anonKey || '').trim();
        if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(serverUrl)) throw new Error('설정 서버의 Supabase URL이 올바르지 않습니다.');
        if (!anonKey || anonKey.startsWith('sb_secret_')) throw new Error('브라우저용 Supabase 키가 아닙니다.');
        return { serverUrl, anonKey, ...normalizeMeta(body) };
    }

    async function backupMessages(clientId, messages, { timeout = 12000 } = {}) {
        if (!clientId || !Array.isArray(messages) || !messages.length) return { ok: true, saved: 0 };
        return requestJson(CHAT_BACKUP_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId: String(clientId), messages: messages.slice(0, 40) }),
        }, timeout);
    }

    global.EntrySettingsFetch = { API_BASE, API_URL, STATUS_URL, BACKUP_URL, CHAT_BACKUP_URL, fetchStatus, fetchSettings, backupMessages };
})(globalThis);
