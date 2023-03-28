export default {
    name: 'App',
    data() {
        return {
            currentStatus: {
                'hood_status': null,
                'rear_rh_door_status': null,
                'rear_lh_door_status': null,
                'trunk_status': null
            },
            client: null,
            readyToGo:false,
        };
    },
    methods: {
        onConnect() {
            this.client.subscribe("sampleApp/currentHoodOpenStatus");
            this.client.subscribe("sampleApp/currentDoorStateRearRH");
            this.client.subscribe("sampleApp/currentDoorStateRearLH");
            this.client.subscribe("sampleApp/currentTrunkOpenStatus");
            this.getAllStatus();
        },

        getAllStatus() {
            var message = new Messaging.Message("");
            message.destinationName = "sampleapp/getAllStatus";
            this.client.send(message)
        },
        onConnectionLost(obj) {
            console.log("connection lost");
            console.log(obj)
        },
        initialize() {
            var r = (Math.round(Math.random() * 255)).toString(16);
            var g = (Math.round(Math.random() * 255)).toString(16);
            var b = (Math.round(Math.random() * 255)).toString(16);
            this.client = new Messaging.Client("broker.mqttdashboard.com", Number(8000), r + g + b);
            console.log("Connection attempeted with client id: " + r + g + b);
            this.client.onConnect = this.onConnect
            this.client.onConnectionLost = this.onConnectionLost
            this.client.onMessageArrived = this.onMessageArrived

            var options = {
                timeout: 3,
                onSuccess: this.onConnect
            };
            this.client.connect(options)
        },
        onMessageArrived(message) {
            var payload = JSON.parse(message.payloadString);
            this.currentStatus[payload.name] = payload.status;
            console.log(this.currentStatus);

        }
    },
    mounted() {
        this.initialize();
    },
    template: `
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <button type="button" class="btn btn-primary"  @click ="getAllStatus()">
                Get Status
                </button>
            </div>
        </div>
        <div class="shadow p-3 mt-2 mb-5 bg-body rounded">
            <div class="column">
                <div class="col-md-6">
                    <div>
                        <div class="form-check form-switch d-flex flex-row">
                            <label class="form-label">
                                    Vehicle Status:
                            </label>
                            <input class="form-check-input p-disabled " type="checkbox" id="flexSwitchCheckChecked1"
                                checked style="margin: 7px 10px; cursor:not-allowed"
                                :style= "
                                    [currentStatus.hood_status ? 
                                        {'background-color': 'red'} 
                                        : {'background-color': 'green'}]" 
                            />
                            <label v-if="!currentStatus.hood_status">
                                Ready to Go
                            </label>
                        </div>
                        <div class="form-check form-switch d-flex flex-row">
                            <label for="bonnet closed car image" class="form-label">
                                Hood Status:
                            </label>
                            <input class="form-check-input p-disabled " type="checkbox" id="flexSwitchCheckChecked"
                                checked style="margin: 7px 10px; cursor:not-allowed"
                                :style= "
                                    [currentStatus.hood_status ? 
                                        {'background-color': 'red'} 
                                        : {'background-color': 'green'}]" 
                            />
                            <label v-if="currentStatus.hood_status">
                                Opened
                            </label>
                        </div>
                    </div>
                </div>
            <div class="col-md-6">
                <div>
                    <label for="bonnet closed car image" class="form-label" 
                        v-if="currentStatus.trunk_status">
                        Trunk Open
                    </label>
                    <label for="bonnet closed car image" class="form-label" v-else>
                        Trunk Closed
                    </label>
                </div>
            </div>
        </div>
        <div class="column">
            <div class="col-md-6">
                <div>
                    <label for="bonnet closed car image" class="form-label" 
                        v-if="currentStatus.rear_rh_door_status">
                        Right Door Open
                    </label>
                    <label for="bonnet closed car image" class="form-label" v-else>
                        Right Door Closed
                    </label>
                </div>
            </div>
            <div class="col-md-6">
                <div>
                    <label for="bonnet closed car image" class="form-label" 
                        v-if="currentStatus.rear_lh_door_status">
                        Left Door Open
                    </label>
                    <label for="bonnet closed car image" class="form-label" v-else>
                        Left Door Closed
                    </label>
                </div>
            </div>
        </div>
    </div>
    `,
};