"""Build Cídiks assets from the editable SVG master, never from the reference raster.
Run from repository root: python scripts/brand/build_vectors.py [--core]
Install optional tooling into ignored node_modules/.cidiks-python (see requirements.txt).
"""
from pathlib import Path
import sys, json, io, html, math, shutil, random, re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'node_modules/.cidiks-python'))
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
import uharfbuzz as hb

OUT = ROOT / 'public/brand'
SPEC = json.loads((ROOT / 'scripts/brand/geometry.json').read_text(encoding='utf-8'))
C = SPEC['colors']
NS = '{http://www.w3.org/2000/svg}'
DESC = 'Diseño web, automatización e IA aplicada'
EDITORIAL = 'Sistemas digitales con fundamento'
FONT = ROOT / 'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'
CONTENT = (ROOT / 'src/content.ts').read_text(encoding='utf-8')
EMAIL = re.search(r'email:\s*"([^"]+)"', CONTENT).group(1)
AUTHOR = re.search(r'creator:\s*"([^"]+)"', CONTENT).group(1)

def write(rel, data):
    p = OUT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(data, encoding='utf-8', newline='\n')

def svg(w, h, body, label='Cídiks', bg=None, unit=None):
    dims = f'width="{w}{unit or ""}" height="{h}{unit or ""}"'
    background = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" {dims} role="img" aria-label="{html.escape(label, quote=True)}">\n<title>{html.escape(label)}</title>\n{background}{body}\n</svg>\n'

def seed_master(rel, key):
    if not (OUT / rel).exists():
        shapes = '\n'.join(f'<path id="{p["id"]}" fill="{C[p["fill"]]}" d="{p["d"]}"/>' for p in SPEC[key])
        write(rel, svg(512, 512, '<!-- B04-C1. Three independent closed cubic paths. Clear space: 48 units outside the 512 canvas. -->\n'+shapes, 'Cídiks · B04-C1 · '+('símbolo maestro' if key=='pieces' else 'símbolo reducido')))

seed_master('symbol/cidiks-symbol-master.svg', 'pieces')
seed_master('symbol/cidiks-symbol-reduced.svg', 'micro')
MASTER = ET.parse(OUT / 'symbol/cidiks-symbol-master.svg').getroot()
MICRO = ET.parse(OUT / 'symbol/cidiks-symbol-reduced.svg').getroot()
PATHS = [dict(p.attrib) for p in MASTER.findall(NS+'path')]
MICRO_PATHS = [dict(p.attrib) for p in MICRO.findall(NS+'path')]

def symbol(x=0,y=0,size=512,fill=None,micro=False):
    return f'<g transform="translate({x} {y}) scale({size/512:.7f})">'+''.join(f'<path d="{p["d"]}" fill="{fill or p["fill"]}"/>' for p in (MICRO_PATHS if micro else PATHS))+'</g>'

for suffix, fill in [('color',None),('black','#000000'),('white','#FFFFFF'),('negative',C['paper']),('forest',C['forest'])]:
    write(f'symbol/cidiks-symbol-{suffix}.svg',svg(512,512,symbol(fill=fill),f'Cídiks · símbolo {suffix}'))
write('favicon/favicon.svg',svg(512,512,symbol(18,18,476,fill=C['paper'],micro=True),'Cídiks · favicon',C['forest']))
write('favicon/cidiks-icon-192.svg',svg(512,512,symbol(28,28,456,fill=C['paper'],micro=True),'Cídiks · icono',C['forest']))
write('favicon/cidiks-icon-512.svg',svg(512,512,symbol(28,28,456,fill=C['paper'],micro=True),'Cídiks · icono',C['forest']))
write('favicon/cidiks-icon-maskable.svg',svg(512,512,symbol(90,90,332,fill=C['paper'],micro=True),'Cídiks · icono maskable preparado',C['forest']))
if '--core' in sys.argv:
    print('Core SVGs built. Inspect the recognition sheet before full production.')
    sys.exit(0)

fonts = {}
def get_font(weight):
    if weight not in fonts:
        font = instantiateVariableFont(TTFont(FONT), {'wght':weight}, inplace=False)
        font.flavor=None
        buf=io.BytesIO();font.save(buf)
        hf=hb.Font(hb.Face(buf.getvalue()));hf.scale=(font['head'].unitsPerEm,)*2
        fonts[weight]=(font,hf,font.getGlyphSet())
    return fonts[weight]

