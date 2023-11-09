import * as server from '@minecraft/server'

const world = server.world

export function farming(data: server.PlayerBreakBlockBeforeEvent) {

    const id = data.block.type.id
    const player = data.player
    const growth = data.block.permutation.getState("growth")
    const harvesting = player.getDynamicProperty("harvesting") as number
    function regrow(id) {
        if (data.block.x > 9000 && data.block.x < 10000 && data.block.z < 10000 && data.block.z > 9000) {


            data.block.setType(id)
        }
    }
    if (id == "minecraft:wheat") {
        if (growth == 7) {
            server.system.run(() => {

                player.runCommand(`give @s wheat ${Math.floor(Math.random() * 2 * harvesting)}`)
                regrow(id)
            })
        } else {
            data.cancel = true
        }
    } else if (id == "minecraft:carrots") {
        if (growth == 7) {
            server.system.run(() => {

                player.runCommand(`give @s carrot ${Math.floor(Math.random() * 2 * harvesting)}`)
                regrow(id)
            })
        } else {
            data.cancel = true
        }
    } else if (id == "minecraft:potatoes") {
        if (growth == 7) {
            server.system.run(() => {

                player.runCommand(`give @s potato ${Math.floor(Math.random() * 2 * harvesting)}`)
                regrow(id)
            })
        } else {
            data.cancel = true
        }
    }
}