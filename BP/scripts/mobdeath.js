import * as server from '@minecraft/server'

var world = server.world

world.afterEvents.entityDie.subscribe(eventData => {

    if (eventData.damageSource.cause == 'entityAttack') {
        let deadhealth = eventData.deadEntity.getComponent('health').defaultValue
        if (eventData.damageSource.damagingEntity.typeId == 'minecraft:player') {
            let temp = Math.trunc(deadhealth / 5)
            eventData.damageSource.damagingEntity.runCommandAsync('scoreboard players add @s money ' + temp)
            world.scoreboard.getObjective("guildpoints").addScore(String(eventData.damageSource.damagingEntity.getDynamicProperty("guildid")), temp)
        }
    }
})