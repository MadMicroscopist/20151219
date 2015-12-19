module ui {

    export class DebugAdminPageContainer extends FluxSimpleContainer {
        public stores = {
            coinsStore: ui.App.coinsStore,
        };
        public getState = () => ({
            adminCoins: this.stores.coinsStore.adminCoins,
        });
        public state = this.getState();
        public render() {return ui.DOM.DebugAdminPage(this.state);}
    }

    export interface DebugAdminPageProps {
        adminCoins: core.CoinData[];
    }

    export class DebugAdminPage extends PureComponent<DebugAdminPageProps> {
        private coinsText () {
            var coins = _.map(this.props.adminCoins, (coin) => coin.code);
            return coins.join("\n");
        }

        public render () {
            return React.DOM.div({},
                React.DOM.h3({}, 'SEED ROOMCOINS'),
                React.DOM.form({onSubmit: (e) => {
                        e.preventDefault();
                        var data = {
                            count: parseInt($("#coins_count").val()),
                            amount: parseInt($("#coins_amount").val())
                        };
                        var operation = ui.App.rest.getRestOperation(data);
                        ui.App.rest.seedCoins(operation);
                    }},
                    React.DOM.div({ className: "form-group" },
                        React.DOM.label({ htmlFor: "coins_count" }, "Amount of roomcoins"),
                        React.DOM.input({type: "number", className: "form-control", id: "coins_count", placeholder: "Count", defaultValue: '5'})
                    ),
                    React.DOM.div({ className: "form-group" },
                        React.DOM.label({ htmlFor: "coins_amount" }, "Roomcoin value (tubes)"),
                        React.DOM.input({type: "number", className: "form-control", id: "coins_amount", placeholder: "Amount", defaultValue: '1'})
                    ),
                    React.DOM.button({ type: "submit", className: "btn btn-default" }, "Submit")
                ),
                (this.props.adminCoins.length > 0) && React.DOM.div({},
                    React.DOM.h3({}, "Coins added:"),
                    React.DOM.ul({},
                        _.map(this.props.adminCoins, (coin) => React.DOM.li({key: coin.code},
                            coin.code
                        ))
                    ),
                    ui.DOM.ZeroClipboard({
                        className: 'btn btn-default',
                        "data-clipboard-text": this.coinsText(),
                        render: (state) => {
                            return React.DOM.span({},
                                (state.status === 'aftercopy') ?
                                    "Copied!" :
                                (state.status === 'beforecopy' || state.status === 'copy') ?
                                    "Copying..." :
                                    "copy to clipboard"
                            )
                        }
                    })
                ),
                React.DOM.br()
            );
        }
    }

    export module DOM {
        export var DebugAdminPageContainer = React.createFactory(ui.DebugAdminPageContainer);
        export var DebugAdminPage = React.createFactory(ui.DebugAdminPage);
    }
}
