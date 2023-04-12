/*
 * AcesServerVideoDetector2.js
 *
 * (c) 2022 ACES Tech, all rights reserved.
 *
 */

class AcesServerVideoDetector2 {
    static defaultFailMax = 30;
    static useLocalServer = true;

    /*
     * Auto test variables
     */
    targetVideoTag = null;
    videoSession = null;
    testStartFrom = 0;
    testEndTo = 0;
    currentSessionIndex = 0;
    currentSessionName = '';
    currentVideo = null;
    currentVideoSession = null;
    connectRetryCount = 0;
    decodeRetryCount = 0;
    needReconnect = false;
    serverMaster = null;
    serverSessions = null;
    nextWaitTerm = 0;

    startTime = 0;
    stopNow = false;

    constructor(videoTag, startFrom, endTo, nextWaitTerm = 0, showLog = true) {
        this.targetVideoTag = videoTag;
        this.testStartFrom = startFrom;
        this.testEndTo = endTo;
        this.nextWaitTerm = (nextWaitTerm > 0 ? nextWaitTerm : 1) * 1000;

        this.serverMaster = new AcesServerMaster(showLog);
        this.serverMaster.onSessionReady = this.onSessionReady;
    }

    /*
     * Public functions
     */
    addServer(serverIp, port, needSessionList) {
        this.serverMaster.addServer(serverIp, port, needSessionList);
    }
    startTest(func = null) {
        if (func != null && typeof func == 'function')
            this.onStateChange = func;
    }

    startAutoDetection() {
        this.currentSessionIndex = this.testStartFrom;
        this.startTime = Date.now();
        this.startPlayer();
    }
    stop() {
        if (this.videoSession)
            this.videoSession.shutdown();
    }
    next() {
        this.stopNow = true;
        if (this.videoSession)
            this.videoSession.shutdown();

        setTimeout(() => {
            this.continueNext();
        }, 500);
    }

    /*
     * Private functions
     */
    startPlayer() {
        this.needReconnect = false;
        this.currentVideo = this.serverSessions.list[this.currentSessionIndex];
        this.currentSessionName = this.currentVideo.f0;
        this.currentVideoSession = this.currentVideo.f1;

        /* Allow only limited time */
        this.currentVideo.CloseWaitTime = 10;

        /* 변환을 사용하는 WebRTC 영상 보기 호출 */
        this.videoSession = this.serverMaster.openVideo(
                                    this.targetVideoTag,
                                    this.currentVideo,
                                    false);
        if (this.videoSession != null) {
            this.videoSession.onconnected = this.onVideoConnected;
            this.videoSession.ondisplayok = this.onVideoOk;
            this.videoSession.onerror = this.onVideoConnectionError;
            this.videoSession.onretry = this.onVideoRetry;
            this.videoSession.onclose = this.onVideoClose;
            this.videoSession.showProgress = false;             /* If you need debug!!! */
        }

        /* 외부 player set-up */
        var extVideo = document.getElementById('ext_video');
        var srcURL = AcesServerVideoDetector2.useLocalServer ?
                        `rtsp://${this.videoSession.targetIP}:554/${this.currentVideo.f1}`
                        : this.currentVideo.f2;
        extVideo.href = `${srcURL.replace('rtsp:', 'AcesPlay:')};`
                        + 'xpos=650;ypos=300;width=700;height=500';
        extVideo.text = `외부 player로 ${this.currentSessionName} 보기`;

        this.logOut(`Testing ${this.name()}`);

        // notify the upper hander
        this.onStateChange(`시험 중: ${this.name()}: `
                            + `${this.currentSessionIndex + 1} / ${this.serverSessions.list.length}`);
    }
    continueNext() {
        this.videoSession = null;
        ++this.currentSessionIndex;
        if (this.currentSessionIndex < this.serverSessions.total
            && this.currentSessionIndex < this.testEndTo) {
            this.connectRetryCount = 0;
            this.decodeRetryCount = 0;
            this.startTime = Date.now();
            this.startPlayer();
        } else {
            this.logOut('All completed');

            // notify the upper handler
            this.onStateChange(`시험 완료: ${this.currentSessionIndex} / ${this.serverSessions.list.length}`);
        }
    }
    name() { return `[${this.currentSessionIndex}]: ${this.currentSessionName}`; }
    fullName() { return `${this.name()}(${this.videoSession.name()}): ${this.currentVideo.f2}`; }
    finalMessage(msg) {
        return `${this.fullName()}: ${msg}, `
               + `D=${this.videoSession.framesDecoded} / R=${this.videoSession.framesReceived}`;
    }
    getTargetVideo(listInfo) {
        var target;

    }

