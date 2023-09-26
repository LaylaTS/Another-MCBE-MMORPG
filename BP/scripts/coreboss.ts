import * as server from '@minecraft/server';

const world = server.world;

world.afterEvents.worldInitialize.subscribe(eventData => {
    const angle = new server.DynamicPropertiesDefinition().defineNumber("corebossangle", 0);
    eventData.propertyRegistry.registerWorldDynamicProperties(angle);
});

server.system.runInterval(() => {
    const dimension = world.getDimension("minecraft:overworld");
    if (dimension.getEntities({ location: { x: 3000, z: 3000, y: 100 }, maxDistance: 100, families: ["boss"] }).length > 0) {


        var boss = dimension.getEntities({ location: { x: 3000, z: 3000, y: 100 }, maxDistance: 100, families: ["boss"] })[0] as server.Entity
        if (boss.typeId == "mmorpg:core_boss") {
            var location = { x: boss.location.x, y: boss.location.y + 1, z: boss.location.z }
            let angle = world.getDynamicProperty("corebossangle") as number;
            const radians = angle * Math.PI / 180;
            const cosval = Math.cos(radians);
            const sinval = Math.sin(radians);

            dimension.spawnParticle("mmorpg:core_boss_laser_center", location)
            for (const multiplier of [1, -1]) {
                for (let i = 1; i < 20; i++) {
                    const xlocation = location.x + i * cosval * multiplier;
                    const zlocation = location.z + i * sinval * multiplier;

                    dimension.getEntities({ location: { x: xlocation, y: location.y + 0.1, z: zlocation }, maxDistance: 1 }).forEach(entity => {
                        entity.applyDamage(15, { cause: server.EntityDamageCause.void });
                        entity.applyKnockback(0, 0, 0, 1);
                    });

                    dimension.spawnParticle("mmorpg:core_boss_laser", { x: xlocation, y: location.y + 0.1, z: zlocation });
                    dimension.spawnParticle("mmorpg:core_boss_laser", { x: xlocation, y: location.y - 0.7, z: zlocation });
                }
            }

            angle += 3;
            if (angle > 360) {
                angle = 0;
            }
            world.setDynamicProperty("corebossangle", angle);
        }
    }
});
