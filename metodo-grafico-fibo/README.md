# Método gráfico con FIBO

Tres ejercicios con la barra FIBO, resueltos con el mismo procedimiento de la Clase 02
(Introducción al Método Gráfico): Paso 1 a Paso 4.

Los datos son **aproximados**: no tenemos las cifras reales de El Molino, así que se estimaron
con valores típicos de la industria de barras de proteína. Debajo de cada ejercicio está de dónde sale cada número.

Datos base de FIBO: barra de 65 g con 22 g de proteína, precio al público aprox. $43 (fibo.mx).
Unidad de producción: **caja de 12 barras**. Turno: 8 h, de las que 7 h (420 min) son efectivas
(se descuentan arranque, limpieza y comida).

Nota: los valores "x1" se representan en el eje X (horizontal) y los valores "x2" en el eje Y (vertical).
Condición de no negatividad: x1 ≥ 0, x2 ≥ 0 (solo primer cuadrante).

---

## Ejercicio 1: Producción de Chocolate y Cookies (2 restricciones)

### Datos aproximados

| Concepto | Chocolate | Cookies | Disponible por turno |
|---|---|---|---|
| Aislado de suero (kg por caja) | 0.30 | 0.25 | 90 kg |
| Tiempo de formado (min por caja) | 1 | 1.5 | 420 min |
| Utilidad (por caja) | $120 | $114 | |

De dónde salen:
- **Aislado de suero:** tiene alrededor de 90% de proteína. Para que la barra de Chocolate llegue a 22 g de proteína se necesitan unos 25 g de aislado por barra: 25 g × 12 = 300 g = **0.30 kg por caja**. La de Cookies lleva trozos de galleta y crispies proteicos que aportan parte de la proteína, así que usa menos aislado: unos 21 g por barra, que da **0.25 kg por caja**.
- **90 kg por turno:** el aislado llega en sacos de 20 kg; el almacén libera 4 sacos y medio por turno.
- **Tiempo de formado:** una línea semiautomática (mezclado, laminado y corte) saca unas 12 barras por minuto, o sea **1 caja por minuto**. Cookies lleva una capa de galleta extra y la línea va más lento: **1.5 min por caja**.
- **Utilidad:** la barra se vende a tiendas en unos $30 (el público paga ~$43) y cuesta producirla unos $20, así que deja ~$10 por barra: **$120 por caja**. Cookies tiene ingredientes más caros y deja ~$9.50 por barra: **$114 por caja**.

### Variables de decisión
- x1 = cajas de FIBO Chocolate a producir por turno
- x2 = cajas de FIBO Cookies a producir por turno

```
Maximizar:
    F.O.:   120x1 + 114x2
Sujeto a:
    R1:   0.30x1 + 0.25x2 ≤ 90     (kg de aislado de suero)
    R2:   1x1 + 1.5x2 ≤ 420        (minutos de formado)
```

**Paso 1: Crear un sistema de ecuaciones con igualdades**
```
R1:  0.30x1 + 0.25x2 ≤ 90    →   0.30x1 + 0.25x2 = 90
R2:  1x1 + 1.5x2 ≤ 420       →   1x1 + 1.5x2 = 420
```

**Paso 2: Encontrar valores X1 y X2 en ambas ecuaciones (eliminar X2 para encontrar X1 y viceversa)**
```
1)  0.30x1 = 90
    0.25x2 = 90

2)  1x1 = 420
    1.5x2 = 420
```

**Paso 3: Despejar ecuación y encontrar valor X1 y X2**
```
1)  0.30x1 = 90 → x1 = 90/0.30 = 300
    0.25x2 = 90 → x2 = 90/0.25 = 360

2)  1x1 = 420   → x1 = 420/1 = 420
    1.5x2 = 420 → x2 = 420/1.5 = 280
```

**Paso 4: Representar valores en gráfica (plano cartesiano)**
- R1 (azul): de x1 = 300 a x2 = 360
- R2 (rojo): de x1 = 420 a x2 = 280

![Ejercicio 1](ejercicio-1.png)

---

## Ejercicio 2: Producción de Brownie y Frutos rojos (3 restricciones)

### Datos aproximados

| Concepto | Brownie | Frutos rojos | Disponible por turno |
|---|---|---|---|
| Cobertura de chocolate (kg por caja) | 0.24 | 0.12 | 60 kg |
| Tiempo de mezclado y formado (min por caja) | 1 | 2 | 420 min |
| Tiempo de empacado (min por caja) | 1 | 1 | 330 min |
| Utilidad (por caja) | $120 | $102 | |

