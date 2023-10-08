import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'

const world = server.world


world.afterEvents.worldInitialize.subscribe(eventData => {
    const guild = new server.DynamicPropertiesDefinition().defineNumber("guildid", 0)
    eventData.propertyRegistry.registerEntityTypeDynamicProperties(guild, "minecraft:player")
    const guildinvite = new server.DynamicPropertiesDefinition().defineNumber("guildinvite", 0)
    eventData.propertyRegistry.registerEntityTypeDynamicProperties(guildinvite, "minecraft:player")
})

export function getguildname(player: server.Player) {
    var guildname: string

    if (player.getDynamicProperty("guildid") == 0) {
        return "$$$$"
    }
    world.scoreboard.getObjective("guildids").getParticipants().forEach(participant => {

        if (world.scoreboard.getObjective("guildids").getScore(participant) == player.getDynamicProperty("guildid")) {
            guildname = participant.displayName
        }
    })
    return guildname
}

export function guildform(player: server.Player) {
    const form = new ui.ActionFormData()
        .title("Guild Menu")
        .button("View Current Guild")
        .button("Current Invite")
        .button("Create Guild - 25k")

    let maxid = Math.max(...world.scoreboard.getObjective("guildids").getParticipants().map(map => world.scoreboard.getObjective("guildids").getScore(map)));

    form.show(player).then(eventData => {
        switch (eventData.selection) {
            case 0:
                const guildmanageform = new ui.ActionFormData()
                    .title("Manage Guild: " + getguildname(player))
                    .button("Invite")
                    .button("Guild Bank")
                    .button("Leave")

                if (player.getDynamicProperty("guildid") > 0) {

                    guildmanageform.show(player).then(data => {
                        switch (data.selection) {
                            case 0:
                                var guildmemberscount = world.scoreboard.getObjective("guildmemberscount").getScore(String(player.getDynamicProperty("guildid")))

                                if (guildmemberscount < 9) {
                                    const invitetoguild = new ui.ModalFormData()
                                        .title("Current Members: " + guildmemberscount)
                                        .textField("Player Name:", "Nick of the player to invite")
                                    invitetoguild.show(player).then(data => {
                                        let invited = world.getPlayers({ name: String(data.formValues[0]) })[0]
                                        invited.setDynamicProperty("guildinvite", player.getDynamicProperty("guildid"))
                                        invited.sendMessage("§3You got a guild invite!")

                                    })
                                } else { player.sendMessage("§4Too many players in the guild!") }

                                break;
                            case 2:
                                world.scoreboard.getObjective("guildmemberscount").addScore(String(player.getDynamicProperty("guildid")), -1)
                                player.setDynamicProperty("guildid", 0)
                                player.sendMessage("§4§lYou have left a guild!")
                                break;
                        }
                    })

                } else {
                    player.sendMessage("§4§lJoin a guild first!")
                }

                break;
            case 1:
                if (player.getDynamicProperty("guildinvite") != 0 && player.getDynamicProperty("guildinvite") != player.getDynamicProperty("guildid")) {
                    var guildname = "None"
                    world.scoreboard.getObjective("guildids").getParticipants().forEach(participant => {

                        if (world.scoreboard.getObjective("guildids").getScore(participant) == player.getDynamicProperty("guildinvite")) {
                            guildname = participant.displayName
                        }
                    })

                    const guildjoin = new ui.ActionFormData()
                        .title("You are invited to: " + guildname)
                        .button("Accept")
                        .button("Decline")

                    guildjoin.show(player).then(data => {

                        if (data.selection == 0) {
                            world.scoreboard.getObjective("guildmemberscount").addScore(String(player.getDynamicProperty("guildid")), -1)
                            player.setDynamicProperty("guildid", player.getDynamicProperty("guildinvite") as number)
                            player.setDynamicProperty("guildinvite", 0)
                            world.scoreboard.getObjective("guildmemberscount").addScore(String(player.getDynamicProperty("guildid")), 1)


                        } else {
                            player.sendMessage("§4You have declined an invitation to a guild!")
                        }
                    })

                } else {
                    player.sendMessage("§4You have no invites!")
                }

                break;
            case 2:
                const createguildform = new ui.ModalFormData()
                    .title("Create Guild")
                    .textField("Choose Guild Name:", "Guild Name")

                createguildform.show(player).then(data => {

                    if (world.scoreboard.getObjective("money").getScore(player) > 24999 && player.getDynamicProperty("guildid") == 0 && String(data.formValues[0]).length > 3) {
                        world.scoreboard.getObjective("guildids").addScore(data.formValues[0] as string, maxid + 1)
                        player.setDynamicProperty("guildid", maxid + 1)
                        world.scoreboard.getObjective("guildmemberscount").addScore(String(maxid + 1), 1)
                        world.scoreboard.getObjective("money").addScore(player, -25000)
                    } else {
                        player.sendMessage("§4§lSOMETHING WENT WRONG")
                    }

                })
                break;
            default: break;
        }
    })
}