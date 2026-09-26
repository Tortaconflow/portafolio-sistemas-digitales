const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {createRequire}=require('node:module');
const req=process.env.CIDIKS_NODE_MODULES?createRequire(path.join(process.env.CIDIKS_NODE_MODULES,'_brand.cjs')):require;
const sharp=req('sharp'),{chromium}=req('playwright');
const repo=path.resolve(__dirname,'../..'),root=path.join(repo,'public/brand'),result=path.join(repo,'test-results/brand');
const required={
 logo:['cidiks-logo-primary.svg','cidiks-logo-horizontal.svg','cidiks-logo-vertical.svg','cidiks-logo-reduced.svg','cidiks-logo-monochrome-black.svg','cidiks-logo-monochrome-white.svg','cidiks-logo-negative.svg'],
 symbol:['cidiks-symbol-master.svg','cidiks-symbol-color.svg','cidiks-symbol-black.svg','cidiks-symbol-white.svg','cidiks-symbol-negative.svg','cidiks-symbol-reduced.svg'],
 wordmark:['cidiks-wordmark.svg','cidiks-wordmark-editable.svg'],
 favicon:['favicon.svg',...[16,24,32,48,64].map(n=>`favicon-${n}.png`),'apple-touch-icon.png',...[192,512].map(n=>`cidiks-icon-${n}.png`),...[192,512].map(n=>`cidiks-icon-maskable-${n}.png`),'cidiks-icon-maskable.svg'],
 materials:['cidiks-material-stone','cidiks-material-microrelief','cidiks-material-glass','cidiks-material-glass-stone','cidiks-material-metal','cidiks-glass-premium','cidiks-dark-premium'].flatMap(n=>[n+'.svg',n+'.png']),
 textures:['cidiks-texture-primary.svg','cidiks-texture-primary.png','cidiks-texture-secondary.svg','cidiks-texture-secondary.png','cidiks-texture-pattern.svg'],
 social:['cidiks-avatar.png',...[512,256,128,64].map(n=>`cidiks-avatar-${n}.png`),'cidiks-social-1080.png','cidiks-story-1080x1920.png','og-cidiks-1200x630.png'],
 icons:['presencia','atencion','automatizacion','diagnostico','educacion'].map(n=>`cidiks-${n}.svg`),
 stationery:['tarjeta-horizontal','tarjeta-vertical','hoja-membretada'].flatMap(n=>[n+'.svg',n+'.pdf']).concat(['firma-email-cidiks.svg','firma-email-cidiks.png']),
 guidelines:['brand-guide.md','logo-specifications.md','asset-inventory.md','reproduction.md','qa-report.md']
};
function allFiles(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?allFiles(path.join(p,e.name)):[path.join(p,e.name)]);}
(async()=>{
 fs.mkdirSync(result,{recursive:true});const checked=[];
 for(const[dir,names]of Object.entries(required))for(const name of names){const p=path.join(root,dir,name);if(!fs.existsSync(p)||!fs.statSync(p).size)throw Error('Missing '+p);checked.push(dir+'/'+name);}
 const hashes={
  'symbol/cidiks-symbol-master.svg':'eeeec2e58c7e26fd9f14beaaa4304beec23e1b16f0a580300a4e957c1597dabb',
  'symbol/cidiks-symbol-reduced.svg':'59e46ffe29cf36d66ecb1786fb81421c3bdc7c78ec5746287223115b1fd25b1f'
 };
 for(const[rel,hash]of Object.entries(hashes))if(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,rel))).digest('hex')!==hash)throw Error('Approved geometry changed: '+rel);
 const browser=await chromium.launch({headless:true,...(process.env.CIDIKS_BROWSER?{executablePath:process.env.CIDIKS_BROWSER}:{})});
 const page=await browser.newPage();const alpha={};let count=0;
 for(const p of allFiles(root).filter(p=>p.endsWith('.svg'))){
  const src=fs.readFileSync(p,'utf8');const rel=path.relative(root,p).replaceAll('\\','/');
  if(/<(?:\w+:)?(?:image|script|foreignObject)\b/i.test(src))throw Error('Raster or active content in '+rel);
  await page.setContent('<style>body{margin:0}svg{width:128px;height:128px}</style>'+src);
  const box=await page.locator('svg').evaluate(s=>{let b=s.getBBox();return {w:b.width,h:b.height}});
  if(!(box.w>0&&box.h>0))throw Error('SVG has no renderable geometry: '+rel);
  const {data,info}=await sharp(Buffer.from(src)).resize(128,128,{fit:'fill'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});let min=255,max=0;
  for(let i=3;i<data.length;i+=4){min=Math.min(min,data[i]);max=Math.max(max,data[i]);}
  alpha[rel]={minAlpha:min,maxAlpha:max,browserRendered:true};count++;
 }
 for(const n of [16,24,32,48,64,128,180,192,512]){
  await page.setContent(`<div style="background:#244C3B">${fs.readFileSync(path.join(root,'favicon/favicon.svg'),'utf8')}</div><style>svg{width:${n}px;height:${n}px}</style>`);
  if(await page.locator('svg').evaluate(s=>Math.round(s.getBoundingClientRect().width))!==n)throw Error('Bad SVG scale '+n);
 }
 const transparent=['logo/cidiks-logo-primary.png','symbol/cidiks-symbol-color.png','wordmark/cidiks-wordmark.png',...[1080,512,256,128,64].map(n=>`social/cidiks-avatar-transparent-${n}.png`)];
 for(const rel of transparent){const {data,info}=await sharp(path.join(root,rel)).ensureAlpha().raw().toBuffer({resolveWithObject:true});const last=(info.width*info.height-1)*4;if(data[3]!==0||data[last+3]!==0)throw Error('Opaque exterior in '+rel);}
 fs.writeFileSync(path.join(result,'svg-alpha.json'),JSON.stringify(alpha,null,2));
 fs.writeFileSync(path.join(result,'delivery-results.json'),JSON.stringify({requiredFiles:checked.length,svgOpenedInBrowser:count,sizes:[16,24,32,48,64,128,180,192,512],transparentFiles:transparent,approvedGeometryHashes:hashes},null,2));
 await browser.close();console.log(`PASS: ${checked.length} required files, ${count} SVGs rendered in browser, 9 scales, transparent logo/symbol/wordmark/avatars, approved masters unchanged.`);
})().catch(e=>{console.error(e);process.exit(1)});
