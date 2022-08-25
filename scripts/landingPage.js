const selectEl = document.querySelector.bind(document);
const selectEls = document.querySelectorAll.bind(document);

const {min, max} = Math;

window.onload = () => {
	selectEls("a[href^='#']").forEach(anchor => {
		anchor.addEventListener("click", () => {
			if(anchor.classList.contains("nav-link")) {
				document.querySelector("#nav-bar .active").classList.remove("active");
				anchor.classList.add("active");
			}
		});
	});

	var allSections = [selectEl("#intro"), selectEl("#about"), selectEl("#faq")];
	var anchors = [selectEl("#nav-bar a[href='#']"), selectEl("#nav-bar a[href='#about']"), selectEl("#nav-bar a[href='#faq']")]
	var tops = allSections.map(section => section.getBoundingClientRect().top);
	var bottoms = allSections.map(section => section.getBoundingClientRect().bottom);
	
	document.body.onscroll = window.onscroll = () => {
		var scroll = window.scrollY + window.innerHeight / 2;
		//console.log(scroll);
		var closestI = -1, closest = -1;
		allSections.forEach((section, i) => {
			var top = tops[i];
			var bottom = bottoms[i];
			if(scroll >= top && scroll <= bottom) {
				closestI = i;
				closest = -2;
				return;
			}
			var dis = scroll < top? top - scroll : scroll - bottom;
			if(closest == -1 || dis < closest) {
				closestI = i;
				closest = dis;
			}
		});
		
		console.log(closestI);
		document.querySelector("#nav-bar .active").classList.remove("active");
		anchors[closestI].classList.add("active");
	};
	document.body.onscroll();
};