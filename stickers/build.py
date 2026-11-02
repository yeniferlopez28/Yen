"""Generate the sticker set from shared character parts.

Run:  python3 build.py   -> writes sticker-XX-*.svg next to this file.
Render to PNG with render.js (Playwright).
"""
from pathlib import Path

OUT = Path(__file__).parent

# palette
HAIR = "#8A3E1E"
HAIR_SHINE = "#B8693F"
HAIR_LINE = "#4E1D0C"
SKIN = "#FCEFD9"
SKIN_SHADE = "#EBD5BD"
WINE = "#8B1A3D"
BROW = "#4E2414"
LIP = "#E9879B"
TOP = "#5B3326"
TOP_LACE = "#7E4A38"
STRAP = "#3A1E16"
PINK = "#F7A1B5"
OLIVE = "#6B6B10"
ORANGE = "#F2864E"
CREAM = "#FCEFD9"

BODY_T = 'transform="translate(500,-75) scale(1.25,1) translate(-500,0)"'

DEFS = f"""
  <defs>
    <path id="hair" d="M500 170 C 375 170 294 252 288 370 C 284 430 260 458 266 518
      C 272 572 250 600 256 655 C 262 708 240 738 254 788 C 268 832 310 850 338 836
      C 360 852 392 846 404 830 L 596 830 C 608 846 640 852 662 836
      C 690 850 732 832 746 788 C 760 738 738 708 744 655 C 750 600 728 572 734 518
      C 740 458 716 430 712 370 C 706 252 625 170 500 170 Z"/>
    <radialGradient id="blush">
      <stop offset="0" stop-color="#F07C98" stop-opacity="0.75"/>
      <stop offset="0.5" stop-color="#F28CA4" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#F7A1B5" stop-opacity="0"/>
    </radialGradient>
    <!-- paper cut-out border around everything inside the group -->
    <filter id="cutout" x="-20%" y="-20%" width="140%" height="140%">
      <feMorphology in="SourceAlpha" operator="dilate" radius="26" result="grow"/>
      <feFlood flood-color="{CREAM}"/>
      <feComposite in2="grow" operator="in" result="border"/>
      <feMerge><feMergeNode in="border"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse">
      <rect width="60" height="60" fill="{PINK}"/>
      <ellipse cx="15" cy="15" rx="8" ry="11" fill="{WINE}"/>
      <ellipse cx="45" cy="45" rx="8" ry="11" fill="{WINE}"/>
    </pattern>
  </defs>"""


# ---------- head parts (head coordinates: face centred at x=500) ----------

def hair_back():
    return f"""
  <use href="#hair" fill="{HAIR}"/>
  <g fill="none" stroke-linecap="round">
    <path stroke="{HAIR_SHINE}" stroke-width="10" opacity="0.8" d="M415 210 C 372 230 340 268 326 322"/>
    <path stroke="{HAIR_SHINE}" stroke-width="10" opacity="0.8" d="M585 210 C 628 230 660 268 674 322"/>
    <path stroke="{HAIR_SHINE}" stroke-width="7" opacity="0.6" d="M296 610 C 286 650 304 680 292 728"/>
    <path stroke="{HAIR_SHINE}" stroke-width="7" opacity="0.6" d="M704 610 C 714 650 696 680 708 728"/>
    <g stroke="{HAIR_LINE}" stroke-width="5">
      <path d="M318 425 C 304 465 328 495 312 545"/>
      <path d="M682 425 C 696 465 672 495 688 545"/>
    </g>
  </g>"""


BODY_PATH = ("M300 940 C 300 852 336 806 404 792 C 440 784 457 764 457 728 L457 520 L543 520 "
             "L543 728 C 543 764 560 784 596 792 C 664 806 700 852 700 940 Z")


def bust_body(uid="b"):
    return f"""
  <g {BODY_T}>
    <path fill="{SKIN}" d="{BODY_PATH}"/>
    <path fill="{SKIN_SHADE}" d="M457 570 C 480 598 520 598 543 570 L543 612 C 520 628 480 628 457 612 Z"/>
    <clipPath id="bodyClip-{uid}"><path d="{BODY_PATH}"/></clipPath>
    <g clip-path="url(#bodyClip-{uid})">
      <path fill="{TOP}" d="M250 845 C 340 846 420 872 500 872 C 580 872 660 846 750 845 L750 960 L250 960 Z"/>
      <path fill="none" stroke="{TOP_LACE}" stroke-width="7" stroke-dasharray="1 13" stroke-linecap="round" d="M250 852 C 340 853 420 879 500 879 C 580 879 660 853 750 852"/>
      <path fill="none" stroke="{TOP_LACE}" stroke-width="3" d="M250 860 C 340 861 420 887 500 887 C 580 887 660 861 750 860"/>
    </g>
    <path stroke="{STRAP}" stroke-width="7" fill="none" stroke-linecap="round" d="M372 852 L392 788 M628 852 L608 788"/>
  </g>"""


