import Base64 from "crypto-js/enc-base64";
import { Signature as RSASignature } from "jsrsasign";
import { BrowserQRCodeSvgWriter as QRWriter } from "@zxing/library"
const TICKET_DATA = "AAEBAQtmTHhncEtUV1RkdQILSVhPWHlQU3RkY08DBE0wMDEEAgGTBTRGaXJzdERheS1BZHVsdC1HcmVhdGVyIE1hbmNoZXN0ZXIgLSBUb21hc3ogRz9yYWxjenlrfgEEf0AOmxVAU5KsON2j92/NqKgepFtlwd7qcY5C+2D8NLRngRLIhsnDPOkXeAjYiiyJpOPlTdIEboOQJd7WQS+Yiv5L"
const CLIENT_KEY = `
-----BEGIN RSA PRIVATE KEY-----
MIIBOwIBAAJBAJ85kL6TGkmSCAbHIwuJ9qM3rNVGp0guYD/koxT7+h1KBIpiqBaO
loPa7zbU+011Hbf8KH/CZur8JPgMMT9mzoUCAwEAAQJBAIxjfTQLD8p+b4VKX6P0
6PnQRRtnSGdkPIkZVpFR+p2HGZZhB0RGdri+SckF6L8cr3Lx48yoMzoCVuZVvBqh
LaECIQDNQxHAN8mdgq3GbMOfnYjV9RpHNyVcIOFU+tRpRnJB5wIhAMaVRxAuGXQ0
puR+uAAL6D8LSPzCBWubr6F8XU3EBDazAiAafMIopMpOmhNknJpt2X1T5soaUIJw
rgmF1sxcPWv3FwIgEW0SElppQ2hHaO+xx9dDpxyfaAbCoQHFdL9MFMHpuL8CIQCQ
ZFS28bpW5b4Ya1G+LIxw4j2n207V6mEiyAqVEzQMzw==
-----END RSA PRIVATE KEY-----
`;


export default function logic() {
	let data = [];
	let dataBytes = hexToData(Base64.parse(TICKET_DATA).toString());
	let tsBytes = uIntToData(Math.round(new Date().getTime() / 1000));
	let expiryBytes = uIntToData(new Date(new Date().getFullYear()+1, 0, 1).getTime() / 1000);

	data.push.apply(data, dataBytes);
	data.push(200);
	data.push(4);
	data.push.apply(data, tsBytes);
	data.push(201);
	data.push(1);
	data.push(5);
	data.push(202);
	data.push(4);
	data.push.apply(data, expiryBytes);
	data.push(254);
	data.push(1);
	data.push(4);

	let sigBytes = hexToData(signData(data));
	data.push(255);
	data.push(sigBytes.length);
	data.push.apply(data, sigBytes);

	return createBarcode(data);
}

function createBarcode(data) {
	const codeWriter = new QRWriter();
	return codeWriter.write(dataToBase64(data), 150, 150);
}

function dataToBase64(data) {
	var b = '';
	for (var i = 0; i < data.length; i++) {
		b += String.fromCharCode(data[i]);
	}
	return btoa(b);
}

function hexToData(hex) {
	let a = [];

	for (var i = 0; i < hex.length; i+=2) {
		a.push(parseInt(hex.substr(i, 2), 16));
	}

	return a;
}

function signData(data) {
	var sig = new RSASignature({"alg": "SHA1withRSA"});
	sig.init(CLIENT_KEY);

	data.forEach(element => {
		let e = element.toString(16);
		sig.updateHex(e.length === 1 ? "0" + e : e);
	});

	return sig.sign();
}

function uIntToData(uint) {
	let bytes = [];

	if (uint <= 65535) {
		bytes.length = 2;
		bytes[1] = uint & 255;
		bytes[0] = uint >> 8;
	} else {
		bytes.length = 4;
		bytes[3] = uint & 255;
		bytes[2] = uint >> 8 & 255;
		bytes[1] = uint >> 16 & 255;
		bytes[0] = uint >> 24 & 255;
	}

	return bytes;
}