def text(s,x,y,size,fill=None,weight=500,tracking=0):
    """HarfBuzz shaping incl. kerning; fontTools cubic/quadratic outlines. Baseline y."""
    f,hf,gs=get_font(weight);b=hb.Buffer();b.add_str(s);b.guess_segment_properties();hb.shape(hf,b,{'kern':True})
    scale=size/f['head'].unitsPerEm;cursor=0;parts=[]
    for gi,pos in zip(b.glyph_infos,b.glyph_positions):
        pen=SVGPathPen(gs);gs[f.getGlyphName(gi.codepoint)].draw(pen)
        d=pen.getCommands()
        if d:parts.append(f'<path transform="translate({cursor+pos.x_offset:.3f} {pos.y_offset})" d="{d}"/>')
        cursor+=pos.x_advance+tracking/scale
    return f'<g aria-label="{html.escape(s,quote=True)}" fill="{fill or C["ink"]}" transform="translate({x} {y}) scale({scale:.7f} {-scale:.7f})">'+''.join(parts)+'</g>'

def word_width(s,size,weight=700):
    f,hf,_=get_font(weight);b=hb.Buffer();b.add_str(s);b.guess_segment_properties();hb.shape(hf,b,{'kern':True})
    return sum(p.x_advance for p in b.glyph_positions)*size/f['head'].unitsPerEm

ww=math.ceil(word_width('Cídiks',160))
write('wordmark/cidiks-wordmark.svg',svg(ww+32,205,text('Cídiks',16,167,160,C['forest'],700),'Cídiks · Manrope 700 · curvas'))
write('wordmark/cidiks-wordmark-editable.svg',svg(ww+32,205,'<text x="16" y="167" font-family="Manrope Variable, Manrope" font-weight="700" font-size="160" fill="'+C['forest']+'">Cídiks</text>','Cídiks · texto editable; requiere Manrope'))

def horizontal(fill=None,descriptor=None):
    fg=fill or C['forest'];w=950 if descriptor else 810
    body=symbol(16,16,230,fill)+text('Cídiks',275,184,160,fg,700)
    if descriptor:body+=text(descriptor,278,230,25,fg,400)
    return svg(w,268,body,'Cídiks'+(' · '+descriptor if descriptor else ' · horizontal'))

write('logo/cidiks-logo-horizontal.svg',horizontal())
write('logo/cidiks-logo-primary.svg',horizontal(descriptor=DESC))
write('logo/cidiks-logo-editorial.svg',horizontal(descriptor=EDITORIAL))
for suffix,fill in [('monochrome-black','#000000'),('monochrome-white','#FFFFFF'),('negative',C['paper']),('forest',C['forest'])]:
    write(f'logo/cidiks-logo-{suffix}.svg',horizontal(fill))
write('logo/cidiks-logo-vertical.svg',svg(640,730,symbol(110,20,420)+text('Cídiks',(640-word_width('Cídiks',132))/2,594,132,C['forest'],700)+text(EDITORIAL,(640-word_width(EDITORIAL,24,400))/2,653,24,C['forest'],400),'Cídiks · vertical · '+EDITORIAL))
write('logo/cidiks-logo-reduced.svg',svg(360,116,symbol(4,6,104,micro=True)+text('Cídiks',125,80,67,C['forest'],700),'Cídiks · firma reducida'))

for suffix,fg,bg in [('black-on-white','#000000','#FFFFFF'),('white-on-black','#FFFFFF','#000000'),('white-on-forest','#FFFFFF',C['forest']),('forest-on-paper',C['forest'],C['paper']),('black-on-paper','#000000',C['paper'])]:
    write(f'logo/backgrounds/{suffix}.svg',svg(1000,340,f'<g transform="translate(80 36)">{symbol(0,0,240,fg)}{text("Cídiks",270,180,160,fg,700)}</g>',f'Cídiks · {suffix}',bg))