def face_base():
    return f"""
  <path fill="{SKIN}" d="M500 280 C 594 280 652 346 652 434 C 652 530 588 590 500 590 C 412 590 348 530 348 434 C 348 346 406 280 500 280 Z"/>
  <path fill="{HAIR}" d="M500 262 C 436 262 368 300 348 370 C 340 400 342 440 348 470
    C 360 420 386 360 428 330 C 460 306 488 300 500 290 C 512 300 540 306 572 330
    C 614 360 642 420 652 470 C 658 440 660 400 652 370 C 632 300 564 262 500 262 Z"/>
  <path fill="none" stroke="{HAIR_LINE}" stroke-width="5" stroke-linecap="round" d="M500 200 L500 288"/>
  <g fill="url(#blush)">
    <ellipse cx="420" cy="488" rx="56" ry="44"/>
    <ellipse cx="580" cy="488" rx="56" ry="44"/>
  </g>
  <path fill="none" stroke="{WINE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" d="M490 414 C 494 450 488 476 480 494 C 492 506 508 506 518 498"/>"""


def brows(lift=0):
    return f"""
  <g fill="{BROW}" transform="translate(0,{-lift})">
    <path d="M402 394 C 422 374 462 372 482 382 L480 398 C 458 391 426 395 406 407 Z"/>
    <path d="M598 394 C 578 374 538 372 518 382 L520 398 C 542 391 574 395 594 407 Z"/>
  </g>"""


EYES_CLOSED = f"""
  <g fill="none" stroke="{WINE}" stroke-width="7" stroke-linecap="round">
    <path d="M412 438 C 426 454 458 454 472 438"/>
    <path d="M528 438 C 542 454 574 454 588 438"/>
    <path d="M416 444 L404 452 M430 451 L422 463 M446 454 L443 467 M462 451 L465 463"/>
    <path d="M584 444 L596 452 M570 451 L578 463 M554 454 L557 467 M538 451 L535 463"/>
  </g>"""

EYES_HAPPY = f"""
  <g fill="none" stroke="{WINE}" stroke-width="7" stroke-linecap="round">
    <path d="M412 452 C 426 432 458 432 472 452"/>
    <path d="M528 452 C 542 432 574 432 588 452"/>
    <path d="M414 446 L402 440 M586 446 L598 440"/>
  </g>"""


def eyes_open(look_x=0, big=False):
    r = 15 if big else 12
    return f"""
  <g fill="none" stroke="{WINE}" stroke-width="7" stroke-linecap="round">
    <path d="M410 446 C 424 428 458 428 474 444"/>
    <path d="M526 444 C 542 428 576 428 590 446"/>
    <path d="M412 442 L400 434 M588 442 L600 434"/>
  </g>
  <g fill="{WINE}">
    <circle cx="{442 + look_x}" cy="{452 if big else 448}" r="{r}"/>
    <circle cx="{558 + look_x}" cy="{452 if big else 448}" r="{r}"/>
  </g>
  <g fill="{CREAM}">
    <circle cx="{447 + look_x}" cy="{445 if big else 443}" r="4"/>
    <circle cx="{563 + look_x}" cy="{445 if big else 443}" r="4"/>
  </g>"""


MOUTH_SOFT = f"""
  <path fill="{LIP}" d="M466 534 C 482 550 518 550 534 534 C 522 528 511 531 500 533 C 489 531 478 528 466 534 Z"/>
  <path fill="none" stroke="{WINE}" stroke-width="6" stroke-linecap="round" d="M462 534 C 482 549 518 549 538 534"/>"""

MOUTH_BIG_SMILE = f"""
  <path fill="{WINE}" d="M452 522 Q 500 530 548 522 C 542 576 458 576 452 522 Z"/>
  <path fill="{CREAM}" d="M460 526 Q 500 532 540 526 L537 540 Q 500 546 463 540 Z"/>
  <path fill="{LIP}" d="M474 562 C 488 550 512 550 526 562 C 512 570 488 570 474 562 Z"/>"""

