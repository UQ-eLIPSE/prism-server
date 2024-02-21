/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import classNames from "classnames";
import MinimapStyles from "../sass/partials/_minimap.module.scss";
import { NodeComponentProps } from "../interfaces/NodeData";
import ArrowIcon from "./ArrowIcon";

const ROTATION_STYLE_OFFSET = 360 - 225;
/**
 * NodeComponent renders a single node within the minimap, including its position,
 * selection state, and any special indicators like rotation or enlargement.
 * It also handles the click events to select a node.
 *
 * @param {NodeComponentProps} props - The properties passed to the NodeComponent.
 * @returns {JSX.Element} The rendered node component.
 */
const NodeComponent = ({
  index,
  node,
  selectedNode,
  y,
  x,
  yPosition,
  xPosition,
  MinimapProps,
  isMapEnlarged,
  configureRotation,
  handleNodeClick,
  isEditing,
}: NodeComponentProps): JSX.Element => {
  const getNodeStyle = (includeTransform = true) => {
    const isSelectedNode = node === selectedNode;
    return {
      top: `${isSelectedNode ? y : yPosition}%`,
      left: `${isSelectedNode ? x : xPosition}%`,
      transform: includeTransform ? configureRotation(node) : "none",
    };
  };
  return (
    <div
      key={index}
      className={node == selectedNode ? "currentSelectedNode" : ""}
    >
      <ArrowIcon
        showArrow={
          node.tiles_id === MinimapProps.currPanoId &&
          MinimapProps.config.enable.rotation
        }
        containerProps={{
          className: `${MinimapStyles.nodeArrowContainer} default-arrow`,
          style: getNodeStyle(false),
        }}
        iconProps={{
          style: {
            transform: `scale(1.5) translate(-5px) rotate(${ROTATION_STYLE_OFFSET}deg)`,
          },
        }}
      />
      <ArrowIcon
        showArrow={
          node.tiles_id === MinimapProps.currPanoId &&
          MinimapProps.config.enable.rotation
        }
        containerProps={{
          className: `${MinimapStyles.nodeArrowContainer} default-arrow`,
          style: getNodeStyle(false),
        }}
        iconProps={{
          className: "arrow",
          style: {
            transform: `scale(1.5)`,
            color: "red",
          },
        }}
      />

      <div
        className={MinimapStyles.nodeContainer}
        style={getNodeStyle()}
        key={node.tiles_id}
      >
        {node.tiles_id === MinimapProps.currPanoId &&
          MinimapProps.config.enable.rotation && (
            <div className="positionIndicator" />
          )}

        {node == selectedNode && <div className="positionIndicator selected" />}

        <div
          className={classNames(MinimapStyles.node, {
            [MinimapStyles.selectedNode]:
              node.tiles_id === MinimapProps.currPanoId,
            [MinimapStyles.unselectedNode]:
              node.tiles_id !== MinimapProps.currPanoId,
            [MinimapStyles.upscaled]: MinimapProps.minimapEnlarged,
            [MinimapStyles.scaled]: !MinimapProps.minimapEnlarged,
            [MinimapStyles.infoNode]: node.info_hotspots?.length ?? 0,
          })}
          key={node.tiles_id}
          id={node.tiles_id}
          onClick={(e): void => handleNodeClick(e, node)}
          data-cy={
            node.tiles_id === MinimapProps.currPanoId ? "selected-node" : "node"
          }
        />
      </div>
      {isMapEnlarged && (
        <div className={MinimapStyles.nodeTitle} style={getNodeStyle(false)}>
          {node.tiles_name}
        </div>
      )}
    </div>
  );
};

export default NodeComponent;
