<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="img/pica.png" width="120">
  <img src="img/squirtle.png" width="120">
  <img src="img/bulbasaur.png" width="120">
  <img src="img/Jigglypuff.png" width="120">
  <img src="img/Furret.webp" width="120">
  <img src="img/togepi.webp" width="120">
</div>

# Sliding Puzzle 🧩
Sliding puzzle game with AI solver.
Click on a tile to slide it.
The solver uses A*  search algorithm.

[Play the Sliding Puzzle](https://odimos.github.io/sliding-puzzle-solver/)

## A* Search
Evaluation function: f(n) = g(n) + h(n)
- g(n): number of moves made so far
- h(n): sum of the horizontal and vertical distances of each tile from its goal position
  (Manhattan distance)

## Technologies
HTML, CSS, Javascript
