/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="../sameroom-bootstrap-modal.d.ts" />
/// <reference path="CancelButton" />


module ui {

    export interface SameroomModalProps extends BootstrapModalEventHandlers {
        id?: string;
        isShown?: boolean;
        hasCancelButton?: boolean;
        cancelButtonCustomText?: React.ReactNode;
        className?: string;
        noContent?: boolean;
        children?: React.ReactNode;
    }

    export class SameroomModal extends FluxContainer<SameroomModalProps> {
        render() {
            var eventProps: BootstrapModalEventHandlers = this.props;
            return <ui.BootstrapModal
                    id={this.props.id}
                    isShown={this.props.isShown}
                    className={this.props.className}
                    noContent={true}
                    modalOptions={{backdrop: 'static'}}
                    // events
                    handleClose={eventProps.handleClose}
                    handleShow={eventProps.handleShow}
                    handleShown={eventProps.handleShown}
                    handleHide={eventProps.handleHide}
                    handleHidden={eventProps.handleHidden}
                >
                {this.props.hasCancelButton && <ui.ModalCancelButton onClick={this.props.handleClose} customText={this.props.cancelButtonCustomText} />}
                {this.props.noContent && this.props.children}
                {!this.props.noContent && <div className="modal-dialog" style={{color:'#fff'}}>
                    {this.props.children}
                </div>}
            </ui.BootstrapModal>
        }
    }

    export module DOM {
        export var SameroomModal = React.createFactory(ui.SameroomModal);
    }
}
