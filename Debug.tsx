/// <reference path="../stripecheckout.d.ts" />
/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="../jquery.d.ts" />
/// <reference path="../core/App.ts" />

module ui {

    export class DebugPageContainer extends FluxSimpleContainer {
        public stores = {
            agentStore: ui.App.agentStore,
            identitiesStore: ui.App.identitiesStore,
            bridgesStore: ui.App.bridgesStore,
            factoriesStore: ui.App.factoriesStore,
            roomsSearchStore: ui.App.roomsSearchStore,
            lastErrorStore: ui.App.lastErrorStore,
            factoryByKeyStore: ui.App.factoryByKeyStore,
            signinWithProviderStore: ui.App.signinWithProviderStore,
            coinsStore: ui.App.coinsStore,
        };
        public getState = () => ({
            agent: this.stores.agentStore.agent,
            identities: this.stores.identitiesStore.identities,
            bridges: this.stores.bridgesStore.bridges,
            factories: this.stores.factoriesStore.factories,
            rooms: this.stores.roomsSearchStore.rooms,
            factoryData: this.stores.factoryByKeyStore.data,
            lastError: this.stores.lastErrorStore.lastError,
            emailAuthCode0: this.stores.signinWithProviderStore.emailAuthCode,
            coins: this.stores.coinsStore.coins,
        });
        public state = this.getState();
        public render() {return ui.DOM.DebugPage(this.state);}
    }

    export interface DebugUIProps extends DebugPageRoomcoinsProps {
        agent: core.AgentData;
        identities: core.Identities;
        bridges: core.Bridge[];
        factories: core.Factory[];
        rooms: core.Room[];
        factoryData: core.FactoryData;
        lastError: string;
        emailAuthCode0: string;
    }

    export class DebugPage extends PureComponent<DebugUIProps> {
        private onDismissLastError () {
            App.actions.dismissLastError();
        }
        public render () {
            return React.DOM.div({},
                this.props.lastError && React.DOM.div({},
                    React.DOM.span({ style: { color: '#ff6905' } }, 'error: ' + this.props.lastError + ' '),
                    React.DOM.button({ className: 'btn-link', onClick: this.onDismissLastError }, 'dismiss')
                ),

                ui.DOM.DebugPageAccounts({
                    agent: this.props.agent,
                    identities: this.props.identities,
                    emailAuthCode0: this.props.emailAuthCode0,
                }),

                React.DOM.hr({}),

                ui.DOM.DebugPageRoomcoins({
                    coins: this.props.coins,
                }),

                React.DOM.hr({}),

                ui.DOM.DebugPageBridges({
                    identities: this.props.identities,
                    bridges: this.props.bridges,
                    rooms: this.props.rooms,
                    factoryData: this.props.factoryData,
                }),

                React.DOM.hr({}),

                ui.DOM.DebugPageFactories({
                    identities: this.props.identities,
                    factories: this.props.factories,
                    rooms: this.props.rooms,
                })
            );
        }
    }

    interface DebugPageAccountsProps {
        agent: core.AgentData;
        identities: core.Identities;
        emailAuthCode0: string;
    }

    interface DebugPageAccountsState {
        hipchatToken?: string;
        hipchatRenewToken?: string;
        emailCredentials?: string;
        emailAuthCode1?: string;
        emailCode?: string;
        emailRenewCode?: string;
        ircSsl?: boolean;
        ircHost?: string;
        ircPort?: string;
        ircNickname?: string;
        ircPassword?: string;
        ircRenewPassword?: string;
        skypeUser?: string;
        skypePassword?: string;
        skypeRenewPassword?: string;
        fleepUser?: string;
        fleepPassword?: string;
        fleepRenewPassword?: string;
        googleToken?: string;
        googleRenewToken?: string;
        intercomEmail?: string;
        intercomAppId?: string;
        intercomToken?: string;
        intercomRenewToken?: string;
    }

    /////////
    ///////// DebugPageAccounts
    /////////

    export class DebugPageAccounts extends PureRender<DebugPageAccountsProps, DebugPageAccountsState> {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);

