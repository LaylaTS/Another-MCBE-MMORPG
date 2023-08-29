import * as server from '@minecraft/server'





server.system.runInterval(() => {
    var players = server.world.getAllPlayers()
    players.forEach(function (player) {
        let helmet = player.getComponent("equipment_inventory").getEquipmentSlot("head")
        if (helmet.typeId == 'mmorpg:sculked_helmet') {


            if (server.world.getAbsoluteTime() % 10 == 0) {
                player.runCommand('scoreboard players add @s[scores={mana=..99}] mana 1')
            }

        }

    })
})