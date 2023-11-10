import * as server from '@minecraft/server'

const world = server.world

export function farming(data: server.PlayerBreakBlockBeforeEvent) {

    const id = data.block.type.id
    const player = data.player
    const growth = data.block.permutation.getState("growth")
    const harvesting = player.getDynamicProperty("harvesting") as number
    const regrowth = player.getDynamicProperty("regrowth") as number
    const rngDrop = (Math.floor(Math.random() * harvesting) + 1)
    function regrow(id) {
        if (data.block.x > 9000 && data.block.x < 10000 && data.block.z < 10000 && data.block.z > 9000 || regrowth > 0) {


            data.block.setPermutation(server.BlockPermutation.resolve(id).withState("growth", regrowth))
        }
    }
    const inv = player.getComponent("inventory") as server.EntityInventoryComponent
    if (id == "minecraft:wheat") {
        if (growth == 7) {
            server.system.run(() => {
                inv.container.addItem(new server.ItemStack("minecraft:wheat", rngDrop))
                regrow(id)
            })
        } else {
            data.cancel = true
        }
    } else if (id == "minecraft:carrots") {
        if (growth == 7) {
            server.system.run(() => {
                inv.container.addItem(new server.ItemStack("minecraft:carrot", rngDrop))
                regrow(id)
            })
        } else {
            data.cancel = true
        }
    } else if (id == "minecraft:potatoes") {
        if (growth == 7) {
            server.system.run(() => {
                inv.container.addItem(new server.ItemStack("minecraft:potato", rngDrop))
                regrow(id)
            })
        } else {
            data.cancel = true
        }
    }
}