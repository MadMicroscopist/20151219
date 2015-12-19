module ui {

    export interface SigninWithProviderStatusAlertProps {
        errorMsg: string; // | react element?
        successMsg: string; // | react element?
    }

    export class SigninWithProviderStatusAlert extends FluxContainer<SigninWithProviderStatusAlertProps> {
        stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
        }
        getState = () => ({
            status: this.stores.signinWithProviderStore.status,
        })
        public state = this.getState()
        private style = {
            marginTop: 10,
        }
        public render () {
            var status = this.state.status;
            var s = core.SigninWithProviderStatus
            var alertClass = status === s.Fail ? 'alert-danger' : (status === s.Success ? 'alert-info' : null);
            var statusText = status === s.Fail ? this.props.errorMsg : this.props.successMsg;
            return alertClass && statusText ? React.DOM.div({className: 'alert ' + alertClass, style: this.style},
                statusText
            ) : React.DOM.noscript();
        }
    }

    export module DOM {
        export var SigninWithProviderStatusAlert = React.createFactory(ui.SigninWithProviderStatusAlert);
    }
}
