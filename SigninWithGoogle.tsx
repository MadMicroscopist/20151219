/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {

    export interface SigninWithGoogleContainerProps {
        renewIdentityId?: string;
        back: () => void;
    }

    export class SigninWithGoogleContainer extends FluxContainer<SigninWithGoogleContainerProps> {
        public stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
        };
        public getState = () => ({
            status: this.stores.signinWithProviderStore.status,
        });
        public state = this.getState();
        public render () {
            return ui.DOM.SigninWithGoogle({
                renewIdentityId: this.props.renewIdentityId,
                back: this.props.back,
                status: this.state.status,
            });
        }
    }

    export interface SigninWithGoogleProps extends SigninWithGoogleContainerProps {
        status: core.SigninWithProviderStatus;
    }

    export class SigninWithGoogle extends PureComponent<SigninWithGoogleProps> {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);

        public state = {
            googleToken: '',
        };

        private onSubmit = () => {
            if (this.props.renewIdentityId) {
                ui.App.actions.renewGoogleIdentity(this.state.googleToken, this.props.renewIdentityId);
            } else {
                ui.App.actions.createGoogleIdentity(this.state.googleToken);
            }
        };

        public render() {
            var status = this.props.status;
            var renewIdentityId = this.props.renewIdentityId;
            var onCancel = this.props.back;

            var s = core.SigninWithProviderStatus
            var processing = status === s.Processing;
            var ERROR_MSG = "Error while trying to sign you in. Please make sure your code is correct.";
            var SUCCESS_MSG = "Google account successfully added!";

            return React.DOM.form({
                    className: 'auth-modal form-inline',
                    onSubmit: (e) => {
                        e.preventDefault();
                        this.onSubmit();
                    }
                },
                processing && ui.DOM.GlobalSpinner({
                    hasCancelButton: true,
                    handleHide: () => {
                        if (ui.App.signinWithProviderStore.status === s.Processing) {
                            onCancel(); // user hit Esc
                        }
                    },
                    onCancel: onCancel,
                }),
                React.DOM.div({className: 'row google-form-title'},
                    React.DOM.div({className: 'col-md-24 text-center roboto-slab'},
                        renewIdentityId ? 'Renew Your Google Identity' : 'Sign In With Google!'
                    )
                ),
                React.DOM.div({className: 'col-xs-offset-2 col-xs-20'},
                    React.DOM.ul({},
                        React.DOM.li({},
                            React.DOM.a({
                                    href: 'javascript:',
                                    onClick: (e) => {
                                        e.preventDefault();
                                        App.oauth.showSignInPopup('google');
                                    }
                                },
                                "Sign in with Google"
                            ),
                            " to get an application code."
                        ),
                        React.DOM.li({},
                            "Copy and paste the resulting code to the field below:"
                        )
                    ),

                    React.DOM.br(),

                    React.DOM.div({className: 'text-center'},
                        ui.DOM.FullWidthInputWithSumbit({},
                            React.DOM.input({valueLink: this.linkState('googleToken'), type: 'text', className: 'form-control input-lg', style: {borderRadius: '6px'}, placeholder: 'Google Code'})
                        ),
                        ui.DOM.SigninWithProviderStatusAlert({
                            errorMsg: ERROR_MSG,
                            successMsg: SUCCESS_MSG,
                        })
                    )
                )
            );
        }
    }

    export module DOM {
        export var SigninWithGoogleContainer = React.createFactory(ui.SigninWithGoogleContainer);
        export var SigninWithGoogle = React.createFactory(ui.SigninWithGoogle);
    }
}
