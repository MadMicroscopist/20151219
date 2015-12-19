/// <reference path="../core/App.ts" />

module ui {
    export class LabsPageContainer extends FluxSimpleContainer {
        public stores = {
            labsStore: ui.App.labsStore,
        };
        public getState = () => (this.stores.labsStore.flags);
        public state = this.getState();
        public render() {return ui.DOM.LabsPage(this.state);}
    }

    export class LabsPage extends PureComponent<core.LabsStoreFlags> {
        private checkbox(key: string, name: string) {
            var lsKey = 'labs_' + key;
            var checked = this.props[key];
            return React.DOM.div({className: 'row', style: {marginTop: 10}},
                React.DOM.div({className: "col-xs-3"},
                    React.DOM.label({className: "switch"},
                        React.DOM.input({
                            type: "checkbox",
                            className: "switch-input",
                            checked: checked,
                            onChange: () => {
                                var a: core.LabsStoreFlags = {};
                                a[key] = !checked;
                                ui.App.actions.updateLabsFlags(a);
                            }
                        }),
                        <span className="switch-label" data-on="ON" data-off="OFF" />,
                        React.DOM.span({className: "switch-handle"})
                    )
                ),
                <div className="col-xs-6">
                    {name}
                </div>
            );
        }

        public render() {
            return React.DOM.div({className: 'labs-page'},
                ui.DOM.PageWithImageTemplate({
                    imageId: 'robot-developer',
                    header: 'Labs',
                    description: React.DOM.div({},
                        "Options:",
                        this.checkbox("hide_email_alert", "Email Alert"),
                        React.DOM.br()
                    )
                })
            );
        }
    }

    export module DOM {
        export var LabsPage = React.createFactory(ui.LabsPage);
        export var LabsPageContainer = React.createFactory(ui.LabsPageContainer);
    }
}
