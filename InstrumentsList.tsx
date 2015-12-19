/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="ZeroClipboard" />
/// <reference path="FluxContainer" />

module ui {

    export interface InstrumentsListProps {
        identities: core.Identities;
        bridges: core.Bridge[];
        factories: core.Factory[];
        onDelete: (props: FullScreenModalProps) => void;
    }

    interface SelfIdentity {
        (i: core.IdentityData): boolean;
    }

    interface SortableElement {
        created_ts: number;
        element: React.ReactNode;
    }

    export class InstrumentsList extends PureComponent<InstrumentsListProps> {
        render() {
            var identities = this.props.identities;
            var bridges = this.props.bridges;
            var factories = this.props.factories;

            var selfIdentity = (i: core.IdentityData) => identities.hasOwnProperty(i.id);

            var renderBridge = renderBridgePartial(selfIdentity, (props) => this.props.onDelete(props));
            var renderFactory = renderFactoryPartial(selfIdentity, (props) => this.props.onDelete(props));

            var factoriesAndBridges = (
                _.map(bridges, (bridge) => ({
                    created_ts: bridge.data.created_ts,
                    element: renderBridge(bridge)
                }))
                ).concat(
                _.map(factories, (factory) => ({
                    created_ts: factory.data.created_ts,
                    element: renderFactory(factory)
                }))
                )

            return React.DOM.div({className: 'container'},
                sortElements(factoriesAndBridges)
            );
        }
    }

    var sortElements = (elements: SortableElement[]) => {
        var elements = elements.sort((a, b) => b.created_ts - a.created_ts);
        return _.map(elements, (element) => element.element);
    }

    var renderBridgePartial = (selfIdentity: SelfIdentity, onDelete: (props: FullScreenModalProps) => void) =>
        (bridge: core.Bridge) => {
            var aMine = selfIdentity(bridge.data.a_via);
            var bMine = selfIdentity(bridge.data.b_via);
            var sponsor = bridge.data.b_sponsored ? bridge.data.b_via : bridge.data.a_via;
            var imSponsor = selfIdentity(sponsor);

            return React.DOM.div({
                key: bridge.data.id,
                className: 'row no-gutters instrument-row'
            },
            React.DOM.div({className: 'col-md-7 clearfix grid-24'},
                React.DOM.div({className: 'col-xs-11 white-filled'},
                    aMine && <ui.RoomConfigGear identityId={bridge.data.a_via.id} roomId={bridge.data.a_room.id} />,
                    RoomDescription(bridge.data.a_room, bridge.data.a_via, aMine)
                ),
                React.DOM.div({className: 'col-xs-2 tube-line'},
                    React.DOM.div({className: 'tube-line-bg'})
                ),
                React.DOM.div({className: 'col-xs-11 white-filled'},
                    bMine && <ui.RoomConfigGear identityId={bridge.data.b_via.id} roomId={bridge.data.b_room.id} />,
                    RoomDescription(bridge.data.b_room, bridge.data.b_via, bMine)
                )
            ),
            React.DOM.div({className: 'col-md-5 clearfix grid-24'},
                React.DOM.div({className: 'col-xs-5'},
                    React.DOM.div({className: 'information'},
                        React.DOM.h5({}, "Info"),
                        (bridge.data.a_via.failed || bridge.data.b_via.failed || bridge.data.paused) ?
                            "n/a" : ui.DOM.InstrumentsListBridgeMap({map: bridge.data.map})
                    )
                ),
                React.DOM.div({className: 'col-xs-5'},
                    React.DOM.div({className: 'information'},
                        React.DOM.h5({}, "State"),
                        BridgeState(bridge.data)
                    )
                ),
                React.DOM.div({className: 'col-xs-5'},
                    React.DOM.div({className: 'information'},
                        React.DOM.h5({}, "Rate"),
                        BridgeRateLimit(bridge.data, imSponsor)
                    )
                ),
                React.DOM.div({className: 'col-xs-7'},
                    React.DOM.div({className: 'information text-overflow-ellipsis'},
                        React.DOM.h5({}, "Who Pays"),
                        BridgeWhoPays(bridge.data, sponsor, imSponsor)
                    )
                ),
                React.DOM.div({className: 'col-xs-2 text-right'},
                    React.DOM.button({
                        className: 'close fa fa-times fa-2x',
                        onClick: () => {
                            onDelete({
                                title: 'Are You Sure?',
                                warning: 'Clicking Delete Tube, below, will sever this Tube. In doing so, you will no longer be able to communicate between “' + bridge.data.a_room.name + '“ on ' + core.ProviderDisplayName(bridge.data.a_room.provider) + ' and “' + bridge.data.b_room.name + '“ on ' + core.ProviderDisplayName(bridge.data.b_room.provider) + '.',
                                buttonText: 'Delete Tube',
                                onSure: () => { App.actions.deleteBridge(bridge.data.id)  }
                            });
                        }
                    })
                )
            )
        )}

