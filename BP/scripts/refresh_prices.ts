import * as server from '@minecraft/server'

const world = server.world

export function refreshprices() {
    world.setDynamicProperty("iron_price", 200)
    world.setDynamicProperty("diamond_price", 500)
    world.setDynamicProperty("netherite_price", 2500)
    world.setDynamicProperty("aetherium_price", 500)
    world.setDynamicProperty("ruby_price", 600)
    world.setDynamicProperty("emerald_price", 500)
}