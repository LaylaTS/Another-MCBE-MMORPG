import * as server from '@minecraft/server'

const world = server.world

world.afterEvents.worldInitialize.subscribe(data => {
    var maxmana = new server.DynamicPropertiesDefinition().defineNumber("maxmana")
    data.propertyRegistry.registerEntityTypeDynamicProperties(maxmana, server.EntityTypes.get("minecraft:player"))
    var manaregen = new server.DynamicPropertiesDefinition().defineNumber("manaregen")
    data.propertyRegistry.registerEntityTypeDynamicProperties(manaregen, server.EntityTypes.get("minecraft:player"))
    var magicalpower = new server.DynamicPropertiesDefinition().defineNumber("magicalpower")
    data.propertyRegistry.registerEntityTypeDynamicProperties(magicalpower, server.EntityTypes.get("minecraft:player"))
    var setbonustimings = new server.DynamicPropertiesDefinition().defineNumber("setbonustimings", 0)
    data.propertyRegistry.registerEntityTypeDynamicProperties(setbonustimings, server.EntityTypes.get("minecraft:player"))
    var luck = new server.DynamicPropertiesDefinition().defineNumber("luck", 0)
    data.propertyRegistry.registerEntityTypeDynamicProperties(luck, server.EntityTypes.get("minecraft:player"))

})

world.afterEvents.entityHurt.subscribe(eventData => {
    if (eventData.hurtEntity.typeId == "minecraft:player") {
        const player = eventData.hurtEntity as server.Player
        const equipment = player.getComponent("equippable") as server.EntityEquippableComponent
        if (equipment.getEquipmentSlot(server.EquipmentSlot.Offhand) != undefined) {
            if (equipment.getEquipmentSlot(server.EquipmentSlot.Offhand).typeId == "mmorpg:giantspidereye") {
                player.runCommand('scoreboard players add @s mana 15')
            }
        }

    }
})


