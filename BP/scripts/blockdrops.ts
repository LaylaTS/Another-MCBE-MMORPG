import * as server from '@minecraft/server'

const world = server.world

world.afterEvents.playerBreakBlock.subscribe(eventData => {
    if (eventData.dimension.id == 'minecraft:overworld') {
        let player = eventData.player
        if (eventData.brokenBlockPermutation.type.id == "minecraft:cobblestone") {
            if (Math.floor((Math.random() * 8) + 1) == 1) {
                player.runCommand('scoreboard players add @s money 3')
                player.playSound('random.orb')
            }
            if (Math.floor((Math.random() * 80) + 1) == 1) {
                player.runCommand('scoreboard players add @s money 100')
                player.playSound('random.orb')
            }
            if (Math.floor((Math.random() * 60) + 1) == 1) {
                player.runCommand('give @s raw_iron')
                player.playSound('random.pop2')
            }
            if (Math.floor((Math.random() * 40) + 1) == 1) {
                player.runCommand('give @s coal')
                player.playSound('random.pop2')
            }
            if (Math.floor((Math.random() * 100) + 1) == 1) {
                player.runCommand('give @s redstone')
                player.playSound('random.pop')
            }
            if (Math.floor((Math.random() * 500) + 1) == 1) {
                player.runCommand('give @s diamond')
                player.playSound('place.large_amethyst_bud')
            }
            if (Math.floor((Math.random() * 1000) + 1) == 1) {
                player.runCommand('give @s mmorpg:aetherium')
                player.playSound('place.large_amethyst_bud')
            }
            if (Math.floor((Math.random() * 1) + 5000) == 1) {
                player.runCommand('give @s netherite_ingot')
                player.playSound('respawn_anchor.set_spawn')

            }


        }
    }
})
