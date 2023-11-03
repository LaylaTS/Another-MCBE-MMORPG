import * as server from '@minecraft/server'

export function fillmines() {
    const world = server.world
    const dimension = world.getDimension("overworld")
    server.system.run(async () => {
        for (let i = 201; i < 300; i++) {
            await null
            dimension.fillBlocks({ x: 5015, y: i, z: 5015 }, { x: 4985, y: i, z: 4985 }, "minecraft:stone")

        }
        for (let i = -62; i < 201; i++) {
            await null
            dimension.fillBlocks({ x: 5015, y: i, z: 5015 }, { x: 4985, y: i, z: 4985 }, "minecraft:deepslate")

        }
        for (let i = 0; i < 1200; i++) {
            var randx = Math.floor(Math.random() * 31) + 4985;
            var randz = Math.floor(Math.random() * 31) + 4985;
            var randy = Math.floor(Math.random() * 263) - 62;
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:deepslate_emerald_ore")
        }
        for (let i = 0; i < 1500; i++) {
            var randx = Math.floor(Math.random() * 31) + 4985;
            var randz = Math.floor(Math.random() * 31) + 4985;
            var randy = Math.floor(Math.random() * 263) - 62;
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:deepslate_gold_ore")
        }
        for (let i = 0; i < 450; i++) {
            var randx = Math.floor(Math.random() * 31) + 4985;
            var randz = Math.floor(Math.random() * 31) + 4985;
            var randy = Math.floor(Math.random() * 263) - 62;
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "mmorpg:deepslate_ruby_ore")
        }
        for (let i = 0; i < 300; i++) {
            var randx = Math.floor(Math.random() * 31) + 4985;
            var randz = Math.floor(Math.random() * 31) + 4985;
            var randy = Math.floor(Math.random() * 263) - 62;
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:deepslate_diamond_ore")
        }
        for (let i = 0; i < 250; i++) {
            var randx = Math.floor(Math.random() * 31) + 4985;
            var randz = Math.floor(Math.random() * 31) + 4985;
            var randy = Math.floor(Math.random() * 263) - 62;
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "mmorpg:deepslate_aetherium_ore")
        }
        for (let i = 0; i < 5; i++) {
            var randx = Math.floor(Math.random() * 31) + 4985;
            var randz = Math.floor(Math.random() * 31) + 4985;
            var randy = Math.floor(Math.random() * 263) - 62;
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "amethyst_block")
        }



        for (let i = 0; i < 650; i++) {
            var randx = Math.floor(Math.random() * 31) + 4985;
            var randz = Math.floor(Math.random() * 31) + 4985;
            var randy = Math.floor(Math.random() * 100) + 200;
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:iron_ore")
        }
        for (let i = 0; i < 500; i++) {
            var randx = Math.floor(Math.random() * 31) + 4985;
            var randz = Math.floor(Math.random() * 31) + 4985;
            var randy = Math.floor(Math.random() * 100) + 200;
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:coal_ore")
        }
        for (let i = 0; i < 350; i++) {
            var randx = Math.floor(Math.random() * 31) + 4985;
            var randz = Math.floor(Math.random() * 31) + 4985;
            var randy = Math.floor(Math.random() * 100) + 200;
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:redstone_ore")
        }
        for (let i = 0; i < 500; i++) {
            var randx = Math.floor(Math.random() * 31) + 4985;
            var randz = Math.floor(Math.random() * 31) + 4985;
            var randy = Math.floor(Math.random() * 100) + 200;
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:copper_ore")
        }

    })

}