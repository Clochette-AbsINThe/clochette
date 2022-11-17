from devtools import pprint


def alert_to_terminal(exception: Exception, **request: dict) -> None:
    print("### An exception has been raised! ###")
    print("############## Request ##############")
    pprint(request)
    print("############# Exception #############")
    pprint(exception)