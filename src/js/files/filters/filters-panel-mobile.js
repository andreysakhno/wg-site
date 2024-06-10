// Подключение функционала "Чертогов Фрилансера"
import {bodyLockStatus, bodyLockToggle, bodyLock, bodyUnlock } from "../functions.js";

export function filtersPanel() {
   if (document.querySelector(".filters-btn")) {
		document.addEventListener("click", function (e) {
			if (bodyLockStatus && e.target.closest('.filters-btn')) {
				bodyLockToggle();
				document.documentElement.classList.toggle("filters-open");
			}
		});
	};
}
export function filtersOpen() {
	bodyLock();
	document.documentElement.classList.add("filters-open");
}
export function filtersClose() {
	bodyUnlock();
	document.documentElement.classList.remove("filters-open");
}