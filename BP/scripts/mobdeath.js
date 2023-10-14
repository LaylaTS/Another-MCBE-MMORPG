import * as server from '@minecraft/server'

var world = server.world

world.afterEvents.entityDie.subscribe(eventData => {

    if (eventData.damageSource.cause == 'entityAttack') {
        let deadhealth = eventData.deadEntity.getComponent('health').defaultValue
        if (eventData.damageSource.damagingEntity.typeId == 'minecraft:player') {
            var eventmultiplier
            if (now.getDay() === 2 && now.getHours() == 18) {
                eventmultiplier = 2
            } else {
                eventmultiplier = 1
            }
            let temp = Math.trunc(deadhealth / 5) * eventmultiplier
            eventData.damageSource.damagingEntity.runCommandAsync('scoreboard players add @s money ' + temp)
            if (world.getDynamicProperty("seasondaysleft") < 3 && world.getDynamicProperty("seasonhoursleft") < 10) {
                world.scoreboard.getObjective("guildpoints").addScore(String(eventData.damageSource.damagingEntity.getDynamicProperty("guildid")), temp * 2)
            } else {
                world.scoreboard.getObjective("guildpoints").addScore(String(eventData.damageSource.damagingEntity.getDynamicProperty("guildid")), temp)
            }

        }
    }
})