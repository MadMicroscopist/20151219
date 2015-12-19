/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="InstrumentsList" />

module ui {

    export class ManageInstrumentsPageContainer extends FluxSimpleContainer {
        public stores = {
            agentStore: ui.App.agentStore,
            identitiesStore: ui.App.identitiesStore,
            bridgesStore: ui.App.bridgesStore,
            factoriesStore: ui.App.factoriesStore,
        };
        public getState = () => ({
            agent: this.stores.agentStore.agent,
            identities: this.stores.identitiesStore.identities,
            bridges: this.stores.bridgesStore.bridges,
            factories: this.stores.factoriesStore.factories,
        });
        public state = this.getState();
        public render() {return ui.DOM.ManageInstrumentsPage(this.state);}
    }

    export interface ManageInstrumentsPageProps {
        agent: core.AgentData;
        identities: core.Identities;
        bridges: core.Bridge[];
        factories: core.Factory[];
    }

    export interface ManageInstrumentsPageState {
        showAreYouSureDeleteInstrument?: boolean;
        fullScreenModalProps?: FullScreenModalProps;
    }

    export class ManageInstrumentsPage extends PureRender<ManageInstrumentsPageProps, ManageInstrumentsPageState> {
        public state: ManageInstrumentsPageState = {
            showAreYouSureDeleteInstrument: false,
            fullScreenModalProps: null,
        }
        public render () {
            var agent = this.props.agent;
            var identities = this.props.identities;
            var bridges = this.props.bridges;
            var factories = this.props.factories;

            var managePage = {
                header: 'Manage',
                description: React.DOM.span({},
                    'You are spending ',
                    React.DOM.b({}, agent && agent.expensed),
                    ' out of your budget of ',
                    React.DOM.b({}, agent && agent.budgeted),
                    ' Unlimited Tubes. You can purchase more of these by ',
                    ui.DOM.NavLink({href: '/plan', className: 'url-plan'}, 'upgrading your plan'),
                    ' or redeeming ',
                    ui.DOM.NavLink({href: '/redeem', className: 'url-plan'}, 'roomcoin'),
                    '. To learn more about pricing and roomcoin, visit the ',
                    ui.DOM.NavLink({href: '/faq', className: 'url-plan'}, 'FAQ'),
                    '.',
                    React.DOM.br(),
                    React.DOM.br(),
                    'You can connect rooms or #channels under your control by ',
                    ui.DOM.NavLink({href: '/open-a-tube', className: 'url-plan'}, 'creating a Tube'),
                    '.'
                )
            }

            var emptyList = {
                header: 'Your List is Empty',
                description: React.DOM.span({},
                    'You don’t have any Portals or Tubes to manage, yet. Once you do you’ll be able to delete, play/pause, and manage payment of each instrument individually.',
                    React.DOM.br(),
                    React.DOM.br(),
                    'You can connect rooms or #channels under your control by ',
                    ui.DOM.NavLink({href: '/open-a-tube', className: 'url-plan'}, 'creating a Tube'),
                    '.'
                )
            }

            var isEmpty = _.isEmpty(factories) && _.isEmpty(bridges);

            var pageName = agent ? (isEmpty ? 'empty' : 'manage') : 'signin';

            var page = isEmpty ? emptyList : managePage;

            var pageTemplate = React.DOM.div({className: 'manage-page'},
                this.state.showAreYouSureDeleteInstrument ? DOM.FullScreenModal(this.state.fullScreenModalProps) : null,
                React.DOM.div({className: 'container description-block'},
                    DOM.CenteredColumnTemplate({className: 'text-center'},
                        React.DOM.div({className: 'hidden-xs', style: {marginTop: 70}}),
                        React.DOM.h1({className: 'roboto-slab'}, page.header),
                        React.DOM.div({className: 'text-left description'}, page.description),
                        React.DOM.br()
                    )
                ),
                !isEmpty ? (
                    ui.DOM.InstrumentsList({
                        identities: identities,
                        bridges: bridges,
                        factories: factories,
                        onDelete: (props: FullScreenModalProps) => {
                            var props0 = {
                                title: 'Are You Sure?',
                                warning: props.warning,
                                buttonText: props.buttonText,
                                onSure: () => {
                                    props.onSure();
                                    this.setState({ showAreYouSureDeleteInstrument: false, fullScreenModalProps: null });
                                },
                                onHide: () => {
                                    this.setState({ showAreYouSureDeleteInstrument: false, fullScreenModalProps: null });
                                }
                            };
                            this.setState({ showAreYouSureDeleteInstrument: true, fullScreenModalProps: props0 });
                        }
                    })
                ) : null,
                React.DOM.div({className: 'clearfix'}),
                React.DOM.div({className: 'hidden-xs', style: {marginTop: 140}})
            );

            var signin = ui.DOM.SigninPageTemplate({
                urlPrefix: '/manage'
            });

            return React.DOM.div({},
                (pageName === 'signin') ? signin : pageTemplate,
                (false) ? ui.DOM.GlobalSpinner({}) : null
            );
        }
    }

    export module DOM {
        export var ManageInstrumentsPageContainer = React.createFactory(ui.ManageInstrumentsPageContainer);
        export var ManageInstrumentsPage = React.createFactory(ui.ManageInstrumentsPage);
    }
}
