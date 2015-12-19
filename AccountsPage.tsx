/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="InstrumentsList" />
/// <reference path="CenteredColumnTemplate" />

module ui {

    export class AccountsPageContainer extends FluxSimpleContainer {
        public stores = {
            agentStore: ui.App.agentStore,
            identitiesStore: ui.App.identitiesStore,
        };
        public getState = () => ({
            agent: this.stores.agentStore.agent,
            identities: this.stores.identitiesStore.identities,
        });
        public state = this.getState();
        public render() {return ui.DOM.AccountsPage(this.state);}
    }

    export interface AccountsPageProps {
        agent: core.AgentData;
        identities: core.Identities;
    }

    export interface AccountsPageState {
        showSignin?: boolean;
        showAreYouSureDeleteIdentity?: core.IdentityData;
    }

    export class AccountsPage extends PureRender<AccountsPageProps, AccountsPageState> {
        public state:AccountsPageState = {
            showSignin: false,
            showAreYouSureDeleteIdentity: null,
        };
        public render() {
            var agent = this.props.agent;
            var identities = this.props.identities;
            var showSignin = this.state.showSignin;

            var accountsPage = {
                header: 'Accounts',
                description: 'Following is a list of services you’ve linked to Sameroom. From this panel, you can remove services. Please take care in doing so, as removing a service can break the Portals and Tubes you’ve created.'
            }

            var pageName = agent ? 'accounts' : 'signin';

            var fullScreenModalData = (identity: core.IdentityData) => {
                var affectedInstruments = _.map(core.AffectedInstruments(identity), (roomData: core.RoomData) =>
                    React.DOM.li({key: core.RefToString(core.RoomToRef({data: roomData, viaId: identity.id} as core.Room))},
                        React.DOM.span({className: 'bold'}, roomData.name),
                        React.DOM.span({}, ' on '),
                        React.DOM.span({className: 'bold'}, core.ProviderDisplayName(roomData.provider))
                    )
                );

                var rooms = affectedInstruments.length ? React.DOM.div({className: 'row'},
                    React.DOM.div({className: 'col-xs-offset-1 col-xs-22'},
                        React.DOM.span({}, 'Affected Portals/Tubes include:'),
                        React.DOM.ul({style: {padding: 15}}, affectedInstruments)
                    )
                ) : null;

                return {
                    title: 'Are You Sure?',
                    warning: 'Clicking Remove Account, below, will remove the ' + core.ProviderDisplayName(identity.provider) + ' account for “' + identity.common_name + '” from Sameroom. In doing so, all Portals and Tubes connected to this account will be severed, and those subscribed to them will no longer be able to access your content.',
                    buttonText: 'Remove Account',
                    onSure: () => {
                        App.actions.deleteIdentity(identity.id);
                        this.setState({ showAreYouSureDeleteIdentity: null })
                    },
                    onHide: () => { this.setState({ showAreYouSureDeleteIdentity: null }) },
                    elements: rooms,
                };
            }

            var page = accountsPage;

            var pageTemplate = React.DOM.div({className: 'accounts-page'},
                this.state.showAreYouSureDeleteIdentity ?
                    DOM.FullScreenModal(fullScreenModalData(this.state.showAreYouSureDeleteIdentity)) :
                    null,
                React.DOM.div({className: 'container description-block'},
                    DOM.CenteredColumnTemplate({className: 'text-center'},
                        React.DOM.div({className: 'hidden-xs', style: {marginTop: 70}}),
                        React.DOM.h1({className: 'roboto-slab'}, page.header),
                        React.DOM.div({className: 'text-left description'}, page.description),
                        React.DOM.br(),

                        ui.DOM.NavLink({
                                href: '/accounts',
                                className: 'btn btn-bold-yellow btn-no-border btn-lg',
                                style: {width: '100%'},
                                onClick: (e) => {
                                    this.setState({
                                        showSignin: !showSignin
                                    })
                                    e.preventDefault();
                                    return true;
                                }
                            },
                            "Add an Account"
                        ),
                        showSignin && <div className="clearfix">
                            <ui.ProviderLogos
                                urlPrefix="/accounts"
                                big={true}
                                addEmail={true}
                            ></ui.ProviderLogos>
                        </div>,
                        AccountsList(identities, (identity) =>
                            this.setState({showAreYouSureDeleteIdentity: identity})
                        )
                    )
                ),
                React.DOM.div({className: 'clearfix'}),
                React.DOM.div({className: 'hidden-xs', style: {marginTop: 140}})
            );

            var signin = ui.DOM.SigninPageTemplate({
                urlPrefix: '/accounts'
            });

            return React.DOM.div({},
                (pageName === 'signin') ? signin : pageTemplate,
                (false) ? ui.DOM.GlobalSpinner({}) : null
            );
        }
    }

