import * as server from '@minecraft/server'
export function snowregion(players: server.Player[]) {

    const world = server.world

    const dimension = world.getDimension("overworld")
    players.forEach((player) => {
        if (player.location.x < 8000 && player.location.x > 7000 && player.location.z < 8000 && player.location.z > 7000) {


            dimension.spawnParticle("mmorpg:snow", player.location)
            if (Math.floor(Math.random() * 500) == 0) {
                const radians = Math.floor(Math.random() * 360 + 1) * Math.PI / 180
                const cosval = Math.cos(radians);
                const sinval = Math.sin(radians);
                const xlocation = player.location.x + 30 * cosval
                const zlocation = player.location.z + 30 * sinval
                dimension.spawnParticle("mmorpg:eyes", { x: xlocation, y: player.location.y + 2, z: zlocation })
            }
        }

    })


}