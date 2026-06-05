# CatchChallenger Main Datapack - Map Guideline

> **Note:** The `official/` subdirectory is outdated and buggy. Use `test/` as the reference implementation.

## Main Datapacks, Regions & Sub-Datapacks

`map/main/` is **not** a single map set — it holds several **independent main
datapacks**, one per folder, each a self-contained world (the hand-made `test/`
reference here, or larger worlds added by a site). The player picks which one to
play:

| Folder | `<name>` | `<initial>` | Contents |
|---|---|---|---|
| `test/` | Test map | T | Hand-made reference (the rest of this guide) |
| `<label>/` | (display name) | (1 letter) | A full world — one or more regions of maps, with its own tilesets, zones, music and quests |

Each `map/main/<label>/` carries its **own** `informations.xml`, `start.xml`,
`tileset/`, `zone/`, and optional `music/` + `quests/`, plus its region trees.
Nothing is shared between datapacks **except** the engine's read-only
`map/invisible.tsx` marker tileset (objects/triggers). A datapack's tileset pool
lives only in `map/main/<label>/tileset/`.

### Region → Location → Map hierarchy

Real datapacks add two folder levels the flat `test/` layout omits. Maps live at:

```
map/main/<label>/<region>/<location>/<mapname>.tmx (+ .xml)
```

- **Region** — a world area (a continent, an island group …): `<region>/`, e.g.
  `mainland/`, `north-isles/`.
- **Location** — a town / road / cave folder, named after its overworld map.
  The overworld map repeats the folder name (`mainland/harbor-town/harbor-town.tmx`);
  its interiors sit beside it (`house-1.tmx`, `gym.tmx`, `shop.tmx`, `building-3.tmx`).
- **Sub-folders for big interiors** — a multi-floor building/cave is its own
  folder of `floor-N` maps (`harbor-town/department-store/floor-0.tmx` …
  `floor-5.tmx`).
- **`area-N/`** — numbered buckets for maps with no distinct named location
  (e.g. `mainland/area-1/market`). A large world can have dozens.
- **`road/`, `road-NN/`** — road buckets (`mainland/road/road-1`). A converter may
  instead give each road its own location folder (`mainland/road-1/road-1`).
  Both patterns are valid — the engine cares about the *path*, not the grouping.

### Map references use full relative paths

Every place that names a map — `start.xml`, a quest's `map=`, or a warp object's
`map` property — uses the path **from the main-datapack root**, region included,
without the `.tmx`/`.xml` extension:

```xml
<map file="mainland/area-1/market" x="4" y="2"/>                <!-- start.xml -->
<quest map="mainland/harbor-town/harbor-town" bot="237" .../>
```

Because maps sit at varying depths, each `.tmx`'s tileset paths are computed
relative to **that map's own directory** — a region map uses `../../tileset/...`
and `../../../../invisible.tsx`; a `floor-N` map one level deeper uses
`../../../tileset/...` and `../../../../../invisible.tsx`.

### `sub/` — sub-datapack overlays (edition variants)

A datapack can ship `sub/<variant>/` folders that are **overlay datapacks**
layered on top of the parent. A sub-datapack:

- has its own `informations.xml` (its own `<name>`, `<initial>` and accent `color`);
- contains **only `.xml` metadata files, no `.tmx`** — it inherits all
  visuals/geometry from the parent map;
- **mirrors the parent's relative path** (`sub/variant-a/<region>/road/road-1.xml`
  overrides `<region>/road/road-1.xml`);
- replaces that map's server-side data — typically the **wild-encounter tables** —
  for edition-exclusive content. The variants share the same maps but meet
  different monsters.

```
<label>/
    <region>/road/road-1.xml                      # base encounters
    sub/
        variant-a/ <region>/road/road-1.xml       # variant-A table (override)
        variant-b/ <region>/road/road-1.xml       # variant-B table (override)
```

---

## Directory Structure

