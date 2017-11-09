const decoder = {
    "buf": (byteArray) => byteArray,
    "bufStr": (byteArray) => byteArray.split(" ").map(s => parseInt(s)),
    "bits": (bits) => {
        return bits.split(" ").map(byte => parseInt(byte, 2));
    },
    "string": (str) => {
        return Array.from((new TextEncoder("utf-8")).encode(str));
    },
    "hex": (hex) => {
        if(hex.length % 2 != 0) {
            return console.warn(`Tried to turn invalid hex ${hex} into a string.`);
        }
        let result = [];
        for(let i = 0; i < hex.length; i += 2) {
            result.push(parseInt(hex.substring(i, i+2), 16));
        }
        return result;
    }
};

const encoder = {
    "buf": (byteArray) => byteArray,
    "bufStr": (byteArray) => byteArray.join(" "),
    "bits": (byteArray) => {
        return byteArray
            .map((byte) => byte.toString(2))
            .map((bitString) => {
                if(bitString.length == 8) return bitString;
                return (new Array(8 - bitString.length)).fill("0").join("") + bitString;
            })
            .join(" ");
    },
    "string": (byteArray) => {
        return (new TextDecoder("utf-8")).decode(Uint8Array.from(byteArray));
    },
    "hex": (byteArray) => {
        return byteArray
            .map(i => i.toString(16))
            .map(h => { if(h.length < 2) return "0" + h; else return h; })
            .join("");
    }
}

module.exports = (from, to, data) => {
    if(!decoder[from]) {
        return console.error(`Missing decoder ${from}; could not encode ${data}`);
    }
    if(!encoder[to]) {
        return console.error(`Missing encoder ${to}; could not encode ${data}`);
    }
    let bytes = decoder[from](data);
    let encoded = encoder[to](bytes);
    return encoded;
};
