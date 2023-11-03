import * as server from '@minecraft/server';
import { distance } from './main.js'

const world = server.world;


export function corebossbehavior() {

    const dimension = world.getDimension("minecraft:overworld");


    var corebosstimer = world.getDynamicProperty("corebosstimer") as number
    var corebossattacktype = world.getDynamicProperty("corebossattacktype") as number


    const tempentities = dimension.getEntities({ location: { x: 3000, z: 3000, y: 100 }, maxDistance: 100, families: ["boss"] })

    if (tempentities.length > 0) {
        const player = dimension.getPlayers({ location: { x: 3000, z: 3000, y: 100 }, maxDistance: 50 })[0]



        var boss = tempentities[0] as server.Entity
        if (boss.typeId == "mmorpg:core_boss") {
            if (corebosstimer == 100) {
                world.setDynamicProperty("corebossattacktype", 1)

            }


            if (corebossattacktype == 1) {
                var location = { x: boss.location.x, y: boss.location.y + 0.5, z: boss.location.z }
                let angle = world.getDynamicProperty("corebossangle") as number;
                const radians = angle * Math.PI / 180;
                const cosval = Math.cos(radians);
                const sinval = Math.sin(radians);

                dimension.spawnParticle("mmorpg:core_boss_laser_center", location)
                for (const multiplier of [1, -1]) {
                    for (let i = 1; i < 20; i++) {
                        const xlocation = location.x + i * cosval * multiplier;
                        const zlocation = location.z + i * sinval * multiplier;

                        if (distance(player.location, { x: xlocation, y: location.y + 0.1, z: zlocation }) <= 1) {


                            player.applyDamage(8, { cause: server.EntityDamageCause.void });
                            player.applyKnockback(0, 0, 0, 1);
                        }


                        dimension.spawnParticle("mmorpg:core_boss_laser", { x: xlocation, y: location.y + 0.1, z: zlocation });
                        dimension.spawnParticle("mmorpg:core_boss_laser", { x: xlocation, y: location.y - 0.7, z: zlocation });
                    }
                }

                angle += 1;
                if (angle > 90) {
                    angle++
                }
                if (angle > 180) {
                    angle += 2
                }
                if (angle > 360) {
                    angle = 0;
                    world.setDynamicProperty("corebossattacktype", Math.floor(Math.random() * 5) + 1)
                    world.setDynamicProperty("corebosscage", 0)
                }
                world.setDynamicProperty("corebossangle", angle);



            } else if (corebossattacktype == 3) {
                world.setDynamicProperty("corebossangle", 0);
                var corebosscage = world.getDynamicProperty("corebosscage") as number
                if (corebosscage < 6) {
                    world.setDynamicProperty("corebosscage", 20)
                    corebosscage = 20
                }

                var cnt = corebosscage
                var xlocation = 3000
                var zlocation = 3000


                if (corebosscage > 5) {

                    const multiplierArr = [1, -1]
                    const sideArr = [1, -1]
                    while (cnt > -1) {

                        if (((player.location.x > xlocation + corebosscage) || (player.location.x < xlocation - corebosscage) || (player.location.z > zlocation + corebosscage) || (player.location.z < zlocation - corebosscage)) && player.location.y < 105) {

                            player.applyDamage(5, { cause: server.EntityDamageCause.void });
                            player.applyKnockback(0, 0, 0, 1);
                        }

                        for (const multiplier of multiplierArr) {
                            for (const side of sideArr) {

                                dimension.spawnParticle("mmorpg:core_boss_laser", { x: xlocation + corebosscage * side, y: 101.5, z: zlocation + (cnt * multiplier) });
                                dimension.spawnParticle("mmorpg:core_boss_laser", { x: xlocation + (cnt * multiplier), y: 101.5, z: zlocation + corebosscage * side });

                            }
                        }
                        cnt--

                    }
                }
                if (corebosscage == 6) {
                    world.setDynamicProperty("corebossattacktype", Math.floor(Math.random() * 5) + 1)
                    world.setDynamicProperty("corebosscage", 0)
                }


                if (world.getAbsoluteTime() % 4 == 0) {
                    world.setDynamicProperty("corebosscage", corebosscage - 1)
                }






            } else if (corebossattacktype == 4) {
                let corebosscage = world.getDynamicProperty("corebosscage") as number
                let cnt = 0
                while (cnt < 20) {
                    if (corebosscage < 41) {
                        dimension.spawnParticle("mmorpg:core_boss_laser", { x: 2980 + corebosscage, z: 2980 + cnt, y: 101 })
                        if (distance(player.location, { x: 2980 + corebosscage, z: 2980 + cnt, y: 101 }) <= 1) {

                            player.applyDamage(6, { cause: server.EntityDamageCause.contact });
                            player.applyKnockback(0, 0, 0, 1);
                        }

                    } else if (corebosscage > 40 && corebosscage < 81) {
                        dimension.spawnParticle("mmorpg:core_boss_laser", { x: 3000 + cnt, z: 2940 + corebosscage, y: 101 })
                        if (distance(player.location, { x: 3000 + cnt, z: 2940 + corebosscage, y: 101 }) <= 1) {

                            player.applyDamage(6, { cause: server.EntityDamageCause.contact });
                            player.applyKnockback(0, 0, 0, 1);
                        }

                    } else if (corebosscage > 80 && corebosscage < 121) {
                        dimension.spawnParticle("mmorpg:core_boss_laser", { x: 3100 - corebosscage, z: 3000 + cnt, y: 101 })
                        if (distance(player.location, { x: 3100 - corebosscage, z: 3000 + cnt, y: 101 }) <= 1) {
                            player.applyDamage(6, { cause: server.EntityDamageCause.contact });
                            player.applyKnockback(0, 0, 0, 1);
                        }

                    } else if (corebosscage > 120 && corebosscage < 161) {
                        dimension.spawnParticle("mmorpg:core_boss_laser", { x: 2980 + cnt, z: 3140 - corebosscage, y: 101 })
                        if (distance(player.location, { x: 2980 + cnt, z: 3140 - corebosscage, y: 101 }) <= 1) {
                            player.applyDamage(6, { cause: server.EntityDamageCause.contact });
                            player.applyKnockback(0, 0, 0, 1);
                        }
                    }



                    cnt++
                }


                if (corebosscage > 160) {
                    corebosscage = 0
                    world.setDynamicProperty("corebossattacktype", Math.floor(Math.random() * 5) + 1)

                } else {
                    corebosscage++
                }

                world.setDynamicProperty("corebosscage", corebosscage)





            } else if (corebossattacktype == 5) {
                let cnt = 0
                let corebosscage = world.getDynamicProperty("corebosscage") as number


                if (corebosscage < 32) {
                    while (cnt < 41) {




                        dimension.spawnParticle("mmorpg:core_boss_laser", { x: 3020 - corebosscage, z: 2980 + cnt, y: 101 })

                        if (distance(player.location, { x: 3020 - corebosscage, z: 2980 + cnt, y: 101 }) <= 1) {

                            player.applyDamage(5, { cause: server.EntityDamageCause.void });
                            player.applyKnockback(0, 0, 0, 1);
                        }



                        cnt++
                    }
                }


                if (corebosscage > 33) {
                    corebosscage = 0
                    world.setDynamicProperty("corebossattacktype", Math.floor(Math.random() * 5) + 1)
                    world.setDynamicProperty("corebosscage", 0)
                }
                if (world.getAbsoluteTime() % 2) {
                    corebosscage++
                    world.setDynamicProperty("corebosscage", corebosscage)
                }

            } else if (corebossattacktype == 2) {
                let cnt = 0

                let corebosscage = world.getDynamicProperty("corebosscage") as number

                if (corebosscage < 32) {
                    while (cnt < 41) {

                        dimension.spawnParticle("mmorpg:core_boss_laser", { x: 2980 + corebosscage, z: 2980 + cnt, y: 101 })
                        if (distance(player.location, { x: 2980 + corebosscage, z: 2980 + cnt, y: 101 }) <= 1) {


                            player.applyDamage(5, { cause: server.EntityDamageCause.void });
                            player.applyKnockback(0, 0, 0, 1);
                        }
                        cnt++
                    }
                }



                if (corebosscage > 33) {
                    world.setDynamicProperty("corebossattacktype", Math.floor(Math.random() * 5) + 1)
                    world.setDynamicProperty("corebosscage", 0)
                }
                if (world.getAbsoluteTime() % 2) {
                    corebosscage++
                    world.setDynamicProperty("corebosscage", corebosscage)
                }

            }




            var xlocation = 3000
            var zlocation = 3000
            var corebossprojectile = world.getDynamicProperty("corebossprojectile") as number
            corebossprojectiles(corebossprojectile, xlocation, zlocation, dimension)
            world.setDynamicProperty("corebossprojectile", corebossprojectile + 1)
            if (corebossprojectile > 40) {
                world.setDynamicProperty("corebossprojectile", 0)
            }




            world.setDynamicProperty("corebosstimer", corebosstimer + 1)
        }





    } else {
        world.setDynamicProperty("corebosstimer", 0)
        world.setDynamicProperty("corebossattacktype", 0)
    }


}