    var renderFactoryPartial = (selfIdentity: SelfIdentity, onDelete: (props: FullScreenModalProps) => void) =>
        (factory: core.Factory) => React.DOM.div({
                key: factory.data.id,
                className: 'row no-gutters instrument-row'
            },
            React.DOM.div({className: 'col-md-7 clearfix grid-24'},
                React.DOM.div({className: 'col-xs-11 white-filled'},
                    React.DOM.div({className: 'portal-link'},
                        FactoryLink(factory.data)
                    )
                ),
                React.DOM.div({className: 'col-xs-2 white-fat-arrow'}),
                React.DOM.div({className: 'col-xs-11 not-filled'},
                    <ui.RoomConfigGear identityId={factory.data.via.id} roomId={factory.data.room.id} />,
                    RoomDescription(factory.data.room, factory.data.via, selfIdentity(factory.data.via))
                )
            ),
            React.DOM.div({className: 'col-md-5 clearfix grid-24'},
                React.DOM.div({className: 'col-xs-5'},
                    React.DOM.div({className: 'information'},
                        React.DOM.h5({}, "Info"),
                        ui.DOM.InstrumentsListBridgeMap({map: factory.data.map})
                    )
                ),
                React.DOM.div({className: 'col-xs-offset-10 col-xs-7'},
                    React.DOM.div({className: 'information'},
                        React.DOM.h5({}, "Who Pays"),
                        FactoryWhoPays(factory.data)
                    )
                ),
                React.DOM.div({className: 'col-xs-2 text-right'},
                    React.DOM.button({
                        className: 'close fa fa-times fa-2x',
                        onClick: () => {
                            onDelete({
                                title: 'Are You Sure?',
                                warning: 'Clicking Delete Portal, below, will terminate the Portal to “' + factory.data.room.name + '” on ' + core.ProviderDisplayName(factory.data.room.provider) + '. All existing Tubes created via this Portal will continue working until explicitly deleted.',
                                buttonText: 'Delete Portal',
                                onSure: () => { App.actions.deleteFactory(factory.data.id)  }
                            });
                        }
                    })
                )
            )
        )

    var RoomDescription = (roomData: core.RoomData, identityData: core.IdentityData, mine: boolean) => {
        return React.DOM.div({className: 'room-description-wrapper' + (mine ? '' : ' theirs' ) },
            React.DOM.span({className: 'provider-icon'},
                ProviderIcon(roomData.provider)
            ),
            React.DOM.div({className: 'room-description row'},
                React.DOM.div({className: ''},
                    React.DOM.h4({className: 'room-name', title: roomData.name},
                        roomData.name
                    )
                ),
                React.DOM.div({className: ' team-account'},
                    roomData.unit_name && React.DOM.span({},
                        "Team: ", roomData.unit_name,
                        React.DOM.br()
                    ),
                    "Account: ", identityData.common_name
                )
            )
        )
    }

    var ListIconWidth = 22;

    var ProviderIcon = (providerId: string) =>
        ui.DOM.ProviderLogo({
            providerId: providerId,
            isBw: false,
            style: {width: ListIconWidth}
        })

    export class InstrumentsListBridgeMap extends PureComponent<{map: string}> {
        public render() {
            return React.DOM.a({
                    href: '/maps/' + this.props.map,
                    target: '_blank'
                },
                "Map"
            )
        }
    }

