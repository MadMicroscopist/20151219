/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="./WizardPageTemplate" />


module ui {

    export enum FantabulisticPageType {
        OpenTube,
        CreatePortal,
        OpenTubeByPortal,
        ContactPage,
    }

    export interface FantabulisticPageContainerProps {
        type: FantabulisticPageType;
        objId?: string;
    }

    export class FantabulisticPageContainer extends FluxContainer<FantabulisticPageContainerProps> {
        public stores = {
            agentStore: ui.App.agentStore,
            bridgesStore: ui.App.bridgesStore,
            factoriesStore: ui.App.factoriesStore,
        };
        public getState = () => ({
            agent: this.stores.agentStore.agent,
            bridges: this.stores.bridgesStore.bridges,
            factories: this.stores.factoriesStore.factories,
        });
        public state = this.getState();
        public render() {
            return ui.DOM.FantabulisticPage({
                type: this.props.type,
                objId: this.props.objId,
                agent: this.state.agent,
                bridges: this.state.bridges,
                factories: this.state.factories,
            });
        }
    }

    export interface FantabulisticPageProps extends FantabulisticPageContainerProps {
        agent: core.AgentData;
        bridges: core.Bridge[];
        factories: core.Factory[];
    }

    export class FantabulisticPage extends PureComponent<FantabulisticPageProps> {
        private homeLink = () => ui.DOM.NavLink({
                href: '/',
                className: 'btn btn-bold-yellow btn-no-border btn-lg'
            },
            'okay!'
        );
        private manageLink = () => ui.DOM.NavLink({
                href: '/manage',
                className: 'btn btn-bold-yellow btn-no-border btn-lg'
            },
            "Manage"
        );

        private contact = () => ({
            header: 'Fantabulistic!',
            description: React.DOM.div({className: 'text-center'},
                'Message was successfully sent! We will reply to you shortly.'
            ),
            elements: this.homeLink(),
        });

        private tube = () => {
            var id = this.props.objId;
            var bridgeNames = '';
            var bridge = _.find(this.props.bridges, (bridge: core.Bridge) =>
                bridge.data.id == id
            );
            if (bridge) {
                if (this.props.type === FantabulisticPageType.OpenTube) {
                    bridgeNames = 'created a Tube that connects ' + core.FormatRoomDescription(bridge.data.a_room) + ' and ' + core.FormatRoomDescription(bridge.data.b_room);
                } else {
                    bridgeNames = 'connected “' + bridge.data.a_room.name + '” to “' + bridge.data.b_room.name + '”';
                }
            }

            return {
                header: 'Fantabulistic!',
                description: 'You’ve successfully ' + bridgeNames + '. From now on, those rooms will share the same content. To change your settings, or close this Tube, click Manage, below.',
                elements: this.manageLink(),
            }
        };

        private portal = () => {
            var id = this.props.objId;

            var portalUrl = '';
            var factory = _.find(this.props.factories, (factory: core.Factory) =>
                factory.data.id == id
            );
            if (factory) {
                portalUrl = core.FormatFactoryUrl(factory.data);
            }
            var portalLink: React.DOMElement<React.HTMLAttributes> = null;
            if (portalUrl) {
                portalLink = React.DOM.div({className: 'fantabulistic'},
                    React.DOM.br(),
                    React.DOM.br(),
                    React.DOM.div({className: 'input-group invisible-addon'},
                        React.DOM.input({value: portalUrl, readOnly: true, style: {color: 'black'}, className: 'form-control no-border'}),
                        ui.DOM.ZeroClipboard({
                            className: 'input-group-addon url-copy',
                            "data-clipboard-text": portalUrl,
                            render: (state) => {
                                return React.DOM.a({},
                                    (state.status === 'aftercopy') ?
                                        "Copied!" :
                                    (state.status === 'beforecopy' || state.status === 'copy') ?
                                        'Copying...' :
                                        'Copy'
                                )
                            }
                        })
                    )
                )
            }
            return {
                header: 'Awesomesauce!',
                description: 'You’ve created a Portal! You can copy link to it below. (Use it to invite others to connect to your chatroom.) Need to make changes? Click Manage to administer your Portals.',
                elements: React.DOM.div({},
                    this.manageLink(),
                    portalLink
                ),
            }
        };

        public render () {
            var type = this.props.type;
            var t = FantabulisticPageType;
            var page =
                (type === t.ContactPage) ?
                    this.contact() :
                (type === t.OpenTube || type === t.OpenTubeByPortal) ?
                    this.tube() :
                    this.portal();

            return ui.DOM.WizardPageTemplate({
                    imageId: 'robot-happy',
                    header: page.header,
                    description: page.description,
                },
                React.DOM.br(),
                page.elements
            );
        };
    };

    export module DOM {
        export var FantabulisticPageContainer = React.createFactory(ui.FantabulisticPageContainer);
        export var FantabulisticPage = React.createFactory(ui.FantabulisticPage);
    }
}
