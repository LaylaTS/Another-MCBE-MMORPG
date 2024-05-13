import * as server from '@minecraft/server'
import { ChestFormData } from './extensions/forms.js'
import * as ui from '@minecraft/server-ui'

const world = server.world






world.afterEvents.buttonPush.subscribe(data => {
    const player = data.source

    if (data.block.z == 9996 && data.block.y == 2) {
        playDice(player as server.Player)
    }
})

function lootBoxMenu(player: server.Player) {
}

function playDice(player: server.Player) {
    new ui.ModalFormData()
        .title("Play Dice!")
        .slider("Choose Amount", 0, player.getDynamicProperty("money") as number, 1, 0)
        .dropdown("Choose your number!", ["1", "2", "3", "4", "5", '6'])
        .show(player).then(data => {
            const betAmount: number = Math.trunc(data.formValues[0] as number)
            if (betAmount > 0) {

                const selectedDie = (data.formValues[1]) as number + 1
                player.sendMessage(`§2You bet: §r${betAmount}§a$§r §2and selected number: §c§l${selectedDie}`)
                server.system.runTimeout(() => {
                    player.sendMessage(`§2Rolling...`)
                }, 10)
                addMoney(player, -betAmount)
                const roll = Math.trunc(Math.random() * 6) + 1

                server.system.runTimeout(() => {
                    player.sendMessage(`§2Rolled number: §c§l${roll}`)
                    server.system.runTimeout(() => {

                        if (selectedDie == roll) {
                            player.sendMessage(`§a§lCongratulations!§r§2 You won §a${betAmount * 5}§r$`)
                            addMoney(player, betAmount * 5)
                        } else {
                            player.sendMessage("§cYou lost!")
                        }
                    }, 10)
                }, 30)

            } else {
                player.sendMessage(`§l§cBet at least 1$`)
            }
        })
}

function addMoney(player: server.Player, amount: number) {
    player.setDynamicProperty("money", player.getDynamicProperty("money") as number + amount)
}