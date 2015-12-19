/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {

    export interface SigninPageTemplateProps {
        urlPrefix: string;
        customText?: string;
    }

    export class SigninPageTemplate extends PureComponent<SigninPageTemplateProps> {
        render() {
            var customText = this.props.customText;
            var text = customText ? customText : "In order to access this page, you have to sign in. You’ll need to select one of the Platforms you use for chat. Please choose from the options below:";
            return ui.DOM.WizardPageTemplate({
                    imageId: 'robot-welcome',
                    header: 'Sign In',
                    description: text,
                },
                ui.DOM.ProviderLogos({urlPrefix: this.props.urlPrefix, big: true})
            );
        }
    }

    export module DOM {
        export var SigninPageTemplate = React.createFactory(ui.SigninPageTemplate);
    }
}
