const Blynk = require('blynk-library');

module.exports = function (RED) {
    function BlynkWriteNode(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
        this.server = config.server;
        this.port = config.port;
        this.token = [config.token];


        this.on('connected', () => this.status({
            fill: 'green',
            shape: 'dot',
            text: 'connected'
        }));
        this.on('disconnected', () => this.status({
            fill: 'red',
            shape: 'ring',
            text: 'disconnected'
        }));

        var node = this;

        node.on('input', function (msg) {

            if (!verifyInput(this, msg, config.token)) {
                this.send(msg);
                return;
            } else {
                if (Array.isArray(msg.token) && config.token && !msg.token.includes(config.token)) {
                    msg.token.push(config.token);
                }
                if (!Array.isArray(msg.token) && config.token) {
                    msg.token = [config.token];
                }
            }

            for (token of msg.token) {

                var blynk = new Blynk.Blynk(token, {
                    connector: new Blynk.TcpClient({ addr: this.server, port: this.port })
                });

                blynk.on('connect', () => {
                    this.emit('connected');
                    sendMsg(blynk, msg);
                });

                node.send(msg);

                blynk.on('disconnect', () => {
                    this.emit('disconnect');
                });

                blynk.on('error', (err) => {
                    node.status({
                        fill: 'red',
                        shape: 'ring',
                        text: 'error: ' + err,
                    });
                });
            }
        });
    }
    RED.nodes.registerType("blynk-write", BlynkWriteNode);
}

function sendMsg(blynk, msg) {
    var i = 0;
    for (pinNo of msg.pin) {
        var pin = new blynk.VirtualPin(pinNo);
        pin.write(msg.payload[i++] | 0);
    }
}

function showStatus (node, err) {
    node.status({
        fill: 'red',
        shape: 'ring',
        text: 'error:' + err,
    });
};

function isNotArray(node, msg, key){
    if (!msg[key] || !msg[key].length || !Array.isArray(msg[key])){
        var err = "no " + key + " found!";
        showStatus(node, err);
        if (node.done) { node.done(err); } else { node.error(err, msg); }
        return true;
    } else {
        return false;
    }
}

function verifyInput (node, msg, config_token){
    if (isNotArray(node, msg, 'payload')) {
        return false
    }
    if (isNotArray(node, msg, 'pin')) {
        return false
    }
    if (isNotArray(node, msg, 'token') && !config_token) {
        return false
    }
    return true;
}