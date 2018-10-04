import HotKeys from '../../../../assets/dev/js/utils/hot-keys';
import Helpers from './utils/helpers';
import Ajax from '../../modules/ajax/assets/js/ajax';

const ViewModule = require( 'elementor-utils/view-module' );

class ElementorCommonApp extends ViewModule {
	setMarionetteTemplateCompiler() {
		Marionette.TemplateCache.prototype.compileTemplate = ( rawTemplate, options ) => {
			options = {
				evaluate: /<#([\s\S]+?)#>/g,
				interpolate: /{{{([\s\S]+?)}}}/g,
				escape: /{{([^}]+?)}}(?!})/g,
			};

			return _.template( rawTemplate, options );
		};
	}

	getDefaultElements() {
		return {
			$window: jQuery( window ),
			$document: jQuery( document ),
			$body: jQuery( document.body ),
		};
	}

	initComponents() {
		this.helpers = new Helpers();

		this.hotKeys = new HotKeys();

		this.hotKeys.bindListener( this.elements.$window );

		this.dialogsManager = new DialogsManager.Instance();

		this.ajax = new Ajax();
	}

	translate( stringKey, templateArgs, i18nStack ) {
		if ( ! i18nStack ) {
			i18nStack = this.config.i18n;
		}

		let string = i18nStack[ stringKey ];

		if ( undefined === string ) {
			string = stringKey;
		}

		if ( templateArgs ) {
			string = string.replace( /%(?:(\d+)\$)?s/g, function( match, number ) {
				if ( ! number ) {
					number = 1;
				}

				number--;

				return undefined !== templateArgs[ number ] ? templateArgs[ number ] : match;
			} );
		}

		return string;
	}

	onInit() {
		super.onInit();

		this.config = elementorCommonConfig;

		this.setMarionetteTemplateCompiler();
	}
}

window.elementorCommon = new ElementorCommonApp();

elementorCommon.initComponents();