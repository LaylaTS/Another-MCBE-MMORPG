import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'



export function mmorpgmenu(player: server.Player) {
    const world = server.world
    var tp = new ui.ActionFormData()
        .title('Choose Teleport Location')
        .button('Spawn')
        .button('Plot')
        .button('Dungeons')
        .button('The Mines')
        .body(`\n§7Max Mana: §b§l${player.getDynamicProperty("maxmana")}\n§r§7Magical Power: §b§l${player.getDynamicProperty("magicalpower")}§r\n§7Mana Regen: §b§l${player.getDynamicProperty("manaregen")}\n§r§7Luck: §b§l${player.getDynamicProperty("luck").toFixed(2)}\n§r`)


    if (world.scoreboard.getObjective('spawntimer').getScore(player) > 200) {
        tp.show(player).then(result => {
            if (result.selection == 0) {
                player.runCommand('tp @s 0 66 0')
            } else if (result.selection == 1) {
                player.runCommand('tp @s 39990 -57 ' + world.scoreboard.getObjective('plotcords').getScore(player))
            } else if (result.selection == 2) {
                player.runCommand('tp @s 500 50 500')
            } else if (result.selection == 3) {
                player.runCommand('tp @s 5018 302 4982')
            }
        })
    }


}
