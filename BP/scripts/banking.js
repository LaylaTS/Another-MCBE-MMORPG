import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'

const world = server.world

const form = new ui.ActionFormData()
    .title("Bank")
    .button("Deposit", "textures/ui_icons/arrow-down-line.png")
    .button("Withdraw", "textures/ui_icons/arrow-up-line.png")
    .button(" Check Current Balance")


world.afterEvents.entityHitEntity.subscribe(eventData => {
    if (eventData.hitEntity.hasTag('bankingentity')) {
        var player = eventData.damagingEntity
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

)
