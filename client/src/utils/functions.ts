/* GLOBAL FUNCTIONS
   ========================================================================== */

/**
 * Reload current browser link
 * It only works in Client Side Render, because window always existed
 * For Server Side Render, please check window first before any window's methods calls
 */
export const reload = () => {
  window.location.reload()
}

/**
 * Safely parse JSON format
 * @param jsonString input json string
 * @returns data in json format or undefined
 */
export const parseJSON = <T>(jsonString: string | null): T | null => {
  try {
    return jsonString === 'undefined' ? null : JSON.parse(jsonString ?? '')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Parsing error on ', { jsonString })
    return null
  }
}

/**
 * Get value from Session Storage by key
 * @param key to get value from Session Storage
 * @returns JSON data
 */
export const getFromSessionStorage = <T>(key: string): T | null => {
  const value = window.sessionStorage.getItem(key)

  if (value != null) {
    return parseJSON(value)
  }
  return null
}

/**
 * Get value from Local Storage by key
 * @param key to get value from Local Storage
 * @returns JSON data
 */
export const getFromLocalStorage = <T>(key: string): T | null => {
  const value = window.localStorage.getItem(key)

  if (value != null) {
    return parseJSON(value)
  }
  return null
}

/**
 * Set value to Local Storage by key
 * @param key to get value from Local Storage
 * @returns JSON data
 */
export const setToLocalStorage = (key: string, value: string): void => {
  return window.localStorage.setItem(key, value)
}

export const removeLocalStorage = (key: string): void => {
  return window.localStorage.removeItem(key)
}
export const removeAllLocalStorage = (): void => {
  return window.localStorage.clear()
}

export const convertDate = (originalDateTime: Date | string, withoutTime?: boolean): string => {
  let arr = originalDateTime instanceof Date ? originalDateTime.toISOString().split(':') : originalDateTime.split(':')
  let date = arr[0]
  if (arr[1])
    date = arr[0] + ':' + arr[1]
  if (withoutTime) {
    date = date.split('T')[0]
  }
  return date
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomIntArray(length: number, min: number, max: number): number[] {
  const randomArray = [];
  for (let i = 0; i < length; i++) {
    randomArray.push(getRandomInt(min, max));
  }
  return randomArray;
}

function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}


export function generateRandomFloatArray(length: number, min: number, max: number, decimalPlaces: number): number[] {
  const randomArray = [];
  for (let i = 0; i < length; i++) {
    randomArray.push(parseFloat(getRandomFloat(min, max).toFixed(decimalPlaces)));
  }
  return randomArray;
}

export function convertDataset(dataset: any[], keyField: string, dataField: string, typeCal: 'avg' | 'sum' | 'count' = 'sum'): {index: number, key: unknown, value: number}[] {
  const result: {index: number, key: unknown, value: number}[] = [];
  const tempDataset = [...dataset];
  const keySet = new Set();
  for (const data of tempDataset) {
    keySet.add(data[keyField]);
  }
  const keyArray = Array.from(keySet);
  for(const key of keyArray){
    const tempData = tempDataset.filter((data) => data[keyField] === key);
    let index = keyArray.indexOf(key);
    let value = 0;
    switch (typeCal) {
      case 'avg':
        value = tempData.reduce((pre, cur) => pre + cur[dataField], 0) / tempData.length;
        break;
      case 'sum':
        value = tempData.reduce((pre, cur) => pre + cur[dataField], 0);
        break;
      case 'count':
        value = tempData.length;
        break;
      default:
        break;
    }
    result.push({index, key, value});

  }
  return result;
}


export function calculateData(data: any, keyField: string, dataFields: string[],  typeCal: 'avg' | 'sum' | 'count' = 'sum'){
  let result: {index: number, key: any, value: number};
  let value = 0;
  if(typeCal === 'avg'){
    value = dataFields.reduce((pre, cur) => pre + data[cur], 0) / dataFields.length;
  }
  if(typeCal === 'sum'){
    value = dataFields.reduce((pre, cur) => pre + data[cur], 0);
  }
  if(typeCal === 'count'){
    value = dataFields.length;
  }
  result = {index: 0, key: data[keyField], value};
  return result;

}

export function filterByField(dataset: any[], field: string, value: any): any[] {
  return dataset.filter((data) => data[field] === value);
}
export function filterByFields(dataset: any[], fields: string[], value: any[]): any[] {
  return dataset.filter((data) =>{
    let result = true;
    for(let i = 0; i < fields.length; i++){
      if(data[fields[i]] !== value[i]){
        result = false;
        break;
      }
    }
    return result;
  });
}