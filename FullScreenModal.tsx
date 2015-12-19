/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {

    export interface FullScreenModalProps {
        title?: React.ReactNode;
        titleCustomMargin?: number;
        warning?: React.ReactNode;
        buttonText?: string;
        onSure?: () => void;
        onHide?: () => void;
        elements?: React.ReactNode;
    }

    export class FullScreenModalBody extends PureComponent<FullScreenModalProps> {
        public render () {
            var titleCustomMargin = this.props.titleCustomMargin || 130;
            var attrs : React.HTMLAttributes = {
                className: 'full-screen-modal grid-24'
            };
            var body = React.DOM.div(attrs,
                this.props.title ? React.DOM.div({},
                    React.DOM.div({className: 'hidden-xs', style: {marginTop: titleCustomMargin}}),
                    React.DOM.div({className: 'row title-row'},
                        React.DOM.div({className: 'col-md-24 text-center roboto-slab'}, this.props.title)
                    )) :
                    React.DOM.div({className: 'hidden-xs', style: {marginTop: 30}}),
                React.DOM.div({className: 'row warning-row'},
                    React.DOM.div({className: 'col-xs-offset-1 col-xs-22 text-left'}, this.props.warning)
                ),
                React.DOM.div({className: 'hidden-xs', style: {marginTop: 30}}),
                this.props.onSure ? React.DOM.div({className: 'row button-row'},
                    React.DOM.div({className: 'col-md-24 text-center'},
                        React.DOM.button({className: 'btn btn-bold-yellow btn-no-border btn-lg', onClick: (event: React.MouseEvent) => this.props.onSure() }, this.props.buttonText)
                    )
                ) : null,
                this.props.elements?
                React.DOM.div({},
                    React.DOM.div({className: 'hidden-xs', style: {marginTop: 30}}),
                    React.DOM.div({className: 'elements'},
                        this.props.elements
                    )
                ) : null
            );

            return body;
        }
    };

    export class FullScreenModal extends PureComponent<FullScreenModalProps> {
        public render () {
            return ui.DOM.SameroomModal({
                    className: '',
                    hasCancelButton: true,
                    handleClose: this.props.onHide,
                    handleHide: this.props.onHide,
                    isShown: true,
                },
                ui.DOM.FullScreenModalBody(this.props)
            );
        }
    };

    export module DOM {
        export var FullScreenModalBody = React.createFactory(ui.FullScreenModalBody);
        export var FullScreenModal = React.createFactory(ui.FullScreenModal);
    }
}
