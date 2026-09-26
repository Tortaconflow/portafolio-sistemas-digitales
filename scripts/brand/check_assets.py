"""Meaningful release invariants for the delivered identity (no internet)."""
from pathlib import Path
import json, math, xml.etree.ElementTree as ET
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]; B=ROOT/'public/brand'; NS='{http://www.w3.org/2000/svg}'
spec=json.loads((ROOT/'scripts/brand/geometry.json').read_text(encoding='utf-8'))
master=ET.parse(B/'symbol/cidiks-symbol-master.svg').getroot()
assert master.attrib['viewBox']=='0 0 512 512'
paths=master.findall(NS+'path');assert len(paths)==3
assert [p.attrib['d'] for p in paths]==[p['d'] for p in spec['pieces']], 'Construction record diverges from master'
for folder in ['symbol','logo','wordmark','favicon','icons']:
    for f in (B/folder).rglob('*.svg'):
        root=ET.parse(f).getroot(); assert 'viewBox' in root.attrib,f
        for node in root.iter():
            assert node.tag not in [NS+'image',NS+'filter',NS+'script',NS+'foreignObject'],f
            for k,v in node.attrib.items():
                if k.endswith('href'):assert not v.startswith(('http:','https:','data:')),f
        if not f.name.endswith('-editable.svg'):assert root.find('.//'+NS+'text') is None,f
for f in (B/'materials').glob('*.svg'):
    rendered=f.read_text(encoding='utf-8')
    for p in paths:assert p.attrib['d'] in rendered, f'Material {f.name} changed the silhouette'
expected={
 'social/og-cidiks-1200x630.png':(1200,630),'social/cidiks-social-1080.png':(1080,1080),
 'social/cidiks-story-1080x1920.png':(1080,1920),'favicon/apple-touch-icon.png':(180,180)}
for n in [16,24,32,48,64]:expected[f'favicon/favicon-{n}.png']=(n,n)
for n in [192,512]:
    expected[f'favicon/cidiks-icon-{n}.png']=(n,n)
    expected[f'favicon/cidiks-icon-maskable-{n}.png']=(n,n)
for n in [1080,512,256,128,64]:expected[f'social/cidiks-avatar-{n}.png']=(n,n)
for f in (B/'materials').glob('*.png'):expected[str(f.relative_to(B)).replace('\\','/')]=(1024,1024)
for rel,size in expected.items():assert Image.open(B/rel).size==size,rel
for rel in ['symbol/cidiks-symbol-color.png','symbol/cidiks-symbol-white.png','textures/cidiks-texture-primary.png','stationery/firma-email-cidiks.png','materials/cidiks-glass-premium.png']:
    im=Image.open(B/rel).convert('RGBA');assert im.getpixel((0,0))[3]==0,rel+' lacks transparent exterior'
# At 16px, the three pieces must remain separate and have non-trivial coverage.
im=Image.open(B/'favicon/favicon-16.png').convert('RGB')
pts={(x,y) for y in range(16) for x in range(16) if sum(im.getpixel((x,y)))>500};components=[]
while pts:
    queue=[pts.pop()];area=0
    while queue:
        x,y=queue.pop();area+=1
        for q in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
            if q in pts:pts.remove(q);queue.append(q)
    components.append(area)
assert len(components)==3 and min(components)>=8,components
# Every foreground pixel of maskable icon stays inside the 80% diameter safe zone.
im=Image.open(B/'favicon/cidiks-icon-maskable-512.png').convert('RGB')
for y in range(512):
    for x in range(512):
        if sum(im.getpixel((x,y)))>500:assert math.hypot(x-255.5,y-255.5)<=204.8,(x,y)
assert (ROOT/'public/favicon.svg').read_bytes()==(B/'favicon/favicon.svg').read_bytes()
print(f'PASS: master, production SVGs, 7 material silhouettes, {len(expected)} PNG sizes, transparency, maskable zone; favicon 16px areas={sorted(components)}.')
