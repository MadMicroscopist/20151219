/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {

    export interface SigninWithOlarkContainerProps {
        renewIdentityId?: string;
        back: () => void;
    }

    export class SigninWithOlarkContainer extends FluxContainer<SigninWithOlarkContainerProps> {
        public stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
        };
        public getState = () => ({
            status: this.stores.signinWithProviderStore.status,
        });
        public state = this.getState();
        public render () {
            return <ui.SigninWithOlark {...this.props} {...this.state}/>
        }
    }

    export interface SigninWithOlarkProps extends SigninWithOlarkContainerProps {
        status: core.SigninWithProviderStatus;
    }

    export class SigninWithOlark extends PureComponent<SigninWithOlarkProps> {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);

        private olarkNameOk = () =>
            !!this.state.olarkName.length;
        private olarkNameNeedsAttention = () =>
            this.state.olarkNameMissing && !this.olarkNameOk();

        private passwordOk = () =>
            !!this.state.olarkPassword.length;
        private passwordNeedsAttention = () =>
            this.state.olarkPasswordMissing && !this.passwordOk();

        private placeholders = {
            olarkName: 'Enter your Email',
            olarkPassword: 'Enter your Olark Password',
        };

        public state = {
            olarkName: '',
            olarkPassword: '',
            olarkNameMissing: false,
            olarkPasswordMissing: false,
        };

        private onSubmit = () => {
            var validInput = this.passwordOk();
            if (this.props.renewIdentityId) {
                if (validInput) {
                    ui.App.actions.renewOlarkIdentity(this.state.olarkPassword, this.props.renewIdentityId);
                }
            } else {
                validInput = validInput && this.olarkNameOk();
                if (validInput) {
                    ui.App.actions.createOlarkIdentity(this.state.olarkName, this.state.olarkPassword);;
                }
            }
            this.setState({
                olarkNameMissing: !this.olarkNameOk(),
                olarkPasswordMissing: !this.passwordOk(),
            });
        };

        public render() {
            var status = this.props.status;
            var renewIdentityId = this.props.renewIdentityId;
            var onCancel = this.props.back;

            var s = core.SigninWithProviderStatus
            var processing = status === s.Processing;
            var alertClass = status === s.Fail ? 'alert-danger' : (status === s.Success ? 'alert-info' : null);
            var ERROR_MSG = "Error while trying to sign you in. Please make sure your Olark credentials are correct.";
            var SUCCESS_MSG = "Olark account successfully added!";

            var olarkNamePlaceholder = this.placeholders.olarkName + (this.state.olarkNameMissing ? ' *' : '');
            var olarkPasswordPlaceholder = this.placeholders.olarkPassword + (this.state.olarkPasswordMissing ? ' *' : '');

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
                React.DOM.div({className: 'row olark-form-title'},
                    React.DOM.div({className: 'col-md-24 text-center roboto-slab'},
                        renewIdentityId ? 'Renew Your Olark Identity' : 'Sign In With Olark!'
                    )
                ),
                React.DOM.div({className: 'col-xs-offset-2 col-xs-20'},
                    !renewIdentityId && React.DOM.div({className: 'form-group'},
                        React.DOM.label({className: 'col-sm-6 olark-form-label', htmlFor: 'olarkName'}, 'Olark ID'.replace(" ", "\u00a0")),
                        React.DOM.div({className: 'col-sm-18'},
                            React.DOM.input({valueLink: this.linkState('olarkName'), id: 'olarkName', type: 'text', className: classNames('form-control input-lg', {'attention': this.olarkNameNeedsAttention()}), placeholder: olarkNamePlaceholder})
                        )
                    ),
                    React.DOM.div({className: 'form-group'},
                        React.DOM.label({className: 'col-sm-6 olark-form-label', htmlFor: 'olarkPassword'}, 'Password'),
                        React.DOM.div({className: 'col-sm-18'},
                            React.DOM.input({valueLink: this.linkState('olarkPassword'), id: 'olarkPassword', type: 'password', className: classNames('form-control input-lg', {'attention': this.passwordNeedsAttention()}), placeholder: olarkPasswordPlaceholder})
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
}
