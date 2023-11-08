	import * as server from '@minecraft/server'
import { mining } from './mining.js'
import {farming} from "./farming.js"
const world = server.world

world.beforeEvents.playerBreakBlock.subscribe(data => {
    
    if (data.block.permutation.getState("growth") == undefined) {
        mining(data.player, data.block.type.id)
    } else {farming(data)}

})