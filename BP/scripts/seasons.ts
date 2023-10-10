import * as server from '@minecraft/server'

const world = server.world

server.system.runInterval(() => {



    // function getNextMondayMidnight() {
    //     const today = new Date();
    //     const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    //     const daysUntilNextMonday = 8 - dayOfWeek; // Calculate days until next Monday

    //     // Create a new date by adding the days until Monday
    //     const nextMonday = new Date(today);
    //     nextMonday.setDate(today.getDate() + daysUntilNextMonday);

    //     // Set the time to midnight (00:00:00)
    //     nextMonday.setHours(0, 0, 0, 0);

    //     return nextMonday;
    // }
    // var countDownDate: Date = getNextMondayMidnight()
    var countDownDate: Date = new Date('2023-10-10T18:14:00').getTime()
    var now = new Date().getTime();
    var distance = countDownDate - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    //console.warn(days, hours, minutes, days)
    // if (days == 0 && hours == 0 && minutes == 0 && seconds == 0) {
    ///scoreboard players reset * guildpoints 
    //}
    const scoreboard = world.scoreboard
    const guilds = []
    scoreboard.getObjective("guildpoints").removeParticipant("0")
    scoreboard.getObjective("guildpoints").getParticipants().forEach(participant => {
        guilds.push([participant.displayName, scoreboard.getObjective("guildpoints").getScore(participant)])
    })
    guilds.sort((a, b) => b[1] - a[1]);

    const guildnames: string[] = []
    for (let i = 0; i < guilds.length; i++) {
        scoreboard.getObjective("guildids").getParticipants().forEach(data => {



            if (guilds[i][0] == scoreboard.getObjective("guildids").getScore(data)) {
                guildnames.push(data.displayName)

            }

        })

    }

    world.getDimension("overworld").getEntities({ location: { x: 6, y: 67, z: 113 }, maxDistance: 30, families: ['floatingtext'] }).forEach(entity => {
        let combinedstring: string = ""
        for (let i = 0; i < guilds.length; i++) {
            combinedstring = combinedstring + `§l${i + 1}.§r ${guildnames[i]}§r - ${guilds[i][1]}\n`
        }
        entity.nameTag = '§g§lGuild Points Ranking:\n \n \n' + combinedstring
    })

}, 20)

