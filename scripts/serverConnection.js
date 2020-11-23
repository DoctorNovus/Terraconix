async function save() {
    let file = "index.js";
    let code = "";

    for (let template of sm.templates) {
        code += eval(`${template.name}()`) + "\n";
    }

    for (let script of sm.scripts) {
        code += `function ${script.name}(){
            ${script.code}
        }\n`
    }

    for (let vari of sm.variables) {
        code += `let ${vari.name} = "${vari.data}"\n`;
    }

    await fetch("/api/save", {
        method: "POST",
        body: JSON.stringify({
            name: file,
            data: code
        })
    });

    await menu.setSettings({
        variables: sm.variables,
        scripts: sm.scripts,
        templates: sm.templates
    });
}

async function run() {
    let file = "index.js";

    await fetch("/api/run", {
        method: "POST",
        body: JSON.stringify(file)
    });
}