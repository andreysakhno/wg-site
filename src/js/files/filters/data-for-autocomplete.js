// Получение данных
export async function fetchAutocompleteData(url = '') {
   try {
      const response = await fetch(url, {
         method: "GET",
         mode: "no-cors",
      });
      if (!response.ok) {
         const message = `An error has occured: ${response.status}`;
         throw new Error(message);
      }
      const data = await response.json();  

      const ukrNames = [], engNames = [];
      for (let key in data) {
         ukrNames.push(data[key].name_ukr);
         engNames.push(data[key].name_eng);
      }
      return ukrNames.concat(engNames);      
   
   } catch (error) {
      console.error(error);
   }   
}