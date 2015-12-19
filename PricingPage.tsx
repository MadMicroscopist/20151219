/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="../accountdock.d.ts" />

// https://stripe.com/docs/checkout#integration-custom

module ui {
    var includesAttend = <span>
        Includes <a href="/attend" target="_blank">Attend</a>
    </span>

    var plans: Plans = {
        "trial": {
            header: "Trial",
            goodies: [
                "Send limit: 30 msg / day",
                "Trial",
            ],
        },
        "fixed-basic": {
            header: "Basic",
            goodies: [
                "3 Unlimited Tubes",
                "Personal use",
            ],
            amount: 900, description: 'Basic - 3 Tubes',
        },
        "fixed-pro": {
            header: "Pro", isMostPopular: true,
            goodies: [
                "40 Unlimited Tubes",
                "Professional use",
                includesAttend,
            ],
            amount: 4900, description: 'Pro - 40 Tubes',
        },
        "fixed-sumo": {
            header: "Sumo",
            goodies: [
                "120 Unlimited Tubes",
                "Business use",
                includesAttend,
            ],
            amount: 9900, description: 'Sumo - 120 Tubes',
        },
        "fixed-basic-annual": {
            header: "Basic",
            goodies: [
                "5 Unlimited Tubes",
                "Personal use",
            ],
            amount: 10800, description: 'Basic - 5 Tubes',
        },
        "fixed-pro-annual": {
            header: "Pro", isMostPopular: true,
            goodies: [
                "60 Unlimited Tubes",
                "Professional use",
                includesAttend,
            ],
            amount: 58800, description: 'Pro - 60 Tubes',
        },
        "fixed-sumo-annual": {
            header: "Sumo",
            goodies: [
                "200 Unlimited Tubes",
                "Business use",
                includesAttend,
            ],
            amount: 118800, description: 'Sumo - 200 Tubes',
        },
    }

    let monthlyPlanIds = [
        "trial",
        "fixed-basic",
        "fixed-pro",
        "fixed-sumo",
    ]

    let annualPlanIds = [
        "trial",
        "fixed-basic-annual",
        "fixed-pro-annual",
        "fixed-sumo-annual",
    ]

    export class PricingPageContainer extends FluxSimpleContainer {
        public stores = {
            agentStore: ui.App.agentStore,
        };
        public getState = () => ({
            agent: this.stores.agentStore.agent,
        });
        public state = this.getState();
        public render() {
            return <ui.PricingPage {...this.state}/>
        }
    }

    export interface PricingPageProps {
        agent: core.AgentData;
    }

    interface Plans {
        [key: string]: {
            amount?: number,
            description?: string,
            header?: string,
            isMostPopular?: boolean,
            goodies?: React.ReactNode[],
        }
    }

