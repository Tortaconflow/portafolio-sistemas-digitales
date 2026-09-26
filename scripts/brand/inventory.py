"""Complete delivery inventory with exact paths, roles and no self-hash recursion."""
from pathlib import Path
import hashlib,json,csv,xml.etree.ElementTree as ET
from PIL import Image
import fitz
repo=Path(__file__).resolve().parents[2];root=repo/'public/brand';out=repo/'deliverables';out.mkdir(exist_ok=True)
excluded={'asset-inventory.md'}
alpha_file=repo/'test-results/brand/svg-alpha.json'
alpha=json.loads(alpha_file.read_text(encoding='utf-8')) if alpha_file.exists() else {}

def purpose(rel):
    folder=rel.split('/')[0];stem=Path(rel).stem
    if folder=='symbol':return 'Fuente geométrica de verdad B04-C1' if stem.endswith('-master') else 'Símbolo '+stem.removeprefix('cidiks-symbol-')
    if folder=='logo':return 'Composición de logo: '+stem.removeprefix('cidiks-logo-')
    if folder=='wordmark':return 'Fuente tipográfica auxiliar' if '/fonts/' in rel else ('Wordmark Cídiks editable; requiere Manrope' if 'editable' in stem else 'Wordmark Cídiks desde curvas')
    if folder=='favicon':return 'Icono reducido: '+stem
    if folder=='materials':return 'Tratamiento visual del mismo símbolo: '+stem.removeprefix('cidiks-')
    if folder=='textures':return 'Textura contemporánea: '+stem.removeprefix('cidiks-texture-')
    if folder=='social':return ('Avatar con exterior transparente' if 'transparent' in stem else 'Avatar con fondo bosque' if 'avatar' in stem else 'Imagen social / Open Graph: '+stem)
    if folder=='icons':return 'Pictograma secundario: '+stem.removeprefix('cidiks-')
    if folder=='stationery':return ('Prueba raster de impresión' if 'proof' in stem else 'Papelería o firma: '+stem)
    return 'Documentación / referencia: '+stem

rows=[]
for p in sorted(root.rglob('*')):
    if not p.is_file() or p.name in excluded:continue
    rel=p.relative_to(root).as_posix();ext=p.suffix.lower();dims='No aplica';trans='No aplica'
    origin='MASTER' if rel=='symbol/cidiks-symbol-master.svg' else 'DERIVADO';usage='PRODUCCIÓN'
    if rel.startswith('guidelines/') or '/fonts/' in rel or '-editable.' in rel or '-proof.' in rel:origin=usage='REFERENCIA'
    if ext=='.png':
        im=Image.open(p);dims=f'{im.width} × {im.height} px';lo,hi=im.convert('RGBA').getchannel('A').getextrema()
        trans='Sí; canal alfa con píxeles transparentes' if lo==0 else 'Parcial' if lo<255 else 'No; fondo opaco'
    elif ext=='.svg':
        el=ET.parse(p).getroot();dims=f'viewBox {el.attrib.get("viewBox", "")}; width={el.attrib.get("width", "auto")}, height={el.attrib.get("height", "auto")}'
        a=alpha.get(rel);trans=('Sí; transparencia verificada al renderizar' if a and a['minAlpha']==0 else 'Parcial' if a and a['minAlpha']<255 else 'No; fondo opaco' if a else 'No comprobada')
    elif ext=='.pdf':
        with fitz.open(p) as doc:
            page=doc[0];dims=f'{len(doc)} página; medio {page.rect.width*25.4/72:.2f} × {page.rect.height*25.4/72:.2f} mm; corte {page.trimbox.width*25.4/72:.2f} × {page.trimbox.height*25.4/72:.2f} mm'
        trans='Página de impresión; no usar como recorte transparente'
    rows.append({'file':p.name,'path':rel,'repository_path':p.relative_to(repo).as_posix(),'absolute_path':p.as_posix(),'format':ext.lstrip('.').upper(),'dimensions':dims,'bytes':p.stat().st_size,'function':purpose(rel),'origin':origin,'usage':usage,'transparency':trans,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
data={'version':'1.0.0','identity':'B04-C1 aprobada por el usuario','scope':'Todos los archivos de public/brand salvo este índice Markdown. Las rutas absolutas quedan fuera de public/ en deliverables.','excluded_inventory_files':sorted(excluded),'files':rows}
(out/'cidiks-b04-c1-asset-inventory.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
with (out/'cidiks-b04-c1-asset-inventory.csv').open('w',encoding='utf-8-sig',newline='') as f:
    writer=csv.DictWriter(f,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)
lines=['# Entrega real B04-C1 — inventario de assets públicos','',f'{len(rows)} archivos públicos documentados. No se cambió la geometría aprobada.','',
 'MASTER: fuente de verdad. DERIVADO: obtenido de los maestros y fuentes tipográficas documentadas. PRODUCCIÓN: utilizable en su medio. REFERENCIA: guía, licencia, prueba o fuente auxiliar. Origen y uso son columnas separadas.','',
 'El CSV y JSON exhaustivos, incluidas sus rutas locales y SHA-256, se guardan fuera de public/ en deliverables/cidiks-b04-c1-asset-inventory.*.','',
 '| Archivo / ruta exacta | Formato | Dimensiones | Bytes | Origen / uso | Transparencia | Función | SHA-256 |','|---|---|---|---:|---|---|---|---|']
for r in rows:lines.append(f'| [{r["file"]}](/{r["repository_path"].removeprefix("public/")})<br>{r["repository_path"]} | {r["format"]} | {r["dimensions"]} | {r["bytes"]} | {r["origin"]} / {r["usage"]} | {r["transparency"]} | {r["function"]} | `{r["sha256"]}` |')
(root/'guidelines/asset-inventory.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print('Inventory:',len(rows),'public files plus this excluded Markdown index;',sum(r['bytes'] for r in rows),'bytes before index')
