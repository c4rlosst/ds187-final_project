-- Sample data for the nutrition cookbook. Run schema.sql first.
-- Safe to re-run: existing rows are skipped.
-- Nutrition values are approximate, per serving.

insert into public.ingredients (name) values
  ('asparagus'), ('avocado'), ('banana'), ('bell pepper'), ('black beans'),
  ('blueberries'), ('broccoli'), ('brown rice'), ('carrot'), ('celery'),
  ('chia seeds'), ('chicken breast'), ('chickpeas'), ('cilantro'),
  ('coconut milk'), ('corn tortilla'), ('cucumber'), ('cumin'), ('eggs'),
  ('feta'), ('garlic'), ('ginger'), ('greek yogurt'), ('ground turkey'),
  ('honey'), ('lemon'), ('lentils'), ('lime'), ('milk'), ('olive oil'),
  ('onion'), ('quinoa'), ('red onion'), ('rolled oats'), ('salmon'),
  ('soy sauce'), ('spinach'), ('strawberries'), ('sweet potato'), ('tofu'),
  ('tomato'), ('tuna'), ('zucchini')
on conflict (name) do nothing;

insert into public.recipes
  (title, description, prep_minutes, servings, calories, protein_g, carbs_g, fat_g, fiber_g, steps)
values
  ('Greek Yogurt Berry Bowl',
   'A quick high-protein breakfast with berries, oats and chia.',
   5, 1, 300, 21.0, 39.0, 5.0, 8.0,
   array[
     'Spoon the yogurt into a bowl.',
     'Top with the blueberries, strawberries, oats and chia seeds.',
     'Drizzle with honey and serve.'
   ]),
  ('Chicken Quinoa Power Bowl',
   'Lean chicken over quinoa with steamed broccoli and peppers.',
   25, 1, 430, 50.0, 31.0, 12.0, 6.0,
   array[
     'Cook the quinoa according to the package and keep it warm.',
     'Season the chicken and cook it in the olive oil until done, then slice.',
     'Steam the broccoli until just tender.',
     'Build the bowl with quinoa, chicken, broccoli and peppers, then finish with lemon juice.'
   ]),
  ('Lentil Vegetable Soup',
   'A fiber-rich, filling soup that keeps well for several days.',
   40, 4, 240, 14.0, 36.0, 4.0, 14.0,
   array[
     'Soften the onion, carrot and celery in the olive oil for 5 minutes.',
     'Add the garlic and cumin and stir for 30 seconds.',
     'Add the lentils, tomatoes and 4 cups of water, then simmer for 25 minutes.',
     'Stir in the spinach until wilted and season to taste.'
   ]),
  ('Baked Salmon with Asparagus',
   'Omega-3 rich salmon roasted on one tray with asparagus.',
   20, 1, 385, 33.0, 6.0, 25.0, 3.0,
   array[
     'Heat the oven to 200 C (400 F).',
     'Place the salmon and asparagus on a tray, then add the olive oil, garlic and lemon slices.',
     'Bake for 12 to 15 minutes until the salmon flakes easily.'
   ]),
  ('Veggie Egg Scramble',
   'Soft eggs with spinach, tomato and peppers.',
   10, 1, 285, 20.0, 8.0, 19.0, 2.0,
   array[
     'Soften the onion and pepper in the olive oil for 3 minutes.',
     'Add the tomato and spinach and cook until the spinach wilts.',
     'Pour in the beaten eggs and stir gently until just set.'
   ]),
  ('Chickpea Spinach Curry',
   'A creamy, plant-based curry served over brown rice.',
   35, 4, 335, 11.0, 58.0, 7.0, 9.0,
   array[
     'Cook the brown rice according to the package.',
     'Soften the onion, garlic and ginger, then stir in the cumin.',
     'Add the tomatoes, chickpeas and coconut milk and simmer for 15 minutes.',
     'Stir in the spinach and serve over the rice.'
   ]),
  ('Avocado Tuna Salad',
   'No-cook lunch with healthy fats and plenty of protein.',
   10, 1, 300, 29.0, 11.0, 16.0, 6.0,
   array[
     'Flake the tuna into a bowl.',
     'Add the diced avocado, cucumber and tomatoes.',
     'Dress with lemon juice and olive oil and toss gently.'
   ]),
  ('Sweet Potato and Black Bean Tacos',
   'Roasted sweet potato and black beans in warm corn tortillas (2 tacos per serving).',
   35, 2, 400, 13.0, 73.0, 8.0, 17.0,
   array[
     'Roast the cubed sweet potato at 220 C (425 F) for 25 minutes.',
     'Warm the black beans and the tortillas.',
     'Fill the tortillas with sweet potato, beans, avocado and onion.',
     'Finish with lime juice and cilantro.'
   ]),
  ('Overnight Oats',
   'Prepare the night before for an easy, fiber-rich breakfast.',
   5, 1, 360, 14.0, 60.0, 8.0, 10.0,
   array[
     'Stir the oats, milk, chia seeds and honey together in a jar.',
     'Refrigerate overnight.',
     'Top with sliced banana before eating.'
   ]),
  ('Tofu Veggie Stir-Fry',
   'Crisp vegetables and tofu in a simple ginger and garlic sauce.',
   25, 1, 355, 20.0, 43.0, 13.0, 8.0,
   array[
     'Brown the tofu cubes in the olive oil, then set aside.',
     'Stir-fry the broccoli, carrot and pepper for 4 minutes.',
     'Add the garlic, ginger, soy sauce and tofu and toss for 1 minute.',
     'Serve over the brown rice.'
   ]),
  ('Turkey Zucchini Meatballs',
   'Lean, moist meatballs baked and served in tomato sauce (about 4 meatballs per serving).',
   40, 4, 245, 25.0, 11.0, 11.0, 2.0,
   array[
     'Heat the oven to 200 C (400 F).',
     'Mix the turkey, zucchini, egg, oats, garlic and onion, then roll into balls.',
     'Bake for 20 minutes.',
     'Simmer the crushed tomatoes for 10 minutes and add the meatballs.'
   ]),
  ('Mediterranean Chickpea Salad',
   'A fresh, filling salad with feta and a lemon dressing.',
   10, 2, 335, 14.0, 41.0, 13.5, 11.0,
   array[
     'Combine the chickpeas, cucumber, tomato and red onion in a bowl.',
     'Whisk the olive oil with the lemon juice and pour over the salad.',
     'Top with the crumbled feta.'
   ])
