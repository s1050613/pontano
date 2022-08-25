const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

var _root;

var weekLayout, periodTimes;

var days = [];

var subjectNames = ["English", "Maths", "Science", "Humanities", "Japanese", "Creative Technologies", "Personal Excellence", "Sport", "P.E."];
var teachers = ["Mr. Kane", "Mrs. Vu", "Mr. Bradley", "Mr. Kearey", "Wainwright Sensei", "Ms. Medawatta", "Ms. Weinberg", "", "Mr. Harrison"];
var subjectColours = ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA", "#FFB5E8", "#85E3FF", "#D5AAFF", "#FFF5BA"];
var breakNames = ["Recess", "Lunch"];

var timetableData = [[0, 0, -1, 5, 1, 2, -2, 3, 3], [4, 4, -1, 6, 6, 6, -2, 7, 7], [1, 1, -1, 8, 8, 0, -2, 2, 2], [3, 3, -1, 2, 2, 5, -2, 4, 4], [5, 5, -1, 0, 0, 3, -2, 1, 1]];

var ttableCont;
var ttableNameEl;
var ttableName, prevName;

window.addEventListener("load", () => {
	_root = selectEl(":root").style;
	weekLayout = JSON.parse(localStorage.getItem("weekLayout"));
	periodTimes = JSON.parse(localStorage.getItem("periodTimes"));
	ttableName = localStorage.getItem("timetableName") || "My Timetable";
	
	computeDays();
	//console.log(days);
	
	ttableCont = selectEl("#timetableCont");
	reloadTtableEl();
	
	initTimetableName();
});

function computeDays() {
	days = [];
	weekLayout.forEach((day, i) => {
		if(day) {
			if(weekLayout.length > 7) {
				days.push(`${dayNames[i % 7]} ${~~(i / 7) + 1}`);
			} else {
				days.push(dayNames[i]);
			}
		}
	});
	_root.setProperty("--grid-rows", periodTimes.length);
	_root.setProperty("--grid-cols", days.length);
}
function reloadTtableEl() {
	ttableCont.killMyChildren();
	var lastPeriod;
	var prevEl;
	for(var day = -1; day < days.length; day++) {
		for(var period = -1; period < periodTimes.length; period++) {
			var periodEl = document.createElement("div");
			periodEl.classList.add("period");
			
			var toAdd = true;
			
			if(day == -1 && period == -1) {
				periodEl.classList.add("invisible");
			} else if(day == -1) {
				var periodTime = periodTimes[period];
				periodEl.innerHTML = `Period ${period + 1}<br/><small>${periodTime[0]} - ${periodTime[1]}</small>`;
				periodEl.classList.add("periodLabel");
			} else if(period == -1) {
				periodEl.innerText = days[day];
				periodEl.classList.add("dayHeading");
			} else {
				periodEl.innerText = `day ${day} period ${period}`;
				var periodN = timetableData[day][period];
				var isBreak = false;
				if(periodN < 0) {
					periodN = abs(periodN) - 1;
					isBreak = true;
				}
				periodEl.innerText = isBreak? breakNames[periodN] : subjectNames[periodN];
				if(!isBreak) {
					periodEl.innerHTML += `<br/><small>${teachers[periodN]}</small>`;
				}
				if(timetableData[day][period] == lastPeriod) {
					toAdd = false;
					prevEl.dataset.periodSpan = prevEl.dataset.periodSpan? +prevEl.dataset.periodSpan + 1 : 2;
				} else {
					var col = isBreak? "#CCC" : subjectColours[periodN];
					periodEl.style.background = col;
					periodEl.style.borderColor = RGBTripletToRGB(hexToRGBTriplet(col).map(c => c - 30));
					lastPeriod = timetableData[day][period];
					prevEl = periodEl;
				}
			}
			
			if(toAdd) {
				ttableCont.appendChild(periodEl);
			}
		}
	}
}
function initTimetableName() {
	ttableNameEl = selectEl("#timetableName");
	ttableNameEl.addEventListener("contextmenu", e => {
		e.preventDefault();
		ttableNameEl.setAttribute("contenteditable", "true");
		ttableNameEl.focus();
		prevName = ttableNameEl.innerText;
	});
	ttableNameEl.addEventListener("keydown", e => {
		var key = e.key;
		if(key == "Enter") {
			e.preventDefault();
			ttableNameEl.blur();
		}
		if(key == "Escape") {
			ttableNameEl.innerText = prevName;
			ttableNameEl.blur();
		}
	});
	ttableNameEl.addEventListener("blur", e => {
		ttableNameEl.removeAttribute("contenteditable");
		ttableName = ttableNameEl.innerText;
		document.title = `${ttableName} | Pontano`;
		localStorage.setItem("timetableName", ttableName);
	});
	
	document.title = `${ttableName} | Pontano`;
	ttableNameEl.innerText = ttableName;
}

function hardReset() {
	localStorage.removeItem("timetableHasBeenBuilt");
	location.reload();
}