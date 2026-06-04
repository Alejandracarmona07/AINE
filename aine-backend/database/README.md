# Base de datos AINÉ (XAMPP)

## Requisitos

1. Inicia **Apache** y **MySQL** desde el panel de control de XAMPP.
2. Asegúrate de que MySQL escucha en el puerto `3306`.

## Crear la base de datos

Desde la raíz del backend:

```bash
/c/xampp/mysql/bin/mysql -u root < database/schema.sql
/c/xampp/mysql/bin/mysql -u root < database/seed.sql
```

O en **phpMyAdmin** (`http://localhost/phpmyadmin`):

1. Importar `schema.sql`
2. Importar `seed.sql`

## Configuración del backend

```bash
cp .env.example .env
```

Variables para XAMPP por defecto:

| Variable | Valor típico |
|----------|----------------|
| `MYSQL_ADDON_HOST` | `127.0.0.1` |
| `MYSQL_ADDON_USER` | `root` |
| `MYSQL_ADDON_PASSWORD` | *(vacío)* |
| `MYSQL_ADDON_DB` | `aine_db` |

## Verificar

```bash
npm start
curl http://localhost:3001/health
curl http://localhost:3001/api/productos
```

## Clever Cloud MySQL

Addon en la [consola de Clever Cloud](https://console.clever-cloud.com/).

1. En el addon MySQL, copia las variables `MYSQL_ADDON_*` (pestaña **Environment variables** o **Información**).
2. Configura el backend:

```bash
cp .env.clevercloud.example .env
# Pega host, user, password y database desde la consola
```

3. Crea tablas y datos en la nube:

```bash
npm run db:clevercloud
```

> Clever Cloud ya provee la base de datos; no uses `CREATE DATABASE`. Los scripts `schema.clevercloud.sql` y `seed.clevercloud.sql` están pensados para eso.

4. Al desplegar el backend en Clever Cloud, vincula el addon MySQL a la aplicación: las variables se inyectan solas.

## Modelo relacional

```
usuarios ──< pedidos ──< pedido_items >── productos >── categorias
cursos (independiente)
```