        private onOAuthSignIn (provider: string) {
            App.oauth.showSignInPopup(provider);
        }
        private onOAuthRenew (provider: string, identityId: string) {
            App.oauth.showRenewPopup(provider, identityId);
        }
        private onIrcSignIn () {
            var data: core.PostIdentityData = {
                type: 'irc',
                irc_ssl: this.state.ircSsl,
                irc_host: this.state.ircHost,
                irc_port: this.state.ircPort,
                irc_nickname: this.state.ircNickname,
                irc_password: this.state.ircPassword
            };
            ui.App.rest.postIdentity(ui.App.rest.getRestOperation(data));
            this.setState({
                ircSsl: false,
                ircHost: null,
                ircPort: null,
                ircNickname: null,
                ircPassword: null
            });
        }
        private onIrcRenew (identityId: string) {
            var data: core.PostIdentityData = {
                type: 'irc',
                renew_identity_id: identityId,
                irc_renew_password: this.state.ircRenewPassword
            };
            ui.App.rest.postIdentity(ui.App.rest.getRestOperation(data));
            this.setState({
                ircRenewPassword: null
            });
        }
        private onSkypeSignIn () {
            var data: core.PostIdentityData = {
                type: 'skype',
                skype_user: this.state.skypeUser,
                skype_password: this.state.skypePassword
            };
            ui.App.rest.postIdentity(ui.App.rest.getRestOperation(data));
            this.setState({
                skypeUser: null,
                skypePassword: null
            });
        }
        private onSkypeRenew (identityId: string) {
            var data: core.PostIdentityData = {
                type: 'skype',
                renew_identity_id: identityId,
                skype_renew_password: this.state.skypeRenewPassword
            };
            ui.App.rest.postIdentity(ui.App.rest.getRestOperation(data));
            this.setState({
                skypeRenewPassword: null
            });
        }
        private onFleepSignIn () {
            var data: core.PostIdentityData = {
                type: 'fleep',
                fleep_user: this.state.fleepUser,
                fleep_password: this.state.fleepPassword
            };
            ui.App.rest.postIdentity(ui.App.rest.getRestOperation(data));
            this.setState({
                fleepUser: '',
                fleepPassword: ''
            });
        }
        private onFleepRenew (identityId: string) {
            var data: core.PostIdentityData = {
                type: 'fleep',
                renew_identity_id: identityId,
                fleep_renew_password: this.state.fleepRenewPassword
            };
            ui.App.rest.postIdentity(ui.App.rest.getRestOperation(data));
            this.setState({
                fleepRenewPassword: ''
            });
        }
        private onHipchatSignIn () {
            var data: core.PostIdentityData = {
                type: 'hipchat',
                hipchat_token: this.state.hipchatToken
            };
            ui.App.rest.postIdentity(ui.App.rest.getRestOperation(data));
            this.setState({
                hipchatToken: null
            });
        }
        private onHipchatRenew (identityId: string) {
            var data: core.PostIdentityData = {
                type: 'hipchat',
                renew_identity_id: identityId,
                hipchat_token: this.state.hipchatRenewToken
            };
            ui.App.rest.postIdentity(ui.App.rest.getRestOperation(data));
            this.setState({
                hipchatRenewToken: null
            });
        }
        private onGoogleSignIn () {
            var data: core.PostIdentityData = {
                type: 'google',
                google_token: this.state.googleToken
            };
            ui.App.rest.postIdentity(ui.App.rest.getRestOperation(data));
            this.setState({
                googleToken: null
            });
        }
        private onGoogleRenew(identityId: string) {
            var data: core.PostIdentityData = {
                type: 'google',
                renew_identity_id: identityId,
                google_token: this.state.googleRenewToken
            };
            ui.App.rest.postIdentity(ui.App.rest.getRestOperation(data));
            this.setState({
                googleRenewToken: null
            });
        }
        private onIntercomSignIn () {
            var data: core.PostIdentityData = {
                type: 'intercom',
                intercom_email: this.state.intercomEmail,
                intercom_app_id: this.state.intercomAppId,
                intercom_token: this.state.intercomToken
            };
            ui.App.rest.postIdentity(ui.App.rest.getRestOperation(data));
            this.setState({
                intercomEmail: null,
                intercomAppId: null,
                intercomToken: null
            });
        }
        private onIntercomRenew (identityId: string) {
            var data: core.PostIdentityData = {
                type: 'intercom',
                renew_identity_id: identityId,
                intercom_token: this.state.intercomRenewToken
            };
            ui.App.rest.postIdentity(ui.App.rest.getRestOperation(data));
            this.setState({
                intercomRenewToken: null
            });
        }

