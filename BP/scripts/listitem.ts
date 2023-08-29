import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'

server.world.beforeEvents.chatSend.subscribe((eventData) => {

    if (eventData.message == "!sell") {
        var player = eventData.sender

        var inventory = player.getComponent("inventory") as server.EntityInventoryComponent;
        var item = inventory.container.getItem(player.selectedSlot)
        const getItemName = (item) => {
            return item.nameTag ?? item.typeId.split(":")[1].split('_').map(v => v[0].toUpperCase() + v.slice(1).toLowerCase()).join(" ")
        }



    }

})