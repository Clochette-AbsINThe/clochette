import sys

if sys.version_info < (3, 11):
    from pip._vendor import tomli as tomllib  # pragma: no cover
else:
    import tomllib  # pragma: no cover


def get_version():
    with open("pyproject.toml", "rb") as f:
        return tomllib.load(f)["tool"]["poetry"]["version"]
