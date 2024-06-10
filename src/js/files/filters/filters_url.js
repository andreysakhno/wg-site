//========================================================================================================================================================
// Работа с URL
//========================================================================================================================================================
export function syncURL(filtersGroups, slugInPath) {
   let path = document.location.pathname;
   const pathItems = path.split("/");
   const lastItem = pathItems[pathItems.length - 1];
   if (isPathContainFilterGroupSlug(lastItem, filtersGroups)) {
      path = path.slice(0, path.lastIndexOf("/"));
   }      
   const slugs = transformToSlugString(slugInPath);
   const params = document.location.search;
   window.history.replaceState("", "", `${path}${slugs}${params}`);
}

export function parseSlugsFromPath(filtersGroups) {
   let slugs = [];   
   const path = document.location.pathname;
   const pathItems = path.split("/");
   let lastItem = pathItems[pathItems.length - 1];
   if (isPathContainFilterGroupSlug(lastItem, filtersGroups)) {
      filtersGroups.forEach((group) => {
         lastItem = lastItem.replace(`${group}_`, "");
      });
      lastItem = lastItem.replaceAll("__", "--");
      slugs = lastItem.split("--");
   };
   return slugs;
}

export function getParamsFromUrl() {
   const params = {};
   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   for (const entry of urlParams.entries()) {
      params[entry[0]] = entry[1];
   }
   return params;
}

export  function removeParamFromUrl(param) {
   const queryString = window.location.search;
   const params = new URLSearchParams(queryString);
   params.delete(param);
   const sign = Array.from(params).length ? '?' : '';
   window.history.replaceState("", "", `${document.location.pathname}${sign}${params}`);
}

export  function changeParamInUrl(param, value) {
   const queryString = window.location.search;
   const params = new URLSearchParams(queryString);
   if (params.has(param)) params.delete(param);
   params.append(param, value);
   window.history.replaceState("", "", `${document.location.pathname}?${params}`);
}

function transformToSlugString(slugInPath) {
   let query = "";
   for (let group in slugInPath) {
      if (Object.hasOwnProperty.call(slugInPath, group) && Object.keys(slugInPath[group]).length !== 0) {
         query += (group === Object.keys(slugInPath)[0] || query === '') ? "" : "__";
         query += `${group}_`;            
         for (let filterIndex in slugInPath[group]) {
            if (Object.hasOwnProperty.call(slugInPath[group], filterIndex)) {
               query += filterIndex === Object.keys(slugInPath[group])[0] ? "" : "--";
               query += `${slugInPath[group][filterIndex].slug}`;                  
            }
         }
      }
   }
   return query === "" ? query : "/" + query;
}

function isPathContainFilterGroupSlug(path, filtersGroups) {
   let is_contain = false; 
   filtersGroups.forEach(group => {
      if (path.includes(`${group}_`)) is_contain = true;
   })
   return is_contain;
}

