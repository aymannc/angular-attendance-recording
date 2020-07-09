import {Component, OnInit} from '@angular/core';
import {ElementApi} from '../../Data/ElementsResponse';
import {ApiService} from '../../Services/api.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {
  elements: {
    active: false,
    element: ElementApi,
  }[];

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.getElements();
  }

  private getElements() {
    this.elements = [];
    this.apiService.getProfessorsElements('ProfElementsProjection').subscribe(elements => {
      console.log(elements);
      elements.forEach(element => {
        this.elements.push({
          active: false,
          element,
        });
      });
    });
  }
}
