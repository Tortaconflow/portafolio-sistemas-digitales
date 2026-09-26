"""Set print boxes and render proofs. Requires PyMuPDF (fitz)."""
from pathlib import Path
import fitz
root=Path(__file__).resolve().parents[2]/'public/brand/stationery'
for name in ['tarjeta-horizontal','tarjeta-vertical','hoja-membretada']:
    path=root/(name+'.pdf');doc=fitz.open(path)
    assert len(doc)==1,name
    page=doc[0]
    if name.startswith('tarjeta'):
        margin=3*72/25.4
        page.set_trimbox(fitz.Rect(margin,margin,page.rect.width-margin,page.rect.height-margin))
        page.set_bleedbox(page.mediabox)
        doc.saveIncr()
    assert len(page.get_images())==0, 'Logo unexpectedly rasterized'
    assert len(page.get_drawings())>10, 'Expected outlined vector drawing'
    page.get_pixmap(matrix=fitz.Matrix(2,2),alpha=False).save(root/(name+'-proof.png'))
    print(name, 'pages=1; raster images=0; vector drawings=',len(page.get_drawings()),'trim mm=',[round(v*25.4/72,2) for v in (page.trimbox.width,page.trimbox.height)])
    doc.close()