MOUTH_KISS = f"""
  <path fill="{LIP}" stroke="{WINE}" stroke-width="6" stroke-linejoin="round"
        d="M508 520 C 524 512 538 522 530 534 C 540 544 528 560 510 552 C 498 548 496 540 502 536 C 494 530 496 524 508 520 Z"/>
  <path fill="none" stroke="{WINE}" stroke-width="5" stroke-linecap="round" d="M504 536 L524 535"/>"""

MOUTH_O = f"""
  <ellipse cx="500" cy="540" rx="18" ry="24" fill="{WINE}"/>
  <ellipse cx="500" cy="552" rx="10" ry="7" fill="{LIP}"/>"""


def head(eyes, mouth, brow_lift=0):
    return face_base() + brows(brow_lift) + eyes + mouth


def heart(x, y, s, fill):
    return (f'<path transform="translate({x},{y}) scale({s})" fill="{fill}" '
            'd="M0 12 C -6 2 -22 -2 -22 -14 C -22 -24 -10 -28 0 -18 C 10 -28 22 -24 22 -14 C 22 -2 6 2 0 12 Z"/>')


def sparkle(x, y, s, fill=OLIVE):
    return (f'<path transform="translate({x},{y}) scale({s})" fill="{fill}" '
            'd="M0 -30 L6 -6 L30 0 L6 6 L0 30 L-6 6 L-30 0 L-6 -6 Z"/>')


def star(x, y, s, fill=PINK):
    return (f'<path transform="translate({x},{y}) scale({s})" fill="{fill}" '
            'd="M0 -100 L22 -30 L95 -31 L36 12 L59 81 L0 38 L-59 81 L-36 12 L-95 -31 L-22 -30 Z"/>')


def svg(w, h, back, character, front=""):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">{DEFS}
  <g>{back}</g>
  <g filter="url(#cutout)">{character}
  </g>
  <g>{front}</g>
