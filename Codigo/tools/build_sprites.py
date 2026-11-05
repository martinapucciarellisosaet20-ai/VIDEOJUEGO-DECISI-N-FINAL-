#!/usr/bin/env python3
"""
build_sprites.py · Genera js/data/vestuario.js (pixel-art del juego)

Herramienta de desarrollo (no se carga en el juego). Dibuja con primitivas
(rectángulos, puntos, elipses) sobre una grilla, agrega el contorno oscuro
automáticamente y exporta cada pieza como filas de caracteres + posición.
El juego (js/core/sprites.js) convierte esas filas en SVG.

Referencia visual: "Fotos del prototipo" (pantalla ¡VESTÍ A TU PERSONAJE!).

Uso:  python3 tools/build_sprites.py   (sobrescribe js/data/vestuario.js)
"""
import json, os

W, H = 40, 62            # grilla del personaje (incluye lugar para la mascota)

# ---------------------------------------------------------------- paleta
PAL = {
    'k': '#2a1712',  # contorno
    'S': '#f2c9a0', 's': '#d9a47c',   # piel (se reemplaza según el tono elegido)
    'e': '#3b2519', 'W': '#f4f0e8', 'b': '#eaa18c',
    'R': '#6d1f30', 'r': '#511523', 'Q': '#87303f',            # buzo bordó
    'P': '#2d2d33', 'p': '#1f1f24', 'L': '#3d3d45',            # pantalón
    'B': '#1b1b1f', 'D': '#34343b', 'G': '#8e8e98', 'g': '#c8c8d0',
    'H': '#6b3d20', 'h': '#4d2a14', 'J': '#8c5631',            # pelo castaño
    'N': '#232327', 'n': '#121215', 'M': '#3c3c44',            # pelo negro
    'C': '#f1e4c8', 'c': '#d8c7a3',                            # crema
    'O': '#7a2333', 'o': '#5a1825',                            # bordó gorra/bufanda
    'V': '#5f9a4a', 'v': '#44743a', 'Y': '#e98f9a',            # rana
    'T': '#c89a6e', 't': '#a87850', 'U': '#3a2418',            # bubble tea
    'F': '#3f6e3a', 'f': '#2c5029',                            # libro
    'A': '#d9a640', 'a': '#b0822a',                            # dorado
    'Z': '#d6d6de', 'z': '#9fa0aa',                            # plateado
    'X': '#b0303b', 'x': '#7e1f28',                            # rojo
    'I': '#3a3a46',                                            # pantalla celular
    'y': '#e8c84a',                                            # ojos del gato
    '1': '#8a5a34', '2': '#6b4224', '3': '#c49a6c',            # osito
    'w': '#f5f1e9', 'i': '#d7d0c3',                            # peluca del juez
    'K': '#6b3a1f',                                            # madera
}

class Grid:
    def __init__(self, w=W, h=H):
        self.w, self.h = w, h
        self.g = [['.'] * w for _ in range(h)]
        self.noline = set()          # celdas que no reciben contorno

    def put(self, x, y, c):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.g[y][x] = c
        return self

    def rect(self, x, y, w, h, c):
        for j in range(y, y + h):
            for i in range(x, x + w):
                self.put(i, j, c)
        return self

    def pts(self, lst, c):
        for (x, y) in lst:
            self.put(x, y, c)
        return self

    def clear(self, x, y, w=1, h=1):
        return self.rect(x, y, w, h, '.')

    def ellipse(self, cx, cy, rx, ry, c):
        for j in range(self.h):
            for i in range(self.w):
                if ((i - cx) / rx) ** 2 + ((j - cy) / ry) ** 2 <= 1.0:
                    self.put(i, j, c)
        return self

    def outline(self, c='k', skip=()):
        add = []
        for y in range(self.h):
            for x in range(self.w):
                if self.g[y][x] != '.':
                    continue
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < self.w and 0 <= ny < self.h and self.g[ny][nx] not in ('.', c) and (x, y) not in skip:
                        add.append((x, y)); break
        for x, y in add:
            self.g[y][x] = c
        return self

    def part(self, z):
        xs = [x for y in range(self.h) for x in range(self.w) if self.g[y][x] != '.']
        ys = [y for y in range(self.h) for x in range(self.w) if self.g[y][x] != '.']
        if not xs:
            return None
        x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
        rows = [''.join(self.g[y][x0:x1 + 1]) for y in range(y0, y1 + 1)]
        return {'z': z, 'x': x0, 'y': y0, 'rows': rows}


