/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {

    export interface SigninWithFleepContainerProps {
        renewIdentityId?: string;
        back: () => void;
    }

    export class SigninWithFleepContainer extends FluxContainer<SigninWithFleepContainerProps> {
        public stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
        };
        public getState = () => ({
            status: this.stores.signinWithProviderStore.status,
        });
        public state = this.getState();
        public render () {
            return ui.DOM.SigninWithFleep({
                renewIdentityId: this.props.renewIdentityId,
                back: this.props.back,
                status: this.state.status,
            });
        }
    }

    export interface SigninWithFleepProps extends SigninWithFleepContainerProps {
        status: core.SigninWithProviderStatus;
    }

    export class SigninWithFleep extends PureComponent<SigninWithFleepProps> {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);

        private fleepNameOk = () =>
            !!this.state.fleepName.length;
        private fleepNameNeedsAttention = () =>
            this.state.fleepNameMissing && !this.fleepNameOk();

        private passwordOk = () =>
            !!this.state.fleepPassword.length;
        private passwordNeedsAttention = () =>
            this.state.fleepPasswordMissing && !this.passwordOk();

        private placeholders = {
            fleepName: 'Enter your Fleep ID or Email',
            fleepPassword: 'Enter your Fleep Password',
        };

        public state = {
            fleepName: '',
            fleepPassword: '',
            fleepNameMissing: false,
            fleepPasswordMissing: false,
        };

        private onSubmit = () => {
            var validInput = this.passwordOk();
            if (this.props.renewIdentityId) {
                if (validInput) {
                    ui.App.actions.renewFleepIdentity(this.state.fleepPassword, this.props.renewIdentityId);
                }
            } else {
                validInput = validInput && this.fleepNameOk();
                if (validInput) {
                    ui.App.actions.createFleepIdentity(this.state.fleepName, this.state.fleepPassword);;
                }
            }
            this.setState({
                fleepNameMissing: !this.fleepNameOk(),
                fleepPasswordMissing: !this.passwordOk(),
            });
        };

        public render() {
            var status = this.props.status;
            var renewIdentityId = this.props.renewIdentityId;
            var onCancel = this.props.back;

            var s = core.SigninWithProviderStatus
            var processing = status === s.Processing;
            var alertClass = status === s.Fail ? 'alert-danger' : (status === s.Success ? 'alert-info' : null);
            var ERROR_MSG = "Error while trying to sign you in. Please make sure your Fleep credentials are correct.";
            var SUCCESS_MSG = "Fleep account successfully added!";

            var fleepNamePlaceholder = this.placeholders.fleepName + (this.state.fleepNameMissing ? ' *' : '');
            var fleepPasswordPlaceholder = this.placeholders.fleepPassword + (this.state.fleepPasswordMissing ? ' *' : '');

            return React.DOM.form({
                    className: 'auth-modal form-horizontal',
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
                React.DOM.div({className: 'row fleep-form-title'},
                    React.DOM.div({className: 'col-md-24 text-center roboto-slab'},
                        renewIdentityId ? 'Renew Your Fleep Identity' : 'Sign In With Fleep!'
                    )
                ),
                React.DOM.div({className: 'col-xs-offset-2 col-xs-20'},
                    !renewIdentityId && React.DOM.div({className: 'form-group'},
                        React.DOM.label({className: 'col-sm-6 fleep-form-label', htmlFor: 'fleepName'}, 'Fleep ID'.replace(" ", "\u00a0")),
                        React.DOM.div({className: 'col-sm-18'},
                            React.DOM.input({valueLink: this.linkState('fleepName'), id: 'fleepName', type: 'text', className: classNames('form-control input-lg', {'attention': this.fleepNameNeedsAttention()}), placeholder: fleepNamePlaceholder})
                        )
                    ),
                    React.DOM.div({className: 'form-group'},
                        React.DOM.label({className: 'col-sm-6 fleep-form-label', htmlFor: 'fleepPassword'}, 'Password'),
                        React.DOM.div({className: 'col-sm-18'},
                            React.DOM.input({valueLink: this.linkState('fleepPassword'), id: 'fleepPassword', type: 'password', className: classNames('form-control input-lg', {'attention': this.passwordNeedsAttention()}), placeholder: fleepPasswordPlaceholder})
                        )
                    ),
                    <ui.SecurityInfo />,
                    React.DOM.div({className: 'text-right'},
                        React.DOM.input({type: 'submit', className: 'btn btn-bold-yellow btn-no-border btn-lg', value: renewIdentityId ? 'Submit' : 'Sign In'})
                    ),
                    alertClass && React.DOM.div({className: 'alert ' + alertClass},
                        status === s.Fail ? ERROR_MSG : SUCCESS_MSG
                    )
                )
            );
        }
    }

    export module DOM {
        export var SigninWithFleepContainer = React.createFactory(ui.SigninWithFleepContainer);
        export var SigninWithFleep = React.createFactory(ui.SigninWithFleep);
    }
}
