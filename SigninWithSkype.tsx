/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {

    export interface SigninWithSkypeContainerProps {
        renewIdentityId?: string;
        back: () => void;
    }

    export class SigninWithSkypeContainer extends FluxContainer<SigninWithSkypeContainerProps> {
        public stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
        };
        public getState = () => ({
            status: this.stores.signinWithProviderStore.status,
        });
        public state = this.getState();
        public render () {
            return <ui.SigninWithSkype
                renewIdentityId={this.props.renewIdentityId}
                back={this.props.back}
                status={this.state.status}
            />;
        }
    }

    export interface SigninWithSkypeProps extends SigninWithSkypeContainerProps {
        status: core.SigninWithProviderStatus;
    }

    export class SigninWithSkype extends PureComponent<SigninWithSkypeProps> {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);

        private skypeNameOk = () =>
            !!this.state.skypeName.length;
        private skypeNameNeedsAttention = () =>
            this.state.skypeNameMissing && !this.skypeNameOk();

        private passwordOk = () =>
            !!this.state.skypePassword.length;
        private passwordNeedsAttention = () =>
            this.state.skypePasswordMissing && !this.passwordOk();

        private placeholders = {
            skypeName: 'Enter your Skype Name or Email',
            skypePassword: 'Enter your Skype Password',
        };

        public state = {
            skypeName: '',
            skypePassword: '',
            skypeNameMissing: false,
            skypePasswordMissing: false,
        };

        private onSubmit = () => {
            var validInput = this.passwordOk();
            if (this.props.renewIdentityId) {
                if (validInput) {
                    ui.App.actions.renewSkypeIdentity(this.state.skypePassword, this.props.renewIdentityId);
                }
            } else {
                validInput = validInput && this.skypeNameOk();
                if (validInput) {
                    ui.App.actions.createSkypeIdentity(this.state.skypeName.trim(), this.state.skypePassword);;
                }
            }
            this.setState({
                skypeNameMissing: !this.skypeNameOk(),
                skypePasswordMissing: !this.passwordOk(),
            });
        };

        public render() {
            var status = this.props.status;
            var renewIdentityId = this.props.renewIdentityId;
            var onCancel = this.props.back;

            var s = core.SigninWithProviderStatus
            var processing = status === s.Processing;
            var alertClass = status === s.Fail ? 'alert-danger' : (status === s.Success ? 'alert-info' : null);
            var ERROR_MSG = "Error while trying to sign you in. Please make sure your Skype credentials are correct.";
            var SUCCESS_MSG = "Skype account successfully added!";

            var skypeNamePlaceholder = this.placeholders.skypeName + (this.state.skypeNameMissing ? ' *' : '');
            var skypePasswordPlaceholder = this.placeholders.skypePassword + (this.state.skypePasswordMissing ? ' *' : '');

            return <form
                    className="auth-modal form-horizontal"
                    onSubmit= {(e) => {
                        e.preventDefault();
                        this.onSubmit();
                    }}
                >
                {processing && <ui.GlobalSpinner
                    hasCancelButton={true}
                    handleHide={ () => {
                        if (ui.App.signinWithProviderStore.status === s.Processing) {
                            onCancel(); // user hit Esc
                        }
                    }}
                    onCancel={onCancel}
                />}
                <div className="row skype-form-title">
                    <div className="col-md-24 text-center roboto-slab">
                        {renewIdentityId ? 'Renew Your Skype Identity' : 'Sign In With Skype!'}
                    </div>
                </div>
                <div className="col-xs-offset-2 col-xs-20">
                    {!renewIdentityId && <div className="form-group">
                        <label className="col-sm-6 skype-form-label" style={{marginTop: -3}} htmlFor="skypeName"> {'Skype Name or Email'.replace(" ", "\u00a0")}</label>
                        <div className="col-sm-18">
                            <input valueLink={this.linkState('skypeName')} id="skypeName" type="text" className={classNames('form-control input-lg', {'attention': this.skypeNameNeedsAttention()})} placeholder={skypeNamePlaceholder} />
                        </div>
                    </div>}
                    <div className="form-group">
                        <label className="col-sm-6 skype-form-label" htmlFor="skypePassword">{"Password"}</label>
                        <div className="col-sm-18">
                            <input valueLink={this.linkState('skypePassword')} id="skypePassword" type="password" className={classNames('form-control input-lg', {'attention': this.passwordNeedsAttention()})} placeholder={skypePasswordPlaceholder} />
                        </div>
                    </div>
                    <p className="small" style={{paddingTop: 17, paddingBottom: 5, textAlign: "left"}}>
                        Microsoft accounts: only hotmail.com and outlook.com email addresses are supported
                    </p>
                    <ui.SecurityInfo />
                    <div className="text-right">
                        <input type="submit" className="btn btn-bold-yellow btn-no-border btn-lg" value={renewIdentityId ? 'Submit' : 'Sign In'} />
                    </div>
                    {alertClass && <div className={'alert ' + alertClass}>
                        {status === s.Fail ? ERROR_MSG : SUCCESS_MSG}
                    </div>}
                </div>
            </form>;
        }
    }

    export module DOM {
        export var SigninWithSkypeContainer = React.createFactory(ui.SigninWithSkypeContainer);
        export var SigninWithSkype = React.createFactory(ui.SigninWithSkype);
    }
}
