import { MinimapProps } from "./MiniMap/MinimapProps";
import { NewNode } from "./MiniMap/NewNode";

export interface NodeData {
  floor: number;
  survey_node: SurveyNode;
  minimap_node: MinimapNode;
  x: number;
  y: number;
}

export interface SurveyNode {
  tiles_id: string;
  tiles_name: string;
  levels: Level[];
  face_size: number;
  survey_name: string;
  initial_parameters: InitialViewParameters;
  link_hotspots: LinkHotspot[];
  info_hotspots: InfoHotspot[];
  manta_link: string;
}

export interface SurveyDate {
  survey_name: string;
  date: Date;
}

export interface SurveyMonth {
  monthName: string;
  dates: SurveyDate[];
}

export interface MinimapNode {
  id: string;
  node_number: 0;
  tiles_id: string;
  floor_id: string;
  floor: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  survey_node: any;
}

export interface MarziSettings {
  mouseViewMode: string;
  autorotateEnabled: boolean;
  fullscreenButton: boolean;
  viewControlButtons: boolean;
}

export interface Level {
  tileSize: number;
  size: number;
  fallbackOnly?: boolean;
}

export interface InitialViewParameters {
  yaw: number;
  pitch: number;
  fov: number;
}

export interface LinkHotspot {
  yaw: number;
  pitch: number;
  rotation: number;
  target: string;
}

export interface InfoHotspot {
  yaw: number;
  pitch: number;
  title: string;
  id: number;
  info_id: string;
}

/**
 * Props for the NodeCollection component.
 * @typedef {Object} NodeCollectionProps
 * @property {NewNode[]} nodeData - Array of node data to be displayed.
 * @property {NewNode|null} selectedNode - The node currently selected, if any.
 * @property {MinimapProps} MinimapProps - Props related to the minimap configuration.
 * @property {(node: NewNode) => string} configureRotation - Function to configure the rotation of nodes.
 * @property {number} x - The x coordinate for positioning the selected node.
 * @property {number} y - The y coordinate for positioning the selected node.
 * @property {(e: React.MouseEvent<HTMLDivElement, MouseEvent>, node: NewNode) => void} handleNodeClick - Function to handle click events on nodes.
 */
export interface NodeCollectionProps {
  renderData: NewNode[];
  selectedNode: NewNode | null;
  MinimapProps: MinimapProps;
  configureRotation: (node: NewNode) => string;
  x: number;
  y: number;
  handleNodeClick: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    node: NewNode,
  ) => void;
}

/**
 * Props for the NodeComponent.
 * @typedef {Object} NodeComponentProps
 * @property {number} index - The index of the node in the collection.
 * @property {NewNode} node - The current node data.
 * @property {NewNode|null} selectedNode - The node currently selected, if any.
 * @property {number} y - The y coordinate for the selected node.
 * @property {number} x - The x coordinate for the selected node.
 * @property {number} yPosition - The y position for the node, adjusted for scaling.
 * @property {number} xPosition - The x position for the node, adjusted for scaling.
 * @property {MinimapProps} MinimapProps - Props related to the minimap configuration.
 * @property {boolean} isMapEnlarged - Flag indicating if the minimap is enlarged.
 * @property {(node: NewNode) => string} configureRotation - Function to configure the rotation of the node.
 * @property {(e: React.MouseEvent<HTMLDivElement, MouseEvent>, node: NewNode) => void} handleNodeClick - Function to handle click events on the node.
 */
export interface NodeComponentProps {
  index: number;
  node: NewNode;
  selectedNode: NewNode | null;
  y: number;
  x: number;
  yPosition: number;
  xPosition: number;
  MinimapProps: MinimapProps;
  isMapEnlarged: boolean;
  configureRotation: (node: NewNode) => string;
  handleNodeClick: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    node: NewNode,
  ) => void;
}
