from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json,re

root=Path(__file__).resolve().parents[1]
class Links(HTMLParser):
    def __init__(self):super().__init__();self.refs=[]
    def handle_starttag(self,tag,attrs):
        for key,value in attrs:
            if key in {'src','href'} and value:self.refs.append(value)
parser=Links();parser.feed((root/'index.html').read_text(encoding='utf-8'))
missing=[]
for ref in parser.refs:
    u=urlsplit(ref)
    if u.scheme or u.netloc or not u.path:continue
    p=(root/unquote(u.path)).resolve()
    if not p.is_relative_to(root) or not p.is_file():missing.append(ref)
for script in ['app.js','project-data.js','workbench.js']:
    text=(root/script).read_text(encoding='utf-8')
    for ref in re.findall(r"['\"](assets/[^'\"<>]+\.(?:pdf|jpg|png|webp|json))['\"]",text):
        if not (root/ref).is_file():missing.append(ref)
assert not missing,f'Missing local resources: {missing}'
geometry=json.loads((root/'assets/tentacle-geometry.json').read_text())
assert len(geometry['parts'])==18
for part in geometry['parts']:
    assert all(0<=i<len(part['vertices']) for face in part['faces'] for i in face)
print(f'Local resources valid; 18 original mesh segments checked.')
