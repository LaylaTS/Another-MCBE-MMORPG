import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'

var world = server.world

const avoidableentities = ["minecraft:player", "minecraft:item", "minecraft:arrow", "minecraft:xp_orb", "mmorpg:sculkblast"];

world.afterEvents.itemUse.subscribe(eventData => {
    var player = eventData.source
    var item = eventData.itemStack
    switch (item.typeId) {
        case "mmorpg:return":
            var form = new ui.ActionFormData()
                .title('Choose Teleport Location')
                .button('Spawn')
                .button('Plot')

            if (world.scoreboard.getObjective('spawntimer').getScore(player) > 200) {
                form.show(player).then(result => {
                    if (result.selection == 0) {
                        player.runCommand('tp @s 0 66 0')
                    } else if (result.selection == 1) {
                        player.runCommand('tp @s 39990 -57 ' + world.scoreboard.getObjective('plotcords').getScore(player))
                    }
                })
            }


            break;
        case "mmorpg:purpledagger":
            if (world.scoreboard.getObjective('mana').getScore(player) > 19) {
                let vector3 = player.getViewDirection()
                if (player.isSneaking) {
                    player.applyKnockback(vector3.x * -1, vector3.z * -1, 3, 0.3)
                    player.runCommandAsync('scoreboard players remove @s mana 20')

                } else {
                    player.applyKnockback(vector3.x, vector3.z, 3, 0.3)
                    player.runCommandAsync('scoreboard players remove @s mana 20')
                }
                let entity = player.getEntitiesFromViewDirection()
                entity.forEach(entity => {
                    if (!avoidableentities.includes(entity.entity.typeId)) {
                        entity.entity.applyDamage(10, {
                            damagingEntity: player,
                            cause: 'entityAttack'
                        })
                        entity.entity.runCommandAsync('particle minecraft:critical_hit_emitter ~ ~1 ~')
                    }

                })
            }
            break;
        case "mmorpg:withermenace":
            if (world.scoreboard.getObjective('mana').getScore(player) > 39) {
                if (player.getEntitiesFromViewDirection().length > 0) {
                    player.runCommandAsync('scoreboard players remove @s mana 40')
                }
                player.getEntitiesFromViewDirection().forEach(entity => {
                    if (!avoidableentities.includes(entity.entity.typeId)) {
                        if (entity.distance < 8) {
                            let vector3 = player.getViewDirection()
                            entity.entity.applyKnockback(vector3.x * -1, vector3.z * -1, 3, 0.3)
                            entity.entity.addEffect('slowness', 100, { amplifier: 2 })
                            entity.entity.applyDamage(entity.entity.applyDamage(20, {
                                damagingEntity: player,
                                cause: 'entityAttack',
                            }))
                        }
                    }
                })
            }
            break;
        case "mmorpg:witherscythe":
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

                    // world.getDimension('minecraft:overworld').createExplosion(player.location, 6, { breaksBlocks: false, causesFire: false, source: player })
                    player.runCommand('damage @e[r=8,type=!player,type=!item,type=!arrow,type=!xp_orb,type =!mmorpg:abilitysculkblast] 50 entity_attack entity @s ')

                }, 13)
            }
            break;
        case "mmorpg:forbiddenscythe":

            if (player.getEntitiesFromViewDirection().length > 0) {
                let subject = player.getEntitiesFromViewDirection()[0]
                let entity = subject.entity
                let currentrotation = player.getViewDirection()
                if (!player.isSprinting) {
                    player.tryTeleport(entity.location)

                    player.applyKnockback(currentrotation.x * -1, currentrotation.z * -1, 3, 0.7)

                } else {
                    player.applyKnockback(currentrotation.x, currentrotation.z, 3, 0.7)

                }

                entity.applyDamage(entity.applyDamage(35, {
                    damagingEntity: player,
                    cause: 'entityAttack',
                }))
            }
            break;
        case "minecraft:glow_ink_sac":
            let currentrotation = player.getViewDirection()
            let entites = world.getDimension('minecraft:overworld').getEntities({ location: player.location, maxDistance: 10 })
            player.applyKnockback(currentrotation.x, currentrotation.z, 20, -100)
            server.system.runTimeout(() => {
                world.getDimension('minecraft:overworld').getEntities({ location: player.location, maxDistance: 10 }).forEach(entity => {
                    if (!avoidableentities.includes(entity.typeId)) {
                        entity.applyDamage(35, {
                            damagingEntity: player,
                            cause: 'entityAttack',
                        })
                        entity.applyKnockback(0, 0, 0, 0.6)

                    }
                })

            }, 4)
            entites.forEach(entity => {
                if (!avoidableentities.includes(entity.typeId)) {
                    entity.applyDamage(35, {
                        damagingEntity: player,
                        cause: 'entityAttack',
                    })
                    entity.applyKnockback(0, 0, 0, 0.6)

                }
            })

            break;
        case "minecraft:ender_eye": //todo
            let startpos = player.location
            player.runCommand("particle mmorpg:uselessswordparticle ~ ~ ~")
            player.applyKnockback()

            server.system.runTimeout(() => {
                let dx = player.location.x - startpos.x
                let dy = player.location.y - startpos.y
                let dz = player.location.z - startpos.z
                let sumofsquares = dx * dx + dy * dy + dz * dz
                if (Math.sqrt(sumofsquares) < 100) {
                    player.tryTeleport(startpos)
                }
            }, 100)


            break;
    }
})