        private onEmailSignIn () {
            if (this.props.emailAuthCode0) {
                var data: core.PostIdentityData = {
                    type: 'email',
                    email_code: this.props.emailAuthCode0 + this.state.emailAuthCode1
                };
                ui.App.rest.postIdentity(ui.App.rest.getRestOperation(data));
                this.setState({
                    emailAuthCode1: '',
                });
                ui.App.actions.resetEmailAuth();
            } else {
                App.actions.getEmailAuth(this.state.emailCredentials);
                this.setState({
                    emailCredentials: '',
                });
            }
        }
        private onEmailSignInWithCode () {
            var data: core.PostIdentityData = {
                type: 'email',
                email_code: this.state.emailCode
            };
            ui.App.rest.postIdentity(ui.App.rest.getRestOperation(data));
            this.setState({
                emailCode: null
            });
        }
        private onEmailRenewWithCode (identityId: string) {
            var data: core.PostIdentityData = {
                type: 'email',
                email_code: this.state.emailRenewCode
            };
            ui.App.rest.postIdentity(ui.App.rest.getRestOperation(data));
            this.setState({
                emailRenewCode: null
            });
        }
        private onSignOut (event: React.MouseEvent) {
            App.rest.deleteSession();
        }
        private onUnsubscribe () {
            App.actions.deleteSubscription();
        }
        private onChangePlan (stripePlanId: string) {
            App.actions.putSubscription({ stripe_plan_id: stripePlanId } as core.PutSubscriptionData);
        }
        private onSubscribe (stripePlanId: string) {
            var planInfo: any = {
                'fixed-basic': { amount: 900, name: 'Basic', description: '3 Bridges' },
                'fixed-pro': { amount: 4900, name: 'Pro', description: '40 Bridges' }
            };
            StripeCheckout.open({
                key: core.STRIPE_PUBLIC_KEY,
                token: (token: any) => {
                    App.actions.putSubscription({ stripe_plan_id: stripePlanId, stripe_token: token } as core.PutSubscriptionData);
                },
                amount: planInfo[stripePlanId].amount,
                name: planInfo[stripePlanId].name,
                description: planInfo[stripePlanId].description,
                panelLabel: 'Subscribe {{amount}}/Month'
            });
        }
        private onRemoveIdentity (id: string) {
            App.rest.deleteIdentity(id);
        }

        public state: DebugPageAccountsState = {
            emailCredentials: '',
            emailAuthCode1: '',
            fleepUser: '',
            fleepPassword: '',
            fleepRenewPassword: '',
        };

