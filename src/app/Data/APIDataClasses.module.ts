class Utilisateurs {
  utilisateurs: User[];
}

export class UtilisateursResponse {
  // tslint:disable-next-line:variable-name
  _embedded: Utilisateurs;
  // tslint:disable-next-line:variable-name
  _links: UserResponseLinks;
  page: Page;
}

export class UserResponseLinks {
  first: Href;
  self: Href;
  next: Href;
  last: Href;
  profile: Href;
}

export class Href {
  href: string;
}

export class UserPostData {
  public type!: string;
  public email!: string;
  public motDePass!: string;
  public prenom!: string;
  public nom!: string;
  public gender!: string;
  public dateNaissance!: string;
  public tele!: string;
  public adresse!: string;
  public cin!: string;
  public cne?: string;
  public departement!: string;
  public filiere?: string;
  public semester?: string;

  constructor(type: string, email: string, motDePass: string, prenom: string, nom: string, gender: string, dateNaissance: string,
              tele: string, adresse: string, cin: string, cne: string, departement: string, filiere: string, semester: string) {
    this.type = type;
    this.email = email;
    this.motDePass = motDePass;
    this.prenom = prenom;
    this.nom = nom;
    this.gender = gender;
    this.dateNaissance = dateNaissance;
    this.tele = tele;
    this.adresse = adresse;
    this.cin = cin;
    this.cne = cne;
    this.departement = departement;
    this.filiere = filiere;
    this.semester = semester;
  }

  // public profileImageId: number;
}

export class User {
  public idUtilisateur: number;
  public email: string;
  public motDePass: string;
  public nomUtilisateur: string;
  public gender: string;
  public perssone: Person;
  public profileImage: Image;
  public type: string;
  public complaints: Complaint[];
  // tslint:disable-next-line:variable-name
  public _links: UserLinks;
}

class ImageLink {
  self: Href;
  image: Href;
  etudient: Href;

}

export class Image {
  path: string;
  slug!: string;
  verified: boolean;
  date: string;
  // tslint:disable-next-line:variable-name
  _links: ImageLink;
}

export class Person {
  id: number;
  adresse: string;
  cin: string;
  dateNaissance: string;
  nom: string;
  prenom: string;
  tele: string;
  cne?: string;
  departement: Departement;
  filiere?: Filiere;
  semester?: Semester;
  seances?: Seance[];
  images?: Image[];
  // tslint:disable-next-line:variable-name
  _links?: PersonLink;
}

export class Seance {
  heureDebut: string;
  heureFin: string;
  jourSeance: string;
  status: boolean;
  type: string;
  // tslint:disable-next-line:variable-name
  _links: SeanceLinks;
}

export class SeanceLinks {
  self: Href;
  seance: Href;
  salle: Href;
  professeur: Href;
  abscences: Href;
  element: Href;
}


export class PersonLink {
  semesstre?: Href | null;
  filiere?: Href | null;
  seances?: Href[] | null;
  departement: Href;
  images?: Href[];
}


export class UserLinks {
  self: Href;
  utilisateur: Href;
  calendrieMaintenances: Href;
  reclamations: Href;
  profileImage: Href;
}

export class Complaint {

  public objet: Objet;
  public contenu: string;

  public statut: boolean;

  public titre: null;

  // tslint:disable-next-line:variable-name
  public _links: ComplaintLinks;

}

export class ComplaintLinks {
  self: Href;
  reclamation: Href;
  source: Href;
  destinataire: Href;
}

export class Objet {
  type: string;
  // tslint:disable-next-line:variable-name
  _links: ObjetLinks;
}

export class ObjetLinks {
  self: Href;
  objet: Href;
  reclamations: Href;
}

export class Semester {
  nom: string;
  // tslint:disable-next-line:variable-name
  _links: SemesterLinks;
}

export class SemesterLinks {
  self: Href;
  semesstre: Href;
  modules: Href;
  anneeUnivirsitaire: Href;
}

export class Departement {
  nomDepartement: string;
  abrDepartement: string;
  // tslint:disable-next-line:variable-name
  _links: DepartementLinks;
}

export class DepartementLinks {
  self: Href;
  departement: Href;
  filieres: Href;
  professeurs: Href;
}

export class Filiere {
  nomFiliere: string;
  abrFiliere: string;
  dateCreation: string;
  // tslint:disable-next-line:variable-name
  _links: FiliereLinks;
}

export class FiliereLinks {
  self: Href;
  filiere: Href;
  modules: Href;
  departement: Href;
  etudients: Href;
}

export interface CamerasResponse {
  _embedded: Embedded;
  _links: CamerasResponse;
  page: Page;
}

export interface Embedded {
  cameras?: (Camera)[] | null;
}

export interface Camera {
  ip: string;
  model: string;
  _links: CameraLink;
}

export interface CamerasLink {
  self: Href;
  camera: Href;
  calendrieMaintenances: Href;
  statuts: Href;
  salle: Href;
}

export interface Href {
  href: string;
}

export interface CameraLink {
  self: Href;
  profile: Href;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
