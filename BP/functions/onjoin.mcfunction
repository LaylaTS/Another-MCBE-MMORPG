scoreboard players add @a joined 0


tp @a[scores={joined=0},m=a,tag=!joined] 0 66 0
give @a[hasitem=[{item=mmorpg:return, quantity=0}]] mmorpg:return 1 0 {"minecraft:item_lock":{ "mode": "lock_in_inventory" }, "minecraft:keep_on_death":{}}
playsound record.relic @a[scores={joined=0}] ~ ~ ~ 1
title @a[scores={joined=0}] title §lWelcome!
title @a[scores={joined=0}] subtitle §lCurrent version:§r §o§7pre-0.2.0
give @a[hasitem=[{item=mmorpg:orepickaxe, quantity=0}]] mmorpg:orepickaxe 1 0 {"minecraft:can_destroy":{"blocks":["iron_ore", "diamond_ore", "coal_ore", "emerald_ore","mmorpg:aetheriumore"]},"minecraft:item_lock":{ "mode": "lock_in_inventory" }}

scoreboard players reset * joined
scoreboard players set @a joined 1
