import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'



export function mmorpgmenu(player: server.Player) {
    const world = server.world
    const mmorpgui = new ui.ActionFormData()
        .title("MMORPG").button("Teleport").button("PVP")
        .body(`\n§7Max Mana: §b§l${player.getDynamicProperty("maxmana")}\n§r§7Magical Power: §b§l${player.getDynamicProperty("magicalpower")}§r\n§7Mana Regen: §b§l${player.getDynamicProperty("manaregen")}\n§r§7Luck: §b§l${player.getDynamicProperty("luck").toFixed(2)}\n§r`).show(player).then(data => {
            if (data.selection == 0) {
                if (world.scoreboard.getObjective('spawntimer').getScore(player) > 200) {
                    var tp = new ui.ActionFormData()
                        .title('Choose Teleport Location')
                        .button('Spawn')
                        .button('Plot')
                        .button('Dungeons')
                        .button('The Mines')
                        .button('PVP Arena')
                    tp.show(player).then(result => {
                        player.triggerEvent("mmorpg:pvpoff")
                        if (result.selection == 0) {
                            player.runCommand('tp @s 0 66 0')
                        } else if (result.selection == 1) {
                            player.runCommand('tp @s 39990 -57 ' + world.scoreboard.getObjective('plotcords').getScore(player))
                        } else if (result.selection == 2) {
                            player.runCommand('tp @s 500 50 500')
                        } else if (result.selection == 3) {
                            player.runCommand('tp @s 5018 302 4982')
                        }



                    }).catch(() => { })

                } else player.sendMessage("§4§lYou can't teleport after taking damage!")

            } else if (data.selection == 1) {
                new ui.ActionFormData().title("Choose Arena")
                    .button("OVERWORLD PVP")
                    .button("BOX PVP")
                    .show(player).then((data) => {
                        let randomspawn: server.Vector3[] = [{ x: -4934, y: 40, z: -5007 }, { x: -4953, y: 40, z: -5037 }, { x: -4988, y: 40, z: -5032 }, { x: -5010, y: 40, z: -4995 }, { x: -4973, y: 45, z: -4992 }]
                        server.system.run(() => {
                            if (data.selection == 0) {
                                player.tryTeleport(randomspawn[Math.floor(Math.random() * randomspawn.length)])
                            } else {
                                player.tryTeleport({ x: -5000 + Math.random() * 40 - 20, z: 5000 + Math.random() * 40 - 20, y: 100 })
                            }
                        })
                        player.triggerEvent("mmorpg:pvpon")

                    }).catch(() => { })
            }
        })




}
