import { fetchFiltersData } from './filters-init.js';
import { filtersShowMore } from './filters-show-more.js';
import {
  syncURL,
  getParamsFromUrl,
  removeParamFromUrl,
  changeParamInUrl,
} from './filters_url.js';
import { searchResults } from './filters-search.js';
import { flsModules } from '../modules.js';
import { fetchAutocompleteData } from './data-for-autocomplete.js';
import { autocomplete } from '../forms/autocomplete.js';
import { filtersClose } from './filters-panel-mobile.js';

export function initFilters(
  filtersUrls,
  filtersGroups,
  requestUrl,
  autocompleteListUrl = ''
) {
  const filtersContainer = document.querySelector('[data-filters]');
  const marksContainer = document.querySelector('[data-filters-marks]');
  const preloader = document.querySelector('[data-preloader]');
  const productsSearchInput = document.querySelector('#productsSearch');

  // select сортировки
  const sortSelect = document.querySelector('.controls__sort-select');

  const filtersData = [];
  const checkBoxes = [];
  const slugInPath = {};
  const requestData = {};
  let urlParams = {};

  if (filtersContainer) {
    preloader.classList.toggle('fadein');

    if (productsSearchInput) {
      fetchAutocompleteData(autocompleteListUrl).then((data) => {
        autocomplete(productsSearchInput, data, searchByProductName);
      });
    }

    fetchFiltersData(filtersUrls, filtersGroups).then((data) => {
      data.forEach((item, index) => {
        filtersData.push(item[0]);
        checkBoxes.push(item[1]);
        slugInPath[filtersGroups[index]] = item[2];
      });

      // Добавляем все выделенные фильтры, полученные с url в панель меток
      filtersGroups.forEach((groupName, filterGroupIndex) => {
        for (
          let filterIndex = 0;
          filterIndex < filtersData[filterGroupIndex].length;
          filterIndex++
        ) {
          if (filtersData[filterGroupIndex][filterIndex].checked) {
            addToMarkBar(filterGroupIndex, filterIndex);
            // Если выделен родитель то детей пропускаем (не добавляем в панель меток)
            filterIndex +=
              filtersData[filterGroupIndex][filterIndex].children.length;
          }
        }
      });

      urlParams = getParamsFromUrl();

      let page = 1;
      if (urlParams.hasOwnProperty('page')) {
        page = +urlParams.page;
        page = Number.isNaN(page) ? 1 : page;
      }

      let sort = 'asc';
      if (urlParams.hasOwnProperty('sort')) {
        sort = urlParams.sort;
        sort = sort.toLowerCase();
        sort = sort === 'asc' || sort === 'desc' ? sort : 'asc';
      }
      // Изменяем состояние selecta сортировки
      selectSortByValue(sort);

      if (productsSearchInput && urlParams.hasOwnProperty('productsSearch')) {
        productsSearchInput.value = urlParams.productsSearch;
        allFiltersClear();
        fillRequestData({}, urlParams.productsSearch, sort, page);
      } else {
        fillRequestData(slugInPath, '', sort, page);
      }

      filtersShowMore();

      searchResults(requestUrl, requestData, checkBoxes).then(() => {
        filtersEvents();
        preloaderToggle();
      });
    });
  }

  function filtersEvents() {
    // Обработчик событий на изменение состояния чекбоксов
    filtersContainer.addEventListener('change', (e) => {
      if (!!e.target.closest('.categories__checkbox')) {
        if (productsSearchInput) clearProductsSearch();
        preloaderToggle();
        checkBoxChange(e);
        const sort = getValueSelectedSort();
        fillRequestData(slugInPath, '', sort);
        searchResults(requestUrl, requestData, checkBoxes).then(() => {
          preloaderToggle();
        });
      }
    });

    // Обработчик событий на клик по меткам выбранных чекбоксов
    marksContainer.addEventListener('click', (e) => {
      if (!!e.target.closest('.selected-filters__clear-all')) {
        if (productsSearchInput) clearProductsSearch();
        preloaderToggle();
        allFiltersClear();
        const sort = getValueSelectedSort();
        fillRequestData({}, '', sort);
        searchResults(requestUrl, requestData, checkBoxes).then(() => {
          preloaderToggle();
        });
      }
      if (!!e.target.closest('.selected-filters__item')) {
        if (productsSearchInput) clearProductsSearch();
        preloaderToggle();
        filterClear(e);
        const sort = getValueSelectedSort();
        fillRequestData(slugInPath, '', sort);
        searchResults(requestUrl, requestData, checkBoxes).then(() => {
          preloaderToggle();
        });
      }
    });

    document.querySelector('.filters__reset').addEventListener('click', (e) => {
      if (productsSearchInput) clearProductsSearch();
      preloaderToggle();
      allFiltersClear();
      const sort = getValueSelectedSort();
      fillRequestData({}, '', sort);
      searchResults(requestUrl, requestData, checkBoxes).then(() => {
        preloaderToggle();
      });
    });

    document.querySelector('.filters__apply').addEventListener('click', (e) => {
      filtersClose();
    });

    document.querySelector('.pagging').addEventListener('click', (e) => {
      e.preventDefault();
      const element = e.target.closest('a') || null;
      if (element !== null) {
        const href = new URL(element.href);
        const page = href.searchParams.get('page');
        changeParamInUrl('page', page);
        preloaderToggle();
        const sort = getValueSelectedSort();
        if (productsSearchInput && urlParams.hasOwnProperty('productsSearch')) {
          productsSearchInput.value = urlParams.productsSearch;
          fillRequestData({}, urlParams.productsSearch, sort, page);
        } else {
          fillRequestData(slugInPath, '', sort, page);
        }
        searchResults(requestUrl, requestData, checkBoxes).then(() => {
          preloaderToggle();
        });
      }
    });

    document.addEventListener('selectCallback', function (e) {
      // Селект
      const sort = getValueSelectedSort();
      changeParamInUrl('sort', sort);
      preloaderToggle();

      if (productsSearchInput && urlParams.hasOwnProperty('productsSearch')) {
        productsSearchInput.value = urlParams.productsSearch;
        fillRequestData({}, urlParams.productsSearch, sort);
      } else {
        fillRequestData(slugInPath, '', sort);
      }

      searchResults(requestUrl, requestData, checkBoxes).then(() => {
        preloaderToggle();
      });
    });
    if (productsSearchInput) {
      productsSearchInput.nextElementSibling.addEventListener(
        'click',
        function (e) {
          searchByProductName();
        }
      );
    }
  }

  const searchByProductName = () => {
    const searchValue = getProductsSearchValue();
    if (searchValue) {
      preloaderToggle();
      allFiltersClear();
      changeParamInUrl('productsSearch', searchValue);
      urlParams.productsSearch = searchValue;
      const sort = getValueSelectedSort();
      fillRequestData({}, urlParams.productsSearch, sort);
      searchResults(requestUrl, requestData, checkBoxes).then(() => {
        preloaderToggle();
      });
    }
  };

  function checkBoxChange(e) {
    // Из id чекбокса получаем iдентификатор группы фильтров и индекс выбраного чекбокса
    let [filterGroupName, filterIndex] = e.target.getAttribute('id').split('_');
    filterIndex = parseInt(filterIndex);
    // Індекс в масиве группы, в которую входит выбранный чекбокс
    const filterGroupIndex = getFilterGroupIndex(filterGroupName);
    // Выбранный фильтр
    const checkedFilter = filtersData[filterGroupIndex][filterIndex];

    // Изменяем поле checked объекта выбраного фильтра и добавляем/удаляем метку фильтра из панели меток
    checkedFilter.checked
      ? filterCheckOff(filterGroupIndex, filterIndex)
      : filterCheckOn(filterGroupIndex, filterIndex);

    // Если у элемента есть дочернии элементы, выделяем их
    const children = getChildren(filterGroupIndex, filterIndex);
    if (children.length > 0) {
      children.forEach((childIndex) => {
        //Если выделен, то выделяем детей, и наоборот
        checkedFilter.checked
          ? filterCheckOn(filterGroupIndex, childIndex, false)
          : filterCheckOff(filterGroupIndex, childIndex, false);
        //Удаляем метки детей из панели меток
        removeFromMarkBar(filterGroupIndex, childIndex);
        //Удаляем slug детей из url
        removeSlugFromUrl(filterGroupIndex, childIndex);
      });
    }

    // Если кликнули на элемент второго уровня (ребенок, поле parentIndex не Null), то снимаем выделение с родителя
    const parentIndex = checkedFilter.parentIndex;
    if (parentIndex !== null) {
      isAllChildrenChecked(filterGroupIndex, parentIndex)
        ? filterCheckOn(filterGroupIndex, parentIndex)
        : filterCheckOff(filterGroupIndex, parentIndex);
      // Добавляем метки в панель меток выбранных детей
      let children = getChildren(filterGroupIndex, parentIndex);
      children.forEach((childIndex) => {
        if (isChecked(filterGroupIndex, childIndex))
          filterCheckOn(filterGroupIndex, childIndex);
        if (isAllChildrenChecked(filterGroupIndex, parentIndex)) {
          //Удаляем метки детей из панели меток
          removeFromMarkBar(filterGroupIndex, childIndex);
          //Удаляем slug детей из url
          removeSlugFromUrl(filterGroupIndex, childIndex);
        }
      });
    }
    //Добавляем slug из slugInPath в url
    syncURL(filtersGroups, slugInPath);
  }

  function allFiltersClear() {
    for (let groupIndex = 0; groupIndex < filtersData.length; groupIndex++) {
      for (
        let filterIndex = 0;
        filterIndex < filtersData[groupIndex].length;
        filterIndex++
      ) {
        filterCheckOff(groupIndex, filterIndex);
      }
    }
    syncURL(filtersGroups, slugInPath);
  }

  function filterClear(e) {
    const btn = e.target.closest('.selected-filters__item');
    const filterGroupName = btn.dataset.filtersGroup;
    const filterIndex = parseInt(btn.dataset.filterIndex);
    // Індекс в масиве группы, в которую входит выбранный чекбокс
    const filterGroupIndex = getFilterGroupIndex(filterGroupName);
    // снимаем выделение с выбраного элемента
    filterCheckOff(filterGroupIndex, filterIndex);
    // Если у элемента есть дочернии элементы, снимаем выделение с них
    let children = getChildren(filterGroupIndex, filterIndex);
    if (children.length > 0) {
      children.forEach((item) => {
        filterCheckOff(filterGroupIndex, item);
      });
    }
    //Добовляем slug из slugInPath в url
    syncURL(filtersGroups, slugInPath);
  }

  //========================================================================================================================================================
  function getFilterGroupIndex(filterGroupName) {
    for (let index = 0; index < filtersGroups.length; index++) {
      if (filtersGroups[index] === filterGroupName) return index;
    }
  }

  // Возвращает массив детей (свойство children)
  function getChildren(groupIndex, filterIndex) {
    return filtersData[groupIndex][filterIndex].children;
  }

  function isChecked(groupIndex, filterIndex) {
    return filtersData[groupIndex][filterIndex].checked;
  }

  function isAllChildrenChecked(groupIndex, filterIndex) {
    let is_checked = true;
    const children = getChildren(groupIndex, filterIndex);
    children.forEach((childIndex) => {
      if (!isChecked(groupIndex, childIndex)) is_checked = false;
    });
    return is_checked;
  }

  function filterCheckOn(groupIndex, filterIndex, isAddToUrlAndMarkBar = true) {
    filtersData[groupIndex][filterIndex].checked = true;
    checkBoxes[groupIndex][filterIndex].querySelector(
      'input[type="checkbox"]'
    ).checked = true;
    if (isAddToUrlAndMarkBar) {
      addToMarkBar(groupIndex, filterIndex);
      addSlugToUrl(groupIndex, filterIndex);
    }
  }

  function filterCheckOff(
    groupIndex,
    filterIndex,
    isRemoveFromUrlAndMarkBar = true
  ) {
    filtersData[groupIndex][filterIndex].checked = false;
    checkBoxes[groupIndex][filterIndex].querySelector(
      'input[type="checkbox"]'
    ).checked = false;
    if (isRemoveFromUrlAndMarkBar) {
      removeFromMarkBar(groupIndex, filterIndex);
      removeSlugFromUrl(groupIndex, filterIndex);
    }
  }

  //========================================================================================================================================================
  // Панель меток
  //========================================================================================================================================================

  // Добавляет метку выделеных чекбоксов в верхнюю панель
  function addToMarkBar(groupIndex, filterIndex) {
    // Создаем новую метку и кнопку "очистить все"
    let mark = createMark(groupIndex, filterIndex);
    let clearAll = createClearAll();

    // Если в контейнере нет еще меток вставляем метку и добавляем "очистить все"
    if (!marksContainer.hasChildNodes()) {
      marksContainer.append(mark);
      marksContainer.append(clearAll);
      return;
    }

    // Если в контейнере есть метки, но нет меток конкретной группы,
    // то вcтавляем новую метку согласно позиций в массиве filtersGroups
    const marks = getMarksByGroupName(filtersGroups[groupIndex]);
    if (marks.length === 0) {
      for (let i = 0; i < filtersGroups.length; i++) {
        // Нашли позицию
        if (filtersGroups[i] === filtersGroups[groupIndex]) {
          // Ищим следующую группу в панеле меток
          for (let j = i + 1; j < filtersGroups.length; j++) {
            let nextGroup = getMarksByGroupName(filtersGroups[j]);
            // Если группа есть вставляем перед первым ее элементом
            // иначе вставляем в конец панели меток
            if (nextGroup.length > 0) {
              nextGroup[0].before(mark);
              return;
            }
          }
          // Вставляем перед "очистить все"
          marksContainer.lastChild.before(mark);
          return;
        }
      }
    }

    // Если в контейнере есть метки конкретной группы, то втавляем новую метку согласно порядка фильтров
    if (filterIndex < +marks[0].dataset.filterIndex) {
      marks[0].before(mark);
      return;
    }
    if (filterIndex > +marks[marks.length - 1].dataset.filterIndex) {
      marks[marks.length - 1].after(mark);
      return;
    }
    for (let i = 0; i < marks.length - 1; i++) {
      if (
        filterIndex > +marks[i].dataset.filterIndex &&
        filterIndex < +marks[i + 1].dataset.filterIndex
      ) {
        marks[i].after(mark);
        return;
      }
    }
  }

  // Удаляет метку из панель меток
  function removeFromMarkBar(groupIndex, filterIndex) {
    let marks = getMarksByGroupName(filtersGroups[groupIndex]);
    for (let mark of marks) {
      if (+mark.dataset.filterIndex === filterIndex) mark.remove();
    }
    if (marksContainer.childNodes.length === 1) clearMarkBar();
  }

  // Очищает всю панель меток
  function clearMarkBar() {
    // Удаляем все метки выделеных чекбоксов в верхней панели
    while (marksContainer.firstChild) {
      marksContainer.firstChild.remove();
    }
  }

  // Создает метки выделеного чекбокса
  function createMark(groupIndex, filterIndex) {
    let btn = document.createElement('button');
    btn.classList = 'selected-filters__item';
    btn.dataset.filtersGroup = filtersGroups[groupIndex];
    btn.dataset.filterIndex = filterIndex;
    let span = document.createElement('span');
    span.classList = 'selected-filters__value';
    span.textContent = filtersData[groupIndex][filterIndex].title;
    btn.append(span);
    return btn;
  }

  // Создает кнопку очистить все метки
  function createClearAll() {
    let btn = document.createElement('button');
    btn.classList = 'selected-filters__clear-all';
    let span = document.createElement('span');
    span.classList = 'selected-filters__value';
    span.textContent = 'Очистити всі';
    btn.append(span);
    return btn;
  }

  function getMarksByGroupName(groupName) {
    return marksContainer.querySelectorAll(
      `[data-filters-group='${groupName}']`
    );
  }

  //========================================================================================================================================================
  // Получение и установка параметров URL
  //========================================================================================================================================================

  function addSlugToUrl(groupIndex, filterIndex) {
    const groupName = filtersGroups[groupIndex];
    const filter = filtersData[groupIndex][filterIndex];
    if (!slugInPath.hasOwnProperty(groupName)) slugInPath[groupName] = {};
    slugInPath[groupName][filterIndex] = {
      id: filter.id,
      slug: filter.slug,
    };
  }

  function removeSlugFromUrl(groupIndex, filterIndex) {
    const groupName = filtersGroups[groupIndex];
    if (slugInPath.hasOwnProperty(groupName))
      delete slugInPath[groupName][filterIndex];
  }
  //========================================================================================================================================================
  // Preloader
  //========================================================================================================================================================
  function preloaderToggle() {
    preloader.classList.toggle('fadein');
    preloader.classList.toggle('fadeout');
  }
  //========================================================================================================================================================
  // requestData
  //========================================================================================================================================================
  function fillRequestData(filters, search, sort = 'asc', page = 1) {
    requestData.filters = filters;
    requestData.search = search;
    if (sort === 'asc') removeParamFromUrl('sort');
    requestData.sort = sort;
    if (page === 1) removeParamFromUrl('page');
    requestData.page = page;
  }
  //========================================================================================================================================================
  // Sort Select
  //========================================================================================================================================================
  function selectSortByValue(value) {
    const options = Array.from(sortSelect.options);
    const optionToSelect = options.find((item) => item.value === value);
    optionToSelect.selected = true;
    flsModules.select.selectBuild(sortSelect);
  }

  function getValueSelectedSort() {
    const options = Array.from(sortSelect.options);
    const optionSelected = options.find((item) => item.selected === true);
    return optionSelected.value.toLowerCase();
  }
  //========================================================================================================================================================
  // Products Search
  //========================================================================================================================================================
  function getProductsSearchValue() {
    const searchValue = productsSearchInput.value;
    if (!searchValue.trim()) {
      productsSearchInput.value = '';
      return false;
    }
    productsSearchInput.value = searchValue.trim();
    return searchValue.trim();
  }

  function clearProductsSearch() {
    productsSearchInput.value = '';
    removeParamFromUrl('productsSearch');
    if (urlParams.hasOwnProperty('productsSearch'))
      delete urlParams.productsSearch;
  }
}