        public render () {
            var oauthProviders = ['slack','flowdock','campfire','gitter','chatter'];
            return React.DOM.div({},
                React.DOM.h3({}, 'ACCOUNT'),
                React.DOM.ul({},
                    _.map(oauthProviders, (provider: string) =>
                        React.DOM.li({key: provider}, React.DOM.button({ className: 'btn-link', onClick: () => this.onOAuthSignIn(provider) }, 'Sign in with ' + provider))
                    ),
                    React.DOM.li({},
                        React.DOM.form({onSubmit: (e) => {e.preventDefault(); this.onHipchatSignIn()}},
                            React.DOM.button({ className: 'btn-link', type: 'submit' }, 'Sign in with hipchat token:'),
                            React.DOM.input({ type: 'text', style: { width: 100 }, valueLink: this.linkState('hipchatToken') })
                        )
                    ),
                    React.DOM.li({},
                        React.DOM.form({onSubmit: e => {e.preventDefault(); this.onEmailSignIn();}, ref: 'email-signin' },
                            React.DOM.button({ className: 'btn-link', type: 'submit' }, 'Sign in with email:'),
                            this.props.emailAuthCode0 ? (
                                React.DOM.input({ type: 'text', style: { width: 200 }, valueLink: this.linkState('emailAuthCode1'), placeholder: 'enter code from email' })
                            ) : (
                                React.DOM.input({ type: 'email', style: { width: 200 }, valueLink: this.linkState('emailCredentials'), placeholder: 'enter email' })
                            )
                        )
                    ),
                    React.DOM.li({},
                        React.DOM.form({onSubmit: e => {e.preventDefault(); this.onEmailSignInWithCode();}},
                            React.DOM.button({ className: 'btn-link', type: 'submit' }, 'Sign in with email code:'),
                            React.DOM.input({ type: 'text', style: { width: 100 }, valueLink: this.linkState('emailCode') })
                        )
                    ),
                    React.DOM.li({},
                        React.DOM.form({onSubmit: e => {e.preventDefault(); this.onIrcSignIn();}},
                            React.DOM.button({ className: 'btn-link', type: 'submit' }, 'Sign in with IRC'),
                            React.DOM.span({}, 'SSL '),
                            React.DOM.input({ type: 'checkbox', checkedLink: this.linkState('ircSsl')}),
                            React.DOM.input({ type: 'text', style: { width: 100 }, valueLink: this.linkState('ircHost'), placeholder: 'enter host' }),
                            React.DOM.input({ type: 'text', style: { width: 50 }, valueLink: this.linkState('ircPort'), placeholder: 'enter port' }),
                            React.DOM.input({ type: 'text', style: { width: 200 }, valueLink: this.linkState('ircNickname'), placeholder: 'enter nickname' }),
                            React.DOM.input({ type: 'password', style: { width: 200 }, valueLink: this.linkState('ircPassword'), placeholder: 'enter password' })
                        )
                    ),
                   React.DOM.li({},
                        React.DOM.form({onSubmit: e => {e.preventDefault(); this.onSkypeSignIn();}},
                            React.DOM.button({ className: 'btn-link', type: 'submit' }, 'Sign in with Skype credentials: '),
                            React.DOM.input({ type: 'text', style: { width: 200 }, valueLink: this.linkState('skypeUser'), placeholder: 'enter skype username' }),
                            React.DOM.input({ type: 'password', style: { width: 200 }, valueLink: this.linkState('skypePassword'), placeholder: 'enter password' })
                        )
                    ),
                    React.DOM.li({},
                        React.DOM.form({onSubmit: e => {e.preventDefault(); this.onFleepSignIn();}},
                            React.DOM.button({ className: 'btn-link', type: 'submit' }, 'Sign in with Fleep credentials: '),
                            React.DOM.input({ type: 'text', style: { width: 200 }, valueLink: this.linkState('fleepUser'), placeholder: 'enter fleep username or email' }),
                            React.DOM.input({ type: 'password', style: { width: 200 }, valueLink: this.linkState('fleepPassword'), placeholder: 'enter password' })
                        )
                   ),
                   React.DOM.li({},
                        React.DOM.form({onSubmit: (e) => {e.preventDefault(); this.onGoogleSignIn()}},
                            React.DOM.button({ className: 'btn-link', type: 'submit' }, 'Sign in with google token:'),
                            React.DOM.input({ type: 'text', style: { width: 400 }, valueLink: this.linkState('googleToken') }),
                            React.DOM.span({}, ' you can get it '),
                            React.DOM.button({ className: 'btn-link', onClick: () => this.onOAuthSignIn('google') }, 'here')
                        )
                    ),
                    React.DOM.li({},
                        React.DOM.form({onSubmit: (e) => {e.preventDefault(); this.onIntercomSignIn()}},
                            React.DOM.button({ className: 'btn-link', type: 'submit' }, 'Sign in with Intercom admin email, app ID and token:'),
                            React.DOM.input({ type: 'text', style: { width: 100 }, valueLink: this.linkState('intercomEmail'), placeholder: 'enter email' }),
                            React.DOM.input({ type: 'text', style: { width: 100 }, valueLink: this.linkState('intercomAppId'), placeholder: 'enter app ID' }),
                            React.DOM.input({ type: 'text', style: { width: 200 }, valueLink: this.linkState('intercomToken'), placeholder: 'enter token' })
                        )
                    )
                ),
                this.props.agent && React.DOM.div({},
                    React.DOM.div({},
                        React.DOM.span({}, this.props.agent.display_name  + ' (' + this.props.agent.common_name + ') - '),
                        React.DOM.button({ className: 'btn-link', onClick: this.onSignOut }, 'Sign out'),

                        React.DOM.div({},
                            this.props.agent.payment_data.stripe_plan_id ? React.DOM.div({},
                                React.DOM.button({ className: 'btn-link', onClick: () => this.onUnsubscribe() }, 'Unsubscribe'),
                                ' - Change Plan: ',
                                React.DOM.button({ className: 'btn-link', onClick: () => this.onChangePlan('fixed-basic') }, 'Basic'),
                                ' ',
                                React.DOM.button({ className: 'btn-link', onClick: () => this.onChangePlan('fixed-pro') }, 'Pro')
                                ) : React.DOM.div({},
                                ' Subscribe: ',
                                React.DOM.button({ className: 'btn-link', onClick: () => this.onSubscribe('fixed-basic') }, 'Basic'),
                                ' ',
                                React.DOM.button({ className: 'btn-link', onClick: () => this.onSubscribe('fixed-pro') }, 'Pro'))
                        )
                    ),
                    React.DOM.div({},
                        React.DOM.b({}, 'Spending ' + this.props.agent.expensed  + ' of ' + this.props.agent.budgeted + ' bridges')
                    )
                ),
                React.DOM.hr({}),
                React.DOM.h3({}, 'IDENTITIES'),
                React.DOM.ul({},
                    _.map(_.values(this.props.identities), (identity: core.IdentityData) =>
                        React.DOM.li({ key: identity.id },
                            React.DOM.span({}, '<' + identity.provider + '> ' + identity.display_name + ' (' + identity.common_name + ') - '),
                            React.DOM.span({ style: identity.failed ? { color: 'red' } : { color: 'green' } }, identity.failed ? '(FAILED)' : '(VALID)'),
                            React.DOM.span({}, ' - '),
                            identity.failed ? identity.provider === 'hipchat' ?
                                [React.DOM.form({ style: { display: 'inline' } },
                                    React.DOM.button({ className: 'btn-link', onClick: () => this.onHipchatRenew(identity.id) }, 'Renew hipchat token:'),
                                    React.DOM.input({ type: 'text', style: { width: 100 }, valueLink: this.linkState('hipchatRenewToken') })
                                ),
                                React.DOM.span({}, ' - ')] : identity.provider === 'google' ?
                                [React.DOM.form({ style: { display: 'inline' } },
                                    React.DOM.button({ className: 'btn-link', onClick: () => this.onGoogleRenew(identity.id) }, 'Renew google token:'),
                                    React.DOM.input({ type: 'text', style: { width: 400 }, valueLink: this.linkState('googleRenewToken') }),
                                    React.DOM.span({}, ' you can get it '),
                                    React.DOM.button({ className: 'btn-link', onClick: () => this.onOAuthRenew(identity.provider, identity.id) }, 'here')
                                ),
                                React.DOM.span({}, ' - ')] : identity.provider === 'irc' ?
                                [React.DOM.form({ style: { display: 'inline' } },
                                    React.DOM.button({ className: 'btn-link', onClick: () => this.onIrcRenew(identity.id) }, 'Renew IRC password:'),
                                    React.DOM.input({ type: 'text', style: { width: 100 }, valueLink: this.linkState('ircRenewPassword') })
                                ),
                                React.DOM.span({}, ' - ')] : identity.provider === 'skype' ?
                                [React.DOM.form({ style: { display: 'inline' } },
                                    React.DOM.button({ className: 'btn-link', onClick: () => this.onSkypeRenew(identity.id) }, 'Renew Skype password:'),
                                    React.DOM.input({ type: 'password', style: { width: 100 }, valueLink: this.linkState('skypeRenewPassword') })
                                ),
                                React.DOM.span({}, ' - ')] : identity.provider === 'email' ?
                                [React.DOM.form({ style: { display: 'inline' } },
                                    React.DOM.button({ className: 'btn-link', onClick: () => this.onEmailRenewWithCode(identity.id) }, 'Renew email code:'),
                                    React.DOM.input({ type: 'text', style: { width: 100 }, valueLink: this.linkState('emailRenewCode') })
                                ),
                                React.DOM.span({}, ' - ')] : identity.provider === 'fleep' ?
                                [React.DOM.form({ style: { display: 'inline' }, onSubmit: (e) => {e.preventDefault(); this.onFleepRenew(identity.id)} },
                                    React.DOM.button({ className: 'btn-link'}, 'Renew Fleep password:'),
                                    React.DOM.input({ type: 'text', style: { width: 100 }, valueLink: this.linkState('fleepRenewPassword') })
                                ),
                                React.DOM.span({}, ' - ')] : identity.provider === 'intercom' ?
                                    [React.DOM.form({ style: { display: 'inline' } },
                                        React.DOM.button({ className: 'btn-link', onClick: () => this.onHipchatRenew(identity.id) }, 'Renew Intercom token:'),
                                        React.DOM.input({ type: 'text', style: { width: 100 }, valueLink: this.linkState('intercomRenewToken') })
                                ), React.DOM.span({}, ' - ')] : [
                                React.DOM.button({ className: 'btn-link', onClick: () => this.onOAuthRenew(identity.provider, identity.id) }, 'Renew'),
                                React.DOM.span({}, ' - ')] :
                                null,
                            React.DOM.button({ className: 'btn-link', onClick: () => this.onRemoveIdentity(identity.id) }, 'Remove')
                        )
                    )
                ),
                ""
            )
        }
    }



    interface DebugPageRoomcoinsProps {
        coins: core.CoinData[];
    }

    interface DebugPageRoomcoinsState {
        coinCode?: string;
    }

    /////////
    ///////// DebugPageRoomcoins
    /////////

    export class DebugPageRoomcoins extends PureRender<DebugPageRoomcoinsProps, DebugPageRoomcoinsState> {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);
        private onRedeemCoin () {
            App.rest.putCoin(this.state.coinCode);
            this.setState({
                coinCode: null
            });
        }
        private onUnredeemCoin (code: string) {
            ui.App.rest.deleteCoin(code);
        }
        public componentDidMount() {
            ui.App.rest.getCoins();
        }
        public state: DebugPageRoomcoinsState = {};
        public render () {
            return React.DOM.div({},
                React.DOM.h3({}, 'ROOMCOINS'),
                React.DOM.ul({},
                    _.map(this.props.coins, (coin) =>
                        React.DOM.li({ key: coin.code },
                            React.DOM.span({}, coin.code, " - ", coin.amount, " tube(s)"),
                            React.DOM.button({ className: 'btn-link', onClick: () => this.onUnredeemCoin(coin.code) }, 'Remove')
                        )
                    )
                ),
                React.DOM.form({ style: { display: 'inline' }, onSubmit: e => {e.preventDefault(); this.onRedeemCoin();} },
                    React.DOM.button({ className: 'btn-link', type: 'submit' }, 'Redeem coin code:'),
                    React.DOM.input({ type: 'text', style: { width: 100 }, valueLink: this.linkState('coinCode') })
                )
            )
        }
    }

    /////////
    ///////// DebugPageBridges
    /////////

    interface DebugPageBridgesProps {
        identities: core.Identities;
        bridges: core.Bridge[];
        rooms: core.Room[];
        factoryData: core.FactoryData;
    }

    interface DebugPageBridgesState {
        selectedARoomValue?: string;
        selectedBRoomValue?: string;
        selectedFBRoomValue?: string;
        selectedEBRoomValue?: string;
        selectedEmailIdentityValue?: string;
        factoryKey?: string;
    }

    export class DebugPageBridges extends PureRender<DebugPageBridgesProps, DebugPageBridgesState> {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);
        private onDeleteBridge (id: string) {
            App.rest.deleteBridge(id);
        }
        private onPauseBridge (id: string, paused: boolean) {
            App.rest.putBridge(id, { is_paused: paused } as core.PutBridgeData);
        }
        private onAddBridge () {
            if (this.state.selectedARoomValue && this.state.selectedBRoomValue) {
                var aRoom = App.roomsSearchStore.findRoom(core.StringToRef(this.state.selectedARoomValue));
                var bRoom = App.roomsSearchStore.findRoom(core.StringToRef(this.state.selectedBRoomValue));
                App.rest.postBridge({
                    a_room: aRoom.data,
                    b_room: bRoom.data,
                    a_via_id: aRoom.viaId,
                    b_via_id: bRoom.viaId
                } as core.PostBridgeData);
            }
        }
        private onAddBridgeByFactory () {
            if (this.state.factoryKey && this.state.selectedFBRoomValue) {
                var bRoom = App.roomsSearchStore.findRoom(core.StringToRef(this.state.selectedFBRoomValue));
                App.rest.postBridge({
                    a_factory_key: this.state.factoryKey,
                    b_room: bRoom.data,
                    b_via_id: bRoom.viaId
                } as core.PostBridgeData);
                this.setState({
                    factoryKey: null
                });
            }
        }
        private onAddEmailBridge () {
        }
        private onCancelBridgeByFactory () {
            App.actions.cancelFactoryByKey();
            this.setState({
                factoryKey: null
            });
        }
        private afterChangeFactoryKey = _.debounce(() => {
            var factoryKey = this.state.factoryKey;
            if (factoryKey) {
                App.rest.getFactoriesByKey(factoryKey);
            }
            else {
                // FIXME: what is it?
                // this.setState({factoryInfo: null});
            }
        }, 200);

        private onChangeFactoryKey = (factoryKey: string) => {
            this.setState({factoryKey: factoryKey}, () => this.afterChangeFactoryKey());
        }

        public state: DebugPageBridgesState = {};

        public render () {
            var valueLink = {
                value: this.state.factoryKey,
                requestChange: this.onChangeFactoryKey
            };
            return React.DOM.div({},
                React.DOM.h3({}, 'BRIDGES'),
                React.DOM.ul({},
                    _.map(this.props.bridges, (bridge: core.Bridge) =>
                        React.DOM.li({ key: bridge.data.id },
                            React.DOM.span({},
                                '<' + bridge.data.a_room.provider + '> ' +
                                (bridge.data.a_room.name || '<???>') +
                                ' @ ' + (bridge.data.a_room.unit_name || '<???>') +
                                ' (via ' + bridge.data.a_via.display_name + ')'),
                            React.DOM.span({}, ' <--> '),
                            React.DOM.span({},
                                '<' + bridge.data.b_room.provider + '> ' +
                                (bridge.data.b_room.name || '<???>') +
                                ' @ ' + (bridge.data.b_room.unit_name || '<???>') +
                                ' (via ' + bridge.data.b_via.display_name + ')'),
                            React.DOM.span({}, ' - '),
                            React.DOM.span({ style: (bridge.data.a_via.failed||bridge.data.b_via.failed) ? { color: 'red' } : bridge.data.paused ? { color: 'gray' } : bridge.data.limited ? { color: 'red' } : { color: 'green' } }, ((bridge.data.a_via.failed||bridge.data.b_via.failed) ? '(FAILED)' : bridge.data.paused ? '(PAUSED)' : bridge.data.limited ? '(LIMITED)' : '(UNLIMITED)')),
                            React.DOM.span({}, ' - '),
                            bridge.data.paused ?
                                React.DOM.button({ className: 'btn-link', onClick: () => this.onPauseBridge(bridge.data.id, false) }, 'Play') :
                                React.DOM.button({ className: 'btn-link', onClick: () => this.onPauseBridge(bridge.data.id, true) }, 'Pause'),
                            React.DOM.span({}, ' - '),
                            React.DOM.a({href: '/maps/' + bridge.data.map, target: '_blank'}, 'Map'),
                            React.DOM.span({}, ' - '),
                            React.DOM.button({ className: 'btn-link', onClick: () => this.onDeleteBridge(bridge.data.id) }, 'Remove')
                        )
                    ),
                    React.DOM.li({ style: { marginTop: 10 } },
                        React.DOM.form({},
                            React.DOM.select({ style: { width: 330 }, valueLink: this.linkState('selectedARoomValue') },
                                React.DOM.option({}, 'select room'),
                                _.map(this.props.rooms, (room: core.Room) => {
                                    var label = '<' + room.data.provider + '> ' + room.data.name + ' @ ' + room.data.unit_name;
                                    var value = core.RefToString(core.RoomToRef(room));
                                    var identity = this.props.identities[room.viaId];
                                    if (identity) {
                                        label += ' (via ' + identity.display_name + ')'
                                    }
                                    return React.DOM.option({ value: value, key: value }, label)
                                })
                            ),
                            React.DOM.span({}, ' <--> '),
                            React.DOM.select({ style: { width: 330 }, valueLink: this.linkState('selectedBRoomValue') },
                                React.DOM.option({}, 'select room'),
                                _.map(this.props.rooms, (room: core.Room) => {
                                    var label = '<' + room.data.provider + '> ' + room.data.name + ' @ ' + room.data.unit_name;
                                    var value = core.RefToString(core.RoomToRef(room));
                                    var identity = this.props.identities[room.viaId];
                                    if (identity) {
                                        label += ' (via ' + identity.display_name + ')'
                                    }
                                    return React.DOM.option({ value: value, key: value }, label)
                                })
                            ),
                            React.DOM.span({}, ' - '),
                            React.DOM.button({ className: 'btn-link', onClick: () => this.onAddBridge() }, 'Add Bridge')
                        )
                    ),
                    React.DOM.li({ style: { marginTop: 10 } },
                        React.DOM.form({},
                            (this.props.factoryData ?
                                React.DOM.span({},
                                    '<' + this.props.factoryData.room.provider + '> ' +
                                    (this.props.factoryData.room.name || '<???>') +
                                    ' @ ' + (this.props.factoryData.room.unit_name || '<???>') +
                                    ' (via ' + this.props.factoryData.via.display_name + ')') :
                                React.DOM.input({ type: 'text', style: { width: 330 }, valueLink: valueLink })),
                            React.DOM.span({}, ' <--> '),
                            React.DOM.select({ style: { width: 330 }, valueLink: this.linkState('selectedFBRoomValue') },
                                React.DOM.option({}, 'select room'),
                                _.map(this.props.rooms, (room: core.Room) => {
                                    var label = '<' + room.data.provider + '> ' + room.data.name + ' @ ' + room.data.unit_name;
                                    var value = core.RefToString(core.RoomToRef(room));
                                    var identity = this.props.identities[room.viaId];
                                    if (identity) {
                                        label += ' (via ' + identity.display_name + ')'
                                    }
                                    return React.DOM.option({ value: value, key: value }, label)
                                })
                            ),
                            React.DOM.span({}, ' - '),
                            React.DOM.button({ className: 'btn-link', onClick: () => this.onAddBridgeByFactory() }, 'Add Bridge by Factory'),
                            (this.props.factoryData ?
                                [React.DOM.span({}, ' - '),
                                React.DOM.button({ className: 'btn-link', onClick: () => this.onCancelBridgeByFactory() }, 'Cancel')] : null)
                        )
                    ),
                    React.DOM.li({ style: { marginTop: 10 } },
                        React.DOM.form({},
                            React.DOM.select({ style: { width: 330 }, valueLink: this.linkState('selectedEmailIdentityValue') },
                                React.DOM.option({}, 'select email'),
                                _.map(_.filter(
                                    _.values(this.props.identities), (identity: core.IdentityData) => identity.provider == 'email'),
                                    (identity: core.IdentityData) => {
                                    var label = '<email> ' + identity.common_name;
                                    var value = identity.id;
                                    return React.DOM.option({ value: value, key: value }, label)
                                })
                            ),
                            React.DOM.span({}, ' <--> '),
                            React.DOM.select({ style: { width: 330 }, valueLink: this.linkState('selectedEBRoomValue') },
                                React.DOM.option({}, 'select room'),
                                _.map(this.props.rooms, (room: core.Room) => {
                                    var label = '<' + room.data.provider + '> ' + room.data.name + ' @ ' + room.data.unit_name;
                                    var value = core.RefToString(core.RoomToRef(room));
                                    var identity = this.props.identities[room.viaId];
                                    if (identity) {
                                        label += ' (via ' + identity.display_name + ')'
                                    }
                                    return React.DOM.option({ value: value, key: value }, label)
                                })
                            ),
                            React.DOM.span({}, ' - '),
                            React.DOM.button({ className: 'btn-link', onClick: () => this.onAddEmailBridge() }, 'Add Email Bridge')
                        )
                    )
                )
            )
        }
    }

    /////////
    ///////// DebugPageFactories
    /////////

    interface DebugPageFactoriesProps {
        identities: core.Identities;
        factories: core.Factory[];
        rooms: core.Room[];
    }

    interface DebugPageFactoriesState {
        selectedRoomValue?: string;
    }

    export class DebugPageFactories extends PureRender<DebugPageFactoriesProps, DebugPageFactoriesState> {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);

        private onDeleteFactory (id: string) {
            App.rest.deleteFactory(id);
        }
        private onAddFactory () {
            if (this.state.selectedRoomValue) {
                var room = App.roomsSearchStore.findRoom(core.StringToRef(this.state.selectedRoomValue));
                App.rest.postFactory({
                    room_id: room.data.id,
                    via_id: room.viaId,
                    b_sponsored: false,
                });
            }
        }

        public state: DebugPageFactoriesState = {};

        public render () {
            return React.DOM.div({},
                React.DOM.h3({}, 'FACTORIES'),
                React.DOM.ul({},
                    _.map(this.props.factories, (factory: core.Factory) =>
                        React.DOM.li({ key: factory.data.id },
                            React.DOM.span({},
                                '<' + factory.data.room.provider + '> ' +
                                (factory.data.room.name || '<???>') +
                                ' @ ' + (factory.data.room.unit_name || '<???>') +
                                ' (via ' + factory.data.via.display_name + ')'),
                            React.DOM.span({}, ' <--> '),
                            React.DOM.span({ style: { fontFamily: 'monospace' } }, factory.data.key),
                            React.DOM.span({}, ' - '),
                            React.DOM.span({ style: factory.data.via.failed ? { color: 'red' } : { color: 'green' } }, factory.data.via.failed ? '(FAILED)' : '(VALID)'),
                            React.DOM.span({}, ' - '),
                            React.DOM.a({ href: '/maps/' + factory.data.map, target: '_blank' }, 'Map'),
                            React.DOM.span({}, ' - '),
                            React.DOM.button({ className: 'btn-link', onClick: () => this.onDeleteFactory(factory.data.id) }, 'Remove')
                        )
                    ),
                    React.DOM.li({ style: { marginTop: 10 } },
                        React.DOM.form({},
                            React.DOM.select({ style: { width: 330 }, valueLink: this.linkState('selectedRoomValue') },
                                React.DOM.option({}, 'select room'),
                                _.map(this.props.rooms, (room: core.Room) => {
                                    var label = '<' + room.data.provider + '> ' + room.data.name + ' @ ' + room.data.unit_name;
                                    var value = core.RefToString(core.RoomToRef(room));
                                    var identity = this.props.identities[room.viaId];
                                    if (identity) {
                                        label += ' (via ' + identity.display_name + ')'
                                    }
                                    return React.DOM.option({ value: value, key: value }, label)
                                })
                            ),
                            React.DOM.span({}, ' - '),
                            React.DOM.button({ className: 'btn-link', onClick: () => this.onAddFactory() }, 'Add Factory')
                        )
                    )
                )
            )
        }
    }

    export module DOM {
        export var DebugPage = React.createFactory(ui.DebugPage);
        export var DebugPageAccounts = React.createFactory(ui.DebugPageAccounts);
        export var DebugPageRoomcoins = React.createFactory(ui.DebugPageRoomcoins);
        export var DebugPageBridges = React.createFactory(ui.DebugPageBridges);
        export var DebugPageFactories = React.createFactory(ui.DebugPageFactories);
        export var DebugPageContainer = React.createFactory(ui.DebugPageContainer);
    }
}
