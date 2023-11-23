import * as server from '@minecraft/server'

const world = server.world



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


export function equipment(player: server.Player) {

    var maxmana: number = 75
    var manaregen: number = 20
    var magicalpower: number = 0
    var haste: number = -1
    var healthboost: number = -1
    var luck: number = 1
    var speed: number = -1
    var harvesting: number = 1
    var regrowth: number = 0
    var setbonustimings: number = player.getDynamicProperty("setbonustimings") as number
    const inventory = player.getComponent("inventory") as server.EntityInventoryComponent
    const helditemid = inventory.container.getSlot(player.selectedSlot).typeId
    const equipment = player.getComponent("equippable") as server.EntityEquippableComponent
    const helmetid = equipment.getEquipmentSlot(server.EquipmentSlot.Head).typeId
    const chestplateid = equipment.getEquipmentSlot(server.EquipmentSlot.Chest).typeId
    const leggingsid = equipment.getEquipmentSlot(server.EquipmentSlot.Legs).typeId
    const bootsid = equipment.getEquipmentSlot(server.EquipmentSlot.Feet).typeId
    const offhandid = equipment.getEquipment(server.EquipmentSlot.Offhand)?.typeId
    const armorids = [0, 0, 0, 0, 0, 0, 0, 0]

    switch (helditemid) {
        case "mmorpg:witherscythe":
            maxmana = maxmana + 20
            break;
        case "mmorpg:aetherium_pickaxe":
            haste++
            break;
        case "mmorpg:ruby_pickaxe":
            luck = luck + 0.1
            break;
        case "mmorpg:millionaire_pickaxe":
            haste = haste + 2
            luck = luck + 0.2
            break;
        case "mmorpg:sculked_hoe":
            harvesting++
            break;
        case "mmorpg:ruby_hoe":
            harvesting = harvesting++
            regrowth++
            break;
        case "mmorpg:aetherium_hoe":
            harvesting = harvesting + 2
            break;
        default: break;
    }



    switch (helmetid) {
        case "mmorpg:light_aetherium_helmet":
            maxmana = maxmana + 20
            manaregen--
            magicalpower = magicalpower + 2
            armorids[0]++
            break;
        case "mmorpg:sculked_helmet":
            manaregen = manaregen - 3
            armorids[1]++
            break;

        case "mmorpg:miner_helmet":
            player.addEffect("night_vision", 205, { showParticles: false })
            break;
        case "mmorpg:magma_helmet":
            maxmana = maxmana + 10
            healthboost++
            armorids[2]++
            break;
        case "mmorpg:enchanted_diamond_helmet":
            healthboost++
            manaregen = manaregen - 3
            armorids[3]++
            break;
        case "mmorpg:farmer_helmet":
            harvesting = harvesting + 2
            break;
        case "mmorpg:frost_helmet":
            magicalpower = magicalpower + 5
            maxmana = maxmana + 30
            armorids[4]++
            break;
        case "mmorpg:frostfire_helmet":
            maxmana = maxmana + 50
            magicalpower = magicalpower + 7
            healthboost++
            armorids[5]++
            break;
        default: break;
    }



    switch (chestplateid) {
        case "mmorpg:light_aetherium_chestplate":
            maxmana = maxmana + 20
            manaregen--
            magicalpower = magicalpower + 2
            armorids[0]++
            break;
        case "mmorpg:sculked_chestplate":
            magicalpower = magicalpower + 5
            armorids[1]++
            break;
        case "mmorpg:miner_chestplate":
            luck = luck + 0.2
            break;
        case "mmorpg:magma_chestplate":
            healthboost = healthboost + 2
            magicalpower = magicalpower + 3
            armorids[2]++
            break;
        case "mmorpg:enchanted_diamond_chestplate":
            healthboost = healthboost + 2
            manaregen = manaregen - 3
            speed++
            armorids[3]++
            break;
        case "mmorpg:farmer_chestplate":
            regrowth++
            harvesting = harvesting + 2
            break;
        case "mmorpg:frost_chestplate":
            magicalpower = magicalpower + 5
            armorids[4]++
            speed++
            break;
        case "mmorpg:frostfire_chestplate":
            magicalpower = magicalpower + 10
            speed++
            healthboost = healthboost + 2
            armorids[5]++
            break;
        default: break;
    }



    switch (leggingsid) {
        case "mmorpg:light_aetherium_leggings":
            maxmana = maxmana + 20
            manaregen--
            magicalpower = magicalpower + 2
            armorids[0]++
            break;
        case "mmorpg:sculked_leggings":
            maxmana = maxmana + 20
            armorids[1]++
            break;
        case "mmorpg:miner_leggings":
            haste++
            break;
        case "mmorpg:magma_leggings":
            manaregen = manaregen - 5
            healthboost++
            armorids[2]++
            break;
        case "mmorpg:enchanted_diamond_leggings":
            healthboost++
            manaregen = manaregen - 3
            maxmana = maxmana + 50
            armorids[3]++
            break;
        case "mmorpg:farmer_leggings":
            harvesting = harvesting + 2
            speed++
            break;
        case "mmorpg:frost_leggings":
            armorids[4]++
            magicalpower = magicalpower + 5
            speed++
            break;
        case "mmorpg:frostfire_leggings":
            healthboost++
            speed++
            magicalpower = magicalpower + 7
            manaregen = manaregen - 5
            armorids[5]++
            break;
        default: break;

    }


    switch (bootsid) {
        case "mmorpg:light_aetherium_boots":
            maxmana = maxmana + 20
            manaregen--
            magicalpower = magicalpower + 2
            armorids[0]++
            break;
        case "mmorpg:sculked_boots":
            maxmana = maxmana + 20
            armorids[1]++
            break;
        case "mmorpg:miner_boots":
            haste++
            break;
        case "mmorpg:magma_boots":
            healthboost++
            maxmana = maxmana + 10
            armorids[2]++
            break;
        case "mmorpg:enchanted_diamond_boots":
            healthboost++
            manaregen = manaregen - 3
            armorids[3]++
            break;
        case "mmorpg:farmer_boots":
            speed++
            break;
        case "mmorpg:frost_boots":
            magicalpower = magicalpower + 5
            armorids[4]++
            maxmana = maxmana + 30
            break;
        case "mmorpg:frostfire_boots":
            maxmana = maxmana + 50
            magicalpower = magicalpower + 7
            healthboost++
            armorids[5]++
            break;
        default: break;
    }



    switch (offhandid) {
        case "mmorpg:aetheriumstar":
            magicalpower = magicalpower + 10
            break;
        case "mmorpg:ruby_heart":
            healthboost = healthboost + 2
            break;
        case "mmorpg:luck_charm":
            luck = luck + 0.1
            break;
        case "mmorpg:redstone_infuser":
            haste++
            break;
        case "mmorpg:golden_ring":
            speed++
            break;
        case "mmorpg:farming_gloves":
            harvesting = harvesting + 4
            break;
        case "mmorpg:magical_watering_can":
            regrowth = regrowth + 2
            break;
        case "mmorpg:frozen_gauntlet":
            magicalpower += Math.round(((maxmana - world.scoreboard.getObjective("mana").getScore(player)) / 5))
            break;
        case "mmorpg:magma_gauntlet":
            magicalpower += Math.round(world.scoreboard.getObjective("mana").getScore(player) / 8)
            break;
        case "mmorpg:quartz_mana_charm":
            maxmana = maxmana + 100
            break;
        case "mmorpg:copper_mana_amulet":
            manaregen = manaregen - 5
            break;
        case "mmorpg:celestial_vitality_amulet":
            let hpcomp = player.getComponent("health") as server.EntityHealthComponent
            magicalpower += Math.trunc(hpcomp.currentValue / 2)
            break;
        case "mmorpg:lunar_sundial_charm":
            let a = world.getTimeOfDay()
            if (a > 1000 && a < 13000) {

                if (server.system.currentTick % 20 == 0) {
                    const hpcomp = player.getComponent("health") as server.EntityHealthComponent
                    hpcomp.setCurrentValue(hpcomp.currentValue + 1)

                }
            } else {
                magicalpower = magicalpower + 15

            }
            break;
        default: break;
    }

    switch (armorids.indexOf(4)) {
        case 0:
            if (player.isSneaking) {
                if (setbonustimings < 20 && player.getComponent('health').currentValue > 6) {
                    player.applyDamage(6, { cause: server.EntityDamageCause.void } as server.EntityApplyDamageOptions)
                    setbonustimings = 110
                    player.runCommand("scoreboard players add @s mana 50")

                }
            }
            if (setbonustimings > 0) {
                magicalpower = magicalpower + 20
            }
            break;

        case 1:
            if (player.isSneaking) {
                player.addEffect("blindness", 25, { showParticles: false, amplifier: 255 })
                player.addEffect("resistance", 5, { showParticles: false })
                player.addEffect("slowness", 5, { showParticles: false, amplifier: 25 })
                if (world.getAbsoluteTime() % 2 == 0) {
                    world.scoreboard.getObjective("mana").addScore(player, 1)
                }
            }

            break;
        case 2:
            if (player.isSneaking && world.scoreboard.getObjective("mana").getScore(player) > 1 && server.system.currentTick % 5 == 0) {
                world.getDimension("overworld").getEntities({ location: player.location, maxDistance: 6, families: ["mob"], excludeFamilies: ["player"] }).forEach(entity => {
                    entity.setOnFire(2)
                    entity.applyDamage(5 + magicalpower / 4, {
                        damagingEntity: player,
                        cause: 'entityAttack' as server.EntityDamageCause
                    });
                    entity.clearVelocity()
                })
                world.getDimension("overworld").spawnParticle("mmorpg:firesword", player.location)
                world.scoreboard.getObjective("mana").addScore(player, -2)
            }
            break;
        case 3:
            if (server.system.currentTick % 20 == 0) {
                const hpcomp = player.getComponent("health") as server.EntityHealthComponent
                hpcomp.setCurrentValue(hpcomp.currentValue + 1)

            }

            break;
        case 4:
            if (server.system.currentTick % 5 == 0) {
                world.getDimension("overworld").getEntities({ location: player.location, maxDistance: 7, families: ["mob"], excludeFamilies: ["player"] }).forEach(entity => {
                    entity.addEffect("slowness", 10, { showParticles: true, amplifier: 0 })

                    world.scoreboard.getObjective("mana").addScore(player, 1)
                })
            }
            world.getDimension("overworld").spawnParticle("mmorpg:frostarmorparticle", player.location)
            break;
        case 5:
            if (server.system.currentTick % 10 == 0) {
                world.getDimension("overworld").getEntities({ location: player.location, maxDistance: 7, families: ["mob"], excludeFamilies: ["player"] }).forEach(entity => {
                    world.getDimension("overworld").spawnParticle("mmorpg:frostfirearmor", entity.location)
                    entity.addEffect("slowness", 15, { showParticles: true, amplifier: 0 })
                    entity.setOnFire(1)
                    entity.applyDamage(1 + magicalpower / 10, { cause: server.EntityDamageCause.entityAttack, damagingEntity: player })
                    entity.clearVelocity()
                    world.scoreboard.getObjective("mana").addScore(player, 2)
                })
            }
            break;
        default: break;
    }

    if (setbonustimings > 0) {
        setbonustimings = setbonustimings - 1
    }


    if (haste > -1) {
        player.addEffect("haste", 25, { amplifier: haste, showParticles: false })
    }
    if (speed > -1) {
        player.addEffect("speed", 25, { amplifier: speed, showParticles: false })
    }
    if (healthboost > -1) {
        player.addEffect("health_boost", 25, { amplifier: healthboost, showParticles: false })
        player.setDynamicProperty("healthboost", healthboost)
    }
    player.setDynamicProperty("setbonustimings", setbonustimings)
    player.setDynamicProperty("magicalpower", magicalpower)
    if (manaregen >= 2) {
        player.setDynamicProperty("manaregen", manaregen)
    } else {
        player.setDynamicProperty("manaregen", 2)
    }
    player.setDynamicProperty("maxmana", maxmana)
    player.setDynamicProperty("luck", luck)
    player.setDynamicProperty("harvesting", harvesting)
    player.setDynamicProperty("regrowth", regrowth)


}