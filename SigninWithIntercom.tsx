/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {

    export interface SigninWithIntercomContainerProps {
        renewIdentityId?: string;
        back: () => void;
    }

    export class SigninWithIntercomContainer extends FluxContainer<SigninWithIntercomContainerProps> {
        componentDidMount() {
            _.defer(() => {
                // ui.App.actions.resetIntercomAuth();
            })
        }
        public stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
        };
        public getState = () => ({
            status: this.stores.signinWithProviderStore.status,
            intercomError: this.stores.signinWithProviderStore.intercomError,
        });
        public state = this.getState();
        public render () {
            return ui.DOM.SigninWithIntercom({
                renewIdentityId: this.props.renewIdentityId,
                back: this.props.back,
                status: this.state.status,
                intercomError: this.state.intercomError,
            });
        }
    }

    export interface SigninWithIntercomProps extends SigninWithIntercomContainerProps {
        status: core.SigninWithProviderStatus;
        intercomError: core.IntercomError;
    }

    export class SigninWithIntercom extends PureComponent<SigninWithIntercomProps> {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);

        private intercomEmailOk = () =>
            !!this.state.intercomEmail.length;
        private intercomEmailNeedsAttention = () =>
            this.state.intercomEmailMissing && !this.intercomEmailOk();

        private intercomAppIdOk = () =>
            !!this.state.intercomAppId.length;
        private intercomAppIdNeedsAttention = () =>
            this.state.intercomAppIdMissing && !this.intercomAppIdOk();

        private intercomTokenOk = () =>
            !!this.state.intercomToken.length;
        private intercomTokenNeedsAttention = () =>
            this.state.intercomTokenMissing && !this.intercomTokenOk();

        private placeholders = {
            intercomEmail: "Enter your Intercom Email",
            intercomAppId: "Enter your Intercom App ID",
            intercomToken: "Enter your Intercom Token",
        };

        public state = {
            intercomEmail: '',
            intercomAppId: '',
            intercomToken: '',
            intercomEmailMissing: false,
            intercomAppIdMissing: false,
            intercomTokenMissing: false,
        };

        private onSubmit = () => {
            if (this.props.renewIdentityId) {
                ui.App.actions.renewIntercomIdentity(this.state.intercomToken, this.props.renewIdentityId);
            } else {
                ui.App.actions.createIntercomIdentity(this.state.intercomEmail, this.state.intercomAppId, this.state.intercomToken);
            }
            this.setState({
                intercomEmailMissing: !this.intercomEmailOk(),
                intercomAppIdMissing: !this.intercomAppIdOk(),
                intercomTokenMissing: !this.intercomTokenOk(),
            });
        };

        public render() {
            var status = this.props.status;
            var intercomError = this.props.intercomError;
            var renewIdentityId = this.props.renewIdentityId;
            var onCancel = this.props.back;

            var s = core.SigninWithProviderStatus;
            var e = core.IntercomError;
            var processing = status === s.Processing;
            var ERROR_MSG = "Error while trying to sign you in. Please contact us if this issue is not resolved.";
            if (intercomError === e.WrongToken) {
                ERROR_MSG = "Error while trying to sign you in. Please make sure your App ID and API Key are correct.";
            }

            var intercomEmailPlaceholder = this.placeholders.intercomEmail + (this.state.intercomEmailMissing ? ' *' : '');
            var intercomAppIdPlaceholder = this.placeholders.intercomAppId + (this.state.intercomAppIdMissing ? ' *' : '');
            var intercomTokenPlaceholder = this.placeholders.intercomToken + (this.state.intercomTokenMissing ? ' *' : '');

            return React.DOM.div({className: 'auth-modal'},
                processing && ui.DOM.GlobalSpinner({
                    hasCancelButton: true,
                    handleHide: () => {
                        if (ui.App.signinWithProviderStore.status === s.Processing) {
                            onCancel(); // user hit Esc
                        }
                    },
                    onCancel: onCancel,
                }),
                React.DOM.div({className: 'row modal-form-title'},
                    React.DOM.div({className: 'col-md-24 text-center roboto-slab'},
                        renewIdentityId && 'Renew Your Intercom Identity',
                        !renewIdentityId && 'Sign In With Intercom!'
                    )
                ),

                React.DOM.div({className: 'col-xs-offset-2 col-xs-20'},
                    React.DOM.div({className: 'description'},
                        "You can use the email address of any Intercom admin in your team.",
                        React.DOM.br(),
                        React.DOM.br(),
                        "In order to get the App ID and API Key, click on the gear icon in the top navigation and go to ",
                        React.DOM.b({}, "Integrations"),
                        ". Open the ",
                        React.DOM.b({}, "API keys"),
                        " section and click on the ",
                        React.DOM.b({}, "Create Full Access API Key"),
                        " button."
                    ),
                    React.DOM.br()
                ),

                React.DOM.form({
                        className: 'form-horizontal col-xs-offset-2 col-xs-20',
                        onSubmit: (e) => {
                            e.preventDefault();
                            this.onSubmit();
                        }
                    },
                    !renewIdentityId && React.DOM.div({className: 'form-group'},
                        React.DOM.label({className: 'col-sm-6 modal-form-label', htmlFor: 'intercomEmail'}, 'Email'),
                        React.DOM.div({className: 'col-sm-18'},
                            React.DOM.input({valueLink: this.linkState('intercomEmail'), id: 'intercomEmail', type: 'text', className: classNames('form-control input-lg', {'attention': this.intercomEmailNeedsAttention()}), placeholder: intercomEmailPlaceholder})
                        )
                    ),
                    !renewIdentityId && React.DOM.div({className: 'form-group'},
                        React.DOM.label({className: 'col-sm-6 modal-form-label', htmlFor: 'intercomAppId'}, 'App ID'),
                        React.DOM.div({className: 'col-sm-18'},
                            React.DOM.input({valueLink: this.linkState('intercomAppId'), id: 'intercomAppId', type: 'text', className: classNames('form-control input-lg', {'attention': this.intercomAppIdNeedsAttention()}), placeholder: intercomAppIdPlaceholder})
                        )
                    ),
                    React.DOM.div({className: 'form-group'},
                        React.DOM.label({className: 'col-sm-6 modal-form-label', htmlFor: 'intercomToken'}, 'API Key'),
                        React.DOM.div({className: 'col-sm-18'},
                            React.DOM.input({valueLink: this.linkState('intercomToken'), id: 'intercomToken', type: 'text', className: classNames('form-control input-lg', {'attention': this.intercomTokenNeedsAttention()}), placeholder: intercomTokenPlaceholder})
                        )
                    ),
                    React.DOM.div({className: 'text-right'},
                        React.DOM.input({type: 'submit', className: 'btn btn-bold-yellow btn-no-border btn-lg', value: renewIdentityId ? 'Submit' : 'Sign In'})
                    )
                ),

                React.DOM.div({className: 'col-xs-offset-2 col-xs-20'},
                    ui.DOM.SigninWithProviderStatusAlert({
                        errorMsg: ERROR_MSG,
                        successMsg: null,
                    })
                )
            );
        }
    }

    export module DOM {
        export var SigninWithIntercomContainer = React.createFactory(ui.SigninWithIntercomContainer);
        export var SigninWithIntercom = React.createFactory(ui.SigninWithIntercom);
    }
}
