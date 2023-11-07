import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'
import { guildform } from './guilds.js'
import { mmorpgmenu } from './mmorpgmenu.js'

var world = server.world
var dimension = world.getDimension("minecraft:overworld")

const avoidableentities = ["minecraft:player", "minecraft:item", "minecraft:arrow", "minecraft:xp_orb", "mmorpg:sculkblast", "minecraft:wither_skull", "minecraft:wither_skull_dangerous", "minecraft:wither"];
const mana = world.scoreboard.getObjective("mana")


world.afterEvents.entityHitEntity.subscribe(eventData => {
    if (eventData.damagingEntity.typeId == "minecraft:player") {

        var player = eventData.damagingEntity
        var entity = eventData.hitEntity
        var magicalpower = player.getDynamicProperty("magicalpower") as number
        var equippable = player.getComponent("equippable") as server.EntityEquippableComponent

        switch (equippable.getEquipmentSlot(server.EquipmentSlot.Mainhand).typeId) {
            case "mmorpg:biggraysword":
                if (mana.getScore(player) > 9) {

                    player.runCommand("scoreboard players remove @s mana 10")
                    entity.applyDamage(1 + Math.trunc(magicalpower * 1.5), {
                        damagingEntity: player,
                        cause: 'entityAttack' as server.EntityDamageCause
                    })

                }
                break;
        }
    }

})

