/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="./WizardPageTemplate" />
/// <reference path="ProviderLogos" />
/// <reference path="RoomSelector" />


module ui {

    export class BuildBridgePageContainer extends FluxSimpleContainer {
        public stores = {
            agentStore: ui.App.agentStore,
            buildBridgeStore: ui.App.buildBridgeStore,
        };
        public getState = () => ({
            agent: this.stores.agentStore.agent,
            processingCreateBridge: this.stores.buildBridgeStore.processing,
            error: this.stores.buildBridgeStore.error,
            errorMessage: this.stores.buildBridgeStore.errorMessage,
            selectedARoom: this.stores.buildBridgeStore.selectedARoom,
        });
        public state = this.getState();
        public render() {return ui.DOM.BuildBridgePage(this.state);}
    }

    export interface BuildBridgePageProps {
        agent: core.AgentData;
        processingCreateBridge: boolean;
        error: boolean;
        errorMessage: string;
        selectedARoom: core.AnyRoom;
    }

    export class BuildBridgePage extends PureComponent<BuildBridgePageProps> {
        public render() {
            var processingCreateBridge = this.props.processingCreateBridge;
            var error = this.props.error;
            var selectedARoom = this.props.selectedARoom;
            var agent = this.props.agent;

            var pageName = agent? (selectedARoom ? 'b' : 'a') : 'signin';

            if (pageName === 'signin') {
                return ui.DOM.IndexPage({});
            }

            var backButton: WizardBackButton = null;
            if (pageName === 'b') {
                // backButton
                var sideAText = core.FormatAnyRoomDescription(selectedARoom);
                backButton = {
                    text: "Change Side A: " + sideAText,
                    callback: () => {
                        ui.App.actions.roomUnselectedBridge();
                    }
                }
            }

            var selectAPage = {
                header: 'Select Side A',
                description: React.DOM.div({},
                    React.DOM.p({}, "You are about to bridge rooms in teams where you have accounts."),
                    React.DOM.p({}, "If you don't have access to Side B, you can share your channel with others by ",
                        ui.DOM.NavLink({href: "/create-a-portal"}, "creating a portal.")
                    )
                ),
                imageId: 'robot-side-a'
            }
            var selectBPage = {
                header: 'Select Side B',
                description: "To complete your bridge, select the second of the two rooms you’d like to connect. (Don’t worry—you can change these later.)",
                imageId: 'robot-side-b'
            }

            var page = pageName == 'a' ? selectAPage : selectBPage;

            if (error) {
                return <ui.OopsPage
                    type={OopsPageType.CantOpenTube}
                    message={this.props.errorMessage}
                ></ui.OopsPage>
            }

            return <ui.WizardPageTemplate
                imageId={page.imageId}
                header={page.header}
                description={page.description}
                backButton={backButton}
                noStyleChildren={true}
            >
                {processingCreateBridge && <ui.GlobalSpinner />}
                <ui.CenteredColumnTemplate kind="big" style={{zIndex: 1}}>
                    {(pageName == "a") &&
                        <ui.RoomSelector
                            onRoomSelected={(room) => {
                                ui.App.actions.roomSelectedBridge(room);
                            }}
                        ></ui.RoomSelector>}
                    {(pageName == "b") &&
                        <ui.RoomSelector
                            // do not allow to select room A when selecting room B
                            bannedRoom={selectedARoom && (selectedARoom instanceof core.RegularRoom) && selectedARoom.data.data}
                            onRoomSelected={(room) => {
                                ui.App.actions.createBridge(selectedARoom, room);
                            }}
                        ></ui.RoomSelector>}
                </ui.CenteredColumnTemplate>
                <ui.CenteredColumnTemplate>
                    <ui.ProviderLogos
                        urlPrefix="/open-a-tube"
                        big={false}
                        addCantSeeYourRoom={true}
                    />
                </ui.CenteredColumnTemplate>
            </ui.WizardPageTemplate>
        }
    }

    export module DOM {
        export var BuildBridgePageContainer = React.createFactory(ui.BuildBridgePageContainer);
        export var BuildBridgePage = React.createFactory(ui.BuildBridgePage);
    }
}
