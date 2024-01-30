declare namespace Cypress {
  interface PrismZone {
    project: string;
    url: string;
    singleSite: boolean;
    hotspots: boolean;
    timeline: boolean;
    floors: boolean;
    adminUser: boolean;
  }

  interface Chainable<> {
    accessZone(zone: PrismZone): void;
  }
}
