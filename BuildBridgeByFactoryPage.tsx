/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="./WizardPageTemplate" />
/// <reference path="ProviderLogos" />
/// <reference path="RoomSelector" />


module ui {

    export class BuildBridgeByFactoryPageContainer extends FluxSimpleContainer {
        public stores = {
            agentStore: ui.App.agentStore,
            identitiesStore: ui.App.identitiesStore,
            router: ui.App.router,
            buildBridgeByFactoryStore: ui.App.buildBridgeByFactoryStore,
        };
        public getState = () => ({
            agent: this.stores.agentStore.agent,
            identities: this.stores.identitiesStore.identities,
            returnUrl: '/p/' + this.stores.router.params['portal-key'],
            processingCreateBridge: this.stores.buildBridgeByFactoryStore.processing,
            error: this.stores.buildBridgeByFactoryStore.error,
            portalNotFound: this.stores.buildBridgeByFactoryStore.portalNotFound,
            errorMessage: this.stores.buildBridgeByFactoryStore.errorMessage,
            factoryKey: this.stores.buildBridgeByFactoryStore.factoryKey,
            factoryData: this.stores.buildBridgeByFactoryStore.factoryData,
            topCanCreate: this.stores.buildBridgeByFactoryStore.topCanCreate,
            createRoomName: this.stores.buildBridgeByFactoryStore.createRoomName,
        });
        public state = this.getState();
        public render() {return ui.DOM.BuildBridgeByFactoryPage(this.state);}
    }

    export interface BuildBridgeByFactoryPageProps {
        agent: core.AgentData;
        identities: core.Identities;
        returnUrl: string;
        processingCreateBridge: boolean;
        error: boolean;
        portalNotFound: boolean;
        errorMessage: string;
        factoryData: core.FactoryData;
        factoryKey: string;
        topCanCreate: core.CanCreateData;
        createRoomName: string;
    }

    export class BuildBridgeByFactoryPage extends PureComponent<BuildBridgeByFactoryPageProps> {
        public render() {
            var processingCreateBridge = this.props.processingCreateBridge;
            var error = this.props.error;
            var portalNotFound = this.props.portalNotFound;
            var agent = this.props.agent;
            var identities = this.props.identities;
            var factoryKey = this.props.factoryKey;
            var factoryData = this.props.factoryData;
            var createRoomName = this.props.createRoomName;
            var factoryRoomName = factoryData && factoryData.room.name || null;
            var canCreate = this.props.topCanCreate;
            var canCreateVia = canCreate && canCreate.via || null;
            var canCreateProvider = canCreateVia && canCreateVia.provider || null;
            var canCreateUnitName = canCreateVia && canCreateVia.unit_name || null;

            var pageName = !agent? 'signin' : canCreate ? 'can_create' : 'target';

            var signinPage = {
                header: 'Welcome',
                imageId: 'robot-welcome',
                description: "The link you followed will allow you to connect to “" + (factoryRoomName ? factoryRoomName : '...') + "”. To complete this process, you just need to select the chat platform you want to connect with:"
            }
            var selectTargetPage = {
                header: 'Select a Destination',
                description: "Now, select one of the rooms you’d like to point “" + (factoryRoomName ? factoryRoomName : '...') + "” to. (If you don’t have one, create one in your " + whereToCreate(identities) + " chat app and return to this screen.)",
                imageId: 'robot-source'
            }

            var createTargetPage = {
                header: 'Select a Destination',
                description: React.DOM.div({},
                    "Now, create/name you’d like to point “" + (factoryRoomName ? factoryRoomName : '...') + "” to" + (canCreateProvider ? ' on ' + core.ProviderDisplayName(canCreateProvider) : '') + ". ",
                    (canCreateProvider === 'slack') ? React.DOM.div({},
                        React.DOM.br(), "Hint: remove the # sign to make it a private channel."
                    ) : "(We’ve autofilled this, but you can change it, if you’d like.)"
                ),
                imageId: 'robot-source'
            }

            var page = pageName == 'signin' ? signinPage: (pageName === 'can_create') ? createTargetPage : selectTargetPage;

            var roomUnitName = core.ProviderRoomUnit(canCreateProvider, createRoomName);

            if (error) {
                return <ui.OopsPage
                    type={OopsPageType.CantOpenTube}
                    message={this.props.errorMessage}
                ></ui.OopsPage>
            }

            if (portalNotFound) {
                return <ui.OopsPage
                    type={OopsPageType.PortalNotFound}
                ></ui.OopsPage>
            }

            return <ui.WizardPageTemplate
                imageId={page.imageId}
                header={page.header}
                description={page.description}
                noStyleChildren={true}
            >
                {processingCreateBridge && <ui.GlobalSpinner />}
                {(pageName === "can_create") && <ui.CenteredColumnTemplate className="text-left description">{
                    React.DOM.br(),
                    React.DOM.form({
                            className: classNames('form-inline full-width-submit-form', {'long-unit': roomUnitName.length > 5}),
                            onSubmit: (e) => {
                                e.preventDefault();
                                ui.App.actions.createBridgeByFactoryWithNewRoom(factoryKey, createRoomName, canCreateVia.id);
                            }
                        },
                        React.DOM.div({className: 'form-group form-group-lg input-group no-border'},
                            React.DOM.span({
                                    className: "input-group-addon no-color input-lg no-border team-name-with-icon"
                                },
                                ui.DOM.ProviderLogo({
                                    providerId: canCreateProvider,
                                    isBw: false,
                                    style: {height: 22},
                                }),
                                React.DOM.span({className: 'team-name', title: canCreateUnitName},
                                    canCreateUnitName + ":"
                                )
                            ),
                            React.DOM.input({value: createRoomName, className: "form-control", placeholder: "Room name", onChange: (e) => {
                                ui.App.actions.updateCreateRoomName((e.target as HTMLInputElement).value);
                            }})
                        ),
                        React.DOM.button({type: "submit", className: 'btn btn-lg btn-bold-yellow btn-no-border'},
                            "Create " + roomUnitName
                        )
                    ),

                    React.DOM.br(),
                    "Or, select a room that already exists:",
                    React.DOM.br()
                }</ui.CenteredColumnTemplate>}
                <ui.CenteredColumnTemplate kind="big" style={{zIndex: 1}}>
                    {(pageName == "can_create" || pageName == "target") &&
                        <ui.RoomSelector
                            // filter out source room
                            bannedRoom={factoryData && factoryData.room}
                            onRoomSelected={(room) => {
                                ui.App.actions.createBridgeByFactory(this.props.factoryKey, room);
                            }}
                        ></ui.RoomSelector>}
                </ui.CenteredColumnTemplate>
                <ui.CenteredColumnTemplate>
                    <ui.ProviderLogos
                        urlPrefix={this.props.returnUrl}
                        big={pageName == "signin"}
                        addCantSeeYourRoom={pageName != "signin"}
                    ></ui.ProviderLogos>
                </ui.CenteredColumnTemplate>
            </ui.WizardPageTemplate>
        }
    }

    var whereToCreate = (identities: core.Identities) => {
        var hasAccounts = _.map(identities, (identity) => {
            return identity.provider;
        });
        var sortedProviders = _.intersection(core.PreferedProviders(), hasAccounts);
        var names = _.map(sortedProviders, (id) => core.ProviderDisplayName(id));
        return _.first(names, 2).join(' or ');
    }

    export module DOM {
        export var BuildBridgeByFactoryPageContainer = React.createFactory(ui.BuildBridgeByFactoryPageContainer);
        export var BuildBridgeByFactoryPage = React.createFactory(ui.BuildBridgeByFactoryPage);
    }
}
