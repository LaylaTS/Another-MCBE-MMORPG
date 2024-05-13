import * as server from '@minecraft/server'

class Vector {
    x: number
    y: number
    z: number
    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }
}

server.world.afterEvents.entityHealthChanged.subscribe(data => {
    function rand() {
        return 1 - Math.random() * 2
    }
    if (data.newValue < data.oldValue && data.entity.typeId != "minecraft:player") {
        let loc = data.entity.location
        server.world.getDimension("overworld").spawnEntity("mmorpg:damagedisplay", new Vector(loc.x + rand(), loc.y + 1, loc.z + rand())).nameTag = `${(data.oldValue - data.newValue).toFixed(1)}`
    }
})