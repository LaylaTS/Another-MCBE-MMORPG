import * as server from '@minecraft/server'
server.world.afterEvents.entityHealthChanged.subscribe(data => {
    function rand() {
        return 1 - Math.random() * 2
    }
    if (data.newValue < data.oldValue && data.entity.typeId != "minecraft:player") {
        let loc = data.entity.location
        server.world.getDimension("overworld").spawnEntity("mmorpg:damagedisplay", new server.Vector(loc.x + rand(), loc.y + 1, loc.z + rand())).nameTag = `${(data.oldValue - data.newValue).toFixed(1)}`
    }
})