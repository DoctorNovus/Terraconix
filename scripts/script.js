class ScriptManager {
    constructor(){
        this.variables = [];
        this.scripts = [];
        this.templates = [];
    }

    edit(e){
        console.log(e);
    }
}

let sm = new ScriptManager();

function getVariable(name){
    return sm.variables[name] || null;
}

function changeData(e){
    let ScriptParent = e.parentElement.parentElement.children[0].children[0].innerText;
    sm.scripts.find(e => e.name == ScriptParent).code = e.value;
}

function changeVar(e){
    let ScriptParent = e.parentElement.parentElement.children[0].children[0].innerText;
    sm.variables.find(e => e.name == ScriptParent).data = e.value;
}

function changeTemplate(e){
    let ScriptParent = e.parentElement.parentElement.children[0].children[0].innerText;
    sm.templates.find(e => e.name == ScriptParent).code = e.value;
}