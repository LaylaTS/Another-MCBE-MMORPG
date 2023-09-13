import * as server from '@minecraft/server'


const world = server.world;


server.system.runInterval(() => {
    world.getAllPlayers().forEach(player => {

        const equipment = player.getComponent("equipment_inventory") as server.EntityEquipmentInventoryComponent;
        const helmet = equipment.getEquipment("head" as server.EquipmentSlot)
        if (helmet != undefined) {
            switch (helmet.typeId) {
                case "mmorpg:sculked_helmet":



                    if (server.world.getAbsoluteTime() % 10 == 0) {
                        player.runCommand('scoreboard players add @s[scores={mana=..99}] mana 1')

                    }
                    break;
            }
        }
    })
})
