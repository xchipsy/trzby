export const STORES = [
  ['107','Třebíč'],['145','Žďár nad Sázavou'],['148','Pelhřimov'],
  ['191','Znojmo'],['199','Dačice'],['222','Jihlava Tesco'],
  ['230','Jihlava Aventin'],['249','Moravské Budějovice'],
  ['250','Jihlava Staré Hory'],['290','Velká Bíteš'],
  ['296','Humpolec'],['308','Velké Meziříčí'],
  ['310','Havlíčkův Brod II']
].map(([id,name])=>({id,name}));
export const MONTHS = ['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'];
export const FAMILY_TARGET = 0.03;
export const SHIFT_COLORS = [
  {name:'Žlutá',hex:'#F5D76E'}, {name:'Oranžová',hex:'#F5A65B'},
  {name:'Červená',hex:'#E98585'}, {name:'Zelená',hex:'#8CCB91'},
  {name:'Modrá',hex:'#88BCE5'}, {name:'Hnědá',hex:'#B9957A'}
];
export function getStoreLabel(id){const s=STORES.find(x=>x.id===String(id));return s?`CS${s.id} ${s.name}`:`CS${id}`;}
export function createDefaultSettings(storeId,year,month){return {
  storeId:String(storeId),year:Number(year),month:Number(month),monthlyPlan:null,lastYearRevenue:null,
  closedDays:[],shifts:{colors:['#F5D76E','#88BCE5'],firstWeekLongShift:1,overrides:{},anchorMonday:null},
  employees:[],dp:{name:'',target:null,unit:'ks'},secondDp:{name:'',target:null,unit:'ks'}
};}
