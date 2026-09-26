const fs=require('node:fs');const path=require('node:path');const {createRequire}=require('node:module');
const req=process.env.CIDIKS_NODE_MODULES?createRequire(path.join(process.env.CIDIKS_NODE_MODULES,'_brand.cjs')):require;
const {chromium}=req('playwright');const url=process.env.CIDIKS_PREVIEW_URL||'http://127.0.0.1:8768';
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CIDIKS_BROWSER?{executablePath:process.env.CIDIKS_BROWSER}:{})});
 const p=await browser.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const out=path.resolve(__dirname,'../../test-results/brand');fs.mkdirSync(out,{recursive:true});const results=[];
 for(const width of [1440,768,390,320]){
  await p.setViewportSize({width,height:1000});await p.goto(url);await p.evaluate(()=>document.fonts.ready);
  const result=await p.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,title:document.title,logos:[...document.querySelectorAll('.cidiks-symbol,.cidiks-wordmark,.cidiks-footer-symbol')].map(i=>({loaded:i.complete&&i.naturalWidth>0,src:i.getAttribute('src')})),pngFavicons:[...document.querySelectorAll('link[rel="icon"][type="image/png"]')].map(i=>i.getAttribute('sizes')),appleTouch:document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('sizes'),og:document.querySelector('meta[property="og:image"]')?.content,twitter:document.querySelector('meta[name="twitter:image"]')?.content}));
  if(result.overflow||result.logos.some(i=>!i.loaded)||result.logos.length!==3)throw Error(JSON.stringify(result));
  if(result.title.split('Reily Castro').length!==2)throw Error('Duplicated owner in title');
  if(!["16x16","32x32","48x48"].every(n=>result.pngFavicons.includes(n))||result.appleTouch!=="180x180")throw Error('Favicon PNG/apple touch fallbacks are incomplete');
  if(!result.og?.endsWith('/brand/social/og-cidiks-1200x630.png')||result.og!==result.twitter)throw Error('Social metadata mismatch');
  if(width<=850){
    if(await p.locator('#navigation').isVisible())throw Error('Mobile menu should start closed');
    await p.locator('.menu-toggle').click();
    if(!await p.locator('#navigation').isVisible())throw Error('Mobile menu did not open');
    if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Open menu overflow');
    await p.locator('.menu-toggle').click();
  }
  await p.screenshot({path:path.join(out,`site-${width}.png`)});results.push(result);
 }
 await p.setViewportSize({width:1280,height:1000});await p.goto(url+'/brand/guidelines/index.html');await p.evaluate(()=>document.fonts.ready);
 await p.locator('img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
 const missing=await p.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));if(missing.length)throw Error(JSON.stringify(missing));
 const wrongSizes=await p.locator('.size-logos img,.size img').evaluateAll(images=>images.filter(i=>Math.abs(i.getBoundingClientRect().width-Number(i.getAttribute('width')))>1).map(i=>i.alt));if(wrongSizes.length)throw Error('Size specimens are not native: '+wrongSizes.join(', '));
 await p.screenshot({path:path.join(out,'guide-cover.png')});
 for(const id of ['institucional','tamano','material','aplicaciones']){await p.locator('#'+id).scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,`guide-${id}.png`)});}
 await p.setViewportSize({width:390,height:900});await p.goto(url+'/brand/guidelines/index.html');
 if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Guide mobile overflow');
 fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify({results,errors,guideImages:'loaded',guideMobile:'no horizontal page overflow'},null,2));
 if(errors.length)throw Error(errors.join('\n'));
 console.log('PASS: branding + SEO at 320/390/768/1440, guide images and mobile; no page errors.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
