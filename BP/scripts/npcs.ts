import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'

const world = server.world




world.afterEvents.entityHitEntity.subscribe(eventData => {
    if (eventData.hitEntity.typeId == "mmorpg:marketsniffer") {
        let player = eventData.damagingEntity as server.Player
        if (eventData.hitEntity?.hasTag('marketsniffer')) {
            let form = new ui.ActionFormData()
                .title("Market")
                .body("Choose category:")
                .button("Resources") // 0 przy selection
                .button("Armor")
                .button("Weapons")
                .button("Tools")//, "textures/ui_icons/tools.png")
                .button("Potions")
                .button("Utility Items")
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

                        resources.show(player).then(result => {

                            if (result.selection == 0) {
                                var ironbuy = new ui.ModalFormData()
                                    .title("Buy Iron")
                                    .slider("Amount", 0, world.scoreboard.getObjective('money').getScore(player) / 250, 1, 0)

                                ironbuy.show(player).then(result => {
                                    player.runCommand('give @s iron_ingot ' + Math.trunc(result.formValues[0]))
                                    player.runCommand('scoreboard players remove @s money ' + Math.trunc(result.formValues[0]) * 250)

                                })
                            } else if (result.selection == 1) {
                                var oakbuy = new ui.ModalFormData()
                                    .title("Buy Oak")
                                    .slider("Amount", 0, world.scoreboard.getObjective('money').getScore(player) / 50, 1, 0)

                                oakbuy.show(player).then(result => {
                                    player.runCommand('give @s log ' + Math.trunc(result.formValues[0]))
                                    player.runCommand('scoreboard players remove @s money ' + Math.trunc(result.formValues[0]) * 50)
                                })
                            } else if (result.selection == 2) {
                                var diamondbuy = new ui.ModalFormData()
                                    .title("Buy Diamond")
                                    .slider("Amount", 0, world.scoreboard.getObjective('money').getScore(player) / 2000, 1, 0)

                                diamondbuy.show(player).then(result => {
                                    player.runCommand('give @s diamond ' + Math.trunc(result.formValues[0]))
                                    player.runCommand('scoreboard players remove @s money ' + Math.trunc(result.formValues[0]) * 2000)
                                })
                            } else if (result.selection == 3) {
                                var netheritebuy = new ui.ModalFormData()
                                    .title("Buy Netherite")
                                    .slider("Amount", 0, world.scoreboard.getObjective('money').getScore(player) / 100000, 1, 0)

                                netheritebuy.show(player).then(result => {
                                    player.runCommand('give @s netherite_ingot ' + Math.trunc(result.formValues[0]))
                                    player.runCommand('scoreboard players remove @s money ' + Math.trunc(result.formValues[0]) * 100000)
                                })
                            } else if (result.selection == 4) {
                                var lavabuy = new ui.ModalFormData()
                                    .title("Buy Lava Bucket")
                                    .slider("Amount", 0, world.scoreboard.getObjective('money').getScore(player) / 2500, 1, 0)

                                lavabuy.show(player).then(result => {
                                    player.runCommand('give @s lava_bucket ' + Math.trunc(result.formValues[0]))
                                    player.runCommand('scoreboard players remove @s money ' + Math.trunc(result.formValues[0]) * 2500)
                                })
                            }
                        })
                        break;
                    case 1:
                        player.runCommand("tell @s Soon")
                        break;
                    case 2:
                        player.runCommand("tell @s Soon")
                        break;
                    case 3:
                        player.runCommand("tell @s Soon")
                        break;
                    case 4:
                        var potions = new ui.ActionFormData()
                            .title("Potions")
                            .button("Small Mana Potion - 200$")

                        potions.show(player).then(result => {
                            if (result.selection == 0) {
                                var buysmallmanapotion = new ui.ModalFormData()
                                    .title("Small")
                                    .slider("Amount", 0, world.scoreboard.getObjective('money').getScore(player) / 200, 1, 0)

                                buysmallmanapotion.show(player).then(result => {
                                    player.runCommand('give @s mmorpg:smallmanapotion ' + Math.trunc(result.formValues[0]))
                                    player.runCommand('scoreboard players remove @s money ' + Math.trunc(result.formValues[0]) * 200)
                                })

                            }
                        })
                        break;
                    case 5: player.runCommand("tell @s Soon")
                        break;
                    default: break;
                }
            })
        } else if (eventData.hitEntity?.hasTag('bankingentity')) {
            let form = new ui.ActionFormData()
                .title("Bank")
                .button("Deposit", "textures/ui_icons/arrow-down-line.png")
                .button("Withdraw", "textures/ui_icons/arrow-up-line.png")
                .button(" Check Current Balance")




            form.show(player).then(result => {
                let selection = result.selection
                if (selection == 0) {
                    var deposit = new ui.ModalFormData()
                        .title('Deposit')
                        .slider('Money', 0, world.scoreboard.getObjective('money').getScore(player), 1, 0)


                    deposit.show(player).then(onFullfilled => {


                        let depositing = onFullfilled.formValues[0]
                        depositing = Math.trunc(depositing)
                        player.runCommandAsync('scoreboard players add @s bank ' + depositing)
                        player.runCommandAsync('scoreboard players remove @s money ' + depositing)



                    })

                } else if (selection == 1) {
                    var withdraw = new ui.ModalFormData()
                        .title('Withdraw')
                        .slider('Money', 0, world.scoreboard.getObjective('bank').getScore(player), 1, 0)

                    withdraw.show(player).then(withdrawn => {

                        let withdrawing = withdrawn.formValues[0]
                        withdrawing = Math.trunc(withdrawing)
                        player.runCommandAsync('scoreboard players add @s money ' + withdrawing)
                        player.runCommandAsync('scoreboard players remove @s bank ' + withdrawing)


                    })
                } else if (selection == 2) {
                    player.runCommand('tellraw @s {"rawtext":[{"text":"§gCurrent balance:§r §2"},{"score":{"name":"@s","objective":"bank"}}]}')
                }


            })
        }
    }
}

)
