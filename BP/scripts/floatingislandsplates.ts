import * as server from '@minecraft/server'

const world = server.world

server.world.afterEvents.pressurePlatePush.subscribe(eventData => {
    var entity = eventData.source
    var block = eventData.block
    if (entity.typeId == "minecraft:player") {
        world.getDimension("minecraft:overworld").spawnParticle("mmorpg:jumpparticle", block.location, new server.MolangVariableMap)
        if (block.location.x == 2986 && block.location.z == -3001) {


            entity.applyKnockback(-1, -1, 13, 2)
            entity.addEffect("slow_falling", 50)

        } else if (block.location.x == 2965 && block.location.z == -3020) {
            entity.applyKnockback(1, 0.5, 13, 0.5)
            entity.addEffect("slow_falling", 50)

        } else if (block.location.x == 2957 && block.location.z == -3016) {
            entity.applyKnockback(0, 1, 9, 1.5)
            entity.addEffect("slow_falling", 50)
        } else if (block.location.x == 2953 && block.location.z == -2998) {
            entity.applyKnockback(0, -1, 10, 0.3)
            entity.addEffect("slow_falling", 50)
        } else if (block.location.x == 2958 && block.location.z == -2973) {
            entity.applyKnockback(0, 1, 10, 2.4)
            entity.addEffect("slow_falling", 50)
        } else if (block.location.x == 2953 && block.location.z == -2949) {
            entity.applyKnockback(0, -1, 10, 0.4)
            entity.addEffect("slow_falling", 50)
        } else if (block.location.x == 3004 && block.location.z == -2911) {
            entity.applyKnockback(1, -1, 15, -0.4)
            entity.addEffect("slow_falling", 50)
        }
    }
})