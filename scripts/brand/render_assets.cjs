// Optional build tooling; see guidelines/reproduction.md. No runtime dependency.
const fs = require('node:fs');
const path = require('node:path');
const {createRequire} = require('node:module');
const req = process.env.CIDIKS_NODE_MODULES ? createRequire(path.join(process.env.CIDIKS_NODE_MODULES, '_brand.cjs')) : require;
const sharp = req('sharp');
const root = path.resolve(__dirname, '../..');
const out = path.join(root, 'public/brand');
async function png(input, output, size) {
  let image = sharp(path.join(out,input));
  if(size)image=image.resize(size,size,{fit:'contain'});
  await image.png({compressionLevel:9}).toFile(path.join(out,output));
}
async function main(){
  for(const dir of ['textures','materials','social','stationery']) {
    for(const name of fs.readdirSync(path.join(out,dir)).filter(n=>n.endsWith('.svg'))){
      // Print source stays vector. Email/signature also get a transparent PNG.
      if(dir==='stationery'&&!name.startsWith('firma-'))continue;
      await png(dir+'/'+name,dir+'/'+name.replace('.svg','.png'));
    }
  }
  for(const n of [16,24,32,48,64,180,192,512]) {
    const name=n===180?'apple-touch-icon.png':n===192||n===512?`cidiks-icon-${n}.png`:`favicon-${n}.png`;
    await png('favicon/favicon.svg','favicon/'+name,n);
  }
  for(const n of [192,512])await png('favicon/cidiks-icon-maskable.svg',`favicon/cidiks-icon-maskable-${n}.png`,n);
  for(const name of ['cidiks-symbol-color','cidiks-symbol-black','cidiks-symbol-white'])await png(`symbol/${name}.svg`,`symbol/${name}.png`,1024);
  await png('logo/cidiks-logo-primary.svg','logo/cidiks-logo-primary.png');
  await png('logo/cidiks-logo-horizontal.svg','logo/cidiks-logo-horizontal.png');
  for(const name of fs.readdirSync(path.join(out,'logo/backgrounds')).filter(n=>n.endsWith('.svg')))
    await png('logo/backgrounds/'+name,'logo/backgrounds/'+name.replace('.svg','.png'));
  fs.copyFileSync(path.join(out,'social/cidiks-avatar-1080.png'),path.join(out,'social/cidiks-avatar.png'));
  // Backward-compatible root favicon; the master is never copied from a render.
  fs.copyFileSync(path.join(out,'favicon/favicon.svg'),path.join(root,'public/favicon.svg'));
  const sizes=[16,24,32,48,64,128,256,512], layers=[];
  let labelX=30;
  const labels=sizes.map(n=>{const s=`<text x="${labelX}" y="55" font-family="sans-serif" font-size="11">${n}${n>128?' →128':''}</text>`;labelX+=Math.min(n,128)+30;return s}).join('');
  const head=Buffer.from('<svg width="1150" height="730"><rect width="1150" height="730" fill="#F4F1E8"/><text x="25" y="25" font-family="sans-serif" font-size="16">B04-C1 · color / negro / blanco / favicon. 256 y 512 reducidos a 128 en esta lámina.</text>'+labels+'</svg>');
  for(let row=0;row<4;row++) {
    const files=['symbol/cidiks-symbol-color.svg','symbol/cidiks-symbol-black.svg','symbol/cidiks-symbol-white.svg','favicon/favicon.svg'];
    let x=30;
    for(const n of sizes){
      const display=Math.min(n,128);
      const input=await sharp(path.join(out,files[row])).resize(n,n).png().toBuffer();
      const final=n>128?await sharp(input).resize(display,display).png().toBuffer():input;
      layers.push({input:final,left:x,top:65+row*165+(128-display)});
      x+=display+30;
    }
  }
  // White row gets a forest surface, for genuine negative reproduction.
  layers.unshift({input:Buffer.from('<svg width="1150" height="155"><rect width="1150" height="155" fill="#244C3B"/></svg>'),left:0,top:380});
  await sharp(head).composite(layers).png().toFile(path.join(out,'guidelines/recognition-sizes.png'));
  const composites=[];const materialNames=fs.readdirSync(path.join(out,'materials')).filter(n=>n.endsWith('.png'));
  for(let i=0;i<materialNames.length;i++)composites.push({input:await sharp(path.join(out,'materials',materialNames[i])).resize(300).png().toBuffer(),left:(i%4)*320+10,top:Math.floor(i/4)*330+10});
  await sharp({create:{width:1280,height:660,channels:4,background:'#F4F1E8'}}).composite(composites).png().toFile(path.join(out,'guidelines/material-sheet.png'));
  console.log('PNG exports complete. Inspect recognition-sizes.png and material-sheet.png.');
}
main().catch(e=>{console.error(e);process.exit(1)});
