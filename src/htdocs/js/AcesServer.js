/*
 * AcesServer
 *  Basic ACES Tech Server interface
 *
 * (c) 2022 ACES Tech, all rights reserved.
 *
 */

class AcesServer {
    static get typeName() { return 'serverInterface' }

    timerId;
    defaultWaitTime = 3;
    stopped = false;
    onMessageCallback = null;

    showDebugLog = false;
    sock = null;
    targetIP = '';
    targetPort = '';
    state = 'idle';
    timereRunCount = 0;
    url = null;

    constructor(showLog) {
        this.showDebugLog = showLog;
    }

    /*
     * 아래 함수들은 다른 함수로 대체하지 말것!!!!
     */
    /* open(ip, port)
     *  ip:         HDS7000 ip address
     *  port:       HDS7000 WebRTC port (554/8880)
     *
     */
    open(ip, port, waitTime = 3) {
        this.targetIP = ip;
        this.targetPort = port;
        if (waitTime != null)
            this.defaultWaitTime = waitTime;

        if (this.sock != null && this.sock.readyState == 1) {
            this.logOut('Socket is already opened');
            return;
        }

        this.openNow();
    }
    openNow() {
        this.url = 'ws://' + this.targetIP + ':' + this.targetPort + '/' + AcesServer.typeName;
        this.state = 'connecting';
        this.sock = new WebSocket(this.url, AcesServer.typeName);
        this.sock.onopen = (evt) => {
            try {
                this.sock.send(JSON.stringify({ type: 'HELLO' }));
                this.onopen(evt);
            } catch (e) {
                this.close('retrying');
            }
        }
        this.sock.onmessage = (evt) => this.onmessage(JSON.parse(evt.data));
        this.sock.onerror = (evt) => this.onerror(evt);

        /* 접속이 안된 경우 재접속하도록 함 */
        this.timerRunCount = 0;
    }
    close(msg, timeValue = 1000) {
        if (msg !== null && msg !== undefined)
            this.logOut(msg);
        if (this.sock !== null) {
            if (this.sock.readyState == 1) {
                /* End of connection, let the server know this */
                this.sock.send(JSON.stringify({ type: 'BYE' }));
            }
            try {
                this.sock.close();
            } catch (e) {
            }
            this.sock = null;
        }
        if (this.timerId != null) {
            /* Cancel any pending error handling timer */
            clearTimeout(this.timerId);
            this.timerId = null;
        }
        if (!this.stopped) {
            this.timerId = setTimeout(() => {
                this.openNow();
            }, timeValue);
        }
        this.state = 'closed';
        this.onclose(this.state);
    }
    shutdown() {
        this.stopped = true;
        this.close('shutdown');
    }
    active() {
        return this.sock != null;
    }

    setOnMessageCallback(func) {
        this.onMessageCallback = func;
    }
    setDefaultWaitTime(waitTime) {
        this.defaultWaitTime = waitTime;
    }

    /*
     * Common handlers
     */
    onmessage(evt) {
        this.state = 'connected';
        if (typeof this.onMessageCallback == 'function')
            this.onMessageCallback(evt);
    }
    name() {
        return AcesServer.typeName;
    };
    send(msg) {
        try {
            if (this.sock.readyState == 1)
                this.sock.send(msg);
        } catch (e) {
        }
    }
    sendJson(msg) {
        try {
            if (this.sock.readyState == 1)
                this.sock.send(JSON.stringify(msg));
        } catch (e) {
        }
    }

    /*
     * Overridables
     */
    onopen(evt) {}
    onclose(evt) {}
    onerror(evt) {
        this.close(AcesServer.msgConnectionFailed);
        setTimeout(() => {
            this.openNow();
        }, 5000);
    }
    onfail(message) {
        this.logOut(message);
        this.shutdown();
    }

    /*
     *
     */
    logOut = (msg, force = false) => {
        if (this.showDebugLog || force)
            console.log(AcesServer.typeName + ': ' + msg);
    }
    logError(error) {
        console.log(error.name + ': ' + error.message);
    }
}

/* vim: set ts=4 sw=4 expandtab: */