# ---------------------------------------------------------------- capas (z)
Z = dict(hairBack=1, bagBack=2, body=3, varios=4, collar=5, bufanda=6, pin=7,
         bolso=8, mano=9, barbijo=10, hairFront=11, gafas=12, auriculares=13,
         gorro=14, mascota=15)

# ---------------------------------------------------------------- cuerpo base
def body():
    g = Grid()
    # cara
    g.rect(12, 6, 12, 12, 'S').rect(13, 18, 10, 1, 'S')
    g.rect(16, 19, 4, 2, 's')                       # cuello
    # buzo
    g.rect(10, 21, 16, 2, 'R').rect(9, 22, 18, 2, 'R')
    g.rect(11, 23, 14, 13, 'R')
    g.rect(8, 23, 3, 13, 'R').rect(25, 23, 3, 13, 'R')   # mangas
    g.rect(8, 35, 3, 1, 'r').rect(25, 35, 3, 1, 'r')     # puños
    g.rect(11, 35, 14, 1, 'r')                           # ruedo
    g.rect(16, 21, 4, 1, 'r')                            # cuello del buzo
    g.pts([(11, y) for y in range(24, 35)] + [(24, y) for y in range(24, 35)], 'r')
    g.pts([(13, 24), (14, 24), (13, 25)], 'Q')           # brillo
    # manos
    g.rect(8, 36, 3, 2, 'S').rect(25, 36, 3, 2, 'S').pts([(8, 37), (27, 37)], 's')
    # pantalón ancho
    g.rect(12, 36, 12, 9, 'P')
    g.rect(11, 45, 6, 10, 'P').rect(19, 45, 6, 10, 'P')
    g.pts([(17, 41), (17, 42), (17, 43), (17, 44), (18, 44)], 'p')
    g.pts([(12, 46), (12, 47), (12, 48), (20, 46), (20, 47), (20, 48)], 'L')
    g.pts([(16, y) for y in range(46, 55)] + [(24, y) for y in range(46, 55)], 'p')
    # zapatillas
    g.rect(10, 55, 7, 2, 'B').rect(19, 55, 7, 2, 'B')
    g.rect(10, 57, 7, 1, 'W').rect(19, 57, 7, 1, 'W')
    g.pts([(12, 55), (13, 56), (21, 55), (22, 56)], 'W')
    g.outline()
    # ojos y rubor (después del contorno)
    g.rect(14, 11, 2, 3, 'e').rect(20, 11, 2, 3, 'e')
    g.pts([(15, 11), (21, 11)], 'W')
    g.pts([(13, 15), (22, 15)], 'b')
    g.pts([(17, 16), (18, 16)], 's')
    return [g.part(Z['body'])]

# ---------------------------------------------------------------- pelo
def hair_parts(back, front, z=(Z['hairBack'], Z['hairFront'])):
    out = []
    if back:
        gb = Grid(); back(gb)
        gb.clear(12, 6, 12, 13).clear(13, 19, 10, 2).clear(11, 21, 14, 16)   # hueco de cara y cuerpo
        gb.outline(); out.append(gb.part(z[0]))
    gf = Grid(); front(gf); gf.outline(); out.append(gf.part(z[1]))
    return [p for p in out if p]

