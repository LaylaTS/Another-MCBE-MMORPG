import * as server from '@minecraft/server'

const world = server.world
const dimension = world.getDimension("overworld")

world.afterEvents.entityHealthChanged.subscribe(data => {
    function rand() {
        return 1 - Math.random() * 2
    }
    if (data.newValue < data.oldValue) {
        let loc = data.entity.location
        dimension.spawnEntity("mmorpg:damagedisplay", new server.Vector(loc.x + rand(), loc.y + 1, loc.z + rand())).nameTag = `${data.oldValue - data.newValue}`

    }
})