/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="../jquery.d.ts" />
/// <reference path="RoomSelectorSecretIRCRoom" />

module ui {

    interface RoomSelectorProps extends RoomsListContainerProps {
    }

    interface RoomSelectorState {
        filterText?: string;
        hasFocus?: boolean;
    }

    export class RoomSelector extends React.Component<RoomSelectorProps, RoomSelectorState> {
        state: RoomSelectorState = {
            filterText: '',
            hasFocus: false
        }
        private onFilterTextChangedThrottled = _.throttle((text: string) => {
            ui.App.actions.refreshRooms(text);
        }, 500);
        private onFilterTextChangedDebounced = _.debounce(() => {
            this.onFilterTextChangedThrottled(this.state.filterText);
        }, 100);
        componentDidMount() {
            if (ui.App.roomsSearchStore.restSearchTerm) { // we need to reinitialize room search
                _.defer(() => ui.App.actions.resetRoomsSearch());
            }
            $(document).on('click', this.onDocumentClick);
        }
        componentWillUnmount() {
            $(document).off('click', this.onDocumentClick);
        }
        onDocumentClick = (e: JQueryEventObject) => {
            // we are going to use this instead of onBlur since user can click inside room list
            if (this.state.hasFocus) {
                var clickedOutside = $(e.target).closest(ReactDOM.findDOMNode(this)).length === 0;
                if (clickedOutside) {
                    this.setState({hasFocus: false});
                }
            }
        }
        filterTextOnChange = (e: React.SyntheticEvent) => {
            var str = (e.target as HTMLInputElement).value;
            this.setState({filterText: str});
            if (!ui.App.roomsSearchStore.hasPendingRequest) {
                this.onFilterTextChangedThrottled(str);
            } else {
                this.onFilterTextChangedDebounced();
            }
        }
        render() {
            var filterText = this.state.filterText;
            var hasFocus = this.state.hasFocus;

            // console.count('render');
            var roomSelector = React.DOM.div({className: 'room-selector text-left'},
                React.DOM.div({className: 'input-group no-border room-selector-filter'},
                    React.DOM.input({onFocus: () => {this.setState({hasFocus: true});
                    }, type: "text", className: "form-control input-lg", placeholder: "Type name of room/channel/flow", onChange: this.filterTextOnChange}),
                    React.DOM.span({
                            className: "btn input-group-addon no-color input-lg no-border",
                            onClick: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                this.setState({hasFocus: !hasFocus});
                            }
                        },
                        React.DOM.span({className: "fa fa-caret-down"})
                    )
                ),
                React.DOM.div({className: 'rooms-list-dropdown'},
                    (hasFocus) ? React.DOM.div({
                            className: 'panel no-border',
                            style: {paddingTop: 4, paddingBottom: 4}
                        },
                        React.DOM.div({className: 'list-group'},
                            ui.DOM.RefreshRooms({filterText: filterText}),
                            ui.DOM.RoomsListContainer({
                                bannedRoom: this.props.bannedRoom,
                                onRoomSelected: this.props.onRoomSelected,
                            })
                        )
                    ) : null
                )
            );
            return React.DOM.div({},
                roomSelector,
                ui.DOM.RoomSelectorSecretIRCRoomContainer({
                    onRoomSelected: this.props.onRoomSelected
                })
            )
        }
    }

    export class RefreshRooms extends FluxContainer<{filterText: string}> {
        stores = {
            rest: ui.App.rest
        }
        getState = () => ({
            isPending: !_.isEmpty(this.stores.rest.pendingRequests),
        })
        public state = this.getState();
        public render() {
            return React.DOM.a({
                    className: 'list-group-item',
                    style: { paddingTop: 4, paddingBottom: 10 },
                    onClick: () => ui.App.actions.refreshRooms(this.props.filterText),
                },
                React.DOM.div({ className: 'provider-icon' + (this.state.isPending ? ' fa-spin' : '') },
                    ListIcon('refresh-icon')
                ),
                React.DOM.div({
                        className: 'room-description',
                        style: { marginTop: 3 }
                    },
                    "Refresh list of available channels/rooms/flows"
                )
            )
        }
    }

    ////////

    interface RoomsListContainerProps {
        onRoomSelected: (room: core.AnyRoom) => void;
        bannedRoom?: core.RoomData;
    }

    export class RoomsListContainer extends FluxContainer<RoomsListContainerProps> {
        stores = {
            rooms: ui.App.roomsSearchStore,
            identities: ui.App.identitiesStore,
        }
        getState = () => ({
            rooms: this.stores.rooms.rooms,
            identities: this.stores.identities.identities,
        })
        state = this.getState();
        render() {
            var rooms = this.state.rooms;
            var bannedRoom = this.props.bannedRoom;
            if (bannedRoom) {
                rooms = ui.App.roomsSearchStore.roomsWithoutConflicting(rooms, bannedRoom);
            }
            return ui.DOM.RoomsList({
                rooms: rooms,
                identities: this.state.identities,
                onRoomSelected: this.props.onRoomSelected,
            })
        }
    }

    ////////////////

    interface RoomsListProps {
        onRoomSelected: (room: core.AnyRoom) => void;
        rooms: core.Room[];
        identities: core.Identities;
    }
    var matchMedia = window.matchMedia || window.msMatchMedia
    if (matchMedia) {
        var smMedia = matchMedia("(min-width: 768px)")
    }

    export class RoomsList extends PureComponent<RoomsListProps> {
        private xsHeight = 45 + 24;
        private smHeight = 45;
        private itemsCount = 5;
        state = {
            scrollTop: 0,
            smMin: smMedia ? smMedia.matches : true,
        }
        onScroll = () => {
            var $this = $(ReactDOM.findDOMNode(this));
            this.setState({scrollTop: $this.scrollTop()});
        };
        private onMediaChange = () => {
            this.setState({
                smMin: smMedia.matches
            })
        }
        componentDidMount() {
            var $this = $(ReactDOM.findDOMNode(this));
            $this.on('scroll', this.onScroll)
            if (smMedia) {
                smMedia.addListener(this.onMediaChange)
            }
        }
        componentWillUnmount() {
            var $this = $(ReactDOM.findDOMNode(this));
            $this.off('scroll', this.onScroll)
            if (smMedia) {
                smMedia.removeListener(this.onMediaChange)
            }
        }
        render() {
            var rooms = this.props.rooms;
            var identities = this.props.identities;
            var height = this.state.smMin ? this.smHeight : this.xsHeight;
            var style = {
                height: height,
            };
            var n = Math.floor(this.state.scrollTop/(height -1 )); // 1px for margins?
            return React.DOM.div({className: 'rooms-list scrolled'},
                _.map(rooms, (room, i) => {
                    var item: React.ReactElement<RoomsListItemProps> = null;
                    var roomRef = core.RoomToRef(room);
                    var key = core.RefToString(roomRef);
                    if ((i >= n) && (i <= n + this.itemsCount)) {
                        var accountName = identities[room.viaId] && identities[room.viaId].common_name;
                        item = ui.DOM.RoomsListItem({
                            room: room,
                            onRoomSelected: this.props.onRoomSelected,
                            accountName: accountName,
                        })
                    }
                    return React.DOM.a({
                            key: key,
                            className: 'list-group-item',
                            style: style,
                            onClick: () => {
                                this.props.onRoomSelected(new core.RegularRoom(room));
                            },
                        },
                        item
                    )

                })
            );
        }
    }

    interface RoomsListItemProps {
        room: core.Room;
        accountName: string;
        onRoomSelected: (room: core.AnyRoom) => void;
    }

    export class RoomsListItem extends PureComponent<RoomsListItemProps> {
        render() {
            var room = this.props.room;
            return React.DOM.div({},
                React.DOM.div({className: 'provider-icon'},
                    ProviderIcon(room.data.provider)
                ),
                React.DOM.div({className: 'room-description row'},
                    React.DOM.div({className: 'col-sm-6'},
                        React.DOM.h4({title: room.data.name}, room.data.name)
                    ),
                    React.DOM.div({className: 'col-sm-6 team-account'},
                        room.data.unit_name && React.DOM.span({},
                            "Team: ", room.data.unit_name,
                            React.DOM.br()
                        ),
                        React.DOM.span({title: this.props.accountName},
                            "Account: ", this.props.accountName
                        )
                    )
                )
            );
        }
    }

    /////////

    var ListIconWidth = 22;

    var ListIcon = (image: string) => {
        return React.DOM.img({
            src: CDNify('/img/' + encodeURIComponent(image) + '.png'),
            style: {width: ListIconWidth}}
        );
    }

    var ProviderIcon = (providerId: string) =>
        ui.DOM.ProviderLogo({
            providerId: providerId,
            isBw: false,
            style: {width: ListIconWidth}
        })

    export module DOM {
        export var RoomSelector = React.createFactory(ui.RoomSelector);
        export var RoomsListContainer = React.createFactory(ui.RoomsListContainer);
        export var RoomsList = React.createFactory(ui.RoomsList);
        export var RoomsListItem = React.createFactory(ui.RoomsListItem);
        export var RefreshRooms = React.createFactory(ui.RefreshRooms);
    }
}
