import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'

var world = server.world
var dimension = world.getDimension("minecraft:overworld")

const avoidableentities = ["minecraft:player", "minecraft:item", "minecraft:arrow", "minecraft:xp_orb", "mmorpg:sculkblast", "minecraft:wither_skull", "minecraft:wither_skull_dangerous", "minecraft:wither"];




world.afterEvents.entityHitEntity.subscribe(eventData => {
    if (eventData.damagingEntity.typeId == "minecraft:player") {

        var player = eventData.damagingEntity
        var entity = eventData.hitEntity
        var magicalpower = player.getDynamicProperty("magicalpower") as number
        var equippable = player.getComponent("equippable") as server.EntityEquippableComponent

        switch (equippable.getEquipmentSlot(server.EquipmentSlot.Mainhand).typeId) {
            case "mmorpg:biggraysword":
                if (world.scoreboard.getObjective("mana").getScore(player) > 9) {

                    player.runCommand("scoreboard players remove @s mana 10")
                    entity.applyDamage(1 + Math.trunc(magicalpower * 1.5), {
                        damagingEntity: player,
                        cause: 'entityAttack' as server.EntityDamageCause
                    })
                    console.warn(magicalpower)
                }
                break;
        }
    }

})

world.afterEvents.itemUse.subscribe(eventData => {


    var item = eventData.itemStack
    var player = eventData.source as server.Player
    var magicalpower = player.getDynamicProperty("magicalpower") as number
    var inventory = player.getComponent("inventory") as server.EntityInventoryComponent
    function addlore(lore) {
        var loreitem = item.clone() as server.ItemStack
        loreitem.setLore(lore)

        if (inventory.container.getItem(player.selectedSlot).typeId == loreitem.typeId) {
            inventory.container.setItem(player.selectedSlot, loreitem)
        }
    }
    switch (item.typeId) {
        case "mmorpg:return":
            var form = new ui.ActionFormData()
                .title('Choose Teleport Location')
                .button('Spawn')
                .button('Plot')
                .button('Dungeons')

            if (world.scoreboard.getObjective('spawntimer').getScore(player) > 200) {
                form.show(player).then(result => {
                    if (result.selection == 0) {
                        player.runCommand('tp @s 0 66 0')
                    } else if (result.selection == 1) {
                        player.runCommand('tp @s 39990 -57 ' + world.scoreboard.getObjective('plotcords').getScore(player))
                    } else if (result.selection == 2) {
                        player.runCommand('tp @s 500 50 500')
                    }
                })
            }


            break;
        case "mmorpg:purpledagger":
            addlore(["§8Dash and deal damage, you can dash backwards by crouching"])
            if (world.scoreboard.getObjective('mana').getScore(player) > 19) {
                let vector3 = player.getViewDirection()
                if (player.isSneaking) {
                    player.applyKnockback(vector3.x * -1, vector3.z * -1, 3, 0.3)


                } else {
                    player.applyKnockback(vector3.x, vector3.z, 3, 0.3)

                }
                player.runCommandAsync("scoreboard players remove @s mana 20")
                let entity = player.getEntitiesFromViewDirection()
                entity.forEach(entity => {
                    if (!avoidableentities.includes(entity.entity.typeId)) {
                        entity.entity.applyDamage(10 + magicalpower * 2, {
                            damagingEntity: player,
                            cause: 'entityAttack' as server.EntityDamageCause
                        })
                        entity.entity.runCommandAsync('particle minecraft:critical_hit_emitter ~ ~1 ~')
                    }

                })
            }
            break;
        case "mmorpg:withermenace":
            addlore(["§8Slow down and decrease distance between you and an enemy"])
            if (world.scoreboard.getObjective('mana').getScore(player) > 39) {
                if (player.getEntitiesFromViewDirection().length > 0) {
                    player.runCommandAsync('scoreboard players remove @s mana 40')
                    player.getEntitiesFromViewDirection().forEach(entity => {
                        if (!avoidableentities.includes(entity.entity.typeId)) {
                            if (entity.distance < 8) {
                                let vector3 = player.getViewDirection()
                                if (!avoidableentities.includes(entity.entity.typeId)) {
                                    entity.entity.applyKnockback(vector3.x * -1, vector3.z * -1, 3, 0.3)
                                    entity.entity.addEffect('slowness', 100, { amplifier: 2 })
                                    entity.entity.applyDamage(20 + magicalpower, {
                                        damagingEntity: player,
                                        cause: 'entityAttack' as server.EntityDamageCause
                                    })
                                }
                            }
                        }
                    })
                }
            }






            break;
        case "mmorpg:witherscythe":
            addlore(["§8Jump up then slam down dealing massive damage"])
            if (world.scoreboard.getObjective('mana').getScore(player) > 69) {
                player.runCommandAsync('scoreboard players remove @s mana 70')
                let vector3 = player.getViewDirection()

                player.applyKnockback(0, 0, 0, 1)


                server.system.runTimeout(() => {
                    player.playSound('ambient.weather.lightning.impact')
                    player.runCommand('particle minecraft:knockback_roar_particle')
                    player.applyKnockback(vector3.x, vector3.z, 7, -4)
                    player.addEffect('slow_falling', 30, { showParticles: false })
                }, 7)
                server.system.runTimeout(() => {

                    dimension.getEntities({ location: player.location, maxDistance: 8 }).forEach(entity => {
                        entity.applyDamage(30 + magicalpower * 2, {
                            damagingEntity: player,
                            cause: 'entityAttack' as server.EntityDamageCause
                        })
                    })

                }, 13)
            }
            break;
        case "mmorpg:forbiddenscythe":
            addlore(["§8Teleport to an enemy dealing damage", "§8or jump dealing damage", "§8depending if you are sprinting or not"])
            if (world.scoreboard.getObjective("mana").getScore(player) > 29) {

                if (player.getEntitiesFromViewDirection().length > 0) {
                    player.runCommand("scoreboard players remove @s mana 30")
                    let subject = player.getEntitiesFromViewDirection()[0]
                    let entity = subject.entity
                    let currentrotation = player.getViewDirection()
                    if (!player.isSprinting) {
                        player.tryTeleport(entity.location)

                        player.applyKnockback(currentrotation.x * -1, currentrotation.z * -1, 3, 0.7)

                    } else {
                        player.applyKnockback(currentrotation.x, currentrotation.z, 3, 0.7)

                    }

                    (entity.applyDamage(35 + magicalpower, {
                        damagingEntity: player,
                        cause: 'entityAttack' as server.EntityDamageCause
                    }))
                }
            }
            break;
        case "mmorpg:scarletfury":
            addlore(["§8Dash in a direction and deal damage"])
            if (world.scoreboard.getObjective("mana").getScore(player) > 49) {
                player.runCommandAsync("scoreboard players remove @s mana 50")
                let currentrotation = player.getViewDirection()
                let entites = dimension.getEntities({ location: player.location, maxDistance: 10 })
                player.applyKnockback(currentrotation.x, currentrotation.z, 20, -100)
                server.system.runTimeout(() => {
                    dimension.getEntities({ location: player.location, maxDistance: 10 }).forEach(entity => {
                        if (!avoidableentities.includes(entity.typeId)) {
                            entity.applyDamage(35 + Math.trunc(magicalpower * 1.5), {
                                damagingEntity: player,
                                cause: 'entityAttack' as server.EntityDamageCause
                            })
                            entity.applyKnockback(0, 0, 0, 0.6)

                        }
                    })

                }, 4)
                entites.forEach(entity => {
                    if (!avoidableentities.includes(entity.typeId)) {
                        entity.applyDamage(35, {
                            damagingEntity: player,
                            cause: 'entityAttack' as server.EntityDamageCause
                        })
                        entity.applyKnockback(0, 0, 0, 0.6)

                    }
                })
            }
            break;
        case "mmorpg:sculksword":
            addlore(["§8Dash then return to the point where you used this ability after 5 seconds"])
            if (world.scoreboard.getObjective("mana").getScore(player) > 69) {
                player.runCommandAsync("scoreboard players remove @s mana 70")
                let startpos = player.location
                player.runCommand("particle mmorpg:uselessswordparticle ~ ~ ~")
                player.applyKnockback(player.getViewDirection().x, player.getViewDirection().z, 1.5, 0.5)

                server.system.runTimeout(() => {
                    let dx = player.location.x - startpos.x
                    let dy = player.location.y - startpos.y
                    let dz = player.location.z - startpos.z
                    let sumofsquares = dx * dx + dy * dy + dz * dz
                    if (Math.sqrt(sumofsquares) < 100) {
                        player.tryTeleport(startpos)
                    }
                }, 100)
            }

            break;
        case "mmorpg:applesword":


            addlore(["§8Using this ability gives", "§8you and all nearby players", "§8regeneration for 5 seconds"])
            if (world.scoreboard.getObjective("mana").getScore(player) > 29) {


                player.runCommand("effect @a[r=5] regeneration 5 2 true")
                player.runCommand("scoreboard players remove @s mana 30")
            }
            break;
        case "mmorpg:wolfsword":
            addlore(["§8Gives you speed for 20 seconds"])
            if (world.scoreboard.getObjective("mana").getScore(player) > 39) {


                player.runCommand("effect @a[r=5] speed 20 1 true")
                player.runCommand("scoreboard players remove @s mana 40")
            }
            break;
        case "mmorpg:heavyaetheriumsword":
            addlore(["§8Teleport to the nearest enemy and deal area damage knocking up enemies"])
            if (dimension.getEntities({ location: player.location, maxDistance: 10, excludeFamilies: ["player"] }).length > 0) {
                if (world.scoreboard.getObjective("mana").getScore(player) > 59) {
                    player.runCommandAsync("scoreboard players remove @s mana 60")

                    var otherEntity = dimension.getEntities({ location: player.location, maxDistance: 10, excludeFamilies: ["player"] })[0] as server.Entity
                    let tpbool = player.tryTeleport({ x: otherEntity.location.x, y: otherEntity.location.y, z: otherEntity.location.z }, { checkForBlocks: true, })
                    if (tpbool) {
                        player.addEffect("slow_falling", 10, { showParticles: false })

                        dimension.getEntities({ location: player.location, maxDistance: 5, excludeFamilies: ["player", "npc", "item", "projectile"] }).forEach(
                            entity => {

                                entity.applyDamage(25 + magicalpower, {
                                    damagingEntity: player,
                                    cause: 'entityAttack' as server.EntityDamageCause
                                })

                                entity.applyKnockback(0, 0, 0, 1)

                            }
                        )
                    }
                }
            }
            break;
        case "mmorpg:twilightblossom":
            addlore(["§8Deal massive damage to", "§8all enemies in a 7 block radius"])
            if (dimension.getEntities({ location: player.location, maxDistance: 7, families: ["mob"] }).length > 0 && world.scoreboard.getObjective("mana").getScore(player) > 99) {
                player.runCommandAsync("scoreboard players remove @s mana 100")
                player.playSound("sword.twilightblossom")
                dimension.getEntities({ location: player.location, maxDistance: 7, families: ["mob"] }).forEach(entity => {
                    dimension.spawnParticle("mmorpg:twilightblossomparticle", entity.location)
                    entity.applyDamage(30 + magicalpower, {
                        damagingEntity: player,
                        cause: 'entityAttack' as server.EntityDamageCause
                    })
                })
            }


            break;
        case "minecraft:glow_ink_sac":
            const x = player.location.x
            const z = player.location.z
            var a = 0
            while (a < 20) {
                dimension.getEntities({ location: { x: x + a, y: player.location.y, z: player.location.z }, maxDistance: 0.6 }).forEach(entity => {
                    entity.applyDamage(25 + magicalpower, {
                        damagingEntity: player,
                        cause: 'entityAttack' as server.EntityDamageCause
                    })
                })
                dimension.getEntities({ location: { x: x - a, y: player.location.y, z: player.location.z }, maxDistance: 0.6 }).forEach(entity => {
                    entity.applyDamage(25 + magicalpower, {
                        damagingEntity: player,
                        cause: 'entityAttack' as server.EntityDamageCause
                    })
                })
                a++
            }
            a = 0
            while (a < 20) {
                dimension.getEntities({ location: { x: player.location.x, y: player.location.y, z: z + a }, maxDistance: 0.6 }).forEach(entity => {
                    entity.applyDamage(25 + magicalpower, {
                        damagingEntity: player,
                        cause: 'entityAttack' as server.EntityDamageCause
                    })
                })
                dimension.getEntities({ location: { x: player.location.x, y: player.location.y, z: z + a }, maxDistance: 0.6 }).forEach(entity => {
                    entity.applyDamage(25 + magicalpower, {
                        damagingEntity: player,
                        cause: 'entityAttack' as server.EntityDamageCause
                    })
                })
                a++
            }
            break;
        case "mmorpg:aetheriumblade":
            if (dimension.getEntities({ location: player.location, maxDistance: 5, families: ["mob"] }).length > 0 && world.scoreboard.getObjective("mana").getScore(player) > 49) {
                dimension.spawnParticle("mmorpg:aetheriumbladeparticle", player.location)
                player.runCommandAsync("scoreboard players remove @s mana 50")

                dimension.getEntities({ location: player.location, maxDistance: 5, families: ["mob"] }).forEach(entity => {
                    entity.applyDamage(15 + magicalpower, {
                        damagingEntity: player,
                        cause: 'entityAttack' as server.EntityDamageCause
                    })
                    entity.applyKnockback(0, 0, 0, 0.7)
                })
            }

            break;

    }
})