    var BridgeState = (bridgeData: core.BridgeData) => {
        var identityFailed = bridgeData.a_via.failed || bridgeData.b_via.failed;
        var pausedReason = bridgeData.paused && bridgeData.paused.reason;
        var sendingDenied = pausedReason === "sending_denied";
        var hasFailed = identityFailed || sendingDenied;
        var wasArchived = pausedReason === "archived";
        var button = bridgeData.paused ? {text: sendingDenied ? 'Retry' : 'Play', value: false} : {text: 'Pause', value: true};

        var ab: core.IdentityData[] = [bridgeData.a_via, bridgeData.b_via];
        var brokenIdentity = _.find(ab, (i) => i.failed && _.include(["auth_error", "lost", "service_error"], i.failed.reason));
        var accountErrorHref = brokenIdentity ? "/accounts/#al-" + brokenIdentity.id : '';

        return React.DOM.div({className: classNames({'red-color': hasFailed})},
            hasFailed ? 'Failed' : wasArchived ? "Archived" : bridgeData.paused ? 'Paused' : 'Active',
            accountErrorHref && React.DOM.div({},
                    ui.DOM.NavLink({href: accountErrorHref}, "Fix")
            ),
            !identityFailed && React.DOM.div({},
                React.DOM.a({
                        href: '#',
                        onClick: (e) => {
                            e.preventDefault()
                            App.rest.putBridge(bridgeData.id, { is_paused: button.value });
                        }
                    },
                    button.text
                )
            )
        )
    }

    var BridgeRateLimit = (bridgeData: core.BridgeData, imSponsor: boolean) => {
        if (bridgeData.paused) {
            return React.DOM.div({}, 'n/a')
        }
        else if (bridgeData.limited) {
            return React.DOM.div({},
                React.DOM.div({className: 'red-color'}, 'Limited'),
                (imSponsor) ? (
                    ui.DOM.NavLink({href: '/plan'}, "Upgrade")
                ) : null
            );
        }
        else {
            return React.DOM.div({}, 'Unlimited')
        }
    }

    var BridgeWhoPays = (bridgeData: core.BridgeData, sponsor: core.IdentityData, imSponsor: boolean) => {
        if (imSponsor) {
            return React.DOM.div({}, 'You')
        }
        else {
            return React.DOM.div({className: 'who-pays'},
                React.DOM.div({title: sponsor.common_name}, sponsor.common_name),
                React.DOM.a({
                        href: '#',
                        onClick: (e) => {
                            e.preventDefault();
                            App.rest.putBridge(bridgeData.id, {
                                b_sponsored: !bridgeData.b_sponsored
                            });
                        }
                    },
                    "Pay for this Tube"
                )
            )
        }
    }

    var FactoryWhoPays = (factoryData: core.FactoryData) => {
        return React.DOM.div({},
            React.DOM.br(),
            React.DOM.div({className: ""},
                React.DOM.label({className: "switch"},
                    React.DOM.input({
                        type: "checkbox",
                        className: "switch-input",
                        // switch is "off" if it's sponsored by b (them)
                        checked: !factoryData.b_sponsored,
                        onChange: () => {
                            App.rest.putFactory(factoryData.id, {
                                b_sponsored: !factoryData.b_sponsored
                            });
                        }
                    }),
                    <span className="switch-label" data-on="YOU" data-off="THEM" />,
                    React.DOM.span({className: "switch-handle"})
                )
            )
        )
    }

    var FactoryLink = (factoryData: core.FactoryData) => {
        return React.DOM.div({},
            React.DOM.div({
                    className: 'text-overflow-ellipsis',
                    title: core.FormatFactoryUrl(factoryData)
                },
                core.FormatFactoryUrl(factoryData)
            ),
            ui.DOM.ZeroClipboard({
                className: 'url-copy',
                "data-clipboard-text": core.FormatFactoryUrl(factoryData),
                render: (state) => {
                    return React.DOM.a({},
                        (state.status === 'aftercopy') ?
                            "Copied!" :
                        (state.status === 'beforecopy' || state.status === 'copy') ?
                            'Copying...' :
                            'Copy URL'
                    )
                }
            })
        )
    }

    export class RoomConfigGear extends PureComponent<{identityId: string, roomId: string}> {
        public render() {
            var href = `/manage/prefix/${this.props.identityId}/${this.props.roomId}`;
            return <div>
                <div className="room-config">
                    <ui.NavLink preserveScroll={true} href={href}>
                        <i className="fa fa-cog" />
                    </ui.NavLink>
                </div>
            </div>
        }
    }

    export module DOM {
        export var InstrumentsList = React.createFactory(ui.InstrumentsList);
        export var InstrumentsListBridgeMap = React.createFactory(ui.InstrumentsListBridgeMap);
    }

}
