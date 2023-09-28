import * as server from '@minecraft/server';

const world = server.world;

world.afterEvents.worldInitialize.subscribe(eventData => {
    const angle = new server.DynamicPropertiesDefinition().defineNumber("corebossangle", 0);
    eventData.propertyRegistry.registerWorldDynamicProperties(angle);
    const attacktype = new server.DynamicPropertiesDefinition().defineNumber("corebossattacktype", 0)
    eventData.propertyRegistry.registerWorldDynamicProperties(attacktype)
    // 0 - idle // 1 - laser // 2 - ground beams // 3 - cage
    const corebosstimer = new server.DynamicPropertiesDefinition().defineNumber("corebosstimer", 0)
    eventData.propertyRegistry.registerWorldDynamicProperties(corebosstimer)
    const corebosscage = new server.DynamicPropertiesDefinition().defineNumber("corebosscage", 0)
    eventData.propertyRegistry.registerWorldDynamicProperties(corebosscage)
});





export function corebossbehavior() {
    const dimension = world.getDimension("minecraft:overworld");
    var corebosstimer = world.getDynamicProperty("corebosstimer") as number
    var corebossattacktype = world.getDynamicProperty("corebossattacktype") as number



    if (dimension.getEntities({ location: { x: 3000, z: 3000, y: 100 }, maxDistance: 100, families: ["boss"] }).length > 0) {



        var boss = dimension.getEntities({ location: { x: 3000, z: 3000, y: 100 }, maxDistance: 100, families: ["boss"] })[0] as server.Entity
        if (boss.typeId == "mmorpg:core_boss") {
            if (corebosstimer == 100) {
                world.setDynamicProperty("corebossattacktype", 1)
                boss.triggerEvent("laserbeam_attack")
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

                        dimension.getEntities({ location: { x: xlocation, y: location.y + 0.1, z: zlocation }, maxDistance: 1, excludeFamilies: ["enemyprojectile"] }).forEach(entity => {
                            entity.applyDamage(15, { cause: server.EntityDamageCause.void });
                            entity.applyKnockback(0, 0, 0, 1);
                        });

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
                    world.setDynamicProperty("corebossattacktype", 3)
                    world.setDynamicProperty("corebosscage", 20)
                }
                world.setDynamicProperty("corebossangle", angle);
            } else if (corebossattacktype == 3) {
                var corebosscage = world.getDynamicProperty("corebosscage") as number
                if (corebosscage < 4) {
                    world.setDynamicProperty("corebosscage", 20)
                    corebosscage = 20
                }
                var cnt = corebosscage
                var xlocation = 3000
                var zlocation = 3000


                if (corebosscage > 3) {
                    const multiplierArr = [1, -1]
                    const sideArr = [1, -1]
                    while (cnt > -1) {
                        for (const multiplier of multiplierArr) {
                            for (const side of sideArr) {
                                dimension.getEntities({ location: { x: xlocation + corebosscage * side, y: 101.5, z: zlocation + (cnt * multiplier) }, maxDistance: 1 }).forEach(entity => {
                                    entity.applyDamage(15, { cause: server.EntityDamageCause.void });
                                    entity.applyKnockback(0, 0, 0, 1);
                                });
                                dimension.spawnParticle("mmorpg:core_boss_laser", { x: xlocation + corebosscage * side, y: 101.5, z: zlocation + (cnt * multiplier) });
                                dimension.getEntities({ location: { x: xlocation + (cnt * multiplier), y: 101.5, z: zlocation + corebosscage * side }, maxDistance: 1, excludeFamilies: ["enemyprojectile"] }).forEach(entity => {
                                    entity.applyDamage(15, { cause: server.EntityDamageCause.void });
                                    entity.applyKnockback(0, 0, 0, 1);
                                });
                                dimension.spawnParticle("mmorpg:core_boss_laser", { x: xlocation + (cnt * multiplier), y: 101.5, z: zlocation + corebosscage * side });

                            }
                        }
                        cnt--

                    }
                } else {
                    world.setDynamicProperty("corebossattacktype", 2)
                }
                if (world.getAbsoluteTime() % 10 == 0) {
                    world.setDynamicProperty("corebosscage", corebosscage - 1)
                }

            }



            world.setDynamicProperty("corebosstimer", corebosstimer + 1)
        }
    } else {
        world.setDynamicProperty("corebosstimer", 0)
        world.setDynamicProperty("corebossattacktype", 0)
    }

}