def bangs(g, c='H', sh='h', hi='J', y=6):
    g.rect(11, 2, 14, 5, c).rect(10, 4, 16, 3, c)
    g.rect(11, y, 14, 2, c)
    for x in (11, 12, 13, 15, 16, 19, 20, 22, 23, 24):
        g.put(x, y + 2, c)
    for x in (12, 16, 20, 23):
        g.put(x, y + 3, c)
    g.pts([(14, 3), (15, 3), (16, 3), (19, 4), (20, 4)], hi)
    g.pts([(13, y + 1), (18, y + 1), (22, y + 1)], sh)

def hair_largo(c='H', sh='h', hi='J'):
    def back(g):
        g.rect(9, 5, 18, 26, c)
        g.rect(7, 10, 2, 3, c).rect(7, 19, 2, 3, c).rect(27, 13, 2, 3, c).rect(27, 22, 2, 3, c)
        g.rect(10, 31, 3, 1, c).rect(15, 31, 3, 1, c).rect(23, 31, 3, 1, c)
        g.rect(10, 20, 1, 2, sh).rect(25, 17, 1, 2, sh)
    def front(g):
        bangs(g, c, sh, hi)
        g.rect(9, 7, 3, 22, c).rect(24, 7, 3, 22, c)
        g.rect(8, 13, 1, 3, c).rect(8, 22, 1, 3, c).rect(27, 16, 1, 3, c).rect(27, 25, 1, 3, c)
        g.rect(9, 29, 2, 1, c).rect(25, 29, 2, 1, c)
        g.rect(10, 12, 1, 2, sh).rect(10, 18, 1, 3, sh).rect(25, 14, 1, 2, sh).rect(25, 21, 1, 3, sh)
        g.pts([(10, 9), (25, 10)], hi)
    return hair_parts(back, front)

def hair_semi():   # semirecogido con rodete
    def back(g):
        g.rect(10, 6, 16, 17, 'H').pts([(9, 12), (9, 13), (26, 15), (26, 16)], 'H')
    def front(g):
        bangs(g)
        g.rect(10, 7, 2, 15, 'H').rect(24, 7, 2, 15, 'H')
        g.rect(21, 0, 5, 4, 'H').pts([(22, 0), (24, 1)], 'J').pts([(23, 3)], 'h')
        g.pts([(10, 22), (25, 22)], 'H')
    return hair_parts(back, front)

def hair_carre():
    def back(g):
        g.rect(10, 6, 16, 13, 'H')
    def front(g):
        bangs(g)
        g.rect(10, 7, 2, 12, 'H').rect(24, 7, 2, 12, 'H')
        g.pts([(9, 15), (9, 16), (9, 17), (26, 15), (26, 16), (26, 17), (10, 19), (25, 19)], 'H')
        g.pts([(11, 17), (24, 17)], 'h')
    return hair_parts(back, front)

def hair_melena():
    def back(g):
        g.rect(9, 6, 18, 18, 'H')
    def front(g):
        bangs(g)
        g.rect(9, 7, 3, 17, 'H').rect(24, 7, 3, 17, 'H')
        g.pts([(8, 18), (8, 19), (27, 18), (27, 19), (9, 24), (10, 25), (26, 24), (25, 25)], 'H')
        g.pts([(10, 14), (25, 14), (10, 21), (25, 21)], 'h')
    return hair_parts(back, front)

def hair_colita():
    def back(g):
        g.rect(25, 5, 4, 6, 'H').rect(26, 11, 4, 9, 'H').rect(27, 20, 3, 4, 'H')
        g.pts([(28, 7), (28, 15), (28, 21)], 'h').put(29, 24, 'H')
    def front(g):
        g.rect(11, 2, 14, 5, 'H').rect(10, 4, 16, 3, 'H').rect(10, 7, 2, 7, 'H').rect(24, 7, 2, 7, 'H')
        g.rect(11, 6, 14, 2, 'H').pts([(11, 8), (12, 8), (16, 8), (20, 8), (23, 8), (24, 8)], 'H')
        g.pts([(14, 3), (15, 3), (19, 4)], 'J').pts([(13, 7), (21, 7)], 'h')
        g.rect(25, 5, 2, 2, 'X')                     # gomita
    return hair_parts(back, front)

