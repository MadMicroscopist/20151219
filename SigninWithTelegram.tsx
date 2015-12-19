/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {

    export interface SigninWithTelegramContainerProps {
        renewIdentityId?: string;
        back: () => void;
    }

    export class SigninWithTelegramContainer extends FluxContainer<SigninWithTelegramContainerProps> {
        componentDidMount() {
            _.defer(() => {
                ui.App.actions.resetTelegramAuth();
            })
        }
        public stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
        };
        public getState = () => ({
            status: this.stores.signinWithProviderStore.status,
            telegramAuthCode: this.stores.signinWithProviderStore.telegramAuthCode,
            telegramError: this.stores.signinWithProviderStore.telegramError,
        });
        public state = this.getState();
        public render () {
            return ui.DOM.SigninWithTelegram({
                renewIdentityId: this.props.renewIdentityId,
                back: this.props.back,
                status: this.state.status,
                telegramAuthCode: this.state.telegramAuthCode,
                telegramError: this.state.telegramError,
            });
        }
    }

    export interface SigninWithTelegramProps extends SigninWithTelegramContainerProps {
        status: core.SigninWithProviderStatus;
        telegramAuthCode: string;
        telegramError: core.TelegramError;
    }

    export class SigninWithTelegram extends PureComponent<SigninWithTelegramProps> {
        public state = {};

        private needsPassword() {
            var e = core.TelegramError;
            var error = this.props.telegramError;
            return (error == e.NeedsPassword) || (error == e.WrongPassword);
        }

        public render() {
            var status = this.props.status;
            var error = this.props.telegramError;
            var renewIdentityId = this.props.renewIdentityId;
            var code0 = this.props.telegramAuthCode;
            var onCancel = this.props.back;
            var needsPassword = this.needsPassword();

            var s = core.SigninWithProviderStatus;
            var processing = status === s.Processing;
            var e = core.TelegramError;
            var alertClass = (status === s.Fail) && (error != e.NeedsPassword) ? 'alert-danger' : null;
            var page = code0 ? needsPassword ? 'enter_password' : 'enter_code' : 'enter_phone';

            return React.DOM.div({
                    className: 'auth-modal form-inline',
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
                        renewIdentityId ? 'Renew Your Telegram Identity' : 'Sign In With Telegram!'
                    )
                ),
                React.DOM.div({className: 'description'},
                    page == 'enter_phone' && "Please enter your Telegram phone number, with country code. (1 for US).",
                    page == 'enter_code' && "We have sent you a code via SMS. Please enter it below.",
                    page == 'enter_password' && "Please enter your Telegram password."
                ),

                React.DOM.div({style: {marginTop: 30}}),

                page == 'enter_phone' && ui.DOM.SigninWithTelegramForm({
                    placeholder: "Telegram Phone Number",
                    preSubmit: (telegramPhone) => {
                        telegramPhone = telegramPhone.replace(/[\(\)-\s]/g, '');
                        if (telegramPhone.length == 10) {
                            // let's assume that this number is from US
                            telegramPhone = "1 " + telegramPhone;
                        }
                        return telegramPhone;
                    },
                    onSubmit: (telegramPhone) => {
                        ui.App.actions.getTelegramAuth(telegramPhone);
                    }
                }),
                page == 'enter_code' && ui.DOM.SigninWithTelegramForm({
                    placeholder: "Enter your Code",
                    onSubmit: (code1) => {
                        ui.App.actions.createTelegramIdentity(code0, code1, renewIdentityId);
                    }
                }),
                page == 'enter_password' && ui.DOM.SigninWithTelegramForm({
                    type: "password",
                    placeholder: "Enter your Password",
                    onSubmit: (telegramPassword) => {
                        ui.App.actions.createTelegramIdentityPassword(code0, telegramPassword, renewIdentityId);
                    }
                }),

                alertClass && React.DOM.div({className: ''},
                    React.DOM.div({style: {marginTop: 30}}),
                    React.DOM.div({className: 'alert ' + alertClass},
                        error == e.WrongNumber && "Incorrect phone number, please make sure you write phone number in following format: 11 digits including country code. For example 14150005555 (1 is country code for US).",
                        error == e.NotRegistered && "This phone number doesn't have Telegram account associated with it.",
                        error == e.WrongCode && "Confirmation code you entered is incorrect. Please try again.",
                        error == e.WrongCodeFormat && "Confirmation code you entered has incorrect format. Use numbers only.",
                        error == e.WrongPassword && "Password you entered is incorrect.",
                        error == e.WrongSession && "Internal server error. Please try again.",
                        error == e.ServerError && "Error while trying to sign you in. Please contact us if this issue is not resolved."
                    )
                )
            );
        }
    }

    export interface SigninWithTelegramFormProps {
        placeholder: string;
        preSubmit?: (x: string) => string;
        onSubmit: (x: string) => void;
        type?: string;
    }

    export class SigninWithTelegramForm extends FluxContainer<SigninWithTelegramFormProps> {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);
        public state = {
            text: ''
        }
        public render () {
            return React.DOM.form({
                    onSubmit: (e) => {
                        e.preventDefault();
                        var text = this.state.text;
                        if (this.props.preSubmit) {
                            text = this.props.preSubmit(text);
                            this.setState({text: text})
                        }
                        if (text) {
                            this.props.onSubmit(text);
                        }
                    }
                },
                ui.DOM.FullWidthInputWithSumbit({},
                    React.DOM.input({valueLink: this.linkState('text'), placeholder: this.props.placeholder, type: this.props.type})
                )
            )
        }
    }


    export module DOM {
        export var SigninWithTelegramContainer = React.createFactory(ui.SigninWithTelegramContainer);
        export var SigninWithTelegram = React.createFactory(ui.SigninWithTelegram);
        export var SigninWithTelegramForm = React.createFactory(ui.SigninWithTelegramForm);
    }
}
