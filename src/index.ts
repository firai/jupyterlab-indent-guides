import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  IEditorExtensionRegistry,
  EditorExtensionRegistry
} from '@jupyterlab/codemirror';

import { indentationMarkers } from '@replit/codemirror-indentation-markers';

interface IGuideExtentMapDict {
  [index: string]: 'fullScope' | 'codeOnly';
}
const guideExtentMap = {
  'Full scope': 'fullScope' as const,
  'Code only': 'codeOnly' as const
} as IGuideExtentMapDict;

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
          guideExtent: 'Full scope',
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
              guideExtent: string;
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
                markerType: guideExtentMap[indentGuideOptions.guideExtent],
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
              title: 'Highlight active block',
              description:
                'Use a different color for guide in the active block. Change the active block guide colors below. Disabling provides a performance enhancement, because guides do not need to be regenerated when the selection changes.'
            },
            hideFirstIndent: {
              type: 'boolean',
              title: 'Hide guide at the first column'
            },
            guideExtent: {
              title: 'Guide extent',
              enum: ['Full scope', 'Code only'],
              description:
                'How far the indentation guides extend. "Full scope" means guides extend down the full height of a scope. "Code only" means guides terminate at the last non-empty line in a scope.'
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
