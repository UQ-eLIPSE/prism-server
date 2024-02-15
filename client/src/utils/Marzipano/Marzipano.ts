// todo fix the Function type and any calls in this file
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
// Modified from Marzipano 0.9.1.

import * as Marzipano from "marzipano";
import { ISettings } from "../../typings/settings";
import {
  NodeData,
  LinkHotspot,
  InfoHotspot,
  InitialViewParameters,
  SurveyNode,
} from "../../interfaces/NodeData";

interface IScene {
  data: NodeData;
  scene: any;
  view: any;
}

export default class MarzipanoHelper {
  public sceneElements: NodeListOf<Element>;
  private updateCurrPano: Function;
  private getInfoHotspot: Function;
  public data: NodeData[];
  public scenes: IScene[];
  public viewer: any;
  public updateRotation: Function;
  private updateViewParams: Function;
  private changeInfoPanelOpen: Function;
  private initialRender: boolean;

  constructor(
    data: NodeData[],
    getInfoHotspot: Function,
    updateCurrPano: Function,
    updateRotation: Function,
    updateViewParams: Function,
    changeInfoPanelOpen: Function,
    config: ISettings,
    initialRender: boolean,
  ) {
    this.data = data;

    // Detect whether we are on a touch device.
    document.body.classList.add("no-touch");
    window.addEventListener("touchstart", function () {
      document.body.classList.remove("no-touch");
      document.body.classList.add("touch");
    });

    // Grab elements from DOM.
    const panoElement = document.querySelector("#pano");
    this.sceneElements = document.querySelectorAll("#sceneList .scene");
    this.getInfoHotspot = getInfoHotspot;
    this.updateCurrPano = updateCurrPano;
    this.updateRotation = updateRotation;
    this.updateViewParams = updateViewParams;
    this.changeInfoPanelOpen = changeInfoPanelOpen;
    this.initialRender = initialRender;

    const mouseViewMode = config.marzipano_mouse_view_mode;

    // Viewer options.
    const viewerOpts = {
      controls: {
        mouseViewMode: mouseViewMode,
      },
    };

    // Initialize viewer.
    this.viewer = new Marzipano.Viewer(panoElement, viewerOpts);
    const updateView = () => {
      this.updateRotation(this.viewer.view()._yaw);
      this.updateViewParams({
        yaw: this.viewer.view()._yaw,
        pitch: this.viewer.view()._pitch,
        fov: this.viewer.view()._fov,
      });
    };
    if (config.enable.rotation) {
      initialRender
        ? this.viewer.addEventListener("viewChange", updateView)
        : setTimeout(() => {
            this.viewer.addEventListener("viewChange", updateView);
          }, 1000);
    }

    // Create scenes.
    this.scenes = this.data.map((nodeData) => {
      const geometry = new Marzipano.CubeGeometry(nodeData.survey_node.levels);

      const limiter = Marzipano.RectilinearView.limit.traditional(
        nodeData.survey_node.face_size,
        (100 * Math.PI) / 180,
        (120 * Math.PI) / 180,
      );
      const view = new Marzipano.RectilinearView(
        nodeData.survey_node.initial_parameters,
        limiter,
      );

      const scene = this.viewer.createScene({
        source: Marzipano.ImageUrlSource.fromString(
          // THIS IS NOT A FIX - Permenant solution needs to be made with file management.
          config.display.title === "Boomaroo Nurseries"
            ? nodeData.survey_node.manta_link +
                nodeData.minimap_node.tiles_id +
                "/{z}/{f}/{y}/{x}.jpg"
            : nodeData.survey_node.manta_link +
                nodeData.minimap_node.tiles_id +
                "/{z}/{f}/{y}/{x}.jpg",
          {
            cubeMapPreviewUrl:
              config.display.title === "Boomaroo Nurseries"
                ? nodeData.survey_node.manta_link +
                  nodeData.minimap_node.tiles_id +
                  "/preview.jpg"
                : nodeData.survey_node.manta_link +
                  nodeData.minimap_node.tiles_id +
                  "/preview.jpg",
          },
        ),
        geometry: geometry,
        view: view,
        pinFirstLevel: true,
      });

      // Create link hotspots.
      nodeData.survey_node.link_hotspots.forEach((hotspot) => {
        const element = this.createLinkHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(element, {
          yaw: hotspot.yaw,
          pitch: hotspot.pitch,
        });
      });

      // Create info hotspots.
      nodeData.survey_node.info_hotspots.forEach((hotspot) => {
        const element = this.createInfoHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(element, {
          yaw: hotspot.yaw,
          pitch: hotspot.pitch,
        });
      });

      return {
        data: nodeData,
        scene: scene,
        view: view,
      };
    });
  }

  public switchScene(scene: any): void {
    this.changeInfoPanelOpen(false);
    scene.view.setParameters(scene.data.survey_node.initial_parameters);
    scene.scene.switchTo();

    this.updateCurrPano(scene.data.minimap_node.tiles_id);
    this.updateSceneList(scene);

    // Gets the marzipano viewer div element
    const marzipanoContainer = document.getElementById("pano");

    // Deletes all non-active div and canvas child nodes after 1 second of changing scene.
    setTimeout(() => {
      if (marzipanoContainer) {
        // Gets the required canvas and div child nodes.
        const requiredCanvas = Array.from(
          marzipanoContainer.querySelectorAll("canvas"),
        ).slice(-2);
        const requiredDiv = Array.from(
          marzipanoContainer.querySelectorAll(":scope > div"),
        ).slice(-2);

        // Deletes all child elements of the Marzipano viewer div.
        marzipanoContainer.childNodes.forEach((node) => {
          node.remove();
        });

        // Adds the reqired canvas and div elements for the Marzipano div.
        if (requiredCanvas && requiredDiv) {
          marzipanoContainer.append(...requiredCanvas, ...requiredDiv);
        }
      }
    }, 1000);
  }

