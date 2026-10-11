// Testovací úložiště v tomto prohlížeči. Není synchronizované mezi zařízeními.
const PREFIX='sz-trzby-test-v1:';
const key=(storeId,year,month)=>`${PREFIX}${storeId}:${year}:${month}`;
export async function loadMonth(storeId,year,month){const raw=localStorage.getItem(key(storeId,year,month));if(!raw)return null;try{return JSON.parse(raw)}catch(e){console.error(e);return null}}
export async function saveMonth(storeId,year,month,data){localStorage.setItem(key(storeId,year,month),JSON.stringify(data))}
export async function deleteMonth(storeId,year,month){localStorage.removeItem(key(storeId,year,month))}
const GROUP_KEY='sz-trzby-test-v1:configured-stores';
export function getConfiguredStores(){try{const data=JSON.parse(localStorage.getItem(GROUP_KEY));return Array.isArray(data)?data.filter(x=>/^\d+$/.test(String(x))).map(String):[]}catch{return []}}
export function setConfiguredStores(ids){localStorage.setItem(GROUP_KEY,JSON.stringify([...new Set(ids.map(String))]))}
