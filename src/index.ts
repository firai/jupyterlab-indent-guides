import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  IEditorExtensionRegistry,
  EditorExtensionRegistry
} from '@jupyterlab/codemirror';

import { indentationMarkers } from '@replit/codemirror-indentation-markers';

interface IGuideTypeDict {
  [index: string]: 'fullScope' | 'codeOnly';
}
const guideTypeMap = {
  'Full scope': 'fullScope' as const,
  'Code only': 'codeOnly' as const
} as IGuideTypeDict;

/**
 * Initialization data for the jupyterlab-indent-guides extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-indent-guides:plugin',
  description: 'Indentation guides for JupyterLab',
  autoStart: true,
  requires: [IEditorExtensionRegistry],
  activate: (app: JupyterFrontEnd, extensions: IEditorExtensionRegistry) => {
    extensions.addExtension(
      Object.freeze({
        name: 'indent-guides',
        default: {
          highlightActiveBlock: true,
          hideFirstIndent: false,
          guideType: 'Full scope',
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
              guideType: string;
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
                markerType: guideTypeMap[indentGuideOptions.guideType],
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
            highlightActiveBlock: {
              type: 'boolean',
              title: 'Highlight active block'
            },
            hideFirstIndent: {
              type: 'boolean',
              title: 'Hide guide for first indentation level'
            },
            guideType: {
              title: 'Guide type',
              enum: ['Full scope', 'Code only']
            },
            thickness: {
              type: 'number',
              title: 'Thickness'
            },
            colors: {
              title: 'Colors',
              type: 'object',
              properties: {
                light: {
                  type: 'string',
                  title: 'Light theme typical guide color',
                  description: 'Color of typical guides for light themes'
                },
                activeLight: {
                  type: 'string',
                  title: 'Light theme active block guide color',
                  description:
                    'Color of guides for the active block for light themes'
                },
                dark: {
                  type: 'string',
                  title: 'Dark theme typical guide color',
                  description: 'Color of typical guides for dark themes'
                },
                activeDark: {
                  type: 'string',
                  title: 'Dark theme active block guide color',
                  description:
                    'Color of guides for the active block for dark themes'
                }
              }
            }
          }
        }
      })
    );
    console.log('JupyterLab extension jupyterlab-indent-guides is activated!');
  }
};

export default plugin;
