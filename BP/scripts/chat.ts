import * as server from "@minecraft/server";
//import * as ui from '@minecraft/server-ui'

const world = server.world

world.afterEvents.worldInitialize.subscribe(eventData => {
    const playerrank = new server.DynamicPropertiesDefinition().defineString("playerrank", 30)
    eventData.propertyRegistry.registerEntityTypeDynamicProperties(playerrank, "minecraft:player")
})


world.beforeEvents.chatSend.subscribe((eventData) => {
    var player: server.Player = eventData.sender;
    if (world.scoreboard.getObjective('spawntimer').getScore(player) > 200) {
        if (eventData.message[0] == '!') {


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
        } else {

            if (player.getDynamicProperty("playerrank") == undefined) {
                player.setDynamicProperty("playerrank", "§8Player")

            }
            let message = eventData.message
            world.sendMessage(`[${player.getDynamicProperty("playerrank")}§r] ${player.name}: ${message}`)

            eventData.cancel = true

        }

    }
});




world.afterEvents.entityHurt.subscribe((eventData => {
    if (eventData.damage > 0 && eventData.hurtEntity.typeId == "minecraft:player") {
        eventData.hurtEntity.runCommand('scoreboard players set @s spawntimer 0')
    }
}))