</svg>
"""


def bust(eyes, mouth, brow_lift=0, uid="b"):
    return hair_back() + bust_body(uid) + head(eyes, mouth, brow_lift)


# ---------- stickers ----------

def s_smile():
    back = star(170, 360, 0.9) + star(840, 640, 0.6) + sparkle(820, 260, 1.1) + sparkle(140, 690, 0.9)
    return svg(1000, 1000, back, bust(EYES_HAPPY, MOUTH_BIG_SMILE, uid="smile"))


def s_kiss():
    back = star(160, 380, 0.85) + sparkle(850, 640, 1) + sparkle(130, 700, 0.8)
    front = heart(735, 470, 2.2, WINE) + heart(820, 360, 1.5, PINK) + heart(790, 255, 1.0, WINE)
    return svg(1000, 1000, back, bust(EYES_CLOSED, MOUTH_KISS, uid="kiss"), front)


def s_surprise():
    back = star(845, 620, 0.7) + star(150, 640, 0.55)
    pop = "".join(
        f'<path stroke="{OLIVE}" stroke-width="14" stroke-linecap="round" fill="none" d="{d}"/>' for d in [
            "M250 230 L200 180", "M215 320 L150 305", "M290 160 L275 95",
            "M750 230 L800 180", "M785 320 L850 305", "M710 160 L725 95"])
    return svg(1000, 1000, back, bust(eyes_open(big=True), MOUTH_O, brow_lift=16, uid="surprise"), pop)


def s_coffee():
    back = star(150, 330, 0.85) + sparkle(860, 230, 1.1) + sparkle(120, 660, 0.8)
    # mug + hand on viewer's right, laptop at the front
    props = f"""
  <!-- forearm holding the mug -->
  <path fill="{SKIN}" stroke="{WINE}" stroke-width="6" stroke-linejoin="round"
        d="M790 985 C 760 920 736 860 706 800 L776 790 C 806 850 840 910 872 975 Z"/>
  <!-- mug -->
  <path fill="{WINE}" d="M680 690 L800 690 L792 800 C 790 812 690 812 688 800 Z"/>
  <path fill="none" stroke="{WINE}" stroke-width="16" d="M798 716 C 846 716 846 776 794 776"/>
  <path fill="{PINK}" d="M712 726 C 712 716 724 710 734 720 C 744 710 756 716 756 726 C 756 740 734 752 734 752 C 734 752 712 740 712 726 Z"/>
  <g fill="none" stroke="{WINE}" stroke-width="7" stroke-linecap="round">
    <path d="M720 670 C 706 650 734 636 720 612"/>
    <path d="M756 670 C 742 650 770 636 756 612"/>
  </g>
  <!-- fingers wrapped around the mug -->
  <g fill="{SKIN}" stroke="{WINE}" stroke-width="6">
    <rect x="664" y="726" width="58" height="26" rx="13"/>
    <rect x="660" y="752" width="62" height="26" rx="13"/>
    <rect x="664" y="778" width="58" height="26" rx="13"/>
  </g>
  <!-- laptop (back of the lid facing us) -->
  <g transform="rotate(-6 420 860)">
    <rect x="220" y="740" width="400" height="250" rx="22" fill="{PINK}" stroke="{WINE}" stroke-width="7"/>
    {heart(420, 862, 1.6, WINE)}
    <g fill="{SKIN}" stroke="{WINE}" stroke-width="6">
      <rect x="430" y="716" width="24" height="54" rx="12"/>
      <rect x="456" y="712" width="24" height="58" rx="12"/>
      <rect x="482" y="716" width="24" height="54" rx="12"/>
      <rect x="508" y="724" width="22" height="46" rx="11"/>
    </g>
  </g>
  <rect x="150" y="975" width="700" height="14" rx="7" fill="{WINE}"/>"""
    character = hair_back() + bust_body("coffee") + head(eyes_open(look_x=6), MOUTH_SOFT) + props
    return svg(1000, 1060, back, character)


def s_walk():
    W, H = 1000, 1400
    back = star(170, 300, 0.8) + star(830, 820, 0.6) + sparkle(820, 240, 1.0) + sparkle(160, 900, 0.9)
    head_g = f'<g transform="translate(250,30) scale(0.5)">{hair_back()}</g>'
    face_g = f'<g transform="translate(250,30) scale(0.5)">{head(eyes_open(look_x=8), MOUTH_BIG_SMILE)}</g>'

    def arm(d):
        return (f'<path fill="none" stroke="{WINE}" stroke-width="64" stroke-linecap="round" stroke-linejoin="round" d="{d}"/>'
                f'<path fill="none" stroke="{SKIN}" stroke-width="52" stroke-linecap="round" stroke-linejoin="round" d="{d}"/>')

    body = f"""
  <!-- back arm (swinging back) -->
  {arm("M400 445 C 370 510 345 570 318 645")}
  <!-- back leg -->
  <path fill="url(#dots)" stroke="{WINE}" stroke-width="7" stroke-linejoin="round"
        d="M392 650 L505 650 L445 1180 L270 1160 Z"/>
  <ellipse cx="350" cy="1196" rx="95" ry="34" fill="{WINE}" transform="rotate(-10 380 1200)"/>
  <!-- neck + torso -->
  <path fill="{SKIN}" d="M474 300 L526 300 L526 378 C 576 388 612 398 622 440 L612 520 L388 520 L378 440 C 388 398 424 388 474 378 Z"/>
  <path fill="{TOP}" d="M382 470 C 430 484 466 488 500 488 C 534 488 570 484 618 470 L608 660 L392 660 Z"/>
  <path fill="none" stroke="{TOP_LACE}" stroke-width="6" stroke-dasharray="1 11" stroke-linecap="round" d="M384 476 C 430 490 466 494 500 494 C 534 494 570 490 616 476"/>
  <path stroke="{STRAP}" stroke-width="6" fill="none" stroke-linecap="round" d="M420 481 L428 408 M580 481 L572 408"/>
  <!-- front leg (stepping forward) -->
  <path fill="url(#dots)" stroke="{WINE}" stroke-width="7" stroke-linejoin="round"
        d="M495 650 L608 650 L755 1150 L585 1180 Z"/>
  <ellipse cx="680" cy="1200" rx="98" ry="36" fill="{WINE}" transform="rotate(8 680 1200)"/>
  <path fill="none" stroke="{CREAM}" stroke-width="6" stroke-linecap="round" d="M612 1190 L742 1206"/>
  <!-- waistband -->
  <path fill="{PINK}" stroke="{WINE}" stroke-width="7" d="M390 630 L610 630 L612 674 L388 674 Z"/>
  <!-- front arm (swinging forward) -->
  {arm("M600 445 C 635 510 665 565 705 620")}
  <circle cx="316" cy="654" r="30" fill="{SKIN}" stroke="{WINE}" stroke-width="6"/>
  <circle cx="710" cy="628" r="30" fill="{SKIN}" stroke="{WINE}" stroke-width="6"/>"""
    return svg(W, H, back, head_g + body + face_g)


STICKERS = {
    "sticker-02-sonrisa": s_smile,
    "sticker-03-beso": s_kiss,
    "sticker-04-sorpresa": s_surprise,
    "sticker-05-cafe-compu": s_coffee,
    "sticker-06-caminando": s_walk,
}

if __name__ == "__main__":
    for name, fn in STICKERS.items():
        (OUT / f"{name}.svg").write_text(fn())
        print(name)
