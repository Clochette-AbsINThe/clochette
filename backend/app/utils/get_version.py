import tomllib


def get_version():
    with open("pyproject.toml", "rb") as f:
        return tomllib.load(f)["tool"]["poetry"]["version"]
