import * as server from '@minecraft/server'
import 'chat.js'
import 'swords.js'
import 'mobdeath.js'
import 'island.js'
import 'mining.js'
import 'floatingislandsplates.js'
import 'dailyrewards.js'
import 'coreboss.js'
import 'npcs.js'
import { corebossbehavior } from 'coreboss.js'
import 'equipment.js'
import 'skybornespecter.js'
import 'guilds.js'
import 'seasons.js'
import 'fillmines.js'


export const displayEnum = [
    "k",
    "m",
    "b",
];

export function metricNumbers(number) {
    if (number <= 999) return number;
    for (let i = 0; i < displayEnum.length; i++) {
        if (number >= 1000 ** (i + 1) && number < 1000 ** (i + 2)) {
            return `${(number / 1000 ** (i + 1)).toFixed(2)}${displayEnum[i]}`;
        };
    };
};

const world = server.world
world.afterEvents.worldInitialize.subscribe(() => {
    world.getDimension("minecraft:overworld").runCommand("volumearea remove_all")
    world.getDimension("minecraft:overworld").runCommand("volumearea add mmorpg:cherryforest -67 81 -155 -345 201 135 cherryforest")
    world.getDimension("minecraft:overworld").runCommand("volumearea add mmorpg:floatingislands 3200 0 -3200 2800 320 -2800 floatingislands")
})

server.system.runInterval(() => { // run every tick
    var players = server.world.getAllPlayers()
    players.forEach(function (player) { // run for every player
        let money = player.getDynamicProperty("money")
        var maxmana = player.getDynamicProperty("maxmana")
        player.runCommandAsync('scoreboard players set @s maxmana ' + maxmana)
        let mana = server.world.scoreboard.getObjective('mana').getScore(player)
        if (mana > maxmana || (Math.trunc(player.location.x) == 0 && Math.trunc(player.location.z) == 0 && Math.trunc(player.location.y) == 65)) {
            mana = maxmana
            player.runCommandAsync('scoreboard players set @s mana ' + mana)
        }
        if (server.world.getAbsoluteTime() % player.getDynamicProperty("manaregen") == 0) {
            player.runCommandAsync('scoreboard players add @s mana 1')
        }

        player.resetLevel()
        player.addLevels(mana)
        let tonextlvl = player.totalXpNeededForNextLevel
        tonextlvl = tonextlvl / maxmana
        player.addExperience(tonextlvl * mana - 1)

        if (server.system.currentTick % 20 == 0) {
            world.scoreboard.getObjective("playtime").addScore(player, 1)
            player.setDynamicProperty("money", money + world.scoreboard.getObjective("money").getScore(player))

            world.scoreboard.getObjective("money").setScore(player, 0)

        }
        player.onScreenDisplay.setActionBar(`§2Money: §a\$${metricNumbers(money)}`)
    })
    corebossbehavior()


    if (server.system.currentTick % 200 == 0) {
        if (world.scoreboard.getObjectiveAtDisplaySlot(server.DisplaySlotId.List).objective.id == "deathdisplay") {
            world.scoreboard.removeObjective("moneydisplay")
            world.scoreboard.addObjective("moneydisplay", "§gMoney Ranking:§r§o§7 (k)")
            world.getAllPlayers().forEach(player => {
                let bank = 0
                if (player.getDynamicProperty("bankbalance") != undefined) bank = player.getDynamicProperty("bankbalance")


                player.runCommand(`scoreboard players set @s moneydisplay ${Math.trunc((player.getDynamicProperty("money") + bank) / 1000)}`)
            })
            world.scoreboard.setObjectiveAtDisplaySlot(server.DisplaySlotId.List, { objective: world.scoreboard.getObjective('moneydisplay') })
        } else if (world.scoreboard.getObjectiveAtDisplaySlot(server.DisplaySlotId.List).objective.id == "moneydisplay") {

            world.scoreboard.removeObjective("playtimedisplay")
            world.scoreboard.addObjective("playtimedisplay", "§bPlaytime Ranking:")
            world.getAllPlayers().forEach(player => {
                world.scoreboard.getObjective("playtimedisplay").setScore(player, Math.trunc(world.scoreboard.getObjective("playtime").getScore(player) / 3600))
            })
            world.scoreboard.setObjectiveAtDisplaySlot(server.DisplaySlotId.List, { objective: world.scoreboard.getObjective('playtimedisplay') })

        } else {
            world.scoreboard.removeObjective("deathdisplay")
            world.scoreboard.addObjective("deathdisplay", "§4Death Ranking:")
            world.getAllPlayers().forEach(player => {
                world.scoreboard.getObjective("deathdisplay").setScore(player, Math.trunc(world.scoreboard.getObjective("deathcounter").getScore(player)))
            })
            world.scoreboard.setObjectiveAtDisplaySlot(server.DisplaySlotId.List, { objective: world.scoreboard.getObjective('deathdisplay') })

        }
    }
})

world.beforeEvents.pistonActivate.subscribe(data => {
    data.cancel = true
    server.system.run(() => {
        world.getDimension("overworld").createExplosion(data.block.location, 1, { breaksBlocks: true })
    })

})