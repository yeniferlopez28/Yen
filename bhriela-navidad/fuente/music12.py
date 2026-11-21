import numpy as np, wave, sys
SR = 48000
DUR = 40.5
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rs = np.random.RandomState(4)

def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if i >= N: return
    s = sig[:j - i] * gain
    L[i:j] += s * np.sqrt((1 - pan) / 2) * 1.414
    R[i:j] += s * np.sqrt((1 + pan) / 2) * 1.414
def env_t(d): return np.arange(int(d * SR)) / SR

def bell(f, d=1.6):
    t = env_t(d); a = np.minimum(1, t / .002)
    return a * (np.sin(2*np.pi*f*t)*np.exp(-t*3.2) + .45*np.sin(2*np.pi*2.756*f*t)*np.exp(-t*7) + .18*np.sin(2*np.pi*5.4*f*t)*np.exp(-t*12))
def pad(freqs, d):
    t = env_t(d); a = np.minimum(1, t / .35) * np.minimum(1, (d - t) / .4)
    s = sum(np.sin(2*np.pi*f*t + .3*np.sin(2*np.pi*5*t)) + .3*np.sin(2*np.pi*f*1.003*t) + .15*np.sin(2*np.pi*2*f*t) for f in freqs)
    return a * s / len(freqs)
def bass(f, d=.45):
    t = env_t(d); return np.minimum(1, t/.004) * (np.sin(2*np.pi*f*t) + .35*np.sin(2*np.pi*2*f*t)) * np.exp(-t*5)
def hp(x):
    return np.diff(np.diff(x, prepend=0), prepend=0)
def sleigh(d=.12, strength=1.0):
    t = env_t(d); out = np.zeros(len(t))
    for k in range(5):
        o = int(rs.uniform(0, .025) * SR); n = hp(rs.randn(len(t) - o)) * np.exp(-np.arange(len(t) - o) / SR * 55)
        out[o:] += n * rs.uniform(.5, 1)
    return out * .18 * strength
def kick():
    t = env_t(.35); f = 50 + 90*np.exp(-t*25); ph = 2*np.pi*np.cumsum(f)/SR
    return np.sin(ph) * np.exp(-t*9)
def snap():
    t = env_t(.15); n = rs.randn(len(t)); n = n - np.convolve(n, np.ones(8)/8, 'same')
    return n * np.exp(-t*30) * .5
def pop(f0=320, f1=1100):
    t = env_t(.12); f = f0 + (f1-f0)*np.minimum(1, t/.06); ph = 2*np.pi*np.cumsum(f)/SR
    return np.sin(ph) * np.exp(-t*30) * np.minimum(1, t/.002)
def whoosh(d=.8, rise=True):
    t = env_t(d); n = rs.randn(len(t)); k = 30
    n = np.convolve(n, np.ones(k)/k, 'same'); n = hp(n) * 4 + n
    e = np.sin(np.pi * t / d) ** 2
    return n * e * .35
def thump():
    t = env_t(.4); return np.sin(2*np.pi*75*t) * np.exp(-t*12) + .3*np.sin(2*np.pi*150*t)*np.exp(-t*20)
PENTA = [79, 81, 83, 86, 88, 91, 93, 95]
def shimmer(t0, n=8, span=.5, gain=.18, seed=0):
    r = np.random.RandomState(seed)
    for k in range(n):
        add(bell(mtof(r.choice(PENTA)), 1.2), t0 + k * span / n, gain, r.uniform(-.6, .6))

# ---------- music ----------
BPM = 120; BEAT = 60 / BPM; BAR = 4 * BEAT
CHORDS = {'G': [55, 59, 62], 'Em': [52, 55, 59], 'C': [48, 52, 55], 'D': [50, 54, 57]}
ROOT = {'G': 43, 'Em': 40, 'C': 36, 'D': 38}
PROG = ['G', 'Em', 'C', 'D']
_ = None
MEL_A = [[74,79,78,79,74,_,71,_],[76,79,78,76,71,_,_,_],[72,76,74,72,67,_,72,74],[74,78,76,74,69,_,_,_]]
MEL_B = [[79,_,78,76,74,76,79,_],[83,_,79,76,79,_,_,_],[76,79,76,72,74,76,74,72],[74,_,78,_,81,_,_,_]]
MEL = MEL_A + MEL_B
END = 34.0
nbars = int(END / BAR)
for b in range(nbars):
    t0 = b * BAR; ch = PROG[b % 4]
    full = 18 <= t0 < END; mid = False; intro = t0 < 18; opening = t0 < 4
    add(pad([mtof(m) for m in CHORDS[ch]], BAR + .3), t0, .10 if intro else .12)
    if opening: continue
    if mid:
        for k in (1, 3): add(snap(), t0 + k*BEAT, .25, .1)
    # bass
    if not intro or b >= 2:
        for k in ([0, 2] if intro else [0, 1.5, 2, 3.5]):
            add(bass(mtof(ROOT[ch] + (12 if k in (1.5, 3.5) else 0))), t0 + k*BEAT, .35 if not intro else .25)
    # drums
    if full:
        for k in range(4):
            if k % 2 == 0: add(kick(), t0 + k*BEAT, .55)
            else: add(snap(), t0 + k*BEAT, .35, .1)
    # sleigh bells
    for k in range(8):
        if intro and k % 2: continue
        add(sleigh(strength=1.0 if k % 2 == 0 else .6), t0 + k*BEAT/2, 1.0 if not intro else .7, .35)
    # melody
    if t0 >= 6.0:
        row = MEL[(b - 1) % 8]
        for k, m in enumerate(row):
            if m:
                add(bell(mtof(m)), t0 + k*BEAT/2, .20 if intro else .24, -.15)
                if not intro: add(bell(mtof(m + 12), .8), t0 + k*BEAT/2, .04, .3)
