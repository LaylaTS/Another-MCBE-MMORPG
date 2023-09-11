import * as server from '@minecraft/server'

const world = server.world;

// world.afterEvents.chatSend.subscribe(eventData => {
//     if (eventData.sender.name == "WojtekBB") {
//         if (eventData.message == "populatemoss") {
//             let x = -15
//             let y = -15
//             let z = -15
//             while (y < 16) {
//                 while (z < 16) {
//                     while (x < 16) {
//                         let block = world.getDimension("minecraft:overworld").getBlock({ x: x, y: y, z: z })
//                         if (block.typeId == "minecraft:stone" && world.getDimension("minecraft:overworld").getBlock({ x: x, y: y + 1, z: z }).isAir()) {
//                             block.setType(server.MinecraftBlockTypes.mossBlock)
//                         }


//                         x++
//                     }
//                     x = -15
//                     z++
//                 }
//                 y++
//                 z = -15
//             }

//         }
//     }
// })