scoreboard players set @a[scores={alive=!2}] alive 0
scoreboard players set @e[type=player] alive 1



execute as @a[scores={alive=0}] run scoreboard players add @s deathcounter 1
execute as @a[scores={alive=0}] run scoreboard players operation @s money /= divider moneydivider
stopsound @a[scores={alive=0}]


scoreboard players set @a[scores={alive=0}] alive 2

