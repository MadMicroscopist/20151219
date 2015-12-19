/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {

    export interface ModalCancelButtonProps {
        onClick: React.MouseEventHandler;
        customText?: React.ReactNode;
    }
    var cancelButtonStyle: React.CSSProperties = {
        display: 'inline-block',
        color:'#fff',
        margin: '40px 40px 0 0',
        width: 'auto',
        fontSize: 18,
        fontWeight: 700,
        cursor: 'pointer',
    }

    var middleStyle: React.CSSProperties = {
        verticalAlign: 'middle',
    }

    var cancelStyle: React.CSSProperties = {
        verticalAlign: 'middle',
        marginRight: 10,
    }

    export class ModalCancelButton extends PureComponent<ModalCancelButtonProps> {
        public render () {
            var text = this.props.customText;
            return React.DOM.div({className: 'clearfix'},
                React.DOM.div({
                        className: 'modal-dialog pull-right',
                        style: cancelButtonStyle,
                        onClick: this.props.onClick,
                    },
                    React.DOM.span({style: cancelStyle}, text ? text : 'Cancel'),
                    React.DOM.i({className: 'fa fa-times fa-2x', style: middleStyle})
                )
            )
        }
    }

    export module DOM {
        export var ModalCancelButton = React.createFactory(ui.ModalCancelButton);
    }
}