    export class PricingPage extends PureComponent<PricingPageProps> {
        private stripeHandler: StripeCheckout.StripeCheckoutHandler;
        public componentDidMount() {
            this.stripeHandler = StripeCheckout.configure({
                key: core.STRIPE_PUBLIC_KEY,
                name: 'Sameroom.io',
                image: CDNify('/img/same-o-matic.png'),
            });
        }
        public componentWillUnmount() {
            this.stripeHandler.close();
        }
        public state = {
            showSignin: false,
            showAreYouSure: false,
            afterLoginCallback: null as () => void,
            isAnnual: false,
        };
        private setIsAnnualFromProps(newProps: PricingPageProps) {
            if (newProps.agent) {
                let plan = resolveAlias(getAgentPlan(newProps.agent));
                let isAnnual = (plan != resolveAnnual(plan));
                this.setState({
                    isAnnual: isAnnual,
                });
            }
        }
        public componentWillMount() {
            this.setIsAnnualFromProps(this.props);
        }
        private componentWillReceiveProps(newProps: PricingPageProps) {
            if (newProps.agent) {
                var afterLoginCallback = this.state.afterLoginCallback;
                if (afterLoginCallback) {
                    afterLoginCallback();
                }
                this.setState({
                    showSignin: false,
                    afterLoginCallback: null,
                });
            }
        };
        private onUnsubscribeModal = () => {
            this.setState({
                showAreYouSure: true,
            })
        };
        private onUnsubscribe() {
            ui.App.actions.deleteSubscription();
        }
        private onChangePlan(stripePlanId: string) {
            ui.App.actions.putSubscription({ stripe_plan_id: stripePlanId } as core.PutSubscriptionData);
        }
        private onSubscribe(stripePlanId: string) {
            if (this.props.agent) {
                this.doSubscribe(stripePlanId);
            }
            else {
                this.setState({
                    showSignin: true,
                    afterLoginCallback: () =>
                        this.doSubscribe(stripePlanId),
                })
            }
        }
        private doSubscribe(stripePlanId: string, isRenew?: boolean) {
            var planInfo = plans[resolveAlias(stripePlanId)];
            if (!planInfo) {
                console.error("Wrong plan", stripePlanId);
                return;
            }
            let period = this.state.isAnnual ? "Year" : "Month";
            this.stripeHandler.open({
                token: (token: any) => {
                    ui.App.actions.putSubscription({ stripe_plan_id: stripePlanId, stripe_token: token } as core.PutSubscriptionData);
                },
                amount: planInfo.amount,
                description: planInfo.description,
                panelLabel: isRenew ? 'Update card for {{amount}} plan' : 'Subscribe {{amount}}/' + period,
            });
        }
        private setAnnual = (value: boolean) => {
            this.setState({
                isAnnual: value,
            })
        }
        private showSignin() {
            this.setState({
                showSignin: true,
                afterLoginCallback: null
            });
        }
        private showBilling(stripeCustomerId: string) {
            var handler = AccountDock.configure({
                key: core.ACCOUNTDOCK_KEY,
                customer: stripeCustomerId
            });
            handler.open();
        }
        public render() {
            var stripeCustomerId: string;
            var agent = this.props.agent;
            let {isAnnual, showSignin, showAreYouSure} = this.state;

            if (showSignin) {
                return <ui.SigninPageTemplate
                    urlPrefix="/pricing"
                    customText="In order to subscribe to this plan, you’ll need to sign in. This is easy, as you can use an existing service to do so. Start by selecting your primary chat platform, from the options below:"
                ></ui.SigninPageTemplate>;
            }

            let areYouSureModal = showAreYouSure && (
                <ui.FullScreenModal
                    title="Are You Sure?"
                    warning=""
                    buttonText="Yes, unsubscribe me."
                    onSure={() => {
                        this.onUnsubscribe();
                        this.setState({
                            showAreYouSure: false,
                        });
                    }}
                    onHide={() => {
                        this.setState({
                            showAreYouSure: false,
                        });
                    }}
                ></ui.FullScreenModal>
            );

            let plan = getAgentPlan(agent);

            if (agent && agent.payment_data.stripe_customer_id) {
                stripeCustomerId = agent && agent.payment_data.stripe_customer_id;
            }

            let planIds = isAnnual ? annualPlanIds : monthlyPlanIds;

            return <div className="pricing-page">
                {areYouSureModal}
                <br />
                <div className="container">
                    <div className="row">
                        <CenteredColumnTemplate className="text-center">
                            <div className="hidden-xs" style={{marginTop: 40}}></div>
                            <h1 className="roboto-slab">Pricing and Plans</h1>
                            <div className="hidden-xs" style={{marginTop: 20}}></div>
                            <div className="text-left description">
                                We offer rate-limited accounts free of charge—so you can try the service. Rate-limited accounts can send up to 30 messages per 24 hours across all connections (Tubes).
                                {stripeCustomerId && <div>
                                    <div className="hidden-xs" style={{marginTop: 20}}></div>
                                    <div>
                                        Thanks for being a customer since 2015! View your
                                        {" "}
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.showBilling(stripeCustomerId);
                                            }}
                                        >
                                            billing history</a>
                                        .
                                        {plan && <span>
                                            {" "}
                                            Update your
                                            {" "}
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    this.doSubscribe(plan, true);
                                                }}
                                            >
                                                payment info
                                            </a>
                                            .
                                        </span>}
                                    </div>
                                </div>}
                            </div>

                            <AnnualSwitch isAnnual={isAnnual} setAnnual={this.setAnnual}/>

                            <div className="hidden-xs" style={{marginTop: 60}}></div>
                        </CenteredColumnTemplate>
                    </div>
                    <div className="row">
                        {_.map(planIds, (planId) => {
                            var subscribedBorder = false;
                            if (planId != "trial") {
                                subscribedBorder = comparePlans(plan, planId).eq;
                            }
                            return <div
                                className="col-xs-6 col-md-3 tier"
                                key={planId}
                            >
                                <Header planId={planId} subscribedBorder={subscribedBorder} pricing={this}/>
                                <Price planId={planId} subscribedBorder={subscribedBorder} pricing={this}/>
                                <Goodies planId={planId} subscribedBorder={subscribedBorder} pricing={this}/>
                                <PlanButton planId={planId} subscribedBorder={subscribedBorder} pricing={this}/>
                            </div>
                        })}
                    </div>
                    <div className="hidden-xs" style={{marginBottom: 100}}></div>
                </div>
            </div>;
        }
    }

    class AnnualSwitch extends PureComponent<{
        isAnnual: boolean,
        setAnnual: (v: boolean) => void
    }> {
        public render() {
            let {isAnnual, setAnnual} = this.props;
            let btnClass = (value: boolean) => {
                return classNames("button", value ? "on" : "off");
            }
            return <div>
                <br/>
                <div className="annual-switch">
                    <div
                        className={btnClass(!isAnnual)}
                        onClick={() => setAnnual(false)}
                    >
                        Monthly
                    </div>
                    <div
                        className={btnClass(isAnnual)}
                        onClick={() => setAnnual(true)}
                    >
                        Annual
                    </div>
                </div>
                <br/>
            </div>
        }
    }

    interface PlanButtonProps {
        planId: string;
        subscribedBorder: boolean;
        pricing: PricingPage;
    }

    interface PlanButtonState {}

    class PlanButton extends React.Component<PlanButtonProps, PlanButtonState> {
        public render() {
            let {planId, subscribedBorder, pricing} = this.props;
            let {onUnsubscribeModal, onChangePlan, onSubscribe, showSignin} = pricing;
            let {agent} = pricing.props;

            let agentPlan = getAgentPlan(agent, agent ? "trial" : "no");

            let compare = comparePlans(agentPlan, planId);

            let className = classNames("plan text-center", subscribedBorder && "plan-subscribed");

            let setToPlanId = () => {
                if (planId == "trial") {
                    onUnsubscribeModal()
                } else {
                    onChangePlan(planId)
                }
            }

            let subscribeToPlanId = () => {
                if (planId == "trial") {
                    showSignin.bind(pricing)()
                } else {
                    onSubscribe.bind(pricing)(planId)
                }
            }

            let btn: React.ReactNode;
            if (compare.canDowngrade) {
                btn = <GrayButton onClick={setToPlanId}>
                    Downgrade
                </GrayButton>;
            } else if (compare.canUpgrade) {
                btn = <YellowButton onClick={setToPlanId}>
                    Upgrade
                </YellowButton>;
            } else if (compare.eq) { // before canSwitch
                btn = <div className="subscribed">
                    You are subscribed to this plan
                </div>;
            } else if (planId == "trial") { // after eq canDowngrade canUpgrade
                btn = <YellowButton onClick={subscribeToPlanId}>
                    Try
                </YellowButton>;
            } else if (compare.canSwitch) {
                btn = <YellowButton onClick={setToPlanId}>
                    Switch
                </YellowButton>;
            } else {
                btn = <YellowButton onClick={subscribeToPlanId}>
                    Buy
                </YellowButton>;
            }

            return <div className={className}>
                {btn}
            </div>;
        }
    }

    class GrayButton extends React.Component<React.HTMLProps, {}> {
        public render () {
            return <div className="downgrade text-center">
                <button className="btn btn-no-border btn-lg" {...this.props}/>
            </div>
        }
    }

    class YellowButton extends React.Component<React.HTMLProps, {}> {
        public render () {
            return <div className="buy text-center">
                <button className="btn btn-bold-yellow btn-no-border btn-lg" {...this.props}/>
            </div>
        }
    }

    class Price extends React.Component<PlanButtonProps, PlanButtonState> {
        public render() {
            let {planId, subscribedBorder, pricing} = this.props;
            let {isAnnual} = pricing.state;

            let price = (planAmount(planId) || 0)/100;
            let hundred = price > 99;
            let thousand = price > 999;

            let className = classNames("roboto-slab price amount text-center", subscribedBorder && "price-subscribed", hundred && "hundred", thousand && "thousand");
            return <p className={className}>
                <span className="dolla">$</span>
                <span className="amount">{price}</span>
                <span className="month">/{isAnnual ? "yr" : "mo"}.</span>
            </p>
        }
    }

    class Header extends React.Component<PlanButtonProps, PlanButtonState> {
        public render() {
            let {planId, subscribedBorder, pricing} = this.props;
            let planInfo = plans[planId];
            let popular = planInfo && planInfo.isMostPopular || false;
            let title = planInfo && planInfo.header || "Undefined";
            let className = classNames("roboto-slab text-center header", subscribedBorder && "header-subscribed", popular && "most-popular")
            return <div className={className}>
                <h3>{title}</h3>
            </div>
        }
    }

    class Goodies extends React.Component<PlanButtonProps, PlanButtonState> {
        public render() {
            let {planId, subscribedBorder, pricing} = this.props;
            let planInfo = plans[planId];
            let goodies = planInfo && planInfo.goodies || [];
            let className = classNames("goodies", subscribedBorder && "goodies-subscribed");
            return <div className={className}>
                <ul className="fa-ul">
                    {_.map(goodies, (node, i) => (
                        <li key={i}>
                            <i className="fa-li fa fa-check" />
                            {node}
                        </li>
                    ))}
                    {goodies.length < 3 && <li style={{visibility: 'hidden'}}>
                        <i className="fa-li fa fa-check" />
                        spacer
                    </li>}
                </ul>
            </div>
        }
    }

    function resolveAlias(plan: string) {
        if (plan == "pro") {
            return "fixed-basic";
        } else if (plan == "startup") {
            return "fixed-pro";
        } else {
            return plan;
        }
    }

    function resolveAnnual(plan: string) {
        if (plan) {
            let i = annualPlanIds.indexOf(plan);
            let mPlan = monthlyPlanIds[i];
            if (mPlan) {
                return mPlan;
            }
        }
        return plan;
    }

    function comparePlans(plan1: string, plan2: string) {
        let planA = resolveAlias(plan1);
        let planB = resolveAlias(plan2);
        let agentPlan = resolveAnnual(planA);
        let planId = resolveAnnual(planB);
        let res = {
            eq: planA == planB,
            canSwitch: agentPlan == planId,
            canUpgrade: canUpgrade(agentPlan, planId),
            canDowngrade: canDowngrade(agentPlan, planId),
        };
        return res;
    }

    function canUpgrade(agentPlan: string, planId: string) {
        if (planId == "trial" || agentPlan == "trial") {
            return false;
        }
        let amount1 = planAmount(agentPlan) || 0;
        let amount2 = planAmount(planId) || 0;
        return amount2 > amount1;
    }

    function canDowngrade(agentPlan: string, planId: string) {
        if (planId == "trial" && agentPlan != "trial" && agentPlan != "no") {
            return true;
        }
        let amount1 = planAmount(agentPlan) || 0;
        let amount2 = planAmount(planId) || 0;
        return amount2 < amount1;
    }

    function planAmount(plan: string) {
        return plans[plan] && plans[plan].amount;
    }

    function getAgentPlan(agent: core.AgentData, dflt?: string) {
        let plan = dflt;
        if (agent && agent.payment_data.stripe_plan_id) {
            plan = agent.payment_data.stripe_plan_id;
        }
        return plan;
    }

    export module DOM {
        export var PricingPageContainer = React.createFactory(ui.PricingPageContainer);
        export var PricingPage = React.createFactory(ui.PricingPage);
    }
}