on conflict (title) do nothing;

insert into public.recipe_ingredients (recipe_id, ingredient_id, quantity)
select r.id, i.id, v.quantity
from (values
  ('Greek Yogurt Berry Bowl', 'greek yogurt', '3/4 cup'),
  ('Greek Yogurt Berry Bowl', 'blueberries', '1/2 cup'),
  ('Greek Yogurt Berry Bowl', 'strawberries', '1/4 cup, sliced'),
  ('Greek Yogurt Berry Bowl', 'rolled oats', '2 tbsp'),
  ('Greek Yogurt Berry Bowl', 'honey', '1 tsp'),
  ('Greek Yogurt Berry Bowl', 'chia seeds', '1 tbsp'),

  ('Chicken Quinoa Power Bowl', 'chicken breast', '150 g, cooked'),
  ('Chicken Quinoa Power Bowl', 'quinoa', '1/2 cup, cooked'),
  ('Chicken Quinoa Power Bowl', 'broccoli', '1 cup, steamed'),
  ('Chicken Quinoa Power Bowl', 'bell pepper', '1/2, sliced'),
  ('Chicken Quinoa Power Bowl', 'olive oil', '1 tsp'),
  ('Chicken Quinoa Power Bowl', 'lemon', '1/2, juiced'),

  ('Lentil Vegetable Soup', 'lentils', '1 cup, dry'),
  ('Lentil Vegetable Soup', 'carrot', '2, diced'),
  ('Lentil Vegetable Soup', 'onion', '1, diced'),
  ('Lentil Vegetable Soup', 'celery', '2 stalks, diced'),
  ('Lentil Vegetable Soup', 'garlic', '3 cloves'),
  ('Lentil Vegetable Soup', 'tomato', '1 can (400 g), diced'),
  ('Lentil Vegetable Soup', 'spinach', '4 cups'),
  ('Lentil Vegetable Soup', 'olive oil', '1 tbsp'),
  ('Lentil Vegetable Soup', 'cumin', '1 tsp'),

  ('Baked Salmon with Asparagus', 'salmon', '150 g fillet'),
  ('Baked Salmon with Asparagus', 'asparagus', '1 cup, trimmed'),
  ('Baked Salmon with Asparagus', 'lemon', '1/2, sliced'),
  ('Baked Salmon with Asparagus', 'olive oil', '1 tsp'),
  ('Baked Salmon with Asparagus', 'garlic', '1 clove, minced'),

  ('Veggie Egg Scramble', 'eggs', '3'),
  ('Veggie Egg Scramble', 'spinach', '1 cup'),
  ('Veggie Egg Scramble', 'tomato', '1/2, diced'),
  ('Veggie Egg Scramble', 'bell pepper', '1/4, diced'),
  ('Veggie Egg Scramble', 'onion', '2 tbsp, diced'),
  ('Veggie Egg Scramble', 'olive oil', '1 tsp'),

  ('Chickpea Spinach Curry', 'chickpeas', '1 can (400 g), drained'),
  ('Chickpea Spinach Curry', 'spinach', '4 cups'),
  ('Chickpea Spinach Curry', 'tomato', '1 can (400 g), diced'),
  ('Chickpea Spinach Curry', 'onion', '1, diced'),
  ('Chickpea Spinach Curry', 'garlic', '3 cloves'),
  ('Chickpea Spinach Curry', 'ginger', '1 tbsp, grated'),
  ('Chickpea Spinach Curry', 'coconut milk', '1 cup, light'),
  ('Chickpea Spinach Curry', 'cumin', '2 tsp'),
  ('Chickpea Spinach Curry', 'brown rice', '3 cups, cooked, to serve'),

  ('Avocado Tuna Salad', 'tuna', '1 can (140 g), drained'),
  ('Avocado Tuna Salad', 'avocado', '1/2'),
  ('Avocado Tuna Salad', 'cucumber', '1/2 cup, diced'),
  ('Avocado Tuna Salad', 'tomato', '1/2 cup cherry, halved'),
  ('Avocado Tuna Salad', 'lemon', '1/2, juiced'),
  ('Avocado Tuna Salad', 'olive oil', '1 tsp'),

  ('Sweet Potato and Black Bean Tacos', 'sweet potato', '2 medium, cubed'),
  ('Sweet Potato and Black Bean Tacos', 'black beans', '1 cup, cooked'),
  ('Sweet Potato and Black Bean Tacos', 'corn tortilla', '4'),
  ('Sweet Potato and Black Bean Tacos', 'avocado', '1/2, sliced'),
  ('Sweet Potato and Black Bean Tacos', 'lime', '1, juiced'),
  ('Sweet Potato and Black Bean Tacos', 'onion', '1/4 cup, diced'),
  ('Sweet Potato and Black Bean Tacos', 'cilantro', '1/4 cup, chopped'),

  ('Overnight Oats', 'rolled oats', '1/2 cup'),
  ('Overnight Oats', 'milk', '3/4 cup'),
  ('Overnight Oats', 'chia seeds', '1 tbsp'),
  ('Overnight Oats', 'banana', '1/2, sliced'),
  ('Overnight Oats', 'honey', '1 tsp'),

  ('Tofu Veggie Stir-Fry', 'tofu', '125 g, firm, cubed'),
  ('Tofu Veggie Stir-Fry', 'broccoli', '1 cup, florets'),
  ('Tofu Veggie Stir-Fry', 'carrot', '1/2 cup, sliced'),
  ('Tofu Veggie Stir-Fry', 'bell pepper', '1/2, sliced'),
  ('Tofu Veggie Stir-Fry', 'garlic', '1 clove'),
  ('Tofu Veggie Stir-Fry', 'ginger', '1 tsp, grated'),
  ('Tofu Veggie Stir-Fry', 'soy sauce', '1 tbsp'),
  ('Tofu Veggie Stir-Fry', 'brown rice', '1/2 cup, cooked'),
  ('Tofu Veggie Stir-Fry', 'olive oil', '1 tsp'),

  ('Turkey Zucchini Meatballs', 'ground turkey', '450 g (93% lean)'),
  ('Turkey Zucchini Meatballs', 'zucchini', '1 medium, grated and squeezed'),
  ('Turkey Zucchini Meatballs', 'eggs', '1'),
  ('Turkey Zucchini Meatballs', 'rolled oats', '1/4 cup'),
  ('Turkey Zucchini Meatballs', 'garlic', '2 cloves'),
  ('Turkey Zucchini Meatballs', 'onion', '1/2, grated'),
  ('Turkey Zucchini Meatballs', 'tomato', '1 can (400 g), crushed, for sauce'),

  ('Mediterranean Chickpea Salad', 'chickpeas', '1 can (400 g), drained'),
  ('Mediterranean Chickpea Salad', 'cucumber', '1 cup, diced'),
  ('Mediterranean Chickpea Salad', 'tomato', '1 cup, chopped'),
  ('Mediterranean Chickpea Salad', 'red onion', '1/4 cup, sliced'),
  ('Mediterranean Chickpea Salad', 'feta', '1/4 cup, crumbled'),
  ('Mediterranean Chickpea Salad', 'olive oil', '1 tbsp'),
  ('Mediterranean Chickpea Salad', 'lemon', '1, juiced')
) as v (title, ingredient, quantity)
join public.recipes r on r.title = v.title
join public.ingredients i on i.name = v.ingredient
on conflict (recipe_id, ingredient_id) do nothing;

-- Sample places so the map is not empty. These are made-up entries, not real
-- businesses. Remove them any time with:
--   delete from public.places where name like 'Sample %';
insert into public.places (name, category, description, lat, lng)
select v.name, v.category, 'Sample entry for testing. Safe to delete.', v.lat, v.lng
from (values
  ('Sample Farmers Market', 'market', 14.6040, 120.9822),
  ('Sample Salad Bar', 'restaurant', 14.5890, 120.9780),
  ('Sample Health Food Store', 'grocery', 14.6130, 120.9950),
  ('Sample Juice Cafe', 'cafe', 14.5800, 120.9900)
) as v (name, category, lat, lng)
where not exists (select 1 from public.places p where p.name = v.name);
