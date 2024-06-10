export async function searchResults(requestUrl, requestData, checkboxes) {
   const resultContainer = document.querySelector("[data-search-result]");
   const paggingContainer = document.querySelector(".pagging");
   try {
      const response = await fetch(requestUrl, {
         method: "GET",
         mode: "no-cors",
         /*
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(requestData)
         */
      });
      if (!response.ok) {
         const message = `An error has occured: ${response.status} - ${response.url}`;
         throw new Error(message);
      }
      const json = await response.json();
      return await renderSearchResults(json);
   } catch (error) {
      console.error(error);
   }

   async function renderSearchResults(json) {
      // Удаляем все из контейнера результатов кромме .pagging

      while (resultContainer.children.length > 1) {
         resultContainer.firstChild.remove();
      }

      disableAllGroupsCheckboxes();

      if (json.hasOwnProperty("products")) {
         if (json.products.length !== 0) {
         json.products.reverse().forEach((product) => {
            const productCard = createProductItem(product);
            resultContainer.prepend(productCard);
         });
         if (json.filters.applyingIds.length !== 0)
            enableGroupCheckboxes(json.filters.applyingIds, 1);
         if (json.filters.vcIds.length !== 0)
            enableGroupCheckboxes(json.filters.vcIds, 2);
         } else {
         const noItems = noFoundItems("Продуктів не знайдено.");
         resultContainer.prepend(noItems);
         enableAllGroupsCheckboxes();
         }
      }

      if (json.hasOwnProperty("objects")) {
         if (json.objects.length !== 0) {
         json.objects.reverse().forEach((object) => {
            const objectCard = createObjectItem(object);
            resultContainer.prepend(objectCard);
         });
         if (json.filters.surfaceIds.length !== 0)
            enableGroupCheckboxes(json.filters.surfaceIds, 1);
         } else {
         const noItems = noFoundItems("Об'єктів не знайдено.");
         resultContainer.prepend(noItems);
         enableAllGroupsCheckboxes();
         }
      }

      while (paggingContainer.firstChild) {
         paggingContainer.firstChild.remove();
      }

      if (
         json.hasOwnProperty("totalCount") &&
         json.hasOwnProperty("itemsPerPage") &&
         json.hasOwnProperty("currentPage")
      ) {
         if (+json.totalCount > +json.itemsPerPage) {
         createPagging(+json.totalCount, +json.itemsPerPage, +json.currentPage);
         }
      }
   }

   function createProductItem(product) {
      const productCard = document.createElement("a");
      productCard.classList = "main__card product-card";
      productCard.setAttribute("href", `/products/${product.slug}`);

      const productCardTitle = document.createElement("h4");
      productCardTitle.classList = "product-card__title";
      productCardTitle.textContent = `${product.name_ukr} (${product.name_eng})`;
      productCard.append(productCardTitle);

      const productCardDescription = document.createElement("div");
      productCardDescription.classList = "product-card__description";
      productCardDescription.textContent = product.title;
      productCard.append(productCardDescription);

      const productCardCategories = document.createElement("div");
      productCardCategories.classList = "product-card__categories";
      productCard.append(productCardCategories);

      const productCardChemicalMain = document.createElement("div");
      productCardChemicalMain.classList = "product-card__category category-red";
      productCardChemicalMain.textContent = product.chemical.main.title;
      productCardCategories.append(productCardChemicalMain);

      product.chemical.other.forEach((element) => {
         const productCardChemicaOther = document.createElement("div");
         productCardChemicaOther.classList = "product-card__category category-red";
         productCardChemicaOther.textContent = element.title;
         productCardCategories.append(productCardChemicaOther);
      });

      product.applying.forEach((element) => {
         const productCardApplying = document.createElement("div");
         productCardApplying.classList = "product-card__category category-blue";
         productCardApplying.textContent = element.title;
         productCardCategories.append(productCardApplying);
      });

      const productCardMore = document.createElement("div");
      productCardMore.classList = "product-card__more more";
      productCard.append(productCardMore);

      const productCardMoreLink = document.createElement("div");
      productCardMoreLink.classList = "more__link";
      productCardMoreLink.textContent = "Детальніше";
      productCardMore.append(productCardMoreLink);

      return productCard;
   }

   function createObjectItem(object) {
      const objectCard = document.createElement("a");
      objectCard.classList = "primary-card-gorizontal objects-card";
      objectCard.setAttribute("href", `/objects/${object.slug}`);

      const objectCardImageDiv = document.createElement("div");

      if (object.photo.srcset) {
         objectCardImageDiv.classList = "primary-card-gorizontal__image-ibg";
         const picture = document.createElement("picture");
         const source = document.createElement("source");
         const img = document.createElement("img");
         source.srcset = object.photo.srcset;
         source.type = "image/webp";
         img.src = object.photo.src;
         img.alt = object.name;
         img.loading = "lazy";
         picture.append(source);
         picture.append(img);
         objectCardImageDiv.append(picture);
      } else {
         objectCardImageDiv.classList = "primary-card-gorizontal__no-photo";
         const img = document.createElement("img");
         img.src = object.photo.src;
         img.alt = object.name;
         objectCardImageDiv.append(img);
      }
      objectCard.append(objectCardImageDiv);

      const objectCardDivBody = document.createElement("div");
      objectCardDivBody.classList = "primary-card-gorizontal__body";
      objectCard.append(objectCardDivBody);

      const objectCardDivArticle = document.createElement("div");
      objectCardDivArticle.classList = "primary-card-gorizontal__article";
      objectCardDivBody.append(objectCardDivArticle);

      const objectCardTitle = document.createElement("h4");
      objectCardTitle.classList = "primary-card-gorizontal__title";
      objectCardTitle.textContent = object.name;
      objectCardDivArticle.append(objectCardTitle);

      const objectCardInfo = document.createElement("div");
      objectCardInfo.classList = "primary-card-gorizontal__info";
      objectCardDivArticle.append(objectCardInfo);

      if (object.country || object.city) {
         const objectCardLocation = document.createElement("div");
         objectCardLocation.classList = "primary-card-gorizontal__item";
         objectCardInfo.append(objectCardLocation);

         const objectCardLocationLable = document.createElement("span");
         objectCardLocationLable.classList = "primary-card-gorizontal__lable";
         objectCardLocationLable.textContent = "Розташування:";
         objectCardLocation.append(objectCardLocationLable);

         const objectCardLocationData = document.createElement("span");
         objectCardLocationData.classList = "primary-card-gorizontal__data";
         objectCardLocationData.textContent = `${object.city}${object.country && object.city ? ',' : ''} ${object.country}`;
         objectCardLocation.append(objectCardLocationData);
      }
      
      if (object.year_start || object.year_finished) {
         const objectCardYear = document.createElement("div");
         objectCardYear.classList = "primary-card-gorizontal__item";
         objectCardInfo.append(objectCardYear);

         const objectCardYearLable = document.createElement("span");
         objectCardYearLable.classList = "primary-card-gorizontal__lable";
         objectCardYearLable.textContent = "Період:";
         objectCardYear.append(objectCardYearLable);

         const objectCardYearData = document.createElement("span");
         objectCardYearData.classList = "primary-card-gorizontal__data";
         objectCardYearData.textContent = `${object.year_start}${object.year_start && object.year_finished ? '-' : ''} ${object.year_finished}`;
         objectCardYear.append(objectCardYearData);
      }
      
      const objectCardCategories = document.createElement("div");
      objectCardCategories.classList = "primary-card-gorizontal__categories";
      objectCardDivArticle.append(objectCardCategories);

      const objectCardIndustry = document.createElement("div");
      objectCardIndustry.classList = "primary-card-gorizontal__category category-red";
      objectCardIndustry.textContent = object.industry.title;
      objectCardCategories.append(objectCardIndustry);

      object.surface.forEach((element) => {
         const objectCardSurface = document.createElement("div");
         objectCardSurface.classList = "primary-card-gorizontal__category category-blue";
         objectCardSurface.textContent = element.title;
         objectCardCategories.append(objectCardSurface);
      });

      const objectCardMore = document.createElement("div");
      objectCardMore.classList = "primary-card-gorizontal__more more";
      objectCardDivBody.append(objectCardMore);

      const objectCardMoreLink = document.createElement("div");
      objectCardMoreLink.classList = "more__link small-link";
      objectCardMoreLink.textContent = "Детальніше";
      objectCardMore.append(objectCardMoreLink);

      return objectCard;
   }

   function noFoundItems(massage) {
      const noFound = document.createElement("h4");
      noFound.classList = "no-found";
      const noFoundMessage = document.createElement("p");
      noFoundMessage.classList = "no-found__message";
      noFoundMessage.textContent = massage;
      noFound.append(noFoundMessage);
      return noFound;
   }

   function enableAllGroupsCheckboxes() {
      for (let i = 1; i < checkboxes.length; i++) {
         checkboxes[i].forEach((checkbox) => {
         checkbox.querySelector('input[type="checkbox"]').disabled = false;
         });
      }
   }

   function disableAllGroupsCheckboxes() {
      for (let i = 1; i < checkboxes.length; i++) {
         checkboxes[i].forEach((checkbox) => {
         checkbox.querySelector('input[type="checkbox"]').disabled = true;
         });
      }
   }

   function enableGroupCheckboxes(activeFilters, filterGroupIndex) {
      checkboxes[filterGroupIndex].forEach((checkbox) => {
         if (
         activeFilters.includes(
            +checkbox.querySelector('input[type="checkbox"]').value
         )
         ) {
         checkbox.querySelector('input[type="checkbox"]').disabled = false;
         }
      });
   }

   function createPagging(totalItems, perPage, activePage) {
      const totalPages = Math.ceil(totalItems / perPage);
      const url = new URL(window.location.href);

      const paggingList = document.createElement("ul");
      paggingList.classList = "pagging__list";
      paggingContainer.append(paggingList);

      for (let page = 1; page <= totalPages; page++) {
         const paggingLi = document.createElement("li");
         paggingList.append(paggingLi);

         if (page !== activePage) {
         const paggingItem = document.createElement("a");
         paggingItem.classList = "pagging__item";
         url.searchParams.set("page", page);
         paggingItem.setAttribute("href", url);
         paggingItem.textContent = page;
         paggingLi.append(paggingItem);
         } else {
         const paggingItemActive = document.createElement("span");
         paggingItemActive.classList = "pagging__item _active";
         paggingItemActive.textContent = page;
         paggingLi.append(paggingItemActive);
         }
      }

      if (activePage !== 1) {
         const prev = document.createElement("a");
         url.searchParams.set("page", activePage - 1);
         prev.setAttribute("href", url);
         prev.classList = "pagging__arrow pagging-prev";
         const prevArrow = document.createElement("span");
         prevArrow.classList = "_icon-arrow";
         prev.append(prevArrow);
         paggingList.before(prev);
      }

      if (activePage !== totalPages) {
         const next = document.createElement("a");
         url.searchParams.set("page", activePage + 1);
         next.setAttribute("href", url);
         next.classList = "pagging__arrow pagging-next";
         const nextArrow = document.createElement("span");
         nextArrow.classList = "_icon-arrow";
         next.append(nextArrow);
         paggingList.after(next);
      }
   }
}

