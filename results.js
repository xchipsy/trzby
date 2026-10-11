import {getConfiguredStores} from './storage.js';
import {getStoreLabel} from './settings.js';
const stores=getConfiguredStores();
const select=document.getElementById('resultsStore');
const label=document.getElementById('resultsStoreLabel');
if(!stores.length){select.innerHTML='<option>Žádná uložená prodejna</option>';select.disabled=true;label.textContent='Nejdřív ulož prodejnu v Editaci.'}
else{
  for(const id of stores){const option=document.createElement('option');option.value=id;option.textContent=getStoreLabel(id);select.append(option)}
  const requested=new URLSearchParams(location.search).get('store');
  if(stores.includes(requested))select.value=requested;
  const update=()=>{label.textContent=`Vybraná prodejna: ${getStoreLabel(select.value)}`};
  select.addEventListener('change',update);update();
}
