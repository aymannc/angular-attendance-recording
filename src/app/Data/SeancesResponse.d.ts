import {Href} from './APIDataClasses';

export interface SeancesResponse {
  _embedded: SeancesResponseEmbedded;
  _links: SeancesResponseLinks;
  page: Page;
}

export interface SeancesResponseEmbedded {
  seances: Seance[];
}

export interface Seance {
  heureDebut: string;
  heureFin: string;
  jourSeance: string;
  jour: string | null;
  status: boolean;
  type: string;
  _links: SeanceLinks;
}

export interface SeanceLinks {
  self: Href;
  seance: LinksSeance;
  professeur: Href;
  abscences: Href;
  salle: Href;
  element: Href;
}


export interface LinksSeance {
  href: string;
  templated: boolean;
}


export interface SeancesResponseLinks {
  first: Href;
  self: Href;
  next: Href;
  last: Href;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
