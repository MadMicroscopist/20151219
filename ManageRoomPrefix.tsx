module ui {

    export class ManageRoomPrefixContainer extends FluxSimpleContainer {
        public stores = {
            roomConfigStore: ui.App.roomConfigStore,
            router: ui.App.router,
            bridgesStore: ui.App.bridgesStore,
            factoriesStore: ui.App.factoriesStore,
        };
        public getState = () => ({
            status: this.stores.roomConfigStore.status,
            putStatus: this.stores.roomConfigStore.putStatus,
            needsSave: this.stores.roomConfigStore.needsSave,
            config: this.stores.roomConfigStore.config,
            roomId: this.stores.router.params['room-id'],
            bridges: this.stores.bridgesStore.bridges,
            factories: this.stores.factoriesStore.factories,
        });
        public state = this.getState();
        public render() {return <ui.ManageRoomPrefix {...this.state} />}
    }

    export interface ManageRoomPrefixProps {
        status: core.RestRequestStatus;
        putStatus: core.RestRequestStatus;
        needsSave: boolean;
        config: core.PrefixConfig;
        roomId: string;
        bridges: core.Bridge[];
        factories: core.Factory[];
    }

    export class ManageRoomPrefix extends PureComponent<ManageRoomPrefixProps> {
        public render () {
            var status = this.props.status;
            var putStatus = this.props.putStatus;
            var needsSave = this.props.needsSave;
            var config = this.props.config;

            var s = core.RestRequestStatus;
            var processing = status === s.Processing;
            var error = status === s.Fail;
            var putError = putStatus === s.Fail;

            var r = core.RoomConfigPrefixOption;

            var roomId = this.props.roomId;
            var room: core.RegularRoom = null;
            _.each(this.props.bridges, (bridge) => {
                let {data: {
                    a_room: aRoom,
                    a_via: {id: aVia},
                    b_room: bRoom,
                    b_via: {id: bVia},
                }} = bridge;
                if (roomId == aRoom.id) {
                    room = new core.RegularRoom({viaId: aVia, data: aRoom});
                }
                else if (roomId == bRoom.id) {
                    room = new core.RegularRoom({viaId: bVia, data: bRoom});
                }
            });
            if (!room) {
                _.each(this.props.factories, (factory) => {
                    let {data: {
                        room: fRoom,
                        via: {id: fVia},
                    }} = factory;
                    if (roomId == fRoom.id) {
                        room = new core.RegularRoom({viaId: fVia, data: fRoom});
                    }
                });
            }

            var unitNameExample = config.unit == r.UnitNameShow ? ", Microsoft" : "";
            let nameDisplayName = "Alice Martinez";
            let nameDisplayUsername = "amartinez";
            let nameDisplayNameUsername = "Alice Martinez (amartinez)";
            var nameExample = config.display == r.DisplayNameUsername ? nameDisplayNameUsername : config.display == r.DisplayUsername ? nameDisplayUsername : nameDisplayName;

            let title = <div className="col-sm-20 col-sm-offset-2">
                Posting options for {(room && core.FormatAnyRoomDescription(room))}
            </div>;

            let roomProvider = room && room.data.data && room.data.data.provider;
            let publicRoomWarning = <span/>;
            if (roomProvider == "irc" || roomProvider == "gitter") {
                publicRoomWarning = <span>
                    &nbsp;
                    <small>
                        <b style={{color: "#F8E71C"}}>Warning: Do not choose ”Yes” for public IRC or Gitter channels</b>
                    </small>
                </span>
            }

            let elements = <div className="modal-dialog manage-room-prefix">
                {processing && <ui.GlobalSpinner />}
                Will you be the only one posting messages to this room?
                <form role="form" className="awesome-checkbox">
                    <OptionItem value={r.PrefixNo} selected={config.prefix}>
                        Yes—post all messages as me
                    </OptionItem>
                    <OptionItem value={r.PrefixYes} selected={config.prefix}>
                        No—add prefix to show the author
                    </OptionItem>
                </form>
                <br />

                {config.prefix == r.PrefixYes && <div>
                    Post with username, display name, or both?
                    <form role="form" className="awesome-checkbox">
                        <OptionItem value={r.DisplayName} selected={config.display}>
                            <b>{"Display Name"}</b> e.g., {nameDisplayName}{unitNameExample}
                        </OptionItem>
                        <OptionItem value={r.DisplayUsername} selected={config.display}>
                            <b>{"Username"}</b> e.g., {nameDisplayUsername}{unitNameExample}
                        </OptionItem>
                        <OptionItem value={r.DisplayNameUsername} selected={config.display}>
                            <b>Display Name (Username)</b> e.g., {nameDisplayNameUsername}{unitNameExample}
                        </OptionItem>
                    </form>
                    <br />

                    Hide team name?
                    <form role="form" className="awesome-checkbox">
                        <OptionItem value={r.UnitNameShow} selected={config.unit}>
                            <b>No</b> e.g., {nameExample}, Microsoft
                        </OptionItem>
                        <OptionItem value={r.UnitNameHide} selected={config.unit}>
                            <b>Yes</b> e.g., {nameExample}
                        </OptionItem>
                    </form>
                    <br />
                </div>}

                Post system messages to this room?
                <form role="form" className="awesome-checkbox">
                    <OptionItem value={r.SystemAllow} selected={config.system}>
                        Yes
                        {publicRoomWarning}
                    </OptionItem>
                    <OptionItem value={r.SystemSuppress} selected={config.system}>
                        No
                    </OptionItem>
                    <br />
                </form>

                Relay options
                <form role="form" className="awesome-checkbox">
                    <OptionItem value={r.RelayAll} selected={config.relay}>
                        Relay messages <b>to</b> and <b>from</b> this room
                    </OptionItem>
                    <OptionItem value={r.RelayNotFrom} selected={config.relay}>
                        Do not relay messages <b>from</b> this room (see also: <a target="_blank" href="https://sameroom.io/blog/introducing-hush-command/">Hush Command</a>)
                    </OptionItem>
                    <OptionItem value={r.RelayNotTo} selected={config.relay}>
                        Do not relay messages <b>to</b> this room
                    </OptionItem>
                </form>

                {error && <div className="alert alert-danger">
                    Failed to get room config.
                </div>}

                {putError && <div className="alert alert-danger">
                    Failed to save room config.
                </div>}

                {(error || putError) && <div className="text-center">
                    <button
                        className="btn btn-bold-yellow btn-no-border btn-lg"
                        onClick={(e) => {
                            if (putError) {
                                ui.App.actions.saveRoomPrefix();
                            } else {
                                ui.App.actions.getRoomPrefix();
                            }
                    }}>
                        Try Again
                    </button>
                </div>}
            </div>;

            var back = () => {
                if (ui.App.router.page == "manage.prefix") {
                    ui.App.router.navigateTo("/manage", true);
                }
            };

            return <ui.SameroomModal
                hasCancelButton={true}
                cancelButtonCustomText="Close"
                handleClose={back}
                handleHide={back}
                isShown={true}
                noContent={true}
            >
                <div className="modal-dialog" style={{width: '100%'}}>
                    <ui.FullScreenModalBody
                        title={title}
                        titleCustomMargin={40}
                        elements={elements}
                    ></ui.FullScreenModalBody>
                </div>
                <div className="hidden-xs" style={{marginTop: 80}} />
            </ui.SameroomModal>;
        }
    }

    class OptionItem extends PureComponent<{value: core.RoomConfigPrefixOption, selected: core.RoomConfigPrefixOption, children?: React.ReactNode}> {
        public render () {
            var value = this.props.value;
            var selected = this.props.selected;
            var key = core.RoomConfigPrefixOption[value];
            var disabled = selected == core.RoomConfigPrefixOption.Undefined;
            var checked = selected == value;
            return <div className="radio">
                <input
                    type="radio"
                    id={key}
                    disabled={disabled}
                    checked={checked}
                    onChange={(e) => ui.App.actions.selectRoomPrefix(value)}
                />
                <label htmlFor={key}>
                    {this.props.children}
                </label>
            </div>
        }
    }
}
