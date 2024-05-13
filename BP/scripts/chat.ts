import * as server from "@minecraft/server";
import { getguildname } from "./guilds.js"
import { fillmines } from "./fillmines.js"
import { refreshprices } from "./refresh_prices.js"
import { listitem, viewauctions } from "./playermarket.js"
const world = server.world



world.beforeEvents.chatSend.subscribe((eventData) => {
    var player: server.Player = eventData.sender;
    if (world.scoreboard.getObjective('spawntimer').getScore(player) > 200) {
        if (eventData.message[0] == '!') {


            switch (eventData.message.split(" ")[0].toLowerCase()) {
                case '!spawn':

                    player.runCommandAsync('tp @s 0 66 0');
                    break;
                case '!warp':

                    player.runCommandAsync('tp @s 39990 -57 ' + world.scoreboard.getObjective('plotcords').getScore(player));
                    break;
                case '!fillmines':
                    if (player.hasTag("admin")) {
                        fillmines()
                    }

                    break;
                case "!refreshprices":
                    if (player.hasTag("admin")) {

                        refreshprices()
                    }
                    break;
                case "!listitem": server.system.run(() => {

                    listitem(player);
                }); break;
                case "!resetmoney": player.setDynamicProperty("money", 0); break;

                case "!selectphase": world.setDynamicProperty("bossphase", parseInt(eventData.message.split(" ")[1])); break;
                default: player.sendMessage("§4§oCommand does not exist!")
                    break;

            }eventData.cancel = true;
        } else {
            if (!player.hasTag("muted")) {



                if (player.getDynamicProperty("playerrank") == undefined) {
                    player.setDynamicProperty("playerrank", "§8PLAYER")

                }
                let message = eventData.message

                var guild = getguildname(player)
                if (guild == "$$$$") {
                    var guildtag = ""
                } else {
                    var guildtag = `[${guild[0].toUpperCase()}${guild[1].toUpperCase()}${guild[2].toUpperCase()}§r] `
                }
                let rank = player.getDynamicProperty("playerrank")
                if (rank == "§8PLAYER") {
                    rank = "§8PLAYER§r§7"
                } else { rank = rank + "§r" }

                world.sendMessage(`${guildtag}§r§l${rank} ${player.name}: ${message}`)
            } else {
                player.sendMessage("§4You are §lMUTED!")
            }
            eventData.cancel = true

        }

    }
});

const dimension = world.getDimension("overworld")



world.afterEvents.entityHurt.subscribe((eventData => {
    if (eventData.damage > 0 && eventData.hurtEntity.typeId == "minecraft:player") {
        eventData.hurtEntity.runCommand('scoreboard players set @s spawntimer 0')
    }
}))