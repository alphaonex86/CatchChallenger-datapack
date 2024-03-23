== Why merge shop/fight/industry into the map file? ==
Most shop/fight/industry is unique, then greatly simply the map creation, you don't have to edit/create 5 files (reduce size and XML tag by 20x), creation time of advanced bot (shop/fight/industry): 10min to 15s

== Bot id unique by map ==
Was so hard find unique id over whole datapack
Don't imply performance lost on server because it generate their own dictionary and manipulate unique id as internal

== Dedupliction ==
All is duplicate, you can't change a value and all the bot is impacted, but was case near never used
You can search in all file and change the value automatic or manual way

== Quest ==
NoW bot id is folder/map/botid

== condition for door ==
local on map file

== id or name ==
you can replace id="123" by id="name", will be internally converted to id, no performance/memory change for server if datapack cache used
apply to: monster, skill, item
if the name change and use name, then you need remplace them into all file
This convertion is case-insensitive
