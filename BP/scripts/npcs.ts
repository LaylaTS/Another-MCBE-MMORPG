import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'
import { guildform } from './guilds.js'
import { minioninteract } from './minionbehavior.js'

const world = server.world




world.afterEvents.playerInteractWithEntity.subscribe(eventData => {
    let entity: server.Entity = eventData.target

    if (entity.typeId == "mmorpg:marketsniffer") {
        let player = eventData.player as server.Player
        const money: number = player.getDynamicProperty("money") as number
        function removemoney(amount) {
            player.setDynamicProperty("money", money - amount)
        }
        const ironPrice = world.getDynamicProperty("iron_price") as number
        const diamondPrice = world.getDynamicProperty("diamond_price") as number
        const netheritePrice = world.getDynamicProperty("netherite_price") as number
        const aetheriumPrice = world.getDynamicProperty("aetherium_price") as number
        const emeraldPrice = world.getDynamicProperty("emerald_price") as number
        const rubyPrice = world.getDynamicProperty("ruby_price") as number
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
                        function maxquantity(price) {
                            let max = 0
                            let temp = money
                            while (temp >= price) {
                                max++
                                temp -= price
                                price = Math.ceil(price * 1.005)
                            }

                            return max
                        }
                        function cost(price, amount) {
                            let cost = 0
                            for (let i = 0; i < amount; i++) {
                                cost += price
                                price = Math.ceil(price * 1.005)
                            }
                            return cost
                        }
                        var resources = new ui.ActionFormData()
                            .title("Resources   Current Balance: " + money)
                            .button(`Iron - ${ironPrice + "$"}`, "textures/items/iron_ingot")
                            .button(`Oak Log - 50\$`, "textures/ui_icons/oak_log.png")
                            .button(`Diamond - ${diamondPrice + "$"}`, "textures/items/diamond")
                            .button(`Netherite - ${netheritePrice + "$"}`, "textures/items/netherite_ingot")
                            .button("Lava Bucket - 2500$", "textures/ui_icons/lava_bucket.png")
                            .button(`Aetherium - ${aetheriumPrice + "$"}`, "textures/items/aetherium")
                            .button("Nether Star - 20000$", "textures/items/nether_star")
                            .button(`Emerald - ${emeraldPrice + "$"}`, "textures/items/emerald")
                            .button(`Ruby - ${rubyPrice + "$"}`, "textures/items/ruby")

                        resources.show(player).then(result => {

                            if (result.selection == 0) {
                                var buy = new ui.ModalFormData()
                                    .title("Buy Iron")
                                    .slider("Amount", 0, maxquantity(ironPrice), 1, 0)

                                buy.show(player).then(result => {
                                    player.runCommand('give @s iron_ingot ' + Math.trunc(result.formValues[0] as number))
                                    removemoney(cost(ironPrice, (result.formValues[0] as number)))
                                    world.setDynamicProperty("iron_price", ironPrice + Math.trunc((ironPrice * 0.005 * (Math.trunc(result.formValues[0] as number)))))

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
                                var buy = new ui.ModalFormData()
                                    .title("Buy Diamond")
                                    .slider("Amount", 0, maxquantity(diamondPrice), 1, 0)

                                buy.show(player).then(result => {
                                    player.runCommand('give @s diamond ' + Math.trunc(result.formValues[0] as number))
                                    removemoney(cost(diamondPrice, (result.formValues[0] as number)))
                                    world.setDynamicProperty("diamond_price", diamondPrice + Math.trunc((diamondPrice * 0.005 * (Math.trunc(result.formValues[0] as number)))))
                                }).catch(() => { })
                            } else if (result.selection == 3) {
                                var buy = new ui.ModalFormData()
                                    .title("Buy Netherite")
                                    .slider("Amount", 0, maxquantity(netheritePrice), 1, 0)

                                buy.show(player).then(result => {
                                    player.runCommand('give @s netherite_ingot ' + Math.trunc(result.formValues[0] as number))
                                    removemoney(cost(netheritePrice, (result.formValues[0] as number)))
                                    world.setDynamicProperty("netherite_price", netheritePrice + Math.trunc((netheritePrice * 0.005 * (Math.trunc(result.formValues[0] as number)))))
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
                                    .slider("Amount", 0, maxquantity(aetheriumPrice), 1, 0)

                                buy.show(player).then(result => {
                                    player.runCommand('give @s mmorpg:aetherium ' + Math.trunc(result.formValues[0] as number))
                                    removemoney(cost(aetheriumPrice, (result.formValues[0] as number)))
                                    world.setDynamicProperty("aetherium_price", aetheriumPrice + Math.trunc((aetheriumPrice * 0.005 * (Math.trunc(result.formValues[0] as number)))))
                                }).catch(() => { })
                            } else if (result.selection == 6) {
                                var buy = new ui.ModalFormData()
                                    .title("Buy Nether Star")
                                    .slider("Amount", 0, money / 20000, 1, 0)

                                buy.show(player).then(result => {
                                    player.runCommand('give @s nether_star ' + Math.trunc(result.formValues[0] as number))
                                    removemoney(Math.trunc(result.formValues[0] as number) * 20000)
                                }).catch(() => { })
                            } else if (result.selection == 7) {
                                var buy = new ui.ModalFormData()
                                    .title("Buy Emerald")
                                    .slider("Amount", 0, maxquantity(emeraldPrice), 1, 0)

                                buy.show(player).then(result => {
                                    player.runCommand('give @s minecraft:emerald ' + Math.trunc(result.formValues[0] as number))
                                    removemoney(cost(emeraldPrice, (result.formValues[0] as number)))
                                    world.setDynamicProperty("emerald_price", emeraldPrice + Math.trunc((emeraldPrice * 0.005 * (Math.trunc(result.formValues[0] as number)))))
                                }).catch(() => { })
                            } else if (result.selection == 8) {
                                var buy = new ui.ModalFormData()
                                    .title("Buy Ruby")
                                    .slider("Amount", 0, maxquantity(rubyPrice), 1, 0)

                                buy.show(player).then(result => {
                                    player.runCommand('give @s mmorpg:ruby ' + Math.trunc(result.formValues[0] as number))
                                    removemoney(cost(rubyPrice, (result.formValues[0] as number)))
                                    world.setDynamicProperty("ruby_price", rubyPrice + Math.trunc((rubyPrice * 0.005 * (Math.trunc(result.formValues[0] as number)))))
                                }).catch(() => { })
                            }
                        })
                        break;
                    case 1:
                        player.sendMessage("Soon")
                        break;
                    case 2:
                        const swords = new ui.ActionFormData()
                            .title("Swords")
                            .button("Transcendent Blade - 100k", "textures/items/transcendentblade")

                            .show(player).then(data => {
                                if (data.selection == 0) {
                                    var buy = new ui.ModalFormData()
                                        .title("Transcendent Blade")
                                        .slider("Amount", 0, money / 100000, 1, 0)

                                    buy.show(player).then(result => {
                                        player.runCommand('give @s mmorpg:transcendentblade ' + Math.trunc(result.formValues[0] as number))
                                        removemoney(Math.trunc(result.formValues[0] as number) * 100000)
                                    }).catch(() => { })
                                }
                            }).catch(() => { })
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
                .button("Deposit", "textures/ui/arrow_down_large.png")
                .button("Withdraw", "textures/ui/arrow_up_large.png")
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
        } else if (entity.hasTag("sellnpc")) {
            function countitem(itemName: string) {
                const container = player.getComponent("inventory").container as server.PlayerInventoryComponentContainer

                let cnt = 0
                for (let i = 0; i < 36; i++) {
                    let item = container.getSlot(i)?.getItem()
                    if (item?.typeId == itemName) {
                        cnt += item.amount
                    }
                }
                return cnt
            }
            function sellitem(price, name, title, dynamicProperty) {
                let itemcnt = countitem(name)
                let money = 0
                new ui.ModalFormData().title(title).slider("Sell Amount", 0, itemcnt, 1, 0).show(player).then(data => {
                    console.warn(data.formValues[0])
                    for (let i = 0; i < data.formValues[0]; i++) {
                        money += price

                        price = Math.round(price * 0.995)
                    }
                    world.setDynamicProperty(dynamicProperty, price)
                    world.scoreboard.getObjective("money").addScore(player, Math.trunc(money * 0.9))
                    player.runCommand(`clear @s ${name} 0 ${data.formValues[0]}`)
                }).catch(() => { })
            }

            const sellitems = new ui.ActionFormData()
                .title("Sellable Items")
                .button(`Iron - ${ironPrice + "$"}`, "textures/items/iron_ingot")
                .button(`Diamond - ${diamondPrice + "$"}`, "textures/items/diamond")
                .button(`Netherite - ${netheritePrice + "$"}`, "textures/items/netherite_ingot")
                .button(`Aetherium - ${aetheriumPrice + "$"}`, "textures/items/aetherium")
                .button(`Emerald - ${emeraldPrice + "$"}`, "textures/items/emerald")
                .button(`Ruby - ${rubyPrice + "$"}`, "textures/items/ruby")

                .show(player).then(data => {
                    switch (data.selection) {
                        case 0: sellitem(ironPrice, "minecraft:iron_ingot", "Sell Iron", "iron_price"); break;
                        case 1: sellitem(diamondPrice, "minecraft:diamond", "Sell Diamonds", "diamond_price"); break;
                        case 2: sellitem(netheritePrice, "minecraft:netherite_ingot", "Sell Netherite", "netherite_price"); break;
                        case 3: sellitem(aetheriumPrice, "mmorpg:aetherium", "Sell Aetherium", "aetherium_price"); break;
                        case 4: sellitem(emeraldPrice, "minecraft:emerald", "Sell Emerald", "emerald_price"); break;
                        case 5: sellitem(rubyPrice, "mmorpg:ruby", "Sell Ruby", "ruby_price"); break;
                        default: break;
                    }
                }).catch(() => { })

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
