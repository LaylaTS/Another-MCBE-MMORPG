import * as server from '@minecraft/server'


const world = server.world

// world.afterEvents.worldInitialize.subscribe(eventData => {
//     var lastlogindd = new server.DynamicPropertiesDefinition().defineNumber("lastlogindd")
//     var lastloginmm = new server.DynamicPropertiesDefinition().defineNumber("lastloginmm")
//     var lastloginyyyy = new server.DynamicPropertiesDefinition().defineNumber("lastloginyyyy")
//     var streak = new server.DynamicPropertiesDefinition().defineNumber("streak", 0)

//     eventData.propertyRegistry.registerEntityTypeDynamicProperties(lastlogindd, "minecraft:player")
//     eventData.propertyRegistry.registerEntityTypeDynamicProperties(lastloginmm, "minecraft:player")
//     eventData.propertyRegistry.registerEntityTypeDynamicProperties(lastloginyyyy, "minecraft:player")
//     eventData.propertyRegistry.registerEntityTypeDynamicProperties(streak, "minecraft:player")

// })

world.afterEvents.playerSpawn.subscribe(eventData => {
    var player = eventData.player as server.Player
    if (eventData.initialSpawn) {
        var tempdate = new Date();
        if (player.getDynamicProperty("lastlogindd") == undefined) { // if any of these are undefined it means all are undefined
            player.setDynamicProperty("lastlogindd", parseInt(String(tempdate.getDate()).padStart(2, '0')))
            player.setDynamicProperty("lastloginmm", parseInt(String(tempdate.getMonth() + 1).padStart(2, '0')))
            player.setDynamicProperty("lastloginyyyy", tempdate.getFullYear())
        }
        var lastlogin = new Date(player.getDynamicProperty("lastloginyyyy") as number, player.getDynamicProperty("lastloginmm") as number - 1, player.getDynamicProperty("lastlogindd") as number)
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        let streak = player.getDynamicProperty("streak") as number


        if (lastlogin.setHours(0, 0, 0, 0) < yesterday.setHours(0, 0, 0, 0)) {
            player.runCommand('tellraw @s {"rawtext":[{"text":"§cYou broke your login streak!§r"}]}');
            player.setDynamicProperty("streak", 0);
        }

        player.setDynamicProperty("lastlogindd", parseInt(String(tempdate.getDate()).padStart(2, '0')))
        player.setDynamicProperty("lastloginmm", parseInt(String(tempdate.getMonth() + 1).padStart(2, '0')))
        player.setDynamicProperty("lastloginyyyy", tempdate.getFullYear())




        if (lastlogin.toDateString() == yesterday.toDateString()) {
            streak = streak + 1
            player.setDynamicProperty("streak", streak)
            player.runCommand('/tellraw @s {"rawtext":[{"text":"\n\n§l§5Welcome back!§r§l§r Your login streak: §g' + streak + '§r\nRewards today: §e' + streak * 200 + '§r\nRewards tomorrow: §e' + (streak + 1) * 200 + '§r\n\n"}]}')
            player.runCommand('scoreboard players add @s money ' + streak * 200)
        } else {
            player.sendMessage('§5Remember to login tomorrow to claim more rewards!')

        }



    }
})