def hair_corto_negro():
    def front(g):
        g.rect(11, 1, 14, 6, 'N').rect(10, 3, 16, 5, 'N').rect(10, 8, 3, 5, 'N').rect(23, 8, 3, 5, 'N')
        g.rect(11, 7, 14, 2, 'N').pts([(12, 9), (15, 9), (18, 9), (21, 9), (23, 9)], 'N')
        g.pts([(14, 2), (15, 2), (16, 2), (20, 3)], 'M').pts([(13, 8), (19, 8)], 'n')
    return hair_parts(None, front)

# ---------------------------------------------------------------- gorros
def gorra(c, sh):
    g = Grid()
    g.ellipse(18, 5, 8, 5, c).clear(0, 6, W, 10)
    g.rect(10, 5, 16, 2, c).rect(5, 6, 8, 2, sh)
    g.put(18, 0, sh).pts([(19, 2), (20, 2)], 'W' if c == 'B' else 'Q')
    g.outline()
    return [g.part(Z['gorro'])]

def gorro_lana():
    g = Grid()
    g.ellipse(18, 5, 8, 5, 'C').clear(0, 6, W, 10).rect(10, 5, 16, 4, 'c')
    for x in range(11, 26, 2):
        g.put(x, 6, 'C'); g.put(x, 7, 'C')
    g.pts([(15, 2), (18, 2), (21, 2)], 'c')
    g.outline()
    return [g.part(Z['gorro'])]

def gorro_rana():
    g = Grid()
    g.ellipse(18, 5, 9, 5, 'V').clear(0, 6, W, 10).rect(9, 5, 18, 3, 'V')
    g.rect(9, 8, 3, 6, 'V').rect(24, 8, 3, 6, 'V').pts([(10, 14), (25, 14)], 'v')
    g.ellipse(12, 1, 2, 2, 'V').ellipse(24, 1, 2, 2, 'V')
    g.outline()
    g.rect(11, 0, 2, 2, 'W').rect(23, 0, 2, 2, 'W').pts([(12, 1), (24, 1)], 'B')
    g.pts([(12, 4), (13, 4), (23, 4), (24, 4)], 'Y').pts([(17, 4), (18, 4), (19, 4)], 'v')
    return [g.part(Z['gorro'])]

def piluso():
    g = Grid()
    g.rect(12, 0, 12, 6, 'B').rect(11, 2, 14, 4, 'B').rect(8, 6, 20, 2, 'D').rect(9, 8, 18, 1, 'D')
    g.pts([(14, 3), (15, 3)], 'D')
    g.outline()
    g.put(18, 3, 'A')
    return [g.part(Z['gorro'])]

# ---------------------------------------------------------------- auriculares
def auric(c, sh):
    g = Grid()
    g.rect(11, 0, 14, 2, c).rect(9, 1, 3, 2, c).rect(24, 1, 3, 2, c)
    g.rect(8, 3, 2, 6, c).rect(26, 3, 2, 6, c)
    g.rect(7, 9, 4, 6, c).rect(25, 9, 4, 6, c).pts([(8, 10), (26, 10)], sh)
    g.outline()
    return [g.part(Z['auriculares'])]

def auric_inal():
    g = Grid()
    g.rect(10, 11, 2, 2, 'W').rect(10, 13, 1, 3, 'W').rect(24, 11, 2, 2, 'W').rect(25, 13, 1, 3, 'W')
    g.outline()
    return [g.part(Z['auriculares'])]

