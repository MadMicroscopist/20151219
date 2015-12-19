/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="./WizardPageTemplate" />
/// <reference path="ProviderLogos" />
/// <reference path="RoomSelector" />


module ui {

    export class CreatePortalContainer extends FluxSimpleContainer {
        public stores = {
            agentStore: ui.App.agentStore,
            createPortalStore: ui.App.createPortalStore,
        };
        public getState = () => ({
            agent: this.stores.agentStore.agent,
            processingCreatePortal: this.stores.createPortalStore.processing,
            error: this.stores.createPortalStore.error,
        });
        public state = this.getState();
        public render() {return ui.DOM.CreatePortalPage(this.state);}
    }

    export interface CreatePortalPageProps {
        agent: core.AgentData;
        processingCreatePortal: boolean;
        error: boolean;
    }

    export class CreatePortalPage extends PureComponent<CreatePortalPageProps> {
        public render () {
            var processingCreatePortal = this.props.processingCreatePortal;
            var error = this.props.error;
            var agent = this.props.agent;

            var pageName = agent ? 'source' : 'signin';

            if (pageName === 'signin') {
                return <ui.SigninPageTemplate urlPrefix="/create-a-portal" />;
            }

            var selectSource = {
                header: 'Select Source',
                description: React.DOM.div({},
                    React.DOM.p({}, "Invite others to connect to your channel from their team."),
                    React.DOM.p({}, "If you have accounts in both teams, you can ",
                        ui.DOM.NavLink({href: "/open-a-tube"}, "create a tube"),
                        " instead."
                    )
                ),
                imageId: 'robot-source'
            }

            var page = selectSource;

            if (error) {
                return <ui.OopsPage
                    type={OopsPageType.CantCreatePortal}
                ></ui.OopsPage>
            }

            return <ui.WizardPageTemplate
                imageId={page.imageId}
                header={page.header}
                description={page.description}
                noStyleChildren={true}
            >
                {processingCreatePortal && <ui.GlobalSpinner />}
                <ui.CenteredColumnTemplate kind="big" style={{zIndex: 1}}>
                    <ui.RoomSelector
                        onRoomSelected={(room) => {
                            ui.App.actions.createFactory(room, false);
                        }}
                    ></ui.RoomSelector>
                </ui.CenteredColumnTemplate>
                <ui.CenteredColumnTemplate>
                    <ui.ProviderLogos
                        urlPrefix="/create-a-portal"
                        big={false}
                        addCantSeeYourRoom={true}
                        isColor={false}
                    />
                </ui.CenteredColumnTemplate>
            </ui.WizardPageTemplate>
        }
    }

    export module DOM {
        export var CreatePortalContainer = React.createFactory(ui.CreatePortalContainer);
        export var CreatePortalPage = React.createFactory(ui.CreatePortalPage);
    }
}
