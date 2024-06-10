import tippy from "tippy.js";
import { parseSlugsFromPath } from "./filters_url.js";


export async function fetchFiltersData(urls, filtersGroups) {
   
   // Параметры из url
   const slugs = parseSlugsFromPath(filtersGroups);        
   try {  
      const requests = urls.map((url) => fetch(url, { mode: "no-cors" }));
      const responses = await Promise.all(requests); 

      for (const response of responses) {
         if (!response.ok) {
            const message = `An error has occured: ${response.status} - ${response.url}`;
            throw new Error(message);
         }             
      }           
      const jsonArrays = await Promise.all(responses.map(response => response.json()));
      return await Promise.all(jsonArrays.map((json, index) => processJSON(json, filtersGroups[index], slugs)));
   } catch (error) {
      console.log(error);
   }
}

// Формирует массивы данных для фильтров, массивы чекбоксов, добавляет чекбоксы на страницу
function processJSON(data, filterGroup, slugs) {   
   // Возвращаемые данные    
   const filtersData = [];
   const checkboxes = [];
   const pathSLug = {};

   // Контейнер для вставки чекбоксов определенной группы
   let checkboxContainer = document.querySelector(`[data-filters-group="${filterGroup}"]`);

   // Флаг подсказки 
   let tippyFlag = false;
   let filterIndex = 0;

   data.forEach((filter) => {
      // Получаем объект данных фильтра
      let filterData = getFilterData(filter);            

      // Создаем чекбокс
      let checkbox = createCheckbox(filterGroup, filterIndex, filter);      
      checkboxContainer.append(checkbox); 

      // Если slug фильтра есть в url добавляем данные в объект pathSLug и отмечаем чекбокс
      if (slugs.includes(filter.slug)) {
         pathSLug[filterIndex] = {
            id: filter.id,
            slug: filter.slug,
         };
         filterData.checked = true;
         checkbox.querySelector('input[type="checkbox"]').checked = true; 
      }
      // Добавляем фильтр и его чекбокс в массив данных
      filtersData.push(filterData); 
      checkboxes.push(checkbox);
      
      // Если хоть у одного элементв есть поле description меняем флаг подсказок на true
      tippyFlag = hasTippy(filter);
      
      filterIndex++;
      
      // Если у элемента есть поле children и оно имеет елементы обходим их
      if (filter.hasOwnProperty("children") && filter.children.length > 0) {         
         let parentIndex = filterIndex - 1;         
         filter.children.forEach((child) => {      

            // Получаем объект данных фильтра
            filterData = getFilterData(child, parentIndex);

            // Добавляем индекс ребенка в поле children родителя
            filtersData[parentIndex].children.push(filterIndex);

            // Создаем чекбокс ребенка
            checkbox = createCheckbox(filterGroup, filterIndex, child);
            checkboxContainer.append(checkbox);

            // Если slug фильтра родителя есть в url добавляем его детей в объект pathSLug и отмечаем чекбокс           
            if (filtersData[parentIndex].checked) { 
               filterData.checked = true;
               checkbox.querySelector('input[type="checkbox"]').checked = true;
            } 

            // Если slug фильтра ребенка есть в url добавляем данные в объект pathSLug и отмечаем чекбокс
            if (slugs.includes(child.slug)) {
               pathSLug[filterIndex] = {
                  id: child.id,
                  slug: child.slug,
               };
               filterData.checked = true;
               checkbox.querySelector('input[type="checkbox"]').checked = true; 
            }  
            
            // Добавляем фильтр ребенка и его чекбокс в массив данных
            filtersData.push(filterData); 
            checkboxes.push(checkbox);

            tippyFlag = hasTippy(filter);

            filterIndex++;
         });
      }
   });
   if (tippyFlag) tippy("[data-tippy-content]", {});
   return [filtersData, checkboxes, pathSLug];
}

// Формат возвращаемых масивов данных
// filter - объект с данными фильтра
// parentIndex - номер фильтра (чекбокса) родителя
function getFilterData(filter, parentIndex = null) {
   return {
      id: filter.id,
      slug: filter.slug,
      name: filter.name,
      title: filter.title,
      children: [],
      parentIndex: parentIndex,
      checked: false,
   };
}

// Добавление HTML чекбоксов на страницу
// filterGroup - имя группы фильтров (чекбоксов)
// filterIndex - номер по порядку фильтра (чекбокса) в его группе
// filter - объект с данными фильтра
function createCheckbox(filterGroup, filterIndex, filter) {
   // Блок (тег li) для вставки чекбоксов
   const li = document.createElement("li");
   li.classList = "categories__checkbox checkbox";
   // Если фильтр дочерний (свойство depth > 1) добавляем класс checkbox-second-level
   if (filter.depth > 1) li.classList.add("checkbox-second-level");

   let checkboxInput = document.createElement("input");
   checkboxInput.setAttribute("type", "checkbox");
   checkboxInput.setAttribute("id", `${filterGroup}_${filterIndex}`);
   checkboxInput.setAttribute("name", `form[${filterGroup}_${filterIndex}]`);
   checkboxInput.setAttribute("value", `${filter.id}`);
   checkboxInput.classList = "checkbox__input";
   li.append(checkboxInput);

   let label = document.createElement("label");
   label.setAttribute("for", `${filterGroup}_${filterIndex}`);
   label.classList = "checkbox__label";
   li.append(label);

   let labelspan = document.createElement("span");
   labelspan.classList = "checkbox__text";
   labelspan.textContent = `${filter.name}`;
   label.append(labelspan);

   if (filter.hasOwnProperty('description') && filter.description) {
      let tippy = document.createElement("span");
      tippy.classList = "checkbox__tip";
      tippy.dataset.tippyContent = filter.description;
      tippy.dataset.placement = "right";
      tippy.textContent = "?";
      label.append(tippy);
   }
   return li;
}   

// Проверяет есть ли подсказка (поле description) у фильтра
function hasTippy(filter) {
   return filter.hasOwnProperty("description") && filter.description;
}

