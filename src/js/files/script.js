// Подключение автозаполнения для input
import { autocomplete } from "./forms/autocomplete.js";
/* Подключение флеш сообщений */
import { showflashMessages } from "./flashmessages.js";
// Подключение панели фильтров для мобидьных устройств
import { filtersPanel } from "./filters/filters-panel-mobile.js";
// Ініціалізація фільтров
import { initFilters } from "./filters/filters.js";
import { fetchAutocompleteData } from "./filters/data-for-autocomplete.js";
import { saveAs } from "file-saver";

const download = async (url, filename) => {
   const data = await fetch(url, {mode: "no-cors",});
   const blob = await data.blob();
   const objectUrl = URL.createObjectURL(blob);

   const link = document.createElement("a");

   link.setAttribute("href", objectUrl);
   link.setAttribute("download", filename);
   link.style.display = "none";

   document.body.appendChild(link);

   link.click();

   document.body.removeChild(link);
};


//========================================================================================================================================================
// INPUT c автозаполнением названиями продуктов
//========================================================================================================================================================

// url для получения данных
// const productsListUrl = "/api/products/list";
const productsListUrl = "./files/products/products-list.json"; // Данные для автозаполнения input-a формы поиска продуктов

const submitProductSearchForm = () => {
   const form = document.getElementById("productsSearchForm");
   if (form) {      
      form.querySelector("input").value.trim() ? form.submit() : form.querySelector("input").value = "";
   }
};

if (document.getElementById("productsSearchForm")) {
   fetchAutocompleteData(productsListUrl).then(data => {
      autocomplete(document.getElementById("productsSearch"), data, submitProductSearchForm);
      document.getElementById("productsSearchForm").addEventListener('submit', function (e) {
         e.preventDefault();
         submitProductSearchForm();
      });
   });    
} 
//========================================================================================================================================================

showflashMessages();
filtersPanel();

//========================================================================================================================================================
// ФІЛЬТРИ ПРОДУКЦІЇ
//========================================================================================================================================================

// url для получения данных для заполнения фильтров
//const productsFiltersUrl = ["/api/products/categories", "/api/products/tags", "/files/volume-content.json"];
const productsFiltersUrl = ["/files/products/categories.json", "/files/products/tags.json", "/files/products/volume-content.json"];
// ідентификаторы для каждой группы фильтров
const productsFiltersGroupId = ["chemical", "applying", "vc"];
// url для получения результата поиска продуктов
// const productsFiltersRequestUrl = "/api/products";
const productsFiltersRequestUrl = "/files/products/products.json";

/*
if (document.querySelector("[data-products]")) {
   initFilters(productsFiltersUrl, productsFiltersGroupId, productsFiltersRequestUrl, productsListUrl);
}
*/


//========================================================================================================================================================
// ФИЛЬТРИ ОБ'ЄКТІВ
//========================================================================================================================================================

// url для получения данных для заполнения фильтров
// const objectsFiltersUrl = ["/api/objects/industries", "/api/objects/tags"];
const objectsFiltersUrl = ["/files/objects/industries.json", "/files/objects/tags.json"];
// ідентификаторы для каждой группы фильтров
const objectsFiltersGroupId = ["industry", "surface"];
// url для получения результата поиска продуктов
// const objectsFiltersRequestUrl = "/api/objects";
const objectsFiltersRequestUrl = "/files/objects/objects.json";

/*
if (document.querySelector("[data-objects]")) {
   initFilters(objectsFiltersUrl, objectsFiltersGroupId, objectsFiltersRequestUrl);
}
*/

if (document.querySelector("[data-documents-download]")) {
   document.querySelector("[data-documents-download]").addEventListener("click", (e) => {
      e.preventDefault();
      const element = e.target.closest("a") || null;
      if (element !== null) {
         const url = new URL(element.href);
         saveAs(url.href, url.href.split("/").pop());
      }
   });
}










