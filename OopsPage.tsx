/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="./PageWithImageTemplate" />


module ui {

    export enum OopsPageType {
        CantOpenTube,
        BadRoute,
        CantCreatePortal,
        SomethingWrong,
        PortalNotFound,
    }

    export interface OopsPageProps {
        type: OopsPageType;
        message?: string;
    }

    export class OopsPage extends PureComponent<OopsPageProps> {
        public render() {
            var t = OopsPageType;
            var type = this.props.type;
            var page = {} as {
                header: string;
                description?: React.ReactNode;
                button?: React.ReactNode;
            };
            if (type === t.BadRoute) {
                page = {
                    header: 'Does not compute',
                    description: React.DOM.span({}, 'Sorry, but the page you requested doesn’t exist. This happens from time to time, as we move pages, and work to improve Sameroom. Perhaps return to the homepage, and start again from there.'),
                    button: ui.DOM.NavLink({
                            href: '/',
                            className: 'btn btn-bold-yellow btn-no-border btn-lg'
                        }, "okay!")
                }
            }
            else if (type === t.CantOpenTube) {
                page = {
                    header: 'Oops!',
                    description: React.DOM.span({}, 'That didn’t work out! ' + (this.props.message ? this.props.message : '') + ' Click the button below to try again. If you need more help, ', ContactUs(), '.'),
                    button: DismissButton("Start Again")
                }
            }
            else if (type === t.CantCreatePortal
                  || type === t.SomethingWrong) {
                page = {
                    header: 'Oops!',
                    description: React.DOM.span({}, 'That didn’t work out! There might have been a technical problem. Click the button below to try again. If you need more help, ', ContactUs(), '.'),
                    button: DismissButton("Start Again")
                }
            }
            else if (type === t.PortalNotFound) {
                page = {
                    header: 'Does not compute',
                    description: React.DOM.div({className: 'text-center'}, 'Oops! Looks like this Portal is no longer available.'),
                    button: ui.DOM.NavLink({
                            href: '/',
                            className: 'btn btn-bold-yellow btn-no-border btn-lg'
                        }, "okay!")
                }
            }

            return ui.DOM.PageWithImageTemplate({
                    imageId: 'robot-oops',
                    header: page.header,
                    description: page.description,
                },
                React.DOM.br(),
                page.button ? page.button : null
            );
        }
    }

    var ContactUs = () =>
        ui.DOM.NavLink({href: '/contact'}, 'contact us')

    var DismissButton = (text: string) =>
        React.DOM.button({
                className: 'btn btn-bold-yellow btn-no-border btn-lg',
                onClick: () => ui.App.actions.dismissLastError()
            },
            text
        )

    export module DOM {
        export var OopsPage = React.createFactory(ui.OopsPage);
    }
}
