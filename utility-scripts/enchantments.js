const fs = require('fs');

const enchantments = [
    // All Purpose
    { name: "Mending"},
    { name: "Unbreaking"},
    { name: "Curse of Vanishing"},

    // Armor
    { name: "Aqua Affinity"},
    { name: "Blast Protection"},
    { name: "Curse of Binding"},
    { name: "Depth Strider"},
    { name: "Feather Falling"},
    { name: "Fire Protection"},
    { name: "Frost Walker"},
    { name: "Projectile Protection"},
    { name: "Protection"},
    { name: "Respiration"},
    { name: "Soul Speed"},
    { name: "Thorns"},
    { name: "Swift Sneak"},

    // Melee Weapons
    { name: "Bane of Arthropods"},
    { name: "Efficiency"},
    { name: "Fire Aspect"},
    { name: "Looting"},
    { name: "Impaling"},
    { name: "Knockback"},
    { name: "Sharpness"},
    { name: "Smite"},
    { name: "Sweeping Edge"},

    // Ranged Weapons
    { name: "Channeling"},
    { name: "Flame"},
    { name: "Impaling"},
    { name: "Infinity"},
    { name: "Loyalty"},
    { name: "Riptide"},
    { name: "Multishot"},
    { name: "Piercing"},
    { name: "Power"},
    { name: "Punch"},
    { name: "Quick Charge"},


    { name: "Efficiency"},
    { name: "Fortune"},
    { name: "Luck of the Sea"},
    { name: "Lure"},
    { name: "Silk Touch"}
];


for (let i = 0; i < enchantments.length; i++) {
    const name = enchantments[i].name;

    //make a copy of the file book.gif to ./dist/${name}.gif


    fs.copyFile("book.gif", `./dist/${name}.gif`, (err) => {
        if (err) throw err;
        console.log(`book.gif was copied to ./dist/${name}.gif`);
    });
}

//
