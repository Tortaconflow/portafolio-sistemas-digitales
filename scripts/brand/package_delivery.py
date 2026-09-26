"""Package existing production files; never rebuild or alter approved geometry."""
from pathlib import Path
import json,hashlib,zipfile,csv
root=Path(__file__).resolve().parents[2];out=root/'deliverables';out.mkdir(exist_ok=True)
inventory=json.loads((out/'cidiks-b04-c1-asset-inventory.json').read_text(encoding='utf-8'))
known={r['repository_path']:r for r in inventory['files']}
for rel,row in known.items():
    assert hashlib.sha256((root/rel).read_bytes()).hexdigest()==row['sha256'], 'Stale inventory: '+rel
files=sorted(p for p in (root/'public/brand').rglob('*') if p.is_file())
files+=sorted(p for p in (root/'scripts/brand').glob('*') if p.is_file() and p.suffix in ['.py','.cjs','.json','.txt'])
rows=[]
archive=out/'cidiks-b04-c1.zip'
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in files:
        rel=p.relative_to(root).as_posix();z.write(p,rel)
        r=known.get(rel,{'file':p.name,'path':rel,'repository_path':rel,'absolute_path':p.as_posix(),'format':p.suffix.lstrip('.').upper(),'dimensions':'No aplica','bytes':p.stat().st_size,'function':'Índice de entrega' if 'asset-inventory' in p.name else 'Herramienta de reproducción o verificación','origin':'REFERENCIA','usage':'REFERENCIA','transparency':'No aplica','sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
        rows.append(r)
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None,'ZIP CRC failure'
    assert len(z.namelist())==len(rows)
    for r in rows:assert hashlib.sha256(z.read(r['repository_path'])).hexdigest()==r['sha256'],r['repository_path']
digest=hashlib.sha256(archive.read_bytes()).hexdigest()
manifest={'identity':'B04-C1','archive':archive.as_posix(),'archive_bytes':archive.stat().st_size,'archive_sha256':digest,'file_count':len(rows),'files':rows}
(out/'cidiks-b04-c1-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
with (out/'cidiks-b04-c1-files.csv').open('w',encoding='utf-8-sig',newline='') as f:
    writer=csv.DictWriter(f,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)
(out/'cidiks-b04-c1.zip.sha256').write_text(digest+'  cidiks-b04-c1.zip\n',encoding='ascii')
(out/'README.md').write_text(f'''# Entrega real Cídiks B04-C1

- ZIP: cidiks-b04-c1.zip ({archive.stat().st_size:,} bytes; {len(rows)} archivos).
- Lista completa: cidiks-b04-c1-files.csv, con ruta absoluta y relativa, formato, dimensiones, bytes, función, origen, uso, transparencia y SHA-256.
- Manifiesto verificable: cidiks-b04-c1-manifest.json.
- Suma del paquete: cidiks-b04-c1.zip.sha256.

El ZIP conserva los assets y la documentación seleccionada de public/brand junto con scripts/brand. No contiene deliverables/, node_modules, dependencias descargadas, referencias externas de terceros ni capturas de pruebas del navegador.

MASTER: public/brand/symbol/cidiks-symbol-master.svg. DERIVADO: variantes y exportaciones. PRODUCCIÓN: archivos utilizables en su medio. REFERENCIA: documentación, fuentes auxiliares y pruebas; no confundir esos archivos con el logo.

Maestro y reducido conservan los hashes aprobados. Wordmark principal en curvas, con í. Los avatares transparentes incluyen transparent en el nombre; los originales mantienen su fondo bosque. No se modificó la geometría, no se publicó y no se hizo commit ni push.

El inventario exhaustivo CSV/JSON queda en deliverables/ y fuera del ZIP y del sitio público. El manifiesto, el CSV externo y este README son comprobantes de entrega y no se auto-hashean.
''',encoding='utf-8')
print(json.dumps({k:v for k,v in manifest.items() if k!='files'},ensure_ascii=False))
