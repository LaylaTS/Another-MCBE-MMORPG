import * as server from '@minecraft/server'
import 'chat.js'
import 'swords.js'
import 'mobdeath.js'
import 'island.js'
import 'floatingislandsplates.js'
import 'dailyrewards.js'
import 'coreboss.js'
import 'npcs.js'
import { corebossbehavior } from './coreboss.js'
import { equipment } from './equipment.js'
import 'guilds.js'
import 'seasons.js'
import 'fillmines.js'
import { fillmines } from "./fillmines.js"
import { snowregion } from "./snowregion.js"
import 'blockbreak.js'
import 'damagedisplay.js'

export const displayEnum = [
    "k",
    "m",
    "b",
];

export function distance(location1: server.Vector3, location2: server.Vector3): number {
    const dx = location1.x - location2.x;
    const dy = location1.y - location2.y;
    const dz = location1.z - location2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

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
    world.getDimension("minecraft:overworld").runCommand("volumearea add mmorpg:snowregion 8000 0 8000 7000 320 7000 snowregion")
})

server.system.runInterval(() => { // run every tick
    var players = server.world.getAllPlayers()
    snowregion(players)

    players.forEach(function (player) { // run for every player
        equipment(player)


        let money = player.getDynamicProperty("money") as number
        var maxmana = player.getDynamicProperty("maxmana") as number
        player.runCommandAsync('scoreboard players set @s maxmana ' + maxmana)

        player.nameTag = `${player.name}\n§r§c${Math.round(player.getComponent("health").currentValue)} §l§8»§r§b ${world.scoreboard.getObjective("mana").getScore(player)}`

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



    if (server.system.currentTick % 12000 == 0) {
        fillmines()
        world.sendMessage("\n§5§l> Filled Mines! <§r\n\n")
    }
    if (server.system.currentTick % 200 == 0) {



        if (world.scoreboard.getObjectiveAtDisplaySlot(server.DisplaySlotId.List).objective.id == "killdisplay") {
            world.scoreboard.removeObjective("moneydisplay")
            world.scoreboard.addObjective("moneydisplay", "§gMoney Ranking:§r§o§7 (k)")
            world.getAllPlayers().forEach(player => {
                let bank: number = 0
                if (player.getDynamicProperty("bankbalance") != undefined) bank = player.getDynamicProperty("bankbalance") as number


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

        } else if (world.scoreboard.getObjectiveAtDisplaySlot(server.DisplaySlotId.List).objective.id == "playtimedisplay") {
            world.scoreboard.removeObjective("deathdisplay")
            world.scoreboard.addObjective("deathdisplay", "§4Death Ranking:")
            world.getAllPlayers().forEach(player => {
                world.scoreboard.getObjective("deathdisplay").setScore(player, Math.trunc(world.scoreboard.getObjective("deathcounter").getScore(player)))
            })
            world.scoreboard.setObjectiveAtDisplaySlot(server.DisplaySlotId.List, { objective: world.scoreboard.getObjective('deathdisplay') })

        } else {
            world.scoreboard.removeObjective("killdisplay")
            world.scoreboard.addObjective("killdisplay", "§aKill Ranking:")
            world.getAllPlayers().forEach(player => {
                world.scoreboard.getObjective("killdisplay").setScore(player, Math.trunc(world.scoreboard.getObjective("playerkills").getScore(player)))
                world.scoreboard.setObjectiveAtDisplaySlot(server.DisplaySlotId.List, { objective: world.scoreboard.getObjective('killdisplay') })
            })
        }
    }
})

world.beforeEvents.pistonActivate.subscribe(data => {
    data.cancel = true
    server.system.run(() => {
        world.getDimension("overworld").createExplosion(data.block.location, 1, { breaksBlocks: true })
    })

})

export function deepClone(obj, visited = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (visited.has(obj)) {
        return visited.get(obj);
    }

    if (Array.isArray(obj)) {
        const arrCopy = [];
        visited.set(obj, arrCopy);

        for (let i = 0; i < obj.length; i++) {
            arrCopy[i] = deepClone(obj[i], visited);
        }

        return arrCopy;
    }

    const objCopy = {};
    visited.set(obj, objCopy);

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            objCopy[key] = deepClone(obj[key], visited);
        }
    }

    return objCopy;
}