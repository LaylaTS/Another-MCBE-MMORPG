import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'


export function listitem(player: server.Player) {
    const invcomp = player.getComponent("inventory") as server.EntityInventoryComponent
    function removelisting() {

        if (player.getDynamicProperty("solditemid") != undefined) {
            let itemid = player.getDynamicProperty("solditemid") as string
            let amount = player.getDynamicProperty("solditemamount") as number


            let newitem = new server.ItemStack(itemid, amount)




            invcomp.container.addItem(newitem)
        }
        player.setDynamicProperty("solditemid", undefined)
        player.setDynamicProperty("solditemamount", undefined)
        player.setDynamicProperty("solditemdesc", undefined)
        player.setDynamicProperty("solditemprice", undefined)

    }
    server.system.run(() => {




    })
    const listitemui = new ui.ActionFormData()
        .title("listitem")
        .button("List Item (this will remove your current listing)")
        .button("Remove Current Listing")



    server.system.runTimeout(() => {
        listitemui.show(player).then(data => {

            if (data.selection == 0) {
                const item = invcomp.container.getItem(player.selectedSlot) as server.ItemStack

                new ui.ModalFormData()
                    .title("Listing Details")
                    .textField("Listing Title", "Diamond Sword", item.typeId)
                    .textField("Price: (FOR ALL ITEMS NOT JUST ONE)", "100", "100")
                    .show(player).then(data => {

                        let price = parseInt(data.formValues[1] as string)
                        if (isNaN(price)) price = 1
                        console.warn(price)
                        removelisting()

                        player.setDynamicProperty("solditemid", item.typeId)
                        player.setDynamicProperty("solditemamount", item.amount)
                        player.setDynamicProperty("solditemprice", price)
                        player.setDynamicProperty("solditemdesc", data.formValues[0])
                        invcomp.container.getSlot(player.selectedSlot).setItem(undefined)


                    }).catch(() => { player.sendMessage("ERROR") })
            } else if (data.selection == 1) { removelisting() }

        }).catch(() => { player.sendMessage("ERROR") })
    }, 20)
}

export function viewauctions(player: server.Player) {
    const world = server.world
    const playerswithlistings: server.Player[] = []
    const listingui = new ui.ActionFormData()
        .title("Listings")
    world.getAllPlayers().forEach(player => {
        if (player.getDynamicProperty("solditemid") != undefined) {
            playerswithlistings.push(player)
            listingui.button(`${player.getDynamicProperty("solditemdesc")}\nPrice: ${player.getDynamicProperty("solditemprice")} - Item ID: ${player.getDynamicProperty("solditemid")}`)
        }
    })
    if (playerswithlistings.length > 0) {

        server.system.runTimeout(() => {

            listingui.show(player).then(data => {
                let list = playerswithlistings[data.selection]
                let itemid = list.getDynamicProperty("solditemid") as string
                let price = list.getDynamicProperty("solditemprice") as number
                let amount = list.getDynamicProperty("solditemamount") as number
                new ui.ActionFormData()
                    .title("BUY")
                    .body(`Seller: ${list.name}\nListing Title: ${list.getDynamicProperty("listingdesc")}\nSold Item ID: ${itemid}\nSold Item Amount: ${price}\nSold Item Price: ${price}\n`)
                    .button("Confirm")
                    .show(player).then(data => {
                        if (player.getDynamicProperty("money") >= price && list.isValid()) {
                            let invcomp = player.getComponent("inventory") as server.EntityInventoryComponent
                            invcomp.container.addItem(new server.ItemStack(itemid, amount))
                            player.setDynamicProperty("money", player.getDynamicProperty("money") as number - price)
                            list.setDynamicProperty("money", list.getDynamicProperty("money") as number + price)
                            list.setDynamicProperty("solditemid", undefined)
                        } else player.sendMessage("Transaction Failed")
                    }).catch(() => { })
            })

        }, 20)
    } else { player.sendMessage("NO ACTIVE OFFERS") }

}