# Original material texture: deterministic, open incisions, no historical motifs.
random.seed(104)
def texture(dense=False):
    lines=[]
    for row in range(8 if dense else 5):
        for col in range(6 if dense else 4):
            x=col*(512/(6 if dense else 4))+random.uniform(8,22);y=row*(512/(8 if dense else 5))+random.uniform(7,20)
            length=random.uniform(24,58);rise=random.uniform(-15,15)
            d=f'M{x:.1f},{y:.1f} c{length*.2:.1f},{rise:.1f} {length*.5:.1f},{-rise:.1f} {length:.1f},7'
            lines.append(f'<path d="{d}" fill="none" stroke="{C["ink"]}" stroke-opacity=".20" stroke-width="1.5" stroke-linecap="round"/><path d="{d}" transform="translate(0 2)" fill="none" stroke="{C["surface"]}" stroke-opacity=".65" stroke-width="1"/>')
    return ''.join(lines)
TEX=texture(True);TEX2=texture(False)
for name,body in [('primary',TEX),('secondary',TEX2)]:
    write(f'textures/cidiks-texture-{name}.svg',svg(512,512,body,'Cídiks · microincisiones contemporáneas · '+name))
write('textures/cidiks-texture-pattern.svg',svg(1024,1024,f'<defs><pattern id="incisions" width="512" height="512" patternUnits="userSpaceOnUse">{TEX2}</pattern></defs><rect width="1024" height="1024" fill="{C["paper"]}"/><rect width="1024" height="1024" fill="url(#incisions)"/>','Cídiks · patrón repetible contemporáneo'))

# Material treatments preserve exactly the master silhouettes. Filters live only here.
def material(kind):
    dark=kind=='dark-premium'
    is_stone=kind == 'stone'
    is_metal=kind=='metal'
    grad='''<linearGradient id="forest" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FFFFFF" stop-opacity=".88"/><stop offset=".22" stop-color="#244C3B"/><stop offset=".66" stop-color="#202925"/><stop offset="1" stop-color="#DCE5DA"/></linearGradient><linearGradient id="clay" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#F4F1E8"/><stop offset=".3" stop-color="#994A33"/><stop offset=".75" stop-color="#994A33"/><stop offset="1" stop-color="#202925"/></linearGradient><linearGradient id="stone"><stop stop-color="#DCE5DA"/><stop offset=".45" stop-color="#F4F1E8"/><stop offset="1" stop-color="#57625B"/></linearGradient><linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#57625B"/><stop offset=".4" stop-color="#FFFFFF"/><stop offset=".53" stop-color="#DCE5DA"/><stop offset="1" stop-color="#202925"/></linearGradient><linearGradient id="edge" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#FFFFFF"/><stop offset=".5" stop-color="#F4F1E8" stop-opacity=".08"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".65"/></linearGradient>'''
    clips=''.join(f'<clipPath id="piece-{i}"><path d="{p["d"]}"/></clipPath>' for i,p in enumerate(PATHS))
    filters='<filter id="shadow" x="-30%" y="-30%" width="170%" height="170%"><feDropShadow dx="0" dy="9" stdDeviation="8" flood-color="#202925" flood-opacity=".28"/></filter><filter id="soft"><feGaussianBlur stdDeviation="9"/></filter><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".14" numOctaves="3" seed="18"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".16"/></feComponentTransfer></filter>'
    pieces=[]
    for i,p in enumerate(PATHS):
        fill='stone' if is_stone or (kind=='glass-stone' and i==2) else 'metal' if is_metal else 'clay' if i==1 else 'forest'
        shape=f'<path d="{p["d"]}" fill="url(#{fill})" fill-opacity="{.82 if kind in ["glass","glass-premium"] else 1}" filter="url(#shadow)"/>'
        inside=''
        if fill=='stone' or kind=='microrelief':inside=f'<rect width="512" height="512" filter="url(#grain)"/>{TEX if fill=="stone" else TEX2}'
        elif not is_metal:inside='<ellipse cx="264" cy="96" rx="185" ry="24" transform="rotate(-34 264 96)" fill="#FFFFFF" opacity=".48" filter="url(#soft)"/><path d="M80 316 Q180 84 410 64" fill="none" stroke="#FFFFFF" stroke-width="14" opacity=".15" filter="url(#soft)"/>'
        if kind=='glass-premium':inside+='<path d="M98 330 Q180 115 380 97" fill="none" stroke="#F4F1E8" stroke-width="3" opacity=".65"/><ellipse cx="310" cy="170" rx="90" ry="50" fill="#FFFFFF" opacity=".16" filter="url(#soft)"/>'
        shape+=f'<g clip-path="url(#piece-{i})">{inside}<path d="{p["d"]}" fill="none" stroke="url(#edge)" stroke-width="5"/></g>'
        pieces.append(shape)
    background=f'<rect width="1024" height="1024" fill="{C["ink"]}"/>' if dark else ''
    ambient='<ellipse cx="490" cy="515" rx="260" ry="290" fill="#244C3B" opacity=".4" filter="url(#soft)"/>' if dark else ''
    return svg(1024,1024,f'<defs>{grad}{clips}{filters}</defs>{background}{ambient}<g transform="translate(70 50) scale(1.72)">{"".join(pieces)}</g>','Cídiks · tratamiento '+kind+' derivado del vector B04-C1')
