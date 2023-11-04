# more-jpeg

more-jpeg is a service designed to intentionally degrade the quality of JPEG images by introducing significant compression artifacts, turning them into ✨ works of _art_ ✨.

## Examples

|Original|10|5|0|
|--------|---|---|---|
|![hair](https://github.com/darmiel/more-jpeg/assets/71837281/04a92ba9-cb79-407c-a666-43c8720f2fc3)|![hair-low-10](https://github.com/darmiel/more-jpeg/assets/71837281/520659a6-a8b4-43bb-b4ad-36669448d671)|![hair-low-5](https://github.com/darmiel/more-jpeg/assets/71837281/ab3a41a0-55eb-40b6-904b-a421fe2c0ba8)|![hair-low-0](https://github.com/darmiel/more-jpeg/assets/71837281/67c71197-8a0a-4530-9abf-86886cea2a13)|

As you can see, JPEGs with quality `10`, `5` or even `0` look _way_ better than the original.

## Demo

Try it out here: https://jpeg.qwer.tz/ _(no uptime gurantee)_

# Contributing

## Creating new Recipes

> [!NOTE]
> Recipes determine the final export quality of the JPEGs.
> They also contain a list of "ingredients" that are applied **before** the export
> (such as inverting an image).
>
> If you want to contribute such new ingredients, please refer to the section [Creating new Ingredients](#creating-new-ingredients).

It is easy to add new recipes, simply append your recipe to the `recipes` object in [`frontend/src/util/recipe.tsx`](frontend/src/util/recipe.tsx).
You may use the **Export** button in the frontend to generate recipes.

You will need to specify the following attributes:

- `name` (string) - A name for your recipe
- `description` (string) - A description for your recipe
- `destroy_factor` (uint) - A rating from `0` (_no destruction_) to `100` (_much destruction_) how much the image is destroyed
- `quality` (uint) - The JPEG export quality from `0` (_compression artifcats' dream_) to `100` (_no compression artifacts_)
- `ingredients` (Ingredient[]) - A list of ingredients for the recipe
- `preview` (string) - Path to a preview (you should put it in the `frontend/public/examples` directory)

```typescript
{
    name: "Noise",
    description: "Adds a little bit of noise",
    destroy_factor: 15,
    quality: 95,
    ingredients: [{ 
        id: "exponential_noise", 
        with: { scale: 30 }
    }],
    preview: "/examples/noise.jpeg",
},
```

---

## Creating new Ingredients

To create a new ingredient (image operation), follow these steps:

### Backend

First, in [`recipe_actions.py`](recipe_actions.py) create a function with the name `action_<ingredient-identifier>` using this signature `(img: Image, options: dict) -> Image`

```python
def action_invert(img: Image, _: dict) -> Image:
    return ImageOps.invert(img)
```

Then add your ingredient to the `actions` dictionary in [`recipe_actions.py`](recipe_actions.py).

```python
"invert": {
    "executor": action_invert,
    # optional, if you have any parameters, specify them here by name + accepted types
    "options": {
        "scale": [float, int]
    }
},
```

### Frontend

In [`frontend/src/util/recipe.tsx`](frontend/src/util/recipe.tsx), include your ingredient within `ingredientMeta`.
You will need to specify the following attributes:

- `icon` (ReactNode) - see [react-icons](https://react-icons.github.io/react-icons/icons?name=fa6) for a list of available icons
- `description` (string)

If your ingredient accepts any parameters, also add:

- `param_info` (ParamInfo)

```tsx
invert: {
    icon: <FaFill />,
    description: "Reverses colors in the image",
    param_info: {
      scale: {
        // will be shown if you hover over the (i) in the ingredient options
        description: "Amount of xyz to add",
        // will be the default value when adding new ingredients
        default: 30,
      },
    },
},
```
