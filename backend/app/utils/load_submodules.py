import importlib
import pkgutil
from types import ModuleType


def load_submodules(parent_module: ModuleType) -> list[ModuleType]:
    """Load all submodules of a given module."""
    submodules: list[ModuleType] = []
    for _, submodule_name, _ in pkgutil.iter_modules(parent_module.__path__):
        submodule_path = f"{parent_module.__name__}.{submodule_name}"
        submodule = importlib.import_module(submodule_path)
        submodules.append(submodule)
    return submodules
