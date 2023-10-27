import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'



export function minioninteract(player: server.Player, entity: server.Entity) {
    const world = server.world;


    if (entity.getDynamicProperty("resources") == undefined) {
        const newminionui = new ui.ActionFormData()
            .title("Start Minion")
            .button("Start Minion")
            .button("Despawn")


        newminionui.show(player).then(data => {
            if (data.selection == 0) {
                function payprice() {
                    player.setDynamicProperty("money", player.getDynamicProperty("money") as number - 10000)
                }
                const resourceselection = new ui.ActionFormData()
                    .title("Choose Resource")
                    .body(`\n§c§lWARNING:§r Starting a minion costs 10k money and 64 items of the type you want to generate.\n `)
                    .button("Cobblestone")
                    .button("Ruby")
                    .button("Emerald")
                    .button("Iron")
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
            .button("Upgrade")
            .button("Accessory 1")
            .button("Accessory 2")
            .button("Despawn")
            .show(player).then(data => {
                if (data.selection == 4) {
                    entity.triggerEvent("mmorpg:despawn")
                    player.runCommand("give @s mmorpg:minion_spawn_egg")
                } else if (data.selection == 0) {
                    let generationspeed = 1;
                    switch (entity.getDynamicProperty("resource")) {
                        case "Cobblestone": generationspeed = 100; break;
                        case "Ruby": generationspeed = 450; break;
                    }
                    const lastuse = new Date(entity.getDynamicProperty("lastvisitdate") as string);
                    const currentdate = new Date()
                    console.warn(currentdate.toString(), lastuse.toString())
                    console.warn((currentdate - lastuse) / 1000)

                }
            }).catch(() => { })
    }

}