function corebossprojectiles(corebossprojectile, xlocation, zlocation, dimension) {

    let location = { x: xlocation, z: zlocation, y: 101.4 }

    if (corebossprojectile == 0) {
        world.setDynamicProperty("corebossrandomprojectilexpos", Math.floor(Math.random() * 41) - 20)
        world.setDynamicProperty("corebossrandomprojectilezpos", Math.floor(Math.random() * 41) - 20)
    }


    if (corebossprojectile < 40) {
        let locationParticle = { x: location.x + (corebossprojectile as number * -1) + 20, y: location.y, z: location.z + world.getDynamicProperty("corebossrandomprojectilezpos") }
        dimension.spawnParticle("mmorpg:core_boss_projectile", locationParticle)
        dimension.getPlayers({ location: locationParticle, maxDistance: 0.8 }).forEach(entity => {
            entity.applyDamage(5, { cause: server.EntityDamageCause.contact });
            entity.applyKnockback(0, 0, 0, 1);

        })
        locationParticle = { x: location.x + (corebossprojectile as number) - 20, y: location.y, z: location.z + (world.getDynamicProperty("corebossrandomprojectilezpos") as number * -1) }
        dimension.spawnParticle("mmorpg:core_boss_projectile", locationParticle)
        dimension.getPlayers({ location: locationParticle, maxDistance: 0.8 }).forEach(entity => {
            entity.applyDamage(5, { cause: server.EntityDamageCause.contact });
            entity.applyKnockback(0, 0, 0, 1);

        })
        locationParticle = { z: location.z + (corebossprojectile as number) - 20, y: location.y, x: location.x + (world.getDynamicProperty("corebossrandomprojectilexpos") as number * -1) }
        dimension.spawnParticle("mmorpg:core_boss_projectile", locationParticle)
        dimension.getPlayers({ location: locationParticle, maxDistance: 0.8 }).forEach(entity => {
            entity.applyDamage(5, { cause: server.EntityDamageCause.contact });
            entity.applyKnockback(0, 0, 0, 1);

        })
        locationParticle = { z: location.z + (corebossprojectile as number * -1) + 20, y: location.y, x: location.x + (world.getDynamicProperty("corebossrandomprojectilexpos") as number) }
        dimension.spawnParticle("mmorpg:core_boss_projectile", locationParticle)
        dimension.getPlayers({ location: locationParticle, maxDistance: 0.8 }).forEach(entity => {
            entity.applyDamage(5, { cause: server.EntityDamageCause.contact });
            entity.applyKnockback(0, 0, 0, 1);

        })
    }


}