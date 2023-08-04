# Generic single-database configuration.

To add a revision:

```
alembic revision --autogenerate -m 'Explanation of modifications'
```

To migrate:

```
alembic upgrade head
```
