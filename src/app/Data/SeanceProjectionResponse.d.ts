import {Href} from './APIDataClasses';
import {SeanceResponseLinks} from './AbscenceResponse';

export interface SeanceProjectionResponse {
  _embedded: SeanceProjectionEmbedded;
  _links: SeanceResponseLinks;
}

export interface SeanceProjectionEmbedded {
  seances: SeanceProjection[];
}

export interface SeanceProjection {
  id: number;
  heureFin: string;
  heureDebut: string;
  salle: SeanceProjectionSalle;
  elementName: string;
  elementId: number;
  jourSeance: string;
  _links: Links;
}

export interface Links {
  self: Href;
  seance: Href;
  professeur: Href;
  salle: Href;
  abscences: Href;
  element: Href;
}


export interface SeanceProjectionSalle {
  numero: number;
}
