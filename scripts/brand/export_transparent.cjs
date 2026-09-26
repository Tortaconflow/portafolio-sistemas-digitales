// Supplement the approved identity. Never write either geometry master.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {createRequire}=require('node:module');
const req=process.env.CIDIKS_NODE_MODULES?createRequire(path.join(process.env.CIDIKS_NODE_MODULES,'_brand.cjs')):require;
const sharp=req('sharp');const root=path.resolve(__dirname,'../../public/brand');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const masters=['symbol/cidiks-symbol-master.svg','symbol/cidiks-symbol-reduced.svg'];
const before=masters.map(p=>hash(path.join(root,p)));
(async()=>{
 for(const size of [1080,512,256,128,64]){
  const src=fs.readFileSync(path.join(root,masters[size<=128?1:0]),'utf8');
  const paths=src.match(/<path\b[^>]*\/>/g).join('\n');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}" role="img" aria-label="Cídiks · avatar transparente"><title>Cídiks · avatar transparente</title><g transform="translate(81.92 81.92) scale(.68)">${paths}</g></svg>\n`;
  const name=`social/cidiks-avatar-transparent-${size}`;
  fs.writeFileSync(path.join(root,name+'.svg'),svg);
  await sharp(Buffer.from(svg)).png({compressionLevel:9}).toFile(path.join(root,name+'.png'));
 }
 await sharp(path.join(root,'wordmark/cidiks-wordmark.svg')).resize(1020,410).png({compressionLevel:9}).toFile(path.join(root,'wordmark/cidiks-wordmark.png'));
 for(let i=0;i<masters.length;i++)if(hash(path.join(root,masters[i]))!==before[i])throw Error('Approved geometry changed');
 console.log('Added 5 transparent SVG/PNG avatars and outlined-wordmark PNG. Both geometry hashes unchanged.');
})().catch(e=>{console.error(e);process.exit(1)});