    var AccountsList = (identities: core.Identities, showFullScreen: (identity: core.IdentityData) => void) => {
        return React.DOM.div({className: 'text-left'},
            _.map(_.values(identities).reverse(), (identity) => {
                var failedState = identity.failed && identity.failed.reason || null;
                var authError = failedState === 'auth_error';
                var proxyOffline = failedState === 'proxy_offline';
                var temporaryError = failedState === "lost" || failedState === "service_error";
                var hasError = authError || proxyOffline || temporaryError;
                var errorClass = hasError ? ' account-error' : '';
                return React.DOM.div({
                    key: identity.id,
                    id: "al-" + identity.id,
                    className: 'row no-gutters account-row' + errorClass
                },
                React.DOM.div({className: 'pull-right'},
                    React.DOM.button({
                        className: 'close fa fa-times fa-2x',
                        onClick: () => {
                            showFullScreen(identity);
                        }
                    })
                ),
                React.DOM.span({className: 'provider-icon pull-left'},
                    React.DOM.span({className: 'helper'}),
                    ProviderIcon(identity.provider)
                ),
                React.DOM.div({className: 'account-info'},
                    React.DOM.h4({},
                        core.ProviderDisplayName(identity.provider),
                        identity.provider === 'irc' && React.DOM.sub({},
                            " ", core.FormatIrcUnitName(identity.unit_name)
                        )
                    ),
                    React.DOM.div({className: 'pull-left account-name'},
                        React.DOM.span({},
                            "Name: ", identity.display_name
                        ),
                        identity.provider === 'slack' && React.DOM.span({},
                            ", Team: ", identity.unit_name
                        ),
                        identity.provider === 'facebook' && identity.unit_name && React.DOM.span({},
                            ", Team: ", identity.unit_name
                        ),
                        React.DOM.br(),
                        React.DOM.span({},
                            "Account: ", identity.common_name
                        )
                    ),
                    hasError ? React.DOM.div({className: 'pull-right error-description', style: {width: 150}},
                        React.DOM.span({className: 'red-error'},
                            authError ? core.FormatLoginError(identity.provider) : proxyOffline ? "Proxy Is Offline" : "Provider Issue"
                        ),
                        React.DOM.br(),
                        React.DOM.span({},
                            authError ? ui.DOM.NavLink({
                                    href: core.ProviderModalUrl('/accounts', identity.provider, identity.id),
                                    onClick: (e) => {
                                        if (!core.NeedsSignInModal(identity.provider)) {
                                            e.preventDefault();
                                            ui.App.oauth.showRenewPopup(identity.provider, identity.id);
                                            return true;
                                        }
                                    }
                                },
                                "Renew"
                            ) :
                            temporaryError ? React.DOM.span({},
                                "(Working to restore)"
                            ) : proxyOffline ? React.DOM.span({},
                                "(Check if proxy is running)"
                            ) : null
                        )
                    ) : null
                )
            )})
        )
    }

    var ListIconWidth = 50;

    var ProviderIcon = (providerId: string) =>
        ui.DOM.ProviderLogo({
            providerId: providerId,
            isBw: false,
            style: {width: ListIconWidth}
        })

    export module DOM {
        export var AccountsPageContainer = React.createFactory(ui.AccountsPageContainer);
        export var AccountsPage = React.createFactory(ui.AccountsPage);
    }
}
