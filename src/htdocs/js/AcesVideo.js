/*
 * AcesVideo
 *  ACES Tech WebRTC Handler
 *
 * (c) 2020~2022 ACES Tech, all rights reserved.
 *
 */

class AcesVideo {
    static msgConnectionLost = 'Connection lost?';
    static msgConnectionFailed = 'Connection failed';
    static msgConnectionError = 'Connection error';
    static msgInitialConnectionFailed = 'Initial connection failed';
    static msgPlayingFailed = 'Playing failed';
    static msgPlayingOk = 'Playing OK';
    static msgVideoDecodingFailure = 'Video decoding failure';
    static msgSocketIsAlreadyOpened = 'Socket is already opened';
    static msgProfileLevelId = 'profile-level-id=';

    sock = null;
    pc = null;
    stunServer = '';
    targetVideo;
    loadingDiv;
    receiver;
    myVideo;
    sourceIp;
    sourceBitrate = 0;
    sourceResolution;
    timerId;
    timeoutId = null;
    elapsed = 0;
    dropped = 0;
    decodingFailCount = 0;
    framesReceivedLast = 0;
    framesDecodedLast = 0;
    failMax = 0;
    waitCount = 0;
    timerRunCount = 0;
    stopped = true;
    speed = 1;
    seekTime = null;
    onMessageCallback = null;
    paused = false;
    useTCP = false;
    turnUsername = null;
    turnCredential = null;
    showDebugLog = false;
    openNext = false;
    videoTrack = null;
    getStatsCalled = false;

    sessionName = '';
    targetIP = '';
    targetPort = '';
    state = 'idle';
    peerConnection = null;
    framesReceived = 0;
    framesDecoded = 0;
    showProgress = false;
    showStep = false;
    profileLevelId = '';

    /*
     * 프레임을 수신하지 못하고 있을 때 최대 대기 시간
     *  분배 서버간 접속 시간을 고려하여 일정 시간 이상
     *  프레임을 수진하지 못할 때에는 차라리 재접속하는
     *  것이 나을 수 있음.
     */
    defaultWaitTime = 3;

    /*
     * 디코딩이 안될 때의 최대 대기 시간:
     *  GOP 값이 클 경우를 대비해서 6초 이상을 줄 것.
     *  그렇지 않을 경우 자주 재접속하거나 접속해도 영상이
     *  안나오는 경우가 있을 수 있음.
     */
    defaultFailMax = 6;

    constructor(showLog) {
        this.showDebugLog = showLog;
    }

    /*
     * 아래 함수들은 다른 함수로 대체하지 말것!!!!
     */
    /* open(to, ip, port, name, stun)
     *  to:         영상을 출력할 video id
     *  ip:         HDS7000 ip address
     *  port:       HDS7000 WebRTC port (현재는 554로 RTSP와 같음)
     *  name:       보고자 하는 카메라 세션 이름
     *  stun:       STUN 서버
     *              client가 NAT 뒤에 있을 경우 HDS7000 설치 기관에서 운영하는
     *              STUN 서버를 지정함.
     *              HDS7000 서버와 client가 같은 망에 있을 경우 HDS7000 자체에서
     *              STUN 서버를 지원함.
     *
     * VOD를 재생하고자 할 경우에는 setPlayTime을 먼저 호출할 것.
     *
     */
    open(to, ip, port, name, stun, src, resolution, bitrate, waitTime, failMax, loadingDiv) {
        this.sessionName = name;
        this.targetIP = ip;
        this.targetPort = port;
        if (waitTime != null)
            this.defaultWaitTime = waitTime;
        if (failMax != null)
            this.defaultFailMax = failMax;

        this.stopped = false;
        this.targetVideo = to;
        this.stunServer = stun;
        this.sourceIp = src;
        this.sourceResolution = resolution;
        this.sourceBitrate = bitrate;
        this.elapsed = 0;
        this.loadingDiv = loadingDiv;

        if (this.sock != null && this.sock.readyState == 1)
            this.retry(msgSocketIsAlreadyOpened);
        else
            this.openNow();
    }