    /*
     * Callback handlers
     */
    onStateChange = (msg) => {};
    onVideoConnected = () => {};
    onVideoOk = (msg) => {
        var timeDiff = (Date.now() - this.startTime) / 1000;
        this.needReconnect = false;
        this.logFinalMessage(msg, `, ${timeDiff} secs`);
        this.videoSession.shutdown();
    }
    onVideoConnectionError = () => {
        this.needReconnect = ++this.connectRetryCount < AcesServerVideoDetector2.defaultFailMax;
        if (this.needReconnect) {
            this.decodeRetryCount = 0;
            if (this.videoSession.showProgress)
                this.logOut(`Video connection error(${this.connectRetryCount})`);
        } else
            this.logFinalMessage("Can't connect. Closing");
        return this.needReconnect;
    }
    onVideoRetry = (msg) => {
        /*
         * Temporary disabled
         */
        if (this.videoSession.showProgress)
            this.logOut(`Retrying: ${msg}: count=${this.decodeRetryCount}`);

        if (msg == AcesServer.msgPlayingFailed) {
            if (++this.decodeRetryCount >= 3) {
                this.logFinalMessage(msg);
                this.needReconnect = false;
            } else {
                /*
                 * 수신을 하면서 일정 시간 이상 디코딩이 안되더라도 재접속하면
                 * 재생이 되는 되는 경우가 있음. 3번 시도해보고 안되면 최종
                 * 재생 불량 처리함.
                 */
                this.logOut(this.finalMessage(msg) + `: Not playing yet ${this.decodeRetryCount} why?`);
                this.needReconnect = true;
            }
            return false;
        }
        return ++this.decodeRetryCount < AcesServerVideoDetector2.defaultFailMax;
    }
    onVideoClose = (target, msg, running) => {
        if (!running) {
            /*
             * 재생 정보 관리:
             *      현재 코드는 내부에서 재생 정보를 관리하여 각 서버별 부하를 조절하기
             *      때문에 영상 재생을 중지하면 내부 정보도 같이 바꿔줘야 함.
             *      원래는 AcesServerHDS7000 클래스 내에서 하도록 되어 있으나 이 함수에서
             *      해당 처리를 대신하기 때문에 clearVideoInfo를 추가로 호출해야 함.
             */
            this.serverMaster.clearVideoInfo(target);

            if (this.stopNow) {
                this.stopNow = false;
            } else if (!this.needReconnect) {
                if (msg !== undefined && msg.indexOf(AcesServer.msgConnectionLost) != -1)
                    this.logFinalMessage(msg);
                setTimeout(() => {
                    this.continueNext();
                }, this.nextWaitTerm);
            } else
                this.startPlayer();
        }
    }

    logFinalMessage = (msg, msg1) => {
        msg = this.finalMessage(msg) + (msg1 !== undefined ? msg1 : '');
        this.serverMaster.sendServerLog(this.videoSession.targetIP, msg);
        this.logOut(msg);
    }

    onSessionReady = (server) => {
        if (this.onStateChange != null)
            setTimeout(() => {
                this.serverSessions = server.serverSessions;
                this.startAutoDetection()
            }, 1000);
    }

    logOut(msg) {
        console.log('VideoDetector: ' + msg);
    }
};

/* vim: set ts=4 sw=4 expandtab: */
