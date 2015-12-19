module ui {

    export class AttendPageContainer extends FluxSimpleContainer {
        public stores = {
            agentStore: ui.App.agentStore,
            identitiesStore: ui.App.identitiesStore,
            attendPageStore: ui.App.attendPageStore,
        };
        public getState = () => ({
            agent: this.stores.agentStore.agent,
            identities: this.stores.identitiesStore.identities,
            attendConfig: this.stores.attendPageStore.attendConfig,
            status: this.stores.attendPageStore.status,
        });
        public state = this.getState();
        public render() {return <AttendPage {...this.state} />}
    }

    export interface AttendPageProps {
        agent: core.AgentData;
        identities: core.Identities;
        attendConfig: core.AttendConfig;
        status: core.RestRequestStatus;
    }

    export interface AttendPageState {
        showAreYouSureDeleteInstrument?: boolean;
        fullScreenModalProps?: FullScreenModalProps;
    }

    export class AttendPage extends PureRender<AttendPageProps, AttendPageState> {
        public render () {
            let {agent, identities, attendConfig, status} = this.props;

            if (!agent) {
            }

            let error = status == core.RestRequestStatus.Fail;

            let {
                backends,
                frontends,
                selectedBackend,
                selectedFrontends,
            } = attendConfig;

            let selectedBackends = selectedBackend ? [selectedBackend] : [];
            let c = core.AttendConfigAction;

            return <div className="attend-page">
                <div className="container">
                    <ui.CenteredColumnTemplate className="text-center">
                        <div className="hidden-xs" style={{marginTop: 70}}/>
                        <h1 className="roboto-slab">
                            Sameroom Attend
                        </h1>
                    </ui.CenteredColumnTemplate>
                    <ui.CenteredColumnTemplate>
                        <div className="description">
                            Connect your customer support accounts to team chat and respond to all questions from one place. For more info, see <a href="/faq#attend" target="_blank">FAQ</a>.
                        </div>
                        <br/>
                        {error && <div>
                            <div className="alert alert-danger" style={{fontSize: 16}}>
                                {MysteriousIssue()}
                            </div>
                            <br/>
                        </div>}

                        <ItemsWithTitle
                            title={agent ? "Step 1: Choose your team chat" : "Step 1: Add your team chat"}
                            selectorType="radio"
                            command={c.ChangeBackend}
                            selected={selectedBackends}
                            identities={backends}
                            addProviders={core.BackendProviders()}
                            agent={agent}
                        ></ItemsWithTitle>
                        <ItemsWithTitle
                            title="Step 2: Add customer support tools"
                            selectorType="checkbox"
                            command={c.ToggleFrontend}
                            selected={selectedFrontends}
                            disabled={!selectedBackend}
                            identities={frontends}
                            addProviders={core.FrontendProviders()}
                            agent={agent}
                        ></ItemsWithTitle>
                    </ui.CenteredColumnTemplate>
                </div>
                <div className="hidden-xs" style={{marginTop: 140}}/>
                <div className="clearfix"/>
            </div>;
        }
    }

    class ItemsWithTitle extends PureComponent<{
        selectorType: string;
        command: core.AttendConfigAction;
        title: string;
        selected: string[];
        disabled?: boolean;
        identities: core.IdentityData[];
        addProviders: string[];
        agent: core.AgentData;
    }> {
        public render() {
            let {selectorType, command, title, selected, disabled, identities, addProviders, agent} = this.props;
            let items = _.map(identities, (i) => {
                let {id, provider, email, common_name, unit_name, failed} = i;
                let title = core.ProviderDisplayName(provider);
                let checked = _.include(selected, id);

                let label = common_name;
                if (unit_name) {
                    label = `${unit_name}, ${email}`
                }
                return <tr key={id}>
                    <td className="selector">
                        <RadioInput
                            checked={checked}
                            selectorType={selectorType}
                            disabled={disabled}
                            onChange={(e) => {
                                ui.App.actions.attendConfigCommand(command, id);
                            }}
                        >
                            <span className="fadeOut" title={label}>
                                <ui.ProviderLogo
                                    providerId={provider}
                                    isBw={false}
                                    style={{title: title, alt: title, width: 20, height: 20}}
                                ></ui.ProviderLogo>
                                {label}
                            </span>
                        </RadioInput>
                    </td>
                    <td className="status">
                        <div>
                            Status: {failed ? "Failing" : "Active"}
                        </div>
                    </td>
                </tr>
            });
            let close: React.ReactNode;
            if (agent && selectorType == "radio") {
                close = <tr>
                    <td className="selector" colSpan={2}>
                        <RadioInput
                            checked={selected.length == 0}
                            selectorType={selectorType}
                            onChange={(e) => {
                                ui.App.actions.attendConfigCommand(core.AttendConfigAction.Disable, null);
                            }}
                        >
                            OFF
                        </RadioInput>
                    </td>
                </tr>;
            }

            let addId = core.randomString(10);
            let addIdentity = agent
                 ?
                <div className="add-identity">
                    <span id="collapse-button" className="collapsed" data-toggle="collapse" data-target={`#${addId}`}>
                    </span>
                    <span className="collapsed" data-toggle="collapse" data-target={`#${addId}`}>
                        Add
                    </span>
                    <div id={addId} className="collapse">
                        <ui.ProviderLogos
                            big={false}
                            urlPrefix="/attend"
                            onlyProviders={addProviders}
                            isColor={true} />
                    </div>
                </div>
                :
                <ui.ProviderLogos
                    big={false}
                    urlPrefix="/attend"
                    onlyProviders={addProviders}
                    isColor={true} />
                ;

            return <div className="items-with-title">
                <h2 className="roboto-slab">{title}</h2>
                <form className="awesome-checkbox">
                    <table className="table table-condensed">
                        <tbody>
                            {close}
                            {items}
                            <tr><td colSpan={2}>{addIdentity}</td></tr>
                            <tr><td colSpan={2}></td></tr>
                        </tbody>
                    </table>
                </form>
            </div>;
        }
    }

    class RadioInput extends PureComponent<{
        selectorType: string;
        checked: boolean;
        disabled?: boolean;
        onChange: React.FormEventHandler;
        children?: React.ReactNode;
    }> {
        public render () {
            let {selectorType, checked, disabled, onChange} = this.props;
            let id = core.randomString(10);
            return <div className={selectorType}>
                <input
                    id={id}
                    type={selectorType}
                    checked={checked}
                    disabled={disabled}
                    onChange={onChange} />
                <label htmlFor={id}>
                    {this.props.children}
                </label>
            </div>
        }
    }
}