# ending: big G chord + arpeggio
for m in [43, 55, 59, 62, 67]:
    add(bass(mtof(m), 3.0) if m < 50 else pad([mtof(m)], 5.5), END, .35 if m < 50 else .16)
for k, m in enumerate([67, 71, 74, 79, 83, 86, 91]):
    add(bell(mtof(m), 3.0), END + .25 + k*.11, .22, -.5 + k*.16)
add(sleigh(.4, 1.4), END, 1.2, 0)
shimmer(END + 1.2, 10, 1.2, .10, 9)

# ---------- SFX v4 ----------
# opening: ribbon untie
for k, m in enumerate([79, 83, 86, 83, 91]): add(bell(mtof(m), 1.4), .25 + k*.4, .09, -.3 + k*.15)
for tt in (.6, 1.25, 1.9): add(whoosh(.55), tt, .45)
add(whoosh(.8), 2.3, .6); add(thump(), 3.0, .2)
shimmer(3.05, 12, .7, .15, 77); add(sleigh(.3, 1.2), 3.05, .9)
add(whoosh(.4), 3.75, .6)
def step(t, pan=0): add(snap(), t, .10, pan); add(pop(150, 220), t, .06, pan)
def chime(t): 
    for k, m in enumerate([91, 95, 98, 103]): add(bell(mtof(m), .9), t + k*.06, .09, .3)
def scribble(t): add(whoosh(.18), t, .35, .3); add(snap(), t + .12, .12, .3)
S = 4.0   # INTERES: street
add(thump(), S + .2, .35); add(pop(250, 700), S + .4, .3)
for k in range(7): step(S + .6 + k*.23, -.5 + k*.08)
add(whoosh(.3), S + 2.2, .4); add(pop(300, 700), S + 2.3, .3)        # list unrolls
for k in range(3): scribble(S + 2.6 + k*.35)
add(pop(600, 250), S + 3.7, .45); add(bass(mtof(43), .5), S + 3.7, .25)   # "?" (descending)
add(whoosh(.6), S + 4.2, .35)                                          # sigh
add(pop(900, 1500), S + 4.8, .25); add(pop(900, 1500), S + 4.9, .2); shimmer(S + 4.85, 10, .5, .14, 31)  # lights on
for i in range(2): add(pop(500 + i*80, 1100 + i*80), S + 5.0 + i*.25, .3)
add(pop(400, 1300), S + 5.4, .45); add(bell(mtof(91), .8), S + 5.42, .14)   # "!"
add(pop(400, 1000), S + 6.0, .3); add(bell(mtof(91), .8), S + 6.25, .12); add(bell(mtof(95), 1.0), S + 6.4, .14)
for k in range(4): step(S + 6.8 + k*.2, .2 + k*.08)
chime(S + 7.25); add(sleigh(.3, 1.0), S + 7.25, .8, .4); add(whoosh(.5), S + 7.6, .6)
I = 12.0  # DESEO: inside (tb = l + 2.4)
add(whoosh(.6), I + .6, .7); add(thump(), I + 1.2, .9)
for k in range(4): add(sleigh(.08, .8), I + 1.42 + k*.12, 1.0, (-1)**k*.3)
add(pop(260, 900), I + 1.9, .5); shimmer(I + 1.92, 8, .45, .14, 2)
for i, a in enumerate([2.1, 2.8, 3.5, 4.2]):
    add(pop(300 + i*60, 1000 + i*120), I + a, .42); shimmer(I + a + .28, 5, .3, .09, 20 + i); add(whoosh(.35), I + a + .62, .45, .4)
add(whoosh(.5), I + 5.6, .6)
for k in range(5): shimmer(18.0 + (0, 3, 5, 7, 9)[k], 6, .3, .12, 50 + k)            # real clips + captions
E = 30.0  # exit wearing boots + gift bag
chime(E + .05); add(sleigh(.3, 1.0), E + .05, .8, .4)
for k in range(6): step(E + .55 + k*.22, .3 - k*.06)
add(sleigh(.4, 1.4), E + 1.85, 1.0); shimmer(E + 1.85, 10, .5, .16, 40)
add(pop(300, 700), E + 1.95, .3); scribble(E + 2.3); add(bell(mtof(98), 1.0), E + 2.62, .16)
shimmer(E + 2.4, 10, 1.0, .09, 41); add(whoosh(.5), E + 3.6, .7)
C0 = 34.0 # ACCION: CTA over logo
shimmer(C0 + 1.2, 10, 1.0, .09, 6); shimmer(C0 + 2.15, 6, .4, .10, 7)

# ---------- reverb + master ----------
def reverb(x, d=1.4, mix=.22):
    t = np.arange(int(d*SR)) / SR; ir = np.random.RandomState(1).randn(len(t)) * np.exp(-t*4.5); ir[0] = 0
    n = len(x) + len(ir); nf = 1 << (n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nf) * np.fft.rfft(ir, nf), nf)[:len(x)]
    y /= np.max(np.abs(y)) + 1e-9; return x + y * np.max(np.abs(x)) * mix
L = reverb(L); R = reverb(R)
fade = np.ones(N); fl = int(2.0 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 1.5
L *= fade; R *= fade
pk = max(np.max(np.abs(L)), np.max(np.abs(R))); L /= pk / .89; R /= pk / .89
L = np.tanh(L * 1.2) / np.tanh(1.2); R = np.tanh(R * 1.2) / np.tanh(1.2)
out = (np.stack([L, R], 1) * 32000).astype(np.int16)
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())
print('ok', DUR)
