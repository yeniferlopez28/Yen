import numpy as np, sys
from PIL import Image, ImageFilter
from collections import deque
src, out, thr = sys.argv[1], sys.argv[2], float(sys.argv[3]) if len(sys.argv) > 3 else 165
im = Image.open(src).convert('RGB'); W, H = im.size
S = 4; sm = im.resize((W//S, H//S), Image.LANCZOS)
a = np.asarray(sm).astype(float); r, g, b = a[...,0], a[...,1], a[...,2]
lum = .299*r + .587*g + .114*b
mx = a.max(-1); mn = a.min(-1); sat = (mx - mn) / (mx + 1e-6)
green = (g > r + 10) & (g > b)               # holly leaves
redbright = (r > 140) & (r > g + 60)          # bows / berries
mask = (lum < thr) & ~green & ~redbright
h, w = mask.shape
# connected components (4-neigh) keep large ones
lab = np.zeros((h, w), int); comps = []; cur = 0
for y in range(h):
    for x in range(w):
        if mask[y, x] and not lab[y, x]:
            cur += 1; q = deque([(y, x)]); lab[y, x] = cur; n = 0
            while q:
                cy, cx = q.popleft(); n += 1
                for ny, nx in ((cy+1, cx), (cy-1, cx), (cy, cx+1), (cy, cx-1)):
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not lab[ny, nx]:
                        lab[ny, nx] = cur; q.append((ny, nx))
            comps.append((n, cur))
keep = [c for n, c in comps if n > 0.01 * h * w]
m = np.isin(lab, keep)
# close small gaps: dilate then erode
mi = Image.fromarray((m * 255).astype(np.uint8))
mi = mi.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7))
m = np.asarray(mi) > 127
# fill holes: flood from border on inverse
inv = ~m; seen = np.zeros_like(m); q = deque()
for x in range(w):
    for y in (0, h-1):
        if inv[y, x]: seen[y, x] = 1; q.append((y, x))
for y in range(h):
    for x in (0, w-1):
        if inv[y, x] and not seen[y, x]: seen[y, x] = 1; q.append((y, x))
while q:
    cy, cx = q.popleft()
    for ny, nx in ((cy+1, cx), (cy-1, cx), (cy, cx+1), (cy, cx-1)):
        if 0 <= ny < h and 0 <= nx < w and inv[ny, nx] and not seen[ny, nx]:
            seen[ny, nx] = 1; q.append((ny, nx))
m = ~seen.astype(bool)
# upscale, smooth
M = Image.fromarray((m * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(3))
M = M.point(lambda v: 255 if v > 128 else 0).filter(ImageFilter.GaussianBlur(1.2))
# sticker border
B = M.filter(ImageFilter.MaxFilter(41)).filter(ImageFilter.GaussianBlur(2)).point(lambda v: 255 if v > 110 else 0).filter(ImageFilter.GaussianBlur(1.5))
SH = B.filter(ImageFilter.GaussianBlur(14))
canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
shadow = Image.new('RGBA', (W, H), (60, 30, 20, 0)); shadow.putalpha(SH.point(lambda v: int(v * .35)))
canvas.alpha_composite(shadow, (0, 0)) if False else None
canvas = Image.alpha_composite(canvas, Image.composite(Image.new('RGBA', (W, H), (60, 30, 20, 90)), Image.new('RGBA', (W, H), (0, 0, 0, 0)), SH).transform((W, H), Image.AFFINE, (1, 0, -6, 0, 1, -12)))
white = Image.new('RGBA', (W, H), (255, 253, 248, 255)); canvas = Image.alpha_composite(canvas, Image.composite(white, Image.new('RGBA', (W, H), (0, 0, 0, 0)), B))
boot = im.convert('RGBA'); boot.putalpha(M); canvas = Image.alpha_composite(canvas, boot)
bb = canvas.getbbox(); canvas = canvas.crop(bb)
canvas.save(out); print(out, canvas.size)