server.system.runInterval(() => {
    world.getAllPlayers().forEach(player => {
        var maxmana: number = 50
        var manaregen: number = 20
        var magicalpower: number = 0
        var haste: number = -1
        var healthboost: number = -1
        var luck: number = 1

        var setbonustimings: number = player.getDynamicProperty("setbonustimings") as number
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
            } else if (equipment.getEquipmentSlot(server.EquipmentSlot.Head).typeId == "mmorpg:sculked_helmet") {
                manaregen = manaregen - 3
            } else if (equipment.getEquipmentSlot(server.EquipmentSlot.Head).typeId == "minecraft:golden_helmet") {
                player.addEffect("night_vision", 205, { showParticles: false })
            }
        }
        if (equipment.getEquipment(server.EquipmentSlot.Chest) != undefined) {
            if (equipment.getEquipmentSlot(server.EquipmentSlot.Chest).typeId == "mmorpg:light_aetherium_chestplate") {
                maxmana = maxmana + 20
                manaregen--
                magicalpower = magicalpower + 2
            } else if (equipment.getEquipmentSlot(server.EquipmentSlot.Chest).typeId == "mmorpg:sculked_chestplate") {
                magicalpower = magicalpower + 5
            } else if (equipment.getEquipmentSlot(server.EquipmentSlot.Chest).typeId == "minecraft:golden_chestplate") {
                luck = luck + 0.2
            }
        }
        if (equipment.getEquipmentSlot(server.EquipmentSlot.Legs) != undefined) {
            if (equipment.getEquipmentSlot(server.EquipmentSlot.Legs).typeId == "mmorpg:light_aetherium_leggings") {
                maxmana = maxmana + 20
                manaregen--
                magicalpower = magicalpower + 2
            } else if (equipment.getEquipmentSlot(server.EquipmentSlot.Legs).typeId == "mmorpg:sculked_leggings") {
                maxmana = maxmana + 20
            } else if (equipment.getEquipmentSlot(server.EquipmentSlot.Legs).typeId == "minecraft:golden_leggings") {
                haste++
            }
        }
        if (equipment.getEquipmentSlot(server.EquipmentSlot.Feet) != undefined) {
            if (equipment.getEquipmentSlot(server.EquipmentSlot.Feet).typeId == "mmorpg:light_aetherium_boots") {
                maxmana = maxmana + 20
                manaregen--
                magicalpower = magicalpower + 2
            } else if (equipment.getEquipmentSlot(server.EquipmentSlot.Feet).typeId == "mmorpg:sculked_boots") {
                maxmana = maxmana + 20
            } else if (equipment.getEquipmentSlot(server.EquipmentSlot.Feet).typeId == "minecraft:golden_boots") {
                haste++
            }
        }
        if (equipment.getEquipmentSlot(server.EquipmentSlot.Offhand) != undefined) {
            if (equipment.getEquipmentSlot(server.EquipmentSlot.Offhand).typeId == "mmorpg:aetheriumstar") {
                magicalpower = magicalpower + 10
            }
            if (equipment.getEquipmentSlot(server.EquipmentSlot.Offhand).typeId == "mmorpg:ruby_heart") {
                healthboost = healthboost + 2
            }
        }
        if (equipment.getEquipmentSlot(server.EquipmentSlot.Feet).typeId == "mmorpg:light_aetherium_boots") {
            if (equipment.getEquipmentSlot(server.EquipmentSlot.Chest).typeId == "mmorpg:light_aetherium_chestplate") {
                if (equipment.getEquipmentSlot(server.EquipmentSlot.Legs).typeId == "mmorpg:light_aetherium_leggings") {
                    if (equipment.getEquipmentSlot(server.EquipmentSlot.Head).typeId == "mmorpg:light_aetherium_helmet") {

                        if (player.isSneaking) {
                            if (setbonustimings < 80 && player.getComponent('health').currentValue > 6) {
                                player.applyDamage(6, { cause: server.EntityDamageCause.void } as server.EntityApplyDamageOptions)
                                setbonustimings = 110
                                player.runCommand("scoreboard players add @s mana 50")

                            }
                        }
                        if (setbonustimings > 0) {
                            magicalpower = magicalpower + 20
                        }


                    }
                }
            }
        }
        if (equipment.getEquipmentSlot(server.EquipmentSlot.Feet).typeId == "mmorpg:sculked_boots") {
            if (equipment.getEquipmentSlot(server.EquipmentSlot.Chest).typeId == "mmorpg:sculked_chestplate") {
                if (equipment.getEquipmentSlot(server.EquipmentSlot.Legs).typeId == "mmorpg:sculked_leggings") {
                    if (equipment.getEquipmentSlot(server.EquipmentSlot.Head).typeId == "mmorpg:sculked_helmet") {
                        if (player.isSneaking) {
                            player.addEffect("blindness", 25, { showParticles: false, amplifier: 255 })
                            player.addEffect("resistance", 5, { showParticles: false })
                            player.addEffect("slowness", 5, { showParticles: false, amplifier: 25 })
                            if (world.getAbsoluteTime() % 2 == 0) {


                                world.scoreboard.getObjective("mana").addScore(player, 1)
                            }
                        }
                    }
                }
            }
        }
        if (setbonustimings > 0) {
            setbonustimings = setbonustimings - 1
        }
        if (haste > -1) {
            player.addEffect("haste", 25, { amplifier: haste, showParticles: false })
        }
        if (healthboost > -1) {
            player.addEffect("health_boost", 25, { amplifier: healthboost, showParticles: false })
        }

        player.setDynamicProperty("setbonustimings", setbonustimings)
        player.setDynamicProperty("magicalpower", magicalpower)
        player.setDynamicProperty("manaregen", Math.trunc(manaregen))
        player.setDynamicProperty("maxmana", maxmana)
        player.setDynamicProperty("luck", luck)

    })
})