(function () {
    if (globalThis.__ENTRY_LIVE_CHAT__)
        return;
    globalThis.__ENTRY_LIVE_CHAT__ = true;
    const _0x0001 = document.createElement('div');
    _0x0001.id = 'entry-live-chat-root';
    _0x0001.style.cssText = 'all:initial;position:fixed;z-index:2147483646;right:0;bottom:0;width:0;height:0;';
    const _0x0002 = _0x0001.attachShadow({ mode: 'open' });
    (document.documentElement || document.body).appendChild(_0x0001);
    const _0x0003 = {
        data: { authenticated: false, connectionStatus: 'locked', accessMode: 0, termsAccepted: false, identity: { id: '', name: '사용자' }, rooms: [] },
        open: false,
        selectedRoomCode: null,
        selectedUserId: null,
        view: 'rooms',
        unread: new Map(),
        unreadGroups: new Set(),
        drafts: new Map(),
        pendingImages: new Map(),
        preparingImages: new Set(),
        sending: new Set(),
        seq: 0,
        pending: new Map(),
        launcherPosition: null,
        launcherDragging: false,
        launcherMoved: false,
        galleryMap: new Map(),
        lightboxImages: [],
        lightboxIndex: 0,
        lightboxPointerStartX: null,
        shortcutEnabled: true,
        shortcutKey: 'Alt',
        uiHidden: false,
        hideWarningSeen: false,
        modalLocked: false,
        scrollPositions: new Map(),
        activeScrollKey: null,
        deleteExpiryTimer: null,
    };
    let _0x0004 = null;
    const _0x0005 = (_0x0006) => String(_0x0006 ?? '').replace(/[&<>'"]/g, (_0x0007) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[_0x0007]);
    const _0x0008 = (_0x0009) => {
        const _0x000a = new Date(Number(_0x0009) || Date.now());
        return _0x000a.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };
    const _0x000b = (_0x000c, _0x000d) => `${_0x000c}:${_0x000d || 'all'}`;
    const _0x000e = chrome.runtime.getURL('assets/chat-ext-48.png');
    _0x0002.innerHTML = `<style>
    :host{all:initial}
    *{box-sizing:border-box}button,input{font:inherit}button{cursor:pointer}[hidden]{display:none!important}
    .launcher{position:fixed;right:18px;bottom:18px;width:52px;height:52px;z-index:2147483646;border:1px solid #d8dfe9;border-radius:17px;background:#fff;box-shadow:0 13px 36px rgba(25,37,58,.24);display:grid;place-items:center;color:#354052;touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none}.launcher.dragging{cursor:grabbing;transform:none!important;transition:none!important}
    .launcher:hover{transform:translateY(-1px);box-shadow:0 16px 42px rgba(25,37,58,.28)}.launcher svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:2}.badge{position:absolute;right:-6px;top:-6px;min-width:22px;height:22px;padding:0 5px;border-radius:12px;background:#e83f59;color:#fff;border:2px solid #fff;display:grid;place-items:center;font:700 11px system-ui}
    .panel{position:fixed;right:18px;bottom:80px;width:min(460px,calc(100vw - 20px));height:min(640px,calc(100dvh - 96px));max-height:calc(100dvh - 16px);z-index:2147483645;border:1px solid #d8dce3;border-radius:18px;background:#fff;box-shadow:0 22px 70px rgba(20,31,50,.28);overflow:hidden;display:grid;grid-template-rows:58px minmax(0,1fr);font:13px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans KR",sans-serif;color:#23262d}
    #panelBody{height:100%;min-height:0;overflow:hidden}
    .top{display:flex;align-items:center;justify-content:space-between;padding:0 12px 0 14px;border-bottom:1px solid #d8dce3;background:#f9dc4b}.brand{display:flex;align-items:center;gap:10px;min-width:0}.brandicon{width:36px;height:36px;display:block;border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.12)}.brandcopy{min-width:0}.brandcopy b,.brandcopy small{display:block}.brandcopy b{font-size:15px;color:#2d2d2d}.brandcopy small{margin-top:1px;color:#655d32;font-size:10px}.topright{display:flex;align-items:center;gap:7px}.status{display:flex;align-items:center;gap:5px;padding:5px 8px;border-radius:999px;background:rgba(255,255,255,.54);color:#5e5836;font-size:10px}.dot{width:7px;height:7px;border-radius:50%;background:#a69d69}.dot.online{background:#20a765}.dot.connecting{background:#d58a14}.iconbtn{width:32px;height:32px;border:0;border-radius:10px;background:rgba(255,255,255,.58);color:#4b472d;font-size:18px}.iconbtn:hover{background:rgba(255,255,255,.82)}
    .auth{height:100%;min-height:0;overflow:auto;display:grid;place-items:center;padding:22px;background:#eef1f5}.authcard{width:min(390px,100%);padding:23px;border:1px solid #dfe3e9;border-radius:18px;background:#fff;box-shadow:0 10px 30px rgba(28,42,64,.08)}.authcard h2{margin:0 0 7px;font-size:18px}.authcard p{margin:0 0 16px;color:#747f90;font-size:11px;line-height:1.6}.field{display:grid;gap:6px;margin-bottom:10px}.field label{font-size:11px;font-weight:800;color:#586477}.field input{width:100%;border:1px solid #d7dee9;border-radius:11px;padding:10px 11px;outline:none;color:#253044;background:#fff}.field input:focus{border-color:#d4b920;box-shadow:0 0 0 3px rgba(249,220,75,.22)}.primary{border:0;border-radius:11px;padding:10px 13px;background:#3a3d45;color:#fff;font-weight:800}.primary:disabled{opacity:.55;cursor:default}.autherror{min-height:18px;margin-top:9px;color:#d33f58;font-size:10px}
    .main{height:100%;min-height:0;overflow:hidden;display:grid;grid-template-columns:238px minmax(0,1fr)}.side{height:100%;min-height:0;overflow:hidden;display:grid;grid-template-rows:auto auto minmax(0,1fr);border-right:1px solid #dfe3e8;background:#f2f3f5}.profile{display:flex;align-items:center;gap:9px;padding:11px;border-bottom:1px solid #dde1e7;background:#eceff3}.avatar{width:36px;height:36px;flex:0 0 auto;border-radius:13px;display:grid;place-items:center;background:#d9dde4;color:#4e5663;font-weight:900}.profilecopy{min-width:0;flex:1}.profilecopy b,.profilecopy small{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.profilecopy b{font-size:12px}.profilecopy small{font-size:9px;color:#7b8492;margin-top:2px}.tinybtn{border:0;border-radius:8px;padding:6px 7px;background:#fff;color:#697486;font-size:10px}.roomactions{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:9px}.roomactions button{border:1px solid #d5dae2;border-radius:10px;padding:8px 6px;background:#fff;color:#444c59;font-weight:700;font-size:10px}.roomactions button:hover{background:#f9dc4b;border-color:#e2c42d}.tree{min-height:0;overflow:auto;padding:3px 7px 10px}.roomblock{margin-bottom:5px}.roomrow{width:100%;display:flex;align-items:center;gap:8px;border:0;border-radius:12px;padding:9px 8px;background:transparent;text-align:left;color:#465165}.roomrow:hover{background:#fff}.roomrow.active{background:#fff;color:#23262d;box-shadow:0 2px 10px rgba(31,43,66,.07)}.roomicon{width:32px;height:32px;flex:0 0 auto;border-radius:11px;display:grid;place-items:center;background:#dfe3e9;color:#59616e;font-weight:900;font-size:10px}.roomrow.active .roomicon{background:#f9dc4b;color:#37331f}.roomcopy{min-width:0;flex:1}.roomcopy b,.roomcopy small{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.roomcopy b{font-size:11px}.roomcopy small{margin-top:2px;color:#8a94a3;font-size:9px}.role{display:inline-flex;align-items:center;padding:2px 5px;border-radius:999px;background:#f9dc4b;color:#5f5210;font-size:8px;font-weight:900}.treebadge{min-width:18px;height:18px;padding:0 4px;border-radius:9px;display:grid;place-items:center;background:#e9435c;color:#fff;font-size:9px;font-weight:800}.children{margin:3px 0 5px 20px;padding-left:8px;border-left:1px solid #d7dce4}.child{width:100%;display:flex;align-items:center;gap:7px;border:0;border-radius:10px;padding:7px 8px;background:transparent;text-align:left;color:#667184}.child:hover{background:#fff}.child.active{background:#f9dc4b;color:#403a1d;font-weight:800}.userdot{width:7px;height:7px;border-radius:50%;background:#2bc07c;flex:0 0 auto}.childname{min-width:0;flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:10px}.selftag{font-size:8px;color:#929aa8}.lockedroom .userdot{background:#b8bec8}
    .conversation{height:100%;min-width:0;min-height:0;overflow:hidden;display:grid;grid-template-rows:58px minmax(0,1fr) auto;background:#b9c8d7}.convhead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 13px;border-bottom:1px solid rgba(0,0,0,.08);background:#f5f6f8}.convtitle{min-width:0}.convtitle b,.convtitle small{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.convtitle b{font-size:13px}.convtitle small{margin-top:2px;color:#7c8491;font-size:9px}.convtools{display:flex;gap:5px}.convtools button{border:1px solid #d7dce3;border-radius:9px;padding:6px 8px;background:#fff;color:#667184;font-size:9px}.convtools button.danger{color:#c73d55;border-color:#f0cbd2}.messages{min-height:0;overflow:auto;padding:15px 14px 10px;background:#b9c8d7}.empty{height:100%;display:grid;place-items:center;color:#607080;font-size:11px;text-align:center;padding:20px}.msg{max-width:78%;margin:0 0 10px;display:grid;gap:3px}.msg.mine{margin-left:auto}.sender{font-size:9px;color:#596979;padding:0 4px}.msg.mine .sender{text-align:right}.bubble{width:max-content;max-width:100%;padding:9px 11px;border:0;border-radius:13px 13px 13px 4px;background:#fff;color:#273246;white-space:pre-wrap;word-break:break-word;box-shadow:0 1px 1px rgba(0,0,0,.05)}.msg.mine .bubble{margin-left:auto;border-radius:13px 13px 4px 13px;background:#f9dc4b;color:#2d2d2d}.time{padding:0 4px;font-size:8px;color:#647484}.msg.mine .time{text-align:right}.compose{min-height:0;padding:10px;border-top:1px solid #dfe3e8;background:#fff}.composerow{display:grid;grid-template-columns:1fr auto;gap:7px}.composerow input{min-width:0;border:1px solid #d5dae2;border-radius:12px;padding:10px 11px;outline:none;color:#253044;background:#f6f7f9}.composerow input:focus{border-color:#d7bc29;background:#fff}.composerow button{padding-inline:15px;background:#f9dc4b;color:#403a1d}.composerow input:disabled{background:#f3f5f8;color:#999}
    .welcome{height:100%;display:grid;place-items:center;padding:25px;text-align:center;color:#7e8999}.welcome strong{display:block;color:#344054;font-size:15px;margin-bottom:6px}
    .modalback{position:fixed;inset:0;z-index:2147483647;background:rgba(16,23,36,.45);display:grid;place-items:center;padding:14px}.modal{width:min(360px,100%);padding:16px;border-radius:16px;background:#fff;box-shadow:0 20px 60px rgba(15,25,42,.3);font:13px/1.45 system-ui,-apple-system,"Noto Sans KR",sans-serif;color:#243044}.modal h3{margin:0 0 12px;font-size:15px}.modalactions{display:grid;grid-template-columns:1fr 1.3fr;gap:7px;margin-top:11px}.secondary{border:1px solid #dce2eb;border-radius:11px;padding:10px;background:#fff;color:#5e697b}.modalerror{min-height:17px;margin-top:7px;color:#ce3c56;font-size:10px}
    .toast{position:fixed;right:18px;bottom:86px;z-index:2147483647;max-width:min(360px,calc(100vw - 30px));padding:10px 13px;border-radius:11px;background:#283348;color:#fff;box-shadow:0 12px 32px rgba(20,30,48,.26);font:11px/1.4 system-ui,-apple-system,"Noto Sans KR",sans-serif}.toast.error{background:#c94259}
    @media(max-width:680px){.panel{right:8px;bottom:72px;width:calc(100vw - 16px);height:min(620px,calc(100dvh - 84px));max-height:calc(100dvh - 12px)}.launcher{right:12px;bottom:12px}.main{grid-template-columns:190px minmax(0,1fr)}.side{font-size:11px}.convtools button{padding:5px}.msg{max-width:88%}}
    @media(max-width:520px){.main{grid-template-columns:150px minmax(0,1fr)}.profile{padding:8px}.roomactions{grid-template-columns:1fr}.roomrow{padding:7px 5px}.children{margin-left:12px}.panel{bottom:70px;height:calc(100dvh - 82px);max-height:calc(100dvh - 12px)}}
    /* v2.0.6: 단계형 메신저 + 나와의 채팅 + 사진/백업 */
    .main{height:100%;min-height:0;overflow:hidden;display:block;background:#f3f4f6}
    .navview{height:100%;min-height:0;overflow:hidden;display:grid;grid-template-rows:auto minmax(0,1fr);background:#f3f4f6}
    .navhead{min-height:56px;display:flex;align-items:center;gap:9px;padding:8px 12px;border-bottom:1px solid #e0e4ea;background:#fff}
    .backbtn{width:36px;height:36px;flex:0 0 auto;border:0;border-radius:11px;background:#f2f4f7;color:#313846;font-size:20px;display:grid;place-items:center}.backbtn:hover{background:#e8ebf0}
    .navtitle{min-width:0;flex:1}.navtitle b,.navtitle small{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.navtitle b{font-size:14px}.navtitle small{margin-top:2px;color:#818b99;font-size:9px}
    .navbody{min-height:0;overflow:auto;padding:12px}
    .rooms-home{display:grid;gap:12px}.home-profile{display:flex;align-items:center;gap:10px;padding:13px;border:1px solid #e0e4ea;border-radius:16px;background:#fff}.home-profile .avatar{width:42px;height:42px}.home-profile .profilecopy{flex:1}.home-profile .tinybtn{background:#f3f5f8}
    .home-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.home-actions button{border:1px solid #dce1e8;border-radius:13px;padding:11px;background:#fff;color:#3f4857;font-weight:800}.home-actions button:first-child{background:#f9dc4b;border-color:#e3c52f;color:#40391e}
    .room-list{display:grid;gap:8px}.room-card{width:100%;display:flex;align-items:center;gap:11px;padding:12px;border:1px solid #e0e4ea;border-radius:15px;background:#fff;text-align:left;color:#2c3441}.room-card:hover{border-color:#d0d6df;box-shadow:0 3px 12px rgba(30,43,64,.07)}.room-card .roomicon{width:42px;height:42px;border-radius:13px;background:#f9dc4b;color:#3f391e;font-size:11px}.room-card .roomcopy{flex:1}.room-card .roomcopy b{font-size:12px}.room-enter{flex:0 0 auto;color:#8a93a1;font-size:10px}.room-card .treebadge{margin-left:3px}
    .room-detail{display:grid;gap:10px}.room-summary{padding:14px;border:1px solid #e0e4ea;border-radius:16px;background:#fff}.room-summary h3{margin:0 0 4px;font-size:16px}.room-summary p{margin:0;color:#7c8695;font-size:10px}.room-detail-actions{display:flex;gap:7px;margin-top:10px}.room-detail-actions button{border:1px solid #dce1e8;border-radius:9px;padding:7px 9px;background:#fff;color:#626d7e;font-size:9px}.room-detail-actions button.danger{color:#c44358;border-color:#efc9d0}
    .member-list{display:grid;gap:6px}.member-row{width:100%;display:flex;align-items:center;gap:10px;padding:11px;border:1px solid #e2e6ec;border-radius:14px;background:#fff;text-align:left;color:#354052}.member-row:hover{background:#fafbfc}.member-avatar{width:38px;height:38px;flex:0 0 auto;border-radius:13px;display:grid;place-items:center;background:#e4e8ee;color:#566071;font-weight:900}.member-row.all .member-avatar{background:#f9dc4b;color:#413a1d}.member-copy{min-width:0;flex:1}.member-copy b,.member-copy small{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.member-copy b{font-size:11px}.member-copy small{margin-top:2px;color:#8b94a2;font-size:9px}.member-arrow{color:#a0a7b2}.member-row:disabled{opacity:.55;cursor:default}
    .conversation-view{position:relative;height:100%;min-height:0;display:grid;grid-template-rows:56px minmax(0,1fr) auto;background:#b9c8d7}.conversation-view .navhead{background:#f5f6f8}.conversation-view .messages{min-height:0}.conversation-view .compose{min-height:0}
    .empty-rooms{padding:38px 12px;text-align:center;color:#818b99;font-size:11px;background:#fff;border:1px dashed #d6dce5;border-radius:15px}
    @media(max-width:680px){.panel{width:min(460px,calc(100vw - 16px))}.navbody{padding:10px}.home-actions{grid-template-columns:1fr 1fr}}
    .avatar,.member-avatar{overflow:hidden}.avatar img,.member-avatar img{width:100%;height:100%;object-fit:cover;display:block}.profile-actions{display:flex;gap:5px;flex-wrap:wrap}.self-chat-card{width:100%;display:flex;align-items:center;gap:11px;padding:12px;border:1px solid #e0e4ea;border-radius:15px;background:#fff;text-align:left;color:#2c3441}.self-chat-card:hover{box-shadow:0 3px 12px rgba(30,43,64,.07)}.self-chat-card .member-avatar{width:42px;height:42px}.backup-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px}.backup-actions button{border:1px solid #dbe1e8;border-radius:10px;padding:9px;background:#fff;color:#566173;font-weight:700;font-size:10px}.backup-actions button:hover{background:#f8f9fb}.photo-btn{width:40px;padding:0!important;font-size:18px!important}.image-preview{display:flex;align-items:center;gap:8px;margin:0 0 8px;padding:7px;border-radius:10px;background:#f2f4f7}.image-preview img{width:48px;height:48px;object-fit:cover;border-radius:8px}.image-preview span{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px;color:#6c7685}.image-preview button{border:0;background:#fff;border-radius:8px;padding:5px 7px;color:#8b5260}.chat-image{display:block;max-width:220px;max-height:260px;width:auto;height:auto;border-radius:10px;cursor:zoom-in;background:#eef1f4}.bubble.has-image{padding:6px}.bubble.has-image .msg-text{padding:6px 5px 4px}.msg-text:empty{display:none}.lightbox{position:fixed;inset:0;z-index:2147483647;background:rgba(10,15,24,.72);display:grid;place-items:center;padding:24px}.lightbox img{max-width:min(92vw,1100px);max-height:88vh;border-radius:12px;box-shadow:0 20px 80px rgba(0,0,0,.45)}.lightbox button{position:fixed;right:18px;top:18px;width:40px;height:40px;border:0;border-radius:12px;background:#fff;color:#222;font-size:22px}.profile-photo-preview{display:flex;align-items:center;gap:12px;margin:6px 0 12px}.profile-photo-preview .avatar{width:64px;height:64px;border-radius:20px}.recovery-note{font-size:9px;line-height:1.55;color:#7b8594;margin:8px 0 0}.composerow{grid-template-columns:auto minmax(0,1fr) auto}
    /* v2.1.0: 상태 제한, 이용 안내, 참가자 콜라주, 다중 이미지 */
    .access-screen,.terms-screen{height:100%;min-height:0;overflow:auto;display:grid;place-items:center;padding:22px;background:#eef1f5}.access-card,.terms-card{width:min(400px,100%);padding:22px;border:1px solid #dfe4eb;border-radius:19px;background:#fff;box-shadow:0 12px 34px rgba(28,42,64,.09)}.access-symbol{width:50px;height:50px;border-radius:16px;display:grid;place-items:center;margin-bottom:13px;background:#f2f4f7;font-size:24px}.access-card h2,.terms-card h2{margin:0 0 8px;font-size:18px}.access-card p,.terms-card p{margin:0;color:#707b8b;font-size:11px;line-height:1.65}.terms-box{margin:14px 0;padding:13px;border:1px solid #e1e5eb;border-radius:13px;background:#f7f8fa;color:#4d5767;font-size:10px;line-height:1.7}.terms-note{margin-top:10px!important;font-size:9px!important;color:#8a93a0!important}.terms-card .primary{width:100%;margin-top:14px}
    .section-label{display:flex;align-items:center;justify-content:space-between;margin:1px 2px -3px;color:#7a8492;font-size:9px;font-weight:800}.home-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.home-stat{padding:9px;border:1px solid #e1e5eb;border-radius:12px;background:#fff;text-align:center}.home-stat b{display:block;font-size:13px;color:#333b48}.home-stat small{display:block;margin-top:2px;font-size:8px;color:#8a94a2}.backup-hint{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 11px;border:1px solid #e0e5eb;border-radius:13px;background:#fff}.backup-hint span{min-width:0}.backup-hint b,.backup-hint small{display:block}.backup-hint b{font-size:10px}.backup-hint small{margin-top:2px;color:#87919f;font-size:8px}.backup-hint button{flex:0 0 auto}
    .group-avatar{position:relative;width:38px;height:38px;flex:0 0 auto;border-radius:13px;overflow:hidden;background:#e7eaf0;border:1px solid #dde2e9}.group-avatar .ga{position:absolute;display:grid;place-items:center;overflow:hidden;background:#e4e8ee;color:#596373;font-size:8px;font-weight:900;border:1px solid #fff}.group-avatar .ga img{width:100%;height:100%;object-fit:cover;display:block}.group-avatar.n1 .ga:nth-child(1){inset:0;border:0}.group-avatar.n2 .ga:nth-child(1){left:0;top:0;width:58%;height:58%;border-radius:12px 0 9px 0}.group-avatar.n2 .ga:nth-child(2){right:0;bottom:0;width:58%;height:58%;border-radius:9px 0 12px 0}.group-avatar.n3 .ga:nth-child(1){left:25%;top:0;width:50%;height:52%;border-radius:0 0 8px 8px}.group-avatar.n3 .ga:nth-child(2){right:0;bottom:0;width:52%;height:52%;border-radius:8px 0 12px 0}.group-avatar.n3 .ga:nth-child(3){left:0;bottom:0;width:52%;height:52%;border-radius:0 8px 0 12px}.group-avatar.n4 .ga:nth-child(1),.group-avatar.nmore .ga:nth-child(1){left:0;top:0;width:50%;height:50%}.group-avatar.n4 .ga:nth-child(2),.group-avatar.nmore .ga:nth-child(2){right:0;top:0;width:50%;height:50%}.group-avatar.n4 .ga:nth-child(3),.group-avatar.nmore .ga:nth-child(3){left:0;bottom:0;width:50%;height:50%}.group-avatar.n4 .ga:nth-child(4),.group-avatar.nmore .ga:nth-child(4){right:0;bottom:0;width:50%;height:50%}.group-avatar .more{position:absolute;right:-1px;top:-1px;z-index:5;min-width:18px;height:16px;padding:0 4px;border-radius:8px;background:#313846;color:#fff;border:1px solid #fff;display:grid;place-items:center;font-size:7px;font-weight:900}
    .image-preview{display:block}.image-preview-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}.image-preview-head span{font-size:9px;font-weight:800;color:#667181}.image-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.image-thumb{position:relative;min-width:0}.image-thumb img{width:100%;aspect-ratio:1/1;height:auto;object-fit:cover;border-radius:8px;display:block}.image-thumb button{position:absolute;right:3px;top:3px;width:20px;height:20px;padding:0;border-radius:10px;background:rgba(255,255,255,.92);color:#8b5260;font-size:12px;display:grid;place-items:center}.image-thumb small{display:block;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#7f8997;font-size:7px}.image-upload-status{display:flex;align-items:center;gap:7px;margin:0 0 8px;padding:8px 10px;border-radius:10px;background:#f1f4f7;color:#5f6a79;font-size:9px;font-weight:800}.image-upload-status i{width:12px;height:12px;border:2px solid #c5ccd6;border-top-color:#596474;border-radius:50%;animation:elsSpin .8s linear infinite}@keyframes elsSpin{to{transform:rotate(360deg)}}
    /* v2.1.0: 묶음 사진, 발신자 프로필, 페이지별 숨김/복구 */
    .msg{max-width:86%;display:flex;align-items:flex-start;gap:7px}.msg.mine{margin-left:auto;flex-direction:row-reverse}.msg-stack{min-width:0;display:grid;gap:3px}.msg.mine .msg-stack{justify-items:end}.msg-avatar{width:30px;height:30px;flex:0 0 auto;margin-top:15px;border-radius:11px;display:grid;place-items:center;overflow:hidden;background:#e2e6ec;color:#5d6674;font-size:9px;font-weight:900;box-shadow:0 1px 2px rgba(0,0,0,.08)}.msg-avatar img{width:100%;height:100%;display:block;object-fit:cover}.sender{padding:0 3px;color:#7e8794;font-size:9px}.msg.mine .sender{text-align:right}.msg .bubble{max-width:min(270px,68vw)}.bubble.has-image{padding:5px;overflow:hidden}.bubble.has-image .msg-text{padding:7px 6px 4px}.bubble.deleted{background:rgba(244,246,249,.92)!important;color:#7a8491!important;border:1px solid rgba(111,124,142,.18);box-shadow:none;font-size:10px;font-style:italic}.msg-meta{display:flex;align-items:center;gap:5px;min-height:14px;padding:0 3px}.msg.mine .msg-meta{justify-content:flex-end}.msg-delete{border:0;background:transparent;padding:1px 3px;color:#7f8997;font-size:8px;line-height:1.2;border-radius:5px}.msg-delete:hover{background:rgba(255,255,255,.58);color:#b43e52}.chat-gallery{position:relative;overflow:hidden;border-radius:10px}.chat-gallery.single{display:block}.chat-gallery.single .gallery-tile img{display:block;max-width:220px;max-height:260px;width:auto;height:auto;object-fit:contain;border-radius:10px;background:#eef1f4}.chat-gallery.multi{width:min(246px,64vw);display:grid;gap:2px;background:rgba(255,255,255,.35)}.chat-gallery.multi.g2,.chat-gallery.multi.g3,.chat-gallery.multi.g4{grid-template-columns:repeat(2,1fr)}.chat-gallery.multi.g5,.chat-gallery.multi.g6,.chat-gallery.multi.g7,.chat-gallery.multi.g8,.chat-gallery.multi.g9{grid-template-columns:repeat(3,1fr)}.gallery-tile{position:relative;min-width:0;overflow:hidden;background:#e7ebf0}.chat-gallery.multi .gallery-tile img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;cursor:zoom-in}.chat-gallery.multi.g3 .gallery-tile:first-child{grid-row:span 2}.chat-gallery.multi.g3 .gallery-tile:first-child img{height:100%;aspect-ratio:auto}.gallery-more{position:absolute;inset:0;display:grid;place-items:center;background:rgba(17,24,39,.48);color:#fff;font-size:16px;font-weight:900;pointer-events:none}.lightbox{touch-action:pan-y}.lightbox img{user-select:none;-webkit-user-drag:none}.lightbox .lbnav{position:fixed;top:50%;transform:translateY(-50%);width:46px;height:58px;border-radius:16px;background:rgba(255,255,255,.9);font-size:30px;display:grid;place-items:center}.lightbox .lbprev{left:18px}.lightbox .lbnext{right:18px}.lightbox .lbcounter{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);padding:7px 11px;border-radius:999px;background:rgba(17,24,39,.68);color:#fff;font:700 11px system-ui}.shortcut-card{margin-top:2px;padding:12px;border:1px solid #e0e5eb;border-radius:14px;background:#fff}.shortcut-main{display:flex;align-items:center;gap:10px}.shortcut-copy{min-width:0;flex:1}.shortcut-copy b,.shortcut-copy small{display:block}.shortcut-copy b{font-size:10px;color:#394353}.shortcut-copy small{margin-top:3px;color:#8993a0;font-size:8px;line-height:1.45}.shortcut-select{border:1px solid #d8dee7;border-radius:9px;padding:6px 7px;background:#f7f8fa;color:#556071;font-size:9px;outline:none}.switch{position:relative;width:38px;height:22px;flex:0 0 auto}.switch input{position:absolute;opacity:0;pointer-events:none}.switch-track{position:absolute;inset:0;border-radius:999px;background:#cbd2dc;transition:.18s}.switch-track:after{content:'';position:absolute;width:16px;height:16px;left:3px;top:3px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.18);transition:.18s}.switch input:checked+.switch-track{background:#3f4652}.switch input:checked+.switch-track:after{transform:translateX(16px)}.drop-trash{position:fixed;left:50%;bottom:24px;z-index:2147483647;transform:translateX(-50%);display:grid;justify-items:center;gap:7px;pointer-events:none;opacity:.92;transition:.16s}.drop-glass{width:76px;height:76px;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(255,255,255,.72);background:rgba(236,241,248,.48);backdrop-filter:blur(18px) saturate(145%);-webkit-backdrop-filter:blur(18px) saturate(145%);box-shadow:0 14px 42px rgba(25,35,50,.22),inset 0 1px 0 rgba(255,255,255,.8);transition:.14s}.drop-glass span{width:42px;height:42px;border:2px solid rgba(78,88,104,.78);border-radius:50%;display:grid;place-items:center;color:#596374;font:300 30px/1 system-ui}.drop-trash small{padding:5px 9px;border-radius:999px;background:rgba(27,34,45,.68);color:#fff;font:700 9px system-ui}.drop-trash.over .drop-glass{transform:scale(1.1);background:rgba(255,228,232,.7);box-shadow:0 16px 48px rgba(98,35,50,.28)}.drop-trash.over .drop-glass span{color:#c94059;border-color:#c94059}.modal-lock-note{margin-top:10px;padding:9px 10px;border-radius:10px;background:#f5f6f8;color:#717b89;font-size:9px;line-height:1.55}.modalactions .countdown{opacity:.56}
    .bubble-row{display:flex;align-items:flex-end;gap:4px;max-width:100%}.msg.mine .bubble-row{flex-direction:row-reverse}.read-count{min-width:13px;padding:0 2px 1px;color:#ffd000;font-size:10px;font-weight:950;line-height:1;text-align:center;-webkit-text-stroke:.45px #5a4700;text-shadow:0 1px 1px rgba(255,255,255,.55),0 0 2px rgba(0,0,0,.36);user-select:none}
    .scroll-bottom-btn{position:absolute;right:14px;bottom:74px;z-index:8;width:38px;height:38px;padding:0;border:1px solid rgba(211,218,228,.95);border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.93);color:#505b6a;box-shadow:0 7px 20px rgba(24,36,54,.18);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:opacity .16s,transform .16s}.scroll-bottom-btn:hover{transform:translateY(-1px);background:#fff}.scroll-bottom-btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.scroll-bottom-btn[hidden]{display:none!important}
  </style>
  <button class="launcher" id="launcher" aria-label="채팅 열기">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5.5h14v10H9l-4 3v-13Z"></path><path d="M8 9h8M8 12h5"></path></svg>
    <span class="badge" id="launcherBadge" hidden>0</span>
  </button>
  <section class="panel" id="panel" hidden>
    <header class="top"><div class="brand"><img class="brandicon" src="${_0x000e}" alt=""><span class="brandcopy"><b>채팅창</b><small>종합 메신저</small></span></div><div class="topright"><span class="status"><i class="dot" id="statusDot"></i><span id="statusText">연결 필요</span></span><button class="iconbtn" id="closePanel" aria-label="닫기">×</button></div></header>
    <div id="panelBody"></div>
  </section>
  <div class="modalback" id="modalBack" hidden><section class="modal"><h3 id="modalTitle"></h3><div id="modalContent"></div><div class="modalerror" id="modalError"></div><div class="modalactions"><button class="secondary" id="modalCancel">취소</button><button class="primary" id="modalConfirm">확인</button></div></section></div>
  <div class="toast" id="toast" hidden></div>
  <div class="drop-trash" id="dropTrash" hidden><div class="drop-glass"><span>×</span></div><small>여기에 놓아 이 페이지에서 숨기기</small></div>
  <div class="lightbox" id="imageLightbox" hidden><button id="lightboxClose" aria-label="닫기">×</button><button class="lbnav lbprev" id="lightboxPrev" aria-label="이전 사진">‹</button><img id="lightboxImage" alt="채팅 사진 크게 보기"><button class="lbnav lbnext" id="lightboxNext" aria-label="다음 사진">›</button><div class="lbcounter" id="lightboxCounter"></div></div>`;
    const _0x000f = (_0x0010) => _0x0002.getElementById(_0x0010);
    const _0x0011 = _0x000f('panel');
    const _0x0012 = _0x000f('panelBody');
    let _0x0013 = null;
    let _0x0014 = null;
    let _0x0015 = Promise.resolve();
    const _0x0016 = 'entryChatPageShortcutV1';
    const _0x0017 = 'entryChatHideWarningSeenV1';
    const _0x0018 = ['Alt', 'Control', 'Shift', 'Meta', 'F2', 'F4', 'F8', 'F10', 'Escape'];
    function _0x0019(_0x001a, _0x001b = {}, _0x001c = 16000) {
        let _0x0210;
        const _0x0211 = new Promise((_, _0x0212) => {
            _0x0210 = setTimeout(() => _0x0212(new Error('응답 시간이 초과되었습니다.')), _0x001c);
        });
        const _0x0213 = chrome.runtime.sendMessage({ type: 'ENTRY_CHAT_COMMAND', command: _0x001a, payload: _0x001b })
            .then((_0x0214) => {
                if (!_0x0214?.ok)
                    throw new Error(_0x0214?.error || '동작 실패');
                return _0x0214.result;
            })
            .catch((_0x0215) => {
                const _0x0216 = String(_0x0215?.message || _0x0215 || '확장 프로그램 연결이 끊겼습니다.');
                if (/back\/forward cache|message channel is closed|receiving end does not exist/i.test(_0x0216))
                    throw new Error('페이지가 복원되어 확장 프로그램 연결을 다시 설정했습니다. 다시 시도해 주세요.');
                throw _0x0215;
            });
        return Promise.race([_0x0213, _0x0211]).finally(() => clearTimeout(_0x0210));
    }
    function _0x0217(_0x0218) {
        if (_0x0218.type === 'CHAT_STATE') {
            const _0x0219 = _0x007f();
            const _0x021a = _0x0086();
            if (_0x000f('messageInput'))
                _0x00aa();
            _0x0003.data = _0x0218.state || _0x0003.data;
            _0x0080();
            _0x0092(_0x0219, _0x021a);
            return;
        }
        if (_0x0218.type === 'CHAT_EVENT' && _0x0218.event?.type === 'message')
            _0x016f(_0x0218.event.message);
    }
    function _0x021b() {
        if (_0x0004)
            return _0x0004;
        try {
            const _0x021c = chrome.runtime.connect({ name: 'entry-live-chat' });
            _0x0004 = _0x021c;
            _0x021c.onMessage.addListener(_0x0217);
            _0x021c.onDisconnect.addListener(() => {
                try { void chrome.runtime.lastError; } catch (_) { }
                if (_0x0004 === _0x021c)
                    _0x0004 = null;
            });
            return _0x021c;
        }
        catch (_) {
            _0x0004 = null;
            return null;
        }
    }
    function _0x021d() {
        const _0x021e = _0x0004;
        _0x0004 = null;
        try { _0x021e?.disconnect(); } catch (_) { }
    }
    window.addEventListener('pagehide', () => _0x021d(), true);
    window.addEventListener('pageshow', () => _0x021b(), true);
    _0x021b();
    chrome.runtime.onMessage.addListener((_0x0025) => {
        if (_0x0025?.type === 'ENTRY_CHAT_TOGGLE')
            _0x007a(!_0x0003.open);
    });
    _0x005f();
    _0x003e();
    _0x0058();
    _0x0036();
    _0x017a();
    _0x000f('closePanel').addEventListener('click', () => _0x007a(false));
    _0x000f('modalCancel').addEventListener('click', () => _0x0181());
    _0x000f('modalBack').addEventListener('click', (_0x0026) => { if (_0x0026.target === _0x000f('modalBack'))
        _0x0181(); });
    _0x000f('lightboxClose').addEventListener('click', () => _0x018c());
    _0x000f('lightboxPrev').addEventListener('click', (_0x0027) => { _0x0027.stopPropagation(); _0x018a(-1); });
    _0x000f('lightboxNext').addEventListener('click', (_0x0028) => { _0x0028.stopPropagation(); _0x018a(1); });
    _0x000f('imageLightbox').addEventListener('click', (_0x0029) => { if (_0x0029.target === _0x000f('imageLightbox'))
        _0x018c(); });
    _0x000f('imageLightbox').addEventListener('pointerdown', (_0x002a) => { _0x0003.lightboxPointerStartX = _0x002a.clientX; });
    _0x000f('imageLightbox').addEventListener('pointerup', (_0x002b) => {
        if (_0x0003.lightboxPointerStartX == null)
            return;
        const _0x002c = _0x002b.clientX - _0x0003.lightboxPointerStartX;
        _0x0003.lightboxPointerStartX = null;
        if (Math.abs(_0x002c) >= 45)
            _0x018a(_0x002c < 0 ? 1 : -1);
    });
    document.addEventListener('pointerdown', (_0x002d) => {
        if (!_0x0003.open || !_0x000f('modalBack').hidden)
            return;
        const _0x002e = typeof _0x002d.composedPath === 'function' ? _0x002d.composedPath() : [];
        if (_0x002e.includes(_0x0011) || _0x002e.includes(_0x000f('launcher')) || _0x002e.includes(_0x000f('imageLightbox')))
            return;
        _0x007a(false);
    }, true);
    document.addEventListener('keydown', (_0x002f) => {
        if (!_0x000f('imageLightbox').hidden) {
            if (_0x002f.key === 'ArrowLeft') {
                _0x002f.preventDefault();
                _0x018a(-1);
            }
            if (_0x002f.key === 'ArrowRight') {
                _0x002f.preventDefault();
                _0x018a(1);
            }
            if (_0x002f.key === 'Escape') {
                _0x002f.preventDefault();
                _0x018c();
            }
        }
    }, true);
    _0x000f('modalConfirm').addEventListener('click', async () => {
        if (!_0x0014)
            return;
        const _0x0030 = _0x000f('modalConfirm');
        _0x0030.disabled = true;
        _0x000f('modalError').textContent = '';
        try {
            await _0x0014();
            _0x0003.modalLocked = false;
            _0x0181(true);
        }
        catch (_0x0031) {
            _0x000f('modalError').textContent = _0x0031?.message || String(_0x0031);
        }
        finally {
            if (!_0x0003.modalLocked)
                _0x0030.disabled = false;
        }
    });
    function _0x0032(_0x0033 = _0x0003.shortcutKey) {
        return ({ Alt: 'Alt', Control: 'Ctrl', Shift: 'Shift', Meta: 'Meta', Escape: 'Esc' })[_0x0033] || _0x0033;
    }
    function _0x0034(_0x0035) {
        return _0x0018.includes(_0x0035) ? _0x0035 : 'Alt';
    }
    async function _0x0036() {
        try {
            const _0x0037 = await chrome.storage.local.get([_0x0016, _0x0017]);
            const _0x0038 = _0x0037?.[_0x0016] || {};
            _0x0003.shortcutEnabled = _0x0038.enabled !== false;
            _0x0003.shortcutKey = _0x0034(_0x0038.key || 'Alt');
            _0x0003.hideWarningSeen = Boolean(_0x0037?.[_0x0017]);
            if (_0x000f('mainView') && _0x0003.view === 'rooms')
                _0x00ad();
        }
        catch (_0x0039) { }
    }
    async function _0x003a() {
        try {
            await chrome.storage.local.set({ [_0x0016]: { enabled: Boolean(_0x0003.shortcutEnabled), key: _0x0034(_0x0003.shortcutKey) } });
        }
        catch (_0x003b) { }
    }
    function _0x003c(_0x003d) {
        _0x0003.uiHidden = Boolean(_0x003d);
        _0x000f('launcher').hidden = _0x0003.uiHidden;
        _0x000f('dropTrash').hidden = true;
        _0x0011.hidden = _0x0003.uiHidden || !_0x0003.open;
        if (!_0x0003.uiHidden && _0x0003.open)
            _0x0092(_0x007f());
    }
    function _0x003e() {
        let _0x003f = '';
        let _0x0040 = 0;
        document.addEventListener('keydown', (_0x0041) => {
            if (!_0x0003.shortcutEnabled || _0x0041.repeat)
                return;
            const _0x0042 = _0x0034(_0x0003.shortcutKey);
            if (_0x0041.key !== _0x0042)
                return;
            _0x0041.preventDefault();
            _0x0041.stopPropagation();
            const _0x0043 = performance.now();
            if (_0x003f === _0x0042 && _0x0043 - _0x0040 <= 520) {
                _0x003f = '';
                _0x0040 = 0;
                _0x0041.preventDefault();
                _0x0041.stopPropagation();
                _0x003c(!_0x0003.uiHidden);
            }
            else {
                _0x003f = _0x0042;
                _0x0040 = _0x0043;
            }
        }, true);
    }
    async function _0x0044() {
        _0x0003.shortcutKey = _0x0034(_0x0003.shortcutKey);
        if (!_0x0003.shortcutEnabled)
            _0x0003.shortcutEnabled = true;
        await _0x003a();
        if (_0x000f('mainView') && _0x0003.view === 'rooms')
            _0x00ad();
    }
    async function _0x0045() {
        await _0x0044();
        if (_0x0003.hideWarningSeen) {
            _0x003c(true);
            return;
        }
        const _0x0046 = _0x0032();
        _0x017d('이 페이지에서 채팅 숨기기', `<p style="margin:0;color:#596474;line-height:1.65"><b>아이콘과 채팅창을 이 페이지에서 숨깁니다.</b><br>다시 표시하려면 <b>${_0x0005(_0x0046)} 키를 빠르게 두 번</b> 누르세요.</p><div class="modal-lock-note">숨김 상태는 이 페이지에만 적용되어 다른 페이지에서는 다시 표시됩니다. 복구 단축키를 잊으면 이 페이지에서는 새로고침하기 전까지 다시 표시하기 어렵습니다.<br><br><b>안전을 위해 단축키 기능은 자동으로 ON 상태로 복구되었습니다.</b></div>`, async () => {
            _0x0003.hideWarningSeen = true;
            await chrome.storage.local.set({ [_0x0017]: true }).catch(() => { });
            _0x003c(true);
        });
        _0x0003.modalLocked = true;
        _0x000f('modalCancel').hidden = true;
        const _0x0047 = _0x000f('modalConfirm');
        _0x0047.disabled = true;
        _0x0047.classList.add('countdown');
        let _0x0048 = 3;
        _0x0047.textContent = `확인 (${_0x0048})`;
        const _0x0049 = setInterval(() => {
            _0x0048 -= 1;
            if (_0x0048 > 0) {
                _0x0047.textContent = `확인 (${_0x0048})`;
                return;
            }
            clearInterval(_0x0049);
            _0x0047.textContent = '확인';
            _0x0047.classList.remove('countdown');
            _0x0047.disabled = false;
        }, 1000);
    }
    const _0x004a = 'entryChatLauncherPosition';
    function _0x004b(_0x004c) {
        const _0x004d = _0x000f('launcher');
        const _0x004e = _0x004d?.offsetWidth || 52;
        const _0x004f = _0x004d?.offsetHeight || 52;
        const _0x0050 = Math.max(0, innerWidth - _0x004e);
        const _0x0051 = Math.max(0, innerHeight - _0x004f);
        const _0x0052 = Math.max(0, Math.min(_0x0050, Number(_0x004c?.x) || 0));
        const _0x0053 = Math.max(0, Math.min(_0x0051, Number(_0x004c?.y) || 0));
        return { x: _0x0052, y: _0x0053 };
    }
    function _0x0054(_0x0055) {
        if (!_0x0055)
            return;
        const _0x0056 = _0x000f('launcher');
        if (!_0x0056)
            return;
        const _0x0057 = _0x004b(_0x0055);
        _0x0003.launcherPosition = _0x0057;
        _0x0056.style.left = `${_0x0057.x}px`;
        _0x0056.style.top = `${_0x0057.y}px`;
        _0x0056.style.right = 'auto';
        _0x0056.style.bottom = 'auto';
    }
    async function _0x0058() {
        try {
            const _0x0059 = await chrome.storage.local.get(_0x004a);
            if (_0x0059?.[_0x004a])
                _0x0054(_0x0059[_0x004a]);
        }
        catch (_0x005a) { }
    }
    async function _0x005b(_0x005c) {
        const _0x005d = _0x004b(_0x005c);
        _0x0054(_0x005d);
        try {
            await chrome.storage.local.set({ [_0x004a]: _0x005d });
        }
        catch (_0x005e) { }
    }
    function _0x005f() {
        const _0x0060 = _0x000f('launcher');
        if (!_0x0060)
            return;
        let _0x0061 = null;
        _0x0060.addEventListener('pointerdown', (_0x0062) => {
            if (_0x0062.button !== undefined && _0x0062.button !== 0)
                return;
            const _0x0063 = _0x0060.getBoundingClientRect();
            _0x0061 = {
                pointerId: _0x0062.pointerId,
                offsetX: _0x0062.clientX - _0x0063.left,
                offsetY: _0x0062.clientY - _0x0063.top,
                startX: _0x0062.clientX,
                startY: _0x0062.clientY,
                originPosition: { x: _0x0063.left, y: _0x0063.top },
            };
            _0x0003.launcherDragging = true;
            _0x0003.launcherMoved = false;
            _0x0060.classList.add('dragging');
            try {
                _0x0060.setPointerCapture(_0x0062.pointerId);
            }
            catch (_0x0064) { }
            _0x0062.preventDefault();
        });
        _0x0060.addEventListener('pointermove', (_0x0065) => {
            if (!_0x0061 || _0x0065.pointerId !== _0x0061.pointerId)
                return;
            if (!_0x0003.launcherMoved && Math.hypot(_0x0065.clientX - _0x0061.startX, _0x0065.clientY - _0x0061.startY) >= 4) {
                _0x0003.launcherMoved = true;
            }
            if (!_0x0003.launcherMoved)
                return;
            _0x0054({ x: _0x0065.clientX - _0x0061.offsetX, y: _0x0065.clientY - _0x0061.offsetY });
            const _0x0066 = _0x000f('dropTrash');
            _0x0066.hidden = false;
            const _0x0067 = _0x0066.getBoundingClientRect();
            const _0x0068 = _0x0065.clientX >= _0x0067.left && _0x0065.clientX <= _0x0067.right && _0x0065.clientY >= _0x0067.top && _0x0065.clientY <= _0x0067.bottom;
            _0x0066.classList.toggle('over', _0x0068);
            _0x0065.preventDefault();
        });
        const _0x0069 = async (_0x006a, _0x006b = false) => {
            if (!_0x0061 || (_0x006a?.pointerId !== undefined && _0x006a.pointerId !== _0x0061.pointerId))
                return;
            const _0x006c = _0x0003.launcherMoved;
            const _0x006d = _0x0061.originPosition;
            try {
                _0x0060.releasePointerCapture(_0x0061.pointerId);
            }
            catch (_0x006e) { }
            _0x0061 = null;
            _0x0003.launcherDragging = false;
            _0x0060.classList.remove('dragging');
            const _0x006f = _0x000f('dropTrash');
            const _0x0070 = _0x006f.getBoundingClientRect();
            const _0x0071 = _0x006c && !_0x006b && _0x006a && _0x006a.clientX >= _0x0070.left && _0x006a.clientX <= _0x0070.right && _0x006a.clientY >= _0x0070.top && _0x006a.clientY <= _0x0070.bottom;
            _0x006f.hidden = true;
            _0x006f.classList.remove('over');
            if (_0x0071) {
                _0x0054(_0x006d || _0x0003.launcherPosition);
                await _0x0045();
            }
            else if (_0x006c && !_0x006b) {
                const _0x0072 = _0x0060.getBoundingClientRect();
                await _0x005b({ x: _0x0072.left, y: _0x0072.top });
            }
            else if (!_0x006c && !_0x006b) {
                _0x007a(!_0x0003.open);
            }
            queueMicrotask(() => { _0x0003.launcherMoved = false; });
        };
        _0x0060.addEventListener('pointerup', (_0x0073) => _0x0069(_0x0073, false));
        _0x0060.addEventListener('pointercancel', (_0x0074) => _0x0069(_0x0074, true));
        _0x0060.addEventListener('lostpointercapture', (_0x0075) => {
            if (_0x0061)
                _0x0069(_0x0075, false);
        });
        addEventListener('resize', () => {
            if (!_0x0003.launcherPosition || _0x0003.launcherDragging)
                return;
            _0x0054(_0x0003.launcherPosition);
        }, { passive: true });
    }
    chrome.storage.onChanged.addListener((_0x0076, _0x0077) => {
        if (_0x0077 !== 'local')
            return;
        const _0x0078 = _0x0076[_0x004a];
        if (_0x0078?.newValue && !_0x0003.launcherDragging) {
            _0x0054(_0x0078.newValue);
        }
        if (_0x0076[_0x0016]?.newValue && !_0x0003.uiHidden) {
            const _0x0079 = _0x0076[_0x0016].newValue || {};
            _0x0003.shortcutEnabled = _0x0079.enabled !== false;
            _0x0003.shortcutKey = _0x0034(_0x0079.key || 'Alt');
            if (_0x000f('mainView') && _0x0003.view === 'rooms')
                _0x00ad();
        }
    });
    function _0x007a(_0x007b) {
        _0x0003.open = Boolean(_0x007b);
        _0x0011.hidden = _0x0003.uiHidden || !_0x0003.open;
        if (_0x0003.open) {
            const _0x007c = _0x0003.view === 'conversation' ? _0x007f() : null;
            if (_0x007c)
                _0x0175(_0x007c);
            _0x0092(_0x007c);
        }
    }
    function _0x007d() {
        return _0x0003.data.rooms?.find((_0x007e) => _0x007e.code === _0x0003.selectedRoomCode) || null;
    }
    function _0x007f() {
        if (_0x0003.view === 'selfConversation')
            return 'self:me';
        return _0x0003.selectedRoomCode ? _0x000b(_0x0003.selectedRoomCode, _0x0003.selectedUserId) : null;
    }
    function _0x0080() {
        const _0x0081 = _0x0003.data.rooms || [];
        const _0x0082 = _0x0081.find((_0x0083) => _0x0083.code === _0x0003.selectedRoomCode) || null;
        if (!_0x0082) {
            _0x0003.selectedRoomCode = null;
            _0x0003.selectedUserId = null;
            if (_0x0003.view !== 'rooms' && _0x0003.view !== 'selfConversation')
                _0x0003.view = 'rooms';
            return;
        }
        if (_0x0003.selectedUserId) {
            const _0x0084 = _0x0082.users?.some((_0x0085) => _0x0085.id === _0x0003.selectedUserId && !_0x0085.self);
            if (!_0x0084) {
                _0x0003.selectedUserId = null;
                if (_0x0003.view === 'conversation')
                    _0x0003.view = 'room';
            }
        }
    }
    function _0x0086() {
        const _0x0087 = _0x000f('messageInput');
        if (!_0x0087 || _0x0002.activeElement !== _0x0087)
            return null;
        return {
            key: _0x007f(),
            start: Number.isInteger(_0x0087.selectionStart) ? _0x0087.selectionStart : _0x0087.value.length,
            end: Number.isInteger(_0x0087.selectionEnd) ? _0x0087.selectionEnd : _0x0087.value.length,
            direction: _0x0087.selectionDirection || 'none',
        };
    }
    function _0x0088(_0x0089 = null, _0x008a = false) {
        if (!_0x0003.open || !['conversation', 'selfConversation'].includes(_0x0003.view))
            return;
        if (!_0x008a && (!_0x0089 || _0x0089.key !== _0x007f()))
            return;
        queueMicrotask(() => {
            const _0x008b = _0x000f('messageInput');
            if (!_0x008b || _0x008b.disabled || !_0x0003.open)
                return;
            try {
                _0x008b.focus({ preventScroll: true });
            }
            catch (_0x008c) {
                try {
                    _0x008b.focus();
                }
                catch (_0x008d) { }
            }
            const _0x008e = _0x008b.value.length;
            const _0x008f = _0x008a ? _0x008e : Math.max(0, Math.min(_0x008e, Number(_0x0089?.start ?? _0x008e)));
            const _0x0090 = _0x008a ? _0x008e : Math.max(_0x008f, Math.min(_0x008e, Number(_0x0089?.end ?? _0x008f)));
            try {
                _0x008b.setSelectionRange(_0x008f, _0x0090, _0x008a ? 'none' : (_0x0089?.direction || 'none'));
            }
            catch (_0x0091) { }
        });
    }
    function _0x0092(_0x0093 = null, _0x0094 = undefined) {
        const _0x0095 = _0x0094 === undefined ? _0x0086() : _0x0094;
        if (_0x000f('messageInput'))
            _0x00aa();
        _0x0096();
        _0x00a1();
        if (Number(_0x0003.data.accessMode) === 1 || Number(_0x0003.data.accessMode) === 2) {
            _0x0099();
            return;
        }
        if (!_0x0003.data.termsAccepted) {
            _0x009b();
            return;
        }
        if (!_0x0003.data.authenticated) {
            _0x00a4();
            return;
        }
        if (!_0x000f('chatMain'))
            _0x00a9();
        _0x00ad(_0x0093);
        _0x0088(_0x0095);
    }
    function _0x0096() {
        const _0x0097 = _0x0003.data.connectionStatus || 'locked';
        const _0x0098 = { online: '연결됨', connecting: '연결 중', reconnecting: '재연결 중', offline: '오프라인', locked: '연결 필요', maintenance: '점검중', disabled: '사용 불가' };
        _0x000f('statusText').textContent = _0x0098[_0x0097] || _0x0097;
        _0x000f('statusDot').className = `dot ${_0x0097 === 'online' ? 'online' : ['connecting', 'reconnecting'].includes(_0x0097) ? 'connecting' : ''}`;
    }
    function _0x0099() {
        const _0x009a = Number(_0x0003.data.accessMode) === 1;
        _0x0012.innerHTML = `<div class="access-screen"><section class="access-card"><div class="access-symbol">${_0x009a ? '🛠️' : '⛔'}</div><h2>${_0x009a ? '점검중' : '사용 불가'}</h2><p>${_0x009a ? '현재 확장 프로그램을 점검하고 있습니다. 점검이 끝나면 자동으로 다시 사용할 수 있습니다.' : '현재 이 확장 프로그램의 사용이 제한되어 있습니다. 상태가 정상으로 변경되면 자동으로 다시 확인합니다.'}</p></section></div>`;
    }
    function _0x009b() {
        if (_0x000f('termsAccept'))
            return;
        _0x0012.innerHTML = `<div class="terms-screen"><section class="terms-card"><h2>이용 전 확인</h2><p>채팅 기능을 사용하기 전에 아래 내용을 확인해 주세요.</p><div class="terms-box">이 메신저가 정상적인 소통 목적이 아닌 학교폭력 등 부적절한 목적 또는 방식으로 사용되는 경우, 그 행위와 그로 인한 책임은 해당 이용자에게 있으며 개발자는 그러한 사용을 의도하거나 승인하지 않습니다.</div><p class="terms-note">채팅은 복구를 위해 브라우저 내부에 저장되며, 동기화 백업에는 메시지 내용이 암호화되어 저장될 수 있습니다. 전체 백업은 복구 코드로 암호화되어 설정 서버의 백업 저장소로 전송될 수 있습니다. 사진을 첨부하면 원본은 채팅 전송 과정과 별개로 브라우저에서 AES-GCM 암호화된 뒤 img.bloupla.net 임시 저장소에 최대 48시간 보관될 수 있으며, 저장소에는 원본 사진 평문이 전송되지 않습니다.</p><button class="primary" id="termsAccept" type="button">확인하고 계속</button></section></div>`;
        _0x000f('termsAccept').addEventListener('click', async () => {
            const _0x009c = _0x000f('termsAccept');
            _0x009c.disabled = true;
            try {
                await _0x0019('ACCEPT_TERMS');
            }
            catch (_0x009d) {
                _0x009c.disabled = false;
                _0x01ba(_0x009d?.message || String(_0x009d), true);
            }
        });
    }
    function _0x009e() {
        let _0x009f = 0;
        for (const _0x00a0 of _0x0003.unread.values())
            _0x009f += _0x00a0;
        return _0x009f;
    }
    function _0x00a1() {
        const _0x00a2 = _0x009e();
        const _0x00a3 = _0x000f('launcherBadge');
        _0x00a3.hidden = !_0x00a2;
        _0x00a3.textContent = _0x00a2 > 99 ? '99+' : String(_0x00a2);
    }
    function _0x00a4() {
        if (_0x000f('authForm'))
            return;
        _0x0012.innerHTML = `<div class="auth"><form class="authcard" id="authForm"><h2>채팅 연결</h2><p>이름과 연결 비밀번호로 로그인하면 모든 사이트에서 같은 채팅방을 바로 사용할 수 있습니다.</p><div class="field"><label>이름</label><input id="authName" maxlength="24" value="${_0x0005(_0x0003.data.identity?.name || '사용자')}" autocomplete="nickname"></div><div class="field"><label>연결 비밀번호</label><input id="authPassword" type="password" maxlength="256" autocomplete="current-password" placeholder="SHA-256 변환 전 원래 비밀번호"></div><button class="primary" id="authSubmit" type="submit" style="width:100%">연결</button><div class="autherror" id="authError"></div></form></div>`;
        _0x000f('authForm').addEventListener('submit', async (_0x00a5) => {
            _0x00a5.preventDefault();
            const _0x00a6 = _0x000f('authSubmit');
            const _0x00a7 = _0x000f('authError');
            _0x00a6.disabled = true;
            _0x00a7.textContent = '연결 중…';
            try {
                await _0x0019('AUTH', { name: _0x000f('authName').value, password: _0x000f('authPassword').value }, 20000);
                _0x000f('authPassword').value = '';
                _0x00a7.textContent = '';
            }
            catch (_0x00a8) {
                _0x00a7.textContent = _0x00a8?.message || String(_0x00a8);
            }
            finally {
                _0x00a6.disabled = false;
            }
        });
    }
    function _0x00a9() {
        _0x0012.innerHTML = `<div class="main" id="chatMain"><div id="mainView" style="height:100%;min-height:0"></div></div>`;
    }
    function _0x00aa() {
        const _0x00ab = _0x000f('messageInput');
        const _0x00ac = _0x007f();
        if (_0x00ab && _0x00ac)
            _0x0003.drafts.set(_0x00ac, _0x00ab.value);
    }
    function _0x00ad(_0x00ae = null) {
        _0x01e0();
        if (_0x0003.view === 'rooms' || _0x0003.view === 'room')
            _0x0003.activeScrollKey = null;
        const _0x00af = _0x000f('mainView');
        if (!_0x00af)
            return;
        if (_0x0003.view === 'rooms')
            _0x00c1(_0x00af);
        else if (_0x0003.view === 'room')
            _0x00d1(_0x00af);
        else if (_0x0003.view === 'selfConversation')
            _0x014f(_0x00af, _0x00ae);
        else
            _0x0141(_0x00af, _0x00ae);
    }
    function _0x00b0(_0x00b1, _0x00b2, _0x00b3 = 'avatar') {
        const _0x00b4 = _0x0005(String(_0x00b1 || '?').slice(0, 1));
        const _0x00b5 = typeof _0x00b2 === 'string' && _0x00b2.startsWith('data:image/')
            ? `<img src="${_0x0005(_0x00b2)}" alt="">`
            : _0x00b4;
        return `<span class="${_0x00b3}">${_0x00b5}</span>`;
    }
    function _0x00b6(_0x00b7) {
        const _0x00b8 = Array.isArray(_0x00b7) ? _0x00b7.filter((_0x00b9) => _0x00b9?.id) : [];
        const _0x00ba = _0x00b8.slice(0, 4);
        if (!_0x00ba.length)
            return '<span class="group-avatar n1"><span class="ga">?</span></span>';
        const _0x00bb = _0x00b8.length > 4 ? 'nmore' : `n${_0x00ba.length}`;
        const _0x00bc = _0x00ba.map((_0x00bd) => {
            const _0x00be = _0x0005(String(_0x00bd.name || '?').slice(0, 1));
            const _0x00bf = typeof _0x00bd.avatarDataUrl === 'string' && _0x00bd.avatarDataUrl.startsWith('data:image/')
                ? `<img src="${_0x0005(_0x00bd.avatarDataUrl)}" alt="">`
                : _0x00be;
            return `<span class="ga" title="${_0x0005(_0x00bd.name || '사용자')}">${_0x00bf}</span>`;
        }).join('');
        const _0x00c0 = _0x00b8.length > 4 ? `<span class="more">+${_0x00b8.length - 4}</span>` : '';
        return `<span class="group-avatar ${_0x00bb}">${_0x00bc}${_0x00c0}</span>`;
    }
    function _0x00c1(_0x00c2) {
        const _0x00c3 = _0x0003.data.identity?.name || '사용자';
        const _0x00c4 = _0x0003.data.identity?.avatarDataUrl || '';
        const _0x00c5 = _0x0003.data.rooms || [];
        const _0x00c6 = _0x00c5.reduce((_0x00c7, _0x00c8) => _0x00c7 + (_0x00c8.users || []).length, 0);
        _0x00c2.innerHTML = `<section class="navview"><header class="navhead"><span class="navtitle"><b>채팅</b><small>여러 방을 동시에 연결하고 대화를 이어갈 수 있습니다.</small></span></header><div class="navbody"><div class="rooms-home"><div class="home-profile">${_0x00b0(_0x00c3, _0x00c4)}<span class="profilecopy"><b>${_0x0005(_0x00c3)}</b><small>내 프로필</small></span><span class="profile-actions"><button class="tinybtn" id="editProfilePhoto">사진</button><button class="tinybtn" id="editName">이름</button></span></div><div class="home-stats"><div class="home-stat"><b>${_0x00c5.length}</b><small>참가 중인 방</small></div><div class="home-stat"><b>${_0x00c6}</b><small>현재 연결 인원</small></div><div class="home-stat"><b>${_0x009e()}</b><small>읽지 않은 메시지</small></div></div><div class="section-label"><span>내 공간</span></div><button class="self-chat-card" id="openSelfChat">${_0x00b0(_0x00c3, _0x00c4, 'member-avatar')}<span class="member-copy"><b>나와의 채팅</b><small>메모와 사진을 나에게 저장</small></span><span class="member-arrow">›</span></button><div class="section-label"><span>채팅방</span></div><div class="home-actions"><button id="createRoom">＋ 방 만들기</button><button id="joinRoom">방 참가</button></div><div class="room-list" id="roomList">${_0x00c5.length ? _0x00c5.map(_0x00cc).join('') : '<div class="empty-rooms">연결된 방이 없습니다.<br>방을 만들거나 4자리 방 번호로 참가해 보세요.</div>'}</div><div class="section-label"><span>백업 및 복구</span></div><div class="backup-actions"><button id="exportBackup">백업 내보내기</button><button id="importBackup">파일 복구</button></div><div class="section-label"><span>표시 단축키</span></div><div class="shortcut-card"><div class="shortcut-main"><span class="shortcut-copy"><b>이 페이지에서 빠르게 숨기기</b><small>${_0x0005(_0x0032())} 키를 빠르게 두 번 누르면 채팅창과 아이콘을 숨기거나 다시 표시합니다.</small></span><select class="shortcut-select" id="shortcutKeySelect" aria-label="숨김 단축키">${_0x0018.map((_0x00c9) => `<option value="${_0x00c9}" ${_0x00c9 === _0x0003.shortcutKey ? 'selected' : ''}>${_0x0005(_0x0032(_0x00c9))} ×2</option>`).join('')}</select><label class="switch" title="단축키 켜기/끄기"><input id="shortcutEnabled" type="checkbox" ${_0x0003.shortcutEnabled ? 'checked' : ''}><span class="switch-track"></span></label></div></div></div></div></section>`;
        _0x000f('editName').addEventListener('click', _0x01af);
        _0x000f('editProfilePhoto').addEventListener('click', _0x019b);
        _0x000f('openSelfChat').addEventListener('click', () => {
            _0x00aa();
            _0x0003.selectedRoomCode = null;
            _0x0003.selectedUserId = null;
            _0x0003.view = 'selfConversation';
            _0x00ad();
        });
        _0x000f('createRoom').addEventListener('click', _0x01b0);
        _0x000f('joinRoom').addEventListener('click', _0x01b2);
        _0x000f('exportBackup').addEventListener('click', _0x01a4);
        _0x000f('importBackup').addEventListener('click', _0x01aa);
        _0x000f('shortcutEnabled').addEventListener('change', async () => {
            _0x0003.shortcutEnabled = Boolean(_0x000f('shortcutEnabled').checked);
            await _0x003a();
        });
        _0x000f('shortcutKeySelect').addEventListener('change', async () => {
            _0x0003.shortcutKey = _0x0034(_0x000f('shortcutKeySelect').value);
            await _0x003a();
            _0x00ad();
        });
        _0x000f('roomList')?.addEventListener('click', (_0x00ca) => {
            const _0x00cb = _0x00ca.target.closest('[data-open-room]');
            if (!_0x00cb)
                return;
            _0x00cf(_0x00cb.dataset.openRoom);
        });
    }
    function _0x00cc(_0x00cd) {
        const _0x00ce = _0x0159(_0x00cd.code);
        return `<button class="room-card" data-open-room="${_0x0005(_0x00cd.code)}"><span class="roomicon">${_0x0005(_0x00cd.code)}</span><span class="roomcopy"><b>${_0x0005(_0x00cd.name)} ${_0x00cd.isLeader ? '<span class="role">대표</span>' : ''}</b><small>#${_0x0005(_0x00cd.code)} · ${(_0x00cd.users || []).length}명 · ${_0x00cd.status === 'online' ? '연결됨' : _0x00cd.status === 'locked' ? '비밀번호 필요' : '연결 중'}</small></span>${_0x00ce ? `<span class="treebadge">${_0x00ce > 99 ? '99+' : _0x00ce}</span>` : ''}<span class="room-enter">들어가기 ›</span></button>`;
    }
    function _0x00cf(_0x00d0) {
        _0x00aa();
        _0x0003.selectedRoomCode = _0x00d0;
        _0x0003.selectedUserId = null;
        _0x0003.view = 'room';
        _0x00ad();
    }
    function _0x00d1(_0x00d2) {
        const _0x00d3 = _0x007d();
        if (!_0x00d3) {
            _0x0003.view = 'rooms';
            _0x00c1(_0x00d2);
            return;
        }
        const _0x00d4 = _0x0003.data.identity?.id;
        const _0x00d5 = _0x0003.unread.get(_0x000b(_0x00d3.code, null)) || 0;
        _0x00d2.innerHTML = `<section class="navview"><header class="navhead"><button class="backbtn" id="backToRooms" aria-label="방 목록으로">←</button><span class="navtitle"><b>${_0x0005(_0x00d3.name)}</b><small>#${_0x0005(_0x00d3.code)} · ${(_0x00d3.users || []).length}명${_0x00d3.isLeader ? ' · 내가 대표' : _0x00d3.leaderName ? ` · 대표 ${_0x0005(_0x00d3.leaderName)}` : ''}</small></span></header><div class="navbody"><div class="room-detail"><section class="room-summary"><h3>${_0x0005(_0x00d3.name)} ${_0x00d3.isLeader ? '<span class="role">대표</span>' : ''}</h3><p>방 번호 #${_0x0005(_0x00d3.code)} · ${_0x00d3.status === 'online' ? '연결됨' : _0x00d3.status === 'locked' ? '비밀번호 확인 필요' : '연결 중'}</p><div class="room-detail-actions">${_0x00d3.isLeader ? '<button data-room-tool="rename">방 이름 수정</button>' : ''}<button class="danger" data-room-tool="leave">방 나가기</button></div></section><div class="member-list" id="memberList"><button class="member-row all" data-open-chat="">${_0x00b6(_0x00d3.users || [])}<span class="member-copy"><b>전체 채팅</b><small>이 방의 모든 사용자와 대화</small></span>${_0x00d5 ? `<span class="treebadge">${_0x00d5 > 99 ? '99+' : _0x00d5}</span>` : ''}<span class="member-arrow">›</span></button>${(_0x00d3.users || []).map((_0x00d6) => _0x00d9(_0x00d3, _0x00d6, _0x00d4)).join('')}</div></div></div></section>`;
        _0x000f('backToRooms').addEventListener('click', () => { _0x0003.view = 'rooms'; _0x0003.selectedUserId = null; _0x00ad(); });
        _0x00d2.querySelector('[data-room-tool="rename"]')?.addEventListener('click', () => _0x01b6(_0x00d3));
        _0x00d2.querySelector('[data-room-tool="leave"]')?.addEventListener('click', () => _0x01b8(_0x00d3));
        _0x000f('memberList').addEventListener('click', (_0x00d7) => {
            const _0x00d8 = _0x00d7.target.closest('[data-open-chat]');
            if (!_0x00d8 || _0x00d8.disabled)
                return;
            _0x00df(_0x00d8.dataset.openChat || null);
        });
    }
    function _0x00d9(_0x00da, _0x00db, _0x00dc) {
        const _0x00dd = _0x00db.id === _0x00dc;
        const _0x00de = _0x00dd ? 0 : (_0x0003.unread.get(_0x000b(_0x00da.code, _0x00db.id)) || 0);
        return `<button class="member-row" data-open-chat="${_0x0005(_0x00db.id)}" ${_0x00dd ? 'disabled' : ''}>${_0x00b0(_0x00db.name, _0x00db.avatarDataUrl || '', 'member-avatar')}<span class="member-copy"><b>${_0x0005(_0x00db.name)} ${_0x00db.isLeader ? '<span class="role">대표</span>' : ''}${_0x00dd ? ' <span class="selftag">나</span>' : ''}</b><small>${_0x00dd ? '내 계정 · 나와의 채팅은 방 목록에서 사용' : '개인 채팅'}</small></span>${_0x00de ? `<span class="treebadge">${_0x00de > 99 ? '99+' : _0x00de}</span>` : ''}${_0x00dd ? '' : '<span class="member-arrow">›</span>'}</button>`;
    }
    function _0x00df(_0x00e0) {
        _0x00aa();
        _0x0003.selectedUserId = _0x00e0 || null;
        _0x0003.view = 'conversation';
        const _0x00e1 = _0x007f();
        _0x0175(_0x00e1);
        _0x00ad(null);
    }
    function _0x00e2(_0x00e3, _0x00e4, _0x00e5) {
        if (_0x00e3.from === _0x00e5)
            return _0x0003.data.identity?.avatarDataUrl || '';
        return _0x00e4?.users?.find((_0x00e6) => _0x00e6.id === _0x00e3.from)?.avatarDataUrl || '';
    }
    function _0x00e7(_0x00e8) {
        const _0x00e9 = [];
        const _0x00ea = new Map();
        for (const _0x00eb of _0x00e8 || []) {
            const _0x00ec = _0x00eb.imageGroupId && Number(_0x00eb.imageGroupCount || 0) > 1 ? _0x00eb.imageGroupId : '';
            if (!_0x00ec) {
                _0x00e9.push({ id: _0x00eb.id, messages: [_0x00eb], at: Number(_0x00eb.at || 0) });
                continue;
            }
            let _0x00ed = _0x00ea.get(_0x00ec);
            if (!_0x00ed) {
                _0x00ed = { id: _0x00ec, messages: [], at: Number(_0x00eb.at || 0) };
                _0x00ea.set(_0x00ec, _0x00ed);
                _0x00e9.push(_0x00ed);
            }
            _0x00ed.messages.push(_0x00eb);
            _0x00ed.at = Math.min(_0x00ed.at || Number(_0x00eb.at || 0), Number(_0x00eb.at || 0));
        }
        for (const _0x00ee of _0x00e9)
            _0x00ee.messages.sort((_0x00ef, _0x00f0) => Number(_0x00ef.imageGroupIndex || 0) - Number(_0x00f0.imageGroupIndex || 0) || Number(_0x00ef.at || 0) - Number(_0x00f0.at || 0));
        return _0x00e9.sort((_0x00f1, _0x00f2) => _0x00f1.at - _0x00f2.at);
    }
    function _0x00f3(_0x00f4) {
        const _0x00f5 = _0x00f4.messages.filter((_0x00f6) => _0x00f6.imageDataUrl).map((_0x00f7) => ({ src: _0x00f7.imageDataUrl, name: _0x00f7.imageName || '채팅 사진' }));
        if (!_0x00f5.length)
            return '';
        const _0x00f8 = `gallery-${_0x00f4.id}`;
        _0x0003.galleryMap.set(_0x00f8, _0x00f5);
        const _0x00f9 = _0x00f5.slice(0, 9);
        const _0x00fa = `g${Math.min(9, _0x00f9.length)}`;
        const _0x00fb = _0x00f5.length > 1;
        return `<div class="chat-gallery ${_0x00fb ? `multi ${_0x00fa}` : 'single'}" data-image-group="${_0x0005(_0x00f8)}">${_0x00f9.map((_0x00fc, _0x00fd) => `<span class="gallery-tile"><img class="chat-image" data-chat-image data-gallery-id="${_0x0005(_0x00f8)}" data-gallery-index="${_0x00fd}" src="${_0x0005(_0x00fc.src)}" alt="${_0x0005(_0x00fc.name)}">${_0x00fd === 8 && _0x00f5.length > 9 ? `<span class="gallery-more">+${_0x00f5.length - 9}</span>` : ''}</span>`).join('')}</div>`;
    }
    function _0x00fe(_0x00ff, _0x0100, _0x0101 = null, _0x0102 = null) {
        const _0x0103 = _0x00ff.messages[0];
        const _0x0104 = _0x0103.from === _0x0100;
        const _0x0105 = _0x00ff.messages.every((_0x0106) => Boolean(_0x0106.deleted));
        const _0x0107 = _0x00ff.messages.find((_0x0108) => _0x0108.text);
        const _0x0109 = _0x0105 ? '<div class="msg-text">삭제된 메시지입니다</div>' : `<div class="msg-text">${_0x0005(_0x0107?.text || '')}</div>`;
        const _0x010a = _0x0105 ? '' : _0x00f3(_0x00ff);
        const _0x010b = Boolean(_0x010a);
        const _0x010c = `${_0x0005(_0x0104 ? '나' : _0x0103.fromName)}${_0x0103.from === _0x0101 ? ' · 대표' : ''}`;
        const _0x010d = _0x00b0(_0x0104 ? (_0x0003.data.identity?.name || '나') : _0x0103.fromName, _0x00e2(_0x0103, _0x0102, _0x0100), 'msg-avatar');
        const _0x010e = Math.max(..._0x00ff.messages.map((_0x0110) => Number(_0x0110.at || 0)));
        const _0x01c0 = new Set();
        const _0x01c1 = new Set();
        for (const _0x01c2 of _0x00ff.messages) {
            for (const _0x01c3 of Array.isArray(_0x01c2.expectedReaderIds) ? _0x01c2.expectedReaderIds : [])
                _0x01c0.add(String(_0x01c3 || ''));
            for (const _0x01c4 of Array.isArray(_0x01c2.readBy) ? _0x01c2.readBy : [])
                _0x01c1.add(String(_0x01c4 || ''));
        }
        const _0x01c5 = _0x0104 && !_0x0105 ? [..._0x01c0].filter((_0x01c6) => _0x01c6 && !_0x01c1.has(_0x01c6)).length : 0;
        const _0x01c7 = _0x01c5 ? `<span class="read-count" title="읽지 않은 사람 ${_0x01c5}명">${_0x01c5}</span>` : '';
        const _0x01c8 = Math.min(..._0x00ff.messages.map((_0x01c9) => Number(_0x01c9.at || 0)));
        const _0x01ca = _0x0104 && !_0x0105 && Date.now() - _0x01c8 <= 5 * 60 * 1000;
        const _0x01cb = _0x01ca ? `<button class="msg-delete" type="button" data-delete-message="${_0x0005(_0x00ff.messages.map((_0x01cc) => _0x01cc.id).join(','))}">삭제</button>` : '';
        return `<article class="msg ${_0x0104 ? 'mine' : ''}">${_0x010d}<div class="msg-stack"><div class="sender">${_0x010c}</div><div class="bubble-row"><div class="bubble ${_0x0105 ? 'deleted' : (_0x010b ? `has-image${_0x00ff.messages.filter((_0x01cd) => _0x01cd.imageDataUrl).length > 1 ? ' multi' : ''}` : '')}">${_0x010a}${_0x0109}</div>${_0x01c7}</div><div class="msg-meta">${_0x01cb}<div class="time">${_0x0008(_0x010e)}</div></div></div></article>`;
    }
    function _0x010f(_0x0110, _0x0111, _0x0112 = null, _0x0113 = null) {
        _0x0003.galleryMap.clear();
        return _0x00e7(_0x0110).map((_0x0114) => _0x00fe(_0x0114, _0x0111, _0x0112, _0x0113)).join('');
    }
    function _0x0115(_0x0116) {
        const _0x0117 = _0x0003.pendingImages.get(_0x0116);
        if (!_0x0117)
            return [];
        return Array.isArray(_0x0117) ? _0x0117.filter((_0x0118) => _0x0118?.dataUrl) : (_0x0117?.dataUrl ? [_0x0117] : []);
    }
    function _0x0119(_0x011a) {
        const _0x011b = _0x0115(_0x011a);
        if (!_0x011b.length)
            return '';
        return `<div class="image-preview"><div class="image-preview-head"><span>첨부 이미지 ${_0x011b.length}개</span><button id="removeAllPendingImages" type="button">모두 제거</button></div><div class="image-grid">${_0x011b.map((_0x011c, _0x011d) => `<span class="image-thumb"><img src="${_0x0005(_0x011c.dataUrl)}" alt="첨부 사진"><button type="button" data-remove-pending-image="${_0x011d}" aria-label="이 이미지 제거">×</button><small>${_0x0005(_0x011c.name || `사진 ${_0x011d + 1}`)}</small></span>`).join('')}</div></div>`;
    }
    function _0x011e(_0x011f) {
        return _0x0003.preparingImages.has(_0x011f) ? '<div class="image-upload-status"><i></i><span>이미지 업로드 중…</span></div>' : '';
    }
    function _0x01e0() {
        const _0x01e1 = _0x000f('messages');
        if (!_0x01e1)
            return;
        const _0x01e2 = String(_0x01e1.dataset.scrollKey || '');
        if (!_0x01e2)
            return;
        const _0x01e3 = Math.max(0, _0x01e1.scrollHeight - _0x01e1.clientHeight - _0x01e1.scrollTop);
        _0x0003.scrollPositions.set(_0x01e2, { top: _0x01e1.scrollTop, atBottom: _0x01e3 <= 36 });
    }
    function _0x01e4(_0x01e5, _0x01e6) {
        if (!_0x01e5 || !_0x01e6)
            return;
        _0x01e5.dataset.scrollKey = _0x01e6;
        const _0x01e7 = _0x000f('scrollToBottom');
        const _0x01eb = _0x0003.scrollPositions.get(_0x01e6);
        const _0x01ee = _0x0003.activeScrollKey === _0x01e6;
        _0x0003.activeScrollKey = _0x01e6;
        let _0x01ef = true;
        const _0x01f0 = () => {
            _0x01e5.scrollTop = _0x01e5.scrollHeight;
        };
        const _0x01e8 = () => {
            const _0x01e9 = Math.max(0, _0x01e5.scrollHeight - _0x01e5.clientHeight - _0x01e5.scrollTop);
            const _0x01ea = _0x01e9 <= 36;
            if (!_0x01ef)
                _0x0003.scrollPositions.set(_0x01e6, { top: _0x01e5.scrollTop, atBottom: _0x01ea });
            if (_0x01e7)
                _0x01e7.hidden = _0x01ea;
        };
        if (_0x01ee && _0x01eb) {
            if (_0x01eb.atBottom)
                _0x01f0();
            else
                _0x01e5.scrollTop = Math.max(0, Math.min(Number(_0x01eb.top || 0), _0x01e5.scrollHeight - _0x01e5.clientHeight));
        }
        else {
            _0x01f0();
        }
        _0x01e5.addEventListener('scroll', _0x01e8, { passive: true });
        _0x01e7?.addEventListener('click', () => {
            _0x01e5.scrollTo({ top: _0x01e5.scrollHeight, behavior: 'smooth' });
        });
        const _0x01f1 = !_0x01ee || _0x01eb?.atBottom;
        for (const _0x01ec of _0x01e5.querySelectorAll('img')) {
            const _0x01f2 = () => {
                if (_0x01f1)
                    _0x01f0();
                _0x01e8();
            };
            if (!_0x01ec.complete)
                _0x01ec.addEventListener('load', _0x01f2, { once: true });
            else if (typeof _0x01ec.decode === 'function')
                _0x01ec.decode().then(_0x01f2).catch(() => {});
        }
        requestAnimationFrame(() => requestAnimationFrame(() => {
            if (_0x01f1)
                _0x01f0();
            _0x01ef = false;
            _0x01e8();
        }));
    }
    function _0x0120(_0x0121) {
        _0x0121?.addEventListener('click', (_0x0122) => {
            const _0x01f3 = _0x0122.target.closest('[data-delete-message]');
            if (_0x01f3) {
                const _0x01f4 = String(_0x01f3.dataset.deleteMessage || '').split(',').filter(Boolean);
                if (!_0x01f4.length)
                    return;
                const _0x01f5 = _0x007f();
                const _0x01f6 = _0x01f5 === 'self:me';
                const _0x01f7 = _0x007d();
                _0x017d('메시지 삭제', '<p style="margin:0;color:#626d7c;line-height:1.65">이 메시지를 삭제하면 채팅 내용과 첨부 이미지는 대화에서 사라지고 <b>삭제된 메시지입니다</b>로 표시됩니다.</p>', async () => {
                    await _0x0019('DELETE_MESSAGE', { code: _0x01f7?.code || '', targetUserId: _0x0003.selectedUserId || null, messageIds: _0x01f4, selfMode: _0x01f6 }, 20000);
                });
                return;
            }
            const _0x0123 = _0x0122.target.closest('[data-chat-image]');
            if (!_0x0123?.src)
                return;
            _0x0185(_0x0123.src, _0x0123.dataset.galleryId || '', Number(_0x0123.dataset.galleryIndex || 0));
        });
    }
    function _0x0124(_0x0125) {
        return new Promise((_0x0126, _0x0127) => {
            const _0x0128 = new FileReader();
            _0x0128.onload = () => _0x0126(String(_0x0128.result || ''));
            _0x0128.onerror = () => _0x0127(_0x0128.error || new Error('원본 이미지를 읽을 수 없습니다.'));
            _0x0128.readAsDataURL(_0x0125);
        });
    }
    function _0x0129(_0x012a) {
        _0x0015 = _0x0015.catch(() => { }).then(async () => {
            if (!_0x012a || !String(_0x012a.type || '').startsWith('image/') || _0x012a.size > 25 * 1024 * 1024)
                return false;
            const _0x012b = await _0x0124(_0x012a);
            await _0x0019('BACKUP_ORIGINAL_IMAGE_TEMP', { dataUrl: _0x012b, imageName: _0x012a.name || 'image' }, 70000);
            return true;
        }).catch(() => false);
    }
    function _0x012c({ key: _0x012d, disabled: _0x012e = false, placeholder: _0x012f, selfMode: _0x0130 = false }) {
        const _0x0131 = _0x000f('messageInput');
        const _0x0132 = _0x000f('sendMessage');
        const _0x0133 = _0x000f('messageImageInput');
        const _0x0134 = _0x0003.preparingImages.has(_0x012d);
        const _0x0135 = _0x0003.sending.has(_0x012d);
        _0x0131.value = _0x0003.drafts.get(_0x012d) || '';
        _0x0131.disabled = _0x012e;
        _0x0132.disabled = _0x012e || _0x0134 || _0x0135;
        _0x000f('pickImage').disabled = _0x012e || _0x0134 || _0x0135;
        if (_0x0135)
            _0x0132.textContent = _0x0130 ? '저장 중…' : '전송 중…';
        _0x0131.addEventListener('input', () => _0x0003.drafts.set(_0x012d, _0x0131.value));
        _0x0131.addEventListener('keydown', (_0x0136) => {
            if (_0x0136.key === 'Enter' && !_0x0136.shiftKey && !_0x0136.isComposing) {
                _0x0136.preventDefault();
                if (!_0x0134 && !_0x0135)
                    _0x015e(_0x0130);
            }
        });
        _0x0132.addEventListener('click', () => _0x015e(_0x0130));
        _0x000f('pickImage').addEventListener('click', () => _0x0133.click());
        _0x0133.addEventListener('change', async () => {
            const _0x0137 = [...(_0x0133.files || [])].filter((_0x0138) => String(_0x0138.type || '').startsWith('image/'));
            if (!_0x0137.length)
                return;
            const _0x0139 = _0x0115(_0x012d);
            if (_0x0139.length + _0x0137.length > 12) {
                _0x01ba('한 번에 첨부할 수 있는 이미지는 최대 12개입니다.', true);
                return;
            }
            _0x00aa();
            _0x0003.preparingImages.add(_0x012d);
            _0x00ad(_0x012d);
            const _0x013a = [];
            try {
                for (const _0x013b of _0x0137) {
                    const _0x013c = await _0x018d(_0x013b, 960, 430000);
                    _0x013a.push({ dataUrl: _0x013c, name: _0x013b.name || '사진', originalFile: _0x013b });
                }
                _0x0003.pendingImages.set(_0x012d, [..._0x0139, ..._0x013a]);
            }
            catch (_0x013d) {
                if (_0x013a.length)
                    _0x0003.pendingImages.set(_0x012d, [..._0x0139, ..._0x013a]);
                _0x01ba(_0x013d?.message || String(_0x013d), true);
            }
            finally {
                _0x0003.preparingImages.delete(_0x012d);
                _0x00ad(_0x012d);
            }
        });
        _0x000f('removeAllPendingImages')?.addEventListener('click', () => {
            _0x0003.pendingImages.delete(_0x012d);
            _0x00aa();
            _0x00ad(_0x012d);
        });
        _0x0002.querySelectorAll('[data-remove-pending-image]').forEach((_0x013e) => {
            _0x013e.addEventListener('click', () => {
                const _0x013f = Number(_0x013e.dataset.removePendingImage);
                const _0x0140 = _0x0115(_0x012d);
                if (!Number.isInteger(_0x013f) || _0x013f < 0 || _0x013f >= _0x0140.length)
                    return;
                _0x0140.splice(_0x013f, 1);
                if (_0x0140.length)
                    _0x0003.pendingImages.set(_0x012d, _0x0140);
                else
                    _0x0003.pendingImages.delete(_0x012d);
                _0x00aa();
                _0x00ad(_0x012d);
            });
        });
        _0x0131.placeholder = _0x012f;
    }
    function _0x01f8(_0x01f9) {
        clearTimeout(_0x0003.deleteExpiryTimer);
        _0x0003.deleteExpiryTimer = null;
        const _0x01fa = _0x0003.data.identity?.id;
        const _0x01fb = Date.now();
        let _0x01fc = Infinity;
        for (const _0x01fd of _0x01f9 || []) {
            if (_0x01fd.from !== _0x01fa || _0x01fd.deleted)
                continue;
            const _0x01fe = Number(_0x01fd.at || 0) + 5 * 60 * 1000 - _0x01fb;
            if (_0x01fe > 0)
                _0x01fc = Math.min(_0x01fc, _0x01fe);
        }
        if (!Number.isFinite(_0x01fc))
            return;
        _0x0003.deleteExpiryTimer = setTimeout(() => {
            if (_0x0003.open && (_0x0003.view === 'conversation' || _0x0003.view === 'self')) {
                _0x00aa();
                _0x00ad();
            }
        }, Math.max(60, _0x01fc + 80));
    }
    function _0x0141(_0x0142, _0x0143 = null) {
        const _0x0144 = _0x007d();
        if (!_0x0144) {
            _0x0003.view = 'rooms';
            _0x00c1(_0x0142);
            return;
        }
        const _0x0145 = _0x0003.data.identity?.id;
        const _0x0146 = _0x0003.selectedUserId ? _0x0144.users?.find((_0x0147) => _0x0147.id === _0x0003.selectedUserId) : null;
        if (_0x0003.selectedUserId && !_0x0146) {
            _0x0003.selectedUserId = null;
            _0x0003.view = 'room';
            _0x00d1(_0x0142);
            return;
        }
        const _0x0148 = _0x0146 ? _0x0146.name : `${_0x0144.name} · 전체`;
        const _0x0149 = _0x0146 ? `#${_0x0144.code} · 개인 채팅${_0x0146.isLeader ? ' · 대표' : ''}` : `#${_0x0144.code} · ${(_0x0144.users || []).length}명`;
        const _0x014a = (_0x0144.messages || []).filter((_0x014b) => {
            if (!_0x0146)
                return !_0x014b.to;
            return (_0x014b.from === _0x0145 && _0x014b.to === _0x0146.id) || (_0x014b.from === _0x0146.id && _0x014b.to === _0x0145);
        });
        const _0x014c = _0x007f();
        const _0x014d = _0x0144.status === 'locked' ? '연결 비밀번호를 다시 확인하세요' : _0x0146 ? `${_0x0146.name}에게 메시지` : `${_0x0144.name} 전체에 메시지`;
        _0x0142.innerHTML = `<section class="conversation-view"><header class="navhead"><button class="backbtn" id="backToRoom" aria-label="방으로 돌아가기">←</button><span class="navtitle"><b>${_0x0005(_0x0148)}</b><small>${_0x0005(_0x0149)}</small></span></header><div class="messages" id="messages">${_0x014a.length ? _0x010f(_0x014a, _0x0145, _0x0144.leaderId, _0x0144) : '<div class="empty">아직 메시지가 없습니다.</div>'}</div><button class="scroll-bottom-btn" id="scrollToBottom" type="button" aria-label="맨 아래로 이동" title="맨 아래로" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"></path><path d="M5 19h14"></path></svg></button><footer class="compose">${_0x011e(_0x014c)}${_0x0119(_0x014c)}<div class="composerow"><button class="primary photo-btn" id="pickImage" type="button" aria-label="사진 첨부">＋</button><input id="messageImageInput" type="file" accept="image/*" multiple hidden><input id="messageInput" maxlength="2000" autocomplete="off"><button class="primary" id="sendMessage">전송</button></div></footer></section>`;
        _0x000f('backToRoom').addEventListener('click', () => {
            _0x00aa();
            _0x0003.view = 'room';
            _0x0003.selectedUserId = null;
            _0x00ad();
        });
        _0x012c({ key: _0x014c, disabled: _0x0144.status === 'locked', placeholder: _0x014d, selfMode: false });
        const _0x014e = _0x000f('messages');
        _0x0120(_0x014e);
        _0x01e4(_0x014e, _0x014c);
        _0x01f8(_0x014a);
    }
    function _0x014f(_0x0150, _0x0151 = null) {
        const _0x0152 = _0x0003.data.identity?.id;
        const _0x0153 = 'self:me';
        const _0x0154 = _0x0003.data.selfMessages || [];
        _0x0150.innerHTML = `<section class="conversation-view"><header class="navhead"><button class="backbtn" id="backFromSelf" aria-label="채팅방 목록으로">←</button><span class="navtitle"><b>나와의 채팅</b><small>메모 · 사진 보관함</small></span></header><div class="messages" id="messages">${_0x0154.length ? _0x010f(_0x0154, _0x0152, null, null) : '<div class="empty">나에게 메모나 사진을 남겨보세요.</div>'}</div><button class="scroll-bottom-btn" id="scrollToBottom" type="button" aria-label="맨 아래로 이동" title="맨 아래로" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"></path><path d="M5 19h14"></path></svg></button><footer class="compose">${_0x011e(_0x0153)}${_0x0119(_0x0153)}<div class="composerow"><button class="primary photo-btn" id="pickImage" type="button" aria-label="사진 첨부">＋</button><input id="messageImageInput" type="file" accept="image/*" multiple hidden><input id="messageInput" maxlength="2000" autocomplete="off"><button class="primary" id="sendMessage">저장</button></div></footer></section>`;
        _0x000f('backFromSelf').addEventListener('click', () => {
            _0x00aa();
            _0x0003.view = 'rooms';
            _0x00ad();
        });
        _0x012c({ key: _0x0153, disabled: false, placeholder: '나에게 메모하기', selfMode: true });
        const _0x0155 = _0x000f('messages');
        _0x0120(_0x0155);
        _0x01e4(_0x0155, _0x0153);
        _0x01f8(_0x0154);
    }
    function _0x0156(_0x0157) {
        const _0x0158 = _0x0003.unread.get(_0x0157) || 0;
        return _0x0158 ? `<span class="treebadge">${_0x0158 > 99 ? '99+' : _0x0158}</span>` : '';
    }
    function _0x0159(_0x015a) {
        let _0x015b = 0;
        for (const [_0x015c, _0x015d] of _0x0003.unread)
            if (_0x015c.startsWith(`${_0x015a}:`))
                _0x015b += _0x015d;
        return _0x015b;
    }
    async function _0x015e(_0x015f = false) {
        const _0x0160 = _0x000f('messageInput');
        if (!_0x0160)
            return;
        const _0x0161 = _0x007f();
        if (!_0x0161 || _0x0003.preparingImages.has(_0x0161) || _0x0003.sending.has(_0x0161))
            return;
        const _0x0162 = _0x0160.value.trim();
        const _0x0163 = _0x0115(_0x0161);
        if (!_0x0162 && !_0x0163.length)
            return;
        const _0x0164 = _0x0160.value;
        for (const _0x0165 of _0x0163)
            if (_0x0165?.originalFile)
                _0x0129(_0x0165.originalFile);
        const _0x0166 = _0x015f ? null : _0x007d();
        if (!_0x015f && (!_0x0166 || _0x0003.view !== 'conversation'))
            return;
        _0x0003.sending.add(_0x0161);
        _0x0160.value = '';
        _0x0003.drafts.set(_0x0161, '');
        _0x00ad(_0x0161);
        const _0x0167 = _0x0163.length ? _0x0163 : [null];
        const _0x0168 = _0x0163.length > 1 ? `ig-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}` : '';
        let _0x0169 = 0;
        try {
            for (let _0x016a = 0; _0x016a < _0x0167.length; _0x016a += 1) {
                const _0x016b = _0x0167[_0x016a];
                const _0x016c = {
                    text: _0x016a === 0 ? _0x0162 : '',
                    imageDataUrl: _0x016b?.dataUrl || '',
                    imageName: _0x016b?.name || '',
                    imageGroupId: _0x0168,
                    imageGroupIndex: _0x0168 ? _0x016a : 0,
                    imageGroupCount: _0x0168 ? _0x0167.length : 0,
                };
                if (!_0x015f) {
                    _0x016c.code = _0x0166.code;
                    _0x016c.targetUserId = _0x0003.selectedUserId || null;
                }
                await _0x0019(_0x015f ? 'SEND_SELF_CHAT' : 'SEND_CHAT', _0x016c, 20000);
                _0x0169 += 1;
            }
            _0x0003.pendingImages.delete(_0x0161);
        }
        catch (_0x016d) {
            if (_0x0163.length) {
                const _0x016e = _0x0163.slice(_0x0169);
                if (_0x016e.length)
                    _0x0003.pendingImages.set(_0x0161, _0x016e);
                else
                    _0x0003.pendingImages.delete(_0x0161);
            }
            if (_0x0169 === 0)
                _0x0003.drafts.set(_0x0161, _0x0164);
            _0x01ba(_0x016d?.message || String(_0x016d), true);
        }
        finally {
            _0x0003.sending.delete(_0x0161);
            _0x00ad(_0x0161);
            _0x0088({ key: _0x0161 }, true);
        }
    }
    function _0x016f(_0x0170) {
        if (!_0x0170 || _0x0170.from === _0x0003.data.identity?.id)
            return;
        const _0x0171 = _0x0170.to ? _0x0170.from : null;
        const _0x0172 = _0x000b(_0x0170.roomCode, _0x0171);
        if (_0x0003.open && _0x0003.view === 'conversation' && _0x007f() === _0x0172) {
            _0x0175(_0x0172);
            return;
        }
        const _0x0173 = _0x0170.imageGroupId && Number(_0x0170.imageGroupCount || 0) > 1 ? `${_0x0172}:${_0x0170.imageGroupId}` : '';
        if (!_0x0173 || !_0x0003.unreadGroups.has(_0x0173)) {
            if (_0x0173)
                _0x0003.unreadGroups.add(_0x0173);
            _0x0003.unread.set(_0x0172, (_0x0003.unread.get(_0x0172) || 0) + 1);
            _0x00a1();
        }
        if (_0x000f('mainView') && _0x0003.data.authenticated) {
            const _0x0174 = _0x0086();
            _0x00aa();
            _0x00ad();
            _0x0088(_0x0174);
        }
    }
    function _0x0175(_0x0176) {
        if (!_0x0176)
            return;
        _0x0003.unread.delete(_0x0176);
        for (const _0x0177 of [..._0x0003.unreadGroups])
            if (_0x0177.startsWith(`${_0x0176}:`))
                _0x0003.unreadGroups.delete(_0x0177);
        _0x00a1();
        if (_0x0176 !== 'self:me') {
            const _0x01c8 = _0x0176.indexOf(':');
            const _0x01c9 = _0x01c8 >= 0 ? _0x0176.slice(0, _0x01c8) : _0x0176;
            const _0x01ca = _0x01c8 >= 0 ? _0x0176.slice(_0x01c8 + 1) : 'all';
            if (/^\d{4}$/.test(_0x01c9))
                _0x0019('MARK_READ', { code: _0x01c9, targetUserId: _0x01ca && _0x01ca !== 'all' ? _0x01ca : null }, 10000).catch(() => { });
        }
    }
    function _0x0178(_0x0179) {
        if (!_0x0179?.available || !_0x0179.version)
            return;
        _0x017d('새 버전 업데이트', `<div style="display:grid;gap:12px"><div style="padding:14px;border:1px solid #e2e7ee;border-radius:14px;background:#f8fafc"><div style="font-size:11px;color:#7a8493">새 버전을 찾았습니다.</div><div style="margin-top:4px;font-size:18px;font-weight:850;color:#263140">v${_0x0005(_0x0179.currentVersion || '')} → v${_0x0005(_0x0179.version)}</div></div><p style="margin:0;color:#5f6b7b;font-size:10px;line-height:1.65">업데이트 화면이 열리면 최신 message_Vx.x.x.zip이 기본 다운로드됩니다. 다운로드가 끝나면 ZIP을 압축 해제하지 말고 화면의 ‘ZIP 불러오기’를 눌러 받은 ZIP 파일을 선택하세요. ZIP 내부 검증 후 자동 압축 해제하여 확장 폴더 전체를 갱신합니다.</p></div>`, async () => {
            await _0x0019('OPEN_UPDATER', {}, 20000);
        });
        _0x000f('modalConfirm').textContent = 'ZIP 업데이트';
        _0x000f('modalCancel').textContent = '나중에';
    }
    async function _0x017a() {
        try {
            const _0x017b = await _0x0019('CHECK_UPDATE', {}, 20000);
            if (_0x017b?.available)
                _0x0178(_0x017b);
        }
        catch (_0x017c) { }
    }
    function _0x017d(_0x017e, _0x017f, _0x0180) {
        _0x0003.modalLocked = false;
        _0x000f('modalCancel').hidden = false;
        _0x000f('modalCancel').textContent = '취소';
        _0x000f('modalConfirm').disabled = false;
        _0x000f('modalConfirm').textContent = '확인';
        _0x000f('modalTitle').textContent = _0x017e;
        _0x000f('modalContent').innerHTML = _0x017f;
        _0x000f('modalError').textContent = '';
        _0x0014 = _0x0180;
        _0x000f('modalBack').hidden = false;
        queueMicrotask(() => _0x000f('modalContent').querySelector('input')?.focus());
    }
    function _0x0181(_0x0182 = false) {
        if (_0x0003.modalLocked && !_0x0182)
            return;
        _0x0003.modalLocked = false;
        _0x000f('modalBack').hidden = true;
        _0x000f('modalContent').innerHTML = '';
        _0x000f('modalError').textContent = '';
        _0x000f('modalCancel').hidden = false;
        _0x000f('modalConfirm').textContent = '확인';
        _0x000f('modalConfirm').classList.remove('countdown');
        _0x0014 = null;
    }
    function _0x0183() {
        const _0x0184 = _0x0003.lightboxImages.length;
        if (!_0x0184)
            return;
        _0x0003.lightboxIndex = (_0x0003.lightboxIndex + _0x0184) % _0x0184;
        _0x000f('lightboxImage').src = _0x0003.lightboxImages[_0x0003.lightboxIndex].src;
        _0x000f('lightboxImage').alt = _0x0003.lightboxImages[_0x0003.lightboxIndex].name || '채팅 사진 크게 보기';
        _0x000f('lightboxCounter').textContent = `${_0x0003.lightboxIndex + 1} / ${_0x0184}`;
        _0x000f('lightboxPrev').hidden = _0x0184 <= 1;
        _0x000f('lightboxNext').hidden = _0x0184 <= 1;
        _0x000f('lightboxCounter').hidden = _0x0184 <= 1;
    }
    function _0x0185(_0x0186, _0x0187 = '', _0x0188 = 0) {
        if (!_0x0186)
            return;
        const _0x0189 = _0x0003.galleryMap.get(_0x0187);
        _0x0003.lightboxImages = Array.isArray(_0x0189) && _0x0189.length ? _0x0189 : [{ src: _0x0186, name: '채팅 사진' }];
        _0x0003.lightboxIndex = Math.max(0, Math.min(_0x0003.lightboxImages.length - 1, Number(_0x0188) || 0));
        _0x0183();
        _0x000f('imageLightbox').hidden = false;
    }
    function _0x018a(_0x018b) {
        if (_0x000f('imageLightbox').hidden || _0x0003.lightboxImages.length <= 1)
            return;
        _0x0003.lightboxIndex += Number(_0x018b) || 0;
        _0x0183();
    }
    function _0x018c() {
        _0x000f('imageLightbox').hidden = true;
        _0x000f('lightboxImage').removeAttribute('src');
        _0x0003.lightboxImages = [];
        _0x0003.lightboxIndex = 0;
    }
    async function _0x018d(_0x018e, _0x018f = 960, _0x0190 = 430000) {
        if (!_0x018e || !String(_0x018e.type || '').startsWith('image/'))
            throw new Error('이미지 파일을 선택하세요.');
        const _0x0191 = await createImageBitmap(_0x018e);
        try {
            let _0x0192 = Math.min(1, _0x018f / Math.max(_0x0191.width, _0x0191.height));
            for (let _0x0193 = 0; _0x0193 < 6; _0x0193 += 1) {
                const _0x0194 = Math.max(1, Math.round(_0x0191.width * _0x0192));
                const _0x0195 = Math.max(1, Math.round(_0x0191.height * _0x0192));
                const _0x0196 = document.createElement('canvas');
                _0x0196.width = _0x0194;
                _0x0196.height = _0x0195;
                const _0x0197 = _0x0196.getContext('2d', { alpha: false });
                _0x0197.drawImage(_0x0191, 0, 0, _0x0194, _0x0195);
                for (const _0x0198 of [0.82, 0.72, 0.62, 0.52]) {
                    const _0x0199 = _0x0196.toDataURL('image/webp', _0x0198);
                    if (_0x0199.length <= _0x0190)
                        return _0x0199;
                }
                _0x0192 *= 0.78;
            }
        }
        finally {
            try {
                _0x0191.close();
            }
            catch (_0x019a) { }
        }
        throw new Error('사진을 충분히 압축할 수 없습니다. 더 작은 이미지를 선택하세요.');
    }
    function _0x019b() {
        const _0x019c = _0x0003.data.identity?.name || '사용자';
        const _0x019d = _0x0003.data.identity?.avatarDataUrl || '';
        _0x017d('프로필 사진', `<div class="profile-photo-preview">${_0x00b0(_0x019c, _0x019d)}<span><b>${_0x0005(_0x019c)}</b><br><small style="color:#7b8594">다른 사용자에게 표시할 프로필 사진</small></span></div><div class="field"><label>새 사진 선택</label><input id="modalProfileFile" type="file" accept="image/*"></div><label style="display:flex;gap:7px;align-items:center;font-size:10px;color:#687384"><input id="modalProfileRemove" type="checkbox"> 현재 프로필 사진 삭제</label>`, async () => {
            if (_0x000f('modalProfileRemove').checked) {
                await _0x0019('SET_PROFILE_IMAGE', { imageDataUrl: '' }, 20000);
                return;
            }
            const _0x019e = _0x000f('modalProfileFile').files?.[0];
            if (!_0x019e)
                throw new Error('새 프로필 사진을 선택하거나 삭제를 선택하세요.');
            const _0x019f = await _0x018d(_0x019e, 96, 60000);
            await _0x0019('SET_PROFILE_IMAGE', { imageDataUrl: _0x019f }, 20000);
        });
    }
    function _0x01a0() {
        const _0x01a1 = new Date();
        const _0x01a2 = (_0x01a3) => String(_0x01a3).padStart(2, '0');
        return `Junwoo-Chat-Backup-${_0x01a1.getFullYear()}${_0x01a2(_0x01a1.getMonth() + 1)}${_0x01a2(_0x01a1.getDate())}-${_0x01a2(_0x01a1.getHours())}${_0x01a2(_0x01a1.getMinutes())}${_0x01a2(_0x01a1.getSeconds())}.json`;
    }
    async function _0x01a4() {
        try {
            _0x01ba('전체 채팅 백업을 만드는 중…');
            const _0x01a5 = await _0x0019('EXPORT_BACKUP', {}, 60000);
            const _0x01a6 = new Blob([JSON.stringify(_0x01a5)], { type: 'application/json;charset=utf-8' });
            const _0x01a7 = URL.createObjectURL(_0x01a6);
            const _0x01a8 = document.createElement('a');
            _0x01a8.href = _0x01a7;
            _0x01a8.download = _0x01a0();
            _0x01a8.style.display = 'none';
            _0x0002.appendChild(_0x01a8);
            _0x01a8.click();
            _0x01a8.remove();
            setTimeout(() => URL.revokeObjectURL(_0x01a7), 30000);
            _0x01ba('백업 파일을 저장했습니다.');
        }
        catch (_0x01a9) {
            _0x01ba(_0x01a9?.message || String(_0x01a9), true);
        }
    }
    function _0x01aa() {
        _0x017d('채팅 백업 복구', `<div class="field"><label>백업 JSON 파일</label><input id="modalBackupFile" type="file" accept="application/json,.json"></div><p class="recovery-note">백업의 메시지·사진·프로필·방 정보를 현재 데이터와 병합합니다. 백업에 저장된 사용자 ID도 복구되어 대표 권한 복원에 사용됩니다.</p>`, async () => {
            const _0x01ab = _0x000f('modalBackupFile').files?.[0];
            if (!_0x01ab)
                throw new Error('복구할 백업 JSON 파일을 선택하세요.');
            if (_0x01ab.size > 250 * 1024 * 1024)
                throw new Error('백업 파일이 너무 큽니다(최대 250MB).');
            let _0x01ac;
            try {
                _0x01ac = JSON.parse(await _0x01ab.text());
            }
            catch (_0x01ad) {
                throw new Error('JSON 백업 파일을 읽을 수 없습니다.');
            }
            const _0x01ae = await _0x0019('IMPORT_BACKUP', { backup: _0x01ac }, 120000);
            _0x01ba(`${_0x01ae.imported || 0}개 메시지를 복구했습니다.`);
        });
    }
    function _0x01af() {
        _0x017d('이름 변경', `<div class="field"><label>표시 이름</label><input id="modalName" maxlength="24" value="${_0x0005(_0x0003.data.identity?.name || '')}"></div>`, async () => {
            await _0x0019('SET_NAME', { name: _0x000f('modalName').value });
        });
    }
    function _0x01b0() {
        _0x017d('새 채팅방 만들기', '<div class="field"><label>방 이름</label><input id="modalRoomName" maxlength="32" placeholder="예: 학교 프로젝트"></div><p style="margin:4px 0 0;color:#7e8898;font-size:10px">4자리 숫자 방 번호는 자동으로 생성됩니다. 방을 만든 사람이 대표입니다.</p>', async () => {
            const _0x01b1 = await _0x0019('CREATE_ROOM', { name: _0x000f('modalRoomName').value });
            _0x0003.selectedRoomCode = _0x01b1.code;
            _0x0003.selectedUserId = null;
            _0x0003.view = 'room';
            _0x0092(null);
        });
    }
    function _0x01b2() {
        _0x017d('채팅방 참가', '<div class="field"><label>4자리 방 번호</label><input id="modalRoomCode" inputmode="numeric" pattern="[0-9]*" maxlength="4" placeholder="1234"></div>', async () => {
            const _0x01b3 = _0x000f('modalRoomCode').value.replace(/\D/g, '').slice(0, 4);
            const _0x01b4 = await _0x0019('JOIN_ROOM', { code: _0x01b3 }, 20000);
            _0x0003.selectedRoomCode = _0x01b4.code;
            _0x0003.selectedUserId = null;
            _0x0003.view = 'room';
            _0x0092(null);
        });
        const _0x01b5 = _0x000f('modalRoomCode');
        _0x01b5?.addEventListener('input', () => { _0x01b5.value = _0x01b5.value.replace(/\D/g, '').slice(0, 4); });
    }
    function _0x01b6(_0x01b7) {
        _0x017d('방 이름 수정', `<div class="field"><label>방 이름</label><input id="modalRoomName" maxlength="32" value="${_0x0005(_0x01b7.name)}"></div><p style="margin:4px 0 0;color:#7e8898;font-size:10px">대표만 방 이름을 수정할 수 있습니다.</p>`, async () => {
            await _0x0019('RENAME_ROOM', { code: _0x01b7.code, name: _0x000f('modalRoomName').value });
        });
    }
    function _0x01b8(_0x01b9) {
        _0x017d('채팅방 나가기', `<p style="margin:0;color:#616c7e"><b>${_0x0005(_0x01b9.name)}</b> (#${_0x01b9.code})에서 나가시겠습니까?</p>${_0x01b9.isLeader ? '<p style="margin:8px 0 0;color:#ba4658;font-size:10px">대표가 나가면 이 기기에서는 해당 방 연결이 제거됩니다. 다른 사용자가 접속 중이면 기존 실시간 방은 계속 남아 있을 수 있습니다.</p>' : ''}`, async () => {
            await _0x0019('LEAVE_ROOM', { code: _0x01b9.code });
            _0x0003.selectedRoomCode = null;
            _0x0003.selectedUserId = null;
            _0x0003.view = 'rooms';
            _0x0080();
            _0x0092(null);
        });
    }
    function _0x01ba(_0x01bb, _0x01bc = false) {
        const _0x01bd = _0x000f('toast');
        _0x01bd.textContent = _0x01bb;
        _0x01bd.classList.toggle('error', Boolean(_0x01bc));
        _0x01bd.hidden = false;
        clearTimeout(_0x0013);
        _0x0013 = setTimeout(() => { _0x01bd.hidden = true; }, _0x01bc ? 4800 : 2800);
    }
    _0x0004.onDisconnect.addListener(() => {
        _0x000f('statusText').textContent = '재연결 필요';
        _0x000f('statusDot').className = 'dot';
    });
})();
