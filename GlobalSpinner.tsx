/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {

    export interface GlobalSpinnerProps {
        hasCancelButton?: boolean;
        handleHide?: (eventObject: JQueryEventObject) => any; // can be in normal flow, as well as Esc
        onCancel?: () => void; // user have to click on Cancel
    }

    export class GlobalSpinner extends PureComponent<GlobalSpinnerProps> {

        public render () {
            var hasCancelButton = this.props.hasCancelButton;
            return <ui.BootstrapModal
                    id="global-spinner"
                    isShown={true}
                    className={''}
                    modalOptions={{backdrop: 'static', keyboard: !!hasCancelButton}}
                    handleHide={this.props.handleHide}
                    noContent={true}
                >

                {hasCancelButton && <ui.ModalCancelButton onClick={this.props.onCancel}/>}

                <div className="global-spinner">
                    <i className="three-quarters fa-spin"/>
                    <div className="roboto-slab">processing...</div>
                </div>
            </ui.BootstrapModal>
        }
    }

    export interface SigninModalGlobalSpinnerProps {
        onCancel: () => void;
    }

    export class SigninModalGlobalSpinner extends PureComponent<SigninModalGlobalSpinnerProps> {
        public render() {
            let {onCancel} = this.props;
            let handleHide = () => {
                if (ui.App.signinWithProviderStore.status === core.SigninWithProviderStatus.Processing) {
                    onCancel(); // user hit Esc
                }
            };
            let props = {
                hasCancelButton: true,
                onCancel,
                handleHide: handleHide,
            }
            return <ui.GlobalSpinner {...props}/>;
        }
    }

    export module DOM {
        export var GlobalSpinner = React.createFactory(ui.GlobalSpinner);
    }
}
