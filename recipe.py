import json
from typing import Optional
from PIL.Image import Image

from recipe_actions import actions


class Ingredient:
    def __init__(self, identifier: str, options: dict):
        self.identifier = identifier
        self.options = options


def parse_ingredients(ingredient_json: str) -> Optional[list[Ingredient]]:
    parsed = json.loads(ingredient_json)
    if not isinstance(parsed, list):
        return None

    out_ingredients: list[Ingredient] = []
    for raw_ingredient in parsed:
        if type(raw_ingredient) != dict:
            return None
        dict_ingredient: dict = raw_ingredient
        if "id" not in dict_ingredient:
            return None
        identifier = dict_ingredient.get('id')
        if type(identifier) != str:
            return None
        options = dict_ingredient.get('with', {})
        if type(options) != dict:
            return None
        out_ingredients.append(Ingredient(identifier, options))

    return out_ingredients


def run_action(action_identifier: str, options: dict, img: Image) -> Image:
    if (action := actions.get(action_identifier)) is None:
        raise ValueError(f"unknown action: '{action_identifier}'")
    if (executor := action.get("executor")) is None:
        raise NotImplementedError(f"[{action_identifier}] action has no executor implemented")
    # if action has parameters, verify
    if (action_options := action.get("options")) is None:
        if options is not None and len(options.keys()) > 0:
            raise SyntaxError(f"[{action_identifier}] action does not accept any parameters")
    else:
        if options is None:
            raise SyntaxError(f"[{action_identifier}] action expects parameters")
        for param_name, param_type in action_options.items():
            if param_name not in options:
                raise SyntaxError(f"[{action_identifier}] parameter '{param_name}' expected")
            if isinstance(param_type, list):
                if not any(isinstance(options[param_name], z) for z in param_type):
                    raise SyntaxError(f"[{action_identifier}] parameter '{param_name}' of types [{param_type}] expected")
            else:
                if not isinstance(options[param_name], param_type):
                    raise SyntaxError(f"[{action_identifier}] parameter '{param_name}' of type {param_type} expected")
    return executor(img, options)