for kind in ['stone','microrelief','glass','glass-stone','metal','glass-premium','dark-premium']:
    name={'glass-premium':'cidiks-glass-premium','dark-premium':'cidiks-dark-premium'}.get(kind,'cidiks-material-'+kind)
    write('materials/'+name+'.svg',material(kind))

# Social and signatures: text outlined for reliable raster and print rendering.
for name,w,h in [('og-cidiks-1200x630',1200,630),('cidiks-social-1080',1080,1080),('cidiks-story-1080x1920',1080,1920)]:
    story=h>1200;square=w==h
    if story:
        body=symbol(240,210,600)+text('Cídiks',110,1030,210,C['forest'],700)+text(AUTHOR,115,1135,48)+text('Diseño web, automatización',115,1270,38)+text('e IA aplicada',115,1330,38)+text('Sistemas digitales',115,1580,34,C['secondary'])+text('con fundamento',115,1630,34,C['secondary'])
    elif square:
        body=symbol(300,45,480)+text('Cídiks',155,750,200,C['forest'],700)+text(AUTHOR,160,830,40)+text('Diseño web, automatización',160,930,32)+text('e IA aplicada',160,978,32)
    else:
        body=symbol(35,82,460)+text('Cídiks',525,330,155,C['forest'],700)+text(AUTHOR,530,400,34)+text('Diseño web, automatización',530,478,27)+text('e IA aplicada',530,518,27)
    write('social/'+name+'.svg',svg(w,h,body,'Cídiks · '+AUTHOR+' · '+DESC,C['paper']))
for n in [1080,512,256,128,64]:
    write(f'social/cidiks-avatar-{n}.svg',svg(n,n,symbol(n*.16,n*.16,n*.68,fill=C['paper'],micro=n<=128),'Cídiks · avatar circular seguro',C['forest']))
sig=symbol(12,8,132)+text('Cídiks',167,64,53,C['forest'],700)+text(AUTHOR,169,100,23)+text(DESC,169,140,22)+text(EMAIL,169,176,22,C['forest'])
write('stationery/firma-email-cidiks.svg',svg(720,200,sig,'Cídiks · '+AUTHOR+' · '+EMAIL))
write('stationery/firma-personal.svg',svg(620,210,text(AUTHOR,20,80,52,C['forest'],600)+text('Cídiks · '+EDITORIAL,22,128,22)+text(EMAIL,22,172,22,C['secondary']),'Firma personal · '+AUTHOR))

# Print SVGs: units millimetres, 3 mm bleed, explicit safe zone; PDF export separate.
def card(vertical=False):
    w,h=(61,91) if vertical else (91,61)
    if vertical:body=symbol(13,8,35)+text('Cídiks',8,55,12,C['forest'],700)+text(AUTHOR,8,64,3.5)+text('Diseño web, automatización',8,70,2.75)+text('e IA aplicada',8,74,2.75)+text(EMAIL,8,81,2.8)
    else:body=symbol(5,5,32)+text('Cídiks',39,25,12,C['forest'],700)+text(AUTHOR,39,32,3.7)+text('Diseño web, automatización',8,45,2.8)+text('e IA aplicada',8,49,2.8)+text(EMAIL,8,55,2.8)
    return svg(w,h,body,'Cídiks · tarjeta · sangrado 3 mm',C['paper'],'mm')
