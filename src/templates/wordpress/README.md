# Wordpress Stacker Template

## Usage

A Stacker Template can be used in two ways:

### 1. Generate the stacker file with Stacker CLI

Run `stacker init` in your project's directory, then configure your options.

### 2. Create the stacker file manually

Create your `stacker.yaml` file in your project's directory.

Examples:

```
stack: wordpress
options:
  database: mariadb
```

```
stack: wordpress
options:
  database: mysql
  phpmyadmin: true
```

---

## Options

| name | description | value | default |
| ---- | ----------- | ----- | ------- |
| database | database type | string: `mysql, mariadb` | `mariadb`|
| phpmyadmin | include PHPMyAdmin | boolean | `false` |

---

## Ejectables

| name | description | service | remote file |
| ---- | ----------- | ------- | ----------- |
| `my.cnf` | MySQL/MariaDB config | `database` | `/etc/mysql/my.cnf` |
