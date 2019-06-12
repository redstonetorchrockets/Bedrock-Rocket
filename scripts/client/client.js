var ClientSystem = client.registerSystem(0, 0);


let globalVars = {};
globalVars.lookingAtRocket = false;

ClientSystem.initialize = function() {
    this.listenForEvent("minecraft:ui_event", (eventData) => this.onUIMessage(eventData));
    this.listenForEvent("minecraft:client_entered_world", (eventData) => this.onClientEnteredWorld(eventData));
    this.listenForEvent("minecraft:hit_result_continuous", (eventData) => this.onLookingAt(eventData));
};

ClientSystem.update = function() {};

ClientSystem.onClientEnteredWorld = function(eventData) {
    // Client has entered the world, show the starting screen
    let loadEventData = this.createEventData("minecraft:load_ui");
    loadEventData.data.path = "test.html";
    loadEventData.data.options.is_showing_menu = false;
    loadEventData.data.options.absorbs_input = true;
    ClientSystem.broadcastEvent("minecraft:load_ui", loadEventData);

};

ClientSystem.onUIMessage = function(eventDataObject) {
    let eventData = eventDataObject.data;
    if (eventData == "leavePressed") {
        this.broadcastEvent("minecraft:display_chat_event", "§eAddon by §cRedstoneTorchRockets§9 Visit §brtr.logilutions.de§r!");
        let unloadEventData = this.createEventData("minecraft:unload_ui");
        unloadEventData.data.path = "test.html";
        this.broadcastEvent("minecraft:unload_ui", unloadEventData);
        unloadEventData.data.path = "lookingAtRocket.html";
        this.broadcastEvent("minecraft:unload_ui", unloadEventData);
        globalVars.lookingAtRocket = false;
    } else if (eventData == "visitWebsite") {
        this.location.href = "http://rtr.logilutions.de";
    }
};

ClientSystem.runCommand = function(command) {
    commandData = this.createEventData("minecraft:execute_command")
    commandData.data.command = command
    this.broadcastEvent("minecraft:execute_command", commandData)
}

ClientSystem.sendMsg = function(msg) {
    this.broadcastEvent("minecraft:display_chat_event", msg);
}

ClientSystem.onPick = function(eventData) {
    if (eventData.position !== null) {
        this.broadcastEvent("minecraft:display_chat_event", "Pick at x:" + eventData.position.x + " y:" + eventData.position.y + " z:" + eventData.position.z);
    }
};

ClientSystem.onLookingAt = function(eventData) {
    if (eventData.data.entity.__identifier__ == "rtr:rocket" && !globalVars.lookingAtRocket) {
        let loadEventData = this.createEventData("minecraft:load_ui");
        loadEventData.data.path = "lookingAtRocket.html";
        loadEventData.data.options.is_showing_menu = false;
        loadEventData.data.options.absorbs_input = false;
        loadEventData.data.options.should_steal_mouse = false;
        loadEventData.data.options.render_game_behind = true;
        ClientSystem.broadcastEvent("minecraft:load_ui", loadEventData);
        globalVars.lookingAtRocket = true;
    } else {
        if (eventData.data.entity.__identifier__ != "rtr:rocket" && globalVars.lookingAtRocket) {
            globalVars.lookingAtRocket = false;
        }
    }
}