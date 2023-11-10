import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'

export function listitem(player: server.Player) {
    function removelisting() {
        if (player.getDynamicProperty("solditem") != undefined) {
            let item = player.getDynamicProperty("solditem") as string
            invcomp.container.addItem(JSON.parse(item))
        }
        player.setDynamicProperty("solditem", undefined)
        player.setDynamicProperty("solditemprice", undefined)

    }
    const invcomp = player.getComponent("inventory") as server.EntityInventoryComponent
    server.system.run(() => {


        let i = JSON.stringify(invcomp.container.getSlot(player.selectedSlot).getItem())
        server.world.sendMessage(String(i))
    })
    const listitemui = new ui.ActionFormData()
        .title("listitem")
        .button("List Item (this will remove your current listing)")
        .button("Remove Current Listing")



    // server.system.run(() => {
    //     listitemui.show(player).then(data => {
    //         if (data.selection == 0) {
    //             //removelisting()

    //             //player.setDynamicProperty("solditem", JSON.stringify(invcomp.container.getItem(player.selectedSlot)))
    //             //invcomp.container.setItem(player.selectedSlot, new server.ItemStack("minecraft:air", 1))


    //         } else { removelisting() }

    //     })//.catch(() => { })
    // })
}