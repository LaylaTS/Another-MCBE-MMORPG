import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'



export function minioninteract(player: server.Player, entity: server.Entity) {
    const world = server.world;



    const displayEnum = [
        "k",
        "m",
        "b",
    ];

    function metricNumbers(number) {
        if (number < 0) return "MAX";
        for (let i = 0; i < displayEnum.length; i++) {
            if (number >= 1000 ** (i + 1) && number < 1000 ** (i + 2)) {
                return `${(number / 1000 ** (i + 1)).toFixed(2)}${displayEnum[i]}`;
            };
        };
    };

    const prices = [0, 100000, 250000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 1000000000, -1]

    if (entity.getDynamicProperty("resources") == undefined) {
        if (player.getDynamicProperty("minioncount") == undefined) {
            player.setDynamicProperty("minioncount", 0)
        }
        const newminionui = new ui.ActionFormData()
            .body(`\n§c§lWARNING:§r You can't have more than 5 minions.§r \nCurrent minions: ${player.getDynamicProperty("minioncount")}\n `)
            .title("Start Minion")
            .button("Start Minion")
            .button("Despawn")


        newminionui.show(player).then(data => {
            if (data.selection == 0 && player.getDynamicProperty("minioncount") < 5) {
                function payprice() {
                    player.setDynamicProperty("money", player.getDynamicProperty("money") as number - 10000)
                }
                new ui.ActionFormData()
                    .title("Choose Resource")
                    .body(`\n§c§lWARNING:§r This will use one of your minions slots.\n `)
                    .button("Cobblestone")
                    .button("Ruby")
                    .button("Emerald")
                    // .button("Iron")
                    .show(player).then(data => {



                        if (data.selection > -1) {
                            entity.setDynamicProperty("resources", 0)
                            entity.setDynamicProperty("lastvisitdate", new Date().toString())
                            entity.setDynamicProperty("level", 1)
                            switch (data.selection) {
                                case 0: entity.setDynamicProperty("resource", "Cobblestone"); break;
                                case 1: entity.setDynamicProperty("resource", "Ruby"); break;
                                case 2: entity.setDynamicProperty("resource", "Emerald"); break;
                                case 3: entity.setDynamicProperty("resource", "Iron"); break;
                            }
                            player.setDynamicProperty("minioncount", player.getDynamicProperty("minioncount") as number + 1)
                            entity.nameTag = `${entity.getDynamicProperty("resource")} Minion\nLevel: 1`
                        }

                    }).catch(() => { })



            } else {
                entity.triggerEvent("mmorpg:despawn")
                player.runCommand("give @s mmorpg:minion_spawn_egg")

            }
        }).catch(() => { })
    } else {

        const mainui = new ui.ActionFormData()
            .title(`${entity.getDynamicProperty("resource")} Minion`)
            .body(`§l§bLevel: §r${entity.getDynamicProperty("level")}\n§l§bResources/Day: §r${100}\n `)
            .button("§l§2Claim Rewards")
            .button(`Upgrade - ${metricNumbers(prices[entity.getDynamicProperty("level") as unknown as number])}`)
            .button("Accessory Slot 1")
            .button("Accessory Slot 2")
            .button("Despawn")
            .show(player).then(data => {
                if (data.selection == 4) {
                    entity.triggerEvent("mmorpg:despawn")
                    player.setDynamicProperty("minioncount", player.getDynamicProperty("minioncount") as number - 1)
                    player.runCommand("give @s mmorpg:minion_spawn_egg")
                } else if (data.selection == 0) {
                    let generationspeed = 1;
                    let drop = "minecraft:air"
                    switch (entity.getDynamicProperty("resource")) {
                        case "Cobblestone": generationspeed = 120; drop = "minecraft:cobblestone"; break;
                        case "Ruby": generationspeed = 450; drop = "mmorpg:ruby"; break;
                        case "Emerald": generationspeed = 450; drop = "minecraft:emerald"; break;
                    }
                    const lastuse = new Date(entity.getDynamicProperty("lastvisitdate") as string);
                    const currentdate = new Date()


                    player.runCommand(`give @s ${drop} ${Math.trunc((((currentdate - lastuse) / 1000) / generationspeed) * entity.getDynamicProperty("level"))}`)
                    entity.setDynamicProperty("lastvisitdate", new Date().toString())

                } else if (data.selection == 1) {
                    let level: number = entity.getDynamicProperty("level") as number

                    if (level < 10 && player.getDynamicProperty("money") as number > prices[level]) {

                        player.setDynamicProperty("money", player.getDynamicProperty("money") as number - prices[level])
                        entity.setDynamicProperty("level", level as number + 1)
                        console.warn(entity.getDynamicProperty("level"))
                        entity.nameTag = `${entity.getDynamicProperty("resource")} Minion\nLevel: ${level + 1}`
                    }
                }
            }).catch(() => { })
    }

}