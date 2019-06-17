var clientSystem = client.registerSystem(0, 0);


let globalVars = {};
globalVars.rocket = false;
globalVars.position = null;

clientSystem.initialize = function() {
    this.listenForEvent("minecraft:ui_event", (eventData) => this.onUIMessage(eventData));
    this.listenForEvent("minecraft:client_entered_world", (eventData) => this.onClientEnteredWorld(eventData));
    this.listenForEvent("minecraft:hit_result_continuous", (eventData) => this.onLookingAt(eventData));
    this.listenForEvent("rtr:entered_rocket", (eventData) => this.onRocket(eventData));
    this.listenForEvent("rtr:left_rocket", (eventData) => this.onLeftRocket(eventData));
};

clientSystem.update = function() {};

clientSystem.onClientEnteredWorld = function(eventData) {
    // Client has entered the world, show the starting screen
    let loadEventData = this.createEventData("minecraft:load_ui");
    loadEventData.data.path = "test.html";
    loadEventData.data.options.is_showing_menu = false;
    loadEventData.data.options.absorbs_input = true;
    clientSystem.broadcastEvent("minecraft:load_ui", loadEventData);

};

clientSystem.onUIMessage = function(eventDataObject) {
    let eventData = eventDataObject.data;
    if (eventData == "leavePressed") {
        let unloadEventData = this.createEventData("minecraft:unload_ui");
        unloadEventData.data.path = "test.html";
        this.broadcastEvent("minecraft:unload_ui", unloadEventData);
        this.sendMsg("§eAddon by §cRedstoneTorchRockets§9 Visit §brtr.logilutions.de§r!");
    } else if (eventData == "leaveRocket") {
        let unloadEventData = this.createEventData("minecraft:unload_ui");
        unloadEventData.data.path = "cockpit.html";
        this.broadcastEvent("minecraft:unload_ui", unloadEventData);
    } else if (eventData == "readyForRocket") {
        globalVars.lookingAtRocket = false;
    } else if (eventData == "visitWebsite") {
        this.location.href = "http://rtr.logilutions.de";
    }
};

clientSystem.runCommand = function(command) {
    commandData = this.createEventData("minecraft:execute_command")
    commandData.data.command = command
    this.broadcastEvent("minecraft:execute_command", commandData)
}

clientSystem.sendMsg = function(msg) {
    let message = this.createEventData("minecraft:display_chat_event");
    message.data.message = msg;
    clientSystem.broadcastEvent("minecraft:display_chat_event", message);
}

clientSystem.onRocket = function(eventData) {
    if (!globalVars.rocket) {
        this.sendMsg("§eLoading GUI...§r");
        let loadEventData = this.createEventData("minecraft:load_ui");
        loadEventData.data.path = "cockpit.html";
        loadEventData.data.options.is_showing_menu = false;
        loadEventData.data.options.absorbs_input = false;
        loadEventData.data.options.should_steal_mouse = true;
        loadEventData.data.options.render_game_behind = true;
        clientSystem.broadcastEvent("minecraft:load_ui", loadEventData);
        globalVars.rocket = false;
    }
}

clientSystem.onLeftRocket = function(eventData) {
    if (globalVars.rocket) {
        this.sendMsg("§eUnloading GUI...§r");
        let unloadEventData = this.createEventData("minecraft:unload_ui");
        unloadEventData.data.path = "cockpit.html";
        this.broadcastEvent("minecraft:unload_ui", unloadEventData);
        globalVars.rocket = true;
    }
}

clientSystem.onLookingAt = function(eventData) {
    if (eventData.position !== null && eventData.data.entity.__identifier__ == "rtr:rocket" && globalVars.lookingAtRocket) {
        let loadEventData = this.createEventData("minecraft:load_ui");
        loadEventData.data.path = "lookingAtRocket.html";
        loadEventData.data.options.is_showing_menu = false;
        loadEventData.data.options.absorbs_input = false;
        loadEventData.data.options.should_steal_mouse = true;
        loadEventData.data.options.render_game_behind = true;
        clientSystem.broadcastEvent("minecraft:load_ui", loadEventData);
    } else {
        if (eventData.position == null || eventData.data.entity.__identifier__ !== "rtr:rocket") {
            let unloadEventData = this.createEventData("minecraft:unload_ui");
            unloadEventData.data.path = "lookingAtRocket.html";
            this.broadcastEvent("minecraft:unload_ui", unloadEventData);
        }
    }
}