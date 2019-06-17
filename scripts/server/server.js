var serverSystem = server.registerSystem(0, 0);

serverSystem.initialize = function() {
    //minecraft:player_attacked_entity 
    this.listenForEvent("minecraft:player_attacked_entity", (eventData) => this.onPick(eventData));
    this.listenForEvent("minecraft:entity_start_riding", (eventData) => this.onRiding(eventData));
    this.listenForEvent("minecraft:entity_stop_riding", (eventData) => this.onStopRiding(eventData));
    this.registerEventData("rtr:entered_rocket", {});
    this.registerEventData("rtr:left_rocket", {});
};

serverSystem.onPick = function(eventData) {
    this.runCommand("say §e @p ,§r das macht man nicht!");
};

serverSystem.onRiding = function(eventData) {
    if (eventData.data.ride.__identifier__ == "rtr:rocket") {
        let enteredRocketData = this.createEventData("rtr:entered_rocket");
        this.broadcastEvent("rtr:entered_rocket", enteredRocketData);
    }
}

serverSystem.onStopRiding = function(eventData) {
    let enteredRocketData = this.createEventData("rtr:left_rocket");
    this.broadcastEvent("rtr:left_rocket", enteredRocketData);
}

serverSystem.update = function() {
    this.runCommand("function rocketFlight");
}

serverSystem.runCommand = function(command) {
    commandData = this.createEventData("minecraft:execute_command")
    commandData.data.command = command
    this.broadcastEvent("minecraft:execute_command", commandData)
}