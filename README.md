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

## Maps, Quests, and Zones

All map, quest, and zone documentation is in **[map/main/README.md](map/main/README.md)**.
