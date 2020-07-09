import {Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {ApiService} from '../../../Services/api.service';
import {ActivatedRoute} from '@angular/router';
import {ElementApi} from '../../../Data/ElementsResponse';

@Component({
  selector: 'app-upcoming-sessions',
  templateUrl: './upcoming-sessions.component.html',
  styleUrls: ['./upcoming-sessions.component.css']
})
export class UpcomingSessionsComponent implements OnInit {
  i = 1;
  editCache = {};
  dataSet = [];
  dateFormat = 'dd.MM.YYYY';
  elementId: number;
  pageLoading: boolean;
  element: ElementApi;
  notFound: boolean;

  constructor(private message: NzMessageService, private apiService: ApiService, private route: ActivatedRoute) {
  }

  startEdit(key: string): void {
    this.editCache[key].edit = true;
  }

  cancelEdit(key: string): void {
    this.editCache[key].edit = false;
  }

  saveEdit(key: string): void {
    const index = this.dataSet.findIndex(item => item.key === key);
    this.dataSet[index] = this.editCache[key].data;
    this.editCache[key].edit = false;
  }

  updateEditCache(): void {
    this.dataSet.forEach(item => {
      if (!this.editCache[item.key]) {
        this.editCache[item.key] = {
          edit: false,
          data: item
        };
      }
    });
  }

  ngOnInit(): void {
    this.updateEditCache();
    this.checkForElement();
  }

  createMessage(type: string): void {
    this.message.create(type, `Notification successfully sent to students`);
  }

  private getData() {
    this.apiService.getSeancesGreaterThanToday(this.elementId).subscribe(response => {
      console.log(response);
    });
  }

  private checkForElement() {
    this.pageLoading = true;
    this.elementId = this.route.snapshot.params.id;
    this.apiService.getElement(null, this.elementId).subscribe(element => {
      this.pageLoading = false;
      this.element = element;
      this.getData();
    }, error => {
      this.message.error('error');
      this.pageLoading = false;
      this.notFound = true;
    });
  }
}
