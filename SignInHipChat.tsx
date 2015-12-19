/// <reference path="FullWidthInputWithSumbit" />
/// <reference path="SignInModalStatusAlert" />

module ui {

    interface SigninWithHipChatContainerProps {
        renewIdentityId: string;
        back: () => void;
    }

    export class SigninWithHipChatContainer extends FluxContainer<SigninWithHipChatContainerProps> {
        stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
        }
        getState = () => ({
            status: this.stores.signinWithProviderStore.status,
        })
        public state = this.getState();
        public render() {
            return ui.DOM.SigninWithHipChat({
                renewIdentityId: this.props.renewIdentityId,
                back: this.props.back,
                status: this.state.status,
            })
        }
    }

    interface SigninWithHipChatProps extends SigninWithHipChatContainerProps {
        status: core.SigninWithProviderStatus;
    }

    export class SigninWithHipChat extends PureComponent<SigninWithHipChatProps> {
        public render () {
            var status = this.props.status;
            var renewIdentityId = this.props.renewIdentityId;
            var onSubmit = () => {
                var token = $(ReactDOM.findDOMNode(this.refs['hipchatToken'])).val();
                if (renewIdentityId) {
                    App.actions.renewHipChatIdentity(token, renewIdentityId);
                } else {
                    App.actions.createHipChatIdentity(token);
                }
            }
            var onCancel = this.props.back;

            var s = core.SigninWithProviderStatus
            var processing = status === s.Processing;
            var ERROR_MSG = "Token problem—please make sure your token is fresh.";
            var SUCCESS_MSG = "Token was successfully added.";
            return React.DOM.div({className: 'col-xs-offset-2 col-xs-20'},
                React.DOM.form({
                    className: 'auth-modal form-inline',
                    onSubmit: (e) => {
                        e.preventDefault();
                        onSubmit();
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
                    React.DOM.ul({},
                        React.DOM.li({},
                            "Visit your ",
                            React.DOM.a({href: 'https://hipchat.com/account/api', target: '_blank'},
                                "account settings"
                            )
                        ),
                        React.DOM.li({},
                            "Create a new token with label ’sameroom’"
                        ),
                        <li>
                            Select all scopes: ’⌘ command + a’ (Mac) or Ctrl + a (Win, Linux), and then click ’Create’. (<a href="https://sameroom.io/blog/why-all-scopes-for-hipchat-auth/" target="_blank">Why all scopes?</a>)
                        </li>,
                        React.DOM.li({},
                            "Copy and paste the resulting Token to the field below:"
                        )
                    ),
                    React.DOM.br(),
                    React.DOM.div({className: 'text-center'},
                        ui.DOM.FullWidthInputWithSumbit({},
                            React.DOM.input({ref: 'hipchatToken', type: 'text', className: 'form-control input-lg', style: {borderRadius: '6px'}, placeholder: 'HipChat Token'})
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
        export var SigninWithHipChatContainer = React.createFactory(ui.SigninWithHipChatContainer);
        export var SigninWithHipChat = React.createFactory(ui.SigninWithHipChat);
    }
}
