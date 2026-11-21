import numpy as np, sys
from PIL import Image, ImageFilter
from collections import deque
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB'); W, H = im.size
S = 2; a = np.asarray(im.resize((W//S, H//S), Image.LANCZOS)).astype(float); h, w, _ = a.shape
# sample stripe colors from left/right margins
samp = np.concatenate([a[:, :40].reshape(-1, 3), a[:, -40:].reshape(-1, 3)])
from itertools import product
# k-means 2 clusters quick
c = np.array([samp[samp.sum(1).argmin()], samp[samp.sum(1).argmax()]])
for _ in range(10):
    d = ((samp[:, None] - c[None]) ** 2).sum(-1); l = d.argmin(1); c = np.array([samp[l == k].mean(0) for k in range(2)])
print('bg colors', c.round())
dist = np.min(((a[:, :, None] - c[None, None]) ** 2).sum(-1), -1) ** .5
bgl = dist < 38
seen = np.zeros((h, w), bool); q = deque()
for x in range(w):
    for y in (0, h-1):
        if bgl[y, x]: seen[y, x] = 1; q.append((y, x))
for y in range(h):
    for x in (0, w-1):
        if bgl[y, x] and not seen[y, x]: seen[y, x] = 1; q.append((y, x))
while q:
    cy, cx = q.popleft()
    for ny, nx in ((cy+1, cx), (cy-1, cx), (cy, cx+1), (cy, cx-1)):
        if 0 <= ny < h and 0 <= nx < w and bgl[ny, nx] and not seen[ny, nx]:
            seen[ny, nx] = 1; q.append((ny, nx))
m = ~seen
# remove enclosed background pockets in lower half (e.g. gap between legs)
tight = (dist < 16) & m
ys = np.arange(h)[:, None] > h*.55
lab = np.zeros((h, w), int); cur = 0
for y in range(int(h*.55), h):
    for x in range(w):
        if tight[y, x] and not lab[y, x]:
            cur += 1; qq = deque([(y, x)]); lab[y, x] = cur; pts = []
            while qq:
                cy, cx = qq.popleft(); pts.append((cy, cx))
                for ny, nx in ((cy+1, cx), (cy-1, cx), (cy, cx+1), (cy, cx-1)):
                    if 0 <= ny < h and 0 <= nx < w and tight[ny, nx] and not lab[ny, nx]:
                        lab[ny, nx] = cur; qq.append((ny, nx))
            if len(pts) > 150:
                for py, px in pts: m[py, px] = False
M = Image.fromarray((m*255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
M = M.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(1.2))
o = im.convert('RGBA'); o.putalpha(M); o = o.crop(o.getbbox()); o.save(out); print(out, o.size)
