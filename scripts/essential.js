HTMLElement.prototype.killMyChildren = function() {
	while(this.lastChild) {
		this.removeChild(this.lastChild);
	}
};
HTMLElement.prototype.addEventListeners = function(types, listener, optionsOrUseCapture = false) {
	types.forEach(type => {
		this.addEventListener(type, listener, optionsOrUseCapture);
	});
};

const sleep = async millis => new Promise((resolve, reject) => setTimeout(resolve, millis));

const {min, max, floor, ceil, round, abs} = Math;
const clamp = (n, x, y) => min(max(n, x), y);

const selectEl = document.querySelector.bind(document);
const selectEls = document.querySelectorAll.bind(document);
HTMLElement.prototype.selectEl = function(query) {
	return this.querySelector(query);
};
HTMLElement.prototype.selectEls = function(query) {
	return this.querySelectorAll(query);
};

const parseBool = str => String(str).toLowerCase() == "true";
//const hexToRGB = hex => `rgb(${(hex[0] == "#"? hex.slice(1) : hex)..join(", ")})`;
const hexToRGBTriplet = hex => {
	if(hex[0] == "#") {
		hex = hex.slice(1);
	}
	if(hex.length == 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	return hex.split(/(..)/g).filter(n => n).map(n => eval(`0x${n}`));
};
const RGBTripletToRGB = rgb => `rgb(${rgb.join(", ")})`;

const range = (a, b = "c", d = 1) => (new Array(floor((b == "c"? a : b - a) / d))).fill().map((u, i) => (b == "c"? 0 : a) + d * i);

const execReturnFunc = func => { func(); return func; };