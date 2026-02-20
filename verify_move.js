const originalBlueprint = {
    sections: [
        { id: "hero1", type: "Hero", props: { title: "A" } },
        { id: "feat2", type: "Features", props: { title: "B" } },
        { id: "cta3", type: "CTA", props: { title: "C" } }
    ]
};

let activeBlueprint = JSON.parse(JSON.stringify(originalBlueprint));

function simMessage(type, index) {
    if (type === 'DELETE_SECTION') {
        const newBlueprint = { ...activeBlueprint };
        newBlueprint.sections = newBlueprint.sections.filter((_, i) => i !== index);
        activeBlueprint = newBlueprint;
        console.log("After DELETE at", index, activeBlueprint.sections.map(s => s.type));
    } else if (type === 'MOVE_UP_SECTION') {
        if (!activeBlueprint || index === 0) return;
        const newBlueprint = { ...activeBlueprint };
        const sections = [...newBlueprint.sections];
        const temp = sections[index - 1];
        sections[index - 1] = sections[index];
        sections[index] = temp;
        newBlueprint.sections = sections;
        activeBlueprint = newBlueprint;
        console.log("After MOVE UP at", index, activeBlueprint.sections.map(s => s.type));
    } else if (type === 'MOVE_DOWN_SECTION') {
        if (!activeBlueprint || index === activeBlueprint.sections.length - 1) return;
        const newBlueprint = { ...activeBlueprint };
        const sections = [...newBlueprint.sections];
        const temp = sections[index + 1];
        sections[index + 1] = sections[index];
        sections[index] = temp;
        newBlueprint.sections = sections;
        activeBlueprint = newBlueprint;
        console.log("After MOVE DOWN at", index, activeBlueprint.sections.map(s => s.type));
    } else if (type === 'REGENERATE_SECTION') {
        if (!activeBlueprint || !originalBlueprint) return;
        const newBlueprint = { ...activeBlueprint };
        newBlueprint.sections = [...newBlueprint.sections];

        // BUG FIX: matching by id instead of index!
        const targetId = newBlueprint.sections[index].id;
        const origSection = originalBlueprint.sections.find(s => s.id === targetId);
        if (origSection) {
            newBlueprint.sections[index] = JSON.parse(JSON.stringify(origSection));
            activeBlueprint = newBlueprint;
            console.log("After REGENERATE at", index, "Found ID:", targetId);
        } else {
            console.log("After REGENERATE, id not found for", targetId);
        }
    }
}

simMessage('MOVE_DOWN_SECTION', 0); // swaps Hero and Features -> Features, Hero, CTA
simMessage('REGENERATE_SECTION', 1); // Hero is at 1. Wait, if it regenerates 1, it should find Hero.

