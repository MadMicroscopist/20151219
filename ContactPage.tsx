/// <reference path="../core/Dispatcher.ts" />
/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />


module ui {

    export class ContactPageContainer extends FluxSimpleContainer {
        public stores = {
            contactPageStore: ui.App.contactPageStore,
        };
        public getState = () => ({
            email: this.stores.contactPageStore.email,
            name: this.stores.contactPageStore.name,
            message: this.stores.contactPageStore.message,
            submitting: this.stores.contactPageStore.submitting,
            error: this.stores.contactPageStore.error,
            success: this.stores.contactPageStore.success,
        });
        public state = this.getState();
        public render() {
            return ui.DOM.ContactPage({
                email: this.state.email,
                name: this.state.name,
                message: this.state.message,
                submitting: this.state.submitting,
                error: this.state.error,
                success: this.state.success,
            })
        }
    }

    export interface ContactPageProps {
        email: string;
        name: string;
        message: string;
        submitting: boolean;
        error: boolean;
        success: boolean;
    }

    export interface ContactPageState {
        emailMissing?: boolean;
        nameMissing?: boolean;
        messageMissing?: boolean;
    }

    export class ContactPage extends PureComponent<ContactPageProps> {
        private placeholders = {
            email: 'Email',
            name: 'Name',
            message: 'Message',
        };
        public componentDidMount() {
            _.defer(() => ui.App.actions.resetContactPage());
        }
        public state = {
            nameMissing: false,
            emailMissing: false,
            messageMissing: false,
        };
        private nameHandleChange (e: string) {
            ui.App.actions.updateContactPageForm({name: e})
        }
        private emailHandleChange (e: string) {
            ui.App.actions.updateContactPageForm({email: e})
        }
        private messageHandleChange (e: string) {
            ui.App.actions.updateContactPageForm({message: e})
        }
        public render() {
            var namePlaceholder = this.placeholders.name + (this.state.nameMissing ? ' *' : '');
            var emailPlaceholder = this.placeholders.email + (this.state.emailMissing ? ' *' : '');
            var messagePlaceholder = this.placeholders.message + (this.state.messageMissing ? ' *' : '');

            var nameValueLink = {
                value: this.props.name,
                requestChange: this.nameHandleChange,
            }
            var emailValueLink = {
                value: this.props.email,
                requestChange: this.emailHandleChange,
            }
            var messageValueLink = {
                value: this.props.message,
                requestChange: this.messageHandleChange,
            }

            if (this.props.success) {
                return React.DOM.div({},
                    ui.DOM.FantabulisticPageContainer({
                        type: FantabulisticPageType.ContactPage,
                    })
                );
            }

            return React.DOM.div({className: 'contact-page'},
                React.DOM.br(),
                React.DOM.div({className: 'container'},
                    React.DOM.div({className: 'row'},
                    DOM.CenteredColumnTemplate({className: 'text-center'},
                            React.DOM.div({className: 'hidden-xs', style: {marginTop: 40}}),
                            React.DOM.h1({className: 'roboto-slab'}, 'Contact')
                        )
                    ),
                    React.DOM.div({className: 'row'},
                        DOM.CenteredColumnTemplate({},
                            React.DOM.div({className: 'hidden-xs', style: {marginTop: 20}}),
                            React.DOM.div({className: 'text-left description'},
                                'Fastest way to get a response? We’re ',
                                React.DOM.a({href: 'http://twitter.com/sameroomHQ', target: '_blank'}, '@SameroomHQ'),
                                ', so ',
                                React.DOM.a({href: 'https://twitter.com/intent/tweet?screen_name=sameroomhq'}, 'send us a tweet!'),
                                React.DOM.span({}, ' Alternatively, you can fill in the form below and we’ll be get back to you over email.'),
                                this.props.error && React.DOM.div({},
                                    React.DOM.br(),
                                    React.DOM.span({className: 'inline-error'},
                                        'Oops! There’s a problem sending your message. Please try to resubmit it.'
                                    )
                                )
                            ),
                            React.DOM.div({className: 'hidden-xs', style: {marginTop: 30}}),
                            React.DOM.form({
                                    onSubmit: (e) => {
                                        e.preventDefault();

                                        var email = this.props.email;
                                        var name = this.props.name;
                                        var message = this.props.message;

                                        if (email.length && name.length && message.length) {
                                            App.actions.submitContactData({
                                                name: name,
                                                email: email,
                                                message: message
                                            });
                                        }
                                        var newState = {
                                            emailMissing: !email || !email.length,
                                            nameMissing: !name || !name.length,
                                            messageMissing: !message || !message.length,
                                        };
                                        this.setState(newState);
                                        if (newState.nameMissing) {
                                            var el = 'name';
                                        }
                                        else if (newState.emailMissing) {
                                            var el = 'email';
                                        }
                                        else {
                                            var el = 'message';
                                        }
                                        $(ReactDOM.findDOMNode(this.refs[el])).focus();
                                    }
                                },
                                React.DOM.div({className: 'form-group text-center'},
                                    React.DOM.input({ref: 'name', type: 'text', className: 'form-control' + (this.state.nameMissing ? ' missing' : ''), placeholder: namePlaceholder, valueLink: nameValueLink}),
                                    React.DOM.input({ref: 'email', type: 'text', className: 'form-control' + (this.state.emailMissing ? ' missing' : ''), placeholder: emailPlaceholder, valueLink: emailValueLink}),
                                    React.DOM.textarea({ref: 'message', type: 'text', className: 'form-control' + (this.state.messageMissing ? ' missing' : ''), placeholder: messagePlaceholder, rows: 8, valueLink: messageValueLink}),
                                    React.DOM.br(),
                                    React.DOM.button({className: 'btn btn-bold-yellow btn-no-border btn-lg'},
                                        this.props.error ? 'Try Again' : 'Submit'),
                                    this.props.submitting ? ui.DOM.GlobalSpinner({}) : null
                                )
                            )
                        )
                    ),
                    React.DOM.div({className: 'hidden-xs', style: {marginBottom: 200}})
                )
            );
        }
    }

    export module DOM {
        export var ContactPageContainer = React.createFactory(ui.ContactPageContainer);
        export var ContactPage = React.createFactory(ui.ContactPage);
    }
}
