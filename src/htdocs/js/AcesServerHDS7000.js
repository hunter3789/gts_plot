/*
 * AcesServerHDS7000.js
 *
 * (c) 2022 ACES Tech, all rights reserved.
 *
 */

class ListObj {
    requested = false;
    listName;
    total = 0;
    list = [];
    readyFunc() {}

    constructor(name, func) {
        this.listName = name;
        this.readyFunc = func;
    }
    add(list, caller) {
        this.total = 0;
        if (list.Total !== undefined && list.Total != this.total)
            this.total = list.Total;
        if (list.Index == 0)
            this.list = [];
        if (list.Index >= this.list.length)
            this.list = this.list.concat(list[this.listName]);

        if (this.total == this.list.length) {
            this.requested = false;
            this.readyFunc(caller);
        }
    }
};

class AcesServerHDS7000 extends AcesServer {
    static reqHello = 'HELLO';
    static reqSessionList = 'REQ-SESSION-LIST';
    static reqClientList = 'REQ-CLIENT-LIST';
    static reqTranscoding = 'REQ-TRANSCODING';
    static reqTranscodingList = 'REQ-TRANSCODING-LIST';

    serverState = null;
    serverTimerId = null;
    intervalId = null;
    enabledSessionListRequest = true;

    constructor(needSessionList = false, showLog = true) {
        super(showLog);
        this.enabledSessionListRequest = needSessionList;
    }

    serverSessions = new ListObj('SessionList', this.onSessionListReady);
    clientSessions = new ListObj('ClientList', this.onClientListReady);
    transcodingList = [];
    sessionCount = [];
    videoList = [];
    realm = '';
    nonce = '';

    onSessionListReady(target) {
        if (typeof target.onSessionReady == 'function')
            target.onSessionReady(target);
    }
    onClientListReady(target) {
        if (typeof target.onClientReady == 'function')
            target.onClientReady(target);
    }

    /* Override AcesServerInterface */
    onmessage(evt) {
        this.state = 'connected';

        switch (evt.type) {
        case AcesServerHDS7000.reqHello:
            this.serverState = evt.type;
            if (evt.Realm !== undefined)
                this.realm = evt.Realm;
            if (evt.Nonce !== undefined)
                this.nonce = evt.Nonce;
            this.onReady(this);
            break;

        case AcesServerHDS7000.reqSessionList:
            this.serverState = evt.type;
            this.serverSessions.add(evt, this);
            break;

        case AcesServerHDS7000.reqClientList:
            this.clientSessions.add(evt, this);
            break;

        case AcesServerHDS7000.reqTranscoding:
            if (evt.Result !== undefined && evt.Result == true && evt.SessionName !== undefined)
                this.transcodingList.push(evt.SessionName);
            break;

        case AcesServerHDS7000.reqTranscodingList:
            this.transcodingList = evt.SessionList !== undefined ? evt.SessionList : [];
            this.logOut(`Got Transcoding list, len=${this.transcodingList.length}`, true);
            if (typeof this. onTranscodingListReady == 'function')
                this.onTranscodingListReady(this);
            break;
        }
    }

    send(msg) {
        msg.Realm = this.realm;
        msg.Nonce = this.nonce;
        msg.preventCache = Date();
        super.sendJson(msg);
    }
    sendRequestList(list, reqType) {
        if (!list.requested) {
            this.send({ type: reqType });
            list.requested = true;
        }
    }
    sendServerLog(msg) {
        this.send({ type: 'SAVE-SERVER-LOG', message: msg });
    }

    requestSessionList() {
        this.sendRequestList(this.serverSessions, AcesServerHDS7000.reqSessionList);
    }
    requestClientList() {
        this.sendRequestList(this.clientSessions, AcesServerHDS7000.reqClientList);
    }
    requestTranscoding(params) {
        var msg = {
            type: AcesServerHDS7000.reqTranscoding
        };
        function addParam(value) {
            if (params[value] !== undefined)
                msg[value] = params[value];
        }

        addParam('SessionName');
        addParam('SessionNameLong');
        addParam('InputURL');
        addParam('OutputResolution');
        addParam('Bitrate');
        addParam('CloseWaitTime');
        this.send(msg);
    }
    requestTranscodingList() {
        this.send({ type: AcesServerHDS7000.reqTranscodingList });
    }

    findActiveSession(target) {
        /* First from our own list */
        if (this.sessionCount[target.SessionName] !== undefined)
            return true;

        /* Or from the list which the server sent to us */
        return this.findTranscodingList(target.SessionName);
    }
    findTranscodingList(sessionName) {
        for (var value in this.transcodingList) {
            if (value == sessionName)
                return true;
        }
        return false;
    }

    openVideo(videoTag, target, showLog,loadingDiv) {
        var videoTarget = new AcesVideo(showLog);

        videoTarget.setDefaultWaitTime(5);
        videoTarget.setTransport('tcp');
        videoTarget.showProgress = false;
        videoTarget.onclose = (video, evt, running) => {
            if (!running)
                this.clearVideoInfo(video);
        };
        videoTarget.onbeforeretry = (video) => {
            /*
             * As request/service are async requests might be
             * lost and the server might not be able to receive
             * further request..
             * So let the server know we are still active..
             */
            if (!this.findTranscodingList(target.SessionName))
                this.requestTranscoding(target);
        }

        videoTarget.open(videoTag,
                         this.targetIP,
                         this.targetPort,
                         target.SessionName,
                         this.targetIP + ':3478',
                         null,
                         null,
                         null,
                         null,
                         null,
                         loadingDiv);

        /* Session record update */
        this.videoList.push(videoTarget);

        if (this.sessionCount[target.SessionName] !== undefined)
            this.sessionCount[target.SessionName]++;
        else
            this.sessionCount[target.SessionName] = 1;

        return videoTarget;
    }
    closeVideo(video) {
        if (typeof video == 'object' && video.constructor.name == 'AcesServer')
            video.shutdown();
    }
    clearVideoInfo(target) {
        /* Decrease session counter */
        for (var key in this.sessionCount) {
            if (key == target.sessionName && --this.sessionCount[key] <= 0) {
                delete this.sessionCount[key];
                this.logOut(`SessionCount[${target.sessionName}] removed`, true);
                break;
            }
        }

        /* Find and remove an existing video object */
        var idx = -1;
        this.videoList.forEach((elem, index) => {
            if (elem == target)
                idx = index;
        });
        if (idx != -1) {
            this.videoList.splice(idx, 1);
            this.logOut(`${target.sessionName} removed from the list`, true);
            target = null;
        }

        if (this.serverTimerId != null) {
            clearTimeout(this.serverTimerId);
            this.serverTimerId = null;
        }
    }

    /*
     * Overridables
     */
    onReady(source) {}
    onSessionReady(source) {}
    onClientReady(source) {}
    onTranscodingListReady(source) {}

    logOut = (msg, force = false) => {
        if (this.showDebugLog || force)
            console.log(`AcesServerHDS7000[${this.targetIP}]: ` + msg);
    }
};

/* vim: set ts=4 sw=4 expandtab: */
