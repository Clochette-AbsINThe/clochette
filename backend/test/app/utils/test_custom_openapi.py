from app.utils.custom_openapi import replace_schema_names


def test_replace_schema_names():
    input_data = {
        "app__schemas__user__id": 1,
        "app__schemas__v2__user__id": 2,
        "app__schemas__v2__product__name": "Product 1",
        "app__schemas__order__items": [
            {
                "app__schemas__v2__product__name": "Product 2",
                "app__schemas__v2__product__price": 10.0,
            },
            {
                "app__schemas__product__name": "Product 3",
                "app__schemas__product__price": 20.0,
            },
        ],
    }

    expected_output = {
        "idV1": 1,
        "id": 2,
        "name": "Product 1",
        "itemsV1": [
            {
                "name": "Product 2",
                "price": 10.0,
            },
            {
                "nameV1": "Product 3",
                "priceV1": 20.0,
            },
        ],
    }

    assert replace_schema_names(input_data) == expected_output
