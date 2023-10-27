import * as server from '@minecraft/server'

const world = server.world

world.afterEvents.playerBreakBlock.subscribe(eventData => {
    if (eventData.dimension.id == 'minecraft:overworld') {
        let player = eventData.player
        if (Math.floor((Math.random() * 10) + 1) == 1) {
            if (world.getDynamicProperty("seasondaysleft") < 3 && world.getDynamicProperty("seasonhoursleft") < 10) {
                world.scoreboard.getObjective("guildpoints").addScore(String(player.getDynamicProperty("guildid")), 2)
            } else {
                world.scoreboard.getObjective("guildpoints").addScore(String(player.getDynamicProperty("guildid")), 1)

            }
        }
        const luck: number = 0 // for future rng mechanics
        const now = new Date()
        var eventmultiplier: number
        if (now.getDay() === 1 && now.getHours() == 18) {
            eventmultiplier = 1
        } else {
            eventmultiplier = 0
        }
        const rng = 1 + luck + eventmultiplier
        if (eventData.brokenBlockPermutation.type.id == "minecraft:cobblestone" || eventData.brokenBlockPermutation.type.id == "minecraft:stone") {

            if (Math.floor((Math.random() * 8 / rng) + 1) == 1) {
                player.runCommand('scoreboard players add @s money 3')
                player.playSound('random.orb')
            }
            if (Math.floor((Math.random() * 80 / rng) + 1) == 1) {
                player.runCommand('scoreboard players add @s money 100')
                player.playSound('random.orb')
            }
            if (Math.floor((Math.random() * 60 / rng) + 1) == 1) {
                player.runCommand('give @s raw_iron')
                player.playSound('random.pop2')
            }
            if (Math.floor((Math.random() * 40 / rng) + 1) == 1) {
                player.runCommand('give @s coal')
                player.playSound('random.pop2')
            }
            if (Math.floor((Math.random() * 100 / rng) + 1) == 1) {
                player.runCommand('give @s redstone')
                player.playSound('random.pop')
            }
            if (Math.floor((Math.random() * 500 / rng) + 1) == 1) {
                player.runCommand('give @s diamond')
                player.playSound('place.large_amethyst_bud')
            }
            if (Math.floor((Math.random() * 1000 / rng) + 1) == 1) {
                player.runCommand('give @s mmorpg:aetherium')
                player.playSound('place.large_amethyst_bud')
            }
            if (Math.floor((Math.random() * 5000 / rng) + 1) == 1) {
                player.runCommand('give @s netherite_ingot')
                player.playSound('respawn_anchor.set_spawn')

            }


        } else if (eventData.brokenBlockPermutation.type.id == "minecraft:deepslate") {
            if (Math.floor((Math.random() * 4 / rng) + 1) == 1) {
                player.runCommand('scoreboard players add @s money 3')
                player.playSound('random.orb')
            }
            if (Math.floor((Math.random() * 40 / rng) + 1) == 1) {
                player.runCommand('scoreboard players add @s money 100')
                player.playSound('random.orb')
            }
            if (Math.floor((Math.random() * 40 / rng) + 1) == 1) {
                player.runCommand('give @s raw_iron')
                player.playSound('random.pop2')
            }
            if (Math.floor((Math.random() * 30 / rng) + 1) == 1) {
                player.runCommand('give @s coal')
                player.playSound('random.pop2')
            }
            if (Math.floor((Math.random() * 50 / rng) + 1) == 1) {
                player.runCommand('give @s redstone')
                player.playSound('random.pop')
            }
            if (Math.floor((Math.random() * 250 / rng) + 1) == 1) {
                player.runCommand('give @s diamond')
                player.playSound('place.large_amethyst_bud')
            }
            if (Math.floor((Math.random() * 200 / rng) + 1) == 1) {
                player.runCommand('give @s mmorpg:aetherium')
                player.playSound('place.large_amethyst_bud')
            }
            if (Math.floor((Math.random() * 200 / rng) + 1) == 1) {
                player.runCommand('give @s mmorpg:ruby')
                player.playSound('break.amethyst_cluster')
            }

            if (Math.floor((Math.random() * 1000 / rng) + 1) == 1) {
                player.runCommand('give @s netherite_ingot')
                player.playSound('respawn_anchor.set_spawn')

            }
        }
    }
})
