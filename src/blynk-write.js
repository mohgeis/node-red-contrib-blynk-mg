const Blynk = require('blynk-library');

module.exports = function (RED) {
    function BlynkWriteNode(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
        this.server = config.server;
        this.port = config.port;
        this.token = [config.token];

        var node = this;

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

        node.on('input', function (msg) {
            if (msg.hasOwnProperty('payload') && msg.hasOwnProperty('pin') && msg.hasOwnProperty('token')) {

                if (config.token) msg.token.push(config.token);

                for (token of msg.token){

                    var blynk = new Blynk.Blynk(token, {
                        connector: new Blynk.TcpClient({ addr: this.server, port: this.port })
                    });
                    
                    blynk.on('connect', () => { sendMsg(blynk, msg) });
                    node.send(msg);
                    blynk.on('disconnect', () => { this.log('Blynk Disconnected') });
                }

            }

        });
    }
    RED.nodes.registerType("blynk-write", BlynkWriteNode);
}

function sendMsg (blynk, msg){
    var i = 0;
    for (pinNo of msg.pin){
        var pin = new blynk.VirtualPin(pinNo);
        pin.write(msg.payload[i++] | 0);
    }
}