write('stationery/tarjeta-horizontal.svg',card())
write('stationery/tarjeta-vertical.svg',card(True))
letter=symbol(13,11,24)+text('Cídiks',42,27,11,C['forest'],700)+text(AUTHOR,42,34,3.3)+f'<path d="M18 46 H192" stroke="{C["forest"]}" stroke-width=".3"/>'+text(DESC,18,280,3,C['secondary'])+text(EMAIL,18,286,3,C['forest'])
write('stationery/hoja-membretada.svg',svg(210,297,letter,'Cídiks · hoja membretada A4',None,'mm'))

# Five secondary pictograms. 24 grid, 1.7 stroke, rounded terminals; not derivatives of archaeological motifs.
icons={
 'presencia':'<rect x="3" y="4" width="18" height="15" rx="4"/><path d="M3 9H21 M8 22H16 M12 19V22"/>',
 'atencion':'<path d="M7 4H17Q21 4 21 8V13Q21 17 17 17H11L6 21V17Q3 17 3 13V8Q3 4 7 4Z M8 10H16 M8 13H13"/>',
 'automatizacion':'<path d="M5 9Q5 3 12 3Q19 3 19 9 M19 15Q19 21 12 21Q5 21 5 15"/><circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="12" r="2.5"/><path d="M10 12H14"/>',
 'diagnostico':'<circle cx="10.5" cy="10.5" r="7"/><path d="M16 16L21 21 M7 11H9L11 8L13 13L15 10"/>',
 'educacion':'<path d="M12 6Q7 2 3 5V19Q7 16 12 20Q17 16 21 19V5Q17 2 12 6V20 M6 8Q8 7 10 9 M15 9Q17 7 19 8"/>'
}
for name,body in icons.items():write(f'icons/cidiks-{name}.svg',svg(24,24,f'<g fill="none" stroke="{C["forest"]}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{body}</g>','Cídiks · '+name))

# Construction/protection diagrams use outlines for labels as well.
grid=''.join(f'<path d="M{i} 0V512 M0 {i}H512" stroke="{C["secondary"]}" stroke-opacity=".15"/>' for i in range(0,513,32))
write('guidelines/construction.svg',svg(720,680,f'<g transform="translate(100 60)">{grid}{symbol()}<rect x="0" y="0" width="512" height="512" fill="none" stroke="{C["terracotta"]}"/></g>'+text('B04-C1 · 512 × 512 · tres curvas independientes',70,626,21)+text('Retícula de edición; sin proporción áurea atribuida.',70,656,16,C['secondary']),'Construcción de Cídiks',C['paper']))
clear=text('Área libre exterior: x = 48/512 del alto nominal del símbolo.',30,38,17)
for label,y,body,w,h,margin in [('Símbolo · alto nominal 192; x = 18',95,symbol(18,18,192),192,192,18),('Wordmark · x = 14.82 (equivalencia con la firma horizontal)',400,text('Cídiks',14.82,115,110,C['forest'],700),365,141,14.82),('Firma horizontal · alto nominal 150; x = 14.06',645,symbol(14.06,14.06,150)+text('Cídiks',183,126,104,C['forest'],700),500,175,14.06)]:
    clear+=text(label,30,y-20,16)+f'<g transform="translate(30 {y})"><rect width="{w+2*margin}" height="{h+2*margin}" fill="none" stroke="{C["terracotta"]}" stroke-dasharray="5 5"/>{body}</g>'
write('guidelines/clear-space.svg',svg(740,900,clear,'Cídiks · áreas de protección ilustradas',C['paper']))

licenses=OUT/'guidelines/licenses';licenses.mkdir(parents=True,exist_ok=True)
for package,name in [('@fontsource-variable/manrope','Manrope-OFL.txt'),('@fontsource/ibm-plex-mono','IBM-Plex-Mono-OFL.txt')]:
    shutil.copyfile(ROOT/'node_modules'/package/'LICENSE',licenses/name)
fontdir=OUT/'wordmark/fonts';fontdir.mkdir(parents=True,exist_ok=True)
shutil.copyfile(FONT,fontdir/'manrope-latin-variable.woff2')
print('SVG assets built from',OUT/'symbol/cidiks-symbol-master.svg')
