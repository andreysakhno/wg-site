import { _slideDown, _slideUp } from "../functions.js";

export function filtersShowMore() {
   const showMoreBlocks = document.querySelectorAll("[data-filters-showmore]");
   if (showMoreBlocks.length) {			
      // Инициализация  объектов			
      initItems(showMoreBlocks);
      document.addEventListener("click", showMoreActions);
      window.addEventListener("resize", showMoreActions);
      document.addEventListener("focusin", showMoreActions);	
   }
   function initItems(showMoreBlocks) {			
      showMoreBlocks.forEach(showMoreBlock => {				
         initItem(showMoreBlock);
      });
   }
   function initItem(showMoreBlock) {
      let showMoreContent = showMoreBlock.querySelectorAll('[data-filters-showmore-content]');
      let showMoreButton = showMoreBlock.querySelectorAll('[data-filters-showmore-button]');
      showMoreContent = Array.from(showMoreContent).filter(item => item.closest('[data-filters-showmore]') === showMoreBlock)[0];
      showMoreButton = Array.from(showMoreButton).filter(item => item.closest('[data-filters-showmore]') === showMoreBlock)[0];
   
      const hiddenHeight = getHeight(showMoreContent);
               
      if (hiddenHeight < getOriginalHeight(showMoreContent)) {
         _slideUp(showMoreContent, 0, hiddenHeight);
         showMoreButton.hidden = false;
      } else {
         _slideDown(showMoreContent, 0, hiddenHeight);
         showMoreButton.hidden = true;
      }

      let checkedCheckboxes = showMoreContent.querySelectorAll('input[type=checkbox]:checked');      
      if (checkedCheckboxes.length > 0) {
            filterShowMoreOpen(showMoreContent);
      }
   }
   function getHeight(showMoreContent) {
      let hiddenHeight = 0;         
      const showMoreTypeValue = showMoreContent.dataset.filtersShowmoreContent;
      const showMoreItems = showMoreContent.children;
      
      for (let index = 1; index < showMoreItems.length; index++) {
         let parentHidden;
         const showMoreItem = showMoreItems[index - 1];
         const style = showMoreItem.currentStyle || window.getComputedStyle(showMoreItem);            
         if (showMoreItem.closest(`[hidden]`)) {
            parentHidden = showMoreItem.closest(`[hidden]`);
            parentHidden.hidden = false;						
         }
         hiddenHeight += showMoreItem.offsetHeight + parseFloat(style.marginBottom) - 1;	            
         parentHidden ? (parentHidden.hidden = true) : null;
         if (index == showMoreTypeValue) break
      }			
      return hiddenHeight;
   }
   function getOriginalHeight(showMoreContent) {
      let parentHidden;
      let hiddenHeight = showMoreContent.offsetHeight;
      showMoreContent.style.removeProperty('height');
      if (showMoreContent.closest(`[hidden]`)) {
         parentHidden = showMoreContent.closest(`[hidden]`);
         parentHidden.hidden = false;
      }
      let originalHeight = showMoreContent.offsetHeight;
      parentHidden ? parentHidden.hidden = true : null;
      showMoreContent.style.height = `${hiddenHeight}px`;
      return originalHeight;
   }

   function showMoreActions(e) {
      const targetEvent = e.target;      
      const targetType = e.type;			
      if (targetType === 'click') {
         if (targetEvent.closest('[data-filters-showmore-button]')) {
            const showMoreButton = targetEvent.closest('[data-filters-showmore-button]');
            const showMoreBlock = showMoreButton.closest('[data-filters-showmore]');
            const showMoreContent = showMoreBlock.querySelector('[data-filters-showmore-content]');
            const showMoreSpeed = showMoreButton.dataset.filtersShowmoreButton ? showMoreButton.dataset.filtersShowmoreButton : '500';            
            const hiddenHeight = getHeight(showMoreContent);
            
            if (!showMoreContent.classList.contains('_slide')) {
               showMoreBlock.classList.contains('_showmore-active') ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
               showMoreBlock.classList.toggle('_showmore-active');
            }
         }
      } else if (targetType === 'resize') {
         showMoreBlocks && showMoreBlocks.length ? initItems(showMoreBlocks) : null;
         const showMoreBlock = document.querySelectorAll("[data-filters-showmore]");
         showMoreBlock.forEach((element) => element.classList.remove('_showmore-active'));
      } else if (targetType === 'focusin') {
         if (targetEvent.closest(`input[type="checkbox"]`) ) {	
            let targetIndex = 0;	
            if (targetEvent.closest(`[data-filters-showmore]`)) {
               const showMoreBlock = targetEvent.closest(`[data-filters-showmore]`);	
               const showMoreContent = targetEvent.closest(`[data-filters-showmore-content]`);	
               const showMoreButton = showMoreBlock.querySelector("[data-filters-showmore-button]");  
               const showMoreSpeed = showMoreButton.dataset.filtersShowmoreButton ? showMoreButton.dataset.filtersShowmoreButton : '500';
               const hiddenHeight = getHeight(showMoreContent);					
               const checkboxes = showMoreContent.children;						
               for (let i = 0; i < checkboxes.length; i++) {
                  let element = checkboxes[i].querySelector(`input[type="checkbox"]`);
                  if (element === targetEvent) targetIndex = i+1;
               }						
               if (!showMoreContent.classList.contains('_slide') && !showMoreBlock.classList.contains('_showmore-active') && showMoreContent.dataset.filtersShowmoreContent < targetIndex) {
                  _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
                  showMoreBlock.classList.add('_showmore-active');
               }
            }					
         }
      }
   }

   function filterShowMoreOpen(showMoreContent) {
      const showMoreBlock = showMoreContent.closest("[data-filters-showmore]");
      const showMoreButton = showMoreBlock.querySelector("[data-filters-showmore-button]");    
      const showMoreSpeed = showMoreButton.dataset.filtersShowmoreButton ? showMoreButton.dataset.filtersShowmoreButton : '500';     
      const hiddenHeight = getHeight(showMoreContent);
      showMoreContent.classList.remove("_slide");
      _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
      showMoreBlock.classList.add('_showmore-active');
   }
}