world.afterEvents.itemUse.subscribe(eventData => {


    var item = eventData.itemStack
    var player = eventData.source as server.Player
    var magicalpower = player.getDynamicProperty("magicalpower") as number
    const inventory = player.getComponent("inventory") as server.EntityInventoryComponent
    const manaamount = mana.getScore(player)
    function addlore(lore) {
        var loreitem = item.clone() as server.ItemStack
        loreitem.setLore(lore)


        if (inventory.container.getItem(player.selectedSlot).typeId == loreitem.typeId) {
            inventory.container.setItem(player.selectedSlot, loreitem)
        }
    }
    switch (item.typeId) {
        case "mmorpg:return":
            mmorpgmenu(player)
            break;
        case "mmorpg:guildmanager":
            guildform(player)
            break;
        case "mmorpg:rankadder":
            if (player.hasTag('perms')) {



                var rank = new ui.ModalFormData()
                    .title('Type in rank')
                    .textField('Type in rank', 'rank')

                rank.show(player).then(rankoutput => {
                    const players = world.getPlayers({})
                    const selection = new ui.ActionFormData()
                        .title("Choose Player")

                    players.forEach(playerui => {
                        selection.button(playerui.name)
                    })
                    selection.show(player).then(data => {
                        players[data.selection].setDynamicProperty("playerrank", rankoutput.formValues[0])
                    })
                })

            }


            break;
        case "mmorpg:purpledagger":
            var cooldown = item.getComponent("cooldown") as server.ItemCooldownComponent



            if (manaamount > 19 && player.getItemCooldown("purpledagger") == 0) {
                cooldown.startCooldown(player)
                let vector3 = player.getViewDirection()
                if (player.isSneaking) {
                    player.applyKnockback(vector3.x * -1, vector3.z * -1, 3, 0.3)


                } else {
                    player.applyKnockback(vector3.x, vector3.z, 3, 0.3)

                }
                mana.addScore(player, -20)
                let entity = player.getEntitiesFromViewDirection()
                entity.forEach(entity => {
                    if (!avoidableentities.includes(entity.entity.typeId)) {
                        entity.entity.applyDamage(10 + magicalpower * 2, {
                            damagingEntity: player,
                            cause: 'entityAttack' as server.EntityDamageCause
                        })

                    }

                })



            }
            break;
        case "mmorpg:withermenace":
            addlore(["§8Slow down an enemy", "§8and push them closer to you"])
            if (manaamount > 39) {
                if (player.getEntitiesFromViewDirection().length > 0) {
                    mana.addScore(player, -40)
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
            if (manaamount > 69) {
                mana.addScore(player, -70)
                let vector3 = player.getViewDirection()

                player.applyKnockback(0, 0, 0, 1)


                server.system.runTimeout(() => {
                    player.playSound('ambient.weather.lightning.impact')
                    player.runCommand('particle minecraft:knockback_roar_particle')
                    player.applyKnockback(vector3.x, vector3.z, 7, -4)
                    player.addEffect('slow_falling', 30, { showParticles: false })
                }, 7)
                server.system.runTimeout(() => {

                    dimension.getEntities({ location: player.location, maxDistance: 8, families: ["mob"], excludeNames: [player.name] }).forEach(entity => {
                        entity.applyDamage(30 + magicalpower * 2, {
                            damagingEntity: player,
                            cause: 'entityAttack' as server.EntityDamageCause
                        })
                    })

                }, 13)
            }
            break;
        case "mmorpg:forbiddenscythe":
            addlore(["§8Teleport to an enemy dealing damage", "§8or jump dealing damage", "§8depending on you sprinting"])
            if (manaamount > 29) {

                if (player.getEntitiesFromViewDirection().length > 0) {
                    mana.addScore(player, -30)
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
            if (manaamount > 49) {
                mana.addScore(player, -50)
                let currentrotation = player.getViewDirection()
                let entites = dimension.getEntities({ location: player.location, maxDistance: 10 })
                player.applyKnockback(currentrotation.x, currentrotation.z, 20, -100)
                server.system.runTimeout(() => {
                    dimension.getEntities({
                        location: player.location, maxDistance: 10, families: ["mob"], excludeNames: [player.name]
                    }).forEach(entity => {

                        entity.applyDamage(35 + Math.trunc(magicalpower * 1.5), {
                            damagingEntity: player,
                            cause: 'entityAttack' as server.EntityDamageCause
                        })
                        entity.applyKnockback(0, 0, 0, 0.6)


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
            addlore(["§8Dash then return to the point", "§8where you used this ability after 5 seconds"])
            if (manaamount > 69) {
                mana.addScore(player, -70)
                let startpos = player.location
                player.runCommand("particle mmorpg:uselessswordparticle ~ ~ ~")
                player.applyKnockback(player.getViewDirection().x, player.getViewDirection().z, 1.5, 0.5)

                server.system.runTimeout(() => {
                    let dx = player.location.x - startpos.x
                    let dy = player.location.y - startpos.y
                    let dz = player.location.z - startpos.z
                    let sumofsquares = dx * dx + dy * dy + dz * dz
                    if (Math.sqrt(sumofsquares) < 100) {
                        if (!dimension.getBlock(startpos).isSolid) {


                            player.tryTeleport(startpos, { checkForBlocks: true })
                        }
                    }
                }, 100)
            }

            break;
        case "mmorpg:applesword":


            addlore(["§8Using this ability gives", "§8you regeneration for 5 seconds"])
            if (manaamount > 29) {


                player.runCommand("effect @s regeneration 5 2 true")
                player.addEffect("regeneration", 100, { showParticles: false, amplifier: 2 })
                mana.addScore(player, -30)
            }
            break;
        case "mmorpg:wolfsword":
            addlore(["§8Gives you speed for 20 seconds"])
            if (manaamount > 39) {


                player.addEffect("speed", 400, { amplifier: 0, showParticles: false })
                mana.addScore(player, -40)
            }
            break;
        case "mmorpg:aetheriumblade":
            addlore(["§8Teleport to the nearest enemy", "§8and deal area damage knocking up enemies"])
            if (dimension.getEntities({ location: player.location, maxDistance: 10, families: ["mob"], excludeNames: [player.name] }).length > 0) {
                if (manaamount > 49 && player.isOnGround) {
                    mana.addScore(player, -50)

                    var otherEntity = dimension.getEntities({ location: player.location, maxDistance: 10, families: ["mob"], excludeNames: [player.name] })[0] as server.Entity
                    let tpbool = player.tryTeleport({ x: otherEntity.location.x, y: otherEntity.location.y, z: otherEntity.location.z }, { checkForBlocks: true, })
                    if (tpbool) {
                        player.addEffect("slow_falling", 10, { showParticles: false })

                        dimension.getEntities({ location: player.location, maxDistance: 5, families: ["mob"], excludeNames: [player.name] }).forEach(
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
            addlore(["§r§l§4PVP DISABLED", "§8Deal massive damage to", "§8all enemies in a 7 block radius"])
            let twilightblossomentities = dimension.getEntities({ location: player.location, maxDistance: 7, families: ["mob"], excludeFamilies: ["player"] })
            if (twilightblossomentities.length > 0 && manaamount > 99) {
                mana.addScore(player, -100)
                player.playSound("sword.twilightblossom")
                twilightblossomentities.forEach(entity => {
                    dimension.spawnParticle("mmorpg:twilightblossomparticle", entity.location)
                    entity.applyDamage(30 + magicalpower * 2, {
                        damagingEntity: player,
                        cause: 'entityAttack' as server.EntityDamageCause
                    })
                })
            }


            break;
        case "minecraft:glow_ink_sac":
            var block = player.getBlockFromViewDirection().block
            dimension.spawnParticle("mmorpg:core_boss_projectile", block)
            dimension.fillBlocks({ x: block.location.x + 1, y: block.location.y, z: block.location.z } as server.Vector3, { x: block.location.x - 1, y: block.location.y, z: block.location.z }, "minecraft:stone")
            dimension.fillBlocks({ x: block.location.x, y: block.location.y - 1, z: block.location.z } as server.Vector3, { x: block.location.x, y: block.location.y + 1, z: block.location.z }, "minecraft:stone")
            dimension.fillBlocks({ x: block.location.x, y: block.location.y, z: block.location.z + 1 } as server.Vector3, { x: block.location.x, y: block.location.y, z: block.location.z - 1 }, "minecraft:stone")


            break;
        case "minecraft:black_dye":
            var block = player.getBlockFromViewDirection().block
            dimension.spawnParticle("mmorpg:core_boss_projectile", block)
            dimension.fillBlocks({ x: block.location.x + 1, y: block.location.y, z: block.location.z } as server.Vector3, { x: block.location.x - 1, y: block.location.y, z: block.location.z }, "minecraft:air")
            dimension.fillBlocks({ x: block.location.x, y: block.location.y - 1, z: block.location.z } as server.Vector3, { x: block.location.x, y: block.location.y + 1, z: block.location.z }, "minecraft:air")
            dimension.fillBlocks({ x: block.location.x, y: block.location.y, z: block.location.z + 1 } as server.Vector3, { x: block.location.x, y: block.location.y, z: block.location.z - 1 }, "minecraft:air")


            break;
        case "minecraft:pink_dye":
            var block = player.getBlockFromViewDirection().block
            dimension.spawnParticle("mmorpg:core_boss_projectile", block)
            dimension.fillBlocks({ x: block.location.x + 2, y: block.location.y + 2, z: block.location.z + 2 } as server.Vector3, { x: block.location.x - 2, y: block.location.y - 2, z: block.location.z - 2 }, "minecraft:stone")


            break;
        case "mmorpg:heavyaetheriumsword":
            addlore(["§8Make a small blast", "§8and deal a lot of damage to nearby enemies", "§8knocking them up"])
            let heavyaetheriumswordentities = dimension.getEntities({ location: player.location, maxDistance: 5, families: ["mob"], excludeNames: [player.name] })
            if (heavyaetheriumswordentities.length > 0 && world.scoreboard.getObjective("mana").getScore(player) > 59) {
                dimension.spawnParticle("mmorpg:aetheriumbladeparticle", player.location)
                mana.addScore(player, -60)

                dimension.getEntities({ location: player.location, maxDistance: 5, families: ["mob"], excludeNames: [player.name] }).forEach(entity => {
                    entity.applyDamage(15 + magicalpower * 2, {
                        damagingEntity: player,
                        cause: 'entityAttack' as server.EntityDamageCause
                    })
                    entity.applyKnockback(0, 0, 0, 0.7)
                })
            }

            break;
        case "mmorpg:prismarineblade":
            addlore(["§8Shoot bubbles in a direction", "§8dealing damage and slowing enemies", "§8Guardian's Necklace boosts damage."])
            if (manaamount > 29) {
                mana.addScore(player, -30)
                var rotation = player.getRotation().y
                rotation = rotation + 90
                const radians = rotation * Math.PI / 180;
                const cosval = Math.cos(radians);
                const sinval = Math.sin(radians);
                let equipment = player.getComponent("equippable") as server.EntityEquippableComponent
                let range: number
                let bonusdamage
                if (equipment.getEquipmentSlot(server.EquipmentSlot.Offhand).typeId == "mmorpg:guardiansnecklace") {
                    range = 8
                    bonusdamage = 10
                } else {
                    range = 6
                    bonusdamage = 0
                }
                let startx = player.location.x
                let startz = player.location.z
                let starty = player.location.y
                for (let i = 0; i < range; i++) {
                    server.system.runTimeout(() => {
                        const xlocation = startx + i * cosval
                        const zlocation = startz + i * sinval
                        dimension.spawnParticle("mmorpg:prismarinebladeparticle", { x: xlocation, y: starty + 0.1, z: zlocation });
                        dimension.getEntities({ location: { x: xlocation, y: starty + 0.1, z: zlocation }, maxDistance: 1.5, families: ["mob"], excludeNames: [player.name] }).forEach(entity => {
                            entity.applyDamage(10 + magicalpower + bonusdamage, {
                                damagingEntity: player,
                                cause: 'entityAttack' as server.EntityDamageCause
                            });

                            entity.addEffect("slowness", 20, { showParticles: false })
                        });

                    }, i)
                }
            }
            break;
        case "mmorpg:voidreaver":
            addlore(["§8Shoot a projectile which deals damage", "§8and explodes when it hits an enemy"])
            var cooldown = item.getComponent("cooldown") as server.ItemCooldownComponent
            if (manaamount > 49 && player.getItemCooldown("voidreaver") == 0) {
                cooldown.startCooldown(player)
                mana.addScore(player, -50)
                var rotation = player.getRotation().y
                rotation = rotation + 90
                const radians = rotation * Math.PI / 180;
                const cosval = Math.cos(radians);
                const sinval = Math.sin(radians);
                let originallocationx = player.location.x
                let originallocationz = player.location.z
                let originallocationy = player.location.y
                for (let distance = 0; distance < 15; distance++) {
                    server.system.runTimeout(() => {
                        let xlocation = originallocationx + distance * cosval
                        let zlocation = originallocationz + distance * sinval
                        dimension.spawnParticle("mmorpg:core_boss_laser", { x: xlocation, y: originallocationy + 1, z: zlocation })
                        dimension.getEntities({ location: { x: xlocation, y: originallocationy + 1, z: zlocation }, maxDistance: 2, families: ["mob"], excludeNames: [player.name] }).forEach(entity => {
                            entity.applyDamage(10, {
                                damagingEntity: player,
                                cause: 'entityAttack' as server.EntityDamageCause
                            });
                            dimension.getEntities({ location: { x: xlocation, y: originallocationy + 1, z: zlocation }, maxDistance: 6, families: ["mob"], excludeNames: [player.name] }).forEach(entity => {
                                entity.applyDamage(20 + magicalpower, {
                                    damagingEntity: player,
                                    cause: 'entityAttack' as server.EntityDamageCause
                                });
                                dimension.spawnParticle("mmorpg:core_boss_laser_center", entity.location)
                            })
                        })

                        xlocation = originallocationx + (distance - 0.5) * cosval
                        zlocation = originallocationz + (distance - 0.5) * sinval
                        dimension.spawnParticle("mmorpg:core_boss_laser", { x: xlocation, y: originallocationy + 1, z: zlocation })


                    }, distance)
                    distance++
                }



            }

            break;
        case "mmorpg:cobblestoneblade":
            var cooldown = item.getComponent("cooldown") as server.ItemCooldownComponent
            addlore(["§8Regenerate 100 Mana"])

            if (player.getItemCooldown("cobblestoneblade") == 0) {
                cooldown.startCooldown(player)
                mana.addScore(player, 100)
            }




            break;
        case "mmorpg:rodofdiscord":
            addlore(["§8Teleport 5 blocks forward"])
            var cooldown = item.getComponent("cooldown") as server.ItemCooldownComponent
            if (player.getItemCooldown("tp") == 0) {

                var rotation = player.getRotation().y

                let modifier = [-3, 0, 3]
                let check = 0
                for (let x in modifier) {


                    rotation = rotation + 90 + modifier[x]
                    const radians = rotation * Math.PI / 180;
                    const cosval = Math.cos(radians);
                    const sinval = Math.sin(radians);
                    for (let distance = 1; distance < 8; distance++) {
                        let xlocation = player.location.x + (distance) * cosval
                        let zlocation = player.location.z + (distance) * sinval
                        if (!dimension.getBlock({ x: xlocation, y: player.location.y + 0.2, z: zlocation }).isAir) {
                            check++
                        }


                    }
                }

                if (check == 0 && player.location.z < 40000 && player.location.x < 40000) {

                    rotation = player.getRotation().y + 90
                    const radians = rotation * Math.PI / 180;
                    const cosval = Math.cos(radians);
                    const sinval = Math.sin(radians);
                    let xlocation = player.location.x + 7 * cosval
                    let zlocation = player.location.z + 7 * sinval
                    player.tryTeleport({ x: xlocation, y: player.location.y + 0.2, z: zlocation })
                    cooldown.startCooldown(player)
                }



            }
            break;
        case "mmorpg:transcendentblade":
            if (manaamount > 49) {
                mana.addScore(player, -50)
                var rotation = player.getRotation().y
                rotation = rotation + 90
                const rotationx = player.getRotation().x * -1
                const radiansx = rotationx * Math.PI / 180
                const playerx = player.location.x
                const playery = player.location.y
                const playerz = player.location.z
                const radians = rotation * Math.PI / 180
                const cosval = Math.cos(radians);
                const sinval = Math.sin(radians);
                let hitscan = 0
                for (let i = 0; i < 20; i++) {


                    let location: server.Vector3 = { x: playerx + i * cosval, y: playery + i * radiansx, z: playerz + i * sinval }
                    dimension.spawnParticle("mmorpg:transcendentbladedamage", location)
                    let entities = dimension.getEntities({ location: location, maxDistance: 1.6, families: ["mob"], excludeNames: [player.name] })

                    entities.forEach(entity => {
                        entity.applyDamage(35 * (1 + (player.getDynamicProperty("healingpower") as number / 100)), {
                            damagingEntity: player,
                            cause: 'entityAttack' as server.EntityDamageCause
                        });
                    })
                    if (entities.length > 0) {

                        hitscan++
                    }


                }
                if (hitscan > 0) {
                    dimension.getPlayers({ location: player.location, maxDistance: 8, excludeFamilies: ["mob"] }).forEach(playerh => {
                        const hpcomp = playerh.getComponent("health") as server.EntityHealthComponent
                        hpcomp.setCurrentValue(hpcomp.currentValue + 5 * (1 + (player.getDynamicProperty("healingpower") as number / 100)))
                        dimension.spawnParticle("mmorpg:transcendentbladeheal", playerh.location)
                    })
                }


            }


            break;

        case "mmorpg:ruby_sword":
            addlore(["§8Regenerate a lot of health", "§with a huge cooldown"])
            var cooldown = item.getComponent("cooldown") as server.ItemCooldownComponent

            if (manaamount > 49 && player.getItemCooldown("ruby_sword") == 0) {
                player.addEffect("regeneration", 50, { amplifier: 15, showParticles: false })
                mana.addScore(player, -40)
                cooldown.startCooldown(player)
            }


            break;

        case "mmorpg:amethyst_abyss":
            addlore(["§8Teleport to all nearby mobs", "§8dealing damage to them"])
            let location = player.location
            if (manaamount > 69) {
                let entities = dimension.getEntities({ location: { x: location.x, y: location.y, z: location.z }, maxDistance: 8, families: ["mob"], excludeNames: [player.name] })
                if (entities.length > 0) {

                    entities.forEach((entity, index) => {
                        server.system.runTimeout(() => {
                            player.tryTeleport(entity.location)
                            entity.applyDamage(20 + magicalpower * 1.5, {
                                damagingEntity: player,
                                cause: 'entityAttack' as server.EntityDamageCause

                            })
                            dimension.spawnParticle("minecraft:critical_hit_emitter", entity.location)
                        }, index * 3)
                    })
                    mana.addScore(player, -70)
                }
            }

            break;
        case "mmorpg:magma_sword":
            addlore(["§r§l§4PVP DISABLED§r", "§7§oShoot fire in 3 cones", "§7§oignite mobs and deal tons of damage"])
            if (manaamount > 70) {
                mana.addScore(player, -70)
                var rotation = player.getRotation().y
                rotation = rotation + 90
                let originallocationx = player.location.x
                let originallocationz = player.location.z
                let originallocationy = player.location.y
                for (let distance = 0; distance < 8; distance++) {
                    server.system.runTimeout(() => {
                        for (const j of [0, 45, -45,]) {

                            const radians = (rotation + j) * Math.PI / 180;
                            const cosval = Math.cos(radians);
                            const sinval = Math.sin(radians);
                            let xlocation = originallocationx + distance * cosval
                            let zlocation = originallocationz + distance * sinval
                            dimension.spawnParticle("mmorpg:firesword", { x: xlocation, y: originallocationy, z: zlocation })
                            dimension.getEntities({ location: { x: xlocation, y: originallocationy, z: zlocation }, maxDistance: 1.6, families: ["mob"], excludeFamilies: ["player"] }).forEach(entity => {
                                entity.applyDamage(15 + magicalpower * 2, {
                                    damagingEntity: player,
                                    cause: 'entityAttack' as server.EntityDamageCause
                                });
                                entity.setOnFire(3, true)
                            })




                        }
                    }, distance)
                    distance++
                }
            }
            break;
        case "mmorpg:emerald_sword":
            addlore(["§r§4§lPVP DISABLED", "§8Shoot an emerald meteor at one", "§8of the mobs nearby"])
            if (manaamount > 14) {

                const mobs = dimension.getEntities({ location: player.location, maxDistance: 12, families: ["mob"], excludeFamilies: ["player"] })
                if (mobs.length > 0) {
                    mana.addScore(player, -15)
                    const entity: server.Entity = mobs[Math.floor(Math.random() * mobs.length)]
                    dimension.spawnParticle("mmorpg:emeraldmeteor", entity.location)
                    server.system.runTimeout(() => {

                        dimension.spawnParticle("minecraft:critical_hit_emitter", entity.location)
                        entity.applyDamage(10 + magicalpower * 0.4, {
                            damagingEntity: player,
                            cause: 'entityAttack' as server.EntityDamageCause
                        });
                    }, 10)
                }
            }

            break;
        case "minecraft:dragon_breath":

            if (player.name == "SkorpMCBE1676" || player.name == "KrzychTym" || player.name == "WojtekBB") {
                let blockpos = player.getBlockFromViewDirection().block.location
                dimension.runCommand(`clone 16 113 96 10 119 102 ${blockpos.x - 3} ${blockpos.y - 3} ${blockpos.z - 3} masked`)

            }

            break;

        case "mmorpg:skyborn_sword":
            const entities = dimension.getEntities({ location: player.location, maxDistance: 7, families: ["mob"], excludeFamilies: ["player"] })
            entities.forEach(entity => {
                let vector3 = entity.getViewDirection()

                entity.applyKnockback(vector3.x * -1, vector3.z * -1, 3.5, 0.35)
            })

            break;
    }
})


