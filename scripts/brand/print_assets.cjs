const fs=require('node:fs');const path=require('node:path');const {createRequire}=require('node:module');
const req=process.env.CIDIKS_NODE_MODULES?createRequire(path.join(process.env.CIDIKS_NODE_MODULES,'_brand.cjs')):require;
const {chromium}=req('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CIDIKS_BROWSER?{executablePath:process.env.CIDIKS_BROWSER}:{})});
 const page=await browser.newPage();const root=path.resolve(__dirname,'../../public/brand/stationery');
 for(const [name,w,h] of [['tarjeta-horizontal',91,61],['tarjeta-vertical',61,91],['hoja-membretada',210,297]]){
  const svg=fs.readFileSync(path.join(root,name+'.svg'),'utf8');
  await page.setContent(`<html><head><style>@page{size:${w}mm ${h}mm;margin:0}html,body{margin:0;padding:0;width:${w}mm;height:${h}mm}svg{display:block}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body>${svg}</body></html>`);
  await page.pdf({path:path.join(root,name+'.pdf'),width:w+'mm',height:h+'mm',margin:{top:0,bottom:0,left:0,right:0},printBackground:true,preferCSSPageSize:true});
 }
 await browser.close();console.log('3 vector print PDFs exported; apply TrimBox with print_qa.py.');
})().catch(e=>{console.error(e);process.exit(1)});
