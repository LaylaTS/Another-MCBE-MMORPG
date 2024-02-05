import * as server from '@minecraft/server'

const world = server.world
const dimension = world.getDimension("overworld")

function moveBoss() {
    const bossArray: server.Entity[] = []
    dimension.getEntities({ location: new server.Vector(-6000, 101, -6000), maxDistance: 500, families: ["wormbosssegment"] }).forEach(entity => {
        bossArray[entity.getDynamicProperty("bossSegment") as number] = entity

    })
    const entity = bossArray[0]
    const playerArray = dimension.getPlayers({ location: entity.location, maxDistance: 200 })
    if (playerArray.length > 0) {
        const player = playerArray[0]
        switch (world.getDynamicProperty("bossphase") as number) {
            case 0:

                var rotation = entity.getRotation().y
                rotation = rotation + 90
                const radians = rotation * Math.PI / 180;
                const cosval = Math.cos(radians);
                const sinval = Math.sin(radians);
                let xlocation = entity.location.x + 0.2 * cosval
                let zlocation = entity.location.z + 0.2 * sinval
                entity.teleport(new server.Vector(xlocation, 101, zlocation), { facingLocation: player.location, rotation: { x: 0, y: 1 } })

                if (Math.random() < 0.006) world.setDynamicProperty("bossphase", 1)
                break;
            case 1:
                dimension.spawnParticle("mmorpg:wormbosschargewarning", entity.location)
                server.system.runTimeout(() => {

                    entity.applyKnockback(entity.getViewDirection().x, entity.getViewDirection().z, 2.5, 0)

                    server.system.runTimeout(() => {
                        world.setDynamicProperty("bossphase", 0)

                    }, 10)
                }, 10)



        }


        for (let i = 99; i > 0; i--) {
            const entity = bossArray[i]
            const loc = bossArray[i - 1].location
            entity.teleport(loc, { facingLocation: player.location })
        }
    } else {
        bossArray.forEach(entity => {
            entity.kill()
        })
    }
}

server.system.runInterval(() => {
    //moveBoss()
})

