import argparse
import asyncio
import logging
import sys

from app.commands.init_db import init_db
from app.commands.migrate_db import migrate_db
from app.commands.reset_db import reset_db
from app.db.pre_start import pre_start
from app.dependencies import get_db
from app.utils.logger import setup_logs

logger = logging.getLogger("app.command")

parser = argparse.ArgumentParser(
    description=r"""
    Commands to manage the application.
    Run `python app/command.py <command> --help` for more information on a command.
    """,
    prog="python app/command.py",
    allow_abbrev=False,
    exit_on_error=True,
)
subparsers = parser.add_subparsers(help="sub-command help")

reset_parser = subparsers.add_parser(
    "reset",
    help="Reset database",
)

init_parser = subparsers.add_parser(
    "init",
    help="Initialize database",
)
init_parser.add_argument(
    "-y",
    "--yes",
    action="store_true",
    help="Bypass prompt",
    default=False,
)
init_parser.add_argument(
    "--bypass-revision",
    action="store_true",
    help="Bypass revision",
    default=False,
)

migrate_parser = subparsers.add_parser(
    "migrate",
    help="Migrate database",
)
migrate_parser.add_argument(
    "--bypass-revision",
    action="store_true",
    help="Bypass revision",
    default=False,
)
migrate_parser.add_argument(
    "-f",
    "--force",
    action="store_true",
    help="Force migration",
    default=False,
)

PROMPT_MESSAGE = (
    "Are you sure you want to reset the database, this will delete all data? [y/N] "
)


async def main(command: str) -> None:
    logger.info(f"Running command: {command}")
    args = parser.parse_args()

    get_db.setup()
    await pre_start()

    match command:
        case "reset":
            await reset_db()
        case "init":
            if args.yes or input(PROMPT_MESSAGE).lower() == "y":
                await reset_db()
                await migrate_db(bypass_revision=args.bypass_revision)
                await init_db()
            else:
                logger.info("Aborted")
        case "migrate":
            await migrate_db(bypass_revision=args.bypass_revision, force=args.force)


if __name__ == "__main__":  # pragma: no cover
    if len(sys.argv) == 1:
        parser.print_help()
        sys.exit(1)

    setup_logs("app", silent=True, level=logging.INFO)
    asyncio.run(main(sys.argv[1]))
