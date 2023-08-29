import * as server from '@minecraft/server'
import * as ui from '@minecraft/server-ui'

const world = server.world

world.afterEvents.entityHitEntity.subscribe(eventData => {
    if (eventData.hitEntity.hasTag('floor1npc')) {


        const form = new ui.ActionFormData()
            .title("Dungeon Floor 1-1")
            .button("Teleport to Floor 1-1")

        form.show(eventData.damagingEntity).then(result => {
            if (result.selection == 0) {
                eventData.damagingEntity.runCommand('tp @s 1000 100 1000 facing 1010 100 1000')
            }
        })
    }
})

