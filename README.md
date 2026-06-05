# CatchChallenger Datapack

This is an example datapack for the game [CatchChallenger](http://catchchallenger.herman-brule.com/). A datapack defines all game content: monsters, items, maps, quests, skills, crafting, plants, and player configuration.

All XML definitions support localization via the `lang` attribute (e.g., `<name lang="fr">...</name>`). The version without `lang` is the default (English).

Items and monsters can be referenced by **name or numeric ID** (case-insensitive). Names are internally converted to IDs at load time with no performance difference.

## Directory Structure

```
informations.xml          # Datapack metadata (authors, name, description)
player/
    start.xml             # Starting profiles (spawn point, starter monsters, items, cash)
    reputation.xml        # Reputation types and level thresholds
    event.xml             # Game events (e.g., day/night cycle)
monsters/
    monster.xml           # All monster species definitions
    type.xml              # Element types and damage multipliers
    skill/
        skill.xml         # Skill/attack definitions
    buff/
        buff.xml          # Buff/status effect definitions
    <id>/                 # Per-monster assets (sprites: front.png, back.png)
    skill-animation/      # Skill visual effect sprites
items/
    items.xml             # General items (traps, potions, repels, equipment)
    berries.xml           # Berry/plant harvest items
    quest.xml             # Quest-specific items
    recipe.xml            # Recipe scroll items
    industries.xml        # Industry raw materials and products
    <category>/           # Item image assets (catchtrap/, potion/, other/, etc.)
crafting/
    recipes.xml           # Crafting recipe definitions
plants/
    plants.xml            # Plant growth definitions
    <id>.png              # Plant stage sprites
map/
    layers.xml            # Terrain layer definitions (grass, water, lava, cave encounters)
    music.xml             # Default music per map type
    visualcategory.xml    # Visual effects per map type (night overlay, cave darkness)
    tileset/              # Shared tilesets (.tsx + .png)
    fight/                # Fight background images per terrain type
    main/                 # Map datapacks (see map/main/README.md)
music/                    # Audio files (.opus)
skin/
    bot/                  # NPC sprite sheets (one folder per skin name)
    fighter/              # Player and trainer sprite sheets
```

## Key Files

### `informations.xml` — Datapack Metadata

```xml
<informations>
    <author pseudo="username" email="email" name="Full Name"/>
    <name>Datapack display name</name>
    <description>Datapack description</description>
</informations>
```

### `player/start.xml` — Starting Profiles

Defines what the player begins with: spawn location, starter monster choices, starting cash and items.

```xml
<profile>
    <start id="Normal">
        <name>Starter</name>
        <description>You start a normal game as player</description>
        <forcedskin value="player;girlplayer"/>
        <cash value="500"/>
        <monstergroup>
            <monster id="60" level="5" captured_with="1"/>
        </monstergroup>
        <item quantity="5" id="1"/>
        <reputation type="nation" level="1"/>
    </start>
</profile>
```

Multiple `<monstergroup>` entries let the player choose a starter monster.

### `player/reputation.xml` — Reputation System

Defines reputation types (e.g., crafting, nation) with named levels at point thresholds. Points can be negative.

### `player/event.xml` — Game Events

Defines event variables with possible values (e.g., `day` event with values `day` and `night`). Used by maps and encounter layers to vary behavior.

### `monsters/monster.xml` — Monster Definitions

Each `<monster>` has stats, type, attacks learned by level, evolutions, drops, and localized name/description.

| Attribute | Description |
|---|---|
| `id` | Unique numeric ID |
| `type` | Element type (references `type.xml`) |
| `hp`, `attack`, `defense`, `special_attack`, `special_defense`, `speed` | Base stats |
| `catch_rate` | Capture difficulty (0 = uncatchable) |
| `ratio_gender` | Gender ratio (0% = male only, 100% = female only, -1 = genderless) |
| `give_xp` | XP granted when defeated |

Sub-elements: `<attack_list>` (learnable skills), `<evolutions>` (level/item/trade), `<drops>` (item drops with luck%).

### `monsters/type.xml` — Element Type Chart

Defines element types and damage multipliers between them.

```xml
<type name="fire" color="#f38233">
    <name>Fire</name>
    <multiplicator number="2" to="plant;ice"/>      <!-- super effective -->
    <multiplicator number="0.5" to="water;fire"/>    <!-- not very effective -->
</type>
```

Multiplier values: `2` (super effective), `0.5` (not very effective), `0` (immune).

### `monsters/skill/skill.xml` — Skill Definitions

Each skill has a type, category (Physical/Special), and leveled effects.

| Attribute | Description |
|---|---|
| `applyOn` | Target: `aloneEnemy`, `themself`, `allEnemy`, `allAlly` |
| `endurance` | Uses before the skill is exhausted |
| `success` | Hit chance percentage |

### `items/items.xml` — Item Definitions

Each item has an `id`, `price`, `image`, localized name/description, and a functional sub-element:

| Sub-element | Usage |
|---|---|
| `<trap bonus_rate="X"/>` | Capture trap with catch rate bonus |
| `<hp add="X"/>` | Healing potion (`"all"` for full heal) |
| `<repel step="X"/>` | Monster repellent for X steps |
| `<buff remove="X"/>` | Remove buff by ID (`"all"` for all) |

Items split across multiple files by category: `items.xml` (general), `berries.xml` (plant harvests), `quest.xml` (quest items, price=0), `recipe.xml` (recipe scrolls), `industries.xml` (raw materials and crafted goods).

### `crafting/recipes.xml` — Crafting Recipes

```xml
<recipe itemToLearn="3001" doItemId="9" id="1">
    <material itemId="1004" quantity="1"/>
</recipe>
```

| Attribute | Description |
|---|---|
| `itemToLearn` | Recipe scroll item ID the player must own to unlock |
| `doItemId` | Resulting crafted item ID |
| `<material>` | Required input items and quantities |

### `plants/plants.xml` — Plant Growth

```xml
<plant id="1" itemUsed="1001">
    <grow><fruits>72</fruits></grow>
    <quantity>1.5</quantity>
</plant>
```

| Attribute | Description |
|---|---|
| `itemUsed` | Berry item ID used as seed |
| `<fruits>` | Time in minutes to fully grow |
| `<quantity>` | Harvest amount (decimal part = % chance of bonus) |

Optional growth stages: `<sprouted>`, `<taller>`, `<flowering>` (default to 1/4, 2/4, 3/4 of fruits time).

### `map/layers.xml` — Encounter Layers

Defines which tile layers trigger monster encounters, what items are required (e.g., surfboard for water), and terrain-specific backgrounds. Events can change encounter types (e.g., night variants).

### `map/music.xml` — Default Music

Maps default background music per map type (`city`, `indoor`, `outdoor`). Individual maps can override via `backgroundsound` attribute.

### `map/visualcategory.xml` — Visual Effects

Defines per-map-type visual overlays (e.g., cave darkness with color/alpha, night tint on outdoor/city maps triggered by day/night event).

## Map Layer Conventions

Maps are Tiled `.tmx` files with named tile layers the engine consumes: `Walkable`
(base graphics), `Collisions` (any non-empty tile blocks on-foot movement),
`Grass`/`Water`/`Lava` (encounter layers — see `layers.xml`),
`LedgesUp`/`LedgesDown`/`LedgesLeft`/`LedgesRight` (one-way jumps) and `WalkBehind`
(tiles drawn above the player). Object groups carry warps (`door`,
`teleport on push`, `teleport on it`), map borders (`border-*`) and NPCs (`bot`).

Conventions:

- **A ROM converter writes ONLY inside its per-ROM output folder
  `map/main/<label>/`.** It must NEVER create or modify any file outside it — in
  particular the shared `map/invisible.png` / `map/invisible.tsx`, the engine's
  marker tileset for stuff that is invisible in the Tiled editor because the game
  adds it at runtime (teleporters, bots, …), referenced **read-only**. Every map
  TILE must be a REAL tile extracted from the ROM, in a tileset LOCAL under
  `map/main/<label>/tileset/`. Do NOT generate/synthesise marker tiles.
- **Do NOT trust the tile-layer ORDER or grouping** in a `.tmx` — CatchChallenger
  finds layers by name and rebuilds the layer list at load, inconsistently
  (sometimes re-orders, sometimes not; sometimes inserts/groups, sometimes not).
  In `client/libqtcatchchallenger/maprender/` (`layerChangeLevelAndTagsChange` +
  `MapItem::addMap`) it deletes hidden/unknown layers, inserts the player object
  group before `WalkBehind` (else after `Collisions`, else appended), moves the
  `Moving` group, and inserts new object-group layers beside any tile layer with
  animated/random/trigger tiles. The on-disk order/grouping is non-authoritative;
  maps must be correct regardless — never depend on draw order or on layers
  staying separate/together.
- **Feature tile layers use REAL tiles, DISJOINT (no markers).** Each cell's real
  tile goes to EXACTLY ONE layer by behaviour — `Water`→Water, `Ledge*`→that ledge
  layer, `Grass`→Grass, else collidable→`Collisions`, else `Walkable`. The ground
  layers never overlap, so hiding any single layer produces a visible change (see
  `map/main/test/city.tmx`). `Walkable` is empty at water/grass/ledge/collision
  cells; the engine still makes them passable (water/grass/lava via the layer's
  `walkOn` `monstersCollision` in `layers.xml`, ledges one-way, collisions block).
- **`WalkBehind` (above the player) is ONLY for player-reachable cells.** A
  collidable cell's over-tile is never walked behind, so it stays BELOW the player,
  superposed on a SECOND layer named `Collisions`. The engine OR-merges every
  `Collisions` layer for blocking, so extra same-named layers are free visual
  superposition (stack a wall's under + over tile), not tiles above the player.
  Multiple identically-named layers = logically OR-merged, visually stacked.
- **`.tmx` maps reference `.tsx` tilesets by relative path only** (never
  absolute), computed relative to the map's own directory.
- **Water** tiles go in the `Water` layer only (not `Collisions`); `layers.xml`
  surf-gates the Water layer, which is what stops on-foot walking there.
- **Object markers use the shared `map/invisible.tsx`** (objects are not tile
  layers, so a transparent marker is fine): tile **0** = `bot`, **1** = `rescue`,
  **2** = `teleport on push`/`teleport on it`, **3** = `border-*` offset.
- **A `door` object must reference a real, animated tile** (a tileset tile with
  an `animation="<ms>ms;<n>frames"` property, `n>1`) — the client deletes a door
  whose tile has no animation. (`teleport on *` warps do not animate.)
- **`border-*` objects are centred on their edge**; the engine reads the object's
  position as the neighbour-alignment offset (`border.top` → object x,
  `border.left` → object y), so only that offset needs to be correct.

### Tileset Conventions

- **HARD RULE — a tileset must preserve the maps' *immediate* 2-D tile
  adjacency.** A generated / de-duplicated tileset is laid out following the
  maps' own spatial layout. For any pair of tiles, if across *all* the maps the
  relationship is *always* the same, that *same immediate* relationship must be
  kept in the tileset:
  - if a tile is *always* **just above** another (same column, the cell directly
    on top) → place it **just above** it in the tileset;
  - if a tile is *always* **just below** another (same column, the cell directly
    underneath) → place it **just below** it;
  - if a tile is *always* **just to the left** of another (same row, the next
    cell to the left) → place it **just to the left**;
  - if a tile is *always* **just to the right** of another (same row, the next
    cell to the right) → place it **just to the right**.

  So a building's (or any object's) tiles keep their exact on-map shape and the
  sheet reads like the map. Leaving blank (transparent) cells between groups to
  keep each group's 2-D shape is fine. This applies to **every visible tile** —
  the `WalkBehind` (over) tiles a player sees on top (building/tree tops) are laid
  out by the same 2-D adjacency as the ground tiles, not dumped in arbitrary
  order; layer membership is irrelevant, only what is seen on the map.

  A **post-generation guard** verifies this: for every tile it derives the map
  position(s) and checks that each *consistent* immediate neighbour (the same
  tile to the right / left / above / below on every map) is kept immediately
  adjacent in the sheet. The single unavoidable exception is a **cyclic map
  pattern** — a repeating texture (fence, brick, water: `…A B A B…`, or a longer
  `A B C A` loop) where a tile is its own neighbour around a loop. A loop cannot
  be flattened into a finite de-duplicated grid, so exactly one closing edge per
  loop is reported as an *unavoidable cyclic-pattern edge* — that is expected,
  not a defect. Every non-cyclic (linearisable) adjacency must be preserved.

  **De-duplication is preserved — no tile graphic is needlessly repeated.** Each
  distinct 16×16 graphic is stored once; tiles whose on-map neighbour is *always*
  the same are packed as rigid 2-D blocks (so a building reads like the map), and
  identical blocks recurring across maps collapse to a single copy. A generator
  must not emit one cell per neighbourhood (that multiplies the sheet count for
  no visual gain), and must wipe its previous output before regenerating so stale
  sheets no map references don't accumulate.

  **HARD RULE — no duplicate tile across a pool's sheets.** Within a tileset pool
  (the set of `.tsx`/`.png` sheets a map references), a non-animation tile
  graphic must appear **exactly once** — never twice in a sheet, never spread
  across two sheets. A **post-generation guard** re-reads the produced sheets and
  fails the build if any non-animation graphic repeats. *Animation frames are the
  only exception:* a door's closed frame, or a water frame, legitimately equals a
  static Walkable tile, and an N-frame run must stay contiguous, so those cells
  are exempt from the guard.

## Maps, Quests, and Zones

All map, quest, and zone documentation is in **[map/main/README.md](map/main/README.md)**.