```
map/main/<main-datapack>/
    informations.xml        # Datapack metadata (authors, name, description)
    start.xml               # Player spawn/start point definitions
    zone/
        <zone-name>.xml     # Zone metadata (localized zone names)
    quests/
        <id>/
            definition.xml  # Quest structure (steps, rewards, conditions)
            text.xml        # Quest dialog logic (client_logic steps)
    music/                  # Background sound files (.opus)
    <mapname>.tmx           # Tiled map file (visual layout + objects)
    <mapname>.xml           # Map metadata file (bots, monsters, conditions)
```

The tree above is the **flat** layout used by `test/`. Production datapacks nest
the `<mapname>` pairs under `<region>/<location>/` (and `floor-N` sub-folders) — see
[Region → Location → Map hierarchy](#region--location--map-hierarchy) above.

Each map is defined by a **pair of files** sharing the same base name:
- `<mapname>.tmx` — The visual map created with the [Tiled Map Editor](https://www.mapeditor.org/)
- `<mapname>.xml` — Server-side metadata: NPC dialogs, wild monsters, conditions, etc.

---

## TMX File (Tiled Map)

TMX files follow the standard [Tiled TMX format](https://doc.mapeditor.org/en/stable/reference/tmx-map-format/). Maps use **orthogonal** orientation with **16x16 pixel tiles**. Layer data is **base64-encoded** with **zstd compression** and **compression level 9**.

### Map Header

```xml
<map version="1.8" tiledversion="1.8.2" orientation="orthogonal"
     renderorder="right-down" compressionlevel="9"
     width="30" height="30" tilewidth="16" tileheight="16" infinite="0">
```

- `width` / `height`: Map size in tiles (not pixels)
- `tilewidth` / `tileheight`: Always **16x16**
- `orientation`: Always **orthogonal**
- `infinite`: Always **0** (fixed-size maps)

### Tilesets

Tilesets are referenced as external `.tsx` files from `../../tileset/` to put in common the same tiled shared from map:

```xml
<tileset firstgid="1" source="../../tileset/terra.tsx"/>
<tileset firstgid="1025" source="../../tileset/wood.tsx"/>
<tileset firstgid="2049" source="../../tileset/invisible.tsx"/>
```

Available tilesets:

| Tileset | Purpose |
|---|---|
| `terra.tsx` | Outdoor terrain (ground, paths, cliffs) |
| `wood.tsx` | Forest/wood tiles |
| `t1.tsx`, `t2.tsx`, `t3.tsx` | General-purpose tile packs |
| `building-small.tsx` | Small building exteriors |
| `inside-terra.tsx` | Indoor floor tiles |
| `inside-decoration.tsx` | Indoor furniture and decorations |
| `inside-mobilier.tsx` | Indoor furniture (alternative set) |
| `invisible.tsx` | Invisible marker tiles for objects/triggers |
| `animations.tsx` | Animated tiles (water, lava, effects) |
| `rename.tsx` | Additional decoration tiles |

> The names above are the **`test/` pool**. Generated/converted datapacks build
> their own per-datapack, content-named pool under `map/main/<label>/tileset/` —
> e.g. `common_0.tsx`, `harbor-town_0.tsx`, and tiles shared by two maps in
> `town-a-town-b_0.tsx`; some converters instead number sheets `normal1.tsx`…`normalN.tsx`.
> The `_0` suffix is the sheet index within a multi-sheet set, and `animations.tsx`
> is the one constant. Only `invisible.tsx` is referenced from the shared `map/` root.

### Tile Layers

Layers define the visual and logical structure of the map. They are **order-sensitive**, the engine interprets them firstly by **name** and only after by position.

#### Visual Layers

| Layer Name | Required | Description |
|---|---|---|
| `Walkable` | **Yes** | Base ground layer. Every tile on this layer is walkable by default. |
| `OverWalkable` | No | Decorative layer rendered on top of `Walkable` (trees, fences, buildings, etc.). These tiles are rendered below the player sprite. |
| `WalkBehind` | No | Tiles rendered **above** the player sprite (tree canopies, rooftops). Creates depth/layering. |
| `WaterOver` | No | Overlay tiles for water surface decorations (rendered above water). |

#### Logical/Gameplay Layers

| Layer Name | Required | Description |
|---|---|---|
| `Collisions` | **Yes** | Defines non-walkable tiles. Any non-zero tile here blocks movement. |
| `Dirt` | No | Dirt, not walkable, special zone where you can grow plant. |
| `OverCollisions` | No | Additional collision layer, merged with `Collisions`. Used for secondary collision data. |
| `Grass` | No | Tiles that trigger **wild monster encounters** when walked on (tall grass). |
| `Water` | No | Water tiles. Walking on them triggers water-type wild encounters (requires special item). |
| `Lava` | No | Lava tiles. Triggers lava-type encounters (requires special item). |
| `LedgesDown` | No | One-way jump ledges (player can jump **down** but not climb back up). |
| `LedgesUp` | No | One-way jump ledges (player can jump **up** but not climb back down). |
| `LedgesRight` | No | One-way jump ledges (player can jump **right** but not go back left). |
| `LedgesLeft` | No | One-way jump ledges (player can jump **left** but not go back right). |

> **Layer names:** the engine resolves layers by **name**, so spelling matters.
> Converted production maps use `LedgesDown` / `LedgesUp` for the vertical ledges
> (some older `test/` maps use `LedgesBottom` / `LedgesTop`) — prefer
> `LedgesDown` / `LedgesUp` for new region maps. A map may also carry **several
> layers with the same name** (commonly two `Collisions`): same-named tile layers
> are OR-merged for gameplay and stacked for rendering, which is how a wall's
> under-tile and over-tile both block while drawing below the player.

### Object Layers

Object layers contain interactive elements. There are two key object layers:

#### `Moving` Layer — Map Transitions and Teleports

This layer contains all map transition triggers. Each object has a **type** that determines how the transition is activated:

| Object Type | Trigger | Description |
|---|---|---|
| `border-left` | Walk off left edge | Transition to adjacent map on the left. |
| `border-right` | Walk off right edge | Transition to adjacent map on the right. |
| `border-top` | Walk off top edge | Transition to adjacent map on the top. |
| `border-bottom` | Walk off bottom edge | Transition to adjacent map on the bottom. |
| `door` | Player action (press interact key) | Enter a building/room. Typically uses a door/entrance tile as gid. |
| `teleport on push` | Player action (press interact key) | Teleport to another location (exits, stairs). |
| `teleport on it` | Step onto the tile | Automatically teleport when the player walks onto the tile. |
| `rescue` | (marker) | Marks the player respawn point (healing center, safe point). |

**Properties for transition objects:**

| Property | Type | Required | Description |
|---|---|---|---|
| `map` | file | Yes (except `rescue`) | Target map filename (without `.tmx` extension), relative to the same directory. |
| `x` | int | For doors/teleports | Target X tile coordinate on the destination map. |
| `y` | int | For doors/teleports | Target Y tile coordinate on the destination map. |
| `condition-id` | int | No | Reference to a `<condition>` in the XML metadata. Blocks teleport unless condition is met. |
| `leave` | string | No | How the player leaves. Value `"move"` means walk-through animation. |
| `lookAt` | string | No | Direction player faces after teleporting: `"bottom"`, `"top"`, `"left"`, `"right"`. |

**Example — Border transition:**
```xml
<object type="border-right" gid="4100" x="464" y="288" width="16" height="16">
    <properties>
        <property name="map" type="file" value="road"/>
    </properties>
</object>
```

**Example — Door to indoor map:**
```xml
<object type="door" gid="4177" x="144" y="416" width="16" height="16">
    <properties>
        <property name="map" type="file" value="house1"/>
        <property name="x" type="int" value="5"/>
        <property name="y" type="int" value="13"/>
    </properties>
</object>
```

**Example — Conditional teleport:**
```xml
<object name="cond 1" type="teleport on it" gid="5123" x="16" y="256" width="16" height="16">
    <properties>
        <property name="condition-id" type="int" value="1"/>
        <property name="leave" value="move"/>
        <property name="lookAt" value="bottom"/>
        <property name="x" type="int" value="0"/>
        <property name="y" type="int" value="3"/>
    </properties>
</object>
```
When `condition-id` is set and no `map` is specified, the teleport targets the **same map** (internal warp).

#### `Object` Layer — NPCs, Items, and Annotations

This layer contains bots (NPCs), collectible items, and visual annotations.

**Bot (NPC) objects:**

```xml
<object type="bot" gid="4097" x="304" y="272" width="16" height="16">
    <properties>
        <property name="id" type="int" value="3"/>
        <property name="lookAt" value="bottom"/>
        <property name="skin" value="kid1"/>
    </properties>
</object>
```

| Property | Type | Required | Description |
|---|---|---|---|
| `id` | int | **Yes** | References `<bot id="...">` in the XML metadata file. |
| `skin` | string | No | NPC sprite name (e.g., `"kid1"`, `"nurse"`, `"prof"`, `"captain"`, `"badguys"`, `"smith"`, `"hariel"`, `"rookie"`, `"oldman"`). If omitted, uses invisible/sign marker. |
| `lookAt` | string | No | Initial facing direction: `"bottom"`, `"top"`, `"left"`, `"right"`, or `"move"` (NPC patrols/moves around). |

**Item (Collectible) objects:**

```xml
<object type="object" gid="4274" x="544" y="448" width="16" height="16">
    <properties>
        <property name="item" type="int" value="5"/>
        <property name="visible" type="bool" value="true"/>
    </properties>
</object>
```

| Property | Type | Required | Description |
|---|---|---|---|
| `item` | int/string | **Yes** | Item ID or name to give the player when picked up. |
| `visible` | bool | No | `true` = item is visible on the map (item ball sprite). `false` = hidden item (must be found/interacted with). Default behavior if omitted is visible. |
| `infinite` | bool | No | `true` = item can be picked up repeatedly (never consumed). `false`/omitted = one-time pickup. |

**Annotation objects** (no `type`): Used as labels/notes in the editor. They have a `name` and optionally a `<text>` child. These are **not processed by the engine** and serve only as developer documentation inside the TMX.

```xml
<object id="19" x="80" y="352" width="120" height="19">
    <text wrap="1">Quest+Industry</text>
</object>
```

---

## XML Metadata File

The XML metadata file shares the same base name as its `.tmx` counterpart (e.g., `city.tmx` + `city.xml`). It defines server-side logic: NPC behavior, wild encounters, conditions, and map properties.

### Root `<map>` Element

```xml
<map zone="test" type="city">
```

| Attribute | Required | Values | Description |
|---|---|---|---|
| `type` | No | `"city"`, `"outdoor"`, `"indoor"`, `"cave"` | Map category. Affects game behavior (e.g., indoor maps have no wild encounters). |
| `zone` | No | Zone folder name | Links to `zone/<name>.xml` for zone metadata (used for clan zone capture). |
| `backgroundsound` | No | File path | Background music/ambient sound file (e.g., `"music/cave.opus"`). |
| `color` | No | Hex color | Screen tint/overlay color (e.g., `"#000000"` for dark caves). |
| `alpha` | No | 0-255 | Opacity of the color overlay (e.g., `"60"` for partial darkness). |

### Map Name and Description

Localizable map name and description displayed to the player:

```xml
<name>City</name>
<name lang="fr">Ville</name>
<description>City of test</description>
<description lang="fr">Ville de test</description>
```

- The version without `lang` attribute is the default (English).
- Add `lang="xx"` for translations.

### Wild Monster Encounters

Monsters are defined per terrain type. Each terrain section corresponds to a **tile layer** in the TMX:

| XML Element | TMX Layer | Encounter Trigger |
|---|---|---|
| `<grass>` | `Grass` | Walking on grass tiles |
| `<cave>` | (any movement) | Moving in a cave-type map |
| `<water>` | `Water` | Surfing on water tiles |
| `<lava>` | `Lava` | Walking on lava tiles |
| `<waterRod>` | `Water` | Using fishing rod on water |
| `<waterSuperRod>` | `Water` | Using super rod on water |

You can add more into map/layers.xml

> Cave maps may use `<grass>` (tile-driven — a `type="cave"` map can still carry a
> `<grass>` table) and/or `<cave>` (whole-map movement).

#### Day/night encounter variants

Any encounter section has an optional **`Night` twin**, selected by the day/night
event (`player/event.xml`). At night the engine uses the `*Night` table if present
and otherwise falls back to the base section. The production datapacks use
`<grassNight>` and `<caveNight>` alongside `<grass>` / `<cave>` / `<water>`:

```xml
<grass>                                   <!-- daytime -->
  <monster id="16"  minLevel="2" maxLevel="4" luck="55"/>
  <monster id="161" minLevel="2" maxLevel="3" luck="40"/>
</grass>
<grassNight>                              <!-- nighttime -->
  <monster id="163" minLevel="2" maxLevel="4" luck="85"/>
  <monster id="19"  minLevel="2" maxLevel="4" luck="15"/>
</grassNight>
```

**Monster entry format:**

```xml
<monster id="Conileaf" minLevel="2" maxLevel="5" luck="90"/>
<monster id="Hampotamos" level="4" luck="10"/>
```

| Attribute | Required | Description |
|---|---|---|
| `id` | **Yes** | Monster species name or ID number. |
| `level` | One of `level` or `minLevel`+`maxLevel` | Fixed encounter level. |
| `minLevel` | One of | Minimum encounter level (random range). |
| `maxLevel` | One of | Maximum encounter level (random range). |
| `luck` | **Yes** | Encounter probability weight (higher = more common). All `luck` values in a terrain section are relative to each other. |

**Example — full encounter setup:**
```xml
<grass>
    <monster id="Conileaf" minLevel="2" maxLevel="5" luck="90"/>
    <monster id="Cowpignon" level="4" luck="10"/>
</grass>
<water>
    <monster id="Rhinocarpe" minLevel="2" maxLevel="5" luck="99"/>
    <monster id="Hampotamos" level="4" luck="1"/>
</water>
```

### Bots (NPCs)

Bot definitions in XML are referenced by `id` from bot objects in the TMX file.

```xml
<bot id="1">
    <name>Nurse</name>
    <name lang="fr">Infirmière</name>
    <step type="text" id="1">
        <text><![CDATA[I will heal for you...<br /><a href="2;3">[Heal]</a>]]></text>
        <text lang="fr"><![CDATA[Laissez moi vous soigner...<br /><a href="2;3">[Soin]</a>]]></text>
    </step>
    <step type="heal" id="2"/>
    <step type="text" id="3">
        <text><![CDATA[Have a good day!]]></text>
        <text lang="fr"><![CDATA[Bonne journée!]]></text>
    </step>
</bot>
```

#### Bot Name

```xml
<name>Sign</name>
<name lang="fr">Panneau</name>
```
Optional. The displayed NPC name. Supports localization via `lang` attribute.

#### Bot Steps

Each `<step>` defines a dialog or action. Steps are linked by IDs.

| Step Type | Description |
|---|---|
| `text` | Displays dialog text. Supports HTML-like markup. |
| `heal` | Heals the player's monsters. |
| `shop` | Opens a shop buy interface. |
| `sell` | Opens a shop sell interface. |
| `warehouse` | Opens the player's storage system. |
| `quests` | Opens a quest interface. |
| `fight` | Initiates a monster battle with the NPC. |
| `industry` | Opens a crafting/industry interface. |
| `zonecapture` | Opens the zone capture interface (clan warfare). |

**Step `id` attribute:** Numeric identifier used for navigation between steps. When a step has no `id`, it is the only step (or the first step).

#### Text Step — Dialog with Navigation

Dialog text uses CDATA-wrapped HTML-like markup:

```xml
<step type="text" id="1">
    <text><![CDATA[Welcome!<br /><a href="2">[Open shop]</a><br /><a href="3">[Sell items]</a>]]></text>
</step>
```

- `<br />` — Line break
- `<b>text</b>` — Bold text
- `<a href="ID">[Label]</a>` — Link to another step by ID
- `<a href="ID1;ID2">[Label]</a>` — Execute step ID1, then go to step ID2 (chaining)
- `<a href="next">[Label]</a>` — Go to the next step sequentially
- `<a href="next_quest_step;ID">[Label]</a>` — Advance quest step, then go to step ID
- `<a href="clan_create">[Label]</a>` — Special action: open clan creation dialog

#### Fight Step

```xml
<step type="fight" leader="true">
    <start><![CDATA[Ready for the fight?]]></start>
    <win><![CDATA[You are so strong for me!]]></win>
    <monster id="Sclairus" level="4"/>
    <gain cash="100"/>
    <item id="Moco Berry"/>
</step>
```

| Element/Attribute | Description |
|---|---|
| `leader="true"` | Marks this bot as a gym leader. |
| `<start>` | Text shown before the fight begins. |
| `<win>` | Text shown when the player wins. |
| `<monster>` | Monster the bot uses. `id` = species, `level` = level. |
| `<gain cash="..."/>` | Money reward for winning. |
| `<item id="..."/>` | Item reward for winning. |

#### Shop Step

```xml
<step type="shop" id="2">
    <product item="IronTrap"/>
    <product item="Potion grade A"/>
    <product item="Repulse grade A"/>
</step>
```

Each `<product>` lists an item available for purchase by name.

#### Industry Step

```xml
<step type="industry" id="2" cycletobefull="10" time="1080">
    <resource id="Copper ore" quantity="4"/>
    <resource id="Coal" quantity="2"/>
    <product id="Copper ingot" quantity="2"/>
</step>
```

| Attribute | Description |
|---|---|
| `cycletobefull` | Number of production cycles needed. |
| `time` | Time per cycle in seconds. |
| `<resource>` | Input material required (id + quantity). |
| `<product>` | Output item produced (id + quantity). |

### Conditions

Conditions gate teleportation or progression. They are referenced by `condition-id` in TMX teleport objects.

```xml
<condition id="1" quest="1" type="quest">
    <blockedtext><![CDATA[Pass quest <b>Berry exchange</b>]]></blockedtext>
</condition>
```

| Condition Type | Required Attribute | Description |
|---|---|---|
| `quest` | `quest="<quest_id>"` | Player must have completed the specified quest. |
| `item` | `item="<item_id>"` | Player must possess the specified item. |
| `clan` | (none) | Player's clan must own the current zone. |
| `fightBot` | `fightBot="<bot_id>"` | Player must have defeated the specified fight bot. |

The `<blockedtext>` element contains the message shown when the condition is not met.

---

## Supporting Files

### `informations.xml` — Datapack Metadata

```xml
<informations color="#4FD9FF">
    <author pseudo="username" email="email" name="Full Name"/>
    <name>Datapack display name</name>
    <name lang="fr">Nom du datapack</name>
    <description>Description</description>
    <initial>C</initial>
</informations>
```

| Element | Description |
|---|---|
| `color` | UI accent color for this datapack. |
| `<author>` | One or more author entries. |
| `<name>` | Datapack display name (localizable). |
| `<description>` | Datapack description (localizable). |
| `<initial>` | Short initial/icon character. |

### `start.xml` — Player Spawn Point

```xml
<profile>
    <start id="Normal">
        <map x="15" y="17" file="city"/>
    </start>
</profile>
```

| Attribute | Description |
|---|---|
| `id` | Profile/game mode name. |
| `file` | Map path (without extension) where the player spawns — full region path in nested datapacks (e.g. `mainland/harbor-town/harbor-town`). |
| `x`, `y` | Tile coordinates of the spawn point. |

A datapack can declare **several profiles**, each spawning in a different place
(used for game-mode variants):

```xml
<profile>
  <start id="normal"><map file="mainland/harbor-town/harbor-town" x="26" y="27"/></start>
  <start id="explorer"><map file="north-isles/riverside-city/riverside-city" x="13" y="19"/></start>
</profile>
```

### `zone/<name>.xml` — Zone Definition

```xml
<zone>
    <name lang="en">Test zone</name>
    <name lang="fr">Zone de test</name>
</zone>
```

Zones are referenced by the `zone` attribute on `<map>` in the XML metadata. Used for clan territory control.

A zone may also pin **background music per map type**, overriding `map/music.xml`
for every map in the zone:

```xml
<zone>
    <name>Harbor Town</name>
    <music type="city"   backgroundsound="music/harbor-town.opus"/>
    <music type="indoor" backgroundsound="music/harbor-town.opus"/>
</zone>
```

### `quests/<id>/definition.xml` — Quest Definition

```xml
<quest bot="house1/41" repeatable="yes">
    <name><![CDATA[Berry exchange]]></name>
    <name lang="fr"><![CDATA[Échange de baie]]></name>
    <step id="1">
        <text><![CDATA[Description of what to do]]></text>
        <item quantity="1" id="Moco Berry"/>
    </step>
    <rewards show="true">
        <item id="Tuber"/>
        <allow type="clan"/>
    </rewards>
</quest>
```

| Attribute/Element | Description |
|---|---|
| `bot` | The bot that gives this quest. |
| `map` | (nested datapacks) Full region path of the bot's map, with `bot` then holding just the numeric object id — e.g. `map="mainland/harbor-town/harbor-town" bot="237"`. The flat form combines both as `bot="house1/41"`. |
| `repeatable` | `"yes"` if the quest can be repeated. |
| `<step>` | Quest objectives. `<item>` = required item with quantity. |
| `<rewards>` | Completion rewards. `show="true"` shows them upfront. |
| `<allow type="...">` | Unlocks a feature (e.g., `"clan"` unlocks clan creation). |

### `quests/<id>/text.xml` — Quest Dialog Logic

```xml
<text>
    <client_logic id="1">
        <condition queststep="1"/>
        <condition haverequirements="true"/>
        <text><![CDATA[Dialog when conditions are met]]></text>
    </client_logic>
</text>
```

Uses `<client_logic>` blocks with conditions to show different dialog depending on quest progress. Conditions include `queststep` (current quest step) and `haverequirements` (player has required items).

---

## Quick Reference — Creating a New Map

1. **Create `<mapname>.tmx`** in Tiled:
   - Set tile size to 16x16, orientation to orthogonal
   - Add tilesets from `../../tileset/`
   - Create layers: at minimum `Walkable` and `Collisions`
   - Add `Moving` object layer for transitions (doors, borders, teleports)
   - Add `Object` layer for NPCs and items
   - Optionally add `Grass`, `Water`, `WalkBehind`, etc.

2. **Create `<mapname>.xml`** with matching name:
   - Set `type` (`city`, `outdoor`, `indoor`, `cave`)
   - Set `zone` if applicable
   - Add `<name>` and optionally `<description>`
   - Define wild encounters (`<grass>`, `<water>`, `<cave>`, etc.)
   - Define `<bot>` entries for each NPC referenced by `id` in the TMX
   - Add `<condition>` entries if teleports require conditions

3. **Link maps**: Use border/door/teleport objects in the `Moving` layer to connect maps to each other.

