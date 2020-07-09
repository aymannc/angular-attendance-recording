import {Href} from './APIDataClasses';

export interface ElementsResponse {
  _embedded: Embedded;
  _links: SeanceResponseLinks;
}

export interface Embedded {
  elements: ElementApi[];
}

export interface ElementApi {
  nomFiliere?: string;
  idElement?: number;
  nomElement?: string;
  description: null;
  nbrHeureCourant: number;
  nbrTotalHeure: number;
  _links: ElementLinks;
}

export interface ElementLinks {
  self: Href;
  element: Href;
  module: Href;
  professors: Href;
}

export interface SeanceResponseLinks {
  self: Href;
}
