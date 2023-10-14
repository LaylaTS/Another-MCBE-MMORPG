import * as server from '@minecraft/server'

const world = server.world

world.afterEvents.worldInitialize.subscribe(eventData => {
    const guild = new server.DynamicPropertiesDefinition().defineNumber("lastseasonwinner", -1)
    eventData.propertyRegistry.registerWorldDynamicProperties(guild)
    const seasondaysleft = new server.DynamicPropertiesDefinition().defineNumber("seasondaysleft")
    eventData.propertyRegistry.registerWorldDynamicProperties(seasondaysleft)
    const seasonhoursleft = new server.DynamicPropertiesDefinition().defineNumber("seasonhoursleft")
    eventData.propertyRegistry.registerWorldDynamicProperties(seasonhoursleft)
    const seasonminutesleft = new server.DynamicPropertiesDefinition().defineNumber("seasonminutesleft")
    eventData.propertyRegistry.registerWorldDynamicProperties(seasonminutesleft)
    const seasonsecondsleft = new server.DynamicPropertiesDefinition().defineNumber("seasonsecondsleft")
    eventData.propertyRegistry.registerWorldDynamicProperties(seasonsecondsleft)
})

server.system.runInterval(() => {



    function getNextMonday() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        const daysUntilNextMonday = 8 - dayOfWeek; // Calculate days until next Monday

        // Create a new date by adding the days until Monday
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + daysUntilNextMonday);


        nextMonday.setHours(0, 0, 0, 0);

        return nextMonday;
    }
    var countDownDate = getNextMonday()
    var now = new Date().getTime();
    var distance = countDownDate - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // console.warn(days, hours, minutes, seconds)
    world.setDynamicProperty("seasondaysleft", days)
    world.setDynamicProperty("seasonhoursleft", hours)
    world.setDynamicProperty("seasonminutesleft", minutes)
    world.setDynamicProperty("seasonsecondsleft", seconds)


    const scoreboard = world.scoreboard
    const guilds = []
    scoreboard.getObjective("guildpoints").removeParticipant("0")
    scoreboard.getObjective("guildpoints").getParticipants().forEach(participant => {
        guilds.push([participant.displayName, scoreboard.getObjective("guildpoints").getScore(participant)])
    })
    guilds.sort((a, b) => b[1] - a[1]);

    const guildnames = []
    for (let i = 0; i < guilds.length; i++) {
        scoreboard.getObjective("guildids").getParticipants().forEach(data => {



            if (guilds[i][0] == scoreboard.getObjective("guildids").getScore(data)) {
                guildnames.push(data.displayName)

            }

        })

    }

    if (days == 0 && hours == 0 && minutes == 0 && seconds == 0 && guildnames[0] != undefined) {
        world.sendMessage(`§g§lSeason Winner:§r ${guildnames[0]}`)

        world.scoreboard.getObjective("guildbank").addScore(String(guilds[0][0]), 100000)
        world.setDynamicProperty("lastseasonwinner", parseInt(guilds[0][0]))
        if (guildnames[1] != undefined) {
            world.sendMessage(`§e§lSecond Place:§r ${guildnames[1]}`)

            scoreboard.getObjective("guildbank").addScore(String(guilds[1][0]), 50000)
            if (guildnames[2] != undefined) {
                world.sendMessage(`§6§lThird Place:§r ${guildnames[2]}`)
                scoreboard.getObjective("guildbank").setScore(String(guilds[2][0]), 25000)
            }
        }
        scoreboard.removeObjective("guildpoints")
        scoreboard.addObjective("guildpoints", "guildpoints")
        scoreboard.removeObjective("guildseasonclaimedrewards")
        scoreboard.addObjective("guildseasonclaimedrewards", "guildseasonclaimedrewards")

        //scoreboard players reset * guildpoints
    }
    world.getDimension("overworld").getEntities({ location: { x: 6, y: 67, z: 113 }, maxDistance: 30, families: ["floatingtext"] }).forEach(entity => {

        let combinedstring = ""
        for (let i = 0; i < guilds.length; i++) {
            combinedstring = combinedstring + `§l${i + 1}.§r ${guildnames[i]}§r - ${guilds[i][1]}\n`
        }
        if (entity.hasTag("Time Display")) {
            entity.nameTag = `§4§lTime Left:\n${days}D ${hours}H ${minutes}m ${seconds}s`
        } else {
            entity.nameTag = '§g§lGuild Points Ranking:\n \n \n' + combinedstring
        }

    })

}, 20)

