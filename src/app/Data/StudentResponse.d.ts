import {Href} from './APIDataClasses';

export interface StudentResponse {
  id: number;
  adresse: string;
  cin: string;
  dateNaissance: Date;
  nom: string;
  prenom: string;
  tele: string;
  cne: string;
  _links: Links;
}

export interface Links {
  self: Href;
  etudient: Href;
  abscences: Href;
  semesstre: Href;
  images: Href;
  departement: Href;
  filiere: Href;
}