  private updateSceneList(scene: any): void {
    for (let i = 0; i < this.sceneElements.length; i++) {
      const el = this.sceneElements[i];
      if (el.getAttribute("data-id") === scene.data.id) {
        el.classList.add("current");
      } else {
        el.classList.remove("current");
      }
    }
  }

  private createLinkHotspotElement(hotspot: LinkHotspot): HTMLDivElement {
    // Create wrapper element to hold icon and tooltip.
    const wrapper = document.createElement("div");
    wrapper.classList.add("hotspot");
    wrapper.classList.add("link-hotspot");

    // Create image element.
    const icon = document.createElement("img");
    icon.src = "/img/link.png";
    icon.classList.add("link-hotspot-icon");

    // Add click event handler.
    wrapper.addEventListener("click", () => {
      // Add timeout to allow time for menu animation to occur (menu to close if needed)
      setTimeout(() => {
        this.switchScene(this.findSceneById(hotspot.target));
      }, 400);
    });

    // Prevent touch and scroll events from reaching the parent element.
    // This prevents the view control logic from interfering with the hotspot.
    this.stopTouchAndScrollEventPropagation(wrapper);

    // Create tooltip element.
    const tooltip = document.createElement("div");
    tooltip.classList.add("hotspot-tooltip");
    tooltip.classList.add("link-hotspot-tooltip");

    const targetScene = this.findSceneDataById(hotspot.target);
    if (!targetScene) throw new Error("Could not find scene");
    tooltip.innerHTML = targetScene.survey_node.tiles_name;

    wrapper.appendChild(icon);
    wrapper.appendChild(tooltip);

    return wrapper;
  }

  private createInfoHotspotElement(hotspot: InfoHotspot): HTMLDivElement {
    // Create wrapper element to hold icon and tooltip.
    const wrapper = document.createElement("div");
    wrapper.onclick = (): void => {
      this.getInfoHotspot(hotspot.info_id);
    };
    wrapper.classList.add("hotspot");
    wrapper.classList.add("info-hotspot");

    // Create hotspot/tooltip header.
    const header = document.createElement("div");
    header.classList.add("info-hotspot-header");
    header.classList.add("tests");

    // Place header and text into wrapper element.
    wrapper.appendChild(header);
    // wrapper.appendChild(text);

    // Create a modal for the hotspot content to appear on mobile mode.
    const modal = document.createElement("div");
    modal.innerHTML = wrapper.innerHTML;
    modal.classList.add("info-hotspot-modal");
    document.body.appendChild(modal);

    // Prevent touch and scroll events from reaching the parent element.
    // This prevents the view control logic from interfering with the hotspot.
    this.stopTouchAndScrollEventPropagation(wrapper);

    return wrapper;
  }

  // Prevent touch and scroll events from reaching the parent element.
  private stopTouchAndScrollEventPropagation(element: any): void {
    const eventList = [
      "touchstart",
      "touchmove",
      "touchend",
      "touchcancel",
      "wheel",
      "mousewheel",
    ];
    for (let i = 0; i < eventList.length; i++) {
      element.addEventListener(eventList[i], function (event: any) {
        event.stopPropagation();
      });
    }
  }

  public findSceneById(id: string): IScene | undefined {
    return (this.scenes || []).find((s) => s.data.survey_node.tiles_id === id);
  }

  public findSceneDataById(id: string): NodeData | undefined {
    return (this.data || []).find((s) => s.survey_node.tiles_id === id);
  }

  public findNameById(id: string): string | undefined {
    return (this.data || []).find((s) => s.survey_node.tiles_id === id)
      ?.survey_node?.tiles_name;
  }

  public findLinkNodesById(id: string): SurveyNode[] | undefined {
    // Find link hotspots via given id and check exists
    const linkHotspotTargets: LinkHotspot[] = this.data.find(
      (s) => s.survey_node.tiles_id === id,
    )!.survey_node.link_hotspots!;
    if (!linkHotspotTargets) throw new Error("Could not find link hotspots.");

    // From hotspot array, find corrosponding survey nodes and check exists
    const surveyHotspots: any = (linkHotspotTargets || []).map(
      ({ target }) => this.findSceneDataById(target)?.survey_node,
    );
    if (!surveyHotspots) throw new Error("Could not find survey nodes.");

    // Return array of survey nodes
    return surveyHotspots;
  }

  public findInfoNodesById(id: string): InfoHotspot[] | undefined {
    // Find info hotspots via given id and check exists
    const infoHotspotTargets: InfoHotspot[] | undefined = (
      this.data || []
    ).find((s) => s.survey_node.tiles_id === id)?.survey_node?.info_hotspots;
    if (!infoHotspotTargets) throw new Error("Could not find info hotspots.");
    // Return array of survey nodes
    return infoHotspotTargets;
  }

  public updateCurrView(params: InitialViewParameters, scene: any): void {
    scene.view.setParameters(params);
  }

  public panUpdateCurrView(params: InitialViewParameters, scene: any): void {
    // Add 1.5 second transition period
    const options = {
      transitionDuration: 1500,
    };

    // Look to a specific scene given a set of params and options (transitionDuration)
    scene.scene.lookTo(params, options);
  }
}
