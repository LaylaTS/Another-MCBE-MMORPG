import * as server from '@minecraft/server'
import { ChestFormData } from './extensions/forms.js'
import * as ui from '@minecraft/server-ui'

const world = server.world

world.afterEvents.buttonPush.subscribe(data => {
    const player = data.source

    if (data.block.z == 9996 && data.block.y == 2) {
        console.warn("TEST")
    }
})

function lootBoxMenu(player: server.Player) {
    new ChestFormData("single")
        .title("Choose Lootbox")
}