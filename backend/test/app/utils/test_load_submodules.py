from types import ModuleType
from unittest.mock import MagicMock, patch

from app.utils.load_submodules import load_submodules


def test_load_submodules():
    parent_module = MagicMock(spec=ModuleType)
    parent_module.__name__ = "parent_module"
    parent_module.__path__ = ["path/to/parent_module"]

    mock_submodule1 = MagicMock(spec=ModuleType)
    mock_submodule2 = MagicMock(spec=ModuleType)

    mock_iter_modules = MagicMock()
    mock_iter_modules.return_value = [
        ("path/to/parent_module/submodule1", "submodule1", True),
        ("path/to/parent_module/submodule2", "submodule2", True),
    ]

    mock_import_module = MagicMock()
    mock_import_module.side_effect = [mock_submodule1, mock_submodule2]

    with patch("app.utils.load_submodules.pkgutil.iter_modules", mock_iter_modules):
        with patch("app.utils.load_submodules.importlib.import_module", mock_import_module):
            submodules = load_submodules(parent_module)

    assert submodules == [mock_submodule1, mock_submodule2]
    mock_iter_modules.assert_called_once_with(parent_module.__path__)
    mock_import_module.assert_any_call("parent_module.submodule1")
    mock_import_module.assert_any_call("parent_module.submodule2")
