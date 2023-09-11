import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'

const world = server.world

world.afterEvents.worldInitialize.subscribe(eventData => {
    var weblock1x = new server.DynamicPropertiesDefinition()
    weblock1x.defineNumber("weblock1x", 0)
    var weblock1y = new server.DynamicPropertiesDefinition()
    weblock1y.defineNumber("weblock1y", 0)
    var weblock1z = new server.DynamicPropertiesDefinition()
    weblock1z.defineNumber("weblock1z", 0)

    eventData.propertyRegistry.registerWorldDynamicProperties(weblock1x)
    eventData.propertyRegistry.registerWorldDynamicProperties(weblock1y)
    eventData.propertyRegistry.registerWorldDynamicProperties(weblock1z)
})

world.afterEvents.blockPlace.subscribe(eventData => {
    var player = eventData.player
    if (eventData.player.hasTag('perms')) {
        const lastslot = eventData.player.getComponent('inventory') as server.EntityInventoryComponent;
        if (lastslot.container.getItem(8).typeId != undefined) {
            if (lastslot.container.getItem(8).typeId == "minecraft:pink_dye") {
                if (player.isSneaking) {
                    if (world.getDynamicProperty("weblock1x") != 0) {
                        var v3_1 = { x: world.getDynamicProperty("weblock1x") as number, y: world.getDynamicProperty("weblock1y") as number, z: world.getDynamicProperty("weblock1z") as number }
                        world.getDimension("minecraft:overworld").fillBlocks(v3_1, eventData.block.location, eventData.block.permutation)
                        world.setDynamicProperty('weblock1x', 0)
                        world.setDynamicProperty('weblock1y', 0)
                        world.setDynamicProperty('weblock1z', 0)
                    } else {
                        world.setDynamicProperty('weblock1x', eventData.block.x)
                        world.setDynamicProperty('weblock1y', eventData.block.y)
                        world.setDynamicProperty('weblock1z', eventData.block.z)

                    }
                }
            } else {
                world.setDynamicProperty('weblock1x', 0)
                world.setDynamicProperty('weblock1y', 0)
                world.setDynamicProperty('weblock1z', 0)
            }
        }



    }
})