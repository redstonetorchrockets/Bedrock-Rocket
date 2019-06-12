var serverSystem = server.registerSystem(0, 0);

serverSystem.initialize = function() {
    //minecraft:player_attacked_entity 
    this.listenForEvent("minecraft:player_attacked_entity", (eventData) => this.onPick(eventData));
    this.listenForEvent("minecraft:entity_start_riding", (eventData) => this.onRiding(eventData));
};

serverSystem.onPick = function(eventData) {
    this.runCommand("say §e @p ,§r das macht man nicht!");
};

serverSystem.onRiding = function(eventData) {
    this.runCommand("say §aRiding!§r");
}

serverSystem.update = function() {
    this.runCommand("function rocketFlight");
}

serverSystem.runCommand = function(command) {
    commandData = this.createEventData("minecraft:execute_command")
    commandData.data.command = command
    this.broadcastEvent("minecraft:execute_command", commandData)
}