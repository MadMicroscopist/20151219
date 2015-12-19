/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {

    export interface WizardBackButton {
        text: string;
        callback: () => void;
    }

    export interface WizardPageTemplateProps {
        imageId: string;
        header: string;
        description: React.ReactNode;
        backButton?: WizardBackButton;
        children?: React.ReactNode;
        noStyleChildren?: boolean;
    }

    export class WizardPageTemplate extends PureComponent<WizardPageTemplateProps> {
        public render() {
            var backButton = this.props.backButton;
            return React.DOM.div({className: 'wizard-page'},
                React.DOM.div({className: 'container'},
                    React.DOM.div({className: 'back-button',
                            onClick: backButton && backButton.callback
                        },
                        React.DOM.div({className: backButton ? '' : 'hidden'},
                            React.DOM.i({className: 'pull-left fa fa-chevron-left'}),
                            React.DOM.div({className: 'text'}, backButton && backButton.text)
                        )
                    )
                ),
                React.DOM.div({className: 'section-img-wrapper'},
                    React.DOM.div({className: 'section-img', style: {backgroundImage: CDNBackgroundImage('/img/' + encodeURIComponent(this.props.imageId) + '.png')}})
                ),
                React.DOM.div({className: 'container'},
                    DOM.CenteredColumnTemplate({className: 'text-center'},
                        React.DOM.h1({className: 'roboto-slab'}, this.props.header),
                        React.DOM.div({className: 'text-left description'}, this.props.description),
                        !this.props.noStyleChildren && this.props.children
                    ),
                    this.props.noStyleChildren && this.props.children,
                    React.DOM.div({className: 'clearfix'}),
                    React.DOM.div({className: 'hidden-xs', style: {marginTop: 140}})
                )
            );
        }
    }

    export module DOM {
        export var WizardPageTemplate = React.createFactory(ui.WizardPageTemplate);
    }
}
