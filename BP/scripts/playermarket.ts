import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'
import { deepClone } from './main.js'

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
        let a = invcomp.container.getItem(player.selectedSlot);

        // Check if a has a typeId property
        if (a && a.typeId) {
            console.warn("Before JSON.stringify:", a.typeId);

            // Use Object.assign to create a deep copy of 'a'
            let copyOfA = Object.assign({}, a);

            // Stringify and parse the copied object
            let i = JSON.stringify(copyOfA);
            console.warn("Stringified:", i);

            let b = JSON.parse(i) as server.ItemStack;
            console.warn("After JSON.parse:", b.typeId);
        } else {
            console.warn("The 'a' object does not have a 'typeId' property.");
        }



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