# ---------------------------------------------------------------- bufandas
def bufanda(c, sh):
    g = Grid()
    g.rect(12, 19, 12, 4, c).rect(11, 20, 14, 2, c)
    g.rect(19, 23, 4, 9, c).rect(19, 32, 4, 1, sh)
    for x in (19, 21):
        g.put(x, 33, c)
    g.pts([(13, 20), (16, 21), (20, 20), (22, 26), (20, 29)], sh)
    g.outline()
    return [g.part(Z['bufanda'])]

# ---------------------------------------------------------------- gafas
def gafas(c, redondas=False):
    g = Grid()
    if redondas:
        for cx in (14, 21):
            g.ellipse(cx + .5, 12, 2.6, 2.2, c)
            g.ellipse(cx + .5, 12, 1.5, 1.2, '.')
    else:
        g.rect(12, 10, 6, 5, c).rect(19, 10, 6, 5, c).clear(13, 11, 4, 3).clear(20, 11, 4, 3)
        g.rect(11, 10, 1, 2, c).rect(25, 10, 1, 2, c)
    g.rect(17, 11, 3, 1, c)
    return [g.part(Z['gafas'])]

def gafas_finas():
    g = Grid()
    g.rect(12, 10, 6, 1, 'B').rect(19, 10, 6, 1, 'B').pts([(12, 11), (12, 12), (17, 11), (17, 12), (19, 11), (19, 12), (24, 11), (24, 12)], 'B')
    g.rect(13, 13, 4, 1, 'B').rect(20, 13, 4, 1, 'B').rect(18, 11, 1, 1, 'B')
    return [g.part(Z['gafas'])]

# ---------------------------------------------------------------- collares
def collar(c, sh, dije):
    g = Grid()
    for i in range(5):
        g.put(13 + i, 22 + i, c); g.put(22 - i, 22 + i, c)
    if dije == 'aro':
        g.rect(17, 27, 2, 2, sh).pts([(16, 28), (19, 28)], c)
    elif dije == 'corazon':
        g.pts([(16, 27), (19, 27), (16, 28), (17, 28), (18, 28), (19, 28), (17, 29), (18, 29)], sh)
    else:
        g.pts([(17, 27), (18, 27), (17, 28), (18, 28), (17, 29)], sh)
    return [g.part(Z['collar'])]

# ---------------------------------------------------------------- pins
def pin(kind):
    g = Grid()
    if kind == 'estrella':
        g.pts([(21, 26), (20, 27), (21, 27), (22, 27), (19, 28), (20, 28), (21, 28), (22, 28), (23, 28), (20, 29), (22, 29)], 'B')
    elif kind == 'corazon':
        g.pts([(20, 27), (22, 27), (19, 28), (20, 28), (21, 28), (22, 28), (23, 28), (20, 29), (21, 29), (22, 29), (21, 30)], 'X')
    elif kind == 'rana':
        g.rect(19, 27, 5, 3, 'V').pts([(19, 26), (23, 26)], 'V').outline()
        g.pts([(19, 26), (23, 26)], 'W').pts([(20, 29), (22, 29)], 'Y')
    else:
        g.rect(19, 26, 4, 4, 'W').outline().pts([(19, 26), (22, 29), (20, 27), (21, 28)], 'B')
    return [g.part(Z['pin'])]

# ---------------------------------------------------------------- mochilas / bolsos
def mochila():
    gb = Grid(); gb.rect(5, 24, 6, 14, 'B').rect(25, 24, 6, 14, 'B').rect(4, 30, 2, 6, 'D').outline()
    gf = Grid(); gf.rect(11, 22, 2, 13, 'D').rect(23, 22, 2, 13, 'D').pts([(11, 30), (24, 30)], 'G').outline()
    return [gb.part(Z['bagBack']), gf.part(Z['bolso'])]

