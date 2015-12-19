/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="../sameroom-bootstrap-modal.d.ts" />

/// <reference path="../core/App.ts" />

module ui {

    export interface BootstrapModalEventHandlers {
        handleClose?: (eventObject: React.MouseEvent) => any;
        handleShow?: (eventObject: JQueryEventObject) => any;
        handleShown?: (eventObject: JQueryEventObject) => any;
        handleHide?: (eventObject: JQueryEventObject) => any;
        handleHidden?: (eventObject: JQueryEventObject) => any;
    }

    export interface BootstrapModalProps extends BootstrapModalEventHandlers {
        id?: string;
        isShown?: boolean;
        className?: string;
        hasCloseButton?: boolean;
        noContent?: boolean;
        modalHeader?: React.ReactNode;
        modalOptions?: BootstrapModalOptions;
        children?: React.ReactNode;
    }

    export interface BootstrapModalState {
    }

    export class BootstrapModal extends React.Component<BootstrapModalProps, BootstrapModalState> {
        private _portal: HTMLDivElement;
        public findPortalElement() {
            return $(this._portal);
        }
        public findModalElement() {
            return $(this._portal).find('.modal');
        }

        componentDidMount() {
            this._portal = document.createElement('div');
            document.body.appendChild(this._portal);
            if (this.props.isShown) {
                ui.App.bootstrapModal.preShowModal(this);
            }
            this.renderPortal(() => {
                var $modal = $(this._portal).find('.modal');
                if (this.props.modalOptions) {
                    $modal.modal(this.props.modalOptions);
                }
                if (this.props.isShown) {
                    if ($modal.data('bs.modal') === undefined || !($modal.data('bs.modal') as any).isShown) {
                        $modal.modal('show');
                    }
                } else {
                    $modal.modal('hide');
                }
                if (this.props.handleShow) {
                    $modal.on('show.bs.modal', this.props.handleShow);
                }
                if (this.props.handleShown) {
                    $modal.on('shown.bs.modal', this.props.handleShown);
                }
                if (this.props.handleHide) {
                    $modal.on('hide.bs.modal', this.props.handleHide);
                }
                if (this.props.handleHidden) {
                    $modal.on('hidden.bs.modal', this.props.handleHidden);
                }
            });
        }
        componentWillUnmount() {
            ui.App.bootstrapModal.preHideModal(this);
            var $modal = $(this._portal).find('.modal');
            $modal.modal('hide');
            if (this.props.handleShow) {
                $modal.off('show.bs.modal', this.props.handleShow);
            }
            if (this.props.handleShown) {
                $modal.off('shown.bs.modal', this.props.handleShown);
            }
            if (this.props.handleHide) {
                $modal.off('hide.bs.modal', this.props.handleHide);
            }
            if (this.props.handleHidden) {
                $modal.off('hidden.bs.modal', this.props.handleHidden);
            }
            ReactDOM.unmountComponentAtNode(this._portal);
            document.body.removeChild(this._portal);
        }
        componentDidUpdate() {
            this.renderPortal(() => {
                var $modal = $(this._portal).find('.modal');
                if (this.props.isShown) {
                    ui.App.bootstrapModal.preShowModal(this);
                    if ($modal.data('bs.modal') === undefined || !($modal.data('bs.modal') as any).isShown) {
                        $modal.modal('show');
                    }
                } else {
                    ui.App.bootstrapModal.preHideModal(this);
                    if ($modal.data('bs.modal') !== undefined && ($modal.data('bs.modal') as any).isShown) {
                        $modal.modal('hide');
                    }
                }
            });
        }
        handleClose(event: React.MouseEvent) {
            if (this.props.handleClose) {
                this.props.handleClose(event);
            }
        }
        render() {
            return React.DOM.noscript({});
        }
        private renderPortal = (callback: () => void) => {
            ReactDOM.render(this.renderModal(), this._portal, callback);
        }
        private renderModal = () => {
            var modalHeader = this.props.modalHeader;
            var className = 'fade';
            if (this.props.className !== undefined) { // to allow pass empty string
                className = this.props.className;
            }
            return React.DOM.div({},
                React.DOM.div({ id: this.props.id, className: classNames('modal', className), tabIndex: -1 },
                    (!this.props.noContent) ? React.DOM.div({ className: 'modal-dialog' },
                        React.DOM.div({ className: 'modal-content' },
                            React.DOM.div({ className: 'modal-header' },
                                this.props.hasCloseButton &&
                                    <button  className="close" type="button" aria-hidden="true" onClick={this.handleClose}>×</button>,
                                modalHeader
                            ),
                            this.props.children
                        )
                    ) : this.props.children
                )
            );
        }
    }

    export module DOM {
        export var BootstrapModal = React.createFactory(ui.BootstrapModal);
    }
}