    /*
     * close
     *  현재 세션만 닫음. 조건에 따라 재시작하게 만들 수 있음.
     */
    close(msg, timeValue) {
        /*
         * 종료 처리
         *
         */
        if (msg !== null && msg !== undefined)
            this.logOut(msg);
        if (this.sock !== null) {
            if (this.sock.readyState == 1) {
                /* End of connection, let the server know this */
                this.sock.send(JSON.stringify({ type: 'BYE' }));
                if (this.myVideo != null) {
                    this.myVideo.pause();
                    this.myVideo.currentTime = 0;
                }
            }

            /* Close WebSocket */
            this.sock.close();
            this.sock = null;
        }
        if (this.pc != null) {
            /* Close RTCPeerConnection */
            this.pc.close();
            this.pc = null;
            this.peerConnection = this.pc;
        }
        if (this.timerId != null) {
            /* Cancel any pending error handling timer */
            clearInterval(this.timerId);
            this.timerId = null;
        }
        if (this.timeoutId != null) {
            /* Cancel any timeout request */
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        var running = false;
        if (this.openNext) {
            /*
             * If the caller wants to restart or reopen the channel
             */
            running = true;

            /* Let user know retry will be tried again */
            this.onbeforeretry(this);

            /* Set to reopen */
            this.openNext = false;
            this.timeoutId = setTimeout(() => {
                this.openNow();
            }, timeValue !== null ? timeValue : 100);
        }
        this.state = 'closed';
        this.onclose(this, msg, running);
    }

    /*
     * shutdown
     *  세션 완전 종료.
     */
    shutdown() {
        this.stopped = true;
        this.speed = 1;
        this.openNext = false;
        this.close('shutdown');
    }

    /*
     * setTransport
     *  TCP로 접속해야 할 경우 open 전에 호출해야 함.
     */
    setTransport(transportType, userName = null, credential = null) {
        this.useTCP = transportType.toLowerCase() == 'tcp';
        this.turnUsername = userName !== null ? userName : 'root';
        this.turnCredential = credential !== null ? credential : 'acest';
    }

    /*
     * Etc.
     */
    setOnMessageCallback(func) { this.onMessageCallback = func; }
    setDefaultWaitTime(waitTime) { this.defaultWaitTime = waitTime; }
    active() { return this.sock != null; }
    name() { return this.sessionName; }
    send(msg) {
        if (this.sock.readyState == 1)
            this.sock.send(msg);
    }
    sendJson(msg) {
        if (this.sock.readyState == 1)
            this.sock.send(JSON.stringify(msg));
    }

    /*
     * For VOD streams
     */
    setPlayTime(newPlayTime) {
        this.seekTime = newPlayTime;
        if (this.sock !== null && this.sock.readyState == 1)
            this.sock.send(JSON.stringify({ type: 'SEEKTIME', seektime: encodeURIComponent(newPlayTime) }));
    }
    setSpeed(newSpeed) {
        this.speed = newSpeed;
        if (this.sock !== null && this.sock.readyState == 1)
            this.sock.send(JSON.stringify({ type: 'SPEED', speed: this.speed }));
    }
    fastForward() {
        if (this.sock !== null && this.sock.readyState == 1) {
            this.speed = Math.abs(this.speed);
            this.speed = this.speed < 32 ? this.speed * 2 : 1;
            this.sock.send(JSON.stringify({ type: 'SPEED', speed: this.speed }));
        }
    }
    fastReverse() {
        if (this.sock !== null && this.sock.readyState == 1) {
            this.speed = Math.abs(this.speed);
            this.speed = -(this.speed < 32 ? this.speed * 2 : 1);
            this.sock.send(JSON.stringify({ type: 'SPEED', speed: this.speed }));
        }
    }
    pauseStream() {
        if (this.sock !== null && this.sock.readyState == 1) {
            this.sock.send(JSON.stringify({ type: 'PAUSE' }));
        }
    }
    getSpeed() { return this.speed; }
    getPlayTime() { return this.seekTime; }

    /*
     * User overridables
     */
    onopen(evt) { this.logOut('Signaling channel opened'); }
    onclose(target, evt, running) { this.logOut('closed'); }
    onconnected(evt) {}
    ondisplayok(evt) {
    	if(this.targetVideo.paused) this.targetVideo.play();
    }
    onbeforecontinue(evt) {}

    /* true: retry to make a connection, false: close the connection */
    onerror() { return true; }

    /* true: continue retry, false: close the connection */
    onretry(msg) { return true; }

    onfail(message) {
        this.logOut(message);
        this.shutdown();
    }

    /*
     * 내부 함수들
     */
    timerHandler() {
        switch (this.state) {
        case 'connecting':
            /* 접속 요청 후 접속이 안될 때 재시작 요청 */
            if (this.timerRunCount > 3)
                 this.retry(AcesVideo.msgInitialConnectionFailed);
            break;

        case 'connected':
        	this.loadingDiv.style.display = 'none';
            if (!this.getStatsCalled) {
                this.getStatsCalled = true;
                this.pc.getStats().then((stats) => {
                    this.getStatsCalled = false;
                    stats.forEach((report) => {
                        if (this.paused)
                            return;
                        if (report.id.indexOf('RTCMediaStreamTrack') != -1) {
                            /* Update local count */
                            this.framesReceivedLast = this.framesReceived;
                            this.framesReceived = report.framesReceived;
                            this.framesDecodedLast = this.framesDecoded;
                            this.framesDecoded = report.framesDecoded;

                            /*
                             * 영상이 정상적으로 수신 및 디코딩이 되면
                             * this.framesDecoded가 증가함. 만약 증가하지 않는다면
                             * 영상 표출에 문제가 있는 것이므로 재접속해서
                             * 영상을 다시 받는 것이 나은 선택임.
                             */
                            if (this.framesDecoded == this.framesDecodedLast) {
                                /*
                                 * 영상을 받기는 하나 재생을 못하는 경우와 처음부터
                                 * 영상을 받지 못한 경우를 구분해야 함.
                                 */
                                if (this.framesReceived > 0 && ++this.decodingFailCount >= this.failMax)
                                    this.retry(AcesVideo.msgPlayingFailed + `, id=${this.profileLevelId}`);
                            } else {
                                /* 영상이 출력되기 시작하면 대기 시간을 늘림 */
                                this.decodingFailCount = 0;
                                if (this.failMax < 10)
                                    this.failMax++;

                                /* For additional feature implementation */
                                if (++this.elapsed == 2)
                                    this.ondisplayok(AcesVideo.msgPlayingOk);
                            }
                        }
                    });
                })
                .catch((result) => {
                    if (!this.stopped)
                        this.logOut('getStats error');
                    this.getStatsCalled = false;
                });
            }

            /*
             * 접속 후 영상이 안나오거나 getStats 호출이 안될 때 재시작 확인.
             * 위 getStats() promise 호출이 안되는 경우 여기서 강제로 재시작을
             * 해야 함.
             */
            if (this.framesReceived == 0
                && this.framesDecoded == 0
                && ++this.waitCount > this.defaultWaitTime)
                this.retry(AcesVideo.msgConnectionLost + `, state=${this.state}`);
            break;

        default:
            break;
        }
        this.timerRunCount++;
    }
    openNow() {
        var url = 'ws://' + this.targetIP + ':' + this.targetPort
                  + '/streaming?session=' + this.sessionName;

        /* OnDemand로 처리할 사항인지 확인 */
        if (this.sourceResolution != undefined
            && this.sourceResolution != null
            && this.sourceResolution != "")
            url = url + ';resolution=' + this.sourceResolution;
        if (this.sourceIp != undefined
            && this.sourceIp != null
            && this.sourceIp != "")
            url = url + ';source=' + this.sourceIp;
        if (this.sourceBitrate != undefined
            && this.sourceBitrate != null
            && this.sourceBitrate != "")
            url = url + ';bitrate=' + this.sourceBitrate;
        if (this.seekTime != null)
            url = url + ';seektime=' + encodeURIComponent(this.seekTime);

        /* 초기 상태 설정 */
        this.state = 'connecting';
        this.framesReceived = 0;
        this.framesDecoded = 0;
        this.framesReceivedLast = 0;
        this.framesDecodedLast = 0;
        this.waitCount = 0;
        this.elapsed = 0;
        this.failMax = this.defaultFailMax;
        this.getStatsCalled = false;

        /* Signalling을 처리할 WebSocket을 열고 명령을 전송함 */
        this.sock = new WebSocket(url, 'streaming');
        this.sock.onopen = (evt) => {
            /* Signalling 시작 */
            if (this.showProgress)
                this.logOut('Connecting..', true);;

            this.sock.send(JSON.stringify({ type: 'HELLO' }));
            this.onopen(evt);
        }
        this.sock.onmessage = (evt) => this.onmessage(JSON.parse(evt.data));
        this.sock.onerror = (evt) => {
            /*
             * WebSocket connection error
             *  Basically same with retry but user handler may differ..
             */
            this.openNext = this.onerror();
            this.close(AcesVideo.msgConnectionError, 1000);
        }

        /* 접속이 안된 경우 재접속하도록 함 */
        this.timerRunCount = 0;
        this.timerId = setInterval(() => { this.timerHandler(); }, 1000);
    }
    onmessage(evt) {
        /*
         * Signaling message 처리 - 나머지는 STUN & DTLS로 처리함
         */
        switch (evt.type) {
        case 'offer':
            this.setRemoteDescription(evt);
            break;

        case 'candidate':
            this.addIceCandidate(evt);
            break;

        case 'status':
            this.paused = evt.this.paused;
            /* no break here */

        case 'time':
            if (typeof this.onMessageCallback == 'function')
                this.onMessageCallback(evt);
            break;

        case 'error':
            this.onfail(evt.message);
            if (typeof this.onMessageCallback == 'function')
                this.onMessageCallback(evt);
            break;
        }
    }
    retry(msg, timeValue) {
        if (!this.stopped) {
            this.openNext = this.onretry(msg);
            this.close(msg + (this.openNext ? ', retrying' : ', canceled retrying'),
                       timeValue);
        }
    }

    /*
     * ICE 처리 관련 함수들
     *
     */
    /*
     * setRemoteDescription
     *      서버로부터 offer를 받았을 때 호출하며 client에서 접속을
     *      하기 위한 처리임.
     */
    setRemoteDescription(msg) {
        if (this.pc === null)
            this.prepareConnection();

        /*
         * 서버로부터 받은 OFFER sdp를 기준으로 접속 준비를 함
         */
        if (msg.sdp) {
            this.logOut('========== Remote offer ==========\n' + msg.sdp);
            if (this.showProgress)
                this.logOut('Got offer', true);;

            var pos;
            if ((pos = msg.sdp.indexOf(AcesVideo.msgProfileLevelId)) != -1)
                this.profileLevelId = msg.sdp.substr(pos + AcesVideo.msgProfileLevelId.length, 6);

            this.dropped = 0;
            this.decodingFailCount = 0;
            this.pc.setRemoteDescription(new RTCSessionDescription(msg),
                (evt) => this.prepareAnswer(evt),
                (evt) => this.close(`setRemoteDescription failed: ${evt}`)
            );
        }
    }
    prepareConnection() {
        const config = {
            iceServers: [{
                // 사용자가 지정한 STUN server임
                urls: 'stun:' + this.stunServer

                // 만약 client가 server와 분리된 사설 IP를 사용할 경우 아래 주소를
                // 사용하도록 함. 또는 해당 기관에서 운영하는 STUN 서버를 이용하도록
                // 하여야 함.
                // urls: 'stun:stun.stunprotocol.org:3478'
            }]
        };
        if (this.useTCP) {
            config.iceServers[0].urls = 'turn:' + this.stunServer + '?transport=tcp';
            config.iceServers[0].username = this.turnUsername;
            config.iceServers[0].credential = this.turnCredential;
        }

        this.pc = new RTCPeerConnection(config);
        this.peerConnection = this.pc;

        /*
         * event 처리 함수들을 등록함
         */
        this.pc.onicecandidate = (event) => {
            /*
             * ICE candidate:
             *  서버와 통신하기 위한 ip:port 조합을 말함.
             *  NAT을 사용하면서 공인망에 붙을 경우 local 주소 및 공인 ip 주소가
             *  ICE candidate가 될 수 있음. (ICE candidate가 2개가 된다는 뜻임)
             *  서버와 같은 망에 있다고 가정하면 local 주소만 받을 수 있음.
             *  candidate가 NULL일 경우 the end of candidate이므로 이것도 반드시
             *  상대편에게 보내야 함.
             */
            var candidate = event.candidate ? event.candidate.candidate : '';
            this.logOut(`Local ICE Candidate ===> ${candidate == '' ? 'End' : candidate}`);

            // 서버로 이 정보를 보내서 관련 정보를 설정하도록 함
            this.sendJson({
                type: 'candidate',
                candidate: candidate
            });
        }

        /*
         * ICE state changed
         */
        this.pc.addEventListener('connectionstatechange', event => {
            this.logOut(event.currentTarget.connectionState);
            if (event.currentTarget.connectionState == 'connected')
                this.onconnected(event);
        });

        /*
         * When connected..
         */
        this.pc.ontrack = (evt) => {
            /*
             * ICE, STUN 및 DTLS 협의까지 마치면 서버에서 영상을
             * 보내기 직전 단계까지 간 것이므로 해당 스트림을
             * video 항목과 연결시켜 보여줄 수 있도록 함.
             */
            this.myVideo = this.targetVideo;
            this.myVideo.srcObject = evt.streams[0];
            this.receiver = evt.receiver;
            this.receiver.onerror = evt => this.logOut('Receiver error' + evt);
            this.videoTrack = this.pc.getRemoteStreams()[0].getVideoTracks()[0];
            // this.receiver.track.muted = false;
            this.state = 'connected';
        };
    }
    prepareAnswer(evt) {
        if (this.pc.remoteDescription.type == 'offer') {
            this.pc.createAnswer().then(
                (desc) => {
                    this.pc.setLocalDescription(desc,
                        () => {
                            this.send(JSON.stringify(this.pc.localDescription));
                            this.logOut('Local Description ===> '
                                          + JSON.stringify(this.pc.localDescription, null, 2));
                        },
                        (evt) => this.close(`setLocalDescription failed\n${evt}`));
                },
                (evt) => this.close(`createAnswer failed ${evt}`)
            );
        } else
            this.close('Unknown message type from the peer: '
                         + this.pc.remoteDescription.type);
    }
    addIceCandidate(msg) {
        this.logOut('Remote ICE Candidate ===> '
                    + (msg.candidate != '' ? msg.candidate : 'End'));

        this.pc.addIceCandidate(msg).then(
            () => this.logOut("addIceCandidate done"),
            (evt) => this.logOut("addIceCandidate failed" + evt));
    }
    logStep = (msg) => {
        if (this.showStep)
            this.logOut(msg, true);
    }

    /*
     *
     */
    logOut(msg, force) {
        if (this.showDebugLog || (force !== null && force))
            console.log(this.sessionName + ': ' + msg);
    }
    logError(error) {
        console.log(error.name + ': ' + error.message);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* vim: set ts=4 sw=4 expandtab: */
