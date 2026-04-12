const { Duplex } = require('stream');

class EchoDuplex extends Duplex {
    constructor(options) { super(options); this.buffer = []; }
    _write(chunk, encoding, callback) { this.buffer.push(chunk); callback(); }
    _read(size) {
        if (this.buffer.length > 0) this.push(this.buffer.shift());
        else this.push(null);
    }
}
module.exports = EchoDuplex;