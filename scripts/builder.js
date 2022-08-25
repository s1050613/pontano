"use strict";

var weeksInputEl, daySelectorEl;
var weeksCache = [1, 1, 1, 1, 1, 0, 0];
var weeks = [1, 1, 1, 1, 1, 0, 0];

var builderPeriodCount, builderPeriodTimeTemplateEl, builderPeriodTimesContEl;
var builderPeriodTimeCache = [];

var subjectCardTemplate, subjectSelecterCont, newCardTemplate;
var subjects = [
	["English", "", ""],
	["Maths", "", ""],
	["Science", "", ""],
	["Humanities", "", ""],
	["Physical Education", "", ""]
];

var buildStep = 1;
var buildNextBtns, buildPrevBtns, buildFinishBtn;

window.onload = () => {
	if(localStorage.getItem("showStartAlert") == "true") {
		localStorage.removeItem("showStartAlert");
		swal.fire({
			icon: "success",
			title: "Welcome to Pontano!",
			text: "Let's get started by building your timetable. Follow the steps, and we'll have your new timetable ready in no time!"
		});
	}
	
	selectEls(".toggleableDay").forEach(el => {
		el.addEventListener("click", toggleableDayClickEvent);
	});
	
	selectEls("input[min], input[max]").forEach(el => {
		el.addEventListener("input", e => {
			if(+el.value < +el.min) {
				el.value = el.min;
			}
			if(+el.value > +el.max) {
				el.value = el.max;
			}
		});
	});
	
	weeksInputEl = selectEl("#weeks");
	daySelectorEl = selectEl("#daySelector");
	weeksInputEl.addEventListener("input", e => {
		//weeksCache = selectEls(".toggleableDay").map(el => +parseBool(el.dataset.selected));
		selectEls(".toggleableDay").forEach((el, i) => weeksCache[i] = +parseBool(el.dataset.selected));
		var weeksN = weeksInputEl.value;
		
		if(weeks.length < weeksN * 7) {
			weeks.push(1, 1, 1, 1, 1, 0, 0);
		}
		if(weeks.length > weeksN * 7) {
			weeks.splice(-7, 7);
		}
		
		daySelectorEl.killMyChildren();
		for(var i = 0; i < weeksN * 7; i++) {
			daySelectorEl.innerHTML += `
				<div class="toggleableDay" data-i="${i}"><span>${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i % 7]}</span></div>
			`;
			if(i % 7 == 6) {
				daySelectorEl.innerHTML += `<br/>`;
			}
		}
		selectEls(".toggleableDay").forEach((el, i) => el.dataset.selected = !!(weeksCache[i] == undefined? [1, 1, 1, 1, 1, 0, 0][i % 7] : weeksCache[i]));
		selectEls(".toggleableDay").forEach(el => {
			el.addEventListener("click", toggleableDayClickEvent);
		});
	});
	
	builderPeriodCount = selectEl("#builderPeriodCount");
	builderPeriodTimeTemplateEl = selectEl("#builderPeriodTimeTemplate");
	builderPeriodTimesContEl = selectEl("#builderPeriodTimesCont");
	builderPeriodCount.addEventListener("input", execReturnFunc(() => {
		builderPeriodTimesContEl.killMyChildren();
		for(let i of range(builderPeriodCount.value)) {
			var code = builderPeriodTimeTemplateEl.innerHTML;
			code = code.replace("$1", (builderPeriodTimeCache[i] || [])[0] || "08:05");
			code = code.replace("$2", (builderPeriodTimeCache[i] || [])[1] || "08:55");
			code = code.replace("$3", ["", "checked"][+(builderPeriodTimeCache[i] || [])[2]]);
			builderPeriodTimesContEl.innerHTML += code;
		}
		[...builderPeriodTimesContEl.children].forEach((child, i1) => {
			child.selectEls("input").forEach((input, i2) => {
				input.addEventListener("input", execReturnFunc(e => {
					if(!builderPeriodTimeCache[i1]) {
						builderPeriodTimeCache[i1] = [];
					}
					builderPeriodTimeCache[i1][i2] = input.type == "time"? input.value : input.checked;
				}));
			});
		});
	}));
	
	subjectCardTemplate = selectEl("#subjectTemplate");
	subjectSelecterCont = selectEl("#subjectSelector");subjectSelecterCont.addEventListener("click", e => {
		var el;
		if((el = e.target).classList.contains("subjectRemoveBtn") || (el = e.target.parentElement).classList.contains("subjectRemoveBtn")) {
			var card = el.parentElement;
			card.remove();
		}
	});
	newCardTemplate = selectEl("#subjectAddCardTemplate");
	subjects.forEach(subject => {
		var code = subjectCardTemplate.innerHTML;
		code = code.replace("$1", subject[0]);
		subjectSelecterCont.innerHTML += code;
	});
	subjectSelecterCont.innerHTML += newCardTemplate.innerHTML;
	
	
	buildNextBtns = selectEls(".buildNextBtn");
	buildNextBtns.forEach(btn => {
		btn.addEventListener("click", e => {
			buildStep++;
			updateBuildSteps();
		});
	});
	buildPrevBtns = selectEls(".buildPrevBtn");
	buildPrevBtns.forEach(btn => {
		btn.addEventListener("click", e => {
			buildStep--;
			updateBuildSteps();
		});
	});
	buildFinishBtn = selectEl(".buildFinishBtn");
	buildFinishBtn.addEventListener("click", e => {
		localStorage.setItem("weekLayout", JSON.stringify(weeks));
		localStorage.setItem("periodTimes", JSON.stringify(builderPeriodTimeCache));
		localStorage.setItem("timetableHasBeenBuilt", "true");
		location.href = "app.html";
	});
};

function toggleableDayClickEvent(e) {
	var el = e.currentTarget;
	weeks[el.dataset.i] = +(el.dataset.selected = !parseBool(el.dataset.selected));
	//console.log(el.dataset.i)
}

async function updateBuildSteps() {
	var currentStep = selectEl(".step.showing");
	var newStep = selectEl(`.step[data-step-n="${buildStep}"]`);
	
	currentStep.classList.remove("showing");
	await sleep(500);
	currentStep.classList.add("hidden");
	newStep.classList.remove("hidden");
	await sleep(100);
	newStep.classList.add("showing");
}