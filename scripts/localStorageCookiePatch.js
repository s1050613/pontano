if(location.protocol == "file:" && false) {
	Storage.prototype.setItem = (key, value, moreStuff = {
		expires: 30,
	}) => Cookies.set(key, value, moreStuff);
	Storage.prototype.getItem = Cookies.get;
	Storage.prototype.removeItem = Cookies.remove;
	console.log("Running on a local file; switching to cookies!");
}