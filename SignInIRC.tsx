/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {

    export interface SignInIRCContainerProps {
        renewIdentityId?: string;
        back: () => void;
    }

    export class SignInIRCContainer extends FluxContainer<SignInIRCContainerProps> {
        stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
        }
        getState = () => ({
            status: this.stores.signinWithProviderStore.status,
        })
        public state = this.getState();
        public render() {
            return <ui.SignInIRC {...this.props} {...this.state}/>
        }
    }

    ////

    export interface SignInIRCProps extends SignInIRCContainerProps {
        status: core.SigninWithProviderStatus;
    }

    export class SignInIRC extends PureComponent<SignInIRCProps> {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);

        private isUsernameOK = () =>
            this.state.ircUsername && !!this.state.ircUsername.length;
        private nicknameNeedsAttention = () =>
            this.state.nicknameMissing && !this.isUsernameOK();

        private isPasswordOK = () =>
            this.state.nickServPassword && !!this.state.nickServPassword.length;
        private nickServPasswordNeedsAttention = () =>
            this.state.nickServPasswordMissing && !this.isPasswordOK();

        private isHostOK = () =>
            core.IsHostnameOrIP(this.state.ircHostname);
        private hostNeedsAttention = () =>
            this.state.hostnameMissing && !this.isHostOK();

        private isPortOK = () =>
            this.state.ircPort && !isNaN(Number(this.state.ircPort));
        private portNeedsAttention = () =>
            this.state.portMissing && !this.isPortOK();

        private placeholders = {
            nickname: 'Enter your IRC nickname',
            nickServPassword: 'Enter your NickServ password',
            host: 'Enter IRC hostname',
            port: 'Enter IRC port',
        }

        public state = {
            status: App.signinWithProviderStore.status,
            ircUsername: '',
            nickServPassword: '',
            ircHostname: 'irc.freenode.net',
            ircPort: '6667',
            ircSSL: false,
            //
            nicknameMissing: false,
            nickServPasswordMissing: false,
            hostnameMissing: false,
            portMissing: false,
        }

        public componentWillReceiveProps = (newProps: SignInIRCProps) => {
            var s = core.SigninWithProviderStatus;
            if (newProps.status === s.Fail) {
                this.setState({
                    nickServPassword: null
                });
            }
        }
        private onSSLChanged = () => {
            if (this.state.ircPort === '6667' && !this.state.ircSSL) {
                this.setState({
                    ircPort: '7000'
                });
            }
            else if (this.state.ircPort === '7000' && this.state.ircSSL) {
                this.setState({
                    ircPort: '6667'
                });
            }
        }
        onSubmit = (e: React.SyntheticEvent) => {
            e.preventDefault();

            var renewIdentityId = this.props.renewIdentityId;
            var nickname = this.state.ircUsername;
            var nickServPassword = this.state.nickServPassword;
            var host = this.state.ircHostname;
            var port = this.state.ircPort;
            var ssl = this.state.ircSSL;

            var validInput = false;
            if (renewIdentityId) {
                validInput = this.isPasswordOK();
                if (validInput) {
                    ui.App.actions.renewIRCIdentity(nickServPassword, renewIdentityId);
                }
            } else {
                validInput = this.isUsernameOK() && this.isPasswordOK() && this.isHostOK() && this.isPortOK()
                if (validInput) {
                    ui.App.actions.createIRCIdentity(ssl, host, port, nickname, nickServPassword);
                }
            }
            if (!validInput) {
                this.setState({
                    nicknameMissing: !this.isUsernameOK(),
                    nickServPasswordMissing: !this.isPasswordOK(),
                    hostnameMissing: !this.isHostOK(),
                    portMissing: !this.isPortOK(),
                });
            }
        }

        public render () {
            var renewIdentityId = this.props.renewIdentityId;
            var status = this.props.status;
            var onCancel = this.props.back;
            var s = core.SigninWithProviderStatus;
            var processing = status === s.Processing;
            var alertClass = status === s.Fail ? 'alert-danger' : (status === s.Success ? 'alert-info' : null);
            var ERROR_MSG = "Error while trying to sign you in. Please make sure your IRC credentials are correct.";
            var SUCCESS_MSG = "IRC account successfully added!";

            var nicknamePlaceholder = this.placeholders.nickname + (this.state.nicknameMissing ? ' *' : '');
            var nickServPasswordPlaceholder = this.placeholders.nickServPassword + (this.state.nickServPasswordMissing ? ' *' : '');
            var hostPlaceholder = this.placeholders.host + (this.state.hostnameMissing ? ' *' : '');
            var portPlaceholder = this.placeholders.port + (this.state.portMissing ? ' *' : '');

            return <form
                className="auth-modal form-horizontal"
                onSubmit={this.onSubmit}
            >
                {processing && <ui.GlobalSpinner
                    hasCancelButton={true}
                    handleHide={() => {
                        if (ui.App.signinWithProviderStore.status === s.Processing) {
                            onCancel(); // user hit Esc
                        }
                    }}
                    onCancel={onCancel}
                />/**/}
                <div className="row irc-form-title hidden-xs">
                    <div className="col-md-24 text-center roboto-slab">
                        {renewIdentityId ? 'Renew Your IRC Identity' : 'Sign In With IRC!'}
                    </div>
                </div>
                <div className="col-xs-offset-2 col-xs-20">
                    {!renewIdentityId && <div className="form-group">
                        <label className="col-sm-6 irc-form-label" htmlFor="ircUsername">Nickname</label>
                        <div className="col-sm-18">
                            <input valueLink={this.linkState('ircUsername')} id="ircUsername" type="text" className={'form-control input-lg' + (this.nicknameNeedsAttention() ? ' attention' : '')} placeholder={nicknamePlaceholder} />
                        </div>
                    </div>}
                    <div className="form-group">
                        <label className="col-sm-6 irc-form-label" htmlFor="nickServPassword">Password</label>
                        <div className="col-sm-18">
                            <input valueLink={this.linkState('nickServPassword')} id="nickServPassword" type="password" className={'form-control input-lg' + (this.nickServPasswordNeedsAttention() ? ' attention' : '')} placeholder={nickServPasswordPlaceholder} />
                        </div>
                    </div>
                    {!renewIdentityId && <div className="form-group">
                        <label className="col-sm-6 irc-form-label" htmlFor="ircHostname">Host</label>
                        <div className="col-sm-18">
                            <input valueLink={this.linkState('ircHostname')} id="ircHostname" type="text" className={'form-control input-lg' + (this.hostNeedsAttention() ? ' attention' : '')} placeholder={hostPlaceholder} />
                        </div>
                    </div>}
                    {!renewIdentityId && <div className="form-group">
                        <label className="col-sm-6 irc-form-label" htmlFor="ircPort">Port</label>
                        <div className="col-sm-18">
                            <input valueLink={this.linkState('ircPort')} id="ircPort"  type="text" className={'form-control input-lg' + (this.portNeedsAttention() ? ' attention' : '')} placeholder={portPlaceholder} />
                        </div>
                    </div>}
                    {!renewIdentityId && <div className="checkbox col-sm-offset-6">
                        <label style={{marginLeft: '7px'}}>
                            <input checkedLink={this.linkState('ircSSL')} type="checkbox" onClick={this.onSSLChanged}/>
                            SSL
                        </label>
                    </div>}
                    <div style={{marginTop: renewIdentityId ? 46 : -1}} ></div>
                    <ui.SecurityInfo
                        style={{
                            position: "absolute",
                            right: 15,
                            marginTop: -41,
                        }} />
                    <div className="clearfix"/>
                    <div className="text-right" style={{marginTop: 10}} >
                        <input type="submit" className="btn btn-bold-yellow btn-no-border btn-lg" value={renewIdentityId ? 'Submit' : 'Sign In'} />
                    </div>
                    {alertClass && <div className={'alert ' + alertClass}>
                        {status === s.Fail ? ERROR_MSG : SUCCESS_MSG}
                    </div>}
                </div>
            </form>;
        }
    };

    export module DOM {
        export var SignInIRCContainer = React.createFactory(ui.SignInIRCContainer);
        export var SignInIRC = React.createFactory(ui.SignInIRC);
    }
}
