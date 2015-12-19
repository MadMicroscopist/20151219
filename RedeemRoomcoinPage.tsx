/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="InstrumentsList" />

module ui {

    export class RedeemRoomcoinPageContainer extends FluxSimpleContainer {
        public stores = {
            agentStore: ui.App.agentStore,
            redeemPageStore: ui.App.redeemPageStore,
            coinsStore: ui.App.coinsStore,
        };
        public getState = () => ({
            agent: this.stores.agentStore.agent,
            processing: this.stores.redeemPageStore.processing,
            error: this.stores.redeemPageStore.error,
            wrongRoomcoin: this.stores.redeemPageStore.wrongRoomcoin,
            success: this.stores.redeemPageStore.success,
            coins: this.stores.coinsStore.coins,
            deletingCode: this.stores.coinsStore.deletingCode,
            deletingFailed: this.stores.coinsStore.deletingFailed,
        });
        public state = this.getState();
        public render() {return ui.DOM.RedeemRoomcoinPage(this.state);}
    }

    export interface RedeemRoomcoinPageProps {
        agent: core.AgentData;
        processing: boolean;
        error: boolean;
        wrongRoomcoin: boolean;
        success: boolean;
        coins: core.CoinData[];
        deletingCode: boolean;
        deletingFailed: boolean;
    }

    export interface RedeemRoomcoinPageState {
        coinCode?: string;
        codeToDetach?: string;
    }

    export class RedeemRoomcoinPage extends PureRender<RedeemRoomcoinPageProps,RedeemRoomcoinPageState> {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);
        public state: RedeemRoomcoinPageState = {
            coinCode: '',
            codeToDetach: '',
        };
        private onSubmit() {
            var code = this.state.coinCode;
            if (code) {
                ui.App.actions.redeemCoin(this.state.coinCode);
                this.setState({coinCode: ''});
            }
        }
        public componentDidMount() {
            ui.App.rest.getCoins();
        }
        public componentWillReceiveProps(newProps: RedeemRoomcoinPageProps) {
            var codeToDetach = this.state.codeToDetach;
            if (codeToDetach) {
                var cantDetach = _.all(newProps.coins, (coin) => coin.code !== codeToDetach);
                if (cantDetach || newProps.deletingFailed) {
                    this.setState({codeToDetach: ''})
                }
            }
        }
        public render() {
            var agent = this.props.agent;
            var processing = this.props.processing;
            var error = this.props.error;
            var wrongRoomcoin = this.props.wrongRoomcoin;
            var success = this.props.success;
            var codeToDetach = this.state.codeToDetach;
            var deletingCode = this.props.deletingCode;
            var deletingFailed = this.props.deletingFailed;

            var pageName = agent ? 'redeem' : 'signin';

            var pageTemplate = React.DOM.div({className: 'redeem-page'},
                ui.DOM.PageWithImageTemplate({
                        imageId: 'robot-pay',
                        header: 'Roomcoin!',
                        description: React.DOM.div({},
                            agent && this.props.coins.length ? React.DOM.span({},
                                'Your current budget is ' + core.TubesPlural(agent.budgeted) + '. Click ', ui.DOM.NavLink({href: '/manage'}, "here"), ' to administer your Portals and Tubes.'
                            ) : React.DOM.span({},
                                'To redeem roomcoin, insert your code in the field below, and hit Submit—easy peasy! (As you redeem roomcoin, you can administer its use in the area beneath.)'
                            ),
                            deletingFailed && React.DOM.div({},
                                React.DOM.br(),
                                React.DOM.span({className: 'inline-error'},
                                    'Oops! There’s a problem while deleting this code. Please try again later, or ',
                                    ui.DOM.NavLink({href: '/contact'}, 'contact us'),
                                    ' if you can’t resolve this issue.'
                                )
                            ),
                            wrongRoomcoin ? React.DOM.div({},
                                React.DOM.br(),
                                React.DOM.span({className: 'inline-error'},
                                    'Oops! There’s a problem with that code. Please resubmit it, or ',
                                    ui.DOM.NavLink({href: '/contact'}, 'contact us'),
                                    ' if you can’t resolve this issue.'
                                )
                            ) : null
                        )
                    },
                    React.DOM.br(),

                    React.DOM.div({},
                        React.DOM.form({
                                className: 'form-inline',
                                onSubmit: (e) => {
                                    e.preventDefault();
                                    this.onSubmit();
                                }
                            },
                            ui.DOM.FullWidthInputWithSumbit({},
                                React.DOM.input({valueLink: this.linkState('coinCode'), className: 'form-control no-border', placeholder: "Redeem code"})
                            )
                        )
                    ),
                    _.map(this.props.coins, (coin) => {
                        return React.DOM.div({
                                key: coin.code,
                                className: 'row no-gutters coin-row',
                            },
                            React.DOM.div({className: 'pull-right'},
                                React.DOM.button({
                                    className: 'close fa fa-times fa-2x',
                                    onClick: () => {
                                        this.setState({
                                            codeToDetach: coin.code
                                        })
                                    }
                                })
                            ),
                            React.DOM.span({className: 'pull-left provider-icon'},
                                React.DOM.span({className: 'helper'}),
                                React.DOM.img({
                                    src: CDNify('/img/coin-icon.png'),
                                    style: {width: 52},
                                })
                            ),
                            React.DOM.div({className: 'coin-code'},
                                coin.code, ": ", core.TubesPlural(coin.amount)
                            )
                        )
                    }),
                    codeToDetach && ui.DOM.FullScreenModal({
                        title: 'Are You Sure?',
                        warning: "Once you detach the coin, you can give it to a friend. Just make sure to write the code (" + codeToDetach + ") down, so you can pass it along.",
                        buttonText: 'Detach',
                        onSure: () => {
                            App.actions.detachCoin(codeToDetach);
                        },
                        onHide: () => { this.setState({ codeToDetach: '' }) },
                        elements: deletingCode && ui.DOM.GlobalSpinner({}),
                    })
                )
            );

            var signin = ui.DOM.SigninPageTemplate({
                urlPrefix: '/roomcoin'
            });

            return React.DOM.div({},
                error ? ui.DOM.OopsPage({
                    type: OopsPageType.SomethingWrong
                }) : (pageName === 'signin') ? signin : pageTemplate,
                (processing) ? ui.DOM.GlobalSpinner({}) : null
            );
        }
    }

    export module DOM {
        export var RedeemRoomcoinPageContainer = React.createFactory(ui.RedeemRoomcoinPageContainer);
        export var RedeemRoomcoinPage = React.createFactory(ui.RedeemRoomcoinPage);
    }
}
