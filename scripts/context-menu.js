class ContextMenu {
    constructor() {
        this.configs = {
            "DIV": [{
                name: "New",
                type: "Group",
                items: [
                    {
                        name: "Module",
                        type: "Group",
                        items: [
                            {
                                name: "Function",
                                events: [
                                    {
                                        name: "click",
                                        callback: (e) => {
                                            e.stopPropagation();
                                            this.createNewPanel(e, "Code");
                                        }
                                    }
                                ]
                            },
                            {
                                name: "Variable",
                                events: [
                                    {
                                        name: "click",
                                        callback: (e) => {
                                            e.stopPropagation();
                                            this.createNewPanel(e, "Variable");
                                        }
                                    }
                                ]
                            },
                            {
                                name: "Template",
                                events: [
                                    {
                                        name: "click",
                                        callback: (e) => {
                                            e.stopPropagation();
                                            this.createNewPanel(e, "Template");
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }, {
                name: "Close",
                events: [
                    {
                        name: "click",
                        callback: (e) => {
                            document.getElementById("contextmenu").style.display = "none";
                        }
                    }
                ]
            }]
        },
            this.panels = {
                "Code": {
                    name: "index",
                    body: `<textarea oninput="changeData(this)"></textarea>`
                },
                "Variable": {
                    name: "Variable",
                    body: `<input oninput="changeVar(this)" />`
                },
                "Template": {
                    name: "client",
                    body: ``
                }
            }
    }

    createNewPanel(e, type) {
        let div = document.createElement("div");
        div.style.display = "inline-block";
        div.draggable = "true";

        div.addEventListener("dragend", (ev) => {
            div.style.top = `${ev.clientY}px`;
            div.style.left = `${ev.clientX}px`;
        });

        let header = document.createElement("div");
        let body = document.createElement("div");

        let p = document.createElement("p");
        let panel = this.panels[type];

        p.innerText = panel.name;
        p.contentEditable = true;
        p.classList = type;
        p.oldName = p.innerText;

        switch(type){
            case "Code":
                sm.scripts.push({
                    name: p.innerText,
                    code: ""
                });
                break;

            case "Variable":
                sm.variables.push({
                    name: p.innerText,
                    data: ""
                });
                break;

            case "Template":
                sm.templates.push({
                    name: p.innerText,
                    code: ""
                });
                break;
        }

        p.addEventListener("input", (e) => {
            switch(type){
                case "Code":
                    sm.scripts.find(e => e.name == p.oldName).name = p.innerText;
                    p.oldName = p.innerText;
                    break;

                case "Variable":
                    sm.variables.find(e => e.name == p.oldName).name = p.innerText;
                    p.oldName = p.innerText;
                    break;

                case "Template":
                    sm.templates.find(e => e.name == p.oldName).name = p.innerText;
                    p.oldName = p.innerText;
                    break;
            }
        });

        header.appendChild(p)

        body.innerHTML = panel.body;
        body.classList = "StructBody";

        div.appendChild(header);
        div.appendChild(body);

        let { x, y } = menu.getPos(e);
        div.style.top = `${x}px`;
        div.style.left = `${y}px`;

        document.getElementById("overlay").appendChild(div);
    }

    getConfig(name) {
        return menu.configs[name] || null;
    }

    createGroup(obj, x) {
        obj.onclick = (e) => {
            e.stopPropagation()
            if (obj.getAttribute("active") == ("true" || true)) {
                obj.removeAttribute("active");
            } else {
                obj.setAttribute("active", true);
            }
        }

        let elem = document.createElement("div");


        for (let item of x.items) {
            if (item.type == "Group") {
                let ul = document.createElement("ul");
                ul.innerText = `${item.name} -> `;
                ul.appendChild(menu.createGroup(ul, item));

                elem.appendChild(ul);
            } else {
                let li = document.createElement("ul");
                li.innerText = item.name;

                for (let event of item.events) {
                    li.addEventListener(event.name, event.callback);
                }

                elem.appendChild(li);
            }
        }

        return elem;
    }

    createMenu(e) {
        let config = menu.getConfig(e.target.nodeName);
        if (config) {
            let div = document.createElement("div");
            div.style.display = "flex";
            div.style.flexDirection = "column";

            for (let x of config) {
                let obj = document.createElement("ul");
                obj.innerText = `${x.name} ->`;

                if (x.type != "Group") {
                    obj.innerText = x.name;

                    for (let event of x.events) {
                        obj.addEventListener(event.name, event.callback);
                    }

                } else {
                    obj.appendChild(menu.createGroup(obj, x));
                }

                div.appendChild(obj);
            }

            let cm = document.getElementById("contextmenu");
            cm.innerHTML = "";
            cm.appendChild(div);
            let { x, y } = menu.getPos(e);
            cm.style.display = "block";
            cm.style.top = `${y}px`;
            cm.style.left = `${x}px`;
        }
    }

    attachMenu(element) {
        element.addEventListener("contextmenu", menu.createMenu)
    }

    getPos(e) {
        var x;
        var y;
        // if (e.pageX || e.pageY) {
        //     x = e.pageX;
        //     y = e.pageY;
        // }
        // else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        // }

        x -= e.target.offsetLeft;
        y -= e.target.offsetTop;

        return { x, y }
    }
}

let menu = new ContextMenu();
menu.attachMenu(document.getElementById("overlay"));