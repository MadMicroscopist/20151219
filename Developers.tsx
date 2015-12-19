/// <reference path="../core/App.ts" />

module ui {
    export class Developers extends PureComponent<{}> {
        public render() {
            return React.DOM.div({className: 'developers-page'},
                ui.DOM.PageWithImageTemplate({
                    imageId: 'robot-developer',
                    header: 'Developers',
                    description: React.DOM.div({},
                        "We’re working on a “generic” protocol recommendation that, if implemented, would automatically get you interoperability with all systems Sameroom supports.",
                        React.DOM.br(),
                        React.DOM.br(),
                        "Meanwhile, we’re happy to build an adapter for you. Here’s what we’re looking for:",
                        React.DOM.br(),
                        React.DOM.br(),
                        React.DOM.ol({style: {paddingLeft: 25, marginBottom: 0}},
                            React.DOM.li({},"OAuth"),
                            React.DOM.li({},"Read messages in real-time (via websocket, ideally)"),
                            React.DOM.li({},"Retrieve a list of people and rooms"),
                            React.DOM.li({},"Post a message as a bot, providing a name and avatar"),
                            React.DOM.li({},"Upload files with same semantics as in #4"),
                            React.DOM.li({},"Download files")
                        ),
                        React.DOM.br(),
                        ui.DOM.NavLink({href: '/contact'}, 'Contact us'),
                        " if you have an integration in mind."
                    )
                })
            );
        }
    }

    export module DOM {
        export var Developers = React.createFactory(ui.Developers);
    }
}
