module ui {

    interface RoomSelectorSecretIRCRoomContainerProps {
        onRoomSelected: (room: core.AnyRoom) => void;
    }

    export class RoomSelectorSecretIRCRoomContainer extends FluxContainer<RoomSelectorSecretIRCRoomContainerProps> {
        public stores = {
            identitiesStore: ui.App.identitiesStore,
        }
        public getState = () => ({
            identities: this.stores.identitiesStore.identities,
        })
        public state = this.getState()
        public render() {
            var hasIRC = _.filter(this.state.identities, (i) => i.provider === 'irc');
            if (hasIRC.length !== 1) {
                // no or multiple irc accounts
                return React.DOM.noscript();
            }
            return React.DOM.div({},
                ui.DOM.RoomSelectorSecretIRCRoom({
                    onRoomSelected: this.props.onRoomSelected,
                    identity: hasIRC[0],
                })
            );
        }
    }

    interface RoomSelectorSecretIRCRoomProps extends RoomSelectorSecretIRCRoomContainerProps {
        identity: core.IdentityData;
    }

    interface RoomSelectorSecretIRCRoomState {
        showModal: boolean;
    }

    export class RoomSelectorSecretIRCRoom extends PureRender<RoomSelectorSecretIRCRoomProps, RoomSelectorSecretIRCRoomState> {
        public state = {
            showModal: false,
        }
        private closeModal = () => {
            this.setState({showModal: false})
        };
        public render() {
            return React.DOM.div({},
                "Don't see your +s (secret) IRC channel? ",
                React.DOM.a({
                        href: '#',
                        className: "white-link",
                        onClick: (e) => {
                            e.preventDefault();
                            this.setState({showModal: !this.state.showModal})
                        }
                    },
                    "Click here"
                ),
                ".",
                this.state.showModal && ui.DOM.SameroomModal({
                        id: 'room-selector-secret-irc-channel',
                        className: '',
                        hasCancelButton: true,
                        handleClose: this.closeModal,
                        handleHide: this.closeModal,
                        isShown: true,
                    },
                    React.DOM.div({className: 'full-screen-modal'},
                        React.DOM.div({},
                            React.DOM.div({className: 'hidden-xs', style: {marginTop: 130}}),
                            React.DOM.div({className: 'title-row text-center roboto-slab'},
                                "Enter Channel Name"
                            )
                        ),
                        React.DOM.div({style: {marginTop: 20}}),
                        React.DOM.div({className: 'row warning-row'},
                            React.DOM.div({className: 'col-xs-offset-1 col-xs-22 text-left'},
                                "Make sure to include the leading #."
                            )
                        ),
                        React.DOM.div({style: {marginTop: 40}}),

                        React.DOM.form({
                                className: 'text-center auth-modal form-inline',
                                onSubmit: (e) => {
                                    e.preventDefault();
                                    var input = ReactDOM.findDOMNode(this.refs['ircChannelName']);
                                    if (input instanceof HTMLInputElement && input.value) {
                                        this.props.onRoomSelected(new core.UnlistedRoom({
                                            name: input.value,
                                            via: this.props.identity,
                                        }));
                                        this.closeModal();
                                    }
                                }
                            },
                            ui.DOM.FullWidthInputWithSumbit({},
                                React.DOM.input({ref: 'ircChannelName', type: 'text', className: 'form-control input-lg', style: {borderRadius: '6px'}, placeholder: 'IRC Channel'})
                            )
                        )
                    )
                )
            )
        }
    }

    export module DOM {
        export var RoomSelectorSecretIRCRoomContainer = React.createFactory(ui.RoomSelectorSecretIRCRoomContainer);
        export var RoomSelectorSecretIRCRoom = React.createFactory(ui.RoomSelectorSecretIRCRoom);
    }
}
