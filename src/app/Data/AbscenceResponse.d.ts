import {Href} from './APIDataClasses';

export interface AbscenceResponse {
  _embedded: Embedded;
  _links: SeanceResponseLinks;
}

export interface Embedded {
  abscences: Abscence[];
}

export interface Abscence {
  id: number;
  abscente: boolean;
  date: Date;
  image: null;
  statusJustif: boolean;
  statusVerification: boolean;
  _links: AbscenceLinks;
}

export interface AbscenceLinks {
  self: Href;
  abscence: Href;
  justification: Href;
  seance: Href;
  etudient: Href;
}

export interface SeanceResponseLinks {
  self: Href;
}