De dónde salen:
- **Cobertura de chocolate:** la de Brownie va bañada completa, unos 20 g por barra: 20 × 12 = **0.24 kg por caja**. La de Frutos rojos solo lleva base de chocolate, unos 10 g por barra: **0.12 kg por caja**. La temperadora de chocolate prepara **60 kg por turno**.
- **Mezclado y formado:** Brownie va a 1 caja por minuto. A Frutos rojos se le agrega fruta liofilizada con cuidado para no romperla, así que va a la mitad de velocidad: **2 min por caja**.
- **Empacado:** la empacadora flow-pack (envoltura individual) más el armado de la caja toma **1 min por caja** para cualquier sabor. Solo está libre **330 min** para FIBO porque el resto del turno empaca otros productos de El Molino y se hace cambio de formato.
- **Utilidad:** Brownie deja ~$10 por barra (**$120 por caja**). La fruta liofilizada es cara, así que Frutos rojos deja ~$8.50 por barra (**$102 por caja**).

### Variables de decisión
- x1 = cajas de FIBO Brownie a producir por turno
- x2 = cajas de FIBO Frutos rojos a producir por turno

```
Maximizar:
    F.O.:   120x1 + 102x2
Sujeto a:
    R1:   0.24x1 + 0.12x2 ≤ 60     (kg de cobertura de chocolate)
    R2:   1x1 + 2x2 ≤ 420          (minutos de mezclado y formado)
    R3:   1x1 + 1x2 ≤ 330          (minutos de empacado)
```

**Paso 1: Crear un sistema de ecuaciones con igualdades**
```
R1:  0.24x1 + 0.12x2 = 60
R2:  1x1 + 2x2 = 420
R3:  1x1 + 1x2 = 330
```

**Paso 2: Encontrar valores X1 y X2 en las ecuaciones (eliminar X2 para encontrar X1 y viceversa)**
```
R1:  0.24x1 = 60
     0.12x2 = 60

R2:  1x1 = 420
     2x2 = 420

R3:  1x1 = 330
     1x2 = 330
```

**Paso 3: Despejar ecuación y encontrar valor X1 y X2**
```
R1:  0.24x1 = 60 → x1 = 60/0.24 = 250
     0.12x2 = 60 → x2 = 60/0.12 = 500

R2:  1x1 = 420   → x1 = 420/1 = 420
     2x2 = 420   → x2 = 420/2 = 210

R3:  1x1 = 330   → x1 = 330/1 = 330
     1x2 = 330   → x2 = 330/1 = 330
```

**Paso 4: Representar valores en gráfica (plano cartesiano)**
- R1 (azul): de x1 = 250 a x2 = 500
- R2 (rojo): de x1 = 420 a x2 = 210
- R3 (amarillo): de x1 = 330 a x2 = 330

![Ejercicio 2](ejercicio-2.png)

---

## Ejercicio 3: Marketing de FIBO (2 restricciones)

### Datos aproximados (por mes)

| Concepto | Anuncios TikTok/IG | Sampling en universidades | Disponible al mes |
|---|---|---|---|
| Dinero (miles de pesos) | 1 | 1 | $60 mil |
| Horas del equipo (por cada mil invertido) | 2 | 4 | 160 h |
| Personas que prueban o compran (por cada mil) | 25 | 35 | |

De dónde salen:
- **Anuncios:** en TikTok/Instagram en México, mil impresiones cuestan unos $50, así que $1,000 dan ~20,000 impresiones. Si compra alrededor del 0.12%, son **~25 personas por cada mil pesos**.
- **Sampling:** con $1,000 se regalan ~35 barras (a ~$20 de costo cada una) y se cubre parte del promotor y el permiso del stand: **~35 personas por cada mil pesos**.
- **Presupuesto:** **$60 mil al mes** para una marca mediana.
- **Horas:** por cada mil en anuncios, unas 2 horas de crear contenido, pautar y contestar comentarios. Por cada mil en sampling, unas 4 horas de permisos con la universidad, traslado y montar el stand. Hay una persona de marketing dedicada a FIBO, **160 h al mes**.

### Variables de decisión
- x1 = miles de pesos invertidos en anuncios de TikTok/IG al mes
- x2 = miles de pesos invertidos en sampling en universidades al mes

```
Maximizar:
    F.O.:   25x1 + 35x2      (personas que prueban o compran FIBO)
Sujeto a:
    R1:   1x1 + 1x2 ≤ 60       (presupuesto, miles de pesos)
    R2:   2x1 + 4x2 ≤ 160      (horas del equipo)
```

**Paso 1: Crear un sistema de ecuaciones con igualdades**
```
R1:  1x1 + 1x2 = 60
R2:  2x1 + 4x2 = 160
```

**Paso 2: Encontrar valores X1 y X2 en ambas ecuaciones**
```
1)  1x1 = 60
    1x2 = 60

2)  2x1 = 160
    4x2 = 160
```

**Paso 3: Despejar ecuación y encontrar valor X1 y X2**
```
1)  1x1 = 60  → x1 = 60/1 = 60
    1x2 = 60  → x2 = 60/1 = 60

2)  2x1 = 160 → x1 = 160/2 = 80
    4x2 = 160 → x2 = 160/4 = 40
```

**Paso 4: Representar valores en gráfica (plano cartesiano)**
- R1 (azul): de x1 = 60 a x2 = 60
- R2 (rojo): de x1 = 80 a x2 = 40

![Ejercicio 3](ejercicio-3.png)
