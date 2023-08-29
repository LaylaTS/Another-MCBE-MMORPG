import { world } from "@minecraft/server";
import * as ui from '@minecraft/server-ui'


world.beforeEvents.chatSend.subscribe((eventData) => {
    const player = eventData.sender;
    if (world.scoreboard.getObjective('spawntimer').getScore(player) > 200) {
        switch (eventData.message) {
            case '!spawn':
                eventData.cancel = true;
                player.runCommandAsync('tp @s 0 66 0');
                break;
            case '!warp':
                eventData.cancel = true;
                player.runCommandAsync('tp @s 39990 -57 ' + world.scoreboard.getObjective('plotcords').getScore(player));
                break;
            default: break;
        }
    }
});

world.afterEvents.entityHurt.subscribe((eventData => {
    if (eventData.damage > 0 && eventData.hurtEntity.typeId == "minecraft:player") {
        eventData.hurtEntity.runCommand('scoreboard players set @s spawntimer 0')
    }
}))