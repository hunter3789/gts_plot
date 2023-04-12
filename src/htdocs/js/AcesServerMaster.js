/*
 * AcesServerMaster.js
 *  Aces server master
 *
 * (c) 2022 ACES Tech, all rights reserved.
 *
 */

class AcesServerMaster {

    static XcodePrefix = 'video@';

    serverList = {}

    onServerReady = (source) => {
        if (source.enabledSessionListRequest)
            source.requestSessionList();
        else
            source.requestTranscodingList();
        if (typeof this.onReady == 'function')
            this.onReady(source);
    }
    onSessionReadyHandler = (source) => {
        source.requestTranscodingList();
        if (typeof this.onSessionReady == 'function')
            this.onSessionReady(source);
    }
    onTranscodingListReadyHandler = (source) => {
        if (typeof this.onTranscodingListReady == 'function')
            this.onTranscodingListReady(source);
    }

    /**
     * @brief #serverIP 로 지정하는 서버를 사용하도록 등록함.
     *
     * 새로운 서버를 등록하여 사용할 수 있도록 함. addServer() 로 등록한
     * 서버가 여러 대일 경우 부하 분산 처리에 사용할 수 있음.
     *
     * @param serverIp          등록하고자 하는 HDS7000 IP 주소
     * @param serverPort        WebRTC 처리 포트 (default: 8880)
     * @param needSessioinList  서버를 등록하고 해당 서버에 등록된 모든 세션 목록을 자동으로
     *                          받아 오도록 할지를 지정함. default: true
     * @param showLog           동작 중 디버깅 메시지를 출력할지 여부를 지정함.
     */
    addServer(serverIp, serverPort = 8880, needSessionList = true, showLog = false) {
        if (this.serverList[serverIp] !== undefined)
            return;

        var server = new AcesServerHDS7000(needSessionList, showLog);
        server.onReady = this.onServerReady;
        server.onSessionReady = this.onSessionReadyHandler;
        server.onTranscodingListReady = this.onTranscodingListReadyHandler;
        server.open(serverIp, serverPort);
        this.serverList[serverIp] = server;
    }

    findServer(target) {
        for(var serverIp in this.serverList) {
            if (this.serverList[serverIp].findActiveSession(target))
                return this.serverList[serverIp];
        }
        return null;
    }
    getSessionList(serverIp) {
        if (this.serverList[serverIp] !== undefined)
            return this.serverList[serverIp].serverSessions;
        return null;
    }
    selectServer() {
        var server = null;
        var count = 9999999;

        for (var serverIp in this.serverList) {
            if (this.serverList[serverIp].transcodingList.length < count) {
                server = this.serverList[serverIp];
                count = this.serverList[serverIp].transcodingList.length;
            }
        }
        return server;
    }

    /**
     * @brief #target 으로 지정하는 영상 원본에 WebRTC 로 접속하여 영상을 #videoTag 에 표시하도록 함.
     *
     * #target 에 등록된 정보를 사용하여 WebRTC 로 영상 서버에 접속하고
     * 영상이 정상적일 경우 #videoTag 에 지정된 video element 에 출력하도록
     * 함.
     * #target 에는 다음과 같은 필드가 있어야 함.
     * * f1: 카메라 이름
     * * f2: 영상 접속에 사용할 이름 (session name)
     * * f3: 입력 카메라 URL (ex: rtsp://<ip-address>:<port>/<session-name>
     * * f4: 카메라 그룹 이름
     * * f5: 디버깅 등에 사용할 카메라 이름
     *
     * @param vidoeTag          출력할 video element id
     * @param target            접속할 카메라 정보. 위 설명 참조.
     * @param showLog           동작 중 디버깅 메시지를 출력할지 여부를 지정함.
     *
     * @return AcesVideo instance 또는 null(가용하지 않을 경우)
     */
    openVideo(videoTag, target, showLog,loadingDiv) {
        /*
         * If the target is one from the sessionList
         * convert to our internal object.
         */
        var targetVideo = {};
        if (target.f0 !== undefined
            && target.f1 !== undefined
            && target.f2 !== undefined) {
            targetVideo.SessionNameLong = target.f0;
            targetVideo.SessionName = target.f1;
            targetVideo.InputURL = target.f2;
        } else if (target.SessionName !== undefined
                   && target.SessionName !== undefined
                   && target.InputURL !== undefined) {
            targetVideo = target;
        } else
            return null;

        /* Additional parameters */
        if (target.CloseWaitTime !== undefined)
            targetVideo.CloseWaitTime = target.CloseWaitTime;

        /* Session name should be changed */
        if (targetVideo.SessionName.indexOf(AcesServerMaster.XcodePrefix) == -1)
            targetVideo.SessionName = AcesServerMaster.XcodePrefix + targetVideo.SessionName;

        /* Make sure whether it is being served */
        var server = this.findServer(targetVideo);
        if (server == null) {
            this.logOut(`No server running ${targetVideo.SessionName} found`);

            /* Otherwise find an available server instead */
            if ((server = this.selectServer()) == null)
                return null;
        }

        /*
         * Whether the server is serving the session may not be certain.
         * So let the server handle the request..
         */
        this.logOut(`Requesting transcoding(${targetVideo.SessionName}) to ${server.targetIP}`);
        server.requestTranscoding(targetVideo);

        /* Finally request video */
        return server.openVideo(videoTag, targetVideo, showLog, loadingDiv);
    }

    /**
     * @brief #video 에 지정되는 영상을 닫음.
     *
     * #video 는 AcesVideo class의 instance이어야 하며 openVideo() 로 받은
     * 것이어야 함.
     *
     * @param video             영상을 닫을 AcesVideo instance
     */
    closeVideo(video) {
        var server;
        if (typeof video == 'object'
            && video.constructor.name == 'AcesVideo'
            && (server = this.serverList[video.targetIP]) != undefined)
                server.closeVideo(video);
    }
    clearVideoInfo(video) {
        var server = this.serverList[video.targetIP];
        if (server != undefined)
            server.clearVideoInfo(video);
    }
    sendServerLog(serverIp, msg) {
        var server = this.serverList[serverIp];
        if (server != undefined)
            server.sendServerLog(msg);
    }

    logOut(msg) {
        console.log('AcesServerMaster: ' + msg);
    }

    /*
     * Client may override below functions
     */
    onReady(source) {}
    onSessionReady(source) {};
    onTranscodingListReady(source) {}

};

/* vim: set ts=4 sw=4 expandtab: */
