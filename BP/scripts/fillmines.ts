import * as server from '@minecraft/server'

export function fillmines() {
    const world = server.world
    const dimension = world.getDimension("overworld")
    server.system.run(async () => {
        function randomstone() {
            return Math.floor(Math.random() * 100) + 200;
        }
        function randomdeepslate() {

            return Math.floor(Math.random() * 100) + 100;
        }
        function randomnetherrack() {
            return Math.floor(Math.random() * 50) + 50;
        }
        function randcords() {
            return Math.floor(Math.random() * 31) + 4985;
        }
        for (let i = 201; i < 300; i++) {
            await null
            dimension.fillBlocks({ x: 5015, y: i, z: 5015 }, { x: 4985, y: i, z: 4985 }, "minecraft:stone")

        }
        for (let i = 100; i < 201; i++) {
            await null
            dimension.fillBlocks({ x: 5015, y: i, z: 5015 }, { x: 4985, y: i, z: 4985 }, "minecraft:deepslate")

        }
        for (let i = 50; i < 100; i++) {
            await null
            dimension.fillBlocks({ x: 5015, y: i, z: 5015 }, { x: 4985, y: i, z: 4985 }, "minecraft:netherrack")
        }
        dimension.fillBlocks({ x: 5015, y: 45, z: 5015 }, { x: 4985, y: 49, z: 4985 }, "minecraft:bedrock")

        for (let i = 0; i < 400; i++) {
            var randx = randcords()
            var randz = randcords()
            var randy = randomnetherrack()
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:nether_gold_ore")
        }
        for (let i = 0; i < 400; i++) {
            var randx = randcords()
            var randz = randcords()
            var randy = randomnetherrack()
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:quartz_ore")
        }
        for (let i = 0; i < 600; i++) {
            var randx = randcords()
            var randz = randcords()
            var randy = randomdeepslate()
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:deepslate_emerald_ore")
        }
        for (let i = 0; i < 800; i++) {
            var randx = randcords()
            var randz = randcords()
            var randy = randomdeepslate()
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:deepslate_gold_ore")
        }
        for (let i = 0; i < 225; i++) {
            var randx = randcords()
            var randz = randcords()
            var randy = randomdeepslate()
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "mmorpg:deepslate_ruby_ore")
        }
        for (let i = 0; i < 150; i++) {
            var randx = randcords()
            var randz = randcords()
            var randy = randomdeepslate()
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:deepslate_diamond_ore")
        }
        for (let i = 0; i < 125; i++) {
            var randx = randcords()
            var randz = randcords()
            var randy = randomdeepslate()
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "mmorpg:deepslate_aetherium_ore")
        }
        for (let i = 0; i < 4; i++) {
            var randx = randcords()
            var randz = randcords()
            var randy = randomdeepslate()
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "amethyst_block")
        }



        for (let i = 0; i < 650; i++) {
            var randx = randcords()
            var randz = randcords()
            var randy = randomstone()
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:iron_ore")
        }
        for (let i = 0; i < 500; i++) {
            var randx = randcords()
            var randz = randcords()
            var randy = randomstone()
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:coal_ore")
        }
        for (let i = 0; i < 350; i++) {
            var randx = randcords()
            var randz = randcords()
            var randy = randomstone()
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:redstone_ore")
        }
        for (let i = 0; i < 500; i++) {
            var randx = randcords()
            var randz = randcords()
            var randy = randomstone()
            dimension.fillBlocks({ x: randx, y: randy, z: randz }, { x: randx, y: randy, z: randz }, "minecraft:copper_ore")
        }

    })

}