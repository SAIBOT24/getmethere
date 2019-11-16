import m from "mithril"
import words from "./words"

const root = document.getElementById("root");
const word = words();
let showTime = false;
let remainingTime = getRemainingTime();
let purchase = getPurchasedDate();

function view() {
	return m(".container", [
		m(".flashpass", { style: { background: `url(./assets/img/${word[0]}.gif)` } }, [showTime ? getTimeString() : word[1].toUpperCase(),
																						m(".zonal-indicator", {onclick: () => { document.getElementById("bigshit").style.display = "block";}})]),
		m(".countdown", [
			m(".countdown-days", [m("div", "Days"), m("div", remainingTime[0] > 0 ? remainingTime[0] : " ")]),
			m(".countdown-hours", [m("div", "Hours"), m("div", remainingTime[1] > 0 ? remainingTime[1] : " ")]),
			m(".countdown-minutes", [m("div", "Minutes"), m("div", remainingTime[2])]),
			m(".countdown-seconds", [m("div", "Seconds"), m("div", remainingTime[3])]),
		]),
		m(".activation-label", "Activated on " + purchase[0]),
		m(".keyvalue-container", [
			m(".keyvalue .keyvalue-big", [m("span", "Adult 1-day anytime travelcard"), m("span", "Valid for all zones")]),
			m("hr"),
			m(".keyvalue", [m("span", "Service Provider"), m("span", "get me there")]),
			m(".keyvalue", [m("span", "Customer Name"), m("span", "John Daly")]),
			m(".keyvalue", [m("span", "Date Purchased"), m("span", purchase[1])]),
			m("hr.fill"),
			m(".keyvalue .keyvalue-small", "When using your ticket or travelcard you must be able to display it on your phone if requested. If for any reason you are unable to do so, such as a broken screen or a dead battery, you will be travelling without a visible valid ticket and risk receiving a standard fare penalty of up to £100.")
		]),
		m("#bigshit", {onclick: () => { document.getElementById("bigshit").style.display = "none"; }})
	]);
}

setInterval(() => {
	showTime = !showTime;
}, 2000)

setInterval(() => {
	remainingTime = getRemainingTime();
	m.redraw();
}, 1000);

m.mount(root, { view: view });
root.addEventListener("onclick", () => {
	root.requestFullscreen();
});


function getTimeString() {
	let d = new Date();
	return `${d.getHours().toString(10).padStart(2, '0')}:${d.getMinutes().toString(10).padStart(2, '0')}`;
}

function getPurchasedDate() {
	let d = new Date();
	const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const dayOfWeekLong = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	d.setHours(d.getHours()-2);
	d.setMinutes(Math.floor(Math.random()*60));

	return [
		`${dayOfWeek[d.getDay()]} ${d.getDate()} ${month[d.getMonth()]} at ${d.getHours().toString(10).padStart(2, '0')}:${d.getMinutes().toString(10).padStart(2, '0')}`,
		`${dayOfWeekLong[d.getDay()]} ${d.getDate()} ${month[d.getMonth()]} at ${d.getHours().toString(10).padStart(2, '0')}:${d.getMinutes().toString(10).padStart(2, '0')}`
	];
}

function getRemainingTime() {
	let ret = [];
	let d = new Date();
	let d2 = new Date();

	d2.setHours(1);
	d2.setMinutes(30);
	d2.setSeconds(0);
	d2.setMilliseconds(0);
	if ((d2 - d) < 0) {
		d2.setDate(d2.getDate()+1);
	}

	let diff = d2 - d;

	ret.push(Math.floor(diff / 1000 / 60 / (60 * 24)));
	diff -= ret[0] * 1000 * 60 * 60 * 60 * 24;
	ret.push(Math.floor(diff / 1000 / 60 / 60));
	diff -= ret[1] * 1000 * 60 * 60;
	ret.push(Math.floor(diff / 1000 / 60));
	diff -= ret[2] * 1000 * 60;
	ret.push(Math.floor(diff / 1000));

	return ret;
}
