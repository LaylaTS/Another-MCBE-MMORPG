import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'
import { guildform } from './guilds.js'
import { minioninteract } from './minionbehavior.js'

const world = server.world




world.afterEvents.playerInteractWithEntity.subscribe(eventData => {
    let entity = eventData.target

    if (entity.typeId == "mmorpg:marketsniffer") {
        let player = eventData.player as server.Player
        const money: number = player.getDynamicProperty("money") as number
        function removemoney(amount) {
            player.setDynamicProperty("money", money - amount)
        }
        if (entity.hasTag('marketsniffer')) {


            let form = new ui.ActionFormData()
                .title("Market")
                .body("Choose category:")
                .button("Resources", "textures/items/iron_ingot.png") // 0 przy selection
                .button("Armor", "textures/items/iron_chestplate.png")
                .button("Weapons", "textures/items/iron_sword.png")
                .button("Tools", "textures/ui_icons/tools.png")
                .button("Potions", "textures/items/potion_bottle_heal.png")
                .button("Utility Items", "textures/items/compass_item.png")
            form.show(player).then(result => {
                switch (result.selection) {
                    case 0:
                        var resources = new ui.ActionFormData()
                            .title("Resources   Current Balance: " + world.scoreboard.getObjective('money').getScore(player))
                            .button("Iron - 250$")//0
                            .button("Oak Log - 50$")//1
                            .button("Diamond - 2000$")
                            .button("Netherite - 100000$")
                            .button("Lava Bucket - 2500$")
                            .button("Aetherium - 2500$")

                        resources.show(player).then(result => {

                            if (result.selection == 0) {
                                var ironbuy = new ui.ModalFormData()
                                    .title("Buy Iron")
                                    .slider("Amount", 0, money / 250, 1, 0)

                                ironbuy.show(player).then(result => {
                                    player.runCommand('give @s iron_ingot ' + Math.trunc(result.formValues[0] as number))
                                    removemoney(Math.trunc(result.formValues[0] as number) * 250)

                                }).catch(() => { })
                            } else if (result.selection == 1) {
                                var oakbuy = new ui.ModalFormData()
                                    .title("Buy Oak")
                                    .slider("Amount", 0, money / 50, 1, 0)

                                oakbuy.show(player).then(result => {
                                    player.runCommand('give @s log ' + Math.trunc(result.formValues[0] as number))
                                    removemoney(Math.trunc(result.formValues[0] as number) * 50)
                                }).catch(() => { })
                            } else if (result.selection == 2) {
                                var diamondbuy = new ui.ModalFormData()
                                    .title("Buy Diamond")
                                    .slider("Amount", 0, money / 2000, 1, 0)

                                diamondbuy.show(player).then(result => {
                                    player.runCommand('give @s diamond ' + Math.trunc(result.formValues[0] as number))
                                    removemoney(Math.trunc(result.formValues[0] as number) * 2000)
                                }).catch(() => { })
                            } else if (result.selection == 3) {
                                var netheritebuy = new ui.ModalFormData()
                                    .title("Buy Netherite")
                                    .slider("Amount", 0, money / 100000, 1, 0)

                                netheritebuy.show(player).then(result => {
                                    player.runCommand('give @s netherite_ingot ' + Math.trunc(result.formValues[0] as number))
                                    removemoney(Math.trunc(result.formValues[0] as number) * 10000)
                                }).catch(() => { })
                            } else if (result.selection == 4) {
                                var lavabuy = new ui.ModalFormData()
                                    .title("Buy Lava Bucket")
                                    .slider("Amount", 0, money / 2500, 1, 0)

                                lavabuy.show(player).then(result => {
                                    player.runCommand('give @s lava_bucket ' + Math.trunc(result.formValues[0] as number))
                                    removemoney(Math.trunc(result.formValues[0] as number) * 2500)
                                }).catch(() => { })
                            } else if (result.selection == 5) {
                                var buy = new ui.ModalFormData()
                                    .title("Buy Aetherium")
                                    .slider("Amount", 0, money / 2500, 1, 0)

                                buy.show(player).then(result => {
                                    player.runCommand('give @s mmorpg:aetherium ' + Math.trunc(result.formValues[0] as number))
                                    removemoney(Math.trunc(result.formValues[0] as number) * 2500)
                                }).catch(() => { })
                            }
                        })
                        break;
                    case 1:
                        player.sendMessage("Soon")
                        break;
                    case 2:
                        player.sendMessage("Soon")
                        break;
                    case 3:
                        player.sendMessage("Soon")
                        break;
                    case 4:
                        var potions = new ui.ActionFormData()
                            .title("Potions")
                            .button("Small Mana Potion - 200$")

                        potions.show(player).then(result => {
                            if (result.selection == 0) {
                                var buysmallmanapotion = new ui.ModalFormData()
                                    .title("Small")
                                    .slider("Amount", 0, money / 200, 1, 0)

                                buysmallmanapotion.show(player).then(result => {
                                    player.runCommand('give @s mmorpg:smallmanapotion ' + Math.trunc(result.formValues[0] as number))
                                    removemoney(Math.trunc(result.formValues[0] as number) * 200)
                                }).catch(() => { })

                            }
                        })
                        break;
                    case 5: player.sendMessage("Soon")
                        break;
                    default: break;
                }
            })
        } else if (entity.hasTag('bankingentity')) {
            let form = new ui.ActionFormData()
                .title("Bank")
                .button("Deposit", "textures/ui_icons/arrow-down-line.png")
                .button("Withdraw", "textures/ui_icons/arrow-up-line.png")
                .button(" Check Current Balance")




            form.show(player).then(result => {
                const bank = player.getDynamicProperty("bankbalance") as number
                if (bank == undefined) {
                    player.setDynamicProperty("bankbalance", 0)
                }
                let selection = result.selection
                if (selection == 0) {
                    var deposit = new ui.ModalFormData()
                        .title('Deposit')
                        .slider('Money', 0, money, 1, 0)


                    deposit.show(player).then(onFullfilled => {


                        let depositing = onFullfilled.formValues[0]
                        depositing = Math.trunc(depositing as number)

                        player.setDynamicProperty("money", money - Math.trunc(depositing))
                        player.setDynamicProperty("bankbalance", bank + Math.trunc(depositing))



                    }).catch(() => { })

                } else if (selection == 1) {
                    var withdraw = new ui.ModalFormData()
                        .title('Withdraw')
                        .slider('Money', 0, bank, 1, 0)

                    withdraw.show(player).then(withdrawn => {

                        let withdrawing = withdrawn.formValues[0]
                        withdrawing = Math.trunc(withdrawing as number)
                        player.setDynamicProperty("bankbalance", bank - Math.trunc(withdrawing))
                        player.setDynamicProperty("money", money + Math.trunc(withdrawing))


                    }).catch(() => { })
                } else if (selection == 2) {
                    player.runCommand(`tellraw @s {"rawtext":[{"text":"§gCurrent balance:§r§2 ${bank}"}]}`)
                } else {

                }


            })
        }
    } else if (entity.typeId == "mmorpg:withernpc") {
        let player = eventData.player as server.Player
        const guildnpcform = new ui.ActionFormData()
            .title("Guilds")
            .button("Guild Menu")
            .button("Season")

        guildnpcform.show(player).then((form) => {
            if (form.selection == 1) {
                const seasonform = new ui.ActionFormData()
                    .title("Season")
                    .button("Show Full Ranking (Soon)")
                    .button("Detailed Info (Soon)")

                if (player.getDynamicProperty("guildid") == world.getDynamicProperty("lastseasonwinner") && world.scoreboard.getObjective("guildseasonclaimedrewards").getScore(player) == undefined) {
                    seasonform.button("Claim Rewards!")
                }
                seasonform.show(player).then(data => {
                    switch (data.selection) {
                        case 0:
                            player.sendMessage("Soon")
                            break;
                        case 1:
                            player.sendMessage("Soon")
                            break;
                        case 2:
                            world.scoreboard.getObjective("guildseasonclaimedrewards").addScore(player, player.getDynamicProperty("guildid") as number)
                            player.runCommand("give @s mmorpg:rodofdiscord")
                            break;
                    }
                }).catch(() => { })
            } else {
                guildform(player)
            }
        })

    } else if (entity.typeId == "mmorpg:minion") {
        minioninteract(eventData.player, entity)
    }
}

)
