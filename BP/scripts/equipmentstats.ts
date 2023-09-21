import * as server from '@minecraft/server'

const world = server.world

world.afterEvents.worldInitialize.subscribe(data => {
    var maxmana = new server.DynamicPropertiesDefinition().defineNumber("maxmana")
    data.propertyRegistry.registerEntityTypeDynamicProperties(maxmana, server.EntityTypes.get("minecraft:player"))
    var manaregen = new server.DynamicPropertiesDefinition().defineNumber("manaregen")
    data.propertyRegistry.registerEntityTypeDynamicProperties(manaregen, server.EntityTypes.get("minecraft:player"))
    var magicalpower = new server.DynamicPropertiesDefinition().defineNumber("magicalpower")
    data.propertyRegistry.registerEntityTypeDynamicProperties(magicalpower, server.EntityTypes.get("minecraft:player"))
})

server.system.runInterval(() => {
    world.getAllPlayers().forEach(player => {
        var maxmana: number = 50
        var manaregen: number = 20
        var magicalpower: number = 0
        const inventory = player.getComponent("inventory") as server.EntityInventoryComponent
        const helditemid = inventory.container.getSlot(player.selectedSlot).typeId
        const equipment = player.getComponent("equippable") as server.EntityEquippableComponent
        if (helditemid == "mmorpg:witherscythe") {
            maxmana = maxmana + 20
        }
        if (equipment.getEquipmentSlot(server.EquipmentSlot.Head) != undefined) {
            if (equipment.getEquipmentSlot(server.EquipmentSlot.Head).typeId == "mmorpg:light_aetherium_helmet") {
                maxmana = maxmana + 20
                manaregen--
                magicalpower = magicalpower + 2
            }
        }
        if (equipment.getEquipment(server.EquipmentSlot.Chest) != undefined) {
            if (equipment.getEquipmentSlot(server.EquipmentSlot.Chest).typeId == "mmorpg:light_aetherium_chestplate") {
                maxmana = maxmana + 20
                manaregen--
                magicalpower = magicalpower + 2
            }
        }
        if (equipment.getEquipmentSlot(server.EquipmentSlot.Legs) != undefined) {
            if (equipment.getEquipmentSlot(server.EquipmentSlot.Legs).typeId == "mmorpg:light_aetherium_leggings") {
                maxmana = maxmana + 20
                manaregen--
                magicalpower = magicalpower + 2
            }
        }
        if (equipment.getEquipmentSlot(server.EquipmentSlot.Feet) != undefined) {
            if (equipment.getEquipmentSlot(server.EquipmentSlot.Feet).typeId == "mmorpg:light_aetherium_boots") {
                maxmana = maxmana + 20
                manaregen--
                magicalpower = magicalpower + 2
            }
        }


        player.setDynamicProperty("magicalpower", magicalpower)
        player.setDynamicProperty("manaregen", Math.trunc(manaregen))
        player.setDynamicProperty("maxmana", maxmana)
    })
})