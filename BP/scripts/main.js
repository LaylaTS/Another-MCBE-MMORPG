import * as server from '@minecraft/server'
import 'helmets.js'
import 'spawn.js'
import 'marketform.js'
import 'banking.js'
import 'dungeontps.js'
import 'swords.js'
import 'mobdeath.js'
import 'island.js'
import 'blockdrops.js'
import 'worldedit.js'
import 'populatemoss.js'

const world = server.world
world.afterEvents.worldInitialize.subscribe(data => {
    world.getDimension("minecraft:overworld").runCommand("volumearea remove_all")
    world.getDimension("minecraft:overworld").runCommand("volumearea add mmorpg:cherryforest -67 81 -155 -345 201 135 cherryforest")
})

server.system.runInterval(() => { // run every tick
    var players = server.world.getAllPlayers()
    players.forEach(function (player) { // run for every player
        let mana = server.world.scoreboard.getObjective('mana').getScore(player)
        player.resetLevel()
        player.addLevels(mana)
        let tonextlvl = player.totalXpNeededForNextLevel
        tonextlvl = tonextlvl / 100
        player.addExperience(tonextlvl * mana - 1)

    })
})