def bolso_crema():
    g = Grid()
    for i in range(12):
        g.put(23 + i // 4, 22 + i, 'c')
    g.rect(25, 34, 8, 7, 'C').rect(26, 33, 6, 1, 'C').pts([(28, 36), (29, 36)], 'A').pts([(26, 39), (31, 39)], 'c')
    g.outline()
    return [g.part(Z['bolso'])]

def bandolera():
    g = Grid()
    for i in range(14):
        g.put(12 + i, 21 + i, 'D')
    g.rect(24, 34, 7, 6, 'B').rect(25, 33, 5, 1, 'B').pts([(26, 35), (27, 35), (28, 35)], 'D').put(27, 37, 'Z')
    g.outline()
    return [g.part(Z['bolso'])]

# ---------------------------------------------------------------- accesorios de mano (mano derecha del personaje)
def bubble_tea():
    g = Grid()
    g.rect(28, 31, 5, 8, 'T').rect(28, 31, 5, 1, 'W').rect(29, 26, 1, 5, 'B').put(30, 26, 'B')
    g.pts([(29, 37), (31, 37), (30, 36), (29, 35)], 'U').pts([(28, 33), (28, 34)], 't')
    g.outline()
    return [g.part(Z['mano'])]

def libro():
    g = Grid()
    g.rect(27, 30, 6, 9, 'F').rect(27, 30, 1, 9, 'f').rect(29, 32, 3, 2, 'A')
    g.outline()
    return [g.part(Z['mano'])]

def celular():
    g = Grid()
    g.rect(28, 31, 4, 7, 'B').rect(29, 32, 2, 5, 'I').put(29, 32, 'G')
    g.outline()
    return [g.part(Z['mano'])]

# ---------------------------------------------------------------- mascotas
def gato():
    g = Grid()
    g.rect(29, 48, 7, 6, 'B').rect(30, 54, 6, 4, 'B').rect(30, 46, 2, 2, 'B').rect(34, 46, 2, 2, 'B')
    g.rect(36, 52, 2, 2, 'B').rect(37, 49, 1, 3, 'B').rect(30, 58, 2, 1, 'B').rect(34, 58, 2, 1, 'B')
    g.outline()
    g.pts([(31, 50), (34, 50)], 'y').put(32, 52, 'Y')
    return [g.part(Z['mascota'])]

def osito():
    g = Grid()
    g.ellipse(33, 50, 4, 3.4, '1').rect(29, 54, 9, 5, '1').ellipse(30, 47, 1.4, 1.4, '1').ellipse(36, 47, 1.4, 1.4, '1')
    g.rect(28, 55, 2, 3, '2').rect(37, 55, 2, 3, '2').rect(30, 59, 3, 1, '2').rect(34, 59, 3, 1, '2')
    g.outline()
    g.rect(32, 51, 3, 2, '3').put(33, 51, 'k').pts([(31, 49), (35, 49)], 'k').rect(31, 55, 5, 3, '3')
    return [g.part(Z['mascota'])]

# ---------------------------------------------------------------- varios
def pulsera():
    g = Grid(); g.rect(8, 34, 3, 2, 'B').outline().pts([(8, 34), (10, 35)], 'g')
    return [g.part(Z['varios'])]

def scrunchie():
    g = Grid(); g.rect(25, 34, 3, 2, 'B').pts([(24, 34), (28, 35)], 'B').outline().put(26, 34, 'D')
    return [g.part(Z['varios'])]

def cadena():
    g = Grid()
    for (x, y) in [(20, 38), (21, 39), (21, 40), (22, 41), (22, 42), (21, 43), (20, 44), (21, 45), (22, 46)]:
        g.put(x, y, 'Z')
    g.pts([(21, 39), (22, 42), (21, 45)], 'z')
    return [g.part(Z['varios'])]

# ---------------------------------------------------------------- barbijos
def barbijo(c, sh):
    g = Grid()
    g.rect(13, 14, 10, 4, c).rect(14, 18, 8, 1, c).pts([(12, 13), (23, 13)], sh).rect(12, 14, 1, 1, sh).rect(23, 14, 1, 1, sh)
    g.pts([(14, 15), (21, 15), (15, 17), (20, 17)], sh)
    g.outline()
    return [g.part(Z['barbijo'])]

# ---------------------------------------------------------------- catálogo
# lvl = nivel que hay que terminar para desbloquear (0 = disponible desde el inicio)
CATS = [
  ('pelo', 'PELO', [
    ('largo',      'Largo ondulado', 0, hair_largo()),
    ('semi',       'Semirrecogido',  1, hair_semi()),
    ('carre',      'Carré',          2, hair_carre()),
    ('melena',     'Melena',         4, hair_melena()),
    ('colita',     'Colita',         5, hair_colita()),
    ('cortoNegro', 'Corto negro',    8, hair_corto_negro()),
  ]),
  ('gorros', 'SOMBREROS / GORRAS', [
    ('gorraBordo', 'Gorra bordó',    0, gorra('O', 'o')),
    ('gorraNegra', 'Gorra negra',    1, gorra('B', 'D')),
    ('lana',       'Gorro de lana',  3, gorro_lana()),
    ('rana',       'Gorro rana',     10, gorro_rana()),
    ('piluso',     'Piluso',         6, piluso()),
  ]),
  ('auriculares', 'AURICULARES', [
    ('negros',     'Negros',         0, auric('B', 'D')),
    ('blancos',    'Blancos',        2, auric('W', 'g')),
    ('inalambricos','Inalámbricos',  6, auric_inal()),
  ]),
  ('bufandas', 'BUFANDAS', [
    ('bordo',      'Bordó',          0, bufanda('O', 'o')),
    ('negra',      'Negra',          4, bufanda('B', 'D')),
    ('crema',      'Crema',          7, bufanda('C', 'c')),
  ]),
  ('gafas', 'GAFAS', [
    ('negras',     'Negras',         0, gafas('B')),
    ('redondas',   'Redondas',       3, gafas('A', True)),
    ('finas',      'Finas',          8, gafas_finas()),
  ]),
  ('collares', 'COLLARES', [
    ('plata',      'Plata',          0, collar('Z', 'z', 'aro')),
    ('corazon',    'Corazón',        2, collar('Z', 'z', 'corazon')),
    ('dorado',     'Dorado',         7, collar('A', 'a', 'gota')),
  ]),
  ('pins', 'PINS / PRENDEDORES', [
    ('estrella',   'Estrella',       0, pin('estrella')),
    ('corazon',    'Corazón',        1, pin('corazon')),
    ('rana',       'Rana',           5, pin('rana')),
    ('dado',       'Dado',           9, pin('dado')),
  ]),
  ('bolsos', 'MOCHILAS / BOLSOS', [
    ('mochila',    'Mochila',        0, mochila()),
    ('crema',      'Bolso crema',    5, bolso_crema()),
    ('bandolera',  'Bandolera',      9, bandolera()),
  ]),
  ('mano', 'ACCESORIOS MANO', [
    ('tea',        'Bubble tea',     0, bubble_tea()),
    ('libro',      'Libro',          4, libro()),
    ('celular',    'Celular',        7, celular()),
  ]),
  ('mascotas', 'ANIMALES / COMPAÑÍA', [
    ('gato',       'Gato',           3, gato()),
    ('oso',        'Osito',          9, osito()),
  ]),
  ('varios', 'VARIOS', [
    ('pulsera',    'Pulsera',        6, pulsera()),
    ('colitaPelo', 'Colita de pelo', 8, scrunchie()),
    ('cadena',     'Cadena',         0, cadena()),
  ]),
  ('barbijos', 'BARBIJOS', [
    ('negro',      'Negro',          4, barbijo('B', 'D')),
    ('blanco',     'Blanco',         8, barbijo('W', 'g')),
  ]),
]

# ---------------------------------------------------------------- personajes del tribunal
def judge():
    g = Grid(28, 30)
    g.ellipse(14, 7, 9, 7, 'w')                       # peluca
    for y in range(8, 22, 3):
        g.ellipse(5, y, 2.2, 1.8, 'w'); g.ellipse(23, y, 2.2, 1.8, 'w')
    g.rect(9, 6, 10, 10, 'S').rect(10, 16, 8, 1, 'S')
    g.rect(4, 19, 20, 11, 'B').rect(11, 19, 6, 3, 'W').rect(13, 22, 2, 4, 'W')
    g.outline()
    g.rect(9, 5, 10, 2, 'w').pts([(9, 7), (18, 7)], 'w')
    g.pts([(11, 10), (12, 10), (15, 10), (16, 10)], 'i')
    g.pts([(11, 11), (16, 11)], 'e').pts([(13, 14), (14, 14)], 's')
    g.pts([(6, 9), (22, 9), (6, 15), (22, 15), (14, 2), (10, 3), (18, 3)], 'i')
    return {'w': 28, 'h': 30, 'parts': [g.part(1)]}

def prosecutor():
    g = Grid(34, 32)
    g.rect(10, 3, 12, 6, 'N').rect(9, 6, 14, 5, 'N')       # pelo en punta
    for (x, y) in [(8, 4), (10, 1), (13, 0), (16, 1), (19, 0), (22, 2), (24, 5), (23, 9), (8, 9)]:
        g.rect(x, y, 2, 3, 'N')
    g.rect(11, 9, 10, 9, 'S').rect(12, 18, 8, 1, 'S')
    g.rect(14, 19, 4, 2, 's')
    g.rect(7, 21, 18, 11, 'B').rect(14, 21, 4, 4, 'W').rect(15, 22, 2, 8, 'X')
    g.rect(24, 17, 4, 5, 'B').rect(27, 13, 3, 5, 'B').rect(28, 9, 3, 4, 'S').rect(31, 9, 3, 2, 'S')   # brazo señalando
    g.outline()
    g.rect(11, 9, 10, 2, 'N').pts([(12, 11), (15, 11), (17, 11), (20, 11)], 'N')
    g.rect(13, 13, 2, 2, 'e').rect(18, 13, 2, 2, 'e').pts([(13, 12), (14, 12), (18, 12), (19, 12)], 'k')
    g.pts([(15, 16), (16, 16), (17, 16)], 'x').pts([(10, 6), (14, 4), (19, 3)], 'M')
    return {'w': 34, 'h': 32, 'parts': [g.part(1)]}

# ---------------------------------------------------------------- exportar
def main():
    base = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(base, '..', 'js', 'data', 'vestuario.js')
    cats = []
    for key, label, items in CATS:
        cats.append({'key': key, 'label': label, 'items': [
            {'key': k, 'name': n, 'lvl': lvl, 'parts': [p for p in parts if p]} for (k, n, lvl, parts) in items]})
    data = {
        'size': [W, H],
        'pal': PAL,
        'skinChars': ['S', 's'],
        'body': body(),
        'layers': Z,
        'categories': cats,
        'judge': judge(),
        'prosecutor': prosecutor(),
    }
    js = ('/* =========================================================\n'
          '   vestuario.js · Pixel-art del personaje, accesorios y tribunal\n'
          '   ARCHIVO GENERADO por tools/build_sprites.py (no editar a mano).\n'
          '   Categorías y prendas calcadas de la pantalla "¡VESTÍ A TU PERSONAJE!"\n'
          '   del prototipo. lvl = nivel que hay que terminar para desbloquear.\n'
          '   ========================================================= */\n'
          'window.DF = window.DF || {};\n'
          'DF.vestuario = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(js)
    n = sum(len(c['items']) for c in cats)
    print('OK', out_path, n, 'prendas')

if __name__ == '__main__':
    main()
