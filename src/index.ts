import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  IEditorExtensionRegistry,
  EditorExtensionRegistry
} from '@jupyterlab/codemirror';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { indentationMarkers } from '@replit/codemirror-indentation-markers';

/**
 * Initialization data for the jupyterlab-indent-guides extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-indent-guides:plugin',
  description: 'Indentation guides for JupyterLab',
  autoStart: true,
  requires: [IEditorExtensionRegistry],
  optional: [ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    extensions: IEditorExtensionRegistry,
    settingRegistry: ISettingRegistry | null
  ) => {
    extensions.addExtension(
      Object.freeze({
        name: 'indent-guides',
        default: {
          highlightActiveBlock: true,
          hideFirstIndent: false,
          guideType: 'fullScope' as const,
          thickness: 1,
          colors: {
            light: '#bdbdbd',
            dark: '#616161',
            activeLight: '#1976d2',
            activeDark: '#1976d2'
          }
        },
        factory: () =>
          EditorExtensionRegistry.createConfigurableExtension(
            (indentGuideOptions: {
              highlightActiveBlock: boolean;
              hideFirstIndent: boolean;
              guideType: 'fullScope' | 'codeOnly' | undefined;
              thickness: number;
              colors: {
                light: string;
                dark: string;
                activeLight: string;
                activeDark: string;
              };
            }) =>
              indentationMarkers({
                highlightActiveBlock: indentGuideOptions.highlightActiveBlock,
                hideFirstIndent: indentGuideOptions.hideFirstIndent,
                markerType: indentGuideOptions.guideType,
                thickness: indentGuideOptions.thickness,
                colors: {
                  light: indentGuideOptions.colors.light,
                  dark: indentGuideOptions.colors.dark,
                  activeLight: indentGuideOptions.colors.activeLight,
                  activeDark: indentGuideOptions.colors.activeDark
                }
              })
          ),
        schema: {
          type: 'object',
          title: 'Indent guide options',
          properties: {
            thickness: {
              type: 'number',
              title: 'Thickness',
              default: 1
            }
          }
        }
      })
    );
    console.log('JupyterLab extension jupyterlab-indent-guides is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log(
            'jupyterlab-indent-guides settings loaded:',
            settings.composite
          );
        })
        .catch(reason => {
          console.error(
            'Failed to load settings for jupyterlab-indent-guides.',
            reason
          );
        });
    }
  }
};

export default plugin;
