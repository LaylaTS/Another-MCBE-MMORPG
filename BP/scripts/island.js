import * as server from "@minecraft/server";

var world = server.world
world.afterEvents.playerSpawn.subscribe(eventData => {
    let player = eventData.player
    player.addEffect("regeneration", 20, { showParticles: false, amplifier: 255 })
    world.scoreboard.getObjective("spawntimer").setScore(player, 200)
    if (eventData.initialSpawn) {
        if (eventData.player.hasTag('joined') == false) {

            world.getDimension('minecraft:overworld').runCommand('scoreboard players add finalcords plotcords 21')


            let finalcords = world.scoreboard.getObjective('plotcords').getScore('finalcords')
            player.setDynamicProperty("maxmana", 0)








            player.runCommandAsync('scoreboard players set @s plotcords ' + finalcords)
            player.runCommandAsync('tp @s 39990 -57 ' + finalcords)
            player.runCommand('setblock 39988 -63 ' + parseInt(finalcords - 11) + ' redstone_block')
            player.runCommandAsync('scoreboard players add @s mana 0')
            player.runCommandAsync('tag @s add joined')
            player.runCommandAsync('spawnpoint @s 39990 -57 ' + finalcords)



        }
